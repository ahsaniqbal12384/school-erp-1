'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs'
import {
    Users,
    TrendingUp,
    TrendingDown,
    Calendar,
    Clock,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Download,
    Filter,
    BarChart3,
    PieChart,
    Activity,
    UserCheck,
    UserX,
} from 'lucide-react'

// Types
interface ClassAttendance {
    id: string
    name: string
    totalStudents: number
    present: number
    absent: number
    late: number
    leave: number
    percentage: number
    trend: 'up' | 'down' | 'stable'
    trendValue: number
}

interface StudentAttendanceAlert {
    id: string
    name: string
    class: string
    percentage: number
    absentDays: number
    lastAbsent: string
    trend: 'improving' | 'declining' | 'stable'
    parentNotified: boolean
}

interface DailyTrend {
    date: string
    day: string
    present: number
    absent: number
    late: number
    percentage: number
}

interface MonthlyStats {
    month: string
    workingDays: number
    avgAttendance: number
    totalAbsent: number
    totalLate: number
}

// Sample data
const classAttendanceData: ClassAttendance[] = [
    { id: '1', name: 'Class 1-A', totalStudents: 45, present: 42, absent: 2, late: 1, leave: 0, percentage: 93.3, trend: 'up', trendValue: 2.1 },
    { id: '2', name: 'Class 1-B', totalStudents: 44, present: 40, absent: 3, late: 1, leave: 0, percentage: 90.9, trend: 'down', trendValue: 1.5 },
    { id: '3', name: 'Class 2-A', totalStudents: 42, present: 39, absent: 2, late: 1, leave: 0, percentage: 92.9, trend: 'stable', trendValue: 0.2 },
    { id: '4', name: 'Class 2-B', totalStudents: 43, present: 41, absent: 1, late: 1, leave: 0, percentage: 95.3, trend: 'up', trendValue: 1.8 },
    { id: '5', name: 'Class 3-A', totalStudents: 40, present: 36, absent: 3, late: 1, leave: 0, percentage: 90.0, trend: 'down', trendValue: 2.3 },
    { id: '6', name: 'Class 3-B', totalStudents: 41, present: 38, absent: 2, late: 1, leave: 0, percentage: 92.7, trend: 'up', trendValue: 1.1 },
    { id: '7', name: 'Class 4-A', totalStudents: 38, present: 35, absent: 2, late: 1, leave: 0, percentage: 92.1, trend: 'stable', trendValue: 0.5 },
    { id: '8', name: 'Class 4-B', totalStudents: 39, present: 37, absent: 1, late: 1, leave: 0, percentage: 94.9, trend: 'up', trendValue: 2.0 },
    { id: '9', name: 'Class 5-A', totalStudents: 36, present: 32, absent: 3, late: 1, leave: 0, percentage: 88.9, trend: 'down', trendValue: 3.2 },
    { id: '10', name: 'Class 5-B', totalStudents: 37, present: 35, absent: 1, late: 1, leave: 0, percentage: 94.6, trend: 'up', trendValue: 1.4 },
    { id: '11', name: 'Class 6-A', totalStudents: 35, present: 33, absent: 1, late: 1, leave: 0, percentage: 94.3, trend: 'stable', trendValue: 0.3 },
    { id: '12', name: 'Class 6-B', totalStudents: 36, present: 34, absent: 1, late: 1, leave: 0, percentage: 94.4, trend: 'up', trendValue: 1.2 },
    { id: '13', name: 'Class 7-A', totalStudents: 34, present: 30, absent: 3, late: 1, leave: 0, percentage: 88.2, trend: 'down', trendValue: 2.8 },
    { id: '14', name: 'Class 7-B', totalStudents: 35, present: 33, absent: 1, late: 1, leave: 0, percentage: 94.3, trend: 'up', trendValue: 1.6 },
    { id: '15', name: 'Class 8-A', totalStudents: 33, present: 31, absent: 1, late: 1, leave: 0, percentage: 93.9, trend: 'stable', trendValue: 0.4 },
    { id: '16', name: 'Class 8-B', totalStudents: 34, present: 32, absent: 1, late: 1, leave: 0, percentage: 94.1, trend: 'up', trendValue: 1.3 },
    { id: '17', name: 'Class 9-A', totalStudents: 32, present: 28, absent: 3, late: 1, leave: 0, percentage: 87.5, trend: 'down', trendValue: 3.5 },
    { id: '18', name: 'Class 9-B', totalStudents: 33, present: 31, absent: 1, late: 1, leave: 0, percentage: 93.9, trend: 'up', trendValue: 1.5 },
    { id: '19', name: 'Class 10-A', totalStudents: 31, present: 29, absent: 1, late: 1, leave: 0, percentage: 93.5, trend: 'stable', trendValue: 0.6 },
    { id: '20', name: 'Class 10-B', totalStudents: 32, present: 30, absent: 1, late: 1, leave: 0, percentage: 93.8, trend: 'up', trendValue: 1.1 },
]

const lowAttendanceStudents: StudentAttendanceAlert[] = [
    { id: '1', name: 'Ali Ahmed', class: 'Class 5-A', percentage: 65, absentDays: 18, lastAbsent: '2026-01-28', trend: 'declining', parentNotified: true },
    { id: '2', name: 'Sara Khan', class: 'Class 7-A', percentage: 68, absentDays: 16, lastAbsent: '2026-01-29', trend: 'declining', parentNotified: true },
    { id: '3', name: 'Hassan Malik', class: 'Class 9-A', percentage: 70, absentDays: 15, lastAbsent: '2026-01-27', trend: 'stable', parentNotified: true },
    { id: '4', name: 'Fatima Zahra', class: 'Class 3-A', percentage: 71, absentDays: 14, lastAbsent: '2026-01-26', trend: 'improving', parentNotified: false },
    { id: '5', name: 'Usman Ali', class: 'Class 1-B', percentage: 72, absentDays: 14, lastAbsent: '2026-01-28', trend: 'declining', parentNotified: true },
    { id: '6', name: 'Ayesha Bibi', class: 'Class 6-A', percentage: 73, absentDays: 13, lastAbsent: '2026-01-25', trend: 'improving', parentNotified: false },
    { id: '7', name: 'Bilal Hussain', class: 'Class 8-B', percentage: 74, absentDays: 13, lastAbsent: '2026-01-24', trend: 'stable', parentNotified: false },
    { id: '8', name: 'Zainab Noor', class: 'Class 2-A', percentage: 74, absentDays: 13, lastAbsent: '2026-01-29', trend: 'declining', parentNotified: true },
]

const dailyTrendData: DailyTrend[] = [
    { date: '2026-01-20', day: 'Mon', present: 2845, absent: 87, late: 45, percentage: 95.6 },
    { date: '2026-01-21', day: 'Tue', present: 2890, absent: 65, late: 32, percentage: 96.7 },
    { date: '2026-01-22', day: 'Wed', present: 2860, absent: 78, late: 38, percentage: 95.9 },
    { date: '2026-01-23', day: 'Thu', present: 2820, absent: 92, late: 52, percentage: 95.2 },
    { date: '2026-01-24', day: 'Fri', present: 2750, absent: 125, late: 68, percentage: 93.4 },
    { date: '2026-01-25', day: 'Sat', present: 2830, absent: 85, late: 42, percentage: 95.7 },
    { date: '2026-01-27', day: 'Mon', present: 2875, absent: 72, late: 38, percentage: 96.2 },
    { date: '2026-01-28', day: 'Tue', present: 2855, absent: 82, late: 45, percentage: 95.7 },
    { date: '2026-01-29', day: 'Wed', present: 2840, absent: 88, late: 48, percentage: 95.4 },
]

const monthlyStatsData: MonthlyStats[] = [
    { month: 'January 2026', workingDays: 24, avgAttendance: 95.2, totalAbsent: 3456, totalLate: 1234 },
    { month: 'December 2025', workingDays: 22, avgAttendance: 94.8, totalAbsent: 3678, totalLate: 1345 },
    { month: 'November 2025', workingDays: 25, avgAttendance: 95.5, totalAbsent: 3234, totalLate: 1123 },
    { month: 'October 2025', workingDays: 26, avgAttendance: 96.1, totalAbsent: 2987, totalLate: 1067 },
]

export default function AttendanceReportsPage() {
    const [selectedMonth, setSelectedMonth] = useState('January 2026')
    const [selectedClass, setSelectedClass] = useState('all')

    // Calculate totals
    const totals = useMemo(() => {
        const totalStudents = classAttendanceData.reduce((acc, c) => acc + c.totalStudents, 0)
        const totalPresent = classAttendanceData.reduce((acc, c) => acc + c.present, 0)
        const totalAbsent = classAttendanceData.reduce((acc, c) => acc + c.absent, 0)
        const totalLate = classAttendanceData.reduce((acc, c) => acc + c.late, 0)
        const overallPercentage = ((totalPresent / totalStudents) * 100).toFixed(1)
        
        return {
            totalStudents,
            totalPresent,
            totalAbsent,
            totalLate,
            overallPercentage: parseFloat(overallPercentage),
        }
    }, [])

    // Filter classes
    const filteredClasses = useMemo(() => {
        if (selectedClass === 'all') return classAttendanceData
        return classAttendanceData.filter(c => c.name.includes(selectedClass))
    }, [selectedClass])

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Attendance Analytics</h1>
                    <p className="text-muted-foreground">
                        Comprehensive attendance reports and insights
                    </p>
                </div>
                <div className="flex gap-2">
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                        <SelectContent>
                            {monthlyStatsData.map(m => (
                                <SelectItem key={m.month} value={m.month}>{m.month}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Students</p>
                                <p className="text-2xl font-bold">{totals.totalStudents.toLocaleString()}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
                                <UserCheck className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Present Today</p>
                                <p className="text-2xl font-bold text-green-600">{totals.totalPresent.toLocaleString()}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
                                <UserX className="h-6 w-6 text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Absent Today</p>
                                <p className="text-2xl font-bold text-red-600">{totals.totalAbsent}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/20">
                                <Clock className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Late Today</p>
                                <p className="text-2xl font-bold text-yellow-600">{totals.totalLate}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20">
                                <Activity className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Overall Rate</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-2xl font-bold">{totals.overallPercentage}%</p>
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="classes" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="classes" className="gap-2">
                        <BarChart3 className="h-4 w-4" />
                        By Class
                    </TabsTrigger>
                    <TabsTrigger value="trends" className="gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Daily Trends
                    </TabsTrigger>
                    <TabsTrigger value="alerts" className="gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Low Attendance
                    </TabsTrigger>
                    <TabsTrigger value="monthly" className="gap-2">
                        <Calendar className="h-4 w-4" />
                        Monthly Report
                    </TabsTrigger>
                </TabsList>

                {/* Class-wise Attendance */}
                <TabsContent value="classes">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Class-wise Attendance</CardTitle>
                                    <CardDescription>Today&apos;s attendance breakdown by class</CardDescription>
                                </div>
                                <Select value={selectedClass} onValueChange={setSelectedClass}>
                                    <SelectTrigger className="w-[150px]">
                                        <SelectValue placeholder="Filter" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Classes</SelectItem>
                                        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map(grade => (
                                            <SelectItem key={grade} value={`Class ${grade}`}>Class {grade}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                {filteredClasses.map((classData) => (
                                    <div
                                        key={classData.id}
                                        className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-semibold">{classData.name}</h4>
                                            <div className="flex items-center gap-1">
                                                {classData.trend === 'up' ? (
                                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                                ) : classData.trend === 'down' ? (
                                                    <TrendingDown className="h-4 w-4 text-red-500" />
                                                ) : (
                                                    <Activity className="h-4 w-4 text-gray-500" />
                                                )}
                                                <span className={`text-xs ${
                                                    classData.trend === 'up' ? 'text-green-500' :
                                                    classData.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                                                }`}>
                                                    {classData.trend === 'up' ? '+' : classData.trend === 'down' ? '-' : ''}
                                                    {classData.trendValue}%
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Attendance</span>
                                                <span className="font-medium">{classData.percentage}%</span>
                                            </div>
                                            <Progress value={classData.percentage} className="h-2" />
                                        </div>
                                        
                                        <div className="flex gap-2 mt-3">
                                            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30">
                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                {classData.present} Present
                                            </Badge>
                                            <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900/30">
                                                <XCircle className="h-3 w-3 mr-1" />
                                                {classData.absent} Absent
                                            </Badge>
                                            {classData.late > 0 && (
                                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30">
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    {classData.late} Late
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Daily Trends */}
                <TabsContent value="trends">
                    <Card>
                        <CardHeader>
                            <CardTitle>Daily Attendance Trend</CardTitle>
                            <CardDescription>Attendance patterns over the last 2 weeks</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Day</TableHead>
                                        <TableHead className="text-center">Present</TableHead>
                                        <TableHead className="text-center">Absent</TableHead>
                                        <TableHead className="text-center">Late</TableHead>
                                        <TableHead className="text-center">Rate</TableHead>
                                        <TableHead>Progress</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {dailyTrendData.map((day) => (
                                        <TableRow key={day.date}>
                                            <TableCell className="font-medium">
                                                {new Date(day.date).toLocaleDateString('en-GB', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                })}
                                            </TableCell>
                                            <TableCell>{day.day}</TableCell>
                                            <TableCell className="text-center">
                                                <span className="text-green-600 font-medium">{day.present}</span>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className="text-red-600 font-medium">{day.absent}</span>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className="text-yellow-600 font-medium">{day.late}</span>
                                            </TableCell>
                                            <TableCell className="text-center font-medium">
                                                {day.percentage}%
                                            </TableCell>
                                            <TableCell className="w-32">
                                                <Progress value={day.percentage} className="h-2" />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {/* Visual Chart Placeholder */}
                            <div className="mt-6 p-6 border rounded-lg bg-muted/30">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-semibold">Attendance Visualization</h4>
                                    <div className="flex gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                            <span>Present</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                            <span>Absent</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                            <span>Late</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-end gap-2 h-40">
                                    {dailyTrendData.map((day) => (
                                        <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                                            <div className="w-full flex flex-col gap-0.5">
                                                <div
                                                    className="bg-green-500 rounded-t"
                                                    style={{ height: `${(day.present / 30)}px` }}
                                                ></div>
                                                <div
                                                    className="bg-red-500"
                                                    style={{ height: `${day.absent / 2}px` }}
                                                ></div>
                                                <div
                                                    className="bg-yellow-500 rounded-b"
                                                    style={{ height: `${day.late / 2}px` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs text-muted-foreground">{day.day}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Low Attendance Alerts */}
                <TabsContent value="alerts">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                                        Low Attendance Students
                                    </CardTitle>
                                    <CardDescription>
                                        Students with attendance below 75% threshold
                                    </CardDescription>
                                </div>
                                <Badge variant="destructive">{lowAttendanceStudents.length} Students</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student Name</TableHead>
                                        <TableHead>Class</TableHead>
                                        <TableHead className="text-center">Attendance %</TableHead>
                                        <TableHead className="text-center">Days Absent</TableHead>
                                        <TableHead className="text-center">Last Absent</TableHead>
                                        <TableHead className="text-center">Trend</TableHead>
                                        <TableHead className="text-center">Parent Notified</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {lowAttendanceStudents.map((student) => (
                                        <TableRow key={student.id}>
                                            <TableCell className="font-medium">{student.name}</TableCell>
                                            <TableCell>{student.class}</TableCell>
                                            <TableCell className="text-center">
                                                <Badge 
                                                    variant={student.percentage < 70 ? "destructive" : "secondary"}
                                                    className={student.percentage < 70 ? "" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30"}
                                                >
                                                    {student.percentage}%
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center text-red-600 font-medium">
                                                {student.absentDays}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {new Date(student.lastAbsent).toLocaleDateString('en-GB', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                })}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {student.trend === 'improving' ? (
                                                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30">
                                                        <TrendingUp className="h-3 w-3 mr-1" />
                                                        Improving
                                                    </Badge>
                                                ) : student.trend === 'declining' ? (
                                                    <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30">
                                                        <TrendingDown className="h-3 w-3 mr-1" />
                                                        Declining
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline">Stable</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {student.parentNotified ? (
                                                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                                                ) : (
                                                    <XCircle className="h-5 w-5 text-gray-400 mx-auto" />
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="outline" size="sm">
                                                    Send SMS
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Monthly Report */}
                <TabsContent value="monthly">
                    <div className="grid gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Monthly Attendance Summary</CardTitle>
                                <CardDescription>Historical attendance data by month</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Month</TableHead>
                                            <TableHead className="text-center">Working Days</TableHead>
                                            <TableHead className="text-center">Avg Attendance</TableHead>
                                            <TableHead className="text-center">Total Absences</TableHead>
                                            <TableHead className="text-center">Total Late</TableHead>
                                            <TableHead>Performance</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {monthlyStatsData.map((month, index) => (
                                            <TableRow key={month.month}>
                                                <TableCell className="font-medium">{month.month}</TableCell>
                                                <TableCell className="text-center">{month.workingDays}</TableCell>
                                                <TableCell className="text-center">
                                                    <Badge className={month.avgAttendance >= 95 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                                                        {month.avgAttendance}%
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-center text-red-600">
                                                    {month.totalAbsent.toLocaleString()}
                                                </TableCell>
                                                <TableCell className="text-center text-yellow-600">
                                                    {month.totalLate.toLocaleString()}
                                                </TableCell>
                                                <TableCell>
                                                    <Progress value={month.avgAttendance} className="h-2 w-24" />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {/* Summary Cards */}
                        <div className="grid gap-4 md:grid-cols-3">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Best Day</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-green-600">Tuesday</div>
                                    <p className="text-sm text-muted-foreground">
                                        Avg attendance: 96.7%
                                    </p>
                                </CardContent>
                            </Card>
                            
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Lowest Day</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-red-600">Friday</div>
                                    <p className="text-sm text-muted-foreground">
                                        Avg attendance: 93.4%
                                    </p>
                                </CardContent>
                            </Card>
                            
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Improvement</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="h-8 w-8 text-green-500" />
                                        <span className="text-3xl font-bold text-green-600">+1.3%</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        vs last month
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
