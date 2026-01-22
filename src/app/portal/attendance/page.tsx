'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
    TrendingUp,
    AlertCircle,
} from 'lucide-react'

interface AttendanceRecord {
    date: string
    day: string
    status: 'present' | 'absent' | 'late' | 'leave'
    remarks?: string
}

interface ChildAttendance {
    childName: string
    class: string
    totalDays: number
    present: number
    absent: number
    late: number
    leave: number
    percentage: number
    records: AttendanceRecord[]
}

const sampleAttendance: ChildAttendance[] = [
    {
        childName: 'Ahmed Khan',
        class: 'Class 10-A',
        totalDays: 22,
        present: 19,
        absent: 1,
        late: 2,
        leave: 0,
        percentage: 86,
        records: [
            { date: '2024-01-20', day: 'Saturday', status: 'present' },
            { date: '2024-01-19', day: 'Friday', status: 'present' },
            { date: '2024-01-18', day: 'Thursday', status: 'late', remarks: 'Arrived 15 mins late' },
            { date: '2024-01-17', day: 'Wednesday', status: 'present' },
            { date: '2024-01-16', day: 'Tuesday', status: 'present' },
            { date: '2024-01-15', day: 'Monday', status: 'absent', remarks: 'Sick leave' },
            { date: '2024-01-13', day: 'Saturday', status: 'present' },
            { date: '2024-01-12', day: 'Friday', status: 'present' },
            { date: '2024-01-11', day: 'Thursday', status: 'present' },
            { date: '2024-01-10', day: 'Wednesday', status: 'late', remarks: 'Traffic' },
        ],
    },
    {
        childName: 'Fatima Khan',
        class: 'Class 7-B',
        totalDays: 22,
        present: 21,
        absent: 0,
        late: 1,
        leave: 0,
        percentage: 95,
        records: [
            { date: '2024-01-20', day: 'Saturday', status: 'present' },
            { date: '2024-01-19', day: 'Friday', status: 'present' },
            { date: '2024-01-18', day: 'Thursday', status: 'present' },
            { date: '2024-01-17', day: 'Wednesday', status: 'present' },
            { date: '2024-01-16', day: 'Tuesday', status: 'present' },
            { date: '2024-01-15', day: 'Monday', status: 'present' },
            { date: '2024-01-13', day: 'Saturday', status: 'late', remarks: 'Bus delay' },
            { date: '2024-01-12', day: 'Friday', status: 'present' },
            { date: '2024-01-11', day: 'Thursday', status: 'present' },
            { date: '2024-01-10', day: 'Wednesday', status: 'present' },
        ],
    },
]

export default function PortalAttendancePage() {
    const [attendanceData] = useState<ChildAttendance[]>(sampleAttendance)
    const [selectedChild, setSelectedChild] = useState<string>('Ahmed Khan')
    const [selectedMonth, setSelectedMonth] = useState<string>('january')

    const currentChild = attendanceData.find((c) => c.childName === selectedChild) || attendanceData[0]

    const getStatusBadge = (status: AttendanceRecord['status']) => {
        switch (status) {
            case 'present':
                return (
                    <Badge className="bg-green-500/10 text-green-500">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Present
                    </Badge>
                )
            case 'absent':
                return (
                    <Badge className="bg-red-500/10 text-red-500">
                        <XCircle className="mr-1 h-3 w-3" />
                        Absent
                    </Badge>
                )
            case 'late':
                return (
                    <Badge className="bg-yellow-500/10 text-yellow-500">
                        <Clock className="mr-1 h-3 w-3" />
                        Late
                    </Badge>
                )
            case 'leave':
                return (
                    <Badge className="bg-blue-500/10 text-blue-500">
                        <Calendar className="mr-1 h-3 w-3" />
                        Leave
                    </Badge>
                )
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
                    <p className="text-muted-foreground">
                        Track your children&apos;s attendance records
                    </p>
                </div>
                <div className="flex gap-3">
                    <Select value={selectedChild} onValueChange={setSelectedChild}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select child" />
                        </SelectTrigger>
                        <SelectContent>
                            {attendanceData.map((child) => (
                                <SelectItem key={child.childName} value={child.childName}>
                                    {child.childName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="january">January 2024</SelectItem>
                            <SelectItem value="december">December 2023</SelectItem>
                            <SelectItem value="november">November 2023</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Child Info */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">{currentChild.childName}</h2>
                            <p className="text-muted-foreground">{currentChild.class}</p>
                        </div>
                        <div className="text-right">
                            <div className={`text-3xl font-bold ${currentChild.percentage >= 90 ? 'text-green-500' : currentChild.percentage >= 75 ? 'text-yellow-500' : 'text-red-500'}`}>
                                {currentChild.percentage}%
                            </div>
                            <p className="text-sm text-muted-foreground">Attendance Rate</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-5">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Days</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{currentChild.totalDays}</div>
                        <p className="text-xs text-muted-foreground">Working days</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Present</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{currentChild.present}</div>
                        <p className="text-xs text-muted-foreground">Days attended</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Absent</CardTitle>
                        <XCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">{currentChild.absent}</div>
                        <p className="text-xs text-muted-foreground">Days missed</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Late</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-500">{currentChild.late}</div>
                        <p className="text-xs text-muted-foreground">Late arrivals</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Trend</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">+2%</div>
                        <p className="text-xs text-muted-foreground">vs last month</p>
                    </CardContent>
                </Card>
            </div>

            {/* Attendance Progress */}
            <Card>
                <CardHeader>
                    <CardTitle>Monthly Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span>Attendance Progress</span>
                            <span className="font-medium">{currentChild.present} / {currentChild.totalDays} days</span>
                        </div>
                        <Progress value={(currentChild.present / currentChild.totalDays) * 100} className="h-3" />
                    </div>
                    {currentChild.percentage < 75 && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            <p className="text-sm text-red-500">
                                Attendance is below 75%. Please ensure regular attendance.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Attendance Records Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Daily Records</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Day</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Remarks</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentChild.records.map((record, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">
                                        {new Date(record.date).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>{record.day}</TableCell>
                                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {record.remarks || '-'}
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
