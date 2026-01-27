'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    BookOpen,
    Users,
    Clock,
    AlertCircle,
    CheckCircle,
    Library,
    BookMarked,
    Calendar,
    Search,
    Plus,
    Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useState } from 'react'

const stats = [
    {
        title: 'Total Books',
        value: '12,450',
        description: 'In library',
        icon: BookOpen,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
    },
    {
        title: 'Available',
        value: '10,850',
        description: 'Ready to issue',
        icon: CheckCircle,
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
    },
    {
        title: 'Issued',
        value: '1,450',
        description: 'Currently borrowed',
        icon: BookMarked,
        color: 'text-purple-500',
        bgColor: 'bg-purple-500/10',
    },
    {
        title: 'Overdue',
        value: '48',
        description: 'Need follow-up',
        icon: AlertCircle,
        color: 'text-red-500',
        bgColor: 'bg-red-500/10',
    },
]

const recentIssues = [
    { id: '1', book: 'Physics for Class 10', borrower: 'Ahmed Khan', class: 'Class 10-A', issuedDate: '2024-01-15', dueDate: '2024-01-29', status: 'issued' },
    { id: '2', book: 'Mathematics Grade 9', borrower: 'Sara Ali', class: 'Class 9-B', issuedDate: '2024-01-14', dueDate: '2024-01-28', status: 'issued' },
    { id: '3', book: 'English Grammar', borrower: 'Hassan Raza', class: 'Class 8-A', issuedDate: '2024-01-10', dueDate: '2024-01-24', status: 'overdue' },
    { id: '4', book: 'Chemistry Lab Manual', borrower: 'Dr. Sana Malik', class: 'Teacher', issuedDate: '2024-01-08', dueDate: '2024-02-08', status: 'issued' },
    { id: '5', book: 'Pakistan Studies', borrower: 'Fatima Ali', class: 'Class 10-B', issuedDate: '2024-01-05', dueDate: '2024-01-19', status: 'overdue' },
]

const recentReturns = [
    { book: 'Biology for Class 9', borrower: 'Usman Tariq', returnDate: '2024-01-18', condition: 'Good' },
    { book: 'Urdu Literature', borrower: 'Ayesha Malik', returnDate: '2024-01-17', condition: 'Good' },
    { book: 'Computer Science', borrower: 'Ali Hassan', returnDate: '2024-01-16', condition: 'Fair' },
]

export default function LibrarianDashboard() {
    const [isSendingReminders, setIsSendingReminders] = useState(false)

    const handleSendReminders = () => {
        setIsSendingReminders(true)
        setTimeout(() => {
            setIsSendingReminders(false)
            toast.success('Reminders sent to 48 borrowers with overdue books')
        }, 1500)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Librarian Dashboard</h1>
                    <p className="text-muted-foreground">
                        Library overview and book management
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" asChild>
                        <Link href="/school/librarian/catalog">
                            <Search className="mr-2 h-4 w-4" />
                            Search Books
                        </Link>
                    </Button>
                    <Button className="gradient-primary" asChild>
                        <Link href="/school/librarian/issue">
                            <BookMarked className="mr-2 h-4 w-4" />
                            Issue Book
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card key={index} className="card-hover">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.bgColor}`}>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">{stat.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Overdue Alert */}
            <Card className="border-red-500/50 bg-red-500/5">
                <CardContent className="py-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                            <AlertCircle className="h-6 w-6 text-red-500" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-red-500">48 Books Overdue</p>
                            <p className="text-sm text-muted-foreground">
                                Send reminders to borrowers with overdue books
                            </p>
                        </div>
                        <Button variant="outline" onClick={handleSendReminders} disabled={isSendingReminders}>
                            {isSendingReminders ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {isSendingReminders ? 'Sending...' : 'Send Reminders'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Recent Issues */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <BookMarked className="h-5 w-5" />
                                    Recent Issues
                                </CardTitle>
                                <CardDescription>Books issued recently</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/school/librarian/issued">View All</Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentIssues.map((issue) => (
                                <div key={issue.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${issue.status === 'overdue' ? 'bg-red-500/10' : 'bg-blue-500/10'
                                            }`}>
                                            <BookOpen className={`h-5 w-5 ${issue.status === 'overdue' ? 'text-red-500' : 'text-blue-500'
                                                }`} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{issue.book}</p>
                                            <p className="text-xs text-muted-foreground">{issue.borrower} • {issue.class}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground">Due: {issue.dueDate}</p>
                                        {issue.status === 'overdue' ? (
                                            <Badge className="bg-red-500/10 text-red-500">Overdue</Badge>
                                        ) : (
                                            <Badge className="bg-blue-500/10 text-blue-500">Issued</Badge>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Returns */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Library className="h-5 w-5" />
                                    Recent Returns
                                </CardTitle>
                                <CardDescription>Books returned recently</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentReturns.map((ret, index) => (
                                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{ret.book}</p>
                                            <p className="text-xs text-muted-foreground">{ret.borrower}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground">{ret.returnDate}</p>
                                        <Badge variant="outline">{ret.condition}</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-4">
                <Link href="/school/librarian/issue">
                    <Card className="card-hover cursor-pointer">
                        <CardContent className="pt-6 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 mx-auto mb-3">
                                <BookMarked className="h-6 w-6 text-blue-500" />
                            </div>
                            <p className="font-medium">Issue Book</p>
                            <p className="text-xs text-muted-foreground">Issue to student/teacher</p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/school/librarian/return">
                    <Card className="card-hover cursor-pointer">
                        <CardContent className="pt-6 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 mx-auto mb-3">
                                <Library className="h-6 w-6 text-green-500" />
                            </div>
                            <p className="font-medium">Return Book</p>
                            <p className="text-xs text-muted-foreground">Process returns</p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/school/librarian/catalog">
                    <Card className="card-hover cursor-pointer">
                        <CardContent className="pt-6 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10 mx-auto mb-3">
                                <Search className="h-6 w-6 text-purple-500" />
                            </div>
                            <p className="font-medium">Catalog</p>
                            <p className="text-xs text-muted-foreground">Browse all books</p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/school/librarian/add">
                    <Card className="card-hover cursor-pointer">
                        <CardContent className="pt-6 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10 mx-auto mb-3">
                                <Plus className="h-6 w-6 text-orange-500" />
                            </div>
                            <p className="font-medium">Add Book</p>
                            <p className="text-xs text-muted-foreground">Add new book</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    )
}
