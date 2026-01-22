'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Building2,
    Users,
    Calendar,
    Clock,
    ChevronRight,
    BookOpen,
} from 'lucide-react'
import Link from 'next/link'

interface ClassInfo {
    id: string
    name: string
    section: string
    subject: string
    students: number
    schedule: string
    room: string
    nextClass: string
}

const sampleClasses: ClassInfo[] = [
    {
        id: '1',
        name: 'Class 10',
        section: 'A',
        subject: 'Mathematics',
        students: 35,
        schedule: 'Mon, Wed, Fri - 8:00 AM',
        room: 'Room 201',
        nextClass: 'Today, 8:00 AM',
    },
    {
        id: '2',
        name: 'Class 10',
        section: 'B',
        subject: 'Mathematics',
        students: 32,
        schedule: 'Mon, Wed, Fri - 9:00 AM',
        room: 'Room 202',
        nextClass: 'Today, 9:00 AM',
    },
    {
        id: '3',
        name: 'Class 9',
        section: 'A',
        subject: 'Mathematics',
        students: 38,
        schedule: 'Tue, Thu - 10:00 AM',
        room: 'Room 105',
        nextClass: 'Tomorrow, 10:00 AM',
    },
    {
        id: '4',
        name: 'Class 9',
        section: 'B',
        subject: 'Mathematics',
        students: 36,
        schedule: 'Tue, Thu - 11:00 AM',
        room: 'Room 106',
        nextClass: 'Tomorrow, 11:00 AM',
    },
    {
        id: '5',
        name: 'Class 8',
        section: 'A',
        subject: 'Mathematics',
        students: 40,
        schedule: 'Mon, Wed - 2:00 PM',
        room: 'Room 103',
        nextClass: 'Today, 2:00 PM',
    },
]

export default function TeacherClassesPage() {
    const [classes] = useState<ClassInfo[]>(sampleClasses)
    const [filterGrade, setFilterGrade] = useState<string>('all')

    const filteredClasses = classes.filter((c) => {
        if (filterGrade === 'all') return true
        return c.name === filterGrade
    })

    const totalStudents = classes.reduce((acc, c) => acc + c.students, 0)

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Classes</h1>
                    <p className="text-muted-foreground">
                        Manage your assigned classes and students
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{classes.length}</div>
                        <p className="text-xs text-muted-foreground">Assigned to you</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalStudents}</div>
                        <p className="text-xs text-muted-foreground">Across all classes</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Today&apos;s Classes</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground">Scheduled for today</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Next Class</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8:00 AM</div>
                        <p className="text-xs text-muted-foreground">Class 10-A, Room 201</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filter */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                        <Select value={filterGrade} onValueChange={setFilterGrade}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by grade" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Grades</SelectItem>
                                <SelectItem value="Class 8">Class 8</SelectItem>
                                <SelectItem value="Class 9">Class 9</SelectItem>
                                <SelectItem value="Class 10">Class 10</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Classes Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Assigned Classes</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Class</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Schedule</TableHead>
                                <TableHead>Room</TableHead>
                                <TableHead className="text-center">Students</TableHead>
                                <TableHead>Next Class</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredClasses.map((classInfo) => (
                                <TableRow key={classInfo.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                                <Building2 className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{classInfo.name}</p>
                                                <p className="text-sm text-muted-foreground">Section {classInfo.section}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            <BookOpen className="mr-1 h-3 w-3" />
                                            {classInfo.subject}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm">{classInfo.schedule}</TableCell>
                                    <TableCell className="text-sm">{classInfo.room}</TableCell>
                                    <TableCell className="text-center font-medium">{classInfo.students}</TableCell>
                                    <TableCell>
                                        <Badge className={classInfo.nextClass.includes('Today') ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}>
                                            {classInfo.nextClass}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/school/teacher/classes/${classInfo.id}`}>
                                                View
                                                <ChevronRight className="ml-1 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
