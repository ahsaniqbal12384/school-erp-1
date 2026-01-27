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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
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
    Loader2,
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

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

const emptyFormData = {
    class: '',
    section: '',
    subject: 'Mathematics',
    title: '',
    description: '',
    assignedDate: new Date().toISOString().split('T')[0],
    dueDate: '',
}

export default function TeacherHomeworkPage() {
    const [homework, setHomework] = useState<HomeworkAssignment[]>(sampleHomework)
    const [searchQuery, setSearchQuery] = useState('')
    const [classFilter, setClassFilter] = useState<string>('all')
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedHomework, setSelectedHomework] = useState<HomeworkAssignment | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState(emptyFormData)

    const filteredHomework = homework.filter((hw) => {
        const matchesSearch =
            hw.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            hw.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesClass = classFilter === 'all' || `${hw.class}-${hw.section}` === classFilter
        return matchesSearch && matchesClass
    })

    const activeCount = homework.filter((h) => h.status === 'active').length
    const totalSubmissions = homework.reduce((acc, h) => acc + h.submissions, 0)

    const handleAddHomework = async () => {
        if (!formData.class || !formData.title || !formData.dueDate) {
            toast.error('Please fill in all required fields')
            return
        }

        setIsLoading(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            const classSection = formData.class.split('-')
            const newHomework: HomeworkAssignment = {
                id: String(homework.length + 1),
                class: classSection[0] || 'Class 10',
                section: classSection[1] || 'A',
                subject: formData.subject,
                title: formData.title,
                description: formData.description,
                assignedDate: formData.assignedDate,
                dueDate: formData.dueDate,
                submissions: 0,
                totalStudents: 35,
                status: 'active',
            }

            setHomework([newHomework, ...homework])
            setFormData(emptyFormData)
            setIsAddDialogOpen(false)
            toast.success('Homework assignment created successfully')
        } catch {
            toast.error('Failed to create assignment')
        } finally {
            setIsLoading(false)
        }
    }

    const handleEditHomework = async () => {
        if (!selectedHomework || !formData.title || !formData.dueDate) {
            toast.error('Please fill in all required fields')
            return
        }

        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))

            const classSection = formData.class.split('-')
            setHomework(homework.map(hw =>
                hw.id === selectedHomework.id
                    ? {
                        ...hw,
                        class: classSection[0] || hw.class,
                        section: classSection[1] || hw.section,
                        title: formData.title,
                        description: formData.description,
                        dueDate: formData.dueDate,
                    }
                    : hw
            ))
            setIsEditDialogOpen(false)
            setSelectedHomework(null)
            toast.success('Homework assignment updated successfully')
        } catch {
            toast.error('Failed to update assignment')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteHomework = async () => {
        if (!selectedHomework) return

        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            setHomework(homework.filter(hw => hw.id !== selectedHomework.id))
            setIsDeleteDialogOpen(false)
            setSelectedHomework(null)
            toast.success('Homework assignment deleted successfully')
        } catch {
            toast.error('Failed to delete assignment')
        } finally {
            setIsLoading(false)
        }
    }

    const openEditDialog = (hw: HomeworkAssignment) => {
        setSelectedHomework(hw)
        setFormData({
            class: `${hw.class}-${hw.section}`,
            section: hw.section,
            subject: hw.subject,
            title: hw.title,
            description: hw.description,
            assignedDate: hw.assignedDate,
            dueDate: hw.dueDate,
        })
        setIsEditDialogOpen(true)
    }

    const openViewDialog = (hw: HomeworkAssignment) => {
        setSelectedHomework(hw)
        setIsViewDialogOpen(true)
    }

    const openDeleteDialog = (hw: HomeworkAssignment) => {
        setSelectedHomework(hw)
        setIsDeleteDialogOpen(true)
    }

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
                                    <Label>Class *</Label>
                                    <Select
                                        value={formData.class}
                                        onValueChange={(value) => setFormData({ ...formData, class: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select class" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Class 10-A">Class 10-A</SelectItem>
                                            <SelectItem value="Class 10-B">Class 10-B</SelectItem>
                                            <SelectItem value="Class 9-A">Class 9-A</SelectItem>
                                            <SelectItem value="Class 9-B">Class 9-B</SelectItem>
                                            <SelectItem value="Class 8-A">Class 8-A</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Subject</Label>
                                    <Input value={formData.subject} readOnly />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Title *</Label>
                                <Input
                                    placeholder="Enter homework title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Description / Instructions</Label>
                                <Textarea
                                    placeholder="Provide detailed instructions for students..."
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Assigned Date</Label>
                                    <Input
                                        type="date"
                                        value={formData.assignedDate}
                                        onChange={(e) => setFormData({ ...formData, assignedDate: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Due Date *</Label>
                                    <Input
                                        type="date"
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Attachments (Optional)</Label>
                                <div className="flex items-center gap-4">
                                    <Input type="file" className="flex-1" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="outline" onClick={() => {
                                    setIsAddDialogOpen(false)
                                    setFormData(emptyFormData)
                                }}>
                                    Cancel
                                </Button>
                                <Button className="gradient-primary" onClick={handleAddHomework} disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Create Assignment
                                        </>
                                    )}
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
                                                <DropdownMenuItem onClick={() => openViewDialog(hw)}>
                                                    <Users className="mr-2 h-4 w-4" />
                                                    View Submissions
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => openEditDialog(hw)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-500"
                                                    onClick={() => openDeleteDialog(hw)}
                                                >
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

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Homework Assignment</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Class *</Label>
                                <Select
                                    value={formData.class}
                                    onValueChange={(value) => setFormData({ ...formData, class: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Class 10-A">Class 10-A</SelectItem>
                                        <SelectItem value="Class 10-B">Class 10-B</SelectItem>
                                        <SelectItem value="Class 9-A">Class 9-A</SelectItem>
                                        <SelectItem value="Class 9-B">Class 9-B</SelectItem>
                                        <SelectItem value="Class 8-A">Class 8-A</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Subject</Label>
                                <Input value={formData.subject} readOnly />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Title *</Label>
                            <Input
                                placeholder="Enter homework title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Description / Instructions</Label>
                            <Textarea
                                placeholder="Provide detailed instructions for students..."
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Assigned Date</Label>
                                <Input
                                    type="date"
                                    value={formData.assignedDate}
                                    onChange={(e) => setFormData({ ...formData, assignedDate: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Due Date *</Label>
                                <Input
                                    type="date"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <Button variant="outline" onClick={() => {
                                setIsEditDialogOpen(false)
                                setSelectedHomework(null)
                            }}>
                                Cancel
                            </Button>
                            <Button className="gradient-primary" onClick={handleEditHomework} disabled={isLoading}>
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

            {/* View Submissions Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Submissions - {selectedHomework?.title}</DialogTitle>
                    </DialogHeader>
                    {selectedHomework && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Submissions</p>
                                    <p className="text-2xl font-bold">
                                        {selectedHomework.submissions}/{selectedHomework.totalStudents}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Completion Rate</p>
                                    <p className="text-2xl font-bold text-green-500">
                                        {Math.round((selectedHomework.submissions / selectedHomework.totalStudents) * 100)}%
                                    </p>
                                </div>
                            </div>
                            <div className="border rounded-lg">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Student</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Submitted On</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <TableRow key={i}>
                                                <TableCell className="font-medium">Student {i + 1}</TableCell>
                                                <TableCell>
                                                    {i < 3 ? (
                                                        <Badge className="bg-green-500/10 text-green-500">Submitted</Badge>
                                                    ) : (
                                                        <Badge variant="outline">Pending</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {i < 3 ? new Date().toLocaleDateString() : '-'}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            <div className="flex justify-end">
                                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Homework Assignment?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete &quot;{selectedHomework?.title}&quot;? This action cannot be undone
                            and will remove all associated submissions.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setSelectedHomework(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteHomework}
                            className="bg-red-500 hover:bg-red-600"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Delete'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
