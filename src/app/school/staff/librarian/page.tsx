'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
    DialogDescription,
    DialogFooter,
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
    Search,
    BookOpen,
    BookMarked,
    Plus,
    AlertTriangle,
    CheckCircle2,
    Users,
    Loader2,
    DollarSign,
} from 'lucide-react'
import { toast } from 'sonner'

type Book = {
    id: string
    isbn: string
    title: string
    author: string
    category: string
    quantity: number
    available: number
}

type Issue = {
    id: string
    issue_date: string
    due_date: string
    return_date: string | null
    fine_amount: number
    fine_paid: boolean
    status: string
    book: { title: string } | null
    student: { admission_no: string; father_name: string } | null
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
        style: 'currency',
        currency: 'PKR',
        minimumFractionDigits: 0,
    }).format(amount)
}

export default function LibrarianPortalPage() {
    const supabase = createClient()
    const [books, setBooks] = useState<Book[]>([])
    const [issues, setIssues] = useState<Issue[]>([])
    const [students, setStudents] = useState<{ id: string; admission_no: string }[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [isIssueDialogOpen, setIsIssueDialogOpen] = useState(false)
    const [isAddBookDialogOpen, setIsAddBookDialogOpen] = useState(false)
    const [selectedBook, setSelectedBook] = useState('')
    const [selectedStudent, setSelectedStudent] = useState('')
    const [newBook, setNewBook] = useState({
        isbn: '',
        title: '',
        author: '',
        category: 'general',
        quantity: 1,
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const [booksRes, issuesRes, studentsRes] = await Promise.all([
                supabase.from('library_books').select('*').order('title'),
                supabase.from('library_issues').select('*, book:library_books(title), student:students(admission_no, father_name)').order('issue_date', { ascending: false }),
                supabase.from('students').select('id, admission_no').eq('status', 'active'),
            ])

            if (booksRes.error) throw booksRes.error
            if (issuesRes.error) throw issuesRes.error

            setBooks(booksRes.data || [])
            setIssues(issuesRes.data || [])
            setStudents(studentsRes.data || [])
        } catch (err) {
            console.error('Error fetching data:', err)
            toast.error('Failed to load data')
        } finally {
            setIsLoading(false)
        }
    }

    const handleIssueBook = async () => {
        if (!selectedBook || !selectedStudent) {
            toast.error('Please select book and student')
            return
        }

        try {
            const issueDate = new Date()
            const dueDate = new Date()
            dueDate.setDate(dueDate.getDate() + 14)

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { error } = await (supabase as any).from('library_issues').insert({
                school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
                book_id: selectedBook,
                student_id: selectedStudent,
                issue_date: issueDate.toISOString().split('T')[0],
                due_date: dueDate.toISOString().split('T')[0],
                status: 'issued',
                fine_amount: 0,
                fine_paid: false,
            })

            if (error) throw error

            toast.success('Book issued successfully!')
            setIsIssueDialogOpen(false)
            setSelectedBook('')
            setSelectedStudent('')
            fetchData()
        } catch (err) {
            console.error('Error issuing book:', err)
            toast.error('Failed to issue book')
        }
    }

    const handleAddBook = async () => {
        if (!newBook.isbn || !newBook.title || !newBook.author) {
            toast.error('Please fill required fields')
            return
        }

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { error } = await (supabase as any).from('library_books').insert({
                school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
                ...newBook,
                available: newBook.quantity,
            })

            if (error) throw error

            toast.success('Book added!')
            setIsAddBookDialogOpen(false)
            setNewBook({ isbn: '', title: '', author: '', category: 'general', quantity: 1 })
            fetchData()
        } catch (err) {
            console.error('Error adding book:', err)
            toast.error('Failed to add book')
        }
    }

    const handleReturnBook = async (issueId: string, dueDate: string) => {
        try {
            // Calculate fine if overdue (Rs. 10 per day)
            const today = new Date()
            const due = new Date(dueDate)
            let fine = 0
            if (today > due) {
                const daysOverdue = Math.ceil((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24))
                fine = daysOverdue * 10
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { error } = await (supabase as any)
                .from('library_issues')
                .update({
                    return_date: today.toISOString().split('T')[0],
                    status: 'returned',
                    fine_amount: fine,
                })
                .eq('id', issueId)

            if (error) throw error
            toast.success(fine > 0 ? `Book returned! Fine: ${formatCurrency(fine)}` : 'Book returned!')
            fetchData()
        } catch (err) {
            console.error('Error returning book:', err)
            toast.error('Failed to return book')
        }
    }

    const filteredBooks = books.filter(
        (b) =>
            b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.isbn.includes(searchQuery)
    )

    const overdueIssues = issues.filter((i) => i.status === 'issued' && new Date(i.due_date) < new Date())
    const totalFines = issues.filter(i => !i.fine_paid).reduce((sum, i) => sum + Number(i.fine_amount || 0), 0)

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Librarian Portal</h1>
                    <p className="text-muted-foreground">Manage library books, issues, and returns</p>
                </div>
                <div className="flex gap-3">
                    <Dialog open={isIssueDialogOpen} onOpenChange={setIsIssueDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="btn-premium text-white">
                                <BookMarked className="mr-2 h-4 w-4" />
                                Issue Book
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Issue Book</DialogTitle>
                                <DialogDescription>Issue a book to a student</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Select Book</Label>
                                    <Select value={selectedBook} onValueChange={setSelectedBook}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose a book" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {books.filter(b => b.available > 0).map((book) => (
                                                <SelectItem key={book.id} value={book.id}>
                                                    {book.title} ({book.available} available)
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Select Student</Label>
                                    <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose a student" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {students.map((student) => (
                                                <SelectItem key={student.id} value={student.id}>
                                                    {student.admission_no}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsIssueDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleIssueBook}>Issue Book</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isAddBookDialogOpen} onOpenChange={setIsAddBookDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Book
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Book</DialogTitle>
                                <DialogDescription>Add a book to the library catalog</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>ISBN *</Label>
                                    <Input
                                        value={newBook.isbn}
                                        onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                                        placeholder="978-3-16-148410-0"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Title *</Label>
                                    <Input
                                        value={newBook.title}
                                        onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                                        placeholder="Book Title"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Author *</Label>
                                    <Input
                                        value={newBook.author}
                                        onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                                        placeholder="Author Name"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Category</Label>
                                        <Select value={newBook.category} onValueChange={(v) => setNewBook({ ...newBook, category: v })}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="general">General</SelectItem>
                                                <SelectItem value="fiction">Fiction</SelectItem>
                                                <SelectItem value="non_fiction">Non-Fiction</SelectItem>
                                                <SelectItem value="textbook">Textbook</SelectItem>
                                                <SelectItem value="reference">Reference</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Quantity</Label>
                                        <Input
                                            type="number"
                                            min={1}
                                            value={newBook.quantity}
                                            onChange={(e) => setNewBook({ ...newBook, quantity: parseInt(e.target.value) || 1 })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddBookDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleAddBook}>Add Book</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <BookOpen className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{books.length}</p>
                                <p className="text-xs text-muted-foreground">Total Titles</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                                <BookMarked className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{issues.filter(i => i.status === 'issued').length}</p>
                                <p className="text-xs text-muted-foreground">Currently Issued</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{overdueIssues.length}</p>
                                <p className="text-xs text-muted-foreground">Overdue</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                                <DollarSign className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-lg font-bold">{formatCurrency(totalFines)}</p>
                                <p className="text-xs text-muted-foreground">Pending Fines</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="issues" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="issues" className="gap-2">
                        <BookMarked className="h-4 w-4" />
                        Active Issues
                    </TabsTrigger>
                    <TabsTrigger value="catalog" className="gap-2">
                        <BookOpen className="h-4 w-4" />
                        Book Catalog
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="issues">
                    <Card>
                        <CardHeader>
                            <CardTitle>Active Book Issues</CardTitle>
                            <CardDescription>Books currently issued to students</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Book</TableHead>
                                        <TableHead>Student</TableHead>
                                        <TableHead>Issue Date</TableHead>
                                        <TableHead>Due Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {issues.filter(i => i.status === 'issued').map((issue) => {
                                        const isOverdue = new Date(issue.due_date) < new Date()
                                        return (
                                            <TableRow key={issue.id}>
                                                <TableCell className="font-medium">{issue.book?.title}</TableCell>
                                                <TableCell>{issue.student?.admission_no}</TableCell>
                                                <TableCell>{new Date(issue.issue_date).toLocaleDateString()}</TableCell>
                                                <TableCell className={isOverdue ? 'text-red-600 font-medium' : ''}>
                                                    {new Date(issue.due_date).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={isOverdue ? 'border-red-200 bg-red-50 text-red-700' : 'border-amber-200 bg-amber-50 text-amber-700'}
                                                    >
                                                        {isOverdue ? 'Overdue' : 'Issued'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button size="sm" onClick={() => handleReturnBook(issue.id, issue.due_date)}>
                                                        <CheckCircle2 className="mr-2 h-4 w-4" />
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

                <TabsContent value="catalog">
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <CardTitle>Book Catalog</CardTitle>
                                    <CardDescription>All books in library</CardDescription>
                                </div>
                                <div className="relative w-full md:w-80">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by title, author, ISBN..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ISBN</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Author</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead className="text-center">Total</TableHead>
                                        <TableHead className="text-center">Available</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredBooks.map((book) => (
                                        <TableRow key={book.id}>
                                            <TableCell className="font-mono text-xs">{book.isbn}</TableCell>
                                            <TableCell className="font-medium">{book.title}</TableCell>
                                            <TableCell>{book.author}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="capitalize">{book.category.replace('_', ' ')}</Badge>
                                            </TableCell>
                                            <TableCell className="text-center">{book.quantity}</TableCell>
                                            <TableCell className="text-center">
                                                <Badge className={book.available > 0 ? 'bg-emerald-500' : 'bg-red-500'}>
                                                    {book.available}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
