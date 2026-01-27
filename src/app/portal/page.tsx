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
    BookOpen,
    ClipboardList,
    Bus,
    FileText,
    AlertCircle,
    CheckCircle,
} from 'lucide-react'
import Link from 'next/link'
import { TodoWidget } from '@/components/dashboard/todo-widget'

const children = [
    {
        name: 'Ahmed Khan',
        class: 'Class 10-A',
        rollNo: '1001',
        attendance: '94%',
        lastGrade: 'A',
        pendingFee: 15000,
    },
    {
        name: 'Sara Khan',
        class: 'Class 7-B',
        rollNo: '702',
        attendance: '97%',
        lastGrade: 'A+',
        pendingFee: 0,
    },
]

const todaySchedule = [
    { time: '8:00 AM', subject: 'Mathematics', teacher: 'Mr. Imran Ali', child: 'Ahmed' },
    { time: '9:00 AM', subject: 'English', teacher: 'Mrs. Ayesha Khan', child: 'Ahmed' },
    { time: '10:00 AM', subject: 'Science', teacher: 'Dr. Sana Malik', child: 'Sara' },
    { time: '11:00 AM', subject: 'Physics', teacher: 'Mr. Hassan Raza', child: 'Ahmed' },
]

const recentUpdates = [
    { type: 'homework', message: 'New homework assigned in Mathematics', child: 'Ahmed', time: '2 hours ago', icon: BookOpen },
    { type: 'attendance', message: 'Marked present today', child: 'Sara', time: '4 hours ago', icon: UserCheck },
    { type: 'result', message: 'Quiz 1 results published', child: 'Ahmed', time: 'Yesterday', icon: ClipboardList },
    { type: 'fee', message: 'Fee reminder: January payment pending', child: 'Ahmed', time: '2 days ago', icon: DollarSign },
]

const upcomingEvents = [
    { event: 'Parent Teacher Meeting', date: 'Jan 25, 2024', time: '10:00 AM' },
    { event: 'First Terminal Exams', date: 'Feb 20, 2024', time: 'All Day' },
    { event: 'Sports Day', date: 'Feb 15, 2024', time: '9:00 AM' },
]

export default function ParentPortalDashboard() {
    const totalPendingFee = children.reduce((acc, child) => acc + child.pendingFee, 0)

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Parent Portal</h1>
                    <p className="text-muted-foreground">
                        Welcome back, Mr. & Mrs. Khan! Track your children&apos;s progress.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" asChild>
                        <Link href="/portal/results">
                            <ClipboardList className="mr-2 h-4 w-4" />
                            View Results
                        </Link>
                    </Button>
                    <Button className="gradient-primary" asChild>
                        <Link href="/portal/fees">
                            <DollarSign className="mr-2 h-4 w-4" />
                            Pay Fees
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Fee Alert */}
            {totalPendingFee > 0 && (
                <Card className="border-yellow-500/50 bg-yellow-500/5">
                    <CardContent className="py-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10">
                                <AlertCircle className="h-6 w-6 text-yellow-500" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">Fee Payment Pending</p>
                                <p className="text-sm text-muted-foreground">
                                    Total pending amount: Rs. {totalPendingFee.toLocaleString()}
                                </p>
                            </div>
                            <Button asChild>
                                <Link href="/portal/fees">Pay Now</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Children Cards */}
            <div className="grid gap-4 md:grid-cols-2">
                {children.map((child, index) => (
                    <Card key={index} className="card-hover">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                        <GraduationCap className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle>{child.name}</CardTitle>
                                        <CardDescription>{child.class} • Roll No: {child.rollNo}</CardDescription>
                                    </div>
                                </div>
                                {child.pendingFee > 0 ? (
                                    <Badge className="bg-yellow-500/10 text-yellow-500">Fee Pending</Badge>
                                ) : (
                                    <Badge className="bg-green-500/10 text-green-500">Fee Paid</Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-3 rounded-lg bg-blue-500/10">
                                    <UserCheck className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                                    <p className="text-lg font-bold">{child.attendance}</p>
                                    <p className="text-xs text-muted-foreground">Attendance</p>
                                </div>
                                <div className="text-center p-3 rounded-lg bg-green-500/10">
                                    <ClipboardList className="h-5 w-5 text-green-500 mx-auto mb-1" />
                                    <p className="text-lg font-bold">{child.lastGrade}</p>
                                    <p className="text-xs text-muted-foreground">Last Grade</p>
                                </div>
                                <div className="text-center p-3 rounded-lg bg-orange-500/10">
                                    <DollarSign className="h-5 w-5 text-orange-500 mx-auto mb-1" />
                                    <p className="text-lg font-bold">
                                        {child.pendingFee > 0 ? `Rs. ${(child.pendingFee / 1000).toFixed(0)}K` : 'Paid'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Pending Fee</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Today's Schedule */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Today&apos;s Classes
                                </CardTitle>
                                <CardDescription>Your children&apos;s schedule for today</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {todaySchedule.map((period, index) => (
                                <div key={index} className="flex items-center gap-4 p-3 rounded-lg border">
                                    <div className="text-center">
                                        <p className="text-sm font-medium">{period.time}</p>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{period.subject}</p>
                                        <p className="text-xs text-muted-foreground">{period.teacher}</p>
                                    </div>
                                    <Badge variant="outline">{period.child}</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Todo Widget */}
                <TodoWidget compact={false} maxItems={8} />

                {/* Recent Updates */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Bell className="h-5 w-5" />
                                    Recent Updates
                                </CardTitle>
                                <CardDescription>Latest notifications and updates</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentUpdates.map((update, index) => (
                                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${update.type === 'homework' ? 'bg-blue-500/10' :
                                            update.type === 'attendance' ? 'bg-green-500/10' :
                                                update.type === 'result' ? 'bg-purple-500/10' : 'bg-orange-500/10'
                                        }`}>
                                        <update.icon className={`h-4 w-4 ${update.type === 'homework' ? 'text-blue-500' :
                                                update.type === 'attendance' ? 'text-green-500' :
                                                    update.type === 'result' ? 'text-purple-500' : 'text-orange-500'
                                            }`} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">{update.message}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="outline" className="text-xs">{update.child}</Badge>
                                            <span className="text-xs text-muted-foreground">{update.time}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Upcoming Events */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Upcoming Events
                    </CardTitle>
                    <CardDescription>Important dates and school events</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        {upcomingEvents.map((event, index) => (
                            <div key={index} className="flex items-center gap-4 p-4 rounded-lg border">
                                <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-primary/10">
                                    <span className="text-xs font-medium">{event.date.split(' ')[0]}</span>
                                    <span className="text-xs text-muted-foreground">{event.date.split(' ')[1]}</span>
                                </div>
                                <div>
                                    <p className="font-medium">{event.event}</p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {event.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Quick Links */}
            <div className="grid gap-4 md:grid-cols-4">
                <Link href="/portal/attendance">
                    <Card className="card-hover cursor-pointer">
                        <CardContent className="pt-6 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 mx-auto mb-3">
                                <UserCheck className="h-6 w-6 text-blue-500" />
                            </div>
                            <p className="font-medium">Attendance</p>
                            <p className="text-xs text-muted-foreground">Check attendance records</p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/portal/homework">
                    <Card className="card-hover cursor-pointer">
                        <CardContent className="pt-6 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 mx-auto mb-3">
                                <FileText className="h-6 w-6 text-green-500" />
                            </div>
                            <p className="font-medium">Homework</p>
                            <p className="text-xs text-muted-foreground">View assignments</p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/portal/results">
                    <Card className="card-hover cursor-pointer">
                        <CardContent className="pt-6 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10 mx-auto mb-3">
                                <ClipboardList className="h-6 w-6 text-purple-500" />
                            </div>
                            <p className="font-medium">Results</p>
                            <p className="text-xs text-muted-foreground">Exam results & grades</p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/portal/transport">
                    <Card className="card-hover cursor-pointer">
                        <CardContent className="pt-6 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10 mx-auto mb-3">
                                <Bus className="h-6 w-6 text-orange-500" />
                            </div>
                            <p className="font-medium">Transport</p>
                            <p className="text-xs text-muted-foreground">Track school bus</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    )
}
