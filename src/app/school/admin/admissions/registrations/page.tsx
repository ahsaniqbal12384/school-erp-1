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
    UserPlus,
    Search,
    MoreHorizontal,
    CheckCircle,
    XCircle,
    Clock,
    Eye,
    Phone,
    Calendar,
    GraduationCap,
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Registration {
    id: string
    regNo: string
    studentName: string
    fatherName: string
    phone: string
    appliedClass: string
    appliedDate: string
    testScore?: number
    interviewDate?: string
    status: 'pending' | 'shortlisted' | 'admitted' | 'rejected'
}

const sampleRegistrations: Registration[] = [
    { id: '1', regNo: 'REG-2024-001', studentName: 'Ali Hassan', fatherName: 'Hassan Shah', phone: '+92-300-1234567', appliedClass: 'Class 5', appliedDate: '2024-01-10', testScore: 85, interviewDate: '2024-01-20', status: 'shortlisted' },
    { id: '2', regNo: 'REG-2024-002', studentName: 'Sara Ahmed', fatherName: 'Ahmed Raza', phone: '+92-300-2345678', appliedClass: 'Class 6', appliedDate: '2024-01-12', status: 'pending' },
    { id: '3', regNo: 'REG-2024-003', studentName: 'Bilal Khan', fatherName: 'Imran Khan', phone: '+92-300-3456789', appliedClass: 'Class 8', appliedDate: '2024-01-08', testScore: 92, interviewDate: '2024-01-18', status: 'admitted' },
    { id: '4', regNo: 'REG-2024-004', studentName: 'Fatima Ali', fatherName: 'Ali Hussain', phone: '+92-300-4567890', appliedClass: 'Class 5', appliedDate: '2024-01-15', status: 'pending' },
    { id: '5', regNo: 'REG-2024-005', studentName: 'Usman Tariq', fatherName: 'Tariq Shah', phone: '+92-300-5678901', appliedClass: 'Class 7', appliedDate: '2024-01-05', testScore: 62, status: 'rejected' },
    { id: '6', regNo: 'REG-2024-006', studentName: 'Ayesha Malik', fatherName: 'Asad Malik', phone: '+92-300-6789012', appliedClass: 'Class 9', appliedDate: '2024-01-18', status: 'pending' },
    { id: '7', regNo: 'REG-2024-007', studentName: 'Zainab Shah', fatherName: 'Nasir Shah', phone: '+92-300-7890123', appliedClass: 'Class 6', appliedDate: '2024-01-16', testScore: 78, interviewDate: '2024-01-25', status: 'shortlisted' },
]

export default function RegistrationsPage() {
    const [registrations] = useState<Registration[]>(sampleRegistrations)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [classFilter, setClassFilter] = useState<string>('all')

    const filteredRegistrations = registrations.filter((reg) => {
        const matchesSearch =
            reg.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            reg.regNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            reg.fatherName.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'all' || reg.status === statusFilter
        const matchesClass = classFilter === 'all' || reg.appliedClass === classFilter
        return matchesSearch && matchesStatus && matchesClass
    })

    const totalRegistrations = registrations.length
    const pendingCount = registrations.filter((r) => r.status === 'pending').length
    const shortlistedCount = registrations.filter((r) => r.status === 'shortlisted').length
    const admittedCount = registrations.filter((r) => r.status === 'admitted').length

    const getStatusBadge = (status: Registration['status']) => {
        switch (status) {
            case 'pending':
                return (
                    <Badge className="bg-yellow-500/10 text-yellow-500">
                        <Clock className="mr-1 h-3 w-3" />
                        Pending
                    </Badge>
                )
            case 'shortlisted':
                return (
                    <Badge className="bg-blue-500/10 text-blue-500">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Shortlisted
                    </Badge>
                )
            case 'admitted':
                return (
                    <Badge className="bg-green-500/10 text-green-500">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Admitted
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

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Registrations</h1>
                    <p className="text-muted-foreground">
                        Manage admission registrations and applications
                    </p>
                </div>
                <Button className="gradient-primary">
                    <UserPlus className="mr-2 h-4 w-4" />
                    New Registration
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                        <UserPlus className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalRegistrations}</div>
                        <p className="text-xs text-muted-foreground">This session</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-500">{pendingCount}</div>
                        <p className="text-xs text-muted-foreground">Awaiting test</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Shortlisted</CardTitle>
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-500">{shortlistedCount}</div>
                        <p className="text-xs text-muted-foreground">For interview</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Admitted</CardTitle>
                        <GraduationCap className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{admittedCount}</div>
                        <p className="text-xs text-muted-foreground">Confirmed</p>
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
                                placeholder="Search registrations..."
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
                                <SelectItem value="Class 5">Class 5</SelectItem>
                                <SelectItem value="Class 6">Class 6</SelectItem>
                                <SelectItem value="Class 7">Class 7</SelectItem>
                                <SelectItem value="Class 8">Class 8</SelectItem>
                                <SelectItem value="Class 9">Class 9</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                                <SelectItem value="admitted">Admitted</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Registrations Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5" />
                        Registration Applications
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[120px]">Reg No</TableHead>
                                <TableHead>Student Name</TableHead>
                                <TableHead>Father&apos;s Name</TableHead>
                                <TableHead>Applied For</TableHead>
                                <TableHead>Applied Date</TableHead>
                                <TableHead className="text-center">Test Score</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredRegistrations.map((reg) => (
                                <TableRow key={reg.id}>
                                    <TableCell className="font-medium text-primary">{reg.regNo}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                                <GraduationCap className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{reg.studentName}</p>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Phone className="h-3 w-3" />
                                                    {reg.phone}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{reg.fatherName}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{reg.appliedClass}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm">
                                            <Calendar className="h-3 w-3 text-muted-foreground" />
                                            {new Date(reg.appliedDate).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {reg.testScore ? (
                                            <span className={reg.testScore >= 70 ? 'text-green-500 font-medium' : 'text-red-500'}>
                                                {reg.testScore}%
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell>{getStatusBadge(reg.status)}</TableCell>
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
                                                    View Details
                                                </DropdownMenuItem>
                                                {reg.status === 'pending' && (
                                                    <DropdownMenuItem>
                                                        <CheckCircle className="mr-2 h-4 w-4" />
                                                        Schedule Test
                                                    </DropdownMenuItem>
                                                )}
                                                {reg.status === 'shortlisted' && (
                                                    <DropdownMenuItem>
                                                        <GraduationCap className="mr-2 h-4 w-4" />
                                                        Confirm Admission
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
        </div>
    )
}
