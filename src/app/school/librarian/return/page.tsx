'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Library,
    Search,
    BookOpen,
    Calendar,
    CheckCircle,
    AlertCircle,
    DollarSign,
} from 'lucide-react'

interface IssuedBook {
    id: string
    issueId: string
    bookTitle: string
    isbn: string
    borrowerName: string
    borrowerType: 'student' | 'teacher'
    borrowerId: string
    issueDate: string
    dueDate: string
    status: 'on-time' | 'overdue'
    daysOverdue?: number
    fine?: number
}

const issuedBooks: IssuedBook[] = [
    { id: '1', issueId: 'ISS-001', bookTitle: 'Physics for Class 10', isbn: '978-0-134-68599-1', borrowerName: 'Ahmed Khan', borrowerType: 'student', borrowerId: '1001', issueDate: '2024-01-15', dueDate: '2024-01-29', status: 'on-time' },
    { id: '2', issueId: 'ISS-002', bookTitle: 'English Grammar', isbn: '978-0-134-68601-1', borrowerName: 'Hassan Raza', borrowerType: 'student', borrowerId: '1003', issueDate: '2024-01-10', dueDate: '2024-01-24', status: 'overdue', daysOverdue: 5, fine: 50 },
    { id: '3', issueId: 'ISS-003', bookTitle: 'Pakistan Studies', isbn: '978-0-134-68603-5', borrowerName: 'Fatima Ali', borrowerType: 'student', borrowerId: '1005', issueDate: '2024-01-05', dueDate: '2024-01-19', status: 'overdue', daysOverdue: 10, fine: 100 },
]

export default function ReturnBookPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedBook, setSelectedBook] = useState<IssuedBook | null>(null)
    const [bookCondition, setBookCondition] = useState<string>('good')
    const [returnSuccess, setReturnSuccess] = useState(false)

    const filteredBooks = issuedBooks.filter((book) =>
        book.issueId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.borrowerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.borrowerId.includes(searchQuery)
    )

    const handleReturn = () => {
        if (selectedBook) {
            setReturnSuccess(true)
            setTimeout(() => {
                setReturnSuccess(false)
                setSelectedBook(null)
                setSearchQuery('')
            }, 3000)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Return Book</h1>
                <p className="text-muted-foreground">
                    Process book returns and calculate fines
                </p>
            </div>

            {returnSuccess && (
                <Card className="border-green-500/50 bg-green-500/5">
                    <CardContent className="py-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                                <CheckCircle className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <p className="font-medium text-green-500">Book Returned Successfully!</p>
                                <p className="text-sm text-muted-foreground">The book has been returned to the library.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-6 md:grid-cols-2">
                {/* Search Issued Books */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="h-5 w-5" />
                            Find Issued Book
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by issue ID, book title, or borrower..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        <div className="space-y-2">
                            {filteredBooks.map((book) => (
                                <div
                                    key={book.id}
                                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedBook?.id === book.id
                                            ? 'border-primary bg-primary/5'
                                            : 'hover:border-primary/50'
                                        }`}
                                    onClick={() => setSelectedBook(book)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${book.status === 'overdue' ? 'bg-red-500/10' : 'bg-green-500/10'
                                                }`}>
                                                <BookOpen className={`h-4 w-4 ${book.status === 'overdue' ? 'text-red-500' : 'text-green-500'
                                                    }`} />
                                            </div>
                                            <div>
                                                <p className="font-medium">{book.bookTitle}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {book.borrowerName} • {book.borrowerId}
                                                </p>
                                            </div>
                                        </div>
                                        {book.status === 'overdue' ? (
                                            <Badge className="bg-red-500/10 text-red-500">
                                                {book.daysOverdue} days overdue
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-green-500/10 text-green-500">On Time</Badge>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Return Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Library className="h-5 w-5" />
                            Return Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {selectedBook ? (
                            <>
                                <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Book</span>
                                        <span className="font-medium">{selectedBook.bookTitle}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">ISBN</span>
                                        <span className="font-mono text-sm">{selectedBook.isbn}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Borrower</span>
                                        <span>{selectedBook.borrowerName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Issue Date</span>
                                        <span>{new Date(selectedBook.issueDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Due Date</span>
                                        <span className={selectedBook.status === 'overdue' ? 'text-red-500' : ''}>
                                            {new Date(selectedBook.dueDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                {selectedBook.status === 'overdue' && (
                                    <Card className="border-red-500/50 bg-red-500/5">
                                        <CardContent className="py-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <AlertCircle className="h-4 w-4 text-red-500" />
                                                    <span className="text-sm font-medium text-red-500">
                                                        Overdue by {selectedBook.daysOverdue} days
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 text-red-500 font-medium">
                                                    <DollarSign className="h-4 w-4" />
                                                    Fine: Rs. {selectedBook.fine}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                <div className="space-y-2">
                                    <Label>Book Condition</Label>
                                    <Select value={bookCondition} onValueChange={setBookCondition}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select condition" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="excellent">Excellent</SelectItem>
                                            <SelectItem value="good">Good</SelectItem>
                                            <SelectItem value="fair">Fair</SelectItem>
                                            <SelectItem value="damaged">Damaged</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Remarks</Label>
                                    <Input placeholder="Any additional notes" />
                                </div>

                                <Button className="w-full gradient-primary" onClick={handleReturn}>
                                    <Library className="mr-2 h-4 w-4" />
                                    Process Return
                                </Button>
                            </>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <p>Select an issued book to process return</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
