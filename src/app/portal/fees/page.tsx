'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    DollarSign,
    Download,
    CreditCard,
    Clock,
    CheckCircle,
    AlertCircle,
    Calendar,
    Receipt,
    Wallet,
} from 'lucide-react'

interface FeeRecord {
    id: string
    childName: string
    description: string
    month: string
    amount: number
    dueDate: string
    status: 'paid' | 'pending' | 'overdue'
    paidDate?: string
    receiptNo?: string
}

const sampleFees: FeeRecord[] = [
    {
        id: '1',
        childName: 'Ahmed Khan',
        description: 'Monthly Tuition Fee',
        month: 'January 2024',
        amount: 15000,
        dueDate: '2024-01-10',
        status: 'pending',
    },
    {
        id: '2',
        childName: 'Fatima Khan',
        description: 'Monthly Tuition Fee',
        month: 'January 2024',
        amount: 12000,
        dueDate: '2024-01-10',
        status: 'paid',
        paidDate: '2024-01-08',
        receiptNo: 'RCP-2024-0158',
    },
    {
        id: '3',
        childName: 'Ahmed Khan',
        description: 'Monthly Tuition Fee',
        month: 'December 2023',
        amount: 15000,
        dueDate: '2023-12-10',
        status: 'paid',
        paidDate: '2023-12-09',
        receiptNo: 'RCP-2023-1425',
    },
    {
        id: '4',
        childName: 'Fatima Khan',
        description: 'Monthly Tuition Fee',
        month: 'December 2023',
        amount: 12000,
        dueDate: '2023-12-10',
        status: 'paid',
        paidDate: '2023-12-08',
        receiptNo: 'RCP-2023-1420',
    },
    {
        id: '5',
        childName: 'Ahmed Khan',
        description: 'Annual Sports Fee',
        month: '2023-24',
        amount: 5000,
        dueDate: '2023-11-15',
        status: 'paid',
        paidDate: '2023-11-10',
        receiptNo: 'RCP-2023-1380',
    },
    {
        id: '6',
        childName: 'Ahmed Khan',
        description: 'Exam Fee - Final Term',
        month: 'March 2024',
        amount: 3000,
        dueDate: '2024-02-28',
        status: 'pending',
    },
]

export default function PortalFeesPage() {
    const [fees] = useState<FeeRecord[]>(sampleFees)
    const [childFilter, setChildFilter] = useState<string>('all')
    const [statusFilter, setStatusFilter] = useState<string>('all')

    const filteredFees = fees.filter((fee) => {
        const matchesChild = childFilter === 'all' || fee.childName === childFilter
        const matchesStatus = statusFilter === 'all' || fee.status === statusFilter
        return matchesChild && matchesStatus
    })

    const totalPending = fees
        .filter((f) => f.status === 'pending' || f.status === 'overdue')
        .reduce((acc, f) => acc + f.amount, 0)
    const totalPaid = fees
        .filter((f) => f.status === 'paid')
        .reduce((acc, f) => acc + f.amount, 0)
    const pendingCount = fees.filter((f) => f.status === 'pending').length

    const getStatusBadge = (status: FeeRecord['status']) => {
        switch (status) {
            case 'paid':
                return (
                    <Badge className="bg-green-500/10 text-green-500">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Paid
                    </Badge>
                )
            case 'pending':
                return (
                    <Badge className="bg-yellow-500/10 text-yellow-500">
                        <Clock className="mr-1 h-3 w-3" />
                        Pending
                    </Badge>
                )
            case 'overdue':
                return (
                    <Badge className="bg-red-500/10 text-red-500">
                        <AlertCircle className="mr-1 h-3 w-3" />
                        Overdue
                    </Badge>
                )
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Fees & Payments</h1>
                    <p className="text-muted-foreground">
                        View fee details and make payments
                    </p>
                </div>
                <Button className="gradient-primary">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay Now
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-500">
                            Rs. {totalPending.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">{pendingCount} invoices pending</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">
                            Rs. {totalPaid.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">This academic year</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Next Due Date</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Jan 10</div>
                        <p className="text-xs text-muted-foreground">Rs. 15,000</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Payment Method</CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Online</div>
                        <p className="text-xs text-muted-foreground">JazzCash / Bank</p>
                    </CardContent>
                </Card>
            </div>

            {/* Pending Payments Alert */}
            {totalPending > 0 && (
                <Card className="border-yellow-500/50 bg-yellow-500/5">
                    <CardContent className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10">
                                <DollarSign className="h-6 w-6 text-yellow-500" />
                            </div>
                            <div>
                                <p className="font-medium">You have pending payments</p>
                                <p className="text-sm text-muted-foreground">
                                    Total Rs. {totalPending.toLocaleString()} is due
                                </p>
                            </div>
                        </div>
                        <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Pay All Pending
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        <Select value={childFilter} onValueChange={setChildFilter}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select child" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Children</SelectItem>
                                <SelectItem value="Ahmed Khan">Ahmed Khan</SelectItem>
                                <SelectItem value="Fatima Khan">Fatima Khan</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="overdue">Overdue</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Fees Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Receipt className="h-5 w-5" />
                        Fee Records
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Child</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Period</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredFees.map((fee) => (
                                <TableRow key={fee.id}>
                                    <TableCell className="font-medium">{fee.childName}</TableCell>
                                    <TableCell>{fee.description}</TableCell>
                                    <TableCell>{fee.month}</TableCell>
                                    <TableCell className="text-right font-medium">
                                        Rs. {fee.amount.toLocaleString()}
                                    </TableCell>
                                    <TableCell>{new Date(fee.dueDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{getStatusBadge(fee.status)}</TableCell>
                                    <TableCell className="text-right">
                                        {fee.status === 'paid' ? (
                                            <Button variant="ghost" size="sm">
                                                <Download className="mr-1 h-4 w-4" />
                                                Receipt
                                            </Button>
                                        ) : (
                                            <Button size="sm" className="gradient-primary">
                                                Pay Now
                                            </Button>
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
