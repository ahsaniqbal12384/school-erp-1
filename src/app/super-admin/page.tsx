'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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

const stats = [
    {
        title: 'Total Schools',
        value: '127',
        change: '+12',
        changeLabel: 'from last month',
        trend: 'up',
        icon: Building2,
    },
    {
        title: 'Active Users',
        value: '8,432',
        change: '+5.2%',
        changeLabel: 'from last month',
        trend: 'up',
        icon: Users,
    },
    {
        title: 'Monthly Revenue',
        value: 'Rs. 12.5M',
        change: '+18%',
        changeLabel: 'from last month',
        trend: 'up',
        icon: DollarSign,
    },
    {
        title: 'Open Tickets',
        value: '23',
        change: '-5',
        changeLabel: 'from yesterday',
        trend: 'down',
        icon: Ticket,
    },
]

const recentSchools = [
    { name: 'Lahore Grammar School', location: 'Lahore', students: 1250, status: 'active' },
    { name: 'Beaconhouse School', location: 'Karachi', students: 980, status: 'active' },
    { name: 'The City School', location: 'Islamabad', students: 850, status: 'active' },
    { name: 'Allied School', location: 'Lahore', students: 720, status: 'pending' },
    { name: 'Froebel\'s International', location: 'Rawalpindi', students: 650, status: 'active' },
]

const recentTickets = [
    { id: 'TKT-001', school: 'Lahore Grammar School', subject: 'Fee challan issue', priority: 'high', status: 'open' },
    { id: 'TKT-002', school: 'Beaconhouse School', subject: 'Attendance sync', priority: 'medium', status: 'in-progress' },
    { id: 'TKT-003', school: 'The City School', subject: 'User accounts', priority: 'low', status: 'resolved' },
    { id: 'TKT-004', school: 'Froebel\'s International', subject: 'System slow', priority: 'critical', status: 'in-progress' },
]

export default function SuperAdminDashboard() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card key={index} className="card-hover">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <div className="flex items-center text-xs">
                                {stat.trend === 'up' ? (
                                    <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                                ) : (
                                    <ArrowDownRight className="mr-1 h-3 w-3 text-green-500" />
                                )}
                                <span className={stat.trend === 'up' ? 'text-green-500' : 'text-green-500'}>
                                    {stat.change}
                                </span>
                                <span className="text-muted-foreground ml-1">{stat.changeLabel}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Recent Schools */}
                <Card>
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
                            {recentSchools.map((school, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                            <Building2 className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{school.name}</p>
                                            <p className="text-xs text-muted-foreground">{school.location} • {school.students} students</p>
                                        </div>
                                    </div>
                                    {school.status === 'active' ? (
                                        <Badge className="bg-green-500/10 text-green-500">Active</Badge>
                                    ) : (
                                        <Badge className="bg-yellow-500/10 text-yellow-500">Pending</Badge>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Tickets */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Ticket className="h-5 w-5" />
                                    Recent Tickets
                                </CardTitle>
                                <CardDescription>Latest support requests</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/super-admin/tickets">View All</Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentTickets.map((ticket, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${ticket.priority === 'critical' ? 'bg-red-500/10' :
                                                ticket.priority === 'high' ? 'bg-orange-500/10' :
                                                    ticket.priority === 'medium' ? 'bg-yellow-500/10' : 'bg-gray-500/10'
                                            }`}>
                                            {ticket.status === 'open' ? (
                                                <AlertCircle className={`h-5 w-5 ${ticket.priority === 'critical' ? 'text-red-500' :
                                                        ticket.priority === 'high' ? 'text-orange-500' :
                                                            ticket.priority === 'medium' ? 'text-yellow-500' : 'text-gray-500'
                                                    }`} />
                                            ) : ticket.status === 'in-progress' ? (
                                                <Clock className="h-5 w-5 text-yellow-500" />
                                            ) : (
                                                <CheckCircle className="h-5 w-5 text-green-500" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium">{ticket.id}: {ticket.subject}</p>
                                            <p className="text-xs text-muted-foreground">{ticket.school}</p>
                                        </div>
                                    </div>
                                    {ticket.status === 'open' ? (
                                        <Badge className="bg-blue-500/10 text-blue-500">Open</Badge>
                                    ) : ticket.status === 'in-progress' ? (
                                        <Badge className="bg-yellow-500/10 text-yellow-500">In Progress</Badge>
                                    ) : (
                                        <Badge className="bg-green-500/10 text-green-500">Resolved</Badge>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
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
