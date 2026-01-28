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
    BookOpen,
    Search,
    Plus,
    BookMarked,
    Eye,
    Edit,
    MoreHorizontal,
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
    { id: '9', isbn: '978-0-134-68607-3', title: 'Islamiyat for Class 10', author: 'Dr. Ahmad Raza', category: 'Islamic Studies', publisher: 'Federal Board', quantity: 50, available: 48, shelf: 'C-302', status: 'available' },
    { id: '10', isbn: '978-0-134-68608-0', title: 'General Science Grade 8', author: 'Prof. Khan Ahmad', category: 'Science', publisher: 'Punjab Textbook Board', quantity: 45, available: 3, shelf: 'A-105', status: 'low-stock' },
]

export default function LibraryCatalogPage() {
    const [books] = useState<Book[]>(sampleBooks)
    const [searchQuery, setSearchQuery] = useState('')
    const [categoryFilter, setCategoryFilter] = useState<string>('all')

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

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Book Catalog</h1>
                    <p className="text-muted-foreground">
                        Browse and manage library books
                    </p>
                </div>
                <Button className="gradient-primary">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Book
                </Button>
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
                                <TableHead className="text-center">Quantity</TableHead>
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
                                                <DropdownMenuItem>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
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
        </div>
    )
}
