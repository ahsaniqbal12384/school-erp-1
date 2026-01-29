'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
import {
    DollarSign,
    Search,
    Download,
    Calendar,
    TrendingUp,
    TrendingDown,
    AlertCircle,
    CheckCircle,
    Users,
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
} from 'recharts'

// Sample data
const monthlyData = [
    { month: 'Jul', collected: 520000, pending: 180000 },
    { month: 'Aug', collected: 580000, pending: 150000 },
    { month: 'Sep', collected: 620000, pending: 130000 },
    { month: 'Oct', collected: 550000, pending: 200000 },
    { month: 'Nov', collected: 600000, pending: 150000 },
    { month: 'Dec', collected: 680000, pending: 120000 },
]

const defaulters = [
    { id: '1', name: 'Ahmed Khan', class: 'Class 10-A', admNo: 'STD-2024-001', dueAmount: 25000, dueMonths: 3, lastPayment: '2024-09-15' },
    { id: '2', name: 'Sara Ali', class: 'Class 9-B', admNo: 'STD-2024-015', dueAmount: 18000, dueMonths: 2, lastPayment: '2024-10-01' },
    { id: '3', name: 'Hassan Raza', class: 'Class 8-A', admNo: 'STD-2024-032', dueAmount: 35000, dueMonths: 4, lastPayment: '2024-08-20' },
    { id: '4', name: 'Fatima Noor', class: 'Class 10-B', admNo: 'STD-2024-008', dueAmount: 12000, dueMonths: 1, lastPayment: '2024-11-05' },
    { id: '5', name: 'Bilal Ahmed', class: 'Class 7-A', admNo: 'STD-2024-045', dueAmount: 28000, dueMonths: 3, lastPayment: '2024-09-01' },
]

const recentPayments = [
    { id: '1', name: 'Zain Ali', amount: 15000, date: '2024-12-20', method: 'Bank Transfer' },
    { id: '2', name: 'Maryam Hassan', amount: 12000, date: '2024-12-20', method: 'Cash' },
    { id: '3', name: 'Usman Khan', amount: 18000, date: '2024-12-19', method: 'Online' },
    { id: '4', name: 'Ayesha Malik', amount: 15000, date: '2024-12-19', method: 'Cash' },
    { id: '5', name: 'Omar Farooq', amount: 20000, date: '2024-12-18', method: 'Bank Transfer' },
]

export default function FeeReportsPage() {
    const [month, setMonth] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')

    const totalCollected = monthlyData.reduce((sum, m) => sum + m.collected, 0)
    const totalPending = monthlyData.reduce((sum, m) => sum + m.pending, 0)
    const collectionRate = Math.round((totalCollected / (totalCollected + totalPending)) * 100)

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Fee Reports</h1>
                    <p className="text-muted-foreground">
                        Fee collection analysis and defaulters report
                    </p>
                </div>
                <div className="flex gap-3">
                    <Select value={month} onValueChange={setMonth}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Months</SelectItem>
                            <SelectItem value="dec">December</SelectItem>
                            <SelectItem value="nov">November</SelectItem>
                            <SelectItem value="oct">October</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export Report
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">Rs. {(totalCollected / 100000).toFixed(1)}L</div>
                        <div className="flex items-center text-xs text-green-500">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +12% from last period
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-500">Rs. {(totalPending / 100000).toFixed(1)}L</div>
                        <div className="flex items-center text-xs text-red-500">
                            <TrendingDown className="h-3 w-3 mr-1" />
                            Needs attention
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-500">{collectionRate}%</div>
                        <div className="text-xs text-muted-foreground">Target: 95%</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Defaulters</CardTitle>
                        <Users className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">{defaulters.length}</div>
                        <div className="text-xs text-muted-foreground">Students with pending fees</div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Collection Trend</CardTitle>
                        <CardDescription>Monthly fee collection vs pending</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis tickFormatter={(value) => `${value / 1000}K`} />
                                <Tooltip formatter={(value: number) => `Rs. ${(value / 1000).toFixed(0)}K`} />
                                <Bar dataKey="collected" fill="#22c55e" name="Collected" />
                                <Bar dataKey="pending" fill="#ef4444" name="Pending" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Collection Progress</CardTitle>
                        <CardDescription>Cumulative collection over months</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis tickFormatter={(value) => `${value / 1000}K`} />
                                <Tooltip formatter={(value: number) => `Rs. ${(value / 1000).toFixed(0)}K`} />
                                <Line type="monotone" dataKey="collected" stroke="#22c55e" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Defaulters Table */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Fee Defaulters</CardTitle>
                            <CardDescription>Students with pending fee payments</CardDescription>
                        </div>
                        <div className="flex gap-3">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search students..."
                                    className="pl-8 w-[250px]"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button variant="outline">
                                <Download className="mr-2 h-4 w-4" />
                                Export
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Adm. No</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Due Amount</TableHead>
                                <TableHead>Due Months</TableHead>
                                <TableHead>Last Payment</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {defaulters.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell className="font-medium">{student.name}</TableCell>
                                    <TableCell>{student.admNo}</TableCell>
                                    <TableCell>{student.class}</TableCell>
                                    <TableCell className="font-medium text-red-500">
                                        Rs. {student.dueAmount.toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={student.dueMonths >= 3 ? 'destructive' : 'secondary'}>
                                            {student.dueMonths} month{student.dueMonths > 1 ? 's' : ''}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{student.lastPayment}</TableCell>
                                    <TableCell>
                                        <Button size="sm" variant="outline">Send Reminder</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Recent Payments */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Payments</CardTitle>
                    <CardDescription>Latest fee payments received</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Method</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentPayments.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell className="font-medium">{payment.name}</TableCell>
                                    <TableCell className="font-medium text-green-500">
                                        Rs. {payment.amount.toLocaleString()}
                                    </TableCell>
                                    <TableCell>{payment.date}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{payment.method}</Badge>
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
