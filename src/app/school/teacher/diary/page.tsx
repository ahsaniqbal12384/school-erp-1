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
    Plus,
    Search,
    Calendar,
    FileText,
    Users,
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
    CheckCircle,
    Loader2,
    Save,
    Send,
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

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

const emptyFormData = {
    date: new Date().toISOString().split('T')[0],
    class: '',
    subject: 'Mathematics',
    topic: '',
    description: '',
    homework: '',
}

export default function TeacherDiaryPage() {
    const [entries, setEntries] = useState<DiaryEntry[]>(sampleDiary)
    const [searchQuery, setSearchQuery] = useState('')
    const [classFilter, setClassFilter] = useState<string>('all')
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null)
    const [formData, setFormData] = useState(emptyFormData)
    const [isLoading, setIsLoading] = useState(false)

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

    const handleSaveAsDraft = async () => {
        if (!formData.class || !formData.topic) {
            toast.error('Please fill in required fields (Class and Topic)')
            return
        }

        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))

            const classSection = formData.class.split('-')
            const newEntry: DiaryEntry = {
                id: String(entries.length + 1),
                date: formData.date,
                class: classSection[0] || 'Class 10',
                section: classSection[1] || 'A',
                subject: formData.subject,
                topic: formData.topic,
                description: formData.description,
                homework: formData.homework,
                status: 'draft',
            }

            setEntries([newEntry, ...entries])
            setFormData(emptyFormData)
            setIsAddDialogOpen(false)
            toast.success('Entry saved as draft', {
                description: 'You can publish it later from the entries list'
            })
        } catch {
            toast.error('Failed to save entry')
        } finally {
            setIsLoading(false)
        }
    }

    const handlePublishEntry = async () => {
        if (!formData.class || !formData.topic) {
            toast.error('Please fill in required fields (Class and Topic)')
            return
        }

        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))

            const classSection = formData.class.split('-')
            const newEntry: DiaryEntry = {
                id: String(entries.length + 1),
                date: formData.date,
                class: classSection[0] || 'Class 10',
                section: classSection[1] || 'A',
                subject: formData.subject,
                topic: formData.topic,
                description: formData.description,
                homework: formData.homework,
                status: 'published',
            }

            setEntries([newEntry, ...entries])
            setFormData(emptyFormData)
            setIsAddDialogOpen(false)
            toast.success('Entry published successfully', {
                description: 'Parents can now view this entry'
            })
        } catch {
            toast.error('Failed to publish entry')
        } finally {
            setIsLoading(false)
        }
    }

    const handleEditEntry = async (publish: boolean = false) => {
        if (!selectedEntry || !formData.topic) {
            toast.error('Please fill in required fields')
            return
        }

        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))

            const classSection = formData.class.split('-')
            setEntries(entries.map(entry =>
                entry.id === selectedEntry.id
                    ? {
                        ...entry,
                        date: formData.date,
                        class: classSection[0] || entry.class,
                        section: classSection[1] || entry.section,
                        topic: formData.topic,
                        description: formData.description,
                        homework: formData.homework,
                        status: publish ? 'published' : entry.status,
                    }
                    : entry
            ))

            setIsEditDialogOpen(false)
            setSelectedEntry(null)
            toast.success(publish ? 'Entry published successfully' : 'Entry updated successfully')
        } catch {
            toast.error('Failed to update entry')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteEntry = async () => {
        if (!selectedEntry) return

        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            setEntries(entries.filter(entry => entry.id !== selectedEntry.id))
            setIsDeleteDialogOpen(false)
            setSelectedEntry(null)
            toast.success('Entry deleted successfully')
        } catch {
            toast.error('Failed to delete entry')
        } finally {
            setIsLoading(false)
        }
    }

    const openEditDialog = (entry: DiaryEntry) => {
        setSelectedEntry(entry)
        setFormData({
            date: entry.date,
            class: `${entry.class}-${entry.section}`,
            subject: entry.subject,
            topic: entry.topic,
            description: entry.description,
            homework: entry.homework,
        })
        setIsEditDialogOpen(true)
    }

    const openViewDialog = (entry: DiaryEntry) => {
        setSelectedEntry(entry)
        setIsViewDialogOpen(true)
    }

    const openDeleteDialog = (entry: DiaryEntry) => {
        setSelectedEntry(entry)
        setIsDeleteDialogOpen(true)
    }

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
                                    <Input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
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
                                <Label>Topic Covered *</Label>
                                <Input
                                    placeholder="Enter today's topic"
                                    value={formData.topic}
                                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Lesson Description</Label>
                                <Textarea
                                    placeholder="Describe what was taught in today's class..."
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Homework Assigned</Label>
                                <Textarea
                                    placeholder="Enter homework details..."
                                    rows={2}
                                    value={formData.homework}
                                    onChange={(e) => setFormData({ ...formData, homework: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="outline" onClick={handleSaveAsDraft} disabled={isLoading}>
                                    {isLoading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Save className="mr-2 h-4 w-4" />
                                    )}
                                    Save as Draft
                                </Button>
                                <Button className="gradient-primary" onClick={handlePublishEntry} disabled={isLoading}>
                                    {isLoading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Send className="mr-2 h-4 w-4" />
                                    )}
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
                                                <DropdownMenuItem onClick={() => openViewDialog(entry)}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => openEditDialog(entry)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit Entry
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-500"
                                                    onClick={() => openDeleteDialog(entry)}
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
                        <DialogTitle>Edit Diary Entry</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Date</Label>
                                <Input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
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
                            <Label>Topic Covered *</Label>
                            <Input
                                placeholder="Enter today's topic"
                                value={formData.topic}
                                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Lesson Description</Label>
                            <Textarea
                                placeholder="Describe what was taught in today's class..."
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Homework Assigned</Label>
                            <Textarea
                                placeholder="Enter homework details..."
                                rows={2}
                                value={formData.homework}
                                onChange={(e) => setFormData({ ...formData, homework: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button variant="outline" onClick={() => handleEditEntry(false)} disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Save
                            </Button>
                            {selectedEntry?.status === 'draft' && (
                                <Button className="gradient-primary" onClick={() => handleEditEntry(true)} disabled={isLoading}>
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                    Publish
                                </Button>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* View Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Diary Entry Details</DialogTitle>
                    </DialogHeader>
                    {selectedEntry && (
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Date</p>
                                    <p className="font-medium">{new Date(selectedEntry.date).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Class</p>
                                    <p className="font-medium">{selectedEntry.class} - {selectedEntry.section}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Subject</p>
                                    <p className="font-medium">{selectedEntry.subject}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Topic</p>
                                <p className="font-medium text-lg">{selectedEntry.topic}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Description</p>
                                <p className="mt-1">{selectedEntry.description || 'No description provided'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Homework Assigned</p>
                                <div className="mt-1 p-3 bg-muted rounded-lg">
                                    {selectedEntry.homework || 'No homework assigned'}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <p className="text-sm text-muted-foreground">Status:</p>
                                {selectedEntry.status === 'published' ? (
                                    <Badge className="bg-green-500/10 text-green-500">Published</Badge>
                                ) : (
                                    <Badge variant="outline">Draft</Badge>
                                )}
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                                    Close
                                </Button>
                                <Button onClick={() => {
                                    setIsViewDialogOpen(false)
                                    openEditDialog(selectedEntry)
                                }}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Entry
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
                        <AlertDialogTitle>Delete Diary Entry?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete the entry for &quot;{selectedEntry?.topic}&quot;?
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setSelectedEntry(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteEntry}
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
