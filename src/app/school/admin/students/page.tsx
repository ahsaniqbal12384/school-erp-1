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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    GraduationCap,
    Plus,
    Search,
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
    Users,
    Phone,
    Mail,
    Download,
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Student {
    id: string
    rollNo: string
    name: string
    fatherName: string
    class: string
    section: string
    gender: 'male' | 'female'
    phone: string
    email?: string
    status: 'active' | 'inactive' | 'transferred'
    admissionDate: string
}

const sampleStudents: Student[] = [
    { id: '1', rollNo: '1001', name: 'Ahmed Khan', fatherName: 'Muhammad Khan', class: 'Class 10', section: 'A', gender: 'male', phone: '+92-300-1234567', email: 'ahmed@gmail.com', status: 'active', admissionDate: '2021-04-01' },
    { id: '2', rollNo: '1002', name: 'Fatima Ali', fatherName: 'Hassan Ali', class: 'Class 10', section: 'A', gender: 'female', phone: '+92-300-2345678', email: 'fatima@gmail.com', status: 'active', admissionDate: '2021-04-01' },
    { id: '3', rollNo: '1003', name: 'Hassan Raza', fatherName: 'Ahmad Raza', class: 'Class 10', section: 'A', gender: 'male', phone: '+92-300-3456789', status: 'active', admissionDate: '2021-04-01' },
    { id: '4', rollNo: '1004', name: 'Sara Ahmed', fatherName: 'Imran Ahmed', class: 'Class 10', section: 'B', gender: 'female', phone: '+92-300-4567890', email: 'sara@gmail.com', status: 'active', admissionDate: '2021-04-01' },
    { id: '5', rollNo: '1005', name: 'Usman Tariq', fatherName: 'Tariq Mahmood', class: 'Class 9', section: 'A', gender: 'male', phone: '+92-300-5678901', status: 'active', admissionDate: '2022-04-01' },
    { id: '6', rollNo: '1006', name: 'Ayesha Malik', fatherName: 'Asad Malik', class: 'Class 9', section: 'A', gender: 'female', phone: '+92-300-6789012', email: 'ayesha@gmail.com', status: 'active', admissionDate: '2022-04-01' },
    { id: '7', rollNo: '1007', name: 'Ali Hassan', fatherName: 'Hassan Shah', class: 'Class 9', section: 'B', gender: 'male', phone: '+92-300-7890123', status: 'inactive', admissionDate: '2022-04-01' },
    { id: '8', rollNo: '1008', name: 'Zainab Shah', fatherName: 'Nasir Shah', class: 'Class 8', section: 'A', gender: 'female', phone: '+92-300-8901234', email: 'zainab@gmail.com', status: 'active', admissionDate: '2023-04-01' },
    { id: '9', rollNo: '1009', name: 'Bilal Ahmed', fatherName: 'Khalid Ahmed', class: 'Class 8', section: 'A', gender: 'male', phone: '+92-300-9012345', status: 'active', admissionDate: '2023-04-01' },
    { id: '10', rollNo: '1010', name: 'Maryam Khan', fatherName: 'Saleem Khan', class: 'Class 8', section: 'B', gender: 'female', phone: '+92-300-0123456', status: 'transferred', admissionDate: '2023-04-01' },
]

export default function StudentsPage() {
    const [students] = useState<Student[]>(sampleStudents)
    const [searchQuery, setSearchQuery] = useState('')
    const [classFilter, setClassFilter] = useState<string>('all')
    const [statusFilter, setStatusFilter] = useState<string>('all')

    const filteredStudents = students.filter((student) => {
        const matchesSearch =
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.rollNo.includes(searchQuery) ||
            student.fatherName.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesClass = classFilter === 'all' || `${student.class}-${student.section}` === classFilter
        const matchesStatus = statusFilter === 'all' || student.status === statusFilter
        return matchesSearch && matchesClass && matchesStatus
    })

    const totalStudents = students.length
    const activeStudents = students.filter((s) => s.status === 'active').length
    const maleStudents = students.filter((s) => s.gender === 'male').length
    const femaleStudents = students.filter((s) => s.gender === 'female').length

    const getStatusBadge = (status: Student['status']) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-500/10 text-green-500">Active</Badge>
            case 'inactive':
                return <Badge className="bg-yellow-500/10 text-yellow-500">Inactive</Badge>
            case 'transferred':
                return <Badge className="bg-gray-500/10 text-gray-500">Transferred</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">All Students</h1>
                    <p className="text-muted-foreground">
                        Manage student records and information
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Button className="gradient-primary">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Student
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalStudents}</div>
                        <p className="text-xs text-muted-foreground">Enrolled students</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Active</CardTitle>
                        <Users className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{activeStudents}</div>
                        <p className="text-xs text-muted-foreground">Currently studying</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Male</CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-500">{maleStudents}</div>
                        <p className="text-xs text-muted-foreground">{((maleStudents / totalStudents) * 100).toFixed(0)}% of total</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Female</CardTitle>
                        <Users className="h-4 w-4 text-pink-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-pink-500">{femaleStudents}</div>
                        <p className="text-xs text-muted-foreground">{((femaleStudents / totalStudents) * 100).toFixed(0)}% of total</p>
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
                                placeholder="Search by name, roll no, or father's name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={classFilter} onValueChange={setClassFilter}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Class" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Classes</SelectItem>
                                <SelectItem value="Class 10-A">Class 10-A</SelectItem>
                                <SelectItem value="Class 10-B">Class 10-B</SelectItem>
                                <SelectItem value="Class 9-A">Class 9-A</SelectItem>
                                <SelectItem value="Class 9-B">Class 9-B</SelectItem>
                                <SelectItem value="Class 8-A">Class 8-A</SelectItem>
                                <SelectItem value="Class 8-B">Class 8-B</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="transferred">Transferred</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Students Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        Student Records
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Roll No</TableHead>
                                <TableHead>Student Name</TableHead>
                                <TableHead>Father&apos;s Name</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStudents.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell className="font-medium">{student.rollNo}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${student.gender === 'male' ? 'bg-blue-500/10' : 'bg-pink-500/10'
                                                }`}>
                                                <GraduationCap className={`h-4 w-4 ${student.gender === 'male' ? 'text-blue-500' : 'text-pink-500'
                                                    }`} />
                                            </div>
                                            <span>{student.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{student.fatherName}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{student.class} - {student.section}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <p className="flex items-center gap-1">
                                                <Phone className="h-3 w-3 text-muted-foreground" />
                                                {student.phone}
                                            </p>
                                            {student.email && (
                                                <p className="flex items-center gap-1 text-muted-foreground">
                                                    <Mail className="h-3 w-3" />
                                                    {student.email}
                                                </p>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(student.status)}</TableCell>
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
                                                    View Profile
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
        </div>
    )
}
