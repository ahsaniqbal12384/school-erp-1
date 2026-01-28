'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Users,
    GraduationCap,
    Clock,
    Calendar,
    BookOpen,
    ClipboardList,
    Bell,
    CheckCircle,
    FileText,
    UserCheck,
} from 'lucide-react'
import Link from 'next/link'

const stats = [
    {
        title: 'My Classes',
        value: '5',
        description: 'Assigned classes',
        icon: BookOpen,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        link: '/school/teacher/classes',
    },
    {
        title: 'Total Students',
        value: '187',
        description: 'Across all classes',
        icon: GraduationCap,
        color: 'text-purple-500',
        bgColor: 'bg-purple-500/10',
        link: '/school/teacher/classes',
    },
    {
        title: "Today's Classes",
        value: '6',
        description: '2 completed, 4 remaining',
        icon: Clock,
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
        link: '/school/teacher/timetable',
    },
    {
        title: 'Pending Tasks',
        value: '8',
        description: 'Homework & grades',
        icon: ClipboardList,
        color: 'text-orange-500',
        bgColor: 'bg-orange-500/10',
        link: '/school/teacher/homework',
    },
]

const todaySchedule = [
    { time: '8:00 - 8:45', subject: 'Mathematics', class: 'Class 10-A', room: 'Room 101', status: 'completed' },
    { time: '8:45 - 9:30', subject: 'Mathematics', class: 'Class 10-B', room: 'Room 102', status: 'completed' },
    { time: '9:30 - 10:15', subject: 'Mathematics', class: 'Class 9-A', room: 'Room 103', status: 'current' },
    { time: '10:30 - 11:15', subject: 'Mathematics', class: 'Class 9-B', room: 'Room 104', status: 'upcoming' },
    { time: '11:15 - 12:00', subject: 'Break', class: '-', room: '-', status: 'upcoming' },
    { time: '12:00 - 12:45', subject: 'Mathematics', class: 'Class 8-A', room: 'Room 105', status: 'upcoming' },
]

const pendingTasks = [
    { task: 'Mark Class 10-A homework', type: 'homework', due: 'Today', priority: 'high' },
    { task: 'Enter Class 9-B quiz grades', type: 'grades', due: 'Today', priority: 'high' },
    { task: 'Prepare Class 10-A weekly test', type: 'exam', due: 'Tomorrow', priority: 'medium' },
    { task: 'Submit monthly diary', type: 'admin', due: 'Jan 25', priority: 'low' },
    { task: 'Update Class 8-A attendance', type: 'attendance', due: 'Today', priority: 'high' },
]

const recentActivities = [
    { action: 'Homework assigned', details: 'Class 10-A - Quadratic Equations', time: '1 hour ago' },
    { action: 'Attendance marked', details: 'Class 10-B - 32/35 present', time: '2 hours ago' },
    { action: 'Grades updated', details: 'Class 9-A Quiz 1 results', time: '3 hours ago' },
    { action: 'Diary entry added', details: 'Class 10-A - Chapter 4 covered', time: 'Yesterday' },
]

export default function TeacherDashboard() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome back, Mr. Imran Ali! Here&apos;s your schedule for today.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" asChild>
                        <Link href="/school/teacher/attendance">
                            <UserCheck className="mr-2 h-4 w-4" />
                            Mark Attendance
                        </Link>
                    </Button>
                    <Button className="gradient-primary" asChild>
                        <Link href="/school/teacher/homework">
                            <FileText className="mr-2 h-4 w-4" />
                            Assign Homework
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Link href={stat.link} key={index}>
                        <Card className="card-hover cursor-pointer h-full">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.bgColor}`}>
                                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">{stat.description}</p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Today's Schedule */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Today&apos;s Schedule
                                </CardTitle>
                                <CardDescription>Your class schedule for today</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/school/teacher/timetable">View Full</Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {todaySchedule.map((period, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center gap-4 p-3 rounded-lg border ${period.status === 'current' ? 'border-primary bg-primary/5' :
                                            period.status === 'completed' ? 'opacity-60' : ''
                                        }`}
                                >
                                    <div className="w-24 text-sm font-medium">{period.time}</div>
                                    <div className="flex-1">
                                        <p className="font-medium">{period.subject}</p>
                                        <p className="text-xs text-muted-foreground">{period.class} • {period.room}</p>
                                    </div>
                                    {period.status === 'completed' ? (
                                        <Badge className="bg-green-500/10 text-green-500">
                                            <CheckCircle className="mr-1 h-3 w-3" />
                                            Done
                                        </Badge>
                                    ) : period.status === 'current' ? (
                                        <Badge className="bg-primary/10 text-primary">
                                            <Clock className="mr-1 h-3 w-3" />
                                            Now
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline">Upcoming</Badge>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Pending Tasks */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <ClipboardList className="h-5 w-5" />
                                    Pending Tasks
                                </CardTitle>
                                <CardDescription>Tasks requiring your attention</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {pendingTasks.map((task, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${task.type === 'homework' ? 'bg-blue-500/10' :
                                            task.type === 'grades' ? 'bg-green-500/10' :
                                                task.type === 'exam' ? 'bg-purple-500/10' :
                                                    task.type === 'attendance' ? 'bg-orange-500/10' : 'bg-gray-500/10'
                                        }`}>
                                        {task.type === 'homework' ? <FileText className="h-4 w-4 text-blue-500" /> :
                                            task.type === 'grades' ? <ClipboardList className="h-4 w-4 text-green-500" /> :
                                                task.type === 'exam' ? <BookOpen className="h-4 w-4 text-purple-500" /> :
                                                    task.type === 'attendance' ? <UserCheck className="h-4 w-4 text-orange-500" /> :
                                                        <Bell className="h-4 w-4 text-gray-500" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">{task.task}</p>
                                        <p className="text-xs text-muted-foreground">Due: {task.due}</p>
                                    </div>
                                    <Badge
                                        className={
                                            task.priority === 'high' ? 'bg-red-500/10 text-red-500' :
                                                task.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-500' :
                                                    'bg-gray-500/10 text-gray-500'
                                        }
                                    >
                                        {task.priority}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Recent Activity
                    </CardTitle>
                    <CardDescription>Your latest actions and updates</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {recentActivities.map((activity, index) => (
                            <div key={index} className="flex items-start gap-3 p-4 rounded-lg border">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                    <CheckCircle className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium text-sm">{activity.action}</p>
                                    <p className="text-xs text-muted-foreground">{activity.details}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-4">
                <Link href="/school/teacher/attendance">
                    <Card className="card-hover cursor-pointer">
                        <CardContent className="pt-6 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 mx-auto mb-3">
                                <UserCheck className="h-6 w-6 text-blue-500" />
                            </div>
                            <p className="font-medium">Mark Attendance</p>
                            <p className="text-xs text-muted-foreground">Record daily attendance</p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/school/teacher/homework">
                    <Card className="card-hover cursor-pointer">
                        <CardContent className="pt-6 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 mx-auto mb-3">
                                <FileText className="h-6 w-6 text-green-500" />
                            </div>
                            <p className="font-medium">Assign Homework</p>
                            <p className="text-xs text-muted-foreground">Create new assignments</p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/school/teacher/gradebook">
                    <Card className="card-hover cursor-pointer">
                        <CardContent className="pt-6 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10 mx-auto mb-3">
                                <ClipboardList className="h-6 w-6 text-purple-500" />
                            </div>
                            <p className="font-medium">Enter Grades</p>
                            <p className="text-xs text-muted-foreground">Update student marks</p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/school/teacher/diary">
                    <Card className="card-hover cursor-pointer">
                        <CardContent className="pt-6 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10 mx-auto mb-3">
                                <BookOpen className="h-6 w-6 text-orange-500" />
                            </div>
                            <p className="font-medium">Daily Diary</p>
                            <p className="text-xs text-muted-foreground">Record class activities</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    )
}
