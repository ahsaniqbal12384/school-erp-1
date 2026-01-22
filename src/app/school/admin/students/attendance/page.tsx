'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { Checkbox } from '@/components/ui/checkbox'
import {
    UserCheck,
    Search,
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    Users,
    Save,
    Download,
    GraduationCap,
} from 'lucide-react'

interface Student {
    id: string
    rollNo: string
    name: string
    class: string
    section: string
    status: 'present' | 'absent' | 'late' | 'leave' | null
}

const sampleStudents: Student[] = [
    { id: '1', rollNo: '1001', name: 'Ahmed Khan', class: 'Class 10', section: 'A', status: 'present' },
    { id: '2', rollNo: '1002', name: 'Fatima Ali', class: 'Class 10', section: 'A', status: 'present' },
    { id: '3', rollNo: '1003', name: 'Hassan Raza', class: 'Class 10', section: 'A', status: 'absent' },
    { id: '4', rollNo: '1004', name: 'Sara Ahmed', class: 'Class 10', section: 'A', status: 'present' },
    { id: '5', rollNo: '1005', name: 'Usman Tariq', class: 'Class 10', section: 'A', status: 'late' },
    { id: '6', rollNo: '1006', name: 'Ayesha Malik', class: 'Class 10', section: 'A', status: 'present' },
    { id: '7', rollNo: '1007', name: 'Ali Hassan', class: 'Class 10', section: 'A', status: 'present' },
    { id: '8', rollNo: '1008', name: 'Zainab Shah', class: 'Class 10', section: 'A', status: 'leave' },
    { id: '9', rollNo: '1009', name: 'Bilal Ahmed', class: 'Class 10', section: 'A', status: 'present' },
    { id: '10', rollNo: '1010', name: 'Maryam Khan', class: 'Class 10', section: 'A', status: 'present' },
]

export default function StudentAttendancePage() {
    const [students, setStudents] = useState<Student[]>(sampleStudents)
    const [selectedClass, setSelectedClass] = useState<string>('10-A')
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
    const [searchQuery, setSearchQuery] = useState('')

    const filteredStudents = students.filter((student) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.rollNo.includes(searchQuery)
    )

    const presentCount = students.filter((s) => s.status === 'present').length
    const absentCount = students.filter((s) => s.status === 'absent').length
    const lateCount = students.filter((s) => s.status === 'late').length
    const leaveCount = students.filter((s) => s.status === 'leave').length

    const updateStatus = (studentId: string, status: Student['status']) => {
        setStudents((prev) =>
            prev.map((s) => (s.id === studentId ? { ...s, status } : s))
        )
    }

    const markAllPresent = () => {
        setStudents((prev) => prev.map((s) => ({ ...s, status: 'present' })))
    }

    const getStatusBadge = (status: Student['status']) => {
        switch (status) {
            case 'present':
                return <Badge className="bg-green-500/10 text-green-500">Present</Badge>
            case 'absent':
                return <Badge className="bg-red-500/10 text-red-500">Absent</Badge>
            case 'late':
                return <Badge className="bg-yellow-500/10 text-yellow-500">Late</Badge>
            case 'leave':
                return <Badge className="bg-blue-500/10 text-blue-500">Leave</Badge>
            default:
                return <Badge variant="outline">Not Marked</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Student Attendance</h1>
                    <p className="text-muted-foreground">
                        Record daily student attendance by class
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={markAllPresent}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark All Present
                    </Button>
                    <Button className="gradient-primary">
                        <Save className="mr-2 h-4 w-4" />
                        Save Attendance
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-5">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{students.length}</div>
                        <p className="text-xs text-muted-foreground">In this class</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Present</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{presentCount}</div>
                        <p className="text-xs text-muted-foreground">{((presentCount / students.length) * 100).toFixed(0)}%</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Absent</CardTitle>
                        <XCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">{absentCount}</div>
                        <p className="text-xs text-muted-foreground">{((absentCount / students.length) * 100).toFixed(0)}%</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Late</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-500">{lateCount}</div>
                        <p className="text-xs text-muted-foreground">Arrived late</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">On Leave</CardTitle>
                        <Calendar className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-500">{leaveCount}</div>
                        <p className="text-xs text-muted-foreground">Approved leave</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search students..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={selectedClass} onValueChange={setSelectedClass}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Class" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10-A">Class 10-A</SelectItem>
                                <SelectItem value="10-B">Class 10-B</SelectItem>
                                <SelectItem value="9-A">Class 9-A</SelectItem>
                                <SelectItem value="9-B">Class 9-B</SelectItem>
                                <SelectItem value="8-A">Class 8-A</SelectItem>
                                <SelectItem value="8-B">Class 8-B</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-[180px]"
                        />
                        <Button variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Attendance Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <UserCheck className="h-5 w-5" />
                            Class 10-A - Attendance Sheet
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Roll No</TableHead>
                                <TableHead>Student Name</TableHead>
                                <TableHead className="text-center">Present</TableHead>
                                <TableHead className="text-center">Absent</TableHead>
                                <TableHead className="text-center">Late</TableHead>
                                <TableHead className="text-center">Leave</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStudents.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell className="font-medium">{student.rollNo}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                                <GraduationCap className="h-4 w-4 text-primary" />
                                            </div>
                                            {student.name}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Checkbox
                                            checked={student.status === 'present'}
                                            onCheckedChange={() => updateStatus(student.id, 'present')}
                                        />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Checkbox
                                            checked={student.status === 'absent'}
                                            onCheckedChange={() => updateStatus(student.id, 'absent')}
                                        />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Checkbox
                                            checked={student.status === 'late'}
                                            onCheckedChange={() => updateStatus(student.id, 'late')}
                                        />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Checkbox
                                            checked={student.status === 'leave'}
                                            onCheckedChange={() => updateStatus(student.id, 'leave')}
                                        />
                                    </TableCell>
                                    <TableCell>{getStatusBadge(student.status)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
