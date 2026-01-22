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
    Users,
    Calendar,
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
    BookMarked,
    Library,
    AlertCircle,
    CheckCircle,
    Clock,
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Book {
    id: string
    isbn: string
    title: string
    author: string
    category: string
    publisher: string
    copies: number
    available: number
    status: 'available' | 'low-stock' | 'out-of-stock'
}

interface IssuedBook {
    id: string
    bookTitle: string
    borrower: string
    borrowerType: 'student' | 'teacher'
    class?: string
    issuedDate: string
    dueDate: string
    status: 'issued' | 'overdue' | 'returned'
}

const sampleBooks: Book[] = [
    { id: '1', isbn: '978-0-13-468599-1', title: 'Physics for Class 10', author: 'Dr. Ahmad Khan', category: 'Physics', publisher: 'Punjab Textbook Board', copies: 50, available: 35, status: 'available' },
    { id: '2', isbn: '978-0-13-468600-4', title: 'Mathematics for Class 10', author: 'Prof. Imran Ali', category: 'Mathematics', publisher: 'Punjab Textbook Board', copies: 60, available: 12, status: 'low-stock' },
    { id: '3', isbn: '978-0-13-468601-1', title: 'English Grammar & Composition', author: 'Wren & Martin', category: 'English', publisher: 'Oxford Press', copies: 45, available: 30, status: 'available' },
    { id: '4', isbn: '978-0-13-468602-8', title: 'Chemistry for Class 10', author: 'Dr. Sara Malik', category: 'Chemistry', publisher: 'Punjab Textbook Board', copies: 40, available: 0, status: 'out-of-stock' },
    { id: '5', isbn: '978-0-13-468603-5', title: 'Pakistan Studies', author: 'Dr. Hassan Raza', category: 'Social Studies', publisher: 'National Publishers', copies: 35, available: 28, status: 'available' },
    { id: '6', isbn: '978-0-13-468604-2', title: 'Biology for Class 9', author: 'Dr. Fatima Noor', category: 'Biology', publisher: 'Punjab Textbook Board', copies: 55, available: 8, status: 'low-stock' },
]

const sampleIssuedBooks: IssuedBook[] = [
    { id: '1', bookTitle: 'Physics for Class 10', borrower: 'Ahmed Khan', borrowerType: 'student', class: 'Class 10-A', issuedDate: '2024-01-10', dueDate: '2024-01-24', status: 'issued' },
    { id: '2', bookTitle: 'Mathematics for Class 10', borrower: 'Dr. Sana Malik', borrowerType: 'teacher', issuedDate: '2024-01-05', dueDate: '2024-02-05', status: 'issued' },
    { id: '3', bookTitle: 'English Grammar', borrower: 'Fatima Ali', borrowerType: 'student', class: 'Class 9-B', issuedDate: '2024-01-01', dueDate: '2024-01-15', status: 'overdue' },
    { id: '4', bookTitle: 'Pakistan Studies', borrower: 'Hassan Raza', borrowerType: 'student', class: 'Class 10-B', issuedDate: '2024-01-12', dueDate: '2024-01-26', status: 'issued' },
    { id: '5', bookTitle: 'Biology for Class 9', borrower: 'Mr. Ahmad Shah', borrowerType: 'teacher', issuedDate: '2024-01-08', dueDate: '2024-02-08', status: 'issued' },
]

export default function LibraryPage() {
    const [books] = useState<Book[]>(sampleBooks)
    const [issuedBooks] = useState<IssuedBook[]>(sampleIssuedBooks)
    const [searchQuery, setSearchQuery] = useState('')
    const [categoryFilter, setCategoryFilter] = useState<string>('all')
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

    const filteredBooks = books.filter((book) => {
        const matchesSearch =
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.isbn.includes(searchQuery)
        const matchesCategory = categoryFilter === 'all' || book.category === categoryFilter
        return matchesSearch && matchesCategory
    })

    const totalBooks = books.reduce((acc, b) => acc + b.copies, 0)
    const availableBooks = books.reduce((acc, b) => acc + b.available, 0)
    const issuedCount = issuedBooks.filter((b) => b.status === 'issued').length
    const overdueCount = issuedBooks.filter((b) => b.status === 'overdue').length

    const getStockBadge = (status: Book['status']) => {
        switch (status) {
            case 'available':
                return <Badge className="bg-green-500/10 text-green-500">Available</Badge>
            case 'low-stock':
                return <Badge className="bg-yellow-500/10 text-yellow-500">Low Stock</Badge>
            case 'out-of-stock':
                return <Badge className="bg-red-500/10 text-red-500">Out of Stock</Badge>
        }
    }

    const getIssueBadge = (status: IssuedBook['status']) => {
        switch (status) {
            case 'issued':
                return <Badge className="bg-blue-500/10 text-blue-500">Issued</Badge>
            case 'overdue':
                return <Badge className="bg-red-500/10 text-red-500">Overdue</Badge>
            case 'returned':
                return <Badge className="bg-green-500/10 text-green-500">Returned</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Library Management</h1>
                    <p className="text-muted-foreground">
                        Manage books, issue records, and library inventory
                    </p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gradient-primary">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Book
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Add New Book</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>ISBN</Label>
                                    <Input placeholder="978-0-XX-XXXXXX-X" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="physics">Physics</SelectItem>
                                            <SelectItem value="chemistry">Chemistry</SelectItem>
                                            <SelectItem value="mathematics">Mathematics</SelectItem>
                                            <SelectItem value="biology">Biology</SelectItem>
                                            <SelectItem value="english">English</SelectItem>
                                            <SelectItem value="urdu">Urdu</SelectItem>
                                            <SelectItem value="social-studies">Social Studies</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Book Title</Label>
                                <Input placeholder="Enter book title" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Author</Label>
                                    <Input placeholder="Author name" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Publisher</Label>
                                    <Input placeholder="Publisher name" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Total Copies</Label>
                                    <Input type="number" placeholder="0" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Publication Year</Label>
                                    <Input type="number" placeholder="2024" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button className="gradient-primary" onClick={() => setIsAddDialogOpen(false)}>
                                    Add Book
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Books</CardTitle>
                        <Library className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalBooks}</div>
                        <p className="text-xs text-muted-foreground">In library</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Available</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{availableBooks}</div>
                        <p className="text-xs text-muted-foreground">Ready to issue</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Issued</CardTitle>
                        <BookMarked className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-500">{issuedCount}</div>
                        <p className="text-xs text-muted-foreground">Currently borrowed</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
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

            <Tabs defaultValue="catalog" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="catalog">Book Catalog</TabsTrigger>
                    <TabsTrigger value="issued">Issued Books</TabsTrigger>
                </TabsList>

                {/* Book Catalog Tab */}
                <TabsContent value="catalog" className="space-y-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by title, author, or ISBN..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        <SelectItem value="Physics">Physics</SelectItem>
                                        <SelectItem value="Chemistry">Chemistry</SelectItem>
                                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                                        <SelectItem value="Biology">Biology</SelectItem>
                                        <SelectItem value="English">English</SelectItem>
                                        <SelectItem value="Social Studies">Social Studies</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="outline">
                                    <BookMarked className="mr-2 h-4 w-4" />
                                    Issue Book
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5" />
                                Book Catalog
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Book</TableHead>
                                        <TableHead>Author</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead className="text-center">Copies</TableHead>
                                        <TableHead className="text-center">Available</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredBooks.map((book) => (
                                        <TableRow key={book.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                                        <BookOpen className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{book.title}</p>
                                                        <p className="text-xs text-muted-foreground">ISBN: {book.isbn}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{book.author}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{book.category}</Badge>
                                            </TableCell>
                                            <TableCell className="text-center">{book.copies}</TableCell>
                                            <TableCell className="text-center font-medium">{book.available}</TableCell>
                                            <TableCell>{getStockBadge(book.status)}</TableCell>
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
                                                        <DropdownMenuItem>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit Book
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-500">
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
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
                </TabsContent>

                {/* Issued Books Tab */}
                <TabsContent value="issued" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookMarked className="h-5 w-5" />
                                Issued Books
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Book</TableHead>
                                        <TableHead>Borrower</TableHead>
                                        <TableHead>Issued Date</TableHead>
                                        <TableHead>Due Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {issuedBooks.map((issue) => (
                                        <TableRow key={issue.id}>
                                            <TableCell className="font-medium">{issue.bookTitle}</TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{issue.borrower}</p>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="capitalize text-xs">
                                                            {issue.borrowerType}
                                                        </Badge>
                                                        {issue.class && (
                                                            <span className="text-xs text-muted-foreground">{issue.class}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Calendar className="h-3 w-3 text-muted-foreground" />
                                                    {new Date(issue.issuedDate).toLocaleDateString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Clock className="h-3 w-3 text-muted-foreground" />
                                                    {new Date(issue.dueDate).toLocaleDateString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>{getIssueBadge(issue.status)}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="outline" size="sm">
                                                    Return Book
                                                </Button>
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
