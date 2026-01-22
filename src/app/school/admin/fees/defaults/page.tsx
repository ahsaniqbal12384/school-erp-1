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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    AlertCircle,
    Search,
    DollarSign,
    Phone,
    MessageSquare,
    Download,
    GraduationCap,
    Calendar,
    Send,
} from 'lucide-react'

interface DefaultRecord {
    id: string
    studentName: string
    rollNo: string
    class: string
    fatherName: string
    phone: string
    pendingAmount: number
    pendingMonths: number
    lastPaymentDate: string
    daysOverdue: number
}

const sampleDefaults: DefaultRecord[] = [
    { id: '1', studentName: 'Hassan Raza', rollNo: '1003', class: 'Class 10-A', fatherName: 'Ahmad Raza', phone: '+92-300-3456789', pendingAmount: 45000, pendingMonths: 3, lastPaymentDate: '2023-10-15', daysOverdue: 95 },
    { id: '2', studentName: 'Ali Hassan', rollNo: '1007', class: 'Class 9-B', fatherName: 'Hassan Shah', phone: '+92-300-7890123', pendingAmount: 36000, pendingMonths: 3, lastPaymentDate: '2023-10-20', daysOverdue: 90 },
    { id: '3', studentName: 'Sara Ahmed', rollNo: '1004', class: 'Class 10-B', fatherName: 'Imran Ahmed', phone: '+92-300-4567890', pendingAmount: 15000, pendingMonths: 1, lastPaymentDate: '2023-12-08', daysOverdue: 40 },
    { id: '4', studentName: 'Ayesha Malik', rollNo: '1006', class: 'Class 9-A', fatherName: 'Asad Malik', phone: '+92-300-6789012', pendingAmount: 24000, pendingMonths: 2, lastPaymentDate: '2023-11-10', daysOverdue: 70 },
    { id: '5', studentName: 'Bilal Khan', rollNo: '1012', class: 'Class 8-A', fatherName: 'Saleem Khan', phone: '+92-300-1234568', pendingAmount: 30000, pendingMonths: 3, lastPaymentDate: '2023-10-25', daysOverdue: 85 },
    { id: '6', studentName: 'Maryam Shah', rollNo: '1015', class: 'Class 7-B', fatherName: 'Nasir Shah', phone: '+92-300-2345679', pendingAmount: 16000, pendingMonths: 2, lastPaymentDate: '2023-11-20', daysOverdue: 60 },
    { id: '7', studentName: 'Usman Ali', rollNo: '1018', class: 'Class 6-A', fatherName: 'Ali Raza', phone: '+92-300-3456790', pendingAmount: 24000, pendingMonths: 3, lastPaymentDate: '2023-10-05', daysOverdue: 105 },
]

export default function FeeDefaultsPage() {
    const [defaults] = useState<DefaultRecord[]>(sampleDefaults)
    const [searchQuery, setSearchQuery] = useState('')
    const [classFilter, setClassFilter] = useState<string>('all')
    const [sortBy, setSortBy] = useState<string>('amount')

    const filteredDefaults = defaults
        .filter((record) => {
            const matchesSearch =
                record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                record.rollNo.includes(searchQuery) ||
                record.fatherName.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesClass = classFilter === 'all' || record.class.includes(classFilter)
            return matchesSearch && matchesClass
        })
        .sort((a, b) => {
            if (sortBy === 'amount') return b.pendingAmount - a.pendingAmount
            if (sortBy === 'days') return b.daysOverdue - a.daysOverdue
            return 0
        })

    const totalDefaultAmount = defaults.reduce((acc, d) => acc + d.pendingAmount, 0)
    const totalDefaulters = defaults.length
    const criticalDefaulters = defaults.filter((d) => d.daysOverdue > 60).length

    const getSeverityBadge = (days: number) => {
        if (days > 90) return <Badge className="bg-red-500 text-white">Critical</Badge>
        if (days > 60) return <Badge className="bg-orange-500 text-white">High</Badge>
        if (days > 30) return <Badge className="bg-yellow-500 text-white">Medium</Badge>
        return <Badge className="bg-blue-500 text-white">Low</Badge>
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Fee Defaults Report</h1>
                    <p className="text-muted-foreground">
                        Track and manage overdue fee payments
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export Report
                    </Button>
                    <Button className="gradient-primary">
                        <Send className="mr-2 h-4 w-4" />
                        Send Reminders
                    </Button>
                </div>
            </div>

            {/* Alert Card */}
            <Card className="border-red-500/50 bg-red-500/5">
                <CardContent className="py-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                            <AlertCircle className="h-6 w-6 text-red-500" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-red-500">Outstanding Amount: Rs. {totalDefaultAmount.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">
                                {totalDefaulters} students with pending fees • {criticalDefaulters} critical (90+ days)
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
                        <DollarSign className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">Rs. {totalDefaultAmount.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Pending collection</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Defaulters</CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalDefaulters}</div>
                        <p className="text-xs text-muted-foreground">Students</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Critical (90+ Days)</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">{criticalDefaulters}</div>
                        <p className="text-xs text-muted-foreground">Need immediate action</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Avg Days Overdue</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {Math.round(defaults.reduce((acc, d) => acc + d.daysOverdue, 0) / defaults.length)}
                        </div>
                        <p className="text-xs text-muted-foreground">Days</p>
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
                                placeholder="Search by student name, roll no, or father's name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={classFilter} onValueChange={setClassFilter}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Class" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Classes</SelectItem>
                                <SelectItem value="Class 10">Class 10</SelectItem>
                                <SelectItem value="Class 9">Class 9</SelectItem>
                                <SelectItem value="Class 8">Class 8</SelectItem>
                                <SelectItem value="Class 7">Class 7</SelectItem>
                                <SelectItem value="Class 6">Class 6</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Sort By" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="amount">Amount (High to Low)</SelectItem>
                                <SelectItem value="days">Days Overdue</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Defaults Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        Fee Defaulters List
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Father&apos;s Name</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead className="text-center">Months</TableHead>
                                <TableHead className="text-right">Pending Amount</TableHead>
                                <TableHead className="text-center">Days Overdue</TableHead>
                                <TableHead>Severity</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredDefaults.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10">
                                                <GraduationCap className="h-4 w-4 text-red-500" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{record.studentName}</p>
                                                <p className="text-xs text-muted-foreground">Roll: {record.rollNo}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{record.class}</Badge>
                                    </TableCell>
                                    <TableCell>{record.fatherName}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm">
                                            <Phone className="h-3 w-3 text-muted-foreground" />
                                            {record.phone}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">{record.pendingMonths}</TableCell>
                                    <TableCell className="text-right font-bold text-red-500">
                                        Rs. {record.pendingAmount.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-center">{record.daysOverdue}</TableCell>
                                    <TableCell>{getSeverityBadge(record.daysOverdue)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button size="sm" variant="ghost">
                                                <Phone className="h-4 w-4" />
                                            </Button>
                                            <Button size="sm" variant="ghost">
                                                <MessageSquare className="h-4 w-4" />
                                            </Button>
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
