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
    Briefcase,
    Calendar,
    Clock,
    TrendingUp,
    Download,
    CheckCircle,
    XCircle,
    AlertCircle,
    DollarSign,
} from 'lucide-react'
import {
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
    LineChart,
    Line,
    Legend,
} from 'recharts'

const departmentData = [
    { dept: 'Teaching', total: 45, present: 42, onLeave: 3 },
    { dept: 'Admin', total: 12, present: 11, onLeave: 1 },
    { dept: 'Accounts', total: 5, present: 5, onLeave: 0 },
    { dept: 'Support', total: 15, present: 14, onLeave: 1 },
    { dept: 'Transport', total: 8, present: 7, onLeave: 1 },
]

const attendanceTrend = [
    { month: 'Jan', attendance: 94 },
    { month: 'Feb', attendance: 96 },
    { month: 'Mar', attendance: 93 },
    { month: 'Apr', attendance: 95 },
    { month: 'May', attendance: 92 },
    { month: 'Jun', attendance: 88 },
]

const leaveTypes = [
    { type: 'Sick Leave', count: 28, color: '#ef4444' },
    { type: 'Casual Leave', count: 45, color: '#3b82f6' },
    { type: 'Annual Leave', count: 18, color: '#22c55e' },
    { type: 'Maternity', count: 3, color: '#a855f7' },
    { type: 'Other', count: 8, color: '#6b7280' },
]

const payrollSummary = [
    { month: 'Jan', basic: 850000, allowances: 150000, deductions: 85000, net: 915000 },
    { month: 'Feb', basic: 855000, allowances: 155000, deductions: 86000, net: 924000 },
    { month: 'Mar', basic: 860000, allowances: 155000, deductions: 87000, net: 928000 },
    { month: 'Apr', basic: 870000, allowances: 160000, deductions: 90000, net: 940000 },
    { month: 'May', basic: 880000, allowances: 165000, deductions: 92000, net: 953000 },
]

const topPerformers = [
    { name: 'Dr. Sana Malik', dept: 'Science', rating: 4.9, classes: 24, attendance: 98 },
    { name: 'Mr. Ahmad Shah', dept: 'Urdu', rating: 4.8, classes: 22, attendance: 96 },
    { name: 'Ms. Ayesha Khan', dept: 'English', rating: 4.7, classes: 20, attendance: 100 },
    { name: 'Mr. Imran Ali', dept: 'Mathematics', rating: 4.6, classes: 25, attendance: 95 },
    { name: 'Ms. Fatima Zahra', dept: 'Social Studies', rating: 4.5, classes: 18, attendance: 97 },
]

export default function StaffReportsPage() {
    const [selectedDepartment, setSelectedDepartment] = useState<string>('all')
    const [selectedPeriod, setSelectedPeriod] = useState<string>('month')

    const totalStaff = 85
    const presentToday = 79
    const onLeaveToday = 6
    const avgAttendance = 94.2

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Staff Reports</h1>
                    <p className="text-muted-foreground">
                        Staff attendance, leave, and payroll analytics
                    </p>
                </div>
                <div className="flex gap-3">
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="week">This Week</SelectItem>
                            <SelectItem value="month">This Month</SelectItem>
                            <SelectItem value="quarter">This Quarter</SelectItem>
                            <SelectItem value="year">This Year</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalStaff}</div>
                        <p className="text-xs text-muted-foreground">Active employees</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Present Today</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{presentToday}</div>
                        <p className="text-xs text-muted-foreground">{((presentToday / totalStaff) * 100).toFixed(1)}% attendance</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">On Leave</CardTitle>
                        <Calendar className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-500">{onLeaveToday}</div>
                        <p className="text-xs text-muted-foreground">Today</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
                        <TrendingUp className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgAttendance}%</div>
                        <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Department Attendance */}
                <Card>
                    <CardHeader>
                        <CardTitle>Department-wise Attendance</CardTitle>
                        <CardDescription>Today&apos;s attendance by department</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={departmentData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="dept" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="present" name="Present" fill="#22c55e" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="onLeave" name="On Leave" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Leave Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Leave Distribution</CardTitle>
                        <CardDescription>Leave types this month</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={leaveTypes}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={90}
                                        paddingAngle={2}
                                        dataKey="count"
                                        label={({ type, count }) => `${type}: ${count}`}
                                    >
                                        {leaveTypes.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Attendance Trend */}
            <Card>
                <CardHeader>
                    <CardTitle>Attendance Trend</CardTitle>
                    <CardDescription>Monthly staff attendance percentage</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={attendanceTrend}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis domain={[80, 100]} />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="attendance"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    dot={{ fill: '#3b82f6' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Payroll Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>Payroll Summary</CardTitle>
                    <CardDescription>Monthly payroll breakdown (in PKR)</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={payrollSummary}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip formatter={(value) => `Rs. ${(value as number).toLocaleString()}`} />
                                <Legend />
                                <Bar dataKey="basic" name="Basic Salary" fill="#3b82f6" stackId="a" />
                                <Bar dataKey="allowances" name="Allowances" fill="#22c55e" stackId="a" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Department Summary */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Department Summary</CardTitle>
                            <CardDescription>Staff distribution and attendance by department</CardDescription>
                        </div>
                        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                            <SelectTrigger className="w-[180px]">
                                <Briefcase className="w-4 h-4 mr-2" />
                                <SelectValue placeholder="Department" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Departments</SelectItem>
                                <SelectItem value="teaching">Teaching</SelectItem>
                                <SelectItem value="admin">Administration</SelectItem>
                                <SelectItem value="support">Support Staff</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Department</TableHead>
                                <TableHead>Total Staff</TableHead>
                                <TableHead>Present</TableHead>
                                <TableHead>On Leave</TableHead>
                                <TableHead>Attendance %</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {departmentData.map((dept) => (
                                <TableRow key={dept.dept}>
                                    <TableCell className="font-medium">{dept.dept}</TableCell>
                                    <TableCell>{dept.total}</TableCell>
                                    <TableCell className="text-green-500">{dept.present}</TableCell>
                                    <TableCell className="text-amber-500">{dept.onLeave}</TableCell>
                                    <TableCell>{((dept.present / dept.total) * 100).toFixed(1)}%</TableCell>
                                    <TableCell>
                                        {(dept.present / dept.total) >= 0.95 ? (
                                            <Badge className="bg-green-500/10 text-green-500">
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Excellent
                                            </Badge>
                                        ) : (dept.present / dept.total) >= 0.85 ? (
                                            <Badge className="bg-blue-500/10 text-blue-500">Good</Badge>
                                        ) : (
                                            <Badge className="bg-amber-500/10 text-amber-500">
                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                Attention
                                            </Badge>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Top Performers */}
            <Card>
                <CardHeader>
                    <CardTitle>Top Performing Staff</CardTitle>
                    <CardDescription>Based on performance ratings and attendance</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Rank</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Rating</TableHead>
                                <TableHead>Classes/Month</TableHead>
                                <TableHead>Attendance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {topPerformers.map((staff, index) => (
                                <TableRow key={staff.name}>
                                    <TableCell>
                                        <Badge variant={index === 0 ? 'default' : 'secondary'}>
                                            #{index + 1}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">{staff.name}</TableCell>
                                    <TableCell>{staff.dept}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <span className="text-amber-500">★</span>
                                            {staff.rating}
                                        </div>
                                    </TableCell>
                                    <TableCell>{staff.classes}</TableCell>
                                    <TableCell>
                                        <span className={staff.attendance >= 95 ? 'text-green-500' : ''}>
                                            {staff.attendance}%
                                        </span>
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
