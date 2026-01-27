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
    FileSpreadsheet,
} from 'lucide-react'
import { useTenant } from '@/lib/tenant'
import { useAuth } from '@/lib/auth'
import { toast } from 'sonner'

interface Student {
    id: string
    first_name: string
    last_name: string
    roll_number: string
}

interface ExamOption {
    id: string
    name: string
    exam_type: string
    status: string
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

interface GradeEntry {
    student_id: string
    marks_obtained: number
    max_marks: number
}

export default function GradesEntryPage() {
    const { school } = useTenant()
    const { user } = useAuth()
    const [exams, setExams] = useState<ExamOption[]>([])
    const [classes, setClasses] = useState<ClassOption[]>([])
    const [subjects, setSubjects] = useState<SubjectOption[]>([])
    const [students, setStudents] = useState<Student[]>([])
    const [grades, setGrades] = useState<Record<string, GradeEntry>>({})
    const [existingGrades, setExistingGrades] = useState(false)

    const [selectedExam, setSelectedExam] = useState('')
    const [selectedClass, setSelectedClass] = useState('')
    const [selectedSubject, setSelectedSubject] = useState('')
    const [maxMarks, setMaxMarks] = useState('100')
    const [searchQuery, setSearchQuery] = useState('')

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    // Fetch initial data
    useEffect(() => {
        const fetchInitialData = async () => {
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
                console.error('Error fetching initial data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchInitialData()
    }, [school?.id])

    // Fetch students when class changes
    useEffect(() => {
        const fetchStudents = async () => {
            if (!school?.id || !selectedClass) {
                setStudents([])
                return
            }

            try {
                const response = await fetch(`/api/students?school_id=${school.id}&class_id=${selectedClass}`)
                if (response.ok) {
                    const { data } = await response.json()
                    setStudents(data || [])

                    // Initialize grades for all students
                    const initialGrades: Record<string, GradeEntry> = {}
                    data?.forEach((student: Student) => {
                        initialGrades[student.id] = {
                            student_id: student.id,
                            marks_obtained: 0,
                            max_marks: parseInt(maxMarks)
                        }
                    })
                    setGrades(initialGrades)
                }
            } catch (error) {
                console.error('Error fetching students:', error)
            }
        }

        fetchStudents()
    }, [school?.id, selectedClass, maxMarks])

    // Fetch existing grades when exam, class, and subject are selected
    const fetchExistingGrades = useCallback(async () => {
        if (!school?.id || !selectedExam || !selectedClass || !selectedSubject) return

        try {
            const response = await fetch(
                `/api/exams/results?school_id=${school.id}&exam_id=${selectedExam}&class_id=${selectedClass}&subject_id=${selectedSubject}`
            )

            if (response.ok) {
                const { data } = await response.json()
                if (data?.length > 0) {
                    setExistingGrades(true)
                    const existingRecords: Record<string, GradeEntry> = {}
                    data.forEach((record: { student_id: string; marks_obtained: number; max_marks: number }) => {
                        existingRecords[record.student_id] = {
                            student_id: record.student_id,
                            marks_obtained: record.marks_obtained,
                            max_marks: record.max_marks
                        }
                    })
                    setGrades(prev => ({ ...prev, ...existingRecords }))
                    if (data[0]?.max_marks) {
                        setMaxMarks(String(data[0].max_marks))
                    }
                } else {
                    setExistingGrades(false)
                }
            }
        } catch (error) {
            console.error('Error fetching existing grades:', error)
        }
    }, [school?.id, selectedExam, selectedClass, selectedSubject])

    useEffect(() => {
        fetchExistingGrades()
    }, [fetchExistingGrades])

    const updateMarks = (studentId: string, marks: string) => {
        const numMarks = parseInt(marks) || 0
        setGrades(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                student_id: studentId,
                marks_obtained: numMarks,
                max_marks: parseInt(maxMarks)
            }
        }))
    }

    const saveGrades = async () => {
        if (!selectedExam || !selectedClass || !selectedSubject) {
            toast.error('Please select exam, class, and subject')
            return
        }

        setSaving(true)
        try {
            const results = Object.values(grades).map(g => ({
                student_id: g.student_id,
                marks_obtained: g.marks_obtained,
                max_marks: parseInt(maxMarks)
            }))

            const response = await fetch('/api/exams/results', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    school_id: school?.id,
                    exam_id: selectedExam,
                    class_id: selectedClass,
                    subject_id: selectedSubject,
                    results,
                    entered_by: user?.id
                })
            })

            if (!response.ok) throw new Error('Failed to save grades')

            const { count } = await response.json()
            toast.success(`Grades saved for ${count} students!`)
            setExistingGrades(true)
        } catch (error) {
            console.error('Error saving grades:', error)
            toast.error('Failed to save grades')
        } finally {
            setSaving(false)
        }
    }

    const filteredStudents = students.filter((student) =>
        `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.roll_number?.includes(searchQuery)
    )

    const getGrade = (marks: number, max: number) => {
        const percentage = (marks / max) * 100
        if (percentage >= 90) return { grade: 'A+', color: 'text-green-500' }
        if (percentage >= 80) return { grade: 'A', color: 'text-green-500' }
        if (percentage >= 70) return { grade: 'B', color: 'text-blue-500' }
        if (percentage >= 60) return { grade: 'C', color: 'text-yellow-500' }
        if (percentage >= 50) return { grade: 'D', color: 'text-orange-500' }
        if (percentage >= 33) return { grade: 'E', color: 'text-red-400' }
        return { grade: 'F', color: 'text-red-500' }
    }

    // Calculate stats
    const totalStudents = students.length
    const enteredCount = Object.values(grades).filter(g => g.marks_obtained > 0).length
    const avgMarks = totalStudents > 0
        ? (Object.values(grades).reduce((sum, g) => sum + g.marks_obtained, 0) / totalStudents).toFixed(1)
        : 0
    const passCount = Object.values(grades).filter(g => (g.marks_obtained / parseInt(maxMarks)) * 100 >= 33).length

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
                    <h1 className="text-3xl font-bold tracking-tight">Enter Grades</h1>
                    <p className="text-muted-foreground">
                        Enter and manage student exam results
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Button className="gradient-primary" onClick={saveGrades} disabled={saving || !selectedSubject}>
                        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Grades
                    </Button>
                </div>
            </div>

            {existingGrades && (
                <Card className="border-blue-500/50 bg-blue-500/5">
                    <CardContent className="py-3">
                        <div className="flex items-center gap-2 text-blue-600">
                            <FileSpreadsheet className="h-4 w-4" />
                            <span className="text-sm">Existing grades loaded. Saving will update the records.</span>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalStudents}</div>
                        <p className="text-xs text-muted-foreground">In selected class</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Entered</CardTitle>
                        <ClipboardList className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-500">{enteredCount}</div>
                        <p className="text-xs text-muted-foreground">{totalStudents > 0 ? ((enteredCount / totalStudents) * 100).toFixed(0) : 0}% complete</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Average</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{avgMarks}</div>
                        <p className="text-xs text-muted-foreground">Out of {maxMarks}</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
                        <Award className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-500">{totalStudents > 0 ? ((passCount / totalStudents) * 100).toFixed(0) : 0}%</div>
                        <p className="text-xs text-muted-foreground">{passCount} students passed</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="grid gap-4 md:grid-cols-5">
                        <Select value={selectedExam} onValueChange={setSelectedExam}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Exam" />
                            </SelectTrigger>
                            <SelectContent>
                                {exams.map((exam) => (
                                    <SelectItem key={exam.id} value={exam.id}>
                                        {exam.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={selectedClass} onValueChange={setSelectedClass}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent>
                                {classes.map((cls) => (
                                    <SelectItem key={cls.id} value={cls.id}>
                                        {cls.name} {cls.section}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Subject" />
                            </SelectTrigger>
                            <SelectContent>
                                {subjects.map((subject) => (
                                    <SelectItem key={subject.id} value={subject.id}>
                                        {subject.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Input
                            type="number"
                            placeholder="Max Marks"
                            value={maxMarks}
                            onChange={(e) => setMaxMarks(e.target.value)}
                        />
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search student..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Grades Entry Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Enter Marks
                        {selectedSubject && subjects.find(s => s.id === selectedSubject) && (
                            <Badge variant="outline" className="ml-2">
                                {subjects.find(s => s.id === selectedSubject)?.name}
                            </Badge>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {!selectedClass || !selectedSubject ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <ClipboardList className="h-12 w-12 mb-4 opacity-50" />
                            <p>Select exam, class, and subject to enter grades</p>
                        </div>
                    ) : filteredStudents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <Users className="h-12 w-12 mb-4 opacity-50" />
                            <p>No students found in this class</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Roll No</TableHead>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead className="w-[150px]">Marks Obtained</TableHead>
                                    <TableHead className="w-[100px]">Max Marks</TableHead>
                                    <TableHead className="w-[100px]">Percentage</TableHead>
                                    <TableHead className="w-[80px]">Grade</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredStudents.map((student) => {
                                    const marks = grades[student.id]?.marks_obtained || 0
                                    const max = parseInt(maxMarks)
                                    const percentage = max > 0 ? ((marks / max) * 100).toFixed(1) : '0'
                                    const { grade, color } = getGrade(marks, max)

                                    return (
                                        <TableRow key={student.id}>
                                            <TableCell className="font-medium">{student.roll_number}</TableCell>
                                            <TableCell>{student.first_name} {student.last_name}</TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    max={maxMarks}
                                                    value={marks || ''}
                                                    onChange={(e) => updateMarks(student.id, e.target.value)}
                                                    className="w-[100px]"
                                                />
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">{maxMarks}</TableCell>
                                            <TableCell>{percentage}%</TableCell>
                                            <TableCell>
                                                <Badge className={`${color} bg-opacity-10`}>{grade}</Badge>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
