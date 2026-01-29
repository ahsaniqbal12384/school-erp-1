'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
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
    TrendingDown,
    AlertCircle,
    Download,
    CalendarDays,
    BarChart3,
} from 'lucide-react'

interface AttendanceRecord {
    date: string
    day: string
    status: 'present' | 'absent' | 'late' | 'leave' | 'holiday'
    remarks?: string
    markedBy?: string
    markedAt?: string
}

interface MonthlyStats {
    month: string
    year: number
    totalDays: number
    present: number
    absent: number
    late: number
    leave: number
    holidays: number
    percentage: number
}

interface ChildAttendance {
    childId: string
    childName: string
    class: string
    section: string
    rollNo: string
    admissionNo: string
    monthlyStats: MonthlyStats[]
    records: AttendanceRecord[]
}

// Generate sample attendance data
const generateAttendanceRecords = (month: number, year: number): AttendanceRecord[] => {
    const records: AttendanceRecord[] = []
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const workingDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day)
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
        const dayLower = dayName.toLowerCase()
        
        // Skip Sundays
        if (dayLower === 'sunday') {
            records.push({
                date: date.toISOString().split('T')[0],
                day: dayName,
                status: 'holiday',
                remarks: 'Weekly Off',
            })
            continue
        }

        // Random attendance with 90% present rate
        const rand = Math.random()
        let status: AttendanceRecord['status'] = 'present'
        let remarks = ''

        if (rand < 0.03) {
            status = 'absent'
            remarks = 'Not in school'
        } else if (rand < 0.06) {
            status = 'late'
            remarks = 'Arrived 15 mins late'
        } else if (rand < 0.08) {
            status = 'leave'
            remarks = 'Approved leave'
        }

        records.push({
            date: date.toISOString().split('T')[0],
            day: dayName,
            status,
            remarks,
            markedBy: 'Mr. Ahmed (Class Teacher)',
            markedAt: '08:30 AM',
        })
    }
    
    return records.reverse() // Most recent first
}

const sampleAttendance: ChildAttendance[] = [
    {
        childId: '1',
        childName: 'Ahmed Khan',
        class: 'Class 10',
        section: 'A',
        rollNo: '1001',
        admissionNo: 'ADM-2020-1001',
        monthlyStats: [
            { month: 'January', year: 2026, totalDays: 26, present: 23, absent: 1, late: 2, leave: 0, holidays: 4, percentage: 88 },
            { month: 'December', year: 2025, totalDays: 24, present: 22, absent: 1, late: 1, leave: 0, holidays: 5, percentage: 92 },
            { month: 'November', year: 2025, totalDays: 25, present: 24, absent: 0, late: 1, leave: 0, holidays: 4, percentage: 96 },
        ],
        records: generateAttendanceRecords(0, 2026),
    },
    {
        childId: '2',
        childName: 'Fatima Khan',
        class: 'Class 7',
        section: 'B',
        rollNo: '702',
        admissionNo: 'ADM-2022-0702',
        monthlyStats: [
            { month: 'January', year: 2026, totalDays: 26, present: 25, absent: 0, late: 1, leave: 0, holidays: 4, percentage: 96 },
            { month: 'December', year: 2025, totalDays: 24, present: 23, absent: 0, late: 1, leave: 0, holidays: 5, percentage: 96 },
            { month: 'November', year: 2025, totalDays: 25, present: 24, absent: 0, late: 0, leave: 1, holidays: 4, percentage: 96 },
        ],
        records: generateAttendanceRecords(0, 2026),
    },
]

export default function PortalAttendancePage() {
    const [attendanceData] = useState<ChildAttendance[]>(sampleAttendance)
    const [selectedChild, setSelectedChild] = useState<string>(sampleAttendance[0].childId)
    const [selectedMonth, setSelectedMonth] = useState<string>('january-2026')
    const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list')

    const currentChild = attendanceData.find((c) => c.childId === selectedChild) || attendanceData[0]
    const currentStats = currentChild.monthlyStats[0] // Current month stats

    // Calculate overall attendance percentage
    const overallPercentage = useMemo(() => {
        const totalPresent = currentChild.monthlyStats.reduce((acc, m) => acc + m.present, 0)
        const totalDays = currentChild.monthlyStats.reduce((acc, m) => acc + m.totalDays, 0)
        return totalDays > 0 ? Math.round((totalPresent / totalDays) * 100) : 0
    }, [currentChild])

    // Get trend (comparing current month to last month)
    const trend = useMemo(() => {
        if (currentChild.monthlyStats.length < 2) return 0
        return currentChild.monthlyStats[0].percentage - currentChild.monthlyStats[1].percentage
    }, [currentChild])

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
            case 'holiday':
                return (
                    <Badge variant="secondary">
                        <CalendarDays className="mr-1 h-3 w-3" />
                        Holiday
                    </Badge>
                )
        }
    }

    const getAttendanceColor = (percentage: number) => {
        if (percentage >= 90) return 'text-green-500'
        if (percentage >= 75) return 'text-yellow-500'
        return 'text-red-500'
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
                    <p className="text-muted-foreground">
                        View your child&apos;s attendance records and statistics
                    </p>
                </div>
                <div className="flex gap-3">
                    <Select value={selectedChild} onValueChange={setSelectedChild}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select child" />
                        </SelectTrigger>
                        <SelectContent>
                            {attendanceData.map((child) => (
                                <SelectItem key={child.childId} value={child.childId}>
                                    {child.childName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="january-2026">January 2026</SelectItem>
                            <SelectItem value="december-2025">December 2025</SelectItem>
                            <SelectItem value="november-2025">November 2025</SelectItem>
                            <SelectItem value="october-2025">October 2025</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon">
                        <Download className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Student Info Card */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-2xl font-bold text-primary">
                                    {currentChild.childName.charAt(0)}
                                </span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">{currentChild.childName}</h2>
                                <p className="text-muted-foreground">
                                    {currentChild.class}-{currentChild.section} | Roll No: {currentChild.rollNo}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Admission: {currentChild.admissionNo}
                                </p>
                            </div>
                        </div>
                        <div className="text-center md:text-right">
                            <div className={`text-4xl font-bold ${getAttendanceColor(overallPercentage)}`}>
                                {overallPercentage}%
                            </div>
                            <p className="text-sm text-muted-foreground">Overall Attendance</p>
                            <div className="flex items-center justify-center md:justify-end gap-1 mt-1">
                                {trend > 0 ? (
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                ) : trend < 0 ? (
                                    <TrendingDown className="h-4 w-4 text-red-500" />
                                ) : null}
                                <span className={`text-sm ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {trend >= 0 ? '+' : ''}{trend}% vs last month
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-6">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Working Days</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{currentStats.totalDays}</div>
                        <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Present</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{currentStats.present}</div>
                        <p className="text-xs text-muted-foreground">Days attended</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Absent</CardTitle>
                        <XCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">{currentStats.absent}</div>
                        <p className="text-xs text-muted-foreground">Days missed</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Late</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-500">{currentStats.late}</div>
                        <p className="text-xs text-muted-foreground">Late arrivals</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Leaves</CardTitle>
                        <CalendarDays className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-500">{currentStats.leave}</div>
                        <p className="text-xs text-muted-foreground">Approved leaves</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">This Month</CardTitle>
                        <BarChart3 className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${getAttendanceColor(currentStats.percentage)}`}>
                            {currentStats.percentage}%
                        </div>
                        <p className="text-xs text-muted-foreground">Attendance rate</p>
                    </CardContent>
                </Card>
            </div>

            {/* Attendance Progress */}
            <Card>
                <CardHeader>
                    <CardTitle>Monthly Overview</CardTitle>
                    <CardDescription>Attendance progress for {currentStats.month} {currentStats.year}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span>Attendance Progress</span>
                            <span className="font-medium">{currentStats.present} / {currentStats.totalDays} days</span>
                        </div>
                        <Progress value={(currentStats.present / currentStats.totalDays) * 100} className="h-3" />
                    </div>
                    
                    {/* Alerts based on attendance */}
                    {currentStats.percentage < 75 && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            <div>
                                <p className="text-sm font-medium text-red-500">Low Attendance Warning</p>
                                <p className="text-xs text-muted-foreground">
                                    Attendance is below 75%. This may affect exam eligibility. Please ensure regular attendance.
                                </p>
                            </div>
                        </div>
                    )}
                    
                    {currentStats.percentage >= 90 && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <div>
                                <p className="text-sm font-medium text-green-500">Excellent Attendance!</p>
                                <p className="text-xs text-muted-foreground">
                                    Great job! Keep up the regular attendance. Students with 95%+ attendance may be eligible for special rewards.
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Monthly Comparison */}
            <Card>
                <CardHeader>
                    <CardTitle>Monthly Comparison</CardTitle>
                    <CardDescription>Compare attendance across months</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {currentChild.monthlyStats.map((month, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="w-24 text-sm font-medium">{month.month}</div>
                                <div className="flex-1">
                                    <Progress value={month.percentage} className="h-2" />
                                </div>
                                <div className={`w-12 text-right text-sm font-bold ${getAttendanceColor(month.percentage)}`}>
                                    {month.percentage}%
                                </div>
                                <div className="w-24 text-xs text-muted-foreground">
                                    {month.present}/{month.totalDays} days
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Daily Attendance Records Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Daily Records</CardTitle>
                            <CardDescription>Detailed attendance log for the selected month</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Day</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Marked By</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>Remarks</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentChild.records.slice(0, 15).map((record, index) => (
                                <TableRow 
                                    key={index}
                                    className={
                                        record.status === 'absent' ? 'bg-red-500/5' : 
                                        record.status === 'late' ? 'bg-yellow-500/5' : 
                                        record.status === 'holiday' ? 'bg-muted/30' : ''
                                    }
                                >
                                    <TableCell className="font-medium">
                                        {new Date(record.date).toLocaleDateString('en-PK', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </TableCell>
                                    <TableCell>{record.day}</TableCell>
                                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {record.markedBy || '-'}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {record.markedAt || '-'}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {record.remarks || '-'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Legend */}
            <Card>
                <CardContent className="py-4">
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                        <span className="font-medium">Legend:</span>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span>Present</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span>Absent</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <span>Late</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span>Leave</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-muted"></div>
                            <span>Holiday/Off</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
