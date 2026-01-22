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
    TrendingDown,
    Search,
    Plus,
    DollarSign,
    Calendar,
    FileText,
    Download,
    Building2,
} from 'lucide-react'

interface Expense {
    id: string
    voucherNo: string
    category: string
    description: string
    vendor: string
    amount: number
    date: string
    status: 'approved' | 'pending' | 'rejected'
    paidBy: string
}

const sampleExpenses: Expense[] = [
    { id: '1', voucherNo: 'EXP-2024-001', category: 'Utilities', description: 'Electricity Bill - January', vendor: 'LESCO', amount: 125000, date: '2024-01-10', status: 'approved', paidBy: 'Bank Transfer' },
    { id: '2', voucherNo: 'EXP-2024-002', category: 'Maintenance', description: 'Building Repair Work', vendor: 'ABC Contractors', amount: 85000, date: '2024-01-08', status: 'approved', paidBy: 'Cheque' },
    { id: '3', voucherNo: 'EXP-2024-003', category: 'Supplies', description: 'Office Stationery', vendor: 'Paper House', amount: 15000, date: '2024-01-15', status: 'approved', paidBy: 'Cash' },
    { id: '4', voucherNo: 'EXP-2024-004', category: 'Equipment', description: 'Computer Lab Equipment', vendor: 'Tech Solutions', amount: 350000, date: '2024-01-12', status: 'pending', paidBy: 'Bank Transfer' },
    { id: '5', voucherNo: 'EXP-2024-005', category: 'Transport', description: 'Bus Fuel - January', vendor: 'PSO Petrol', amount: 180000, date: '2024-01-05', status: 'approved', paidBy: 'Card' },
    { id: '6', voucherNo: 'EXP-2024-006', category: 'Utilities', description: 'Water Bill - January', vendor: 'WASA', amount: 25000, date: '2024-01-11', status: 'approved', paidBy: 'Bank Transfer' },
    { id: '7', voucherNo: 'EXP-2024-007', category: 'Cleaning', description: 'Monthly Cleaning Service', vendor: 'CleanPro', amount: 45000, date: '2024-01-01', status: 'approved', paidBy: 'Cash' },
]

export default function ExpensesPage() {
    const [expenses] = useState<Expense[]>(sampleExpenses)
    const [searchQuery, setSearchQuery] = useState('')
    const [categoryFilter, setCategoryFilter] = useState<string>('all')
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

    const filteredExpenses = expenses.filter((expense) => {
        const matchesSearch =
            expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            expense.voucherNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            expense.vendor.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter
        return matchesSearch && matchesCategory
    })

    const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0)
    const approvedExpenses = expenses.filter((e) => e.status === 'approved').reduce((acc, e) => acc + e.amount, 0)
    const pendingExpenses = expenses.filter((e) => e.status === 'pending').reduce((acc, e) => acc + e.amount, 0)

    const getStatusBadge = (status: Expense['status']) => {
        switch (status) {
            case 'approved':
                return <Badge className="bg-green-500/10 text-green-500">Approved</Badge>
            case 'pending':
                return <Badge className="bg-yellow-500/10 text-yellow-500">Pending</Badge>
            case 'rejected':
                return <Badge className="bg-red-500/10 text-red-500">Rejected</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Expenses Management</h1>
                    <p className="text-muted-foreground">
                        Track and manage school expenses
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gradient-primary">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Expense
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Record New Expense</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Category</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="utilities">Utilities</SelectItem>
                                                <SelectItem value="maintenance">Maintenance</SelectItem>
                                                <SelectItem value="supplies">Supplies</SelectItem>
                                                <SelectItem value="equipment">Equipment</SelectItem>
                                                <SelectItem value="transport">Transport</SelectItem>
                                                <SelectItem value="cleaning">Cleaning</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Date</Label>
                                        <Input type="date" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Input placeholder="Enter expense description" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Vendor/Payee</Label>
                                        <Input placeholder="Vendor name" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Amount (Rs.)</Label>
                                        <Input type="number" placeholder="0" />
                                    </div>
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
                                            <SelectItem value="cheque">Cheque</SelectItem>
                                            <SelectItem value="card">Card</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Notes</Label>
                                    <Textarea placeholder="Additional notes (optional)" rows={2} />
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                                    <Button className="gradient-primary" onClick={() => setIsAddDialogOpen(false)}>Save Expense</Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                        <TrendingDown className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">Rs. {totalExpenses.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Approved</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">Rs. {approvedExpenses.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Processed</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                        <FileText className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-500">Rs. {pendingExpenses.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Awaiting approval</p>
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
                                placeholder="Search expenses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                <SelectItem value="Utilities">Utilities</SelectItem>
                                <SelectItem value="Maintenance">Maintenance</SelectItem>
                                <SelectItem value="Supplies">Supplies</SelectItem>
                                <SelectItem value="Equipment">Equipment</SelectItem>
                                <SelectItem value="Transport">Transport</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Expenses Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingDown className="h-5 w-5" />
                        Expense Records
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Voucher No</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Vendor</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredExpenses.map((expense) => (
                                <TableRow key={expense.id}>
                                    <TableCell className="font-medium text-primary">{expense.voucherNo}</TableCell>
                                    <TableCell>{expense.description}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{expense.category}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Building2 className="h-4 w-4 text-muted-foreground" />
                                            {expense.vendor}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-medium text-red-500">
                                        Rs. {expense.amount.toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm">
                                            <Calendar className="h-3 w-3 text-muted-foreground" />
                                            {new Date(expense.date).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(expense.status)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
