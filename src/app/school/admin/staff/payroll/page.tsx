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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Wallet,
    Search,
    Calendar,
    Clock,
    MoreHorizontal,
    Download,
    Eye,
    DollarSign,
    Users,
    CheckCircle,
    AlertCircle,
    FileText,
    Building2,
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface PayrollRecord {
    id: string
    employeeId: string
    name: string
    department: string
    designation: string
    basicSalary: number
    allowances: number
    deductions: number
    netSalary: number
    status: 'paid' | 'pending' | 'processing'
    paidDate?: string
}

interface PayrollSummary {
    month: string
    year: string
    totalEmployees: number
    totalSalary: number
    totalPaid: number
    totalPending: number
    status: 'completed' | 'in-progress' | 'pending'
}

const samplePayroll: PayrollRecord[] = [
    { id: '1', employeeId: 'EMP001', name: 'Mr. Imran Ali', department: 'Teaching', designation: 'Senior Teacher', basicSalary: 80000, allowances: 15000, deductions: 8000, netSalary: 87000, status: 'paid', paidDate: '2024-01-05' },
    { id: '2', employeeId: 'EMP002', name: 'Dr. Sana Malik', department: 'Teaching', designation: 'Head of Science', basicSalary: 120000, allowances: 25000, deductions: 12000, netSalary: 133000, status: 'paid', paidDate: '2024-01-05' },
    { id: '3', employeeId: 'EMP003', name: 'Mrs. Ayesha Khan', department: 'Teaching', designation: 'English Teacher', basicSalary: 65000, allowances: 12000, deductions: 6500, netSalary: 70500, status: 'paid', paidDate: '2024-01-05' },
    { id: '4', employeeId: 'EMP004', name: 'Mr. Hassan Raza', department: 'Teaching', designation: 'Math Teacher', basicSalary: 70000, allowances: 12000, deductions: 7000, netSalary: 75000, status: 'pending' },
    { id: '5', employeeId: 'EMP005', name: 'Ms. Fatima Noor', department: 'Teaching', designation: 'Science Teacher', basicSalary: 60000, allowances: 10000, deductions: 6000, netSalary: 64000, status: 'processing' },
    { id: '6', employeeId: 'EMP006', name: 'Mr. Ahmad Shah', department: 'Teaching', designation: 'Urdu Teacher', basicSalary: 55000, allowances: 10000, deductions: 5500, netSalary: 59500, status: 'paid', paidDate: '2024-01-05' },
    { id: '7', employeeId: 'EMP007', name: 'Mr. Usman Khan', department: 'Admin', designation: 'Office Manager', basicSalary: 50000, allowances: 8000, deductions: 5000, netSalary: 53000, status: 'pending' },
    { id: '8', employeeId: 'EMP008', name: 'Mrs. Zainab Ali', department: 'Admin', designation: 'Accountant', basicSalary: 55000, allowances: 10000, deductions: 5500, netSalary: 59500, status: 'paid', paidDate: '2024-01-05' },
]

const sampleSummary: PayrollSummary[] = [
    { month: 'January', year: '2024', totalEmployees: 45, totalSalary: 2850000, totalPaid: 2450000, totalPending: 400000, status: 'in-progress' },
    { month: 'December', year: '2023', totalEmployees: 45, totalSalary: 2850000, totalPaid: 2850000, totalPending: 0, status: 'completed' },
    { month: 'November', year: '2023', totalEmployees: 44, totalSalary: 2780000, totalPaid: 2780000, totalPending: 0, status: 'completed' },
    { month: 'October', year: '2023', totalEmployees: 44, totalSalary: 2780000, totalPaid: 2780000, totalPending: 0, status: 'completed' },
]

export default function PayrollPage() {
    const [payroll] = useState<PayrollRecord[]>(samplePayroll)
    const [summary] = useState<PayrollSummary[]>(sampleSummary)
    const [searchQuery, setSearchQuery] = useState('')
    const [departmentFilter, setDepartmentFilter] = useState<string>('all')
    const [statusFilter, setStatusFilter] = useState<string>('all')

    const filteredPayroll = payroll.filter((record) => {
        const matchesSearch =
            record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesDept = departmentFilter === 'all' || record.department === departmentFilter
        const matchesStatus = statusFilter === 'all' || record.status === statusFilter
        return matchesSearch && matchesDept && matchesStatus
    })

    const totalPayroll = payroll.reduce((acc, r) => acc + r.netSalary, 0)
    const totalPaid = payroll.filter((r) => r.status === 'paid').reduce((acc, r) => acc + r.netSalary, 0)
    const paidCount = payroll.filter((r) => r.status === 'paid').length
    const pendingCount = payroll.filter((r) => r.status === 'pending').length

    const getStatusBadge = (status: PayrollRecord['status']) => {
        switch (status) {
            case 'paid':
                return <Badge className="bg-green-500/10 text-green-500">Paid</Badge>
            case 'pending':
                return <Badge className="bg-yellow-500/10 text-yellow-500">Pending</Badge>
            case 'processing':
                return <Badge className="bg-blue-500/10 text-blue-500">Processing</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Payroll Management</h1>
                    <p className="text-muted-foreground">
                        Manage staff salaries and payroll processing
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export Report
                    </Button>
                    <Button className="gradient-primary">
                        <Wallet className="mr-2 h-4 w-4" />
                        Process Payroll
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Rs. {totalPayroll.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Paid</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">Rs. {totalPaid.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">{paidCount} employees</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-500">{pendingCount}</div>
                        <p className="text-xs text-muted-foreground">Employees</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{payroll.length}</div>
                        <p className="text-xs text-muted-foreground">On payroll</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="current" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="current">Current Month</TabsTrigger>
                    <TabsTrigger value="history">Payroll History</TabsTrigger>
                </TabsList>

                {/* Current Month Tab */}
                <TabsContent value="current" className="space-y-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by name or ID..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                                    <SelectTrigger className="w-[150px]">
                                        <SelectValue placeholder="Department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Depts</SelectItem>
                                        <SelectItem value="Teaching">Teaching</SelectItem>
                                        <SelectItem value="Admin">Admin</SelectItem>
                                        <SelectItem value="Support">Support</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-[150px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="paid">Paid</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="processing">Processing</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Wallet className="h-5 w-5" />
                                January 2024 Payroll
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Employee</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead className="text-right">Basic</TableHead>
                                        <TableHead className="text-right">Allowances</TableHead>
                                        <TableHead className="text-right">Deductions</TableHead>
                                        <TableHead className="text-right">Net Salary</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredPayroll.map((record) => (
                                        <TableRow key={record.id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{record.name}</p>
                                                    <p className="text-xs text-muted-foreground">{record.employeeId} • {record.designation}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    <Building2 className="mr-1 h-3 w-3" />
                                                    {record.department}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">Rs. {record.basicSalary.toLocaleString()}</TableCell>
                                            <TableCell className="text-right text-green-500">+Rs. {record.allowances.toLocaleString()}</TableCell>
                                            <TableCell className="text-right text-red-500">-Rs. {record.deductions.toLocaleString()}</TableCell>
                                            <TableCell className="text-right font-bold">Rs. {record.netSalary.toLocaleString()}</TableCell>
                                            <TableCell>{getStatusBadge(record.status)}</TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View Slip
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Download className="mr-2 h-4 w-4" />
                                                            Download Slip
                                                        </DropdownMenuItem>
                                                        {record.status === 'pending' && (
                                                            <DropdownMenuItem>
                                                                <Wallet className="mr-2 h-4 w-4" />
                                                                Mark as Paid
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* History Tab */}
                <TabsContent value="history" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Payroll History
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Period</TableHead>
                                        <TableHead className="text-center">Employees</TableHead>
                                        <TableHead className="text-right">Total Salary</TableHead>
                                        <TableHead className="text-right">Paid Amount</TableHead>
                                        <TableHead className="text-right">Pending</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {summary.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">
                                                {item.month} {item.year}
                                            </TableCell>
                                            <TableCell className="text-center">{item.totalEmployees}</TableCell>
                                            <TableCell className="text-right">Rs. {item.totalSalary.toLocaleString()}</TableCell>
                                            <TableCell className="text-right text-green-500">Rs. {item.totalPaid.toLocaleString()}</TableCell>
                                            <TableCell className="text-right text-yellow-500">
                                                {item.totalPending > 0 ? `Rs. ${item.totalPending.toLocaleString()}` : '-'}
                                            </TableCell>
                                            <TableCell>
                                                {item.status === 'completed' ? (
                                                    <Badge className="bg-green-500/10 text-green-500">Completed</Badge>
                                                ) : (
                                                    <Badge className="bg-yellow-500/10 text-yellow-500">In Progress</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm">
                                                    <FileText className="mr-2 h-4 w-4" />
                                                    View Report
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
