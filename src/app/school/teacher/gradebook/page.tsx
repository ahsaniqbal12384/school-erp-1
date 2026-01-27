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
    ClipboardList,
    Search,
    Save,
    Download,
    Users,
    TrendingUp,
    Award,
    BookOpen,
    Loader2,
} from 'lucide-react'
import { toast } from 'sonner'

interface Student {
    id: string
    rollNo: string
    name: string
    assignment1: number | null
    assignment2: number | null
    quiz1: number | null
    quiz2: number | null
    midterm: number | null
    final: number | null
    total: number
    grade: string
}

const calculateGrade = (total: number): string => {
    if (total >= 135) return 'A+'
    if (total >= 120) return 'A'
    if (total >= 105) return 'B+'
    if (total >= 90) return 'B'
    if (total >= 75) return 'C+'
    if (total >= 60) return 'C'
    return 'F'
}

const calculateTotal = (student: Student): number => {
    return (student.assignment1 || 0) +
        (student.assignment2 || 0) +
        (student.quiz1 || 0) +
        (student.quiz2 || 0) +
        (student.midterm || 0) +
        (student.final || 0)
}

const sampleStudents: Student[] = [
    { id: '1', rollNo: '1001', name: 'Ahmed Khan', assignment1: 18, assignment2: 20, quiz1: 9, quiz2: 8, midterm: 42, final: null, total: 97, grade: 'A' },
    { id: '2', rollNo: '1002', name: 'Fatima Ali', assignment1: 20, assignment2: 19, quiz1: 10, quiz2: 9, midterm: 45, final: null, total: 103, grade: 'A+' },
    { id: '3', rollNo: '1003', name: 'Hassan Raza', assignment1: 15, assignment2: 16, quiz1: 7, quiz2: 6, midterm: 35, final: null, total: 79, grade: 'B' },
    { id: '4', rollNo: '1004', name: 'Sara Ahmed', assignment1: 19, assignment2: 18, quiz1: 8, quiz2: 9, midterm: 40, final: null, total: 94, grade: 'A' },
    { id: '5', rollNo: '1005', name: 'Usman Tariq', assignment1: 17, assignment2: 17, quiz1: 8, quiz2: 7, midterm: 38, final: null, total: 87, grade: 'B+' },
    { id: '6', rollNo: '1006', name: 'Ayesha Malik', assignment1: 20, assignment2: 20, quiz1: 10, quiz2: 10, midterm: 48, final: null, total: 108, grade: 'A+' },
    { id: '7', rollNo: '1007', name: 'Ali Hassan', assignment1: 16, assignment2: 15, quiz1: 7, quiz2: 8, midterm: 36, final: null, total: 82, grade: 'B+' },
    { id: '8', rollNo: '1008', name: 'Zainab Shah', assignment1: 18, assignment2: 19, quiz1: 9, quiz2: 8, midterm: 41, final: null, total: 95, grade: 'A' },
]

export default function TeacherGradebookPage() {
    const [students, setStudents] = useState<Student[]>(sampleStudents)
    const [selectedClass, setSelectedClass] = useState<string>('10-A')
    const [searchQuery, setSearchQuery] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [isExporting, setIsExporting] = useState(false)
    const [hasChanges, setHasChanges] = useState(false)

    const filteredStudents = students.filter((student) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.rollNo.includes(searchQuery)
    )

    const classAverage = Math.round(students.reduce((acc, s) => acc + s.total, 0) / students.length)
    const topPerformer = students.reduce((a, b) => (a.total > b.total ? a : b))
    const aGradeCount = students.filter((s) => s.grade.startsWith('A')).length

    const getGradeBadge = (grade: string) => {
        if (grade === 'A+') return <Badge className="bg-green-500 text-white">A+</Badge>
        if (grade === 'A') return <Badge className="bg-blue-500 text-white">A</Badge>
        if (grade === 'B+') return <Badge className="bg-yellow-500 text-white">B+</Badge>
        if (grade === 'B') return <Badge className="bg-orange-500 text-white">B</Badge>
        return <Badge variant="outline">{grade}</Badge>
    }

    const updateGrade = (studentId: string, field: keyof Student, value: string) => {
        const numValue = value === '' ? null : parseInt(value, 10)

        setStudents(prev => prev.map(student => {
            if (student.id !== studentId) return student

            const updatedStudent = { ...student, [field]: numValue }
            const newTotal = calculateTotal(updatedStudent)
            const newGrade = calculateGrade(newTotal)

            return { ...updatedStudent, total: newTotal, grade: newGrade }
        }))
        setHasChanges(true)
    }

    const handleSaveChanges = async () => {
        setIsSaving(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500))

            setHasChanges(false)
            toast.success('Grades saved successfully', {
                description: `Updated grades for ${students.length} students`
            })
        } catch {
            toast.error('Failed to save grades')
        } finally {
            setIsSaving(false)
        }
    }

    const handleExportGrades = async () => {
        setIsExporting(true)
        try {
            // Simulate export preparation
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Create CSV content
            const headers = ['Roll No', 'Student Name', 'Assignment 1', 'Assignment 2', 'Quiz 1', 'Quiz 2', 'Midterm', 'Final', 'Total', 'Grade']
            const rows = students.map(s => [
                s.rollNo,
                s.name,
                s.assignment1 || '-',
                s.assignment2 || '-',
                s.quiz1 || '-',
                s.quiz2 || '-',
                s.midterm || '-',
                s.final || '-',
                s.total,
                s.grade
            ])

            const csvContent = [
                headers.join(','),
                ...rows.map(row => row.join(','))
            ].join('\n')

            // Download file
            const blob = new Blob([csvContent], { type: 'text/csv' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `gradebook_class_${selectedClass}_${new Date().toISOString().split('T')[0]}.csv`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            window.URL.revokeObjectURL(url)

            toast.success('Grades exported successfully', {
                description: `Downloaded gradebook for Class ${selectedClass}`
            })
        } catch {
            toast.error('Failed to export grades')
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gradebook</h1>
                    <p className="text-muted-foreground">
                        Manage student grades and assessments
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={handleExportGrades} disabled={isExporting}>
                        {isExporting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Exporting...
                            </>
                        ) : (
                            <>
                                <Download className="mr-2 h-4 w-4" />
                                Export Grades
                            </>
                        )}
                    </Button>
                    <Button
                        className="gradient-primary"
                        onClick={handleSaveChanges}
                        disabled={isSaving || !hasChanges}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {hasChanges && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-600 dark:text-yellow-400 px-4 py-2 rounded-lg text-sm">
                    You have unsaved changes. Click &quot;Save Changes&quot; to save your grades.
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{students.length}</div>
                        <p className="text-xs text-muted-foreground">In this class</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Class Average</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{classAverage}</div>
                        <p className="text-xs text-muted-foreground">Out of 150</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
                        <Award className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold">{topPerformer.name}</div>
                        <p className="text-xs text-muted-foreground">{topPerformer.total} marks</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">A Grade Students</CardTitle>
                        <BookOpen className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{aGradeCount}</div>
                        <p className="text-xs text-muted-foreground">{((aGradeCount / students.length) * 100).toFixed(0)}% of class</p>
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
                                placeholder="Search students..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={selectedClass} onValueChange={setSelectedClass}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Class" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10-A">Class 10-A</SelectItem>
                                <SelectItem value="10-B">Class 10-B</SelectItem>
                                <SelectItem value="9-A">Class 9-A</SelectItem>
                                <SelectItem value="9-B">Class 9-B</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select defaultValue="mathematics">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Subject" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="mathematics">Mathematics</SelectItem>
                                <SelectItem value="english">English</SelectItem>
                                <SelectItem value="physics">Physics</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Gradebook Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <ClipboardList className="h-5 w-5" />
                            Mathematics - Class {selectedClass} Gradebook
                        </CardTitle>
                        <div className="flex gap-2 text-sm text-muted-foreground">
                            <span>Assign: 20</span>
                            <span>•</span>
                            <span>Quiz: 10</span>
                            <span>•</span>
                            <span>Midterm: 50</span>
                            <span>•</span>
                            <span>Final: 70</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">Roll No</TableHead>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead className="text-center">Assign 1<br /><span className="text-xs font-normal">(20)</span></TableHead>
                                    <TableHead className="text-center">Assign 2<br /><span className="text-xs font-normal">(20)</span></TableHead>
                                    <TableHead className="text-center">Quiz 1<br /><span className="text-xs font-normal">(10)</span></TableHead>
                                    <TableHead className="text-center">Quiz 2<br /><span className="text-xs font-normal">(10)</span></TableHead>
                                    <TableHead className="text-center">Midterm<br /><span className="text-xs font-normal">(50)</span></TableHead>
                                    <TableHead className="text-center">Final<br /><span className="text-xs font-normal">(70)</span></TableHead>
                                    <TableHead className="text-center">Total</TableHead>
                                    <TableHead className="text-center">Grade</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredStudents.map((student) => (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-medium">{student.rollNo}</TableCell>
                                        <TableCell>{student.name}</TableCell>
                                        <TableCell className="text-center">
                                            <Input
                                                type="number"
                                                value={student.assignment1 ?? ''}
                                                onChange={(e) => updateGrade(student.id, 'assignment1', e.target.value)}
                                                className="w-16 h-8 text-center mx-auto"
                                                max={20}
                                                min={0}
                                            />
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Input
                                                type="number"
                                                value={student.assignment2 ?? ''}
                                                onChange={(e) => updateGrade(student.id, 'assignment2', e.target.value)}
                                                className="w-16 h-8 text-center mx-auto"
                                                max={20}
                                                min={0}
                                            />
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Input
                                                type="number"
                                                value={student.quiz1 ?? ''}
                                                onChange={(e) => updateGrade(student.id, 'quiz1', e.target.value)}
                                                className="w-16 h-8 text-center mx-auto"
                                                max={10}
                                                min={0}
                                            />
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Input
                                                type="number"
                                                value={student.quiz2 ?? ''}
                                                onChange={(e) => updateGrade(student.id, 'quiz2', e.target.value)}
                                                className="w-16 h-8 text-center mx-auto"
                                                max={10}
                                                min={0}
                                            />
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Input
                                                type="number"
                                                value={student.midterm ?? ''}
                                                onChange={(e) => updateGrade(student.id, 'midterm', e.target.value)}
                                                className="w-16 h-8 text-center mx-auto"
                                                max={50}
                                                min={0}
                                            />
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Input
                                                type="number"
                                                value={student.final ?? ''}
                                                onChange={(e) => updateGrade(student.id, 'final', e.target.value)}
                                                className="w-16 h-8 text-center mx-auto"
                                                max={70}
                                                min={0}
                                                placeholder="-"
                                            />
                                        </TableCell>
                                        <TableCell className="text-center font-bold">{student.total}</TableCell>
                                        <TableCell className="text-center">{getGradeBadge(student.grade)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
