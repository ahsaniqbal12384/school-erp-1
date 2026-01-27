'use client'

import { useState, useEffect, useCallback } from 'react'
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
    ClipboardList,
    Plus,
    Search,
    Calendar,
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
    FileText,
    CheckCircle,
    Clock,
    Loader2,
    PlayCircle,
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTenant } from '@/lib/tenant'
import { toast } from 'sonner'

interface Exam {
    id: string
    name: string
    exam_type: 'monthly' | 'mid_term' | 'final' | 'quiz' | 'assignment' | 'practical'
    start_date: string
    end_date: string
    status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
    academic_year?: {
        id: string
        name: string
    }
    schedules?: Array<{
        id: string
        date: string
        start_time: string
        end_time: string
        max_marks: number
        class: { id: string; name: string; section: string }
        subject: { id: string; name: string; code: string }
    }>
}

interface ClassOption {
    id: string
    name: string
    section: string
}

interface SubjectOption {
    id: string
    name: string
    code: string
}

const examTypeLabels: Record<string, string> = {
    monthly: 'Monthly Test',
    mid_term: 'Mid Term',
    final: 'Final Exam',
    quiz: 'Quiz',
    assignment: 'Assignment',
    practical: 'Practical'
}

export default function ExamsPage() {
    const { school } = useTenant()
    const [exams, setExams] = useState<Exam[]>([])
    const [classes, setClasses] = useState<ClassOption[]>([])
    const [subjects, setSubjects] = useState<SubjectOption[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [saving, setSaving] = useState(false)

    // New exam form state
    const [newExam, setNewExam] = useState({
        name: '',
        exam_type: 'monthly' as const,
        start_date: '',
        end_date: ''
    })

    const fetchData = useCallback(async () => {
        if (!school?.id) return
        
        try {
            setLoading(true)
            const [examsRes, classesRes, subjectsRes] = await Promise.all([
                fetch(`/api/exams?school_id=${school.id}`),
                fetch(`/api/classes?school_id=${school.id}`),
                fetch(`/api/subjects?school_id=${school.id}`)
            ])

            if (examsRes.ok) {
                const { data } = await examsRes.json()
                setExams(data || [])
            }
            if (classesRes.ok) {
                const { data } = await classesRes.json()
                setClasses(data || [])
            }
            if (subjectsRes.ok) {
                const { data } = await subjectsRes.json()
                setSubjects(data || [])
            }
        } catch (error) {
            console.error('Error fetching data:', error)
            toast.error('Failed to load exams')
        } finally {
            setLoading(false)
        }
    }, [school?.id])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const filteredExams = exams.filter((exam) => {
        const matchesSearch = exam.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'all' || exam.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const handleCreateExam = async () => {
        if (!newExam.name || !newExam.start_date) {
            toast.error('Please fill all required fields')
            return
        }

        setSaving(true)
        try {
            const response = await fetch('/api/exams', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    school_id: school?.id,
                    ...newExam
                })
            })

            if (!response.ok) throw new Error('Failed to create exam')

            toast.success('Exam created successfully!')
            setIsAddDialogOpen(false)
            setNewExam({ name: '', exam_type: 'monthly', start_date: '', end_date: '' })
            fetchData()
        } catch (error) {
            console.error('Error creating exam:', error)
            toast.error('Failed to create exam')
        } finally {
            setSaving(false)
        }
    }

    const handleStatusChange = async (examId: string, newStatus: string) => {
        try {
            const response = await fetch('/api/exams', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: examId, status: newStatus })
            })

            if (!response.ok) throw new Error('Failed to update status')

            toast.success('Exam status updated!')
            fetchData()
        } catch (error) {
            console.error('Error updating status:', error)
            toast.error('Failed to update status')
        }
    }

    const getStatusBadge = (status: Exam['status']) => {
        switch (status) {
            case 'scheduled':
                return <Badge className="bg-blue-500/10 text-blue-500">Scheduled</Badge>
            case 'ongoing':
                return <Badge className="bg-yellow-500/10 text-yellow-500">Ongoing</Badge>
            case 'completed':
                return <Badge className="bg-green-500/10 text-green-500">Completed</Badge>
            case 'cancelled':
                return <Badge className="bg-red-500/10 text-red-500">Cancelled</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const getExamTypeBadge = (type: string) => {
        const colors: Record<string, string> = {
            monthly: 'bg-purple-500/10 text-purple-500',
            mid_term: 'bg-orange-500/10 text-orange-500',
            final: 'bg-red-500/10 text-red-500',
            quiz: 'bg-cyan-500/10 text-cyan-500',
            assignment: 'bg-green-500/10 text-green-500',
            practical: 'bg-pink-500/10 text-pink-500'
        }
        return <Badge className={colors[type] || 'bg-gray-500/10 text-gray-500'}>{examTypeLabels[type] || type}</Badge>
    }

    // Stats
    const scheduledCount = exams.filter(e => e.status === 'scheduled').length
    const ongoingCount = exams.filter(e => e.status === 'ongoing').length
    const completedCount = exams.filter(e => e.status === 'completed').length

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Examination Management</h1>
                    <p className="text-muted-foreground">
                        Create and manage exams, schedules, and results
                    </p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gradient-primary">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Exam
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Create New Exam</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Exam Name *</Label>
                                <Input
                                    placeholder="e.g., First Terminal Examination 2024"
                                    value={newExam.name}
                                    onChange={(e) => setNewExam({ ...newExam, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Exam Type *</Label>
                                <Select
                                    value={newExam.exam_type}
                                    onValueChange={(value) => setNewExam({ ...newExam, exam_type: value as typeof newExam.exam_type })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="monthly">Monthly Test</SelectItem>
                                        <SelectItem value="mid_term">Mid Term</SelectItem>
                                        <SelectItem value="final">Final Exam</SelectItem>
                                        <SelectItem value="quiz">Quiz</SelectItem>
                                        <SelectItem value="assignment">Assignment</SelectItem>
                                        <SelectItem value="practical">Practical</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Start Date *</Label>
                                    <Input
                                        type="date"
                                        value={newExam.start_date}
                                        onChange={(e) => setNewExam({ ...newExam, start_date: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>End Date</Label>
                                    <Input
                                        type="date"
                                        value={newExam.end_date}
                                        onChange={(e) => setNewExam({ ...newExam, end_date: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button className="gradient-primary" onClick={handleCreateExam} disabled={saving}>
                                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Create Exam
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
                        <ClipboardList className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{exams.length}</div>
                        <p className="text-xs text-muted-foreground">This academic year</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
                        <Calendar className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-500">{scheduledCount}</div>
                        <p className="text-xs text-muted-foreground">Upcoming exams</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Ongoing</CardTitle>
                        <PlayCircle className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-500">{ongoingCount}</div>
                        <p className="text-xs text-muted-foreground">Currently in progress</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{completedCount}</div>
                        <p className="text-xs text-muted-foreground">Finished exams</p>
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
                                placeholder="Search exams..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="scheduled">Scheduled</SelectItem>
                                <SelectItem value="ongoing">Ongoing</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Exams Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ClipboardList className="h-5 w-5" />
                        Examinations
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {filteredExams.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <ClipboardList className="h-12 w-12 mb-4 opacity-50" />
                            <p>No exams found</p>
                            <p className="text-sm">Create your first exam to get started</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Exam Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Start Date</TableHead>
                                    <TableHead>End Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredExams.map((exam) => (
                                    <TableRow key={exam.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                                    <FileText className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{exam.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {exam.schedules?.length || 0} subjects scheduled
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{getExamTypeBadge(exam.exam_type)}</TableCell>
                                        <TableCell>
                                            {exam.start_date ? new Date(exam.start_date).toLocaleDateString() : '-'}
                                        </TableCell>
                                        <TableCell>
                                            {exam.end_date ? new Date(exam.end_date).toLocaleDateString() : '-'}
                                        </TableCell>
                                        <TableCell>{getStatusBadge(exam.status)}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View Schedule
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit Exam
                                                    </DropdownMenuItem>
                                                    {exam.status === 'scheduled' && (
                                                        <DropdownMenuItem onClick={() => handleStatusChange(exam.id, 'ongoing')}>
                                                            <PlayCircle className="mr-2 h-4 w-4" />
                                                            Start Exam
                                                        </DropdownMenuItem>
                                                    )}
                                                    {exam.status === 'ongoing' && (
                                                        <DropdownMenuItem onClick={() => handleStatusChange(exam.id, 'completed')}>
                                                            <CheckCircle className="mr-2 h-4 w-4" />
                                                            Mark Completed
                                                        </DropdownMenuItem>
                                                    )}
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
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
