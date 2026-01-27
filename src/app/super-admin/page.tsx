'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
    Building2,
    Users,
    DollarSign,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
    BarChart3,
    Ticket,
    School,
} from 'lucide-react'
import Link from 'next/link'
import { TodoWidget } from '@/components/dashboard/todo-widget'

interface DashboardStats {
    totalSchools: number
    activeSchools: number
    totalUsers: number
    activeUsers: number
    openTickets: number
    newSchoolsThisMonth: number
    newSchoolsLastMonth: number
}

interface RecentSchool {
    id: string
    name: string
    slug: string
    city: string | null
    subscription_plan: string
    subscription_status: string
    created_at: string
}

export default function SuperAdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [recentSchools, setRecentSchools] = useState<RecentSchool[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('auth_token')
                const res = await fetch('/api/dashboard/stats', {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                })

                if (res.ok) {
                    const data = await res.json()
                    setStats(data.stats)
                    setRecentSchools(data.recentSchools || [])
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchDashboardData()
    }, [])

    const statCards = [
        {
            title: 'Total Schools',
            value: stats?.totalSchools?.toString() || '0',
            change: stats ? `+${stats.newSchoolsThisMonth}` : '+0',
            changeLabel: 'this month',
            trend: 'up' as const,
            icon: Building2,
        },
        {
            title: 'Active Users',
            value: stats?.activeUsers?.toLocaleString() || '0',
            change: stats?.totalUsers ? `${Math.round((stats.activeUsers / stats.totalUsers) * 100)}%` : '0%',
            changeLabel: 'active rate',
            trend: 'up' as const,
            icon: Users,
        },
        {
            title: 'Total Users',
            value: stats?.totalUsers?.toLocaleString() || '0',
            change: '+5.2%',
            changeLabel: 'from last month',
            trend: 'up' as const,
            icon: DollarSign,
        },
        {
            title: 'Open Tickets',
            value: stats?.openTickets?.toString() || '0',
            change: stats?.openTickets === 0 ? 'Great!' : 'Needs attention',
            changeLabel: '',
            trend: (stats?.openTickets === 0 ? 'up' : 'down') as 'up' | 'down',
            icon: Ticket,
        },
    ]

    if (isLoading) {
        return (
            <div className="space-y-6 page-enter">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <Skeleton className="h-8 w-64 mb-2" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map(i => (
                        <Card key={i}>
                            <CardHeader className="pb-2">
                                <Skeleton className="h-4 w-24" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-20 mb-2" />
                                <Skeleton className="h-3 w-32" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 page-enter">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between animate-slide-in-left">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Super Admin Dashboard</h1>
                    <p className="text-muted-foreground">
                        Overview of all schools and platform status
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" asChild>
                        <Link href="/super-admin/reports">
                            <BarChart3 className="mr-2 h-4 w-4" />
                            View Reports
                        </Link>
                    </Button>
                    <Button className="gradient-primary" asChild>
                        <Link href="/super-admin/schools">
                            <Building2 className="mr-2 h-4 w-4" />
                            Manage Schools
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-stagger">
                {statCards.map((stat, index) => (
                    <Card key={index} className="card-shine group">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:scale-110 group-hover:text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <div className="flex items-center text-xs">
                                {stat.trend === 'up' ? (
                                    <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                                ) : (
                                    <ArrowDownRight className="mr-1 h-3 w-3 text-yellow-500" />
                                )}
                                <span className={stat.trend === 'up' ? 'text-green-500' : 'text-yellow-500'}>
                                    {stat.change}
                                </span>
                                <span className="text-muted-foreground ml-1">{stat.changeLabel}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-stagger">
                {/* Recent Schools */}
                <Card className="animate-slide-in-left" style={{ animationDelay: '0.3s' }}>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <School className="h-5 w-5" />
                                    Recent Schools
                                </CardTitle>
                                <CardDescription>Latest registered schools</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/super-admin/schools">View All</Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentSchools.length === 0 ? (
                                <p className="text-center text-muted-foreground py-4">No schools registered yet</p>
                            ) : (
                                recentSchools.map((school) => (
                                    <div key={school.id} className="flex items-center justify-between group hover:bg-muted/50 -mx-2 px-2 py-1 rounded-lg transition-all duration-200">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-transform duration-300 group-hover:scale-110">
                                                <Building2 className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{school.name}</p>
                                                <p className="text-xs text-muted-foreground">{school.city || 'Unknown'} • {school.subscription_plan}</p>
                                            </div>
                                        </div>
                                        {school.subscription_status === 'active' ? (
                                            <Badge className="bg-green-500/10 text-green-500">Active</Badge>
                                        ) : school.subscription_status === 'trial' ? (
                                            <Badge className="bg-blue-500/10 text-blue-500">Trial</Badge>
                                        ) : (
                                            <Badge className="bg-yellow-500/10 text-yellow-500">{school.subscription_status}</Badge>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Ticket className="h-5 w-5" />
                                    Quick Actions
                                </CardTitle>
                                <CardDescription>Common administrative tasks</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3">
                            <Button variant="outline" className="justify-start h-auto py-3" asChild>
                                <Link href="/super-admin/schools">
                                    <Building2 className="mr-3 h-5 w-5 text-primary" />
                                    <div className="text-left">
                                        <p className="font-medium">Add New School</p>
                                        <p className="text-xs text-muted-foreground">Register a new school on the platform</p>
                                    </div>
                                </Link>
                            </Button>
                            <Button variant="outline" className="justify-start h-auto py-3" asChild>
                                <Link href="/super-admin/subscriptions">
                                    <DollarSign className="mr-3 h-5 w-5 text-green-500" />
                                    <div className="text-left">
                                        <p className="font-medium">Manage Subscriptions</p>
                                        <p className="text-xs text-muted-foreground">View and update school subscriptions</p>
                                    </div>
                                </Link>
                            </Button>
                            <Button variant="outline" className="justify-start h-auto py-3" asChild>
                                <Link href="/super-admin/tickets">
                                    <Ticket className="mr-3 h-5 w-5 text-yellow-500" />
                                    <div className="text-left">
                                        <p className="font-medium">Support Tickets</p>
                                        <p className="text-xs text-muted-foreground">{stats?.openTickets || 0} open tickets</p>
                                    </div>
                                </Link>
                            </Button>
                            <Button variant="outline" className="justify-start h-auto py-3" asChild>
                                <Link href="/super-admin/reports">
                                    <BarChart3 className="mr-3 h-5 w-5 text-blue-500" />
                                    <div className="text-left">
                                        <p className="font-medium">Generate Reports</p>
                                        <p className="text-xs text-muted-foreground">Create and download reports</p>
                                    </div>
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Todo Widget */}
                <TodoWidget className="lg:col-span-1" maxItems={6} />
            </div>

            {/* Platform Health */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Platform Health
                    </CardTitle>
                    <CardDescription>System status and performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                        <div className="flex items-center gap-3 p-4 rounded-lg border">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                                <CheckCircle className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">API Status</p>
                                <p className="font-medium text-green-500">Operational</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-lg border">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                                <CheckCircle className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Database</p>
                                <p className="font-medium text-green-500">Healthy</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-lg border">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                                <CheckCircle className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">SMS Gateway</p>
                                <p className="font-medium text-green-500">Active</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-lg border">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10">
                                <Clock className="h-6 w-6 text-yellow-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Avg Response</p>
                                <p className="font-medium text-yellow-500">245ms</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
