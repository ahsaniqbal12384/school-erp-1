'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
    GraduationCap,
    Download,
    TrendingUp,
    Award,
    BookOpen,
    BarChart3,
    Medal,
    FileText,
} from 'lucide-react'

interface SubjectResult {
    subject: string
    obtained: number
    total: number
    grade: string
    percentage: number
}

interface ExamResult {
    id: string
    examName: string
    examType: 'terminal' | 'midterm' | 'final'
    date: string
    childName: string
    class: string
    subjects: SubjectResult[]
    totalObtained: number
    totalMarks: number
    percentage: number
    grade: string
    rank: number
    totalStudents: number
}

const sampleResults: ExamResult[] = [
    {
        id: '1',
        examName: 'First Terminal Examination',
        examType: 'terminal',
        date: '2024-01-15',
        childName: 'Ahmed Khan',
        class: 'Class 10-A',
        subjects: [
            { subject: 'Mathematics', obtained: 88, total: 100, grade: 'A', percentage: 88 },
            { subject: 'English', obtained: 82, total: 100, grade: 'A', percentage: 82 },
            { subject: 'Physics', obtained: 85, total: 100, grade: 'A', percentage: 85 },
            { subject: 'Chemistry', obtained: 78, total: 100, grade: 'B+', percentage: 78 },
            { subject: 'Urdu', obtained: 90, total: 100, grade: 'A+', percentage: 90 },
            { subject: 'Islamiat', obtained: 92, total: 100, grade: 'A+', percentage: 92 },
            { subject: 'Computer', obtained: 95, total: 100, grade: 'A+', percentage: 95 },
        ],
        totalObtained: 610,
        totalMarks: 700,
        percentage: 87.14,
        grade: 'A',
        rank: 5,
        totalStudents: 35,
    },
    {
        id: '2',
        examName: 'First Terminal Examination',
        examType: 'terminal',
        date: '2024-01-15',
        childName: 'Fatima Khan',
        class: 'Class 7-B',
        subjects: [
            { subject: 'Mathematics', obtained: 95, total: 100, grade: 'A+', percentage: 95 },
            { subject: 'English', obtained: 92, total: 100, grade: 'A+', percentage: 92 },
            { subject: 'Science', obtained: 88, total: 100, grade: 'A', percentage: 88 },
            { subject: 'Urdu', obtained: 94, total: 100, grade: 'A+', percentage: 94 },
            { subject: 'Islamiat', obtained: 96, total: 100, grade: 'A+', percentage: 96 },
            { subject: 'Social Studies', obtained: 90, total: 100, grade: 'A+', percentage: 90 },
        ],
        totalObtained: 555,
        totalMarks: 600,
        percentage: 92.5,
        grade: 'A+',
        rank: 2,
        totalStudents: 38,
    },
]

export default function PortalResultsPage() {
    const [results] = useState<ExamResult[]>(sampleResults)
    const [selectedChild, setSelectedChild] = useState<string>('all')
    const [selectedExam, setSelectedExam] = useState<string>('all')

    const filteredResults = results.filter((result) => {
        const matchesChild = selectedChild === 'all' || result.childName === selectedChild
        return matchesChild
    })

    const getGradeColor = (grade: string) => {
        if (grade.includes('A+')) return 'bg-green-500'
        if (grade.includes('A')) return 'bg-blue-500'
        if (grade.includes('B')) return 'bg-yellow-500'
        return 'bg-gray-500'
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Exam Results</h1>
                    <p className="text-muted-foreground">
                        View your children&apos;s examination results
                    </p>
                </div>
                <div className="flex gap-3">
                    <Select value={selectedChild} onValueChange={setSelectedChild}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select child" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Children</SelectItem>
                            <SelectItem value="Ahmed Khan">Ahmed Khan</SelectItem>
                            <SelectItem value="Fatima Khan">Fatima Khan</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={selectedExam} onValueChange={setSelectedExam}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Exam" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Exams</SelectItem>
                            <SelectItem value="terminal1">First Terminal</SelectItem>
                            <SelectItem value="midterm">Mid-Term</SelectItem>
                            <SelectItem value="final">Final</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Best Performer</CardTitle>
                        <Award className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold">Fatima Khan</div>
                        <p className="text-xs text-muted-foreground">92.5% average</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Highest Score</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">96%</div>
                        <p className="text-xs text-muted-foreground">Islamiat - Fatima</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Class Rank</CardTitle>
                        <Medal className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">#2 & #5</div>
                        <p className="text-xs text-muted-foreground">Fatima & Ahmed</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Improvement</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">+5%</div>
                        <p className="text-xs text-muted-foreground">vs previous exam</p>
                    </CardContent>
                </Card>
            </div>

            {/* Results Cards */}
            {filteredResults.map((result) => (
                <Card key={result.id}>
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                    <GraduationCap className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <CardTitle>{result.childName}</CardTitle>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="outline">{result.class}</Badge>
                                        <span className="text-sm text-muted-foreground">{result.examName}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <Badge className={getGradeColor(result.grade) + ' text-white text-lg px-3 py-1'}>
                                    {result.grade}
                                </Badge>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Rank: #{result.rank} of {result.totalStudents}
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Summary Stats */}
                        <div className="grid grid-cols-4 gap-4 p-4 rounded-lg bg-muted/50">
                            <div className="text-center">
                                <p className="text-2xl font-bold">{result.totalObtained}</p>
                                <p className="text-xs text-muted-foreground">Marks Obtained</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold">{result.totalMarks}</p>
                                <p className="text-xs text-muted-foreground">Total Marks</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-primary">{result.percentage.toFixed(1)}%</p>
                                <p className="text-xs text-muted-foreground">Percentage</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold">#{result.rank}</p>
                                <p className="text-xs text-muted-foreground">Class Rank</p>
                            </div>
                        </div>

                        {/* Subject-wise Results */}
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Subject</TableHead>
                                    <TableHead className="text-center">Obtained</TableHead>
                                    <TableHead className="text-center">Total</TableHead>
                                    <TableHead className="text-center">Percentage</TableHead>
                                    <TableHead className="text-center">Grade</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {result.subjects.map((subject, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                                {subject.subject}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center font-medium">{subject.obtained}</TableCell>
                                        <TableCell className="text-center text-muted-foreground">{subject.total}</TableCell>
                                        <TableCell className="text-center">
                                            <span className={subject.percentage >= 80 ? 'text-green-500' : subject.percentage >= 60 ? 'text-yellow-500' : 'text-red-500'}>
                                                {subject.percentage}%
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge className={getGradeColor(subject.grade) + ' text-white'}>
                                                {subject.grade}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {/* Download Button */}
                        <div className="flex justify-end pt-2">
                            <Button variant="outline">
                                <Download className="mr-2 h-4 w-4" />
                                Download Report Card
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
