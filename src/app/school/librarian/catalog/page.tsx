'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
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
import {
    BookOpen,
    Search,
    Plus,
    BookMarked,
    Eye,
    Edit,
    MoreHorizontal,
    Loader2,
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

interface Book {
    id: string
    isbn: string
    title: string
    author: string
    category: string
    publisher: string
    quantity: number
    available: number
    shelf: string
    status: 'available' | 'low-stock' | 'out-of-stock'
}

const sampleBooks: Book[] = [
    { id: '1', isbn: '978-0-134-68599-1', title: 'Physics for Class 10', author: 'Dr. Shah Nawaz', category: 'Science', publisher: 'Punjab Textbook Board', quantity: 50, available: 42, shelf: 'A-101', status: 'available' },
    { id: '2', isbn: '978-0-134-68600-4', title: 'Mathematics Grade 10', author: 'Prof. Ahmad Ali', category: 'Mathematics', publisher: 'Punjab Textbook Board', quantity: 45, available: 38, shelf: 'A-102', status: 'available' },
    { id: '3', isbn: '978-0-134-68601-1', title: 'English Grammar & Composition', author: 'Wren & Martin', category: 'English', publisher: 'Oxford Press', quantity: 60, available: 55, shelf: 'B-201', status: 'available' },
    { id: '4', isbn: '978-0-134-68602-8', title: 'Chemistry for Class 9', author: 'Dr. Saleem Raza', category: 'Science', publisher: 'Punjab Textbook Board', quantity: 40, available: 5, shelf: 'A-103', status: 'low-stock' },
    { id: '5', isbn: '978-0-134-68603-5', title: 'Pakistan Studies', author: 'Dr. Hassan Ali', category: 'Social Studies', publisher: 'Federal Board', quantity: 35, available: 30, shelf: 'C-301', status: 'available' },
    { id: '6', isbn: '978-0-134-68604-2', title: 'Biology for Class 10', author: 'Dr. Fatima Awan', category: 'Science', publisher: 'Punjab Textbook Board', quantity: 30, available: 0, shelf: 'A-104', status: 'out-of-stock' },
    { id: '7', isbn: '978-0-134-68605-9', title: 'Urdu Literature', author: 'Syed Abbas Zaidi', category: 'Urdu', publisher: 'Punjab Textbook Board', quantity: 40, available: 35, shelf: 'B-202', status: 'available' },
    { id: '8', isbn: '978-0-134-68606-6', title: 'Computer Science Grade 9', author: 'Prof. Usman Khan', category: 'Computer', publisher: 'IT Board', quantity: 25, available: 22, shelf: 'D-401', status: 'available' },
]

const emptyFormData = {
    isbn: '',
    title: '',
    author: '',
    category: '',
    publisher: '',
    quantity: '',
    shelf: '',
}

export default function LibraryCatalogPage() {
    const [books, setBooks] = useState<Book[]>(sampleBooks)
    const [searchQuery, setSearchQuery] = useState('')
    const [categoryFilter, setCategoryFilter] = useState<string>('all')
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [isIssueDialogOpen, setIsIssueDialogOpen] = useState(false)
    const [selectedBook, setSelectedBook] = useState<Book | null>(null)
    const [formData, setFormData] = useState(emptyFormData)
    const [isLoading, setIsLoading] = useState(false)
    const [issueStudentId, setIssueStudentId] = useState('')

    const filteredBooks = books.filter((book) => {
        const matchesSearch =
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.isbn.includes(searchQuery)
        const matchesCategory = categoryFilter === 'all' || book.category === categoryFilter
        return matchesSearch && matchesCategory
    })

    const totalBooks = books.reduce((acc, b) => acc + b.quantity, 0)
    const availableBooks = books.reduce((acc, b) => acc + b.available, 0)

    const getStatusBadge = (status: Book['status']) => {
        switch (status) {
            case 'available':
                return <Badge className="bg-green-500/10 text-green-500">Available</Badge>
            case 'low-stock':
                return <Badge className="bg-yellow-500/10 text-yellow-500">Low Stock</Badge>
            case 'out-of-stock':
                return <Badge className="bg-red-500/10 text-red-500">Out of Stock</Badge>
        }
    }

    const calculateStatus = (available: number, quantity: number): Book['status'] => {
        if (available === 0) return 'out-of-stock'
        if (available <= quantity * 0.2) return 'low-stock'
        return 'available'
    }

    const handleAddBook = async () => {
        if (!formData.isbn || !formData.title || !formData.author || !formData.category || !formData.quantity) {
            toast.error('Please fill in all required fields')
            return
        }

        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))

            const quantity = parseInt(formData.quantity)
            const newBook: Book = {
                id: String(books.length + 1),
                isbn: formData.isbn,
                title: formData.title,
                author: formData.author,
                category: formData.category,
                publisher: formData.publisher,
                quantity: quantity,
                available: quantity,
                shelf: formData.shelf,
                status: 'available',
            }

            setBooks([newBook, ...books])
            setFormData(emptyFormData)
            setIsAddDialogOpen(false)
            toast.success('Book added successfully', {
                description: `"${newBook.title}" has been added to the catalog`
            })
        } catch {
            toast.error('Failed to add book')
        } finally {
            setIsLoading(false)
        }
    }

    const handleEditBook = async () => {
        if (!selectedBook || !formData.title || !formData.author) {
            toast.error('Please fill in all required fields')
            return
        }

        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))

            const quantity = parseInt(formData.quantity) || selectedBook.quantity

            setBooks(books.map(book =>
                book.id === selectedBook.id
                    ? {
                        ...book,
                        isbn: formData.isbn || book.isbn,
                        title: formData.title,
                        author: formData.author,
                        category: formData.category || book.category,
                        publisher: formData.publisher,
                        quantity: quantity,
                        shelf: formData.shelf || book.shelf,
                    }
                    : book
            ))
            setIsEditDialogOpen(false)
            setSelectedBook(null)
            toast.success('Book updated successfully')
        } catch {
            toast.error('Failed to update book')
        } finally {
            setIsLoading(false)
        }
    }

    const handleIssueBook = async () => {
        if (!selectedBook || !issueStudentId) {
            toast.error('Please enter student ID')
            return
        }

        if (selectedBook.available === 0) {
            toast.error('This book is not available')
            return
        }

        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))

            setBooks(books.map(book =>
                book.id === selectedBook.id
                    ? {
                        ...book,
                        available: book.available - 1,
                        status: calculateStatus(book.available - 1, book.quantity),
                    }
                    : book
            ))

            setIsIssueDialogOpen(false)
            setSelectedBook(null)
            setIssueStudentId('')
            toast.success('Book issued successfully', {
                description: `"${selectedBook.title}" issued to Student ID: ${issueStudentId}`
            })
        } catch {
            toast.error('Failed to issue book')
        } finally {
            setIsLoading(false)
        }
    }

    const openEditDialog = (book: Book) => {
        setSelectedBook(book)
        setFormData({
            isbn: book.isbn,
            title: book.title,
            author: book.author,
            category: book.category,
            publisher: book.publisher,
            quantity: String(book.quantity),
            shelf: book.shelf,
        })
        setIsEditDialogOpen(true)
    }

    const openViewDialog = (book: Book) => {
        setSelectedBook(book)
        setIsViewDialogOpen(true)
    }

    const openIssueDialog = (book: Book) => {
        setSelectedBook(book)
        setIssueStudentId('')
        setIsIssueDialogOpen(true)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Book Catalog</h1>
                    <p className="text-muted-foreground">
                        Browse and manage library books
                    </p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gradient-primary">
                            <Plus className="mr-2 h-4 w-4" />
                            Add New Book
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Add New Book</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label>ISBN *</Label>
                                <Input
                                    placeholder="978-0-134-68599-1"
                                    value={formData.isbn}
                                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Title *</Label>
                                <Input
                                    placeholder="Book title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Author *</Label>
                                <Input
                                    placeholder="Author name"
                                    value={formData.author}
                                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Category *</Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Science">Science</SelectItem>
                                            <SelectItem value="Mathematics">Mathematics</SelectItem>
                                            <SelectItem value="English">English</SelectItem>
                                            <SelectItem value="Urdu">Urdu</SelectItem>
                                            <SelectItem value="Social Studies">Social Studies</SelectItem>
                                            <SelectItem value="Computer">Computer</SelectItem>
                                            <SelectItem value="Islamic Studies">Islamic Studies</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Quantity *</Label>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Publisher</Label>
                                    <Input
                                        placeholder="Publisher name"
                                        value={formData.publisher}
                                        onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Shelf Location</Label>
                                    <Input
                                        placeholder="A-101"
                                        value={formData.shelf}
                                        onChange={(e) => setFormData({ ...formData, shelf: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="outline" onClick={() => {
                                    setIsAddDialogOpen(false)
                                    setFormData(emptyFormData)
                                }}>
                                    Cancel
                                </Button>
                                <Button className="gradient-primary" onClick={handleAddBook} disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Adding...
                                        </>
                                    ) : (
                                        'Add Book'
                                    )}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Books</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalBooks}</div>
                        <p className="text-xs text-muted-foreground">In library</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Available</CardTitle>
                        <BookMarked className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{availableBooks}</div>
                        <p className="text-xs text-muted-foreground">Ready to issue</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Unique Titles</CardTitle>
                        <BookOpen className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-500">{books.length}</div>
                        <p className="text-xs text-muted-foreground">Different books</p>
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
                                <SelectItem value="Science">Science</SelectItem>
                                <SelectItem value="Mathematics">Mathematics</SelectItem>
                                <SelectItem value="English">English</SelectItem>
                                <SelectItem value="Urdu">Urdu</SelectItem>
                                <SelectItem value="Social Studies">Social Studies</SelectItem>
                                <SelectItem value="Computer">Computer</SelectItem>
                                <SelectItem value="Islamic Studies">Islamic Studies</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Books Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        All Books
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ISBN</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-center">Qty</TableHead>
                                <TableHead className="text-center">Available</TableHead>
                                <TableHead>Shelf</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredBooks.map((book) => (
                                <TableRow key={book.id}>
                                    <TableCell className="font-mono text-xs">{book.isbn}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                                <BookOpen className="h-4 w-4 text-primary" />
                                            </div>
                                            <span className="font-medium">{book.title}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{book.author}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{book.category}</Badge>
                                    </TableCell>
                                    <TableCell className="text-center">{book.quantity}</TableCell>
                                    <TableCell className="text-center font-medium">{book.available}</TableCell>
                                    <TableCell>{book.shelf}</TableCell>
                                    <TableCell>{getStatusBadge(book.status)}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => openViewDialog(book)}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => openEditDialog(book)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => openIssueDialog(book)}
                                                    disabled={book.available === 0}
                                                >
                                                    <BookMarked className="mr-2 h-4 w-4" />
                                                    Issue
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

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Book</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label>ISBN</Label>
                            <Input
                                value={formData.isbn}
                                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Title *</Label>
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Author *</Label>
                            <Input
                                value={formData.author}
                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Science">Science</SelectItem>
                                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                                        <SelectItem value="English">English</SelectItem>
                                        <SelectItem value="Urdu">Urdu</SelectItem>
                                        <SelectItem value="Social Studies">Social Studies</SelectItem>
                                        <SelectItem value="Computer">Computer</SelectItem>
                                        <SelectItem value="Islamic Studies">Islamic Studies</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Quantity</Label>
                                <Input
                                    type="number"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Publisher</Label>
                                <Input
                                    value={formData.publisher}
                                    onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Shelf</Label>
                                <Input
                                    value={formData.shelf}
                                    onChange={(e) => setFormData({ ...formData, shelf: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button className="gradient-primary" onClick={handleEditBook} disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* View Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Book Details</DialogTitle>
                    </DialogHeader>
                    {selectedBook && (
                        <div className="space-y-4 py-4">
                            <div className="flex items-center gap-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
                                    <BookOpen className="h-8 w-8 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{selectedBook.title}</h3>
                                    <p className="text-muted-foreground">{selectedBook.author}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">ISBN</p>
                                    <p className="font-mono">{selectedBook.isbn}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Category</p>
                                    <Badge variant="outline">{selectedBook.category}</Badge>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Publisher</p>
                                    <p>{selectedBook.publisher}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Shelf Location</p>
                                    <p>{selectedBook.shelf}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Copies</p>
                                    <p className="font-medium">{selectedBook.quantity}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Available</p>
                                    <p className="font-medium text-green-500">{selectedBook.available}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Status</p>
                                {getStatusBadge(selectedBook.status)}
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                                    Close
                                </Button>
                                <Button
                                    onClick={() => {
                                        setIsViewDialogOpen(false)
                                        openIssueDialog(selectedBook)
                                    }}
                                    disabled={selectedBook.available === 0}
                                >
                                    <BookMarked className="mr-2 h-4 w-4" />
                                    Issue Book
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Issue Dialog */}
            <Dialog open={isIssueDialogOpen} onOpenChange={setIsIssueDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Issue Book</DialogTitle>
                    </DialogHeader>
                    {selectedBook && (
                        <div className="space-y-4 py-4">
                            <div className="p-4 bg-muted rounded-lg">
                                <p className="font-medium">{selectedBook.title}</p>
                                <p className="text-sm text-muted-foreground">by {selectedBook.author}</p>
                                <p className="text-sm text-green-500 mt-1">{selectedBook.available} copies available</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Student ID *</Label>
                                <Input
                                    placeholder="Enter student ID"
                                    value={issueStudentId}
                                    onChange={(e) => setIssueStudentId(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="outline" onClick={() => {
                                    setIsIssueDialogOpen(false)
                                    setIssueStudentId('')
                                }}>
                                    Cancel
                                </Button>
                                <Button className="gradient-primary" onClick={handleIssueBook} disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Issuing...
                                        </>
                                    ) : (
                                        'Issue Book'
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
