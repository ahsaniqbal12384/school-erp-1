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
    Clock,
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
    GraduationCap,
    FileText,
    Users,
    CheckCircle,
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Exam {
    id: string
    name: string
    type: 'terminal' | 'midterm' | 'final' | 'class-test'
    class: string
    startDate: string
    endDate: string
    subjects: number
    status: 'upcoming' | 'ongoing' | 'completed'
}

interface ExamSchedule {
    id: string
    examName: string
    subject: string
    class: string
    date: string
    time: string
    duration: string
    room: string
}

const sampleExams: Exam[] = [
    { id: '1', name: 'First Terminal Examination', type: 'terminal', class: 'All Classes', startDate: '2024-02-20', endDate: '2024-03-05', subjects: 8, status: 'upcoming' },
    { id: '2', name: 'Class Test - January', type: 'class-test', class: 'Class 9-10', startDate: '2024-01-15', endDate: '2024-01-17', subjects: 5, status: 'completed' },
    { id: '3', name: 'Mid-Term Examination', type: 'midterm', class: 'All Classes', startDate: '2024-04-15', endDate: '2024-04-30', subjects: 8, status: 'upcoming' },
    { id: '4', name: 'Final Examination', type: 'final', class: 'All Classes', startDate: '2024-06-01', endDate: '2024-06-20', subjects: 8, status: 'upcoming' },
]

const sampleSchedule: ExamSchedule[] = [
    { id: '1', examName: 'First Terminal', subject: 'Mathematics', class: 'Class 10', date: '2024-02-20', time: '9:00 AM', duration: '3 hrs', room: 'Hall A' },
    { id: '2', examName: 'First Terminal', subject: 'English', class: 'Class 10', date: '2024-02-22', time: '9:00 AM', duration: '3 hrs', room: 'Hall A' },
    { id: '3', examName: 'First Terminal', subject: 'Physics', class: 'Class 10', date: '2024-02-24', time: '9:00 AM', duration: '3 hrs', room: 'Hall B' },
    { id: '4', examName: 'First Terminal', subject: 'Chemistry', class: 'Class 10', date: '2024-02-26', time: '9:00 AM', duration: '3 hrs', room: 'Hall B' },
    { id: '5', examName: 'First Terminal', subject: 'Biology', class: 'Class 10', date: '2024-02-28', time: '9:00 AM', duration: '3 hrs', room: 'Hall C' },
]

export default function ExamsPage() {
    const [exams] = useState<Exam[]>(sampleExams)
    const [schedule] = useState<ExamSchedule[]>(sampleSchedule)
    const [searchQuery, setSearchQuery] = useState('')
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

    const filteredExams = exams.filter((exam) =>
        exam.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const upcomingCount = exams.filter((e) => e.status === 'upcoming').length
    const ongoingCount = exams.filter((e) => e.status === 'ongoing').length
    const completedCount = exams.filter((e) => e.status === 'completed').length

    const getStatusBadge = (status: Exam['status']) => {
        switch (status) {
            case 'upcoming':
                return <Badge className="bg-blue-500/10 text-blue-500">Upcoming</Badge>
            case 'ongoing':
                return <Badge className="bg-yellow-500/10 text-yellow-500">Ongoing</Badge>
            case 'completed':
                return <Badge className="bg-green-500/10 text-green-500">Completed</Badge>
        }
    }

    const getTypeBadge = (type: Exam['type']) => {
        switch (type) {
            case 'terminal':
                return <Badge variant="outline" className="border-purple-500 text-purple-500">Terminal</Badge>
            case 'midterm':
                return <Badge variant="outline" className="border-blue-500 text-blue-500">Mid-Term</Badge>
            case 'final':
                return <Badge variant="outline" className="border-green-500 text-green-500">Final</Badge>
            case 'class-test':
                return <Badge variant="outline" className="border-orange-500 text-orange-500">Class Test</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Exams & Assessments</h1>
                    <p className="text-muted-foreground">
                        Manage exams, schedules, and assessments
                    </p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gradient-primary">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Exam
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Create New Examination</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label>Exam Name</Label>
                                <Input placeholder="e.g., First Terminal Examination" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Exam Type</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="terminal">Terminal</SelectItem>
                                            <SelectItem value="midterm">Mid-Term</SelectItem>
                                            <SelectItem value="final">Final</SelectItem>
                                            <SelectItem value="class-test">Class Test</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Applicable Classes</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select classes" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Classes</SelectItem>
                                            <SelectItem value="primary">Primary (1-5)</SelectItem>
                                            <SelectItem value="middle">Middle (6-8)</SelectItem>
                                            <SelectItem value="matric">Matric (9-10)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Start Date</Label>
                                    <Input type="date" />
                                </div>
                                <div className="space-y-2">
                                    <Label>End Date</Label>
                                    <Input type="date" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button className="gradient-primary" onClick={() => setIsAddDialogOpen(false)}>
                                    Create Exam
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
                        <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                        <Calendar className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-500">{upcomingCount}</div>
                        <p className="text-xs text-muted-foreground">Scheduled exams</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Ongoing</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-500">{ongoingCount}</div>
                        <p className="text-xs text-muted-foreground">In progress</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{completedCount}</div>
                        <p className="text-xs text-muted-foreground">Results published</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="exams" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="exams">Examinations</TabsTrigger>
                    <TabsTrigger value="schedule">Schedule</TabsTrigger>
                </TabsList>

                {/* Exams Tab */}
                <TabsContent value="exams" className="space-y-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search exams..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <GraduationCap className="h-5 w-5" />
                                Examination List
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Exam Name</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Classes</TableHead>
                                        <TableHead>Duration</TableHead>
                                        <TableHead className="text-center">Subjects</TableHead>
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
                                                        <ClipboardList className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <span className="font-medium">{exam.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{getTypeBadge(exam.type)}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    <Users className="mr-1 h-3 w-3" />
                                                    {exam.class}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    <p>{new Date(exam.startDate).toLocaleDateString()}</p>
                                                    <p className="text-muted-foreground">to {new Date(exam.endDate).toLocaleDateString()}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">{exam.subjects}</TableCell>
                                            <TableCell>{getStatusBadge(exam.status)}</TableCell>
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
                                                            <Calendar className="mr-2 h-4 w-4" />
                                                            View Schedule
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
                </TabsContent>

                {/* Schedule Tab */}
                <TabsContent value="schedule" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Exam Schedule - First Terminal Examination
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Subject</TableHead>
                                        <TableHead>Class</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Time</TableHead>
                                        <TableHead>Duration</TableHead>
                                        <TableHead>Room</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {schedule.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{item.subject}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{item.class}</Badge>
                                            </TableCell>
                                            <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                                            <TableCell>{item.time}</TableCell>
                                            <TableCell>{item.duration}</TableCell>
                                            <TableCell>{item.room}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
