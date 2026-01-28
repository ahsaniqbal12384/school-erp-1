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
    BookMarked,
    Search,
    BookOpen,
    Clock,
    AlertCircle,
    GraduationCap,
    User,
} from 'lucide-react'

interface IssuedBook {
    id: string
    issueId: string
    book: string
    isbn: string
    borrower: string
    borrowerType: 'student' | 'teacher'
    borrowerId: string
    issueDate: string
    dueDate: string
    status: 'issued' | 'overdue'
    daysOverdue?: number
}

const issuedBooks: IssuedBook[] = [
    { id: '1', issueId: 'ISS-001', book: 'Physics for Class 10', isbn: '978-0-134-68599-1', borrower: 'Ahmed Khan', borrowerType: 'student', borrowerId: '1001', issueDate: '2024-01-15', dueDate: '2024-01-29', status: 'issued' },
    { id: '2', issueId: 'ISS-002', book: 'Mathematics Grade 10', isbn: '978-0-134-68600-4', borrower: 'Sara Ali', borrowerType: 'student', borrowerId: '1002', issueDate: '2024-01-14', dueDate: '2024-01-28', status: 'issued' },
    { id: '3', issueId: 'ISS-003', book: 'English Grammar', isbn: '978-0-134-68601-1', borrower: 'Hassan Raza', borrowerType: 'student', borrowerId: '1003', issueDate: '2024-01-10', dueDate: '2024-01-24', status: 'overdue', daysOverdue: 5 },
    { id: '4', issueId: 'ISS-004', book: 'Chemistry Lab Manual', isbn: '978-0-134-68602-8', borrower: 'Dr. Sana Malik', borrowerType: 'teacher', borrowerId: 'EMP002', issueDate: '2024-01-08', dueDate: '2024-02-08', status: 'issued' },
    { id: '5', issueId: 'ISS-005', book: 'Pakistan Studies', isbn: '978-0-134-68603-5', borrower: 'Fatima Ali', borrowerType: 'student', borrowerId: '1005', issueDate: '2024-01-05', dueDate: '2024-01-19', status: 'overdue', daysOverdue: 10 },
    { id: '6', issueId: 'ISS-006', book: 'Biology for Class 9', isbn: '978-0-134-68604-2', borrower: 'Usman Tariq', borrowerType: 'student', borrowerId: '1006', issueDate: '2024-01-12', dueDate: '2024-01-26', status: 'issued' },
    { id: '7', issueId: 'ISS-007', book: 'Computer Science', isbn: '978-0-134-68606-6', borrower: 'Mr. Imran Ali', borrowerType: 'teacher', borrowerId: 'EMP001', issueDate: '2024-01-16', dueDate: '2024-02-16', status: 'issued' },
]

export default function IssuedBooksPage() {
    const [searchQuery, setSearchQuery] = useState('')

    const filteredBooks = issuedBooks.filter((book) =>
        book.book.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.borrower.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.issueId.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const totalIssued = issuedBooks.length
    const overdueCount = issuedBooks.filter((b) => b.status === 'overdue').length
    const studentBooks = issuedBooks.filter((b) => b.borrowerType === 'student').length

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Issued Books</h1>
                    <p className="text-muted-foreground">
                        Track all currently issued books
                    </p>
                </div>
                <Button className="gradient-primary">
                    <BookMarked className="mr-2 h-4 w-4" />
                    Issue New Book
                </Button>
            </div>

            {/* Overdue Alert */}
            {overdueCount > 0 && (
                <Card className="border-red-500/50 bg-red-500/5">
                    <CardContent className="py-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                                <AlertCircle className="h-6 w-6 text-red-500" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-red-500">{overdueCount} Books Overdue</p>
                                <p className="text-sm text-muted-foreground">
                                    Send reminders to borrowers with overdue books
                                </p>
                            </div>
                            <Button variant="outline">Send Reminders</Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Issued</CardTitle>
                        <BookMarked className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalIssued}</div>
                        <p className="text-xs text-muted-foreground">Currently borrowed</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Students</CardTitle>
                        <GraduationCap className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-500">{studentBooks}</div>
                        <p className="text-xs text-muted-foreground">Student borrowers</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Teachers</CardTitle>
                        <User className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-500">{totalIssued - studentBooks}</div>
                        <p className="text-xs text-muted-foreground">Teacher borrowers</p>
                    </CardContent>
                </Card>
                <Card className="card-hover border-red-500/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">{overdueCount}</div>
                        <p className="text-xs text-muted-foreground">Need follow-up</p>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by book title, borrower, or issue ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Issued Books Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookMarked className="h-5 w-5" />
                        All Issued Books
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Issue ID</TableHead>
                                <TableHead>Book</TableHead>
                                <TableHead>Borrower</TableHead>
                                <TableHead>Issue Date</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredBooks.map((book) => (
                                <TableRow key={book.id}>
                                    <TableCell className="font-medium text-primary">{book.issueId}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${book.status === 'overdue' ? 'bg-red-500/10' : 'bg-blue-500/10'
                                                }`}>
                                                <BookOpen className={`h-4 w-4 ${book.status === 'overdue' ? 'text-red-500' : 'text-blue-500'
                                                    }`} />
                                            </div>
                                            <div>
                                                <p className="font-medium">{book.book}</p>
                                                <p className="text-xs text-muted-foreground">{book.isbn}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {book.borrowerType === 'student' ? (
                                                <GraduationCap className="h-4 w-4 text-blue-500" />
                                            ) : (
                                                <User className="h-4 w-4 text-purple-500" />
                                            )}
                                            <div>
                                                <p className="font-medium">{book.borrower}</p>
                                                <p className="text-xs text-muted-foreground">{book.borrowerId}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{new Date(book.issueDate).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <span className={book.status === 'overdue' ? 'text-red-500' : ''}>
                                            {new Date(book.dueDate).toLocaleDateString()}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {book.status === 'overdue' ? (
                                            <Badge className="bg-red-500/10 text-red-500">
                                                {book.daysOverdue} days overdue
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-blue-500/10 text-blue-500">Issued</Badge>
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
