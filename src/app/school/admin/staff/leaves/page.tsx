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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Calendar,
    Search,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    User,
    FileText,
    MoreHorizontal,
    Eye,
    Check,
    X,
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface LeaveRequest {
    id: string
    employeeId: string
    employeeName: string
    department: string
    designation: string
    leaveType: 'sick' | 'casual' | 'annual' | 'maternity' | 'emergency'
    startDate: string
    endDate: string
    days: number
    reason: string
    status: 'pending' | 'approved' | 'rejected'
    appliedDate: string
    approvedBy?: string
}

const sampleLeaves: LeaveRequest[] = [
    {
        id: '1',
        employeeId: 'EMP005',
        employeeName: 'Ms. Fatima Noor',
        department: 'Teaching',
        designation: 'Science Teacher',
        leaveType: 'sick',
        startDate: '2024-01-20',
        endDate: '2024-01-22',
        days: 3,
        reason: 'Medical checkup and rest due to flu',
        status: 'pending',
        appliedDate: '2024-01-18',
    },
    {
        id: '2',
        employeeId: 'EMP008',
        employeeName: 'Mrs. Zainab Ali',
        department: 'Admin',
        designation: 'Accountant',
        leaveType: 'casual',
        startDate: '2024-01-19',
        endDate: '2024-01-19',
        days: 1,
        reason: 'Family function attendance',
        status: 'approved',
        appliedDate: '2024-01-17',
        approvedBy: 'Principal',
    },
    {
        id: '3',
        employeeId: 'EMP003',
        employeeName: 'Mrs. Ayesha Khan',
        department: 'Teaching',
        designation: 'English Teacher',
        leaveType: 'annual',
        startDate: '2024-02-01',
        endDate: '2024-02-07',
        days: 7,
        reason: 'Annual vacation with family',
        status: 'pending',
        appliedDate: '2024-01-15',
    },
    {
        id: '4',
        employeeId: 'EMP007',
        employeeName: 'Mr. Usman Khan',
        department: 'Admin',
        designation: 'Office Manager',
        leaveType: 'emergency',
        startDate: '2024-01-16',
        endDate: '2024-01-16',
        days: 1,
        reason: 'Family emergency',
        status: 'approved',
        appliedDate: '2024-01-16',
        approvedBy: 'Principal',
    },
    {
        id: '5',
        employeeId: 'EMP002',
        employeeName: 'Dr. Sana Malik',
        department: 'Teaching',
        designation: 'Head of Science',
        leaveType: 'sick',
        startDate: '2024-01-10',
        endDate: '2024-01-11',
        days: 2,
        reason: 'Dental surgery',
        status: 'approved',
        appliedDate: '2024-01-08',
        approvedBy: 'Principal',
    },
    {
        id: '6',
        employeeId: 'EMP009',
        employeeName: 'Mr. Bilal Ahmed',
        department: 'Support',
        designation: 'IT Support',
        leaveType: 'casual',
        startDate: '2024-01-25',
        endDate: '2024-01-26',
        days: 2,
        reason: 'Personal work',
        status: 'rejected',
        appliedDate: '2024-01-20',
    },
]

export default function StaffLeavesPage() {
    const [leaves] = useState<LeaveRequest[]>(sampleLeaves)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [typeFilter, setTypeFilter] = useState<string>('all')

    const filteredLeaves = leaves.filter((leave) => {
        const matchesSearch =
            leave.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            leave.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'all' || leave.status === statusFilter
        const matchesType = typeFilter === 'all' || leave.leaveType === typeFilter
        return matchesSearch && matchesStatus && matchesType
    })

    const pendingCount = leaves.filter((l) => l.status === 'pending').length
    const approvedCount = leaves.filter((l) => l.status === 'approved').length
    const rejectedCount = leaves.filter((l) => l.status === 'rejected').length
    const totalDaysApproved = leaves.filter((l) => l.status === 'approved').reduce((acc, l) => acc + l.days, 0)

    const getStatusBadge = (status: LeaveRequest['status']) => {
        switch (status) {
            case 'pending':
                return (
                    <Badge className="bg-yellow-500/10 text-yellow-500">
                        <Clock className="mr-1 h-3 w-3" />
                        Pending
                    </Badge>
                )
            case 'approved':
                return (
                    <Badge className="bg-green-500/10 text-green-500">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Approved
                    </Badge>
                )
            case 'rejected':
                return (
                    <Badge className="bg-red-500/10 text-red-500">
                        <XCircle className="mr-1 h-3 w-3" />
                        Rejected
                    </Badge>
                )
        }
    }

    const getTypeBadge = (type: LeaveRequest['leaveType']) => {
        switch (type) {
            case 'sick':
                return <Badge variant="outline" className="border-red-500 text-red-500">Sick Leave</Badge>
            case 'casual':
                return <Badge variant="outline" className="border-blue-500 text-blue-500">Casual Leave</Badge>
            case 'annual':
                return <Badge variant="outline" className="border-green-500 text-green-500">Annual Leave</Badge>
            case 'maternity':
                return <Badge variant="outline" className="border-purple-500 text-purple-500">Maternity Leave</Badge>
            case 'emergency':
                return <Badge variant="outline" className="border-orange-500 text-orange-500">Emergency</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Leave Management</h1>
                    <p className="text-muted-foreground">
                        Manage staff leave requests and approvals
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-500">{pendingCount}</div>
                        <p className="text-xs text-muted-foreground">Awaiting approval</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Approved</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{approvedCount}</div>
                        <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                        <XCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">{rejectedCount}</div>
                        <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Days</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalDaysApproved}</div>
                        <p className="text-xs text-muted-foreground">Days approved</p>
                    </CardContent>
                </Card>
            </div>

            {/* Pending Alert */}
            {pendingCount > 0 && (
                <Card className="border-yellow-500/50 bg-yellow-500/5">
                    <CardContent className="flex items-center gap-4 py-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10">
                            <AlertCircle className="h-6 w-6 text-yellow-500" />
                        </div>
                        <div>
                            <p className="font-medium">Pending Leave Requests</p>
                            <p className="text-sm text-muted-foreground">
                                {pendingCount} leave request(s) require your attention
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Filters */}
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
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Leave Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="sick">Sick Leave</SelectItem>
                                <SelectItem value="casual">Casual Leave</SelectItem>
                                <SelectItem value="annual">Annual Leave</SelectItem>
                                <SelectItem value="emergency">Emergency</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Leaves Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Leave Requests
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead>Leave Type</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead className="text-center">Days</TableHead>
                                <TableHead>Reason</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLeaves.map((leave) => (
                                <TableRow key={leave.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                                <User className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{leave.employeeName}</p>
                                                <p className="text-xs text-muted-foreground">{leave.designation}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{getTypeBadge(leave.leaveType)}</TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <p>{new Date(leave.startDate).toLocaleDateString()}</p>
                                            <p className="text-muted-foreground">to {new Date(leave.endDate).toLocaleDateString()}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center font-medium">{leave.days}</TableCell>
                                    <TableCell className="max-w-[200px]">
                                        <p className="text-sm line-clamp-2">{leave.reason}</p>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(leave.status)}</TableCell>
                                    <TableCell className="text-right">
                                        {leave.status === 'pending' ? (
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm" variant="ghost" className="text-green-500 hover:text-green-600 hover:bg-green-500/10">
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                                <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-500/10">
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
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
