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
    FileText,
    Search,
    Download,
    Printer,
    Send,
    Users,
    CheckCircle,
    Clock,
    Mail,
} from 'lucide-react'

interface ReportCard {
    id: string
    rollNo: string
    name: string
    class: string
    section: string
    exam: string
    percentage: number
    grade: string
    rank: number
    status: 'generated' | 'pending' | 'sent'
    generatedDate?: string
}

const sampleReports: ReportCard[] = [
    { id: '1', rollNo: '1001', name: 'Ahmed Khan', class: 'Class 10', section: 'A', exam: 'First Terminal', percentage: 85.8, grade: 'A', rank: 5, status: 'generated', generatedDate: '2024-01-18' },
    { id: '2', rollNo: '1002', name: 'Fatima Ali', class: 'Class 10', section: 'A', exam: 'First Terminal', percentage: 92.5, grade: 'A+', rank: 2, status: 'sent', generatedDate: '2024-01-18' },
    { id: '3', rollNo: '1003', name: 'Hassan Raza', class: 'Class 10', section: 'A', exam: 'First Terminal', percentage: 71.7, grade: 'B', rank: 12, status: 'generated', generatedDate: '2024-01-18' },
    { id: '4', rollNo: '1004', name: 'Sara Ahmed', class: 'Class 10', section: 'A', exam: 'First Terminal', percentage: 88.8, grade: 'A', rank: 4, status: 'sent', generatedDate: '2024-01-18' },
    { id: '5', rollNo: '1005', name: 'Usman Tariq', class: 'Class 10', section: 'A', exam: 'First Terminal', percentage: 78.7, grade: 'B+', rank: 8, status: 'pending' },
    { id: '6', rollNo: '1006', name: 'Ayesha Malik', class: 'Class 10', section: 'A', exam: 'First Terminal', percentage: 96.3, grade: 'A+', rank: 1, status: 'sent', generatedDate: '2024-01-18' },
    { id: '7', rollNo: '1007', name: 'Ali Hassan', class: 'Class 10', section: 'A', exam: 'First Terminal', percentage: 76.2, grade: 'B+', rank: 10, status: 'generated', generatedDate: '2024-01-18' },
    { id: '8', rollNo: '1008', name: 'Zainab Shah', class: 'Class 10', section: 'A', exam: 'First Terminal', percentage: 90.2, grade: 'A+', rank: 3, status: 'sent', generatedDate: '2024-01-18' },
]

export default function ReportCardsPage() {
    const [reports] = useState<ReportCard[]>(sampleReports)
    const [selectedClass, setSelectedClass] = useState<string>('10-A')
    const [selectedExam, setSelectedExam] = useState<string>('terminal1')
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')

    const filteredReports = reports.filter((report) => {
        const matchesSearch =
            report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.rollNo.includes(searchQuery)
        const matchesStatus = statusFilter === 'all' || report.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const generatedCount = reports.filter((r) => r.status === 'generated').length
    const sentCount = reports.filter((r) => r.status === 'sent').length
    const pendingCount = reports.filter((r) => r.status === 'pending').length

    const getStatusBadge = (status: ReportCard['status']) => {
        switch (status) {
            case 'generated':
                return <Badge className="bg-green-500/10 text-green-500">Generated</Badge>
            case 'pending':
                return <Badge className="bg-yellow-500/10 text-yellow-500">Pending</Badge>
            case 'sent':
                return <Badge className="bg-blue-500/10 text-blue-500">Sent to Parent</Badge>
        }
    }

    const getGradeBadge = (grade: string) => {
        if (grade === 'A+') return <Badge className="bg-green-500 text-white">A+</Badge>
        if (grade === 'A') return <Badge className="bg-blue-500 text-white">A</Badge>
        if (grade === 'B+') return <Badge className="bg-yellow-500 text-white">B+</Badge>
        if (grade === 'B') return <Badge className="bg-orange-500 text-white">B</Badge>
        return <Badge variant="outline">{grade}</Badge>
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Report Cards</h1>
                    <p className="text-muted-foreground">
                        Generate and distribute student report cards
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline">
                        <Printer className="mr-2 h-4 w-4" />
                        Print All
                    </Button>
                    <Button className="gradient-primary">
                        <FileText className="mr-2 h-4 w-4" />
                        Generate All
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{reports.length}</div>
                        <p className="text-xs text-muted-foreground">In selected class</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Generated</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{generatedCount + sentCount}</div>
                        <p className="text-xs text-muted-foreground">Reports ready</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Sent to Parents</CardTitle>
                        <Mail className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-500">{sentCount}</div>
                        <p className="text-xs text-muted-foreground">Delivered</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-500">{pendingCount}</div>
                        <p className="text-xs text-muted-foreground">Need generation</p>
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
                                placeholder="Search students..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={selectedClass} onValueChange={setSelectedClass}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Class" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10-A">Class 10-A</SelectItem>
                                <SelectItem value="10-B">Class 10-B</SelectItem>
                                <SelectItem value="9-A">Class 9-A</SelectItem>
                                <SelectItem value="9-B">Class 9-B</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={selectedExam} onValueChange={setSelectedExam}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Exam" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="terminal1">First Terminal</SelectItem>
                                <SelectItem value="midterm">Mid-Term</SelectItem>
                                <SelectItem value="final">Final</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="generated">Generated</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="sent">Sent</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Report Cards Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Report Cards - Class 10-A, First Terminal
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Roll No</TableHead>
                                <TableHead>Student Name</TableHead>
                                <TableHead className="text-center">Percentage</TableHead>
                                <TableHead className="text-center">Grade</TableHead>
                                <TableHead className="text-center">Rank</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredReports.map((report) => (
                                <TableRow key={report.id}>
                                    <TableCell className="font-medium">{report.rollNo}</TableCell>
                                    <TableCell>{report.name}</TableCell>
                                    <TableCell className="text-center font-medium">{report.percentage.toFixed(1)}%</TableCell>
                                    <TableCell className="text-center">{getGradeBadge(report.grade)}</TableCell>
                                    <TableCell className="text-center">
                                        {report.rank <= 3 ? (
                                            <Badge className={report.rank === 1 ? 'bg-yellow-500' : report.rank === 2 ? 'bg-gray-400' : 'bg-orange-400'}>
                                                #{report.rank}
                                            </Badge>
                                        ) : (
                                            `#${report.rank}`
                                        )}
                                    </TableCell>
                                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            {report.status === 'pending' ? (
                                                <Button size="sm" className="gradient-primary">
                                                    <FileText className="mr-1 h-3 w-3" />
                                                    Generate
                                                </Button>
                                            ) : (
                                                <>
                                                    <Button size="sm" variant="ghost">
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="sm" variant="ghost">
                                                        <Printer className="h-4 w-4" />
                                                    </Button>
                                                    {report.status !== 'sent' && (
                                                        <Button size="sm" variant="ghost">
                                                            <Send className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </>
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
