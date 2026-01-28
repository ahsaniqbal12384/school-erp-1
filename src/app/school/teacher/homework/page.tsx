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
    CheckCircle,
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface HomeworkAssignment {
    id: string
    class: string
    section: string
    subject: string
    title: string
    description: string
    assignedDate: string
    dueDate: string
    submissions: number
    totalStudents: number
    status: 'active' | 'closed'
}

const sampleHomework: HomeworkAssignment[] = [
    {
        id: '1',
        class: 'Class 10',
        section: 'A',
        subject: 'Mathematics',
        title: 'Quadratic Equations Practice',
        description: 'Complete Exercise 4.1, Questions 1-15. Show all working.',
        assignedDate: '2024-01-18',
        dueDate: '2024-01-22',
        submissions: 28,
        totalStudents: 35,
        status: 'active',
    },
    {
        id: '2',
        class: 'Class 10',
        section: 'B',
        subject: 'Mathematics',
        title: 'Quadratic Formula Problems',
        description: 'Solve using quadratic formula - Exercise 4.2',
        assignedDate: '2024-01-18',
        dueDate: '2024-01-23',
        submissions: 20,
        totalStudents: 32,
        status: 'active',
    },
    {
        id: '3',
        class: 'Class 9',
        section: 'A',
        subject: 'Mathematics',
        title: 'Linear Equations Graphs',
        description: 'Draw graphs for given linear equations.',
        assignedDate: '2024-01-15',
        dueDate: '2024-01-18',
        submissions: 38,
        totalStudents: 38,
        status: 'closed',
    },
    {
        id: '4',
        class: 'Class 9',
        section: 'B',
        subject: 'Mathematics',
        title: 'Word Problems',
        description: 'Exercise 3.4, Questions 5-15',
        assignedDate: '2024-01-16',
        dueDate: '2024-01-20',
        submissions: 30,
        totalStudents: 36,
        status: 'active',
    },
]

export default function TeacherHomeworkPage() {
    const [homework] = useState<HomeworkAssignment[]>(sampleHomework)
    const [searchQuery, setSearchQuery] = useState('')
    const [classFilter, setClassFilter] = useState<string>('all')
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

    const filteredHomework = homework.filter((hw) => {
        const matchesSearch =
            hw.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            hw.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesClass = classFilter === 'all' || `${hw.class}-${hw.section}` === classFilter
        return matchesSearch && matchesClass
    })

    const activeCount = homework.filter((h) => h.status === 'active').length
    const totalSubmissions = homework.reduce((acc, h) => acc + h.submissions, 0)

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Homework Management</h1>
                    <p className="text-muted-foreground">
                        Create and manage homework assignments
                    </p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gradient-primary">
                            <Plus className="mr-2 h-4 w-4" />
                            Assign Homework
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Create New Homework Assignment</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
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
                                <Label>Title</Label>
                                <Input placeholder="Enter homework title" />
                            </div>
                            <div className="space-y-2">
                                <Label>Description / Instructions</Label>
                                <Textarea
                                    placeholder="Provide detailed instructions for students..."
                                    rows={4}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Assigned Date</Label>
                                    <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Due Date</Label>
                                    <Input type="date" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Attachments (Optional)</Label>
                                <div className="flex items-center gap-4">
                                    <Input type="file" className="flex-1" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button className="gradient-primary" onClick={() => setIsAddDialogOpen(false)}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Assignment
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
                        <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{homework.length}</div>
                        <p className="text-xs text-muted-foreground">This semester</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Active</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-500">{activeCount}</div>
                        <p className="text-xs text-muted-foreground">Pending submission</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{totalSubmissions}</div>
                        <p className="text-xs text-muted-foreground">From all classes</p>
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
                                placeholder="Search homework..."
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

            {/* Homework Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Homework Assignments
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Assigned</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead className="text-center">Submissions</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredHomework.map((hw) => (
                                <TableRow key={hw.id}>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{hw.title}</p>
                                            <p className="text-sm text-muted-foreground line-clamp-1">
                                                {hw.description}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {hw.class} - {hw.section}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm">
                                            <Calendar className="h-3 w-3 text-muted-foreground" />
                                            {new Date(hw.assignedDate).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm">
                                            <Clock className="h-3 w-3 text-muted-foreground" />
                                            {new Date(hw.dueDate).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="font-medium">
                                            {hw.submissions}/{hw.totalStudents}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {Math.round((hw.submissions / hw.totalStudents) * 100)}%
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {hw.status === 'active' ? (
                                            <Badge className="bg-green-500/10 text-green-500">Active</Badge>
                                        ) : (
                                            <Badge variant="outline">Closed</Badge>
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
                                                    <Users className="mr-2 h-4 w-4" />
                                                    View Submissions
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
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
