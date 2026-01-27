'use client'

import { useState, useEffect, useCallback } from 'react'
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
    Loader2,
    AlertCircle,
} from 'lucide-react'
import { useTenant } from '@/lib/tenant'
import { useAuth } from '@/lib/auth'
import { toast } from 'sonner'

interface Invoice {
    id: string
    invoice_no: string
    month: number
    year: number
    total_amount: number
    paid_amount: number
    status: 'pending' | 'partial' | 'paid' | 'overdue' | 'cancelled'
    due_date: string
    student: {
        id: string
        first_name: string
        last_name: string
        roll_number: string
        class: {
            id: string
            name: string
            section: string
        }
    }
}

interface Summary {
    totalInvoiced: number
    totalCollected: number
    pendingAmount: number
    overdueAmount: number
    todayCollection: number
    collectionRate: number | string
}

interface Counts {
    paid: number
    pending: number
    partial: number
    overdue: number
    total: number
}

export default function FeeCollectionPage() {
    const { school } = useTenant()
    const { user } = useAuth()
    const [invoices, setInvoices] = useState<Invoice[]>([])
    const [summary, setSummary] = useState<Summary | null>(null)
    const [counts, setCounts] = useState<Counts | null>(null)
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
    const [paymentMethod, setPaymentMethod] = useState('')
    const [paymentAmount, setPaymentAmount] = useState('')
    const [transactionRef, setTransactionRef] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const currentMonth = new Date().getMonth() + 1
    const currentYear = new Date().getFullYear()

    const fetchData = useCallback(async () => {
        if (!school?.id) return
        
        try {
            setLoading(true)
            
            // Fetch invoices and summary in parallel
            const [invoicesRes, summaryRes] = await Promise.all([
                fetch(`/api/fees/invoices?school_id=${school.id}&month=${currentMonth}&year=${currentYear}`),
                fetch(`/api/fees/summary?school_id=${school.id}&month=${currentMonth}&year=${currentYear}`)
            ])

            if (invoicesRes.ok) {
                const { data } = await invoicesRes.json()
                setInvoices(data || [])
            }

            if (summaryRes.ok) {
                const { summary: summaryData, counts: countsData } = await summaryRes.json()
                setSummary(summaryData)
                setCounts(countsData)
            }
        } catch (error) {
            console.error('Error fetching fee data:', error)
            toast.error('Failed to load fee data')
        } finally {
            setLoading(false)
        }
    }, [school?.id, currentMonth, currentYear])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const filteredInvoices = invoices.filter((inv) => {
        const studentName = `${inv.student?.first_name} ${inv.student?.last_name}`.toLowerCase()
        const matchesSearch =
            studentName.includes(searchQuery.toLowerCase()) ||
            inv.invoice_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inv.student?.roll_number?.includes(searchQuery)
        const matchesStatus = statusFilter === 'all' || inv.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const handlePayment = async () => {
        if (!selectedInvoice || !paymentMethod || !paymentAmount) {
            toast.error('Please fill all required fields')
            return
        }

        setSubmitting(true)
        try {
            const response = await fetch('/api/fees/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    school_id: school?.id,
                    invoice_id: selectedInvoice.id,
                    student_id: selectedInvoice.student.id,
                    amount: parseFloat(paymentAmount),
                    payment_method: paymentMethod,
                    transaction_ref: transactionRef,
                    received_by: user?.id
                })
            })

            if (!response.ok) {
                throw new Error('Payment failed')
            }

            toast.success('Payment recorded successfully!')
            setIsPaymentDialogOpen(false)
            setSelectedInvoice(null)
            setPaymentMethod('')
            setPaymentAmount('')
            setTransactionRef('')
            fetchData() // Refresh data
        } catch (error) {
            console.error('Payment error:', error)
            toast.error('Failed to record payment')
        } finally {
            setSubmitting(false)
        }
    }

    const getStatusBadge = (status: Invoice['status']) => {
        switch (status) {
            case 'paid':
                return <Badge className="bg-green-500/10 text-green-500">Paid</Badge>
            case 'pending':
                return <Badge className="bg-yellow-500/10 text-yellow-500">Pending</Badge>
            case 'partial':
                return <Badge className="bg-blue-500/10 text-blue-500">Partial</Badge>
            case 'overdue':
                return <Badge className="bg-red-500/10 text-red-500">Overdue</Badge>
            case 'cancelled':
                return <Badge className="bg-gray-500/10 text-gray-500">Cancelled</Badge>
        }
    }

    const getMonthName = (month: number) => {
        return new Date(2024, month - 1).toLocaleString('default', { month: 'long' })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Fee Collection</h1>
                    <p className="text-muted-foreground">
                        Collect and manage student fee payments - {getMonthName(currentMonth)} {currentYear}
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export
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
                        <div className="text-2xl font-bold">Rs. {(summary?.totalInvoiced || 0).toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">{counts?.total || 0} invoices</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Collected</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">Rs. {(summary?.totalCollected || 0).toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">{summary?.collectionRate || 0}% collected</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-500">Rs. {(summary?.pendingAmount || 0).toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">{counts?.pending || 0} pending</p>
                    </CardContent>
                </Card>
                <Card className="card-hover border-red-500/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">Rs. {(summary?.overdueAmount || 0).toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">{counts?.overdue || 0} overdue</p>
                    </CardContent>
                </Card>
            </div>

            {/* Today's Collection */}
            {summary?.todayCollection !== undefined && summary.todayCollection > 0 && (
                <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
                    <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Today&apos;s Collection</p>
                                <p className="text-2xl font-bold text-green-600">Rs. {summary.todayCollection.toLocaleString()}</p>
                            </div>
                            <CheckCircle className="h-10 w-10 text-green-500/50" />
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
                                placeholder="Search by student name, invoice no, or roll no..."
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
                                <SelectItem value="partial">Partial</SelectItem>
                                <SelectItem value="overdue">Overdue</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Invoices Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Wallet className="h-5 w-5" />
                        Fee Invoices - {getMonthName(currentMonth)} {currentYear}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {filteredInvoices.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <Wallet className="h-12 w-12 mb-4 opacity-50" />
                            <p>No invoices found</p>
                            <p className="text-sm">Generate invoices from the bulk generate page</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Invoice No</TableHead>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Class</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead className="text-right">Paid</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredInvoices.map((invoice) => (
                                    <TableRow key={invoice.id}>
                                        <TableCell className="font-medium text-primary">{invoice.invoice_no}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                                    <GraduationCap className="h-4 w-4 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{invoice.student?.first_name} {invoice.student?.last_name}</p>
                                                    <p className="text-xs text-muted-foreground">Roll: {invoice.student?.roll_number}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{invoice.student?.class?.name} {invoice.student?.class?.section}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-medium">Rs. {invoice.total_amount?.toLocaleString()}</TableCell>
                                        <TableCell className="text-right text-green-600">Rs. {(invoice.paid_amount || 0).toLocaleString()}</TableCell>
                                        <TableCell>{invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : '-'}</TableCell>
                                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {invoice.status !== 'paid' && (
                                                    <Dialog open={isPaymentDialogOpen && selectedInvoice?.id === invoice.id} onOpenChange={(open) => {
                                                        setIsPaymentDialogOpen(open)
                                                        if (open) {
                                                            setSelectedInvoice(invoice)
                                                            setPaymentAmount(String(invoice.total_amount - (invoice.paid_amount || 0)))
                                                        }
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
                                                                    <Input value={`${invoice.student?.first_name} ${invoice.student?.last_name}`} disabled />
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div className="space-y-2">
                                                                        <Label>Total Amount</Label>
                                                                        <Input value={`Rs. ${invoice.total_amount?.toLocaleString()}`} disabled />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <Label>Balance Due</Label>
                                                                        <Input value={`Rs. ${(invoice.total_amount - (invoice.paid_amount || 0)).toLocaleString()}`} disabled />
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label>Payment Amount *</Label>
                                                                    <Input 
                                                                        type="number" 
                                                                        value={paymentAmount}
                                                                        onChange={(e) => setPaymentAmount(e.target.value)}
                                                                        placeholder="Enter amount" 
                                                                    />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label>Payment Method *</Label>
                                                                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Select method" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="cash">Cash</SelectItem>
                                                                            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                                                            <SelectItem value="jazzcash">JazzCash</SelectItem>
                                                                            <SelectItem value="easypaisa">Easypaisa</SelectItem>
                                                                            <SelectItem value="online">Online Payment</SelectItem>
                                                                            <SelectItem value="cheque">Cheque</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label>Transaction Reference (optional)</Label>
                                                                    <Input 
                                                                        value={transactionRef}
                                                                        onChange={(e) => setTransactionRef(e.target.value)}
                                                                        placeholder="Enter transaction ID or reference" 
                                                                    />
                                                                </div>
                                                                <div className="flex justify-end gap-3 pt-4">
                                                                    <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                                                                        Cancel
                                                                    </Button>
                                                                    <Button 
                                                                        className="gradient-primary" 
                                                                        onClick={handlePayment}
                                                                        disabled={submitting}
                                                                    >
                                                                        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                                        Confirm Payment
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>
                                                )}
                                                <Button size="sm" variant="ghost">
                                                    <Printer className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
