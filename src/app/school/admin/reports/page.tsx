'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    BarChart3,
    TrendingUp,
    Users,
    DollarSign,
    GraduationCap,
    BookOpen,
    Calendar,
    Download,
    RefreshCw,
    ArrowUpRight,
    ArrowDownRight,
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

// Sample data for charts
const attendanceData = [
    { name: 'Mon', present: 450, absent: 50 },
    { name: 'Tue', present: 470, absent: 30 },
    { name: 'Wed', present: 460, absent: 40 },
    { name: 'Thu', present: 480, absent: 20 },
    { name: 'Fri', present: 440, absent: 60 },
]

const feeCollectionData = [
    { month: 'Jan', collected: 450000, pending: 150000 },
    { month: 'Feb', collected: 520000, pending: 130000 },
    { month: 'Mar', collected: 480000, pending: 170000 },
    { month: 'Apr', collected: 550000, pending: 100000 },
    { month: 'May', collected: 600000, pending: 80000 },
    { month: 'Jun', collected: 580000, pending: 120000 },
]

const gradeDistribution = [
    { name: 'A+', value: 120, color: '#22c55e' },
    { name: 'A', value: 180, color: '#3b82f6' },
    { name: 'B', value: 250, color: '#f59e0b' },
    { name: 'C', value: 150, color: '#ef4444' },
    { name: 'D', value: 50, color: '#6b7280' },
]

interface StatCardProps {
    title: string
    value: string | number
    change: number
    icon: React.ReactNode
    trend: 'up' | 'down'
}

function StatCard({ title, value, change, icon, trend }: StatCardProps) {
    return (
        <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <div className={`flex items-center text-xs ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {trend === 'up' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    <span>{change}% from last month</span>
                </div>
            </CardContent>
        </Card>
    )
}

export default function ReportsPage() {
    const [dateRange, setDateRange] = useState('month')
    const [isLoading, setIsLoading] = useState(false)

    const handleRefresh = () => {
        setIsLoading(true)
        setTimeout(() => setIsLoading(false), 1000)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
                    <p className="text-muted-foreground">
                        Comprehensive insights and analytics dashboard
                    </p>
                </div>
                <div className="flex gap-3">
                    <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="week">This Week</SelectItem>
                            <SelectItem value="month">This Month</SelectItem>
                            <SelectItem value="quarter">This Quarter</SelectItem>
                            <SelectItem value="year">This Year</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
                        <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Students"
                    value="1,234"
                    change={5.2}
                    trend="up"
                    icon={<GraduationCap className="h-4 w-4 text-blue-500" />}
                />
                <StatCard
                    title="Attendance Rate"
                    value="94.5%"
                    change={2.1}
                    trend="up"
                    icon={<Users className="h-4 w-4 text-green-500" />}
                />
                <StatCard
                    title="Fee Collection"
                    value="Rs. 5.8M"
                    change={8.4}
                    trend="up"
                    icon={<DollarSign className="h-4 w-4 text-amber-500" />}
                />
                <StatCard
                    title="Library Books"
                    value="2,456"
                    change={1.2}
                    trend="down"
                    icon={<BookOpen className="h-4 w-4 text-purple-500" />}
                />
            </div>

            {/* Charts */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Attendance Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Weekly Attendance</CardTitle>
                        <CardDescription>Student attendance for the current week</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={attendanceData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="present" fill="#22c55e" name="Present" />
                                <Bar dataKey="absent" fill="#ef4444" name="Absent" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Fee Collection Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Fee Collection Trend</CardTitle>
                        <CardDescription>Monthly fee collection summary</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={feeCollectionData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip formatter={(value: number) => `Rs. ${(value / 1000).toFixed(0)}K`} />
                                <Line type="monotone" dataKey="collected" stroke="#22c55e" name="Collected" strokeWidth={2} />
                                <Line type="monotone" dataKey="pending" stroke="#ef4444" name="Pending" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* More Analytics */}
            <div className="grid gap-4 md:grid-cols-3">
                {/* Grade Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Grade Distribution</CardTitle>
                        <CardDescription>Overall student grades</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={gradeDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {gradeDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex flex-wrap justify-center gap-4 mt-4">
                            {gradeDistribution.map((item) => (
                                <div key={item.name} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-sm">{item.name}: {item.value}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Quick Statistics</CardTitle>
                        <CardDescription>Key metrics at a glance</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-accent rounded-lg">
                                    <span className="text-sm font-medium">Active Teachers</span>
                                    <span className="text-lg font-bold">68</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-accent rounded-lg">
                                    <span className="text-sm font-medium">Total Classes</span>
                                    <span className="text-lg font-bold">42</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-accent rounded-lg">
                                    <span className="text-sm font-medium">Pending Leaves</span>
                                    <span className="text-lg font-bold text-amber-500">12</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-accent rounded-lg">
                                    <span className="text-sm font-medium">Books Issued</span>
                                    <span className="text-lg font-bold">156</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-accent rounded-lg">
                                    <span className="text-sm font-medium">Overdue Books</span>
                                    <span className="text-lg font-bold text-red-500">8</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-accent rounded-lg">
                                    <span className="text-sm font-medium">Fee Defaulters</span>
                                    <span className="text-lg font-bold text-red-500">23</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Report Generation */}
            <Card>
                <CardHeader>
                    <CardTitle>Generate Reports</CardTitle>
                    <CardDescription>Create custom reports for different categories</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="academic">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="academic">Academic</TabsTrigger>
                            <TabsTrigger value="financial">Financial</TabsTrigger>
                            <TabsTrigger value="attendance">Attendance</TabsTrigger>
                            <TabsTrigger value="staff">Staff</TabsTrigger>
                        </TabsList>
                        <TabsContent value="academic" className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Button variant="outline" className="h-20 flex flex-col gap-2">
                                    <TrendingUp className="h-5 w-5" />
                                    <span>Progress Report</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex flex-col gap-2">
                                    <BarChart3 className="h-5 w-5" />
                                    <span>Grade Analysis</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex flex-col gap-2">
                                    <GraduationCap className="h-5 w-5" />
                                    <span>Student List</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex flex-col gap-2">
                                    <Calendar className="h-5 w-5" />
                                    <span>Exam Schedule</span>
                                </Button>
                            </div>
                        </TabsContent>
                        <TabsContent value="financial" className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Button variant="outline" className="h-20 flex flex-col gap-2">
                                    <DollarSign className="h-5 w-5" />
                                    <span>Fee Collection</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex flex-col gap-2">
                                    <BarChart3 className="h-5 w-5" />
                                    <span>Defaulters List</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex flex-col gap-2">
                                    <TrendingUp className="h-5 w-5" />
                                    <span>Revenue Report</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex flex-col gap-2">
                                    <Calendar className="h-5 w-5" />
                                    <span>Monthly Summary</span>
                                </Button>
                            </div>
                        </TabsContent>
                        <TabsContent value="attendance" className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Button variant="outline" className="h-20 flex flex-col gap-2">
                                    <Users className="h-5 w-5" />
                                    <span>Class Wise</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex flex-col gap-2">
                                    <Calendar className="h-5 w-5" />
                                    <span>Date Wise</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex flex-col gap-2">
                                    <BarChart3 className="h-5 w-5" />
                                    <span>Monthly Summary</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex flex-col gap-2">
                                    <TrendingUp className="h-5 w-5" />
                                    <span>Absentee Report</span>
                                </Button>
                            </div>
                        </TabsContent>
                        <TabsContent value="staff" className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Button variant="outline" className="h-20 flex flex-col gap-2">
                                    <Users className="h-5 w-5" />
                                    <span>Staff List</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex flex-col gap-2">
                                    <DollarSign className="h-5 w-5" />
                                    <span>Payroll Report</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex flex-col gap-2">
                                    <Calendar className="h-5 w-5" />
                                    <span>Leave Report</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex flex-col gap-2">
                                    <BarChart3 className="h-5 w-5" />
                                    <span>Attendance</span>
                                </Button>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}
