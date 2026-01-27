'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
    Wallet,
    Search,
    Building2,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    Clock,
    MoreHorizontal,
    Eye,
    RefreshCw,
    CreditCard,
    FileText,
    X,
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Subscription {
    id: string
    schoolName: string
    schoolCode: string
    plan: 'basic' | 'standard' | 'premium'
    status: 'active' | 'expired' | 'pending' | 'cancelled'
    startDate: string
    endDate: string
    amount: number
    paymentStatus: 'paid' | 'pending' | 'overdue'
    lastPayment: string
}

const sampleSubscriptions: Subscription[] = [
    {
        id: '1',
        schoolName: 'Lahore Grammar School',
        schoolCode: 'LGS-001',
        plan: 'premium',
        status: 'active',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        amount: 150000,
        paymentStatus: 'paid',
        lastPayment: '2024-01-05',
    },
    {
        id: '2',
        schoolName: 'Beaconhouse School System',
        schoolCode: 'BHS-002',
        plan: 'premium',
        status: 'active',
        startDate: '2024-02-01',
        endDate: '2025-01-31',
        amount: 150000,
        paymentStatus: 'paid',
        lastPayment: '2024-02-03',
    },
    {
        id: '3',
        schoolName: 'City School Network',
        schoolCode: 'CSN-003',
        plan: 'standard',
        status: 'active',
        startDate: '2024-03-01',
        endDate: '2025-02-28',
        amount: 80000,
        paymentStatus: 'paid',
        lastPayment: '2024-03-02',
    },
    {
        id: '4',
        schoolName: 'Roots School System',
        schoolCode: 'RSS-004',
        plan: 'basic',
        status: 'expired',
        startDate: '2023-06-01',
        endDate: '2024-05-31',
        amount: 40000,
        paymentStatus: 'overdue',
        lastPayment: '2023-06-05',
    },
    {
        id: '5',
        schoolName: 'Faisalabad Public School',
        schoolCode: 'FPS-005',
        plan: 'basic',
        status: 'pending',
        startDate: '2024-06-01',
        endDate: '2025-05-31',
        amount: 40000,
        paymentStatus: 'pending',
        lastPayment: '-',
    },
    {
        id: '6',
        schoolName: 'Quetta Model School',
        schoolCode: 'QMS-006',
        plan: 'standard',
        status: 'cancelled',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        amount: 80000,
        paymentStatus: 'overdue',
        lastPayment: '2024-04-15',
    },
]

export default function SubscriptionsPage() {
    const [subscriptions] = useState<Subscription[]>(sampleSubscriptions)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [planFilter, setPlanFilter] = useState<string>('all')
    const [invoicesOpen, setInvoicesOpen] = useState(false)
    const [detailsOpen, setDetailsOpen] = useState(false)
    const [selectedSub, setSelectedSub] = useState<Subscription | null>(null)
    const [renewOpen, setRenewOpen] = useState(false)
    const [paymentOpen, setPaymentOpen] = useState(false)

    const filteredSubscriptions = subscriptions.filter((sub) => {
        const matchesSearch =
            sub.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sub.schoolCode.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'all' || sub.status === statusFilter
        const matchesPlan = planFilter === 'all' || sub.plan === planFilter
        return matchesSearch && matchesStatus && matchesPlan
    })

    const handleViewDetails = (sub: Subscription) => {
        setSelectedSub(sub)
        setDetailsOpen(true)
    }

    const handleRenewSubscription = (sub: Subscription) => {
        setSelectedSub(sub)
        setRenewOpen(true)
    }

    const handleRecordPayment = (sub: Subscription) => {
        setSelectedSub(sub)
        setPaymentOpen(true)
    }

    const handleConfirmRenew = () => {
        toast.success(`Subscription renewed for ${selectedSub?.schoolName}`)
        setRenewOpen(false)
    }

    const handleConfirmPayment = () => {
        toast.success(`Payment recorded for ${selectedSub?.schoolName}`)
        setPaymentOpen(false)
    }

    const getStatusBadge = (status: Subscription['status']) => {
        switch (status) {
            case 'active':
                return (
                    <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Active
                    </Badge>
                )
            case 'expired':
                return (
                    <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">
                        <AlertCircle className="mr-1 h-3 w-3" />
                        Expired
                    </Badge>
                )
            case 'pending':
                return (
                    <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">
                        <Clock className="mr-1 h-3 w-3" />
                        Pending
                    </Badge>
                )
            case 'cancelled':
                return (
                    <Badge className="bg-gray-500/10 text-gray-500 hover:bg-gray-500/20">
                        Cancelled
                    </Badge>
                )
        }
    }

    const getPaymentBadge = (status: Subscription['paymentStatus']) => {
        switch (status) {
            case 'paid':
                return <Badge variant="outline" className="text-green-500 border-green-500">Paid</Badge>
            case 'pending':
                return <Badge variant="outline" className="text-yellow-500 border-yellow-500">Pending</Badge>
            case 'overdue':
                return <Badge variant="outline" className="text-red-500 border-red-500">Overdue</Badge>
        }
    }

    const getPlanBadge = (plan: Subscription['plan']) => {
        switch (plan) {
            case 'premium':
                return <Badge className="bg-purple-500/10 text-purple-500">Premium</Badge>
            case 'standard':
                return <Badge className="bg-blue-500/10 text-blue-500">Standard</Badge>
            case 'basic':
                return <Badge variant="outline">Basic</Badge>
        }
    }

    const totalRevenue = subscriptions
        .filter((s) => s.paymentStatus === 'paid')
        .reduce((acc, s) => acc + s.amount, 0)
    const activeSubscriptions = subscriptions.filter((s) => s.status === 'active').length
    const pendingPayments = subscriptions.filter((s) => s.paymentStatus !== 'paid').length

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
                    <p className="text-muted-foreground">
                        Manage school subscriptions and billing
                    </p>
                </div>
                <Button className="gradient-primary" onClick={() => setInvoicesOpen(true)}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    View Invoices
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Rs. {totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">This fiscal year</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{activeSubscriptions}</div>
                        <p className="text-xs text-muted-foreground">Currently running</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-500">{pendingPayments}</div>
                        <p className="text-xs text-muted-foreground">Require attention</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+18%</div>
                        <p className="text-xs text-muted-foreground">vs last quarter</p>
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
                                placeholder="Search by school name or code..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[160px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="expired">Expired</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={planFilter} onValueChange={setPlanFilter}>
                            <SelectTrigger className="w-[160px]">
                                <SelectValue placeholder="Plan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Plans</SelectItem>
                                <SelectItem value="basic">Basic</SelectItem>
                                <SelectItem value="standard">Standard</SelectItem>
                                <SelectItem value="premium">Premium</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Subscriptions Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>School</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Period</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead>Payment</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredSubscriptions.map((sub) => (
                                <TableRow key={sub.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                                <Building2 className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{sub.schoolName}</p>
                                                <p className="text-sm text-muted-foreground">{sub.schoolCode}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{getPlanBadge(sub.plan)}</TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <p>{new Date(sub.startDate).toLocaleDateString()}</p>
                                            <p className="text-muted-foreground">
                                                to {new Date(sub.endDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        Rs. {sub.amount.toLocaleString()}
                                    </TableCell>
                                    <TableCell>{getPaymentBadge(sub.paymentStatus)}</TableCell>
                                    <TableCell>{getStatusBadge(sub.status)}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleViewDetails(sub)}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleRenewSubscription(sub)}>
                                                    <RefreshCw className="mr-2 h-4 w-4" />
                                                    Renew Subscription
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleRecordPayment(sub)}>
                                                    <CreditCard className="mr-2 h-4 w-4" />
                                                    Record Payment
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Invoices Dialog */}
            <Dialog open={invoicesOpen} onOpenChange={setInvoicesOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Invoices
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Invoice #</TableHead>
                                    <TableHead>School</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {subscriptions.slice(0, 5).map((sub, i) => (
                                    <TableRow key={sub.id}>
                                        <TableCell className="font-mono">INV-2024-{String(i + 1).padStart(3, '0')}</TableCell>
                                        <TableCell>{sub.schoolName}</TableCell>
                                        <TableCell>Rs. {sub.amount.toLocaleString()}</TableCell>
                                        <TableCell>{getPaymentBadge(sub.paymentStatus)}</TableCell>
                                        <TableCell>{sub.lastPayment}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Details Dialog */}
            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Subscription Details</DialogTitle>
                    </DialogHeader>
                    {selectedSub && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-muted-foreground">School</Label>
                                    <p className="font-medium">{selectedSub.schoolName}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Code</Label>
                                    <p className="font-medium">{selectedSub.schoolCode}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Plan</Label>
                                    <p className="font-medium capitalize">{selectedSub.plan}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Amount</Label>
                                    <p className="font-medium">Rs. {selectedSub.amount.toLocaleString()}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Start Date</Label>
                                    <p className="font-medium">{selectedSub.startDate}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">End Date</Label>
                                    <p className="font-medium">{selectedSub.endDate}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Status</Label>
                                    <div className="mt-1">{getStatusBadge(selectedSub.status)}</div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Payment</Label>
                                    <div className="mt-1">{getPaymentBadge(selectedSub.paymentStatus)}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Renew Dialog */}
            <Dialog open={renewOpen} onOpenChange={setRenewOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Renew Subscription</DialogTitle>
                    </DialogHeader>
                    {selectedSub && (
                        <div className="space-y-4">
                            <p>Renew subscription for <strong>{selectedSub.schoolName}</strong>?</p>
                            <div className="space-y-2">
                                <Label>New Plan</Label>
                                <Select defaultValue={selectedSub.plan}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="basic">Basic - Rs. 40,000/year</SelectItem>
                                        <SelectItem value="standard">Standard - Rs. 80,000/year</SelectItem>
                                        <SelectItem value="premium">Premium - Rs. 150,000/year</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setRenewOpen(false)}>Cancel</Button>
                                <Button className="gradient-primary" onClick={handleConfirmRenew}>Confirm Renewal</Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Record Payment Dialog */}
            <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Record Payment</DialogTitle>
                    </DialogHeader>
                    {selectedSub && (
                        <div className="space-y-4">
                            <p>Record payment for <strong>{selectedSub.schoolName}</strong></p>
                            <div className="space-y-2">
                                <Label>Amount (Rs.)</Label>
                                <Input type="number" defaultValue={selectedSub.amount} />
                            </div>
                            <div className="space-y-2">
                                <Label>Payment Method</Label>
                                <Select defaultValue="bank">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="bank">Bank Transfer</SelectItem>
                                        <SelectItem value="jazzcash">JazzCash</SelectItem>
                                        <SelectItem value="easypaisa">Easypaisa</SelectItem>
                                        <SelectItem value="cash">Cash</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Reference Number</Label>
                                <Input placeholder="Transaction ID" />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setPaymentOpen(false)}>Cancel</Button>
                                <Button className="gradient-primary" onClick={handleConfirmPayment}>Record Payment</Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
