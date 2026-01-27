import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/client'

// GET /api/dashboard/stats - Get dashboard statistics for super admin
export async function GET(request: NextRequest) {
    try {
        const supabase = createServerClient()

        // Get total schools count
        const { count: totalSchools } = await supabase
            .from('schools')
            .select('*', { count: 'exact', head: true })

        // Get active schools count
        const { count: activeSchools } = await supabase
            .from('schools')
            .select('*', { count: 'exact', head: true })
            .eq('is_active', true)

        // Get total users count
        const { count: totalUsers } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })

        // Get active users count (logged in within last 30 days)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        const { count: activeUsers } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .gte('last_login', thirtyDaysAgo)

        // Get schools by plan
        const { data: schoolsByPlan } = await supabase
            .from('schools')
            .select('subscription_plan')

        const planCounts = {
            basic: 0,
            standard: 0,
            premium: 0,
            enterprise: 0
        }

        schoolsByPlan?.forEach(school => {
            const plan = school.subscription_plan as keyof typeof planCounts
            if (plan in planCounts) {
                planCounts[plan]++
            }
        })

        // Get schools by status
        const { data: schoolsByStatus } = await supabase
            .from('schools')
            .select('subscription_status')

        const statusCounts = {
            active: 0,
            trial: 0,
            expired: 0,
            suspended: 0,
            cancelled: 0
        }

        schoolsByStatus?.forEach(school => {
            const status = school.subscription_status as keyof typeof statusCounts
            if (status in statusCounts) {
                statusCounts[status]++
            }
        })

        // Get recent schools (last 5)
        const { data: recentSchools } = await supabase
            .from('schools')
            .select('id, name, slug, city, subscription_plan, subscription_status, created_at')
            .order('created_at', { ascending: false })
            .limit(5)

        // Get open tickets count (if tickets table exists)
        let openTickets = 0
        try {
            const { count } = await supabase
                .from('support_tickets')
                .select('*', { count: 'exact', head: true })
                .in('status', ['open', 'in_progress'])
            openTickets = count || 0
        } catch {
            // Table might not exist yet
        }

        // Calculate month over month changes
        const lastMonthStart = new Date()
        lastMonthStart.setMonth(lastMonthStart.getMonth() - 1)
        lastMonthStart.setDate(1)
        
        const thisMonthStart = new Date()
        thisMonthStart.setDate(1)

        const { count: lastMonthSchools } = await supabase
            .from('schools')
            .select('*', { count: 'exact', head: true })
            .lt('created_at', thisMonthStart.toISOString())
            .gte('created_at', lastMonthStart.toISOString())

        const { count: thisMonthSchools } = await supabase
            .from('schools')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', thisMonthStart.toISOString())

        return NextResponse.json({
            stats: {
                totalSchools: totalSchools || 0,
                activeSchools: activeSchools || 0,
                totalUsers: totalUsers || 0,
                activeUsers: activeUsers || 0,
                openTickets,
                newSchoolsThisMonth: thisMonthSchools || 0,
                newSchoolsLastMonth: lastMonthSchools || 0,
            },
            schoolsByPlan: planCounts,
            schoolsByStatus: statusCounts,
            recentSchools: recentSchools || [],
        })
    } catch (error) {
        console.error('Dashboard stats error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
