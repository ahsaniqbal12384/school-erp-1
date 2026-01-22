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
    BookOpen,
    Search,
    Plus,
    Edit,
    MoreHorizontal,
    GraduationCap,
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Subject {
    id: string
    code: string
    name: string
    type: 'compulsory' | 'elective' | 'optional'
    classes: string[]
    teacher: string
    periodsPerWeek: number
    status: 'active' | 'inactive'
}

const sampleSubjects: Subject[] = [
    { id: '1', code: 'ENG-101', name: 'English', type: 'compulsory', classes: ['Class 1-10'], teacher: 'Mrs. Ayesha Khan', periodsPerWeek: 6, status: 'active' },
    { id: '2', code: 'MATH-101', name: 'Mathematics', type: 'compulsory', classes: ['Class 1-10'], teacher: 'Mr. Hassan Raza', periodsPerWeek: 6, status: 'active' },
    { id: '3', code: 'URDU-101', name: 'Urdu', type: 'compulsory', classes: ['Class 1-10'], teacher: 'Mr. Ahmad Shah', periodsPerWeek: 5, status: 'active' },
    { id: '4', code: 'SCI-101', name: 'General Science', type: 'compulsory', classes: ['Class 1-8'], teacher: 'Dr. Sana Malik', periodsPerWeek: 5, status: 'active' },
    { id: '5', code: 'PHY-101', name: 'Physics', type: 'compulsory', classes: ['Class 9-10'], teacher: 'Dr. Shah Nawaz', periodsPerWeek: 6, status: 'active' },
    { id: '6', code: 'CHEM-101', name: 'Chemistry', type: 'compulsory', classes: ['Class 9-10'], teacher: 'Dr. Saleem Raza', periodsPerWeek: 5, status: 'active' },
    { id: '7', code: 'BIO-101', name: 'Biology', type: 'elective', classes: ['Class 9-10'], teacher: 'Dr. Fatima Awan', periodsPerWeek: 5, status: 'active' },
    { id: '8', code: 'COMP-101', name: 'Computer Science', type: 'elective', classes: ['Class 6-10'], teacher: 'Mr. Usman Khan', periodsPerWeek: 4, status: 'active' },
    { id: '9', code: 'ISL-101', name: 'Islamiyat', type: 'compulsory', classes: ['Class 1-10'], teacher: 'Dr. Ahmad Raza', periodsPerWeek: 3, status: 'active' },
    { id: '10', code: 'PAK-101', name: 'Pakistan Studies', type: 'compulsory', classes: ['Class 9-10'], teacher: 'Dr. Hassan Ali', periodsPerWeek: 3, status: 'active' },
]

export default function SubjectsPage() {
    const [subjects] = useState<Subject[]>(sampleSubjects)
    const [searchQuery, setSearchQuery] = useState('')
    const [typeFilter, setTypeFilter] = useState<string>('all')

    const filteredSubjects = subjects.filter((subject) => {
        const matchesSearch =
            subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            subject.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            subject.teacher.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesType = typeFilter === 'all' || subject.type === typeFilter
        return matchesSearch && matchesType
    })

    const getTypeBadge = (type: Subject['type']) => {
        switch (type) {
            case 'compulsory':
                return <Badge className="bg-blue-500/10 text-blue-500">Compulsory</Badge>
            case 'elective':
                return <Badge className="bg-purple-500/10 text-purple-500">Elective</Badge>
            case 'optional':
                return <Badge className="bg-gray-500/10 text-gray-500">Optional</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Subjects Management</h1>
                    <p className="text-muted-foreground">
                        Manage academic subjects and curriculum
                    </p>
                </div>
                <Button className="gradient-primary">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Subject
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{subjects.length}</div>
                        <p className="text-xs text-muted-foreground">Active subjects</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Compulsory</CardTitle>
                        <BookOpen className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-500">
                            {subjects.filter((s) => s.type === 'compulsory').length}
                        </div>
                        <p className="text-xs text-muted-foreground">Required for all</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Elective</CardTitle>
                        <GraduationCap className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-500">
                            {subjects.filter((s) => s.type === 'elective').length}
                        </div>
                        <p className="text-xs text-muted-foreground">Optional choices</p>
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
                                placeholder="Search subjects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="compulsory">Compulsory</SelectItem>
                                <SelectItem value="elective">Elective</SelectItem>
                                <SelectItem value="optional">Optional</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Subjects Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        All Subjects
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Code</TableHead>
                                <TableHead>Subject Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Classes</TableHead>
                                <TableHead>Teacher</TableHead>
                                <TableHead className="text-center">Periods/Week</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredSubjects.map((subject) => (
                                <TableRow key={subject.id}>
                                    <TableCell className="font-mono text-sm">{subject.code}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                                <BookOpen className="h-4 w-4 text-primary" />
                                            </div>
                                            <span className="font-medium">{subject.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{getTypeBadge(subject.type)}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{subject.classes.join(', ')}</Badge>
                                    </TableCell>
                                    <TableCell>{subject.teacher}</TableCell>
                                    <TableCell className="text-center">{subject.periodsPerWeek}</TableCell>
                                    <TableCell>
                                        <Badge className="bg-green-500/10 text-green-500">Active</Badge>
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
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <GraduationCap className="mr-2 h-4 w-4" />
                                                    Assign Teachers
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
