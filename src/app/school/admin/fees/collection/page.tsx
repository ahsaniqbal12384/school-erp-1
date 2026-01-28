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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Wallet,
    Search,
    DollarSign,
    CreditCard,
    CheckCircle,
    Clock,
    Printer,
    Download,
    GraduationCap,
} from 'lucide-react'

interface FeeRecord {
    id: string
    challanNo: string
    studentName: string
    rollNo: string
    class: string
    feeType: string
    amount: number
    dueDate: string
    status: 'paid' | 'pending' | 'overdue'
    paidDate?: string
    paymentMethod?: string
}

const sampleFees: FeeRecord[] = [
    { id: '1', challanNo: 'CHL-2024-001', studentName: 'Ahmed Khan', rollNo: '1001', class: 'Class 10-A', feeType: 'Monthly Fee', amount: 15000, dueDate: '2024-01-10', status: 'paid', paidDate: '2024-01-08', paymentMethod: 'Bank Transfer' },
    { id: '2', challanNo: 'CHL-2024-002', studentName: 'Fatima Ali', rollNo: '1002', class: 'Class 10-A', feeType: 'Monthly Fee', amount: 15000, dueDate: '2024-01-10', status: 'paid', paidDate: '2024-01-09', paymentMethod: 'Cash' },
    { id: '3', challanNo: 'CHL-2024-003', studentName: 'Hassan Raza', rollNo: '1003', class: 'Class 10-A', feeType: 'Monthly Fee', amount: 15000, dueDate: '2024-01-10', status: 'overdue' },
    { id: '4', challanNo: 'CHL-2024-004', studentName: 'Sara Ahmed', rollNo: '1004', class: 'Class 10-B', feeType: 'Monthly Fee', amount: 15000, dueDate: '2024-01-10', status: 'pending' },
    { id: '5', challanNo: 'CHL-2024-005', studentName: 'Usman Tariq', rollNo: '1005', class: 'Class 9-A', feeType: 'Monthly Fee', amount: 12000, dueDate: '2024-01-10', status: 'paid', paidDate: '2024-01-05', paymentMethod: 'Online' },
    { id: '6', challanNo: 'CHL-2024-006', studentName: 'Ayesha Malik', rollNo: '1006', class: 'Class 9-A', feeType: 'Monthly Fee', amount: 12000, dueDate: '2024-01-10', status: 'pending' },
    { id: '7', challanNo: 'CHL-2024-007', studentName: 'Ali Hassan', rollNo: '1007', class: 'Class 9-B', feeType: 'Monthly Fee', amount: 12000, dueDate: '2024-01-10', status: 'overdue' },
    { id: '8', challanNo: 'CHL-2024-008', studentName: 'Zainab Shah', rollNo: '1008', class: 'Class 8-A', feeType: 'Monthly Fee', amount: 10000, dueDate: '2024-01-10', status: 'paid', paidDate: '2024-01-10', paymentMethod: 'Cash' },
]

export default function FeeCollectionPage() {
    const [fees] = useState<FeeRecord[]>(sampleFees)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
    const [selectedFee, setSelectedFee] = useState<FeeRecord | null>(null)

    const filteredFees = fees.filter((fee) => {
        const matchesSearch =
            fee.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            fee.challanNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            fee.rollNo.includes(searchQuery)
        const matchesStatus = statusFilter === 'all' || fee.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const totalAmount = fees.reduce((acc, f) => acc + f.amount, 0)
    const collectedAmount = fees.filter((f) => f.status === 'paid').reduce((acc, f) => acc + f.amount, 0)
    const pendingAmount = fees.filter((f) => f.status !== 'paid').reduce((acc, f) => acc + f.amount, 0)
    const overdueCount = fees.filter((f) => f.status === 'overdue').length

    const getStatusBadge = (status: FeeRecord['status']) => {
        switch (status) {
            case 'paid':
                return <Badge className="bg-green-500/10 text-green-500">Paid</Badge>
            case 'pending':
                return <Badge className="bg-yellow-500/10 text-yellow-500">Pending</Badge>
            case 'overdue':
                return <Badge className="bg-red-500/10 text-red-500">Overdue</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Fee Collection</h1>
                    <p className="text-muted-foreground">
                        Collect and manage student fee payments
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Button className="gradient-primary">
                        <DollarSign className="mr-2 h-4 w-4" />
                        Collect Payment
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Invoiced</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Rs. {totalAmount.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Collected</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">Rs. {collectedAmount.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">{((collectedAmount / totalAmount) * 100).toFixed(0)}% collected</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-500">Rs. {pendingAmount.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">To be collected</p>
                    </CardContent>
                </Card>
                <Card className="card-hover border-red-500/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                        <Clock className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">{overdueCount}</div>
                        <p className="text-xs text-muted-foreground">Challans overdue</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by student name, challan no, or roll no..."
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
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="overdue">Overdue</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Fee Records Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Wallet className="h-5 w-5" />
                        Fee Records - January 2024
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Challan No</TableHead>
                                <TableHead>Student</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Fee Type</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredFees.map((fee) => (
                                <TableRow key={fee.id}>
                                    <TableCell className="font-medium text-primary">{fee.challanNo}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                                <GraduationCap className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{fee.studentName}</p>
                                                <p className="text-xs text-muted-foreground">Roll No: {fee.rollNo}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{fee.class}</Badge>
                                    </TableCell>
                                    <TableCell>{fee.feeType}</TableCell>
                                    <TableCell className="text-right font-medium">Rs. {fee.amount.toLocaleString()}</TableCell>
                                    <TableCell>{new Date(fee.dueDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{getStatusBadge(fee.status)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            {fee.status !== 'paid' ? (
                                                <Dialog open={isPaymentDialogOpen && selectedFee?.id === fee.id} onOpenChange={(open) => {
                                                    setIsPaymentDialogOpen(open)
                                                    if (open) setSelectedFee(fee)
                                                }}>
                                                    <DialogTrigger asChild>
                                                        <Button size="sm" className="gradient-primary">
                                                            <CreditCard className="mr-1 h-3 w-3" />
                                                            Pay
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Record Payment</DialogTitle>
                                                        </DialogHeader>
                                                        <div className="space-y-4 py-4">
                                                            <div className="space-y-2">
                                                                <Label>Student</Label>
                                                                <Input value={fee.studentName} disabled />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label>Amount</Label>
                                                                <Input value={`Rs. ${fee.amount.toLocaleString()}`} disabled />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label>Payment Method</Label>
                                                                <Select>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select method" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="cash">Cash</SelectItem>
                                                                        <SelectItem value="bank">Bank Transfer</SelectItem>
                                                                        <SelectItem value="online">Online Payment</SelectItem>
                                                                        <SelectItem value="cheque">Cheque</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label>Receipt Number</Label>
                                                                <Input placeholder="Enter receipt number" />
                                                            </div>
                                                            <div className="flex justify-end gap-3">
                                                                <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                                                                    Cancel
                                                                </Button>
                                                                <Button className="gradient-primary" onClick={() => setIsPaymentDialogOpen(false)}>
                                                                    Confirm Payment
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            ) : (
                                                <Button size="sm" variant="ghost">
                                                    <Printer className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
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
