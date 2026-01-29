'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
    Users,
    Download,
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
    TrendingUp,
} from 'lucide-react'
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts'

// Sample data
const weeklyData = [
    { day: 'Mon', present: 92, absent: 8 },
    { day: 'Tue', present: 94, absent: 6 },
    { day: 'Wed', present: 91, absent: 9 },
    { day: 'Thu', present: 95, absent: 5 },
    { day: 'Fri', present: 88, absent: 12 },
]

const monthlyTrend = [
    { month: 'Jul', rate: 89 },
    { month: 'Aug', rate: 91 },
    { month: 'Sep', rate: 93 },
    { month: 'Oct', rate: 92 },
    { month: 'Nov', rate: 94 },
    { month: 'Dec', rate: 91 },
]

const classWiseData = [
    { class: 'Class 10-A', total: 40, present: 38, absent: 2, rate: 95 },
    { class: 'Class 10-B', total: 42, present: 39, absent: 3, rate: 93 },
    { class: 'Class 9-A', total: 38, present: 35, absent: 3, rate: 92 },
    { class: 'Class 9-B', total: 40, present: 36, absent: 4, rate: 90 },
    { class: 'Class 8-A', total: 45, present: 40, absent: 5, rate: 89 },
    { class: 'Class 8-B', total: 43, present: 39, absent: 4, rate: 91 },
]

const frequentAbsentees = [
    { name: 'Ali Hassan', class: 'Class 9-B', admNo: 'STD-2024-022', absences: 12, lastPresent: '2024-12-15' },
    { name: 'Sana Malik', class: 'Class 10-A', admNo: 'STD-2024-008', absences: 10, lastPresent: '2024-12-18' },
    { name: 'Umar Khan', class: 'Class 8-A', admNo: 'STD-2024-045', absences: 9, lastPresent: '2024-12-17' },
    { name: 'Hina Raza', class: 'Class 9-A', admNo: 'STD-2024-033', absences: 8, lastPresent: '2024-12-19' },
    { name: 'Bilal Ahmed', class: 'Class 10-B', admNo: 'STD-2024-015', absences: 7, lastPresent: '2024-12-20' },
]

const statusDistribution = [
    { name: 'Present', value: 92, color: '#22c55e' },
    { name: 'Absent', value: 5, color: '#ef4444' },
    { name: 'Late', value: 2, color: '#f59e0b' },
    { name: 'Leave', value: 1, color: '#6b7280' },
]

export default function AttendanceReportsPage() {
    const [selectedClass, setSelectedClass] = useState('all')
    const [dateRange, setDateRange] = useState('week')

    const totalStudents = classWiseData.reduce((sum, c) => sum + c.total, 0)
    const totalPresent = classWiseData.reduce((sum, c) => sum + c.present, 0)
    const overallRate = Math.round((totalPresent / totalStudents) * 100)

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Attendance Reports</h1>
                    <p className="text-muted-foreground">
                        Student attendance analysis and trends
                    </p>
                </div>
                <div className="flex gap-3">
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Classes</SelectItem>
                            <SelectItem value="10-a">Class 10-A</SelectItem>
                            <SelectItem value="10-b">Class 10-B</SelectItem>
                            <SelectItem value="9-a">Class 9-A</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Date range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="week">This Week</SelectItem>
                            <SelectItem value="month">This Month</SelectItem>
                            <SelectItem value="quarter">This Quarter</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Overall Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{overallRate}%</div>
                        <div className="text-xs text-muted-foreground">Target: 95%</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Present Today</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalPresent}</div>
                        <div className="text-xs text-muted-foreground">Out of {totalStudents} students</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
                        <XCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">{totalStudents - totalPresent}</div>
                        <div className="text-xs text-muted-foreground">Need attention</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Chronic Absentees</CardTitle>
                        <Clock className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-500">{frequentAbsentees.length}</div>
                        <div className="text-xs text-muted-foreground">&gt;5 absences this month</div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Weekly Attendance</CardTitle>
                        <CardDescription>Daily attendance percentage for this week</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="present" fill="#22c55e" name="Present %" />
                                <Bar dataKey="absent" fill="#ef4444" name="Absent %" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Status Distribution</CardTitle>
                        <CardDescription>Today&apos;s attendance breakdown</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={statusDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={70}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex flex-wrap justify-center gap-3 mt-4">
                            {statusDistribution.map((item) => (
                                <div key={item.name} className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-xs">{item.name}: {item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Monthly Trend */}
            <Card>
                <CardHeader>
                    <CardTitle>Monthly Attendance Trend</CardTitle>
                    <CardDescription>Attendance rate over the past 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={monthlyTrend}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis domain={[80, 100]} />
                            <Tooltip />
                            <Line type="monotone" dataKey="rate" stroke="#3b82f6" strokeWidth={2} name="Attendance %" />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Class-wise Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Class-wise Attendance</CardTitle>
                    <CardDescription>Today&apos;s attendance by class</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Class</TableHead>
                                <TableHead>Total Students</TableHead>
                                <TableHead>Present</TableHead>
                                <TableHead>Absent</TableHead>
                                <TableHead>Rate</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {classWiseData.map((cls) => (
                                <TableRow key={cls.class}>
                                    <TableCell className="font-medium">{cls.class}</TableCell>
                                    <TableCell>{cls.total}</TableCell>
                                    <TableCell className="text-green-500">{cls.present}</TableCell>
                                    <TableCell className="text-red-500">{cls.absent}</TableCell>
                                    <TableCell>{cls.rate}%</TableCell>
                                    <TableCell>
                                        <Badge variant={cls.rate >= 90 ? 'default' : 'destructive'}>
                                            {cls.rate >= 90 ? 'Good' : 'Needs Attention'}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Frequent Absentees */}
            <Card>
                <CardHeader>
                    <CardTitle>Frequent Absentees</CardTitle>
                    <CardDescription>Students with high absence count this month</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Adm. No</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Absences</TableHead>
                                <TableHead>Last Present</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {frequentAbsentees.map((student) => (
                                <TableRow key={student.admNo}>
                                    <TableCell className="font-medium">{student.name}</TableCell>
                                    <TableCell>{student.admNo}</TableCell>
                                    <TableCell>{student.class}</TableCell>
                                    <TableCell>
                                        <Badge variant="destructive">{student.absences} days</Badge>
                                    </TableCell>
                                    <TableCell>{student.lastPresent}</TableCell>
                                    <TableCell>
                                        <Button size="sm" variant="outline">Contact Parent</Button>
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
