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
    BookMarked,
    Search,
    User,
    BookOpen,
    Calendar,
    CheckCircle,
    GraduationCap,
} from 'lucide-react'

interface SearchResult {
    id: string
    type: 'student' | 'teacher'
    name: string
    rollNo?: string
    empId?: string
    class?: string
    department?: string
    booksIssued: number
    maxBooks: number
}

const searchResults: SearchResult[] = [
    { id: '1', type: 'student', name: 'Ahmed Khan', rollNo: '1001', class: 'Class 10-A', booksIssued: 1, maxBooks: 3 },
    { id: '2', type: 'student', name: 'Sara Ali', rollNo: '1002', class: 'Class 10-A', booksIssued: 2, maxBooks: 3 },
    { id: '3', type: 'teacher', name: 'Mr. Imran Ali', empId: 'EMP001', department: 'Mathematics', booksIssued: 3, maxBooks: 5 },
]

const availableBooks = [
    { id: '1', title: 'Physics for Class 10', author: 'Dr. Shah Nawaz', isbn: '978-0-134-68599-1', available: 42 },
    { id: '2', title: 'Mathematics Grade 10', author: 'Prof. Ahmad Ali', isbn: '978-0-134-68600-4', available: 38 },
    { id: '3', title: 'English Grammar', author: 'Wren & Martin', isbn: '978-0-134-68601-1', available: 55 },
    { id: '4', title: 'Chemistry for Class 9', author: 'Dr. Saleem Raza', isbn: '978-0-134-68602-8', available: 5 },
]

export default function IssueBookPage() {
    const [memberSearch, setMemberSearch] = useState('')
    const [bookSearch, setBookSearch] = useState('')
    const [selectedMember, setSelectedMember] = useState<SearchResult | null>(null)
    const [selectedBook, setSelectedBook] = useState<typeof availableBooks[0] | null>(null)
    const [issueSuccess, setIssueSuccess] = useState(false)
    const [dueDate] = useState(() => {
        const date = new Date()
        date.setDate(date.getDate() + 14)
        return date.toLocaleDateString()
    })
    const [dueDateISO] = useState(() => {
        const date = new Date()
        date.setDate(date.getDate() + 14)
        return date.toISOString().split('T')[0]
    })

    const handleIssue = () => {
        if (selectedMember && selectedBook) {
            setIssueSuccess(true)
            setTimeout(() => {
                setIssueSuccess(false)
                setSelectedMember(null)
                setSelectedBook(null)
                setMemberSearch('')
                setBookSearch('')
            }, 3000)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Issue Book</h1>
                <p className="text-muted-foreground">
                    Issue a book to student or staff member
                </p>
            </div>

            {issueSuccess && (
                <Card className="border-green-500/50 bg-green-500/5">
                    <CardContent className="py-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                                <CheckCircle className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <p className="font-medium text-green-500">Book Issued Successfully!</p>
                                <p className="text-sm text-muted-foreground">
                                    Due date: {dueDate}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-6 md:grid-cols-2">
                {/* Select Member */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Select Member
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, roll no, or employee ID..."
                                value={memberSearch}
                                onChange={(e) => setMemberSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        {memberSearch && (
                            <div className="space-y-2">
                                {searchResults
                                    .filter((m) =>
                                        m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
                                        m.rollNo?.includes(memberSearch) ||
                                        m.empId?.includes(memberSearch)
                                    )
                                    .map((member) => (
                                        <div
                                            key={member.id}
                                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedMember?.id === member.id
                                                    ? 'border-primary bg-primary/5'
                                                    : 'hover:border-primary/50'
                                                }`}
                                            onClick={() => setSelectedMember(member)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${member.type === 'student' ? 'bg-blue-500/10' : 'bg-purple-500/10'
                                                        }`}>
                                                        {member.type === 'student' ? (
                                                            <GraduationCap className="h-4 w-4 text-blue-500" />
                                                        ) : (
                                                            <User className="h-4 w-4 text-purple-500" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{member.name}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {member.type === 'student'
                                                                ? `${member.rollNo} • ${member.class}`
                                                                : `${member.empId} • ${member.department}`}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge variant="outline">
                                                    {member.booksIssued}/{member.maxBooks} books
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}

                        {selectedMember && (
                            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                                <p className="text-sm font-medium">Selected: {selectedMember.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    Can issue {selectedMember.maxBooks - selectedMember.booksIssued} more book(s)
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Select Book */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5" />
                            Select Book
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by title, author, or ISBN..."
                                value={bookSearch}
                                onChange={(e) => setBookSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        {bookSearch && (
                            <div className="space-y-2">
                                {availableBooks
                                    .filter((b) =>
                                        b.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
                                        b.author.toLowerCase().includes(bookSearch.toLowerCase()) ||
                                        b.isbn.includes(bookSearch)
                                    )
                                    .map((book) => (
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
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
                                                        <BookOpen className="h-4 w-4 text-green-500" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{book.title}</p>
                                                        <p className="text-xs text-muted-foreground">{book.author}</p>
                                                    </div>
                                                </div>
                                                <Badge className={book.available > 10 ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}>
                                                    {book.available} available
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}

                        {selectedBook && (
                            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                                <p className="text-sm font-medium">Selected: {selectedBook.title}</p>
                                <p className="text-xs text-muted-foreground">ISBN: {selectedBook.isbn}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Issue Details */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookMarked className="h-5 w-5" />
                        Issue Details
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label>Issue Date</Label>
                            <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                        </div>
                        <div className="space-y-2">
                            <Label>Due Date</Label>
                            <Input
                                type="date"
                                defaultValue={dueDateISO}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Remarks</Label>
                            <Input placeholder="Optional remarks" />
                        </div>
                    </div>
                    <div className="flex justify-end mt-6">
                        <Button
                            className="gradient-primary"
                            disabled={!selectedMember || !selectedBook}
                            onClick={handleIssue}
                        >
                            <BookMarked className="mr-2 h-4 w-4" />
                            Issue Book
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
