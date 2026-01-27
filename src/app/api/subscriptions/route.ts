import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/client'

// GET /api/subscriptions - Get all school subscriptions
export async function GET(request: NextRequest) {
    try {
        const supabase = createServerClient()

        const searchParams = request.nextUrl.searchParams
        const status = searchParams.get('status')
        const plan = searchParams.get('plan')
        const search = searchParams.get('search')
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')

        let query = supabase
            .from('schools')
            .select(`
                id,
                name,
                slug,
                email,
                subscription_plan,
                subscription_status,
                subscription_expires_at,
                max_students,
                max_staff,
                created_at,
                updated_at
            `, { count: 'exact' })

        // Apply filters
        if (status && status !== 'all') {
            query = query.eq('subscription_status', status)
        }

        if (plan && plan !== 'all') {
            query = query.eq('subscription_plan', plan)
        }

        if (search) {
            query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`)
        }

        // Pagination
        const from = (page - 1) * limit
        const to = from + limit - 1
        query = query.range(from, to).order('subscription_expires_at', { ascending: true })

        const { data: subscriptions, error, count } = await query

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Calculate subscription metrics
        const { data: allSchools } = await supabase
            .from('schools')
            .select('subscription_plan, subscription_status')

        const metrics = {
            totalRevenue: 0,
            activeSubscriptions: 0,
            expiringThisMonth: 0,
            planBreakdown: {
                basic: 0,
                standard: 0,
                premium: 0,
                enterprise: 0
            }
        }

        const planPrices = {
            basic: 5000,
            standard: 15000,
            premium: 35000,
            enterprise: 75000
        }

        allSchools?.forEach(school => {
            const plan = school.subscription_plan as keyof typeof planPrices
            if (school.subscription_status === 'active') {
                metrics.activeSubscriptions++
                metrics.totalRevenue += planPrices[plan] || 0
            }
            if (plan in metrics.planBreakdown) {
                metrics.planBreakdown[plan]++
            }
        })

        // Count expiring this month
        const endOfMonth = new Date()
        endOfMonth.setMonth(endOfMonth.getMonth() + 1)
        endOfMonth.setDate(0)

        const { count: expiringCount } = await supabase
            .from('schools')
            .select('*', { count: 'exact', head: true })
            .lte('subscription_expires_at', endOfMonth.toISOString())
            .gte('subscription_expires_at', new Date().toISOString())
            .eq('subscription_status', 'active')

        metrics.expiringThisMonth = expiringCount || 0

        return NextResponse.json({
            subscriptions,
            metrics,
            pagination: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil((count || 0) / limit)
            }
        })
    } catch (error) {
        console.error('Subscriptions fetch error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST /api/subscriptions - Record a subscription payment
export async function POST(request: NextRequest) {
    try {
        const supabase = createServerClient()
        const body = await request.json()

        const { school_id, plan, amount, payment_method, notes } = body

        if (!school_id || !plan || !amount) {
            return NextResponse.json(
                { error: 'School ID, plan, and amount are required' },
                { status: 400 }
            )
        }

        // Calculate new expiration date (1 month from now or from current expiration)
        const { data: school } = await supabase
            .from('schools')
            .select('subscription_expires_at')
            .eq('id', school_id)
            .single()

        let newExpiration = new Date()
        if (school?.subscription_expires_at) {
            const currentExpiration = new Date(school.subscription_expires_at)
            if (currentExpiration > new Date()) {
                newExpiration = currentExpiration
            }
        }
        newExpiration.setMonth(newExpiration.getMonth() + 1)

        // Update school subscription
        const planLimits = {
            basic: { max_students: 100, max_staff: 20 },
            standard: { max_students: 500, max_staff: 50 },
            premium: { max_students: 2000, max_staff: 200 },
            enterprise: { max_students: -1, max_staff: -1 }
        }

        const limits = planLimits[plan as keyof typeof planLimits] || planLimits.basic

        const { error: updateError } = await supabase
            .from('schools')
            .update({
                subscription_plan: plan,
                subscription_status: 'active',
                subscription_expires_at: newExpiration.toISOString(),
                max_students: limits.max_students,
                max_staff: limits.max_staff,
                updated_at: new Date().toISOString()
            })
            .eq('id', school_id)

        if (updateError) {
            return NextResponse.json({ error: updateError.message }, { status: 500 })
        }

        // Record payment in subscription_payments table (if exists)
        try {
            await supabase
                .from('subscription_payments')
                .insert({
                    school_id,
                    plan,
                    amount,
                    payment_method: payment_method || 'bank_transfer',
                    status: 'completed',
                    notes,
                    paid_at: new Date().toISOString()
                })
        } catch {
            // Table might not exist
        }

        return NextResponse.json({
            success: true,
            message: 'Subscription updated successfully',
            newExpiration: newExpiration.toISOString()
        })
    } catch (error) {
        console.error('Subscription payment error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
