'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    AlertTriangle,
    Banknote,
    CheckCircle,
    Clock,
    DollarSign,
    Search,
} from 'lucide-react'

interface Fine {
    id: string
    memberName: string
    membershipNo: string
    bookTitle: string
    issueDate: string
    dueDate: string
    returnDate?: string
    daysOverdue: number
    fineAmount: number
    paidAmount: number
    status: 'pending' | 'partial' | 'paid' | 'waived'
}

const sampleFines: Fine[] = [
    { id: '1', memberName: 'Fatima Ali', membershipNo: 'LIB-STD-015', bookTitle: 'English Grammar', issueDate: '2025-05-01', dueDate: '2025-05-15', returnDate: '2025-05-19', daysOverdue: 4, fineAmount: 60, paidAmount: 0, status: 'pending' },
    { id: '2', memberName: 'Zainab Hassan', membershipNo: 'LIB-STD-033', bookTitle: 'Mathematics for Class 10', issueDate: '2025-05-05', dueDate: '2025-05-19', returnDate: '2025-05-27', daysOverdue: 8, fineAmount: 120, paidAmount: 50, status: 'partial' },
    { id: '3', memberName: 'Ali Hussain', membershipNo: 'LIB-STD-044', bookTitle: 'Pakistan Studies', issueDate: '2025-04-20', dueDate: '2025-05-04', returnDate: '2025-05-06', daysOverdue: 2, fineAmount: 30, paidAmount: 30, status: 'paid' },
    { id: '4', memberName: 'Hassan Raza', membershipNo: 'LIB-STD-022', bookTitle: 'Physics Fundamentals', issueDate: '2025-04-28', dueDate: '2025-05-12', returnDate: '2025-05-15', daysOverdue: 3, fineAmount: 45, paidAmount: 45, status: 'paid' },
    { id: '5', memberName: 'Sarah Khan', membershipNo: 'LIB-STD-056', bookTitle: 'Chemistry Lab Manual', issueDate: '2025-05-10', dueDate: '2025-05-24', daysOverdue: 6, fineAmount: 90, paidAmount: 0, status: 'pending' },
]

export default function LibraryFinesPage() {
    const [fines, setFines] = useState<Fine[]>(sampleFines)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
    const [selectedFine, setSelectedFine] = useState<Fine | null>(null)
    const [paymentAmount, setPaymentAmount] = useState('')

    const filteredFines = fines.filter((fine) => {
        const matchesSearch =
            fine.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            fine.membershipNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            fine.bookTitle.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'all' || fine.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const totalFines = fines.reduce((sum, f) => sum + f.fineAmount, 0)
    const collectedFines = fines.reduce((sum, f) => sum + f.paidAmount, 0)
    const pendingFines = totalFines - collectedFines
    const overdueCases = fines.filter(f => f.status === 'pending').length

    const handleOpenPayment = (fine: Fine) => {
        setSelectedFine(fine)
        setPaymentAmount((fine.fineAmount - fine.paidAmount).toString())
        setPaymentDialogOpen(true)
    }

    const handlePayment = () => {
        if (!selectedFine) return
        const amount = parseFloat(paymentAmount)
        setFines(fines.map(f => {
            if (f.id === selectedFine.id) {
                const newPaidAmount = f.paidAmount + amount
                return {
                    ...f,
                    paidAmount: newPaidAmount,
                    status: newPaidAmount >= f.fineAmount ? 'paid' : 'partial'
                }
            }
            return f
        }))
        setPaymentDialogOpen(false)
    }

    const getStatusBadge = (status: Fine['status']) => {
        switch (status) {
            case 'pending':
                return <Badge className="bg-red-500/10 text-red-500">Pending</Badge>
            case 'partial':
                return <Badge className="bg-amber-500/10 text-amber-500">Partial</Badge>
            case 'paid':
                return <Badge className="bg-green-500/10 text-green-500">Paid</Badge>
            case 'waived':
                return <Badge className="bg-gray-500/10 text-gray-500">Waived</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Library Fines</h1>
                    <p className="text-muted-foreground">
                        Track and collect overdue fines
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Fines</CardTitle>
                        <DollarSign className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Rs. {totalFines}</div>
                        <p className="text-xs text-muted-foreground">Total fines generated</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Collected</CardTitle>
                        <Banknote className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">Rs. {collectedFines}</div>
                        <p className="text-xs text-muted-foreground">Amount received</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-500">Rs. {pendingFines}</div>
                        <p className="text-xs text-muted-foreground">Yet to collect</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Overdue Cases</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">{overdueCases}</div>
                        <p className="text-xs text-muted-foreground">Pending payments</p>
                    </CardContent>
                </Card>
            </div>

            {/* Fines Table */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Fine Records</CardTitle>
                            <CardDescription>All library fines and payments</CardDescription>
                        </div>
                        <div className="flex gap-3">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search..."
                                    className="pl-8 w-[200px]"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[130px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="partial">Partial</SelectItem>
                                    <SelectItem value="paid">Paid</SelectItem>
                                    <SelectItem value="waived">Waived</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Member</TableHead>
                                <TableHead>Book</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead>Days Overdue</TableHead>
                                <TableHead>Fine Amount</TableHead>
                                <TableHead>Paid</TableHead>
                                <TableHead>Balance</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredFines.map((fine) => (
                                <TableRow key={fine.id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{fine.memberName}</span>
                                            <span className="text-xs text-muted-foreground">{fine.membershipNo}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate">{fine.bookTitle}</TableCell>
                                    <TableCell>{fine.dueDate}</TableCell>
                                    <TableCell>
                                        <span className="text-red-500">{fine.daysOverdue} days</span>
                                    </TableCell>
                                    <TableCell>Rs. {fine.fineAmount}</TableCell>
                                    <TableCell>Rs. {fine.paidAmount}</TableCell>
                                    <TableCell>
                                        <span className={fine.fineAmount - fine.paidAmount > 0 ? 'text-red-500 font-medium' : 'text-green-500'}>
                                            Rs. {fine.fineAmount - fine.paidAmount}
                                        </span>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(fine.status)}</TableCell>
                                    <TableCell className="text-right">
                                        {fine.status !== 'paid' && fine.status !== 'waived' && (
                                            <Button
                                                size="sm"
                                                onClick={() => handleOpenPayment(fine)}
                                            >
                                                <Banknote className="w-4 h-4 mr-1" />
                                                Collect
                                            </Button>
                                        )}
                                        {fine.status === 'paid' && (
                                            <CheckCircle className="h-5 w-5 text-green-500 inline-block" />
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Payment Dialog */}
            <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Collect Fine Payment</DialogTitle>
                    </DialogHeader>
                    {selectedFine && (
                        <div className="space-y-4 pt-4">
                            <div className="rounded-lg border p-4 bg-muted/30">
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Member:</span>
                                        <span className="ml-2 font-medium">{selectedFine.memberName}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Book:</span>
                                        <span className="ml-2 font-medium">{selectedFine.bookTitle}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Total Fine:</span>
                                        <span className="ml-2 font-medium">Rs. {selectedFine.fineAmount}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Already Paid:</span>
                                        <span className="ml-2 font-medium">Rs. {selectedFine.paidAmount}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Payment Amount</Label>
                                <Input
                                    type="number"
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                    placeholder="Enter amount"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Balance: Rs. {selectedFine.fineAmount - selectedFine.paidAmount}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label>Payment Method</Label>
                                <Select defaultValue="cash">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cash">Cash</SelectItem>
                                        <SelectItem value="card">Card</SelectItem>
                                        <SelectItem value="online">Online Transfer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handlePayment}>
                                    <Banknote className="w-4 h-4 mr-2" />
                                    Record Payment
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
