'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
    GraduationCap,
    Calendar,
    BookOpen,
    TrendingUp,
    Clock,
    ChevronRight,
    Users,
    Award,
} from 'lucide-react'
import Link from 'next/link'

interface Child {
    id: string
    name: string
    class: string
    section: string
    rollNo: string
    attendance: number
    lastGrade: string
    pendingFees: number
    photo: string
}

const sampleChildren: Child[] = [
    {
        id: '1',
        name: 'Ahmed Khan',
        class: 'Class 10',
        section: 'A',
        rollNo: '1025',
        attendance: 92,
        lastGrade: 'A',
        pendingFees: 15000,
        photo: 'AK',
    },
    {
        id: '2',
        name: 'Fatima Khan',
        class: 'Class 7',
        section: 'B',
        rollNo: '712',
        attendance: 96,
        lastGrade: 'A+',
        pendingFees: 0,
        photo: 'FK',
    },
]

export default function ChildrenPage() {
    const [children] = useState<Child[]>(sampleChildren)

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Children</h1>
                    <p className="text-muted-foreground">
                        View your children&apos;s academic progress and activities
                    </p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Children</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{children.length}</div>
                        <p className="text-xs text-muted-foreground">Enrolled in school</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">
                            {Math.round(children.reduce((acc, c) => acc + c.attendance, 0) / children.length)}%
                        </div>
                        <p className="text-xs text-muted-foreground">This semester</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Academic Standing</CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-500">Excellent</div>
                        <p className="text-xs text-muted-foreground">Overall performance</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            Rs. {children.reduce((acc, c) => acc + c.pendingFees, 0).toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">Total outstanding</p>
                    </CardContent>
                </Card>
            </div>

            {/* Children Cards */}
            <div className="grid gap-6 md:grid-cols-2">
                {children.map((child) => (
                    <Card key={child.id} className="card-hover">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarFallback className="text-lg bg-primary/10 text-primary">
                                            {child.photo}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-xl">{child.name}</CardTitle>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="outline">{child.class} - {child.section}</Badge>
                                            <span className="text-sm text-muted-foreground">Roll #{child.rollNo}</span>
                                        </div>
                                    </div>
                                </div>
                                <Badge className={child.lastGrade === 'A+' ? 'bg-green-500' : 'bg-blue-500'}>
                                    Grade: {child.lastGrade}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Attendance */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Attendance</span>
                                    <span className="font-medium">{child.attendance}%</span>
                                </div>
                                <Progress value={child.attendance} className="h-2" />
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-3 gap-4 pt-2">
                                <div className="text-center p-3 rounded-lg bg-muted/50">
                                    <Calendar className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                                    <p className="text-xs text-muted-foreground">Attendance</p>
                                    <p className="font-medium">{child.attendance}%</p>
                                </div>
                                <div className="text-center p-3 rounded-lg bg-muted/50">
                                    <BookOpen className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                                    <p className="text-xs text-muted-foreground">Homework</p>
                                    <p className="font-medium">3 pending</p>
                                </div>
                                <div className="text-center p-3 rounded-lg bg-muted/50">
                                    <TrendingUp className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                                    <p className="text-xs text-muted-foreground">Rank</p>
                                    <p className="font-medium">#5</p>
                                </div>
                            </div>

                            {/* Pending Fees Alert */}
                            {child.pendingFees > 0 && (
                                <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                                    <div>
                                        <p className="text-sm font-medium text-yellow-600">Pending Fees</p>
                                        <p className="text-xs text-muted-foreground">Due this month</p>
                                    </div>
                                    <span className="font-bold text-yellow-600">Rs. {child.pendingFees.toLocaleString()}</span>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <Button variant="outline" className="flex-1" asChild>
                                    <Link href={`/portal/children/${child.id}/attendance`}>
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Attendance
                                    </Link>
                                </Button>
                                <Button variant="outline" className="flex-1" asChild>
                                    <Link href={`/portal/children/${child.id}/results`}>
                                        <GraduationCap className="mr-2 h-4 w-4" />
                                        Results
                                    </Link>
                                </Button>
                                <Button className="gradient-primary" asChild>
                                    <Link href={`/portal/children/${child.id}`}>
                                        View All
                                        <ChevronRight className="ml-1 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
