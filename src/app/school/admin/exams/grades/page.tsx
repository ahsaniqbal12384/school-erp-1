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
} from 'lucide-react'

interface StudentGrade {
    id: string
    rollNo: string
    name: string
    math: number | null
    english: number | null
    physics: number | null
    chemistry: number | null
    urdu: number | null
    islamiat: number | null
    total: number
    percentage: number
    grade: string
    rank: number
}

const sampleGrades: StudentGrade[] = [
    { id: '1', rollNo: '1001', name: 'Ahmed Khan', math: 88, english: 82, physics: 85, chemistry: 78, urdu: 90, islamiat: 92, total: 515, percentage: 85.8, grade: 'A', rank: 5 },
    { id: '2', rollNo: '1002', name: 'Fatima Ali', math: 95, english: 92, physics: 88, chemistry: 90, urdu: 94, islamiat: 96, total: 555, percentage: 92.5, grade: 'A+', rank: 2 },
    { id: '3', rollNo: '1003', name: 'Hassan Raza', math: 72, english: 68, physics: 70, chemistry: 65, urdu: 75, islamiat: 80, total: 430, percentage: 71.7, grade: 'B', rank: 12 },
    { id: '4', rollNo: '1004', name: 'Sara Ahmed', math: 90, english: 88, physics: 92, chemistry: 85, urdu: 88, islamiat: 90, total: 533, percentage: 88.8, grade: 'A', rank: 4 },
    { id: '5', rollNo: '1005', name: 'Usman Tariq', math: 78, english: 75, physics: 80, chemistry: 72, urdu: 82, islamiat: 85, total: 472, percentage: 78.7, grade: 'B+', rank: 8 },
    { id: '6', rollNo: '1006', name: 'Ayesha Malik', math: 98, english: 95, physics: 96, chemistry: 94, urdu: 97, islamiat: 98, total: 578, percentage: 96.3, grade: 'A+', rank: 1 },
    { id: '7', rollNo: '1007', name: 'Ali Hassan', math: 75, english: 72, physics: 78, chemistry: 70, urdu: 80, islamiat: 82, total: 457, percentage: 76.2, grade: 'B+', rank: 10 },
    { id: '8', rollNo: '1008', name: 'Zainab Shah', math: 92, english: 90, physics: 88, chemistry: 85, urdu: 92, islamiat: 94, total: 541, percentage: 90.2, grade: 'A+', rank: 3 },
]

export default function GradesPage() {
    const [grades] = useState<StudentGrade[]>(sampleGrades)
    const [selectedClass, setSelectedClass] = useState<string>('10-A')
    const [selectedExam, setSelectedExam] = useState<string>('terminal1')
    const [searchQuery, setSearchQuery] = useState('')

    const filteredGrades = grades.filter((student) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.rollNo.includes(searchQuery)
    )

    const classAverage = Math.round(grades.reduce((acc, s) => acc + s.percentage, 0) / grades.length)
    const topPerformer = grades.reduce((a, b) => (a.total > b.total ? a : b))
    const aGradeCount = grades.filter((s) => s.grade.startsWith('A')).length

    const getGradeBadge = (grade: string) => {
        if (grade === 'A+') return <Badge className="bg-green-500 text-white">A+</Badge>
        if (grade === 'A') return <Badge className="bg-blue-500 text-white">A</Badge>
        if (grade === 'B+') return <Badge className="bg-yellow-500 text-white">B+</Badge>
        if (grade === 'B') return <Badge className="bg-orange-500 text-white">B</Badge>
        return <Badge variant="outline">{grade}</Badge>
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gradebook</h1>
                    <p className="text-muted-foreground">
                        View and manage student grades for exams
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export Grades
                    </Button>
                    <Button className="gradient-primary">
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{grades.length}</div>
                        <p className="text-xs text-muted-foreground">In this class</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Class Average</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{classAverage}%</div>
                        <p className="text-xs text-muted-foreground">Overall performance</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
                        <Award className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-bold">{topPerformer.name}</div>
                        <p className="text-xs text-muted-foreground">{topPerformer.percentage}%</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">A Grade Students</CardTitle>
                        <BookOpen className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{aGradeCount}</div>
                        <p className="text-xs text-muted-foreground">{((aGradeCount / grades.length) * 100).toFixed(0)}% of class</p>
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
                        <Select value={selectedExam} onValueChange={setSelectedExam}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Exam" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="terminal1">First Terminal</SelectItem>
                                <SelectItem value="midterm">Mid-Term</SelectItem>
                                <SelectItem value="terminal2">Second Terminal</SelectItem>
                                <SelectItem value="final">Final</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Grades Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ClipboardList className="h-5 w-5" />
                        Class 10-A - First Terminal Results
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[60px]">Rank</TableHead>
                                    <TableHead className="w-[80px]">Roll No</TableHead>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead className="text-center">Math<br /><span className="text-xs font-normal">(100)</span></TableHead>
                                    <TableHead className="text-center">English<br /><span className="text-xs font-normal">(100)</span></TableHead>
                                    <TableHead className="text-center">Physics<br /><span className="text-xs font-normal">(100)</span></TableHead>
                                    <TableHead className="text-center">Chemistry<br /><span className="text-xs font-normal">(100)</span></TableHead>
                                    <TableHead className="text-center">Urdu<br /><span className="text-xs font-normal">(100)</span></TableHead>
                                    <TableHead className="text-center">Islamiat<br /><span className="text-xs font-normal">(100)</span></TableHead>
                                    <TableHead className="text-center">Total<br /><span className="text-xs font-normal">(600)</span></TableHead>
                                    <TableHead className="text-center">%</TableHead>
                                    <TableHead className="text-center">Grade</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredGrades.sort((a, b) => a.rank - b.rank).map((student) => (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-bold text-center">
                                            {student.rank <= 3 ? (
                                                <Badge className={student.rank === 1 ? 'bg-yellow-500' : student.rank === 2 ? 'bg-gray-400' : 'bg-orange-400'}>
                                                    #{student.rank}
                                                </Badge>
                                            ) : (
                                                `#${student.rank}`
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">{student.rollNo}</TableCell>
                                        <TableCell>{student.name}</TableCell>
                                        <TableCell className="text-center">{student.math}</TableCell>
                                        <TableCell className="text-center">{student.english}</TableCell>
                                        <TableCell className="text-center">{student.physics}</TableCell>
                                        <TableCell className="text-center">{student.chemistry}</TableCell>
                                        <TableCell className="text-center">{student.urdu}</TableCell>
                                        <TableCell className="text-center">{student.islamiat}</TableCell>
                                        <TableCell className="text-center font-bold">{student.total}</TableCell>
                                        <TableCell className="text-center font-medium">{student.percentage.toFixed(1)}%</TableCell>
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
