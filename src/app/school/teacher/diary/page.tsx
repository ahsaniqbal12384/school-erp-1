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
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    BookOpen,
    Plus,
    Search,
    Calendar,
    Clock,
    FileText,
    Users,
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
    CheckCircle,
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface DiaryEntry {
    id: string
    date: string
    class: string
    section: string
    subject: string
    topic: string
    description: string
    homework: string
    status: 'published' | 'draft'
}

const sampleDiary: DiaryEntry[] = [
    {
        id: '1',
        date: '2024-01-20',
        class: 'Class 10',
        section: 'A',
        subject: 'Mathematics',
        topic: 'Quadratic Equations',
        description: 'Introduction to quadratic equations and their standard form. Discussed factorization method.',
        homework: 'Exercise 4.1, Questions 1-10',
        status: 'published',
    },
    {
        id: '2',
        date: '2024-01-20',
        class: 'Class 10',
        section: 'B',
        subject: 'Mathematics',
        topic: 'Quadratic Equations',
        description: 'Solving quadratic equations using quadratic formula.',
        homework: 'Exercise 4.2, Questions 1-8',
        status: 'published',
    },
    {
        id: '3',
        date: '2024-01-19',
        class: 'Class 9',
        section: 'A',
        subject: 'Mathematics',
        topic: 'Linear Equations',
        description: 'Graphical representation of linear equations in two variables.',
        homework: 'Draw graphs for Exercise 3.3',
        status: 'published',
    },
    {
        id: '4',
        date: '2024-01-19',
        class: 'Class 9',
        section: 'B',
        subject: 'Mathematics',
        topic: 'Linear Equations',
        description: 'Word problems on linear equations.',
        homework: 'Exercise 3.4, Questions 5-15',
        status: 'draft',
    },
]

export default function TeacherDiaryPage() {
    const [entries] = useState<DiaryEntry[]>(sampleDiary)
    const [searchQuery, setSearchQuery] = useState('')
    const [classFilter, setClassFilter] = useState<string>('all')
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

    const filteredEntries = entries.filter((entry) => {
        const matchesSearch =
            entry.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesClass = classFilter === 'all' || `${entry.class}-${entry.section}` === classFilter
        return matchesSearch && matchesClass
    })

    const todayEntries = entries.filter(
        (e) => e.date === new Date().toISOString().split('T')[0]
    ).length
    const publishedEntries = entries.filter((e) => e.status === 'published').length

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Class Diary</h1>
                    <p className="text-muted-foreground">
                        Record daily lessons and homework assignments
                    </p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gradient-primary">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Entry
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>New Diary Entry</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Date</Label>
                                    <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Class</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select class" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="10-A">Class 10-A</SelectItem>
                                            <SelectItem value="10-B">Class 10-B</SelectItem>
                                            <SelectItem value="9-A">Class 9-A</SelectItem>
                                            <SelectItem value="9-B">Class 9-B</SelectItem>
                                            <SelectItem value="8-A">Class 8-A</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Subject</Label>
                                    <Input defaultValue="Mathematics" readOnly />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Topic Covered</Label>
                                <Input placeholder="Enter today's topic" />
                            </div>
                            <div className="space-y-2">
                                <Label>Lesson Description</Label>
                                <Textarea
                                    placeholder="Describe what was taught in today's class..."
                                    rows={3}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Homework Assigned</Label>
                                <Textarea
                                    placeholder="Enter homework details..."
                                    rows={2}
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                    Save as Draft
                                </Button>
                                <Button className="gradient-primary" onClick={() => setIsAddDialogOpen(false)}>
                                    Publish Entry
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
                        <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{entries.length}</div>
                        <p className="text-xs text-muted-foreground">This semester</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Today&apos;s Entries</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{todayEntries}</div>
                        <p className="text-xs text-muted-foreground">Added today</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Published</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{publishedEntries}</div>
                        <p className="text-xs text-muted-foreground">Visible to parents</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Classes</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5</div>
                        <p className="text-xs text-muted-foreground">Active classes</p>
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
                                placeholder="Search by topic or description..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={classFilter} onValueChange={setClassFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by class" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Classes</SelectItem>
                                <SelectItem value="Class 10-A">Class 10-A</SelectItem>
                                <SelectItem value="Class 10-B">Class 10-B</SelectItem>
                                <SelectItem value="Class 9-A">Class 9-A</SelectItem>
                                <SelectItem value="Class 9-B">Class 9-B</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Diary Entries Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Diary Entries</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Topic</TableHead>
                                <TableHead>Homework</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredEntries.map((entry) => (
                                <TableRow key={entry.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span>{new Date(entry.date).toLocaleDateString()}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {entry.class} - {entry.section}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{entry.topic}</p>
                                            <p className="text-sm text-muted-foreground line-clamp-1">
                                                {entry.description}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[200px]">
                                        <p className="text-sm line-clamp-2">{entry.homework}</p>
                                    </TableCell>
                                    <TableCell>
                                        {entry.status === 'published' ? (
                                            <Badge className="bg-green-500/10 text-green-500">Published</Badge>
                                        ) : (
                                            <Badge variant="outline">Draft</Badge>
                                        )}
                                    </TableCell>
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
                                                    Edit Entry
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
        </div>
    )
}
