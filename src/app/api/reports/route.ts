import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/client'

// GET /api/reports - Get available reports and their data
export async function GET(request: NextRequest) {
    try {
        const supabase = createServerClient()

        const searchParams = request.nextUrl.searchParams
        const reportType = searchParams.get('type')

        // Get summary statistics
        const { count: totalSchools } = await supabase
            .from('schools')
            .select('*', { count: 'exact', head: true })

        const { count: totalUsers } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })

        // Get users by role
        const { data: usersByRole } = await supabase
            .from('users')
            .select('role')

        const roleCounts: Record<string, number> = {}
        usersByRole?.forEach(u => {
            roleCounts[u.role] = (roleCounts[u.role] || 0) + 1
        })

        // Get schools by plan
        const { data: schoolsByPlan } = await supabase
            .from('schools')
            .select('subscription_plan')

        const planCounts: Record<string, number> = {}
        schoolsByPlan?.forEach(s => {
            planCounts[s.subscription_plan] = (planCounts[s.subscription_plan] || 0) + 1
        })

        // Get schools by city
        const { data: schoolsByCity } = await supabase
            .from('schools')
            .select('city')

        const cityCounts: Record<string, number> = {}
        schoolsByCity?.forEach(s => {
            if (s.city) {
                cityCounts[s.city] = (cityCounts[s.city] || 0) + 1
            }
        })

        // Get monthly registration trend (last 6 months)
        const monthlyTrend = []
        for (let i = 5; i >= 0; i--) {
            const date = new Date()
            date.setMonth(date.getMonth() - i)
            const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
            const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)

            const { count } = await supabase
                .from('schools')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', startOfMonth.toISOString())
                .lte('created_at', endOfMonth.toISOString())

            monthlyTrend.push({
                month: date.toLocaleString('default', { month: 'short' }),
                year: date.getFullYear(),
                count: count || 0
            })
        }

        // Calculate revenue estimates
        const planPrices = {
            basic: 5000,
            standard: 15000,
            premium: 35000,
            enterprise: 75000
        }

        let estimatedMonthlyRevenue = 0
        schoolsByPlan?.forEach(s => {
            const plan = s.subscription_plan as keyof typeof planPrices
            estimatedMonthlyRevenue += planPrices[plan] || 0
        })

        // Available report templates
        const reportTemplates = [
            {
                id: 'schools-overview',
                name: 'Schools Overview',
                description: 'Complete list of all registered schools with details',
                type: 'schools',
                format: ['csv', 'pdf'],
                lastGenerated: null
            },
            {
                id: 'subscription-report',
                name: 'Subscription Report',
                description: 'Subscription status and revenue analysis',
                type: 'subscriptions',
                format: ['csv', 'pdf'],
                lastGenerated: null
            },
            {
                id: 'user-activity',
                name: 'User Activity Report',
                description: 'User login and activity statistics',
                type: 'users',
                format: ['csv', 'pdf'],
                lastGenerated: null
            },
            {
                id: 'revenue-report',
                name: 'Revenue Report',
                description: 'Monthly and yearly revenue breakdown',
                type: 'revenue',
                format: ['csv', 'pdf', 'excel'],
                lastGenerated: null
            },
            {
                id: 'growth-report',
                name: 'Growth Report',
                description: 'Platform growth metrics and trends',
                type: 'growth',
                format: ['pdf'],
                lastGenerated: null
            }
        ]

        return NextResponse.json({
            summary: {
                totalSchools: totalSchools || 0,
                totalUsers: totalUsers || 0,
                estimatedMonthlyRevenue,
                totalStudents: roleCounts['student'] || 0,
                totalTeachers: roleCounts['teacher'] || 0,
                totalParents: roleCounts['parent'] || 0,
            },
            breakdown: {
                usersByRole: roleCounts,
                schoolsByPlan: planCounts,
                schoolsByCity: cityCounts
            },
            trends: {
                monthlyRegistrations: monthlyTrend
            },
            reportTemplates
        })
    } catch (error) {
        console.error('Reports fetch error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST /api/reports - Generate a specific report
export async function POST(request: NextRequest) {
    try {
        const supabase = createServerClient()
        const body = await request.json()

        const { reportType, format, dateRange } = body

        if (!reportType) {
            return NextResponse.json(
                { error: 'Report type is required' },
                { status: 400 }
            )
        }

        let data: unknown[] = []

        switch (reportType) {
            case 'schools':
            case 'schools-overview':
                const { data: schools } = await supabase
                    .from('schools')
                    .select(`
                        id, name, slug, email, phone, city, address,
                        subscription_plan, subscription_status, subscription_expires_at,
                        max_students, max_staff, is_active, created_at
                    `)
                    .order('created_at', { ascending: false })
                data = schools || []
                break

            case 'users':
            case 'user-activity':
                const { data: users } = await supabase
                    .from('users')
                    .select(`
                        id, email, first_name, last_name, role, phone,
                        is_active, last_login, login_count, created_at,
                        schools(name)
                    `)
                    .order('created_at', { ascending: false })
                data = users || []
                break

            case 'subscriptions':
            case 'subscription-report':
                const { data: subs } = await supabase
                    .from('schools')
                    .select(`
                        id, name, email,
                        subscription_plan, subscription_status, subscription_expires_at,
                        max_students, max_staff, created_at, updated_at
                    `)
                    .order('subscription_expires_at', { ascending: true })
                data = subs || []
                break

            default:
                return NextResponse.json(
                    { error: 'Invalid report type' },
                    { status: 400 }
                )
        }

        return NextResponse.json({
            success: true,
            reportType,
            format: format || 'json',
            generatedAt: new Date().toISOString(),
            rowCount: data.length,
            data
        })
    } catch (error) {
        console.error('Report generation error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
