'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Users,
    GraduationCap,
    DollarSign,
    UserCheck,
    Calendar,
    Clock,
    Bell,
    ArrowUpRight,
    BookOpen,
    ClipboardList,
    TrendingUp,
    AlertCircle,
} from 'lucide-react'
import Link from 'next/link'

const stats = [
    {
        title: 'Total Students',
        value: '1,250',
        change: '+45',
        changeLabel: 'new this month',
        icon: GraduationCap,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
    },
    {
        title: 'Total Staff',
        value: '87',
        change: '+3',
        changeLabel: 'new this month',
        icon: Users,
        color: 'text-purple-500',
        bgColor: 'bg-purple-500/10',
    },
    {
        title: 'Fee Collected',
        value: 'Rs. 8.5M',
        change: '68%',
        changeLabel: 'of monthly target',
        icon: DollarSign,
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
    },
    {
        title: "Today's Attendance",
        value: '94.2%',
        change: '+2.1%',
        changeLabel: 'from yesterday',
        icon: UserCheck,
        color: 'text-orange-500',
        bgColor: 'bg-orange-500/10',
    },
]

const upcomingEvents = [
    { title: 'Parent Teacher Meeting', date: 'Jan 25, 2024', time: '10:00 AM', type: 'meeting' },
    { title: 'First Terminal Exams Begin', date: 'Feb 20, 2024', time: 'All Day', type: 'exam' },
    { title: 'Sports Day', date: 'Feb 15, 2024', time: '9:00 AM', type: 'event' },
    { title: 'Winter Break Ends', date: 'Jan 02, 2024', time: 'All Day', type: 'holiday' },
]

const recentActivities = [
    { action: 'Fee payment received', details: 'Ahmed Khan - Class 10-A - Rs. 15,000', time: '2 mins ago', type: 'fee' },
    { action: 'New admission', details: 'Sara Ali admitted to Class 5-B', time: '1 hour ago', type: 'admission' },
    { action: 'Leave approved', details: 'Mrs. Ayesha Khan - 3 days', time: '2 hours ago', type: 'leave' },
    { action: 'Exam schedule published', details: 'First Terminal - Feb 20 to Mar 5', time: '3 hours ago', type: 'exam' },
    { action: 'Fee reminder sent', details: '320 parents notified via SMS', time: '5 hours ago', type: 'notification' },
]

const pendingItems = [
    { title: 'Fee defaults', count: 125, link: '/school/admin/fees/defaults' },
    { title: 'Leave requests', count: 5, link: '/school/admin/staff/leaves' },
    { title: 'New admissions', count: 12, link: '/school/admin/admissions/registrations' },
    { title: 'Pending payments', count: 8, link: '/school/admin/fees/collection' },
]

export default function SchoolAdminDashboard() {
    return (
        <div className="space-y-6 page-enter">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between animate-slide-in-left">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome back! Here&apos;s what&apos;s happening at your school today.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" asChild>
                        <Link href="/school/admin/students/attendance">
                            <UserCheck className="mr-2 h-4 w-4" />
                            Mark Attendance
                        </Link>
                    </Button>
                    <Button className="gradient-primary" asChild>
                        <Link href="/school/admin/admissions/new">
                            <GraduationCap className="mr-2 h-4 w-4" />
                            New Admission
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-stagger">
                {stats.map((stat, index) => (
                    <Card key={index} className="card-shine group">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.bgColor} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <div className="flex items-center text-xs">
                                <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                                <span className="text-green-500">{stat.change}</span>
                                <span className="text-muted-foreground ml-1">{stat.changeLabel}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Pending Actions Alert */}
            <Card className="border-yellow-500/50 bg-yellow-500/5">
                <CardContent className="py-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/10">
                                <AlertCircle className="h-5 w-5 text-yellow-500" />
                            </div>
                            <div>
                                <p className="font-medium">Pending Actions</p>
                                <p className="text-sm text-muted-foreground">You have items requiring attention</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {pendingItems.map((item, index) => (
                                <Link href={item.link} key={index}>
                                    <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                                        {item.title}: {item.count}
                                    </Badge>
                                </Link>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Upcoming Events */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Upcoming Events
                                </CardTitle>
                                <CardDescription>Important dates and events</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {upcomingEvents.map((event, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <div className={`flex h-12 w-12 flex-col items-center justify-center rounded-lg ${event.type === 'exam' ? 'bg-red-500/10' :
                                            event.type === 'meeting' ? 'bg-blue-500/10' :
                                                event.type === 'event' ? 'bg-green-500/10' : 'bg-purple-500/10'
                                        }`}>
                                        <span className="text-xs font-medium">{event.date.split(' ')[0]}</span>
                                        <span className="text-xs text-muted-foreground">{event.date.split(' ')[1]}</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{event.title}</p>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {event.time}
                                        </p>
                                    </div>
                                    <Badge variant="outline" className="capitalize">{event.type}</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Bell className="h-5 w-5" />
                                    Recent Activity
                                </CardTitle>
                                <CardDescription>Latest actions and updates</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivities.map((activity, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-full mt-0.5 ${activity.type === 'fee' ? 'bg-green-500/10' :
                                            activity.type === 'admission' ? 'bg-blue-500/10' :
                                                activity.type === 'leave' ? 'bg-yellow-500/10' :
                                                    activity.type === 'exam' ? 'bg-purple-500/10' : 'bg-orange-500/10'
                                        }`}>
                                        {activity.type === 'fee' ? <DollarSign className="h-4 w-4 text-green-500" /> :
                                            activity.type === 'admission' ? <GraduationCap className="h-4 w-4 text-blue-500" /> :
                                                activity.type === 'leave' ? <Calendar className="h-4 w-4 text-yellow-500" /> :
                                                    activity.type === 'exam' ? <ClipboardList className="h-4 w-4 text-purple-500" /> :
                                                        <Bell className="h-4 w-4 text-orange-500" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">{activity.action}</p>
                                        <p className="text-xs text-muted-foreground">{activity.details}</p>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Stats Row */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="card-hover">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                                <BookOpen className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">42</p>
                                <p className="text-sm text-muted-foreground">Active Classes</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                                <TrendingUp className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">85%</p>
                                <p className="text-sm text-muted-foreground">Pass Rate</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
                                <ClipboardList className="h-6 w-6 text-purple-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">3</p>
                                <p className="text-sm text-muted-foreground">Exams Scheduled</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10">
                                <Users className="h-6 w-6 text-orange-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">6</p>
                                <p className="text-sm text-muted-foreground">Transport Routes</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
