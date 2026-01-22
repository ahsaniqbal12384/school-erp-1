'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    BookOpen,
    Calendar,
    Clock,
    CheckCircle,
    AlertCircle,
    FileText,
    User,
} from 'lucide-react'

interface HomeworkItem {
    id: string
    childName: string
    class: string
    subject: string
    teacher: string
    title: string
    description: string
    assignedDate: string
    dueDate: string
    status: 'pending' | 'submitted' | 'overdue' | 'graded'
    grade?: string
}

const sampleHomework: HomeworkItem[] = [
    {
        id: '1',
        childName: 'Ahmed Khan',
        class: 'Class 10-A',
        subject: 'Mathematics',
        teacher: 'Mr. Imran Ali',
        title: 'Quadratic Equations Practice',
        description: 'Complete Exercise 4.1, Questions 1-15. Show all working.',
        assignedDate: '2024-01-18',
        dueDate: '2024-01-22',
        status: 'pending',
    },
    {
        id: '2',
        childName: 'Ahmed Khan',
        class: 'Class 10-A',
        subject: 'Physics',
        teacher: 'Dr. Sana Malik',
        title: 'Motion in a Straight Line',
        description: 'Solve numerical problems from Chapter 3.',
        assignedDate: '2024-01-17',
        dueDate: '2024-01-21',
        status: 'submitted',
    },
    {
        id: '3',
        childName: 'Ahmed Khan',
        class: 'Class 10-A',
        subject: 'English',
        teacher: 'Mrs. Ayesha Khan',
        title: 'Essay Writing',
        description: 'Write an essay on "Climate Change" - minimum 500 words.',
        assignedDate: '2024-01-15',
        dueDate: '2024-01-19',
        status: 'graded',
        grade: 'A',
    },
    {
        id: '4',
        childName: 'Fatima Khan',
        class: 'Class 7-B',
        subject: 'Mathematics',
        teacher: 'Mr. Hassan Raza',
        title: 'Fractions and Decimals',
        description: 'Exercise 2.3, all questions.',
        assignedDate: '2024-01-18',
        dueDate: '2024-01-21',
        status: 'pending',
    },
    {
        id: '5',
        childName: 'Fatima Khan',
        class: 'Class 7-B',
        subject: 'Science',
        teacher: 'Ms. Fatima Noor',
        title: 'Plant Cell Diagram',
        description: 'Draw and label a plant cell with all organelles.',
        assignedDate: '2024-01-16',
        dueDate: '2024-01-18',
        status: 'overdue',
    },
    {
        id: '6',
        childName: 'Fatima Khan',
        class: 'Class 7-B',
        subject: 'Urdu',
        teacher: 'Mr. Ahmad Shah',
        title: 'Ghazal Analysis',
        description: 'Read and summarize the given ghazal.',
        assignedDate: '2024-01-17',
        dueDate: '2024-01-20',
        status: 'submitted',
    },
]

export default function PortalHomeworkPage() {
    const [homework] = useState<HomeworkItem[]>(sampleHomework)
    const [selectedChild, setSelectedChild] = useState<string>('all')
    const [statusFilter, setStatusFilter] = useState<string>('all')

    const filteredHomework = homework.filter((hw) => {
        const matchesChild = selectedChild === 'all' || hw.childName === selectedChild
        const matchesStatus = statusFilter === 'all' || hw.status === statusFilter
        return matchesChild && matchesStatus
    })

    const pendingCount = homework.filter((h) => h.status === 'pending').length
    const overdueCount = homework.filter((h) => h.status === 'overdue').length
    const submittedCount = homework.filter((h) => h.status === 'submitted').length
    const gradedCount = homework.filter((h) => h.status === 'graded').length

    const getStatusBadge = (status: HomeworkItem['status']) => {
        switch (status) {
            case 'pending':
                return (
                    <Badge className="bg-yellow-500/10 text-yellow-500">
                        <Clock className="mr-1 h-3 w-3" />
                        Pending
                    </Badge>
                )
            case 'submitted':
                return (
                    <Badge className="bg-blue-500/10 text-blue-500">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Submitted
                    </Badge>
                )
            case 'overdue':
                return (
                    <Badge className="bg-red-500/10 text-red-500">
                        <AlertCircle className="mr-1 h-3 w-3" />
                        Overdue
                    </Badge>
                )
            case 'graded':
                return (
                    <Badge className="bg-green-500/10 text-green-500">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Graded
                    </Badge>
                )
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Homework</h1>
                    <p className="text-muted-foreground">
                        Track your children&apos;s homework assignments
                    </p>
                </div>
                <div className="flex gap-3">
                    <Select value={selectedChild} onValueChange={setSelectedChild}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select child" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Children</SelectItem>
                            <SelectItem value="Ahmed Khan">Ahmed Khan</SelectItem>
                            <SelectItem value="Fatima Khan">Fatima Khan</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="submitted">Submitted</SelectItem>
                            <SelectItem value="overdue">Overdue</SelectItem>
                            <SelectItem value="graded">Graded</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-500">{pendingCount}</div>
                        <p className="text-xs text-muted-foreground">To be submitted</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">{overdueCount}</div>
                        <p className="text-xs text-muted-foreground">Past due date</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Submitted</CardTitle>
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-500">{submittedCount}</div>
                        <p className="text-xs text-muted-foreground">Awaiting grade</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Graded</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{gradedCount}</div>
                        <p className="text-xs text-muted-foreground">Completed</p>
                    </CardContent>
                </Card>
            </div>

            {/* Overdue Alert */}
            {overdueCount > 0 && (
                <Card className="border-red-500/50 bg-red-500/5">
                    <CardContent className="flex items-center gap-4 py-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                            <AlertCircle className="h-6 w-6 text-red-500" />
                        </div>
                        <div>
                            <p className="font-medium text-red-500">Overdue Homework</p>
                            <p className="text-sm text-muted-foreground">
                                {overdueCount} homework assignment(s) are past the due date
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Homework List */}
            <div className="space-y-4">
                {filteredHomework.map((hw) => (
                    <Card key={hw.id} className={hw.status === 'overdue' ? 'border-red-500/30' : ''}>
                        <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                                <div className="flex gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                        <BookOpen className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold">{hw.title}</h3>
                                            {getStatusBadge(hw.status)}
                                            {hw.grade && (
                                                <Badge className="bg-green-500 text-white">Grade: {hw.grade}</Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">{hw.description}</p>
                                        <div className="flex items-center gap-4 pt-2 text-sm">
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <User className="h-3 w-3" />
                                                {hw.childName}
                                            </div>
                                            <Badge variant="outline">{hw.subject}</Badge>
                                            <span className="text-muted-foreground">by {hw.teacher}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right space-y-1">
                                    <div className="flex items-center gap-1 text-sm">
                                        <Calendar className="h-3 w-3 text-muted-foreground" />
                                        <span className="text-muted-foreground">Due:</span>
                                        <span className={hw.status === 'overdue' ? 'text-red-500 font-medium' : ''}>
                                            {new Date(hw.dueDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Assigned: {new Date(hw.assignedDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            {hw.status === 'pending' && (
                                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                    <div className="flex items-center gap-2">
                                        <Checkbox id={`complete-${hw.id}`} />
                                        <label htmlFor={`complete-${hw.id}`} className="text-sm text-muted-foreground">
                                            Mark as completed
                                        </label>
                                    </div>
                                    <Button size="sm">View Details</Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
