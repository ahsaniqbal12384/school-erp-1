'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
    TrendingUp,
    TrendingDown,
    Award,
    AlertTriangle,
    Download,
    Filter,
    BarChart3,
    Users,
} from 'lucide-react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
} from 'recharts'

const classPerformance = [
    { class: 'Class 10-A', avgScore: 78.5, passRate: 95, topScorer: 'Ahmed Khan', subjects: 8 },
    { class: 'Class 10-B', avgScore: 72.3, passRate: 88, topScorer: 'Fatima Ali', subjects: 8 },
    { class: 'Class 9-A', avgScore: 81.2, passRate: 97, topScorer: 'Hassan Raza', subjects: 8 },
    { class: 'Class 9-B', avgScore: 69.8, passRate: 82, topScorer: 'Zainab Hassan', subjects: 8 },
    { class: 'Class 8-A', avgScore: 75.4, passRate: 91, topScorer: 'Ali Hussain', subjects: 7 },
    { class: 'Class 8-B', avgScore: 73.1, passRate: 89, topScorer: 'Sarah Khan', subjects: 7 },
]

const subjectPerformance = [
    { subject: 'Mathematics', avgScore: 68, passRate: 78, highestScore: 98, lowestScore: 25 },
    { subject: 'English', avgScore: 75, passRate: 88, highestScore: 95, lowestScore: 35 },
    { subject: 'Science', avgScore: 72, passRate: 82, highestScore: 100, lowestScore: 28 },
    { subject: 'Urdu', avgScore: 80, passRate: 92, highestScore: 96, lowestScore: 45 },
    { subject: 'Pakistan Studies', avgScore: 78, passRate: 90, highestScore: 94, lowestScore: 40 },
    { subject: 'Islamiat', avgScore: 82, passRate: 95, highestScore: 97, lowestScore: 50 },
]

const gradeDistribution = [
    { grade: 'A+', count: 45, color: '#22c55e' },
    { grade: 'A', count: 78, color: '#84cc16' },
    { grade: 'B', count: 120, color: '#eab308' },
    { grade: 'C', count: 85, color: '#f97316' },
    { grade: 'D', count: 42, color: '#ef4444' },
    { grade: 'F', count: 15, color: '#dc2626' },
]

const monthlyTrend = [
    { month: 'Sep', avg: 68 },
    { month: 'Oct', avg: 71 },
    { month: 'Nov', avg: 73 },
    { month: 'Dec', avg: 75 },
    { month: 'Jan', avg: 72 },
    { month: 'Feb', avg: 74 },
    { month: 'Mar', avg: 76 },
    { month: 'Apr', avg: 78 },
    { month: 'May', avg: 75 },
]

export default function AcademicReportsPage() {
    const [selectedClass, setSelectedClass] = useState<string>('all')
    const [selectedExam, setSelectedExam] = useState<string>('final')

    const totalStudents = 385
    const passedStudents = 342
    const avgScore = 74.8
    const topPerformers = 45

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Academic Reports</h1>
                    <p className="text-muted-foreground">
                        Comprehensive academic performance analysis
                    </p>
                </div>
                <div className="flex gap-3">
                    <Select value={selectedExam} onValueChange={setSelectedExam}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Select exam" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="midterm">Midterm</SelectItem>
                            <SelectItem value="final">Final Term</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export Report
                    </Button>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalStudents}</div>
                        <p className="text-xs text-muted-foreground">Appeared in exam</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">
                            {((passedStudents / totalStudents) * 100).toFixed(1)}%
                        </div>
                        <p className="text-xs text-muted-foreground">{passedStudents} students passed</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                        <BarChart3 className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgScore}%</div>
                        <div className="flex items-center text-xs text-green-500">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            +2.3% from last term
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
                        <Award className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-500">{topPerformers}</div>
                        <p className="text-xs text-muted-foreground">Scored above 90%</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Subject Performance */}
                <Card>
                    <CardHeader>
                        <CardTitle>Subject-wise Performance</CardTitle>
                        <CardDescription>Average scores by subject</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={subjectPerformance} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                    <XAxis type="number" domain={[0, 100]} />
                                    <YAxis dataKey="subject" type="category" width={100} />
                                    <Tooltip />
                                    <Bar dataKey="avgScore" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Grade Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Grade Distribution</CardTitle>
                        <CardDescription>Students by grade category</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={gradeDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={2}
                                        dataKey="count"
                                        label={({ grade, count }) => `${grade}: ${count}`}
                                    >
                                        {gradeDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Performance Trend */}
            <Card>
                <CardHeader>
                    <CardTitle>Performance Trend</CardTitle>
                    <CardDescription>Average score progression over the academic year</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyTrend}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis domain={[50, 100]} />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="avg"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    dot={{ fill: '#3b82f6' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Class Performance Table */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Class-wise Performance</CardTitle>
                            <CardDescription>Detailed performance breakdown by class</CardDescription>
                        </div>
                        <Select value={selectedClass} onValueChange={setSelectedClass}>
                            <SelectTrigger className="w-[150px]">
                                <Filter className="w-4 h-4 mr-2" />
                                <SelectValue placeholder="Filter class" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Classes</SelectItem>
                                <SelectItem value="10">Class 10</SelectItem>
                                <SelectItem value="9">Class 9</SelectItem>
                                <SelectItem value="8">Class 8</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Class</TableHead>
                                <TableHead>Average Score</TableHead>
                                <TableHead>Pass Rate</TableHead>
                                <TableHead>Top Scorer</TableHead>
                                <TableHead>Subjects</TableHead>
                                <TableHead>Performance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {classPerformance.map((cls) => (
                                <TableRow key={cls.class}>
                                    <TableCell className="font-medium">{cls.class}</TableCell>
                                    <TableCell>{cls.avgScore}%</TableCell>
                                    <TableCell>
                                        <span className={cls.passRate >= 90 ? 'text-green-500' : cls.passRate >= 80 ? 'text-amber-500' : 'text-red-500'}>
                                            {cls.passRate}%
                                        </span>
                                    </TableCell>
                                    <TableCell>{cls.topScorer}</TableCell>
                                    <TableCell>{cls.subjects}</TableCell>
                                    <TableCell>
                                        {cls.avgScore >= 80 ? (
                                            <Badge className="bg-green-500/10 text-green-500">
                                                <TrendingUp className="w-3 h-3 mr-1" />
                                                Excellent
                                            </Badge>
                                        ) : cls.avgScore >= 70 ? (
                                            <Badge className="bg-blue-500/10 text-blue-500">Good</Badge>
                                        ) : (
                                            <Badge className="bg-amber-500/10 text-amber-500">
                                                <AlertTriangle className="w-3 h-3 mr-1" />
                                                Needs Attention
                                            </Badge>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Subject Details Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Subject Analysis</CardTitle>
                    <CardDescription>Detailed subject-wise breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Subject</TableHead>
                                <TableHead>Average Score</TableHead>
                                <TableHead>Pass Rate</TableHead>
                                <TableHead>Highest</TableHead>
                                <TableHead>Lowest</TableHead>
                                <TableHead>Difficulty</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {subjectPerformance.map((subject) => (
                                <TableRow key={subject.subject}>
                                    <TableCell className="font-medium">{subject.subject}</TableCell>
                                    <TableCell>{subject.avgScore}%</TableCell>
                                    <TableCell>{subject.passRate}%</TableCell>
                                    <TableCell className="text-green-500">{subject.highestScore}</TableCell>
                                    <TableCell className="text-red-500">{subject.lowestScore}</TableCell>
                                    <TableCell>
                                        {subject.avgScore < 70 ? (
                                            <Badge variant="destructive">Hard</Badge>
                                        ) : subject.avgScore < 80 ? (
                                            <Badge variant="secondary">Moderate</Badge>
                                        ) : (
                                            <Badge className="bg-green-500/10 text-green-500">Easy</Badge>
                                        )}
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
