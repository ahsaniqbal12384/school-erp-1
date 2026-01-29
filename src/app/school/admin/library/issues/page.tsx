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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    BookOpen,
    Plus,
    Search,
    CheckCircle,
    AlertCircle,
    Clock,
    ArrowRightLeft,
    MoreHorizontal,
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface BookIssue {
    id: string
    bookTitle: string
    accessionNo: string
    memberName: string
    memberType: 'student' | 'staff'
    membershipNo: string
    issueDate: string
    dueDate: string
    returnDate: string | null
    status: 'issued' | 'returned' | 'overdue'
    fine: number
}

const sampleIssues: BookIssue[] = [
    { id: '1', bookTitle: 'Physics for Class 10', accessionNo: 'ACC-001-001', memberName: 'Ahmed Khan', memberType: 'student', membershipNo: 'LIB-STD-001', issueDate: '2024-12-10', dueDate: '2024-12-24', returnDate: null, status: 'issued', fine: 0 },
    { id: '2', bookTitle: 'Mathematics Grade 9', accessionNo: 'ACC-002-003', memberName: 'Dr. Sana Malik', memberType: 'staff', membershipNo: 'LIB-STF-001', issueDate: '2024-12-05', dueDate: '2025-01-05', returnDate: null, status: 'issued', fine: 0 },
    { id: '3', bookTitle: 'English Grammar', accessionNo: 'ACC-003-002', memberName: 'Fatima Ali', memberType: 'student', membershipNo: 'LIB-STD-015', issueDate: '2024-12-01', dueDate: '2024-12-15', returnDate: null, status: 'overdue', fine: 60 },
    { id: '4', bookTitle: 'Pakistan Studies', accessionNo: 'ACC-004-001', memberName: 'Hassan Raza', memberType: 'student', membershipNo: 'LIB-STD-022', issueDate: '2024-12-08', dueDate: '2024-12-22', returnDate: '2024-12-20', status: 'returned', fine: 0 },
    { id: '5', bookTitle: 'Biology Class 9', accessionNo: 'ACC-005-002', memberName: 'Mr. Ahmad Shah', memberType: 'staff', membershipNo: 'LIB-STF-005', issueDate: '2024-12-03', dueDate: '2025-01-03', returnDate: null, status: 'issued', fine: 0 },
    { id: '6', bookTitle: 'Chemistry Practical', accessionNo: 'ACC-006-001', memberName: 'Zainab Hassan', memberType: 'student', membershipNo: 'LIB-STD-033', issueDate: '2024-11-25', dueDate: '2024-12-09', returnDate: null, status: 'overdue', fine: 120 },
]

export default function LibraryIssuesPage() {
    const [issues, setIssues] = useState<BookIssue[]>(sampleIssues)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [isIssueDialogOpen, setIsIssueDialogOpen] = useState(false)
    const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false)
    const [selectedIssue, setSelectedIssue] = useState<BookIssue | null>(null)

    const filteredIssues = issues.filter((issue) => {
        const matchesSearch =
            issue.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            issue.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            issue.accessionNo.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'all' || issue.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const issuedCount = issues.filter(i => i.status === 'issued').length
    const overdueCount = issues.filter(i => i.status === 'overdue').length
    const returnedToday = issues.filter(i => i.returnDate === new Date().toISOString().split('T')[0]).length
    const totalFines = issues.reduce((sum, i) => sum + i.fine, 0)

    const getStatusBadge = (status: BookIssue['status']) => {
        switch (status) {
            case 'issued':
                return <Badge className="bg-blue-500/10 text-blue-500"><Clock className="w-3 h-3 mr-1" />Issued</Badge>
            case 'returned':
                return <Badge className="bg-green-500/10 text-green-500"><CheckCircle className="w-3 h-3 mr-1" />Returned</Badge>
            case 'overdue':
                return <Badge className="bg-red-500/10 text-red-500"><AlertCircle className="w-3 h-3 mr-1" />Overdue</Badge>
        }
    }

    const handleReturn = (issue: BookIssue) => {
        setSelectedIssue(issue)
        setIsReturnDialogOpen(true)
    }

    const confirmReturn = () => {
        if (selectedIssue) {
            setIssues(issues.map(i =>
                i.id === selectedIssue.id
                    ? { ...i, status: 'returned', returnDate: new Date().toISOString().split('T')[0] }
                    : i
            ))
        }
        setIsReturnDialogOpen(false)
        setSelectedIssue(null)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Book Issues & Returns</h1>
                    <p className="text-muted-foreground">
                        Manage book issues, returns, and track overdue books
                    </p>
                </div>
                <div className="flex gap-3">
                    <Dialog open={isIssueDialogOpen} onOpenChange={setIsIssueDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gradient-primary">
                                <Plus className="mr-2 h-4 w-4" />
                                Issue Book
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>Issue New Book</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label>Book (Accession No)</Label>
                                    <Input placeholder="Scan or enter accession number" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Member</Label>
                                    <Input placeholder="Enter membership number" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Due Date</Label>
                                    <Input type="date" />
                                </div>
                                <div className="flex justify-end gap-3">
                                    <Button variant="outline" onClick={() => setIsIssueDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={() => setIsIssueDialogOpen(false)}>
                                        Issue Book
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Currently Issued</CardTitle>
                        <BookOpen className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{issuedCount}</div>
                        <p className="text-xs text-muted-foreground">Books out on loan</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">{overdueCount}</div>
                        <p className="text-xs text-muted-foreground">Past due date</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Returned Today</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{returnedToday}</div>
                        <p className="text-xs text-muted-foreground">Books returned today</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Pending Fines</CardTitle>
                        <Clock className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-500">Rs. {totalFines}</div>
                        <p className="text-xs text-muted-foreground">From overdue books</p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <TabsList>
                        <TabsTrigger value="all">All Issues</TabsTrigger>
                        <TabsTrigger value="issued">Currently Issued</TabsTrigger>
                        <TabsTrigger value="overdue">Overdue</TabsTrigger>
                        <TabsTrigger value="returned">Returned</TabsTrigger>
                    </TabsList>
                    <div className="flex gap-3">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search books or members..."
                                className="pl-8 w-[250px]"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="issued">Issued</SelectItem>
                                <SelectItem value="overdue">Overdue</SelectItem>
                                <SelectItem value="returned">Returned</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <TabsContent value="all" className="mt-4">
                    <Card>
                        <CardContent className="pt-6">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Book</TableHead>
                                        <TableHead>Accession No</TableHead>
                                        <TableHead>Member</TableHead>
                                        <TableHead>Issue Date</TableHead>
                                        <TableHead>Due Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Fine</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredIssues.map((issue) => (
                                        <TableRow key={issue.id}>
                                            <TableCell className="font-medium">{issue.bookTitle}</TableCell>
                                            <TableCell>{issue.accessionNo}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span>{issue.memberName}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {issue.membershipNo}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{issue.issueDate}</TableCell>
                                            <TableCell>{issue.dueDate}</TableCell>
                                            <TableCell>{getStatusBadge(issue.status)}</TableCell>
                                            <TableCell>
                                                {issue.fine > 0 ? (
                                                    <span className="text-red-500 font-medium">Rs. {issue.fine}</span>
                                                ) : (
                                                    '-'
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {issue.status !== 'returned' && (
                                                    <Button 
                                                        size="sm" 
                                                        variant="outline"
                                                        onClick={() => handleReturn(issue)}
                                                    >
                                                        <ArrowRightLeft className="h-4 w-4 mr-1" />
                                                        Return
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="issued" className="mt-4">
                    <Card>
                        <CardContent className="pt-6">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Book</TableHead>
                                        <TableHead>Member</TableHead>
                                        <TableHead>Issue Date</TableHead>
                                        <TableHead>Due Date</TableHead>
                                        <TableHead>Days Remaining</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {issues.filter(i => i.status === 'issued').map((issue) => {
                                        const dueDate = new Date(issue.dueDate)
                                        const today = new Date()
                                        const daysRemaining = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                                        return (
                                            <TableRow key={issue.id}>
                                                <TableCell className="font-medium">{issue.bookTitle}</TableCell>
                                                <TableCell>{issue.memberName}</TableCell>
                                                <TableCell>{issue.issueDate}</TableCell>
                                                <TableCell>{issue.dueDate}</TableCell>
                                                <TableCell>
                                                    <Badge variant={daysRemaining < 3 ? 'destructive' : 'secondary'}>
                                                        {daysRemaining} days
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button 
                                                        size="sm" 
                                                        variant="outline"
                                                        onClick={() => handleReturn(issue)}
                                                    >
                                                        Return
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="overdue" className="mt-4">
                    <Card>
                        <CardContent className="pt-6">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Book</TableHead>
                                        <TableHead>Member</TableHead>
                                        <TableHead>Due Date</TableHead>
                                        <TableHead>Days Overdue</TableHead>
                                        <TableHead>Fine Amount</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {issues.filter(i => i.status === 'overdue').map((issue) => {
                                        const dueDate = new Date(issue.dueDate)
                                        const today = new Date()
                                        const daysOverdue = Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
                                        return (
                                            <TableRow key={issue.id}>
                                                <TableCell className="font-medium">{issue.bookTitle}</TableCell>
                                                <TableCell>{issue.memberName}</TableCell>
                                                <TableCell>{issue.dueDate}</TableCell>
                                                <TableCell>
                                                    <Badge variant="destructive">{daysOverdue} days</Badge>
                                                </TableCell>
                                                <TableCell className="text-red-500 font-medium">
                                                    Rs. {issue.fine}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button 
                                                        size="sm" 
                                                        variant="outline"
                                                        onClick={() => handleReturn(issue)}
                                                    >
                                                        Return & Pay Fine
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="returned" className="mt-4">
                    <Card>
                        <CardContent className="pt-6">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Book</TableHead>
                                        <TableHead>Member</TableHead>
                                        <TableHead>Issue Date</TableHead>
                                        <TableHead>Return Date</TableHead>
                                        <TableHead>Fine Paid</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {issues.filter(i => i.status === 'returned').map((issue) => (
                                        <TableRow key={issue.id}>
                                            <TableCell className="font-medium">{issue.bookTitle}</TableCell>
                                            <TableCell>{issue.memberName}</TableCell>
                                            <TableCell>{issue.issueDate}</TableCell>
                                            <TableCell>{issue.returnDate}</TableCell>
                                            <TableCell>{issue.fine > 0 ? `Rs. ${issue.fine}` : '-'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Return Dialog */}
            <Dialog open={isReturnDialogOpen} onOpenChange={setIsReturnDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Return Book</DialogTitle>
                    </DialogHeader>
                    {selectedIssue && (
                        <div className="space-y-4 pt-4">
                            <div className="bg-accent p-4 rounded-lg space-y-2">
                                <p><strong>Book:</strong> {selectedIssue.bookTitle}</p>
                                <p><strong>Member:</strong> {selectedIssue.memberName}</p>
                                <p><strong>Due Date:</strong> {selectedIssue.dueDate}</p>
                                {selectedIssue.fine > 0 && (
                                    <p className="text-red-500"><strong>Fine Amount:</strong> Rs. {selectedIssue.fine}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>Book Condition</Label>
                                <Select defaultValue="good">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="good">Good</SelectItem>
                                        <SelectItem value="fair">Fair</SelectItem>
                                        <SelectItem value="damaged">Damaged</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex justify-end gap-3">
                                <Button variant="outline" onClick={() => setIsReturnDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={confirmReturn}>
                                    {selectedIssue.fine > 0 ? 'Return & Collect Fine' : 'Confirm Return'}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
