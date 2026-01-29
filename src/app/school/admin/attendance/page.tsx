'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Users,
    Calendar,
    Clock,
    BarChart3,
    AlertTriangle,
    CheckCircle,
    UserCheck,
    UserX,
    FileText,
    Settings,
    Bell,
    TrendingUp,
    Activity,
    ArrowRight,
    Smartphone,
} from 'lucide-react'

export default function AttendanceManagementPage() {
    const [todayDate] = useState(new Date().toLocaleDateString('en-GB', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    }))

    // Sample stats for today
    const todayStats = {
        totalStudents: 2977,
        present: 2840,
        absent: 88,
        late: 49,
        presentPercentage: 95.4,
        classesMarked: 18,
        totalClasses: 20,
        smsAlertsSent: 88,
    }

    // Quick action cards
    const quickActions = [
        {
            title: 'View Reports',
            description: 'Analytics, trends, and detailed attendance reports',
            icon: BarChart3,
            href: '/school/admin/attendance/reports',
            color: 'bg-blue-500',
        },
        {
            title: 'Low Attendance Alerts',
            description: 'Students with attendance below threshold',
            icon: AlertTriangle,
            href: '/school/admin/attendance/reports?tab=alerts',
            color: 'bg-yellow-500',
            badge: '8 Students',
        },
        {
            title: 'Mark Attendance',
            description: 'Manual attendance entry for teachers',
            icon: UserCheck,
            href: '/school/teacher/attendance',
            color: 'bg-green-500',
        },
        {
            title: 'Attendance Settings',
            description: 'Configure working days, SMS alerts, thresholds',
            icon: Settings,
            href: '/school/admin/settings?tab=attendance',
            color: 'bg-purple-500',
        },
    ]

    // Recent activities
    const recentActivities = [
        { time: '10:15 AM', action: 'Class 10-A attendance marked', by: 'Mr. Ahmad', count: '31/32 present' },
        { time: '10:12 AM', action: 'Class 9-B attendance marked', by: 'Ms. Fatima', count: '33/33 present' },
        { time: '10:08 AM', action: 'Class 8-A attendance marked', by: 'Mr. Hassan', count: '30/31 present' },
        { time: '10:05 AM', action: 'Absent SMS sent to 5 parents', by: 'System', count: '5 messages' },
        { time: '10:02 AM', action: 'Class 7-B attendance marked', by: 'Ms. Ayesha', count: '34/35 present' },
        { time: '09:58 AM', action: 'Class 6-A attendance marked', by: 'Mr. Bilal', count: '35/36 present' },
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Attendance Management</h1>
                    <p className="text-muted-foreground">{todayDate}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/school/admin/attendance/reports">
                            <BarChart3 className="mr-2 h-4 w-4" />
                            View Reports
                        </Link>
                    </Button>
                    <Button className="gradient-primary" asChild>
                        <Link href="/school/teacher/attendance">
                            <UserCheck className="mr-2 h-4 w-4" />
                            Mark Attendance
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Today&apos;s Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-200">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Present Today</p>
                                <p className="text-3xl font-bold text-green-600">
                                    {todayStats.present.toLocaleString()}
                                </p>
                                <p className="text-sm text-green-600 font-medium">
                                    {todayStats.presentPercentage}% of total
                                </p>
                            </div>
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/20">
                                <UserCheck className="h-7 w-7 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-200">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Absent Today</p>
                                <p className="text-3xl font-bold text-red-600">{todayStats.absent}</p>
                                <p className="text-sm text-red-600 font-medium">
                                    {((todayStats.absent / todayStats.totalStudents) * 100).toFixed(1)}% of total
                                </p>
                            </div>
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/20">
                                <UserX className="h-7 w-7 text-red-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-200">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Late Arrivals</p>
                                <p className="text-3xl font-bold text-yellow-600">{todayStats.late}</p>
                                <p className="text-sm text-yellow-600 font-medium">
                                    After 8:15 AM
                                </p>
                            </div>
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-500/20">
                                <Clock className="h-7 w-7 text-yellow-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">SMS Alerts Sent</p>
                                <p className="text-3xl font-bold text-blue-600">{todayStats.smsAlertsSent}</p>
                                <p className="text-sm text-blue-600 font-medium">
                                    Absent + Late alerts
                                </p>
                            </div>
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/20">
                                <Smartphone className="h-7 w-7 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Progress Indicator */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span className="font-medium">Today&apos;s Marking Progress</span>
                        </div>
                        <Badge variant={todayStats.classesMarked === todayStats.totalClasses ? "default" : "secondary"}>
                            {todayStats.classesMarked} / {todayStats.totalClasses} Classes
                        </Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                        <div 
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${(todayStats.classesMarked / todayStats.totalClasses) * 100}%` }}
                        />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                        {todayStats.totalClasses - todayStats.classesMarked} classes pending • 
                        Deadline: 10:30 AM
                    </p>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {quickActions.map((action) => (
                    <Link key={action.title} href={action.href}>
                        <Card className="h-full hover:shadow-md transition-all hover:border-primary/50 cursor-pointer">
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${action.color}/10`}>
                                        <action.icon className={`h-6 w-6 ${action.color.replace('bg-', 'text-')}`} />
                                    </div>
                                    {action.badge && (
                                        <Badge variant="destructive">{action.badge}</Badge>
                                    )}
                                </div>
                                <h3 className="font-semibold mb-1">{action.title}</h3>
                                <p className="text-sm text-muted-foreground">{action.description}</p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Two Column Layout */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="h-5 w-5" />
                                    Recent Activity
                                </CardTitle>
                                <CardDescription>Today&apos;s attendance marking activity</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm">
                                View All
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivities.map((activity, index) => (
                                <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 shrink-0">
                                        <CheckCircle className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm">{activity.action}</p>
                                        <p className="text-xs text-muted-foreground">
                                            by {activity.by} • {activity.count}
                                        </p>
                                    </div>
                                    <span className="text-xs text-muted-foreground shrink-0">
                                        {activity.time}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Low Attendance Preview */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                                    Low Attendance Alert
                                </CardTitle>
                                <CardDescription>Students requiring attention</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/school/admin/attendance/reports?tab=alerts">
                                    View All
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {[
                                { name: 'Ali Ahmed', class: '5-A', percentage: 65, status: 'critical' },
                                { name: 'Sara Khan', class: '7-A', percentage: 68, status: 'critical' },
                                { name: 'Hassan Malik', class: '9-A', percentage: 70, status: 'warning' },
                                { name: 'Fatima Zahra', class: '3-A', percentage: 71, status: 'warning' },
                            ].map((student, index) => (
                                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-medium ${
                                            student.status === 'critical' ? 'bg-red-500' : 'bg-yellow-500'
                                        }`}>
                                            {student.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{student.name}</p>
                                            <p className="text-xs text-muted-foreground">Class {student.class}</p>
                                        </div>
                                    </div>
                                    <Badge variant={student.status === 'critical' ? 'destructive' : 'secondary'}>
                                        {student.percentage}%
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            This Week
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-bold">95.2%</span>
                            <span className="text-sm text-green-500 flex items-center mb-1">
                                <TrendingUp className="h-4 w-4 mr-1" />
                                +0.8%
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">Average attendance rate</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            This Month
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-bold">94.8%</span>
                            <span className="text-sm text-green-500 flex items-center mb-1">
                                <TrendingUp className="h-4 w-4 mr-1" />
                                +1.2%
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">vs last month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Reports Generated
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-bold">24</span>
                        </div>
                        <p className="text-sm text-muted-foreground">This month</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
