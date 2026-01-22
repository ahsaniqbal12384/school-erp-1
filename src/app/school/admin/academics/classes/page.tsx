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
import {
    Building2,
    Plus,
    Search,
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
    Users,
    GraduationCap,
    User,
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ClassInfo {
    id: string
    name: string
    section: string
    classTeacher: string
    students: number
    capacity: number
    room: string
    subjects: number
    status: 'active' | 'inactive'
}

const sampleClasses: ClassInfo[] = [
    { id: '1', name: 'Class 1', section: 'A', classTeacher: 'Mrs. Fatima Khan', students: 35, capacity: 40, room: 'Room 101', subjects: 6, status: 'active' },
    { id: '2', name: 'Class 1', section: 'B', classTeacher: 'Mrs. Sara Ali', students: 32, capacity: 40, room: 'Room 102', subjects: 6, status: 'active' },
    { id: '3', name: 'Class 2', section: 'A', classTeacher: 'Mrs. Ayesha Malik', students: 38, capacity: 40, room: 'Room 103', subjects: 7, status: 'active' },
    { id: '4', name: 'Class 3', section: 'A', classTeacher: 'Mr. Hassan Raza', students: 40, capacity: 45, room: 'Room 104', subjects: 7, status: 'active' },
    { id: '5', name: 'Class 4', section: 'A', classTeacher: 'Mrs. Zainab Shah', students: 36, capacity: 40, room: 'Room 105', subjects: 8, status: 'active' },
    { id: '6', name: 'Class 5', section: 'A', classTeacher: 'Mr. Ahmad Shah', students: 42, capacity: 45, room: 'Room 106', subjects: 8, status: 'active' },
    { id: '7', name: 'Class 6', section: 'A', classTeacher: 'Mrs. Nadia Iqbal', students: 38, capacity: 40, room: 'Room 201', subjects: 9, status: 'active' },
    { id: '8', name: 'Class 7', section: 'A', classTeacher: 'Mr. Usman Tariq', students: 35, capacity: 40, room: 'Room 202', subjects: 9, status: 'active' },
    { id: '9', name: 'Class 8', section: 'A', classTeacher: 'Dr. Sana Malik', students: 40, capacity: 45, room: 'Room 203', subjects: 10, status: 'active' },
    { id: '10', name: 'Class 9', section: 'A', classTeacher: 'Mr. Imran Ali', students: 45, capacity: 50, room: 'Room 301', subjects: 10, status: 'active' },
    { id: '11', name: 'Class 9', section: 'B', classTeacher: 'Mr. Bilal Ahmed', students: 42, capacity: 50, room: 'Room 302', subjects: 10, status: 'active' },
    { id: '12', name: 'Class 10', section: 'A', classTeacher: 'Dr. Hassan Raza', students: 42, capacity: 50, room: 'Room 303', subjects: 10, status: 'active' },
    { id: '13', name: 'Class 10', section: 'B', classTeacher: 'Mrs. Ayesha Khan', students: 40, capacity: 50, room: 'Room 304', subjects: 10, status: 'active' },
]

export default function ClassesPage() {
    const [classes] = useState<ClassInfo[]>(sampleClasses)
    const [searchQuery, setSearchQuery] = useState('')
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

    const filteredClasses = classes.filter((cls) =>
        `${cls.name} ${cls.section}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.classTeacher.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const totalClasses = classes.length
    const totalStudents = classes.reduce((acc, c) => acc + c.students, 0)
    const totalCapacity = classes.reduce((acc, c) => acc + c.capacity, 0)
    const avgClassSize = Math.round(totalStudents / totalClasses)

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Classes Management</h1>
                    <p className="text-muted-foreground">
                        Manage classes, sections, and class teachers
                    </p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gradient-primary">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Class
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Class</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Class Name</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select class" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[...Array(10)].map((_, i) => (
                                                <SelectItem key={i} value={`${i + 1}`}>Class {i + 1}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Section</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select section" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="A">Section A</SelectItem>
                                            <SelectItem value="B">Section B</SelectItem>
                                            <SelectItem value="C">Section C</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Class Teacher</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Assign class teacher" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="t1">Mr. Imran Ali</SelectItem>
                                        <SelectItem value="t2">Dr. Sana Malik</SelectItem>
                                        <SelectItem value="t3">Mrs. Ayesha Khan</SelectItem>
                                        <SelectItem value="t4">Mr. Hassan Raza</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Room Number</Label>
                                    <Input placeholder="e.g., Room 101" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Capacity</Label>
                                    <Input type="number" placeholder="40" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button className="gradient-primary" onClick={() => setIsAddDialogOpen(false)}>
                                    Add Class
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
                        <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalClasses}</div>
                        <p className="text-xs text-muted-foreground">Active classes</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalStudents}</div>
                        <p className="text-xs text-muted-foreground">Enrolled</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Avg Class Size</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgClassSize}</div>
                        <p className="text-xs text-muted-foreground">Students per class</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Capacity Used</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{Math.round((totalStudents / totalCapacity) * 100)}%</div>
                        <p className="text-xs text-muted-foreground">{totalStudents}/{totalCapacity} seats</p>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search classes or teachers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Classes Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        All Classes
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Class</TableHead>
                                <TableHead>Class Teacher</TableHead>
                                <TableHead>Room</TableHead>
                                <TableHead className="text-center">Students</TableHead>
                                <TableHead className="text-center">Capacity</TableHead>
                                <TableHead className="text-center">Subjects</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredClasses.map((cls) => (
                                <TableRow key={cls.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                                <Building2 className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <span className="font-medium">{cls.name} - {cls.section}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            {cls.classTeacher}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{cls.room}</Badge>
                                    </TableCell>
                                    <TableCell className="text-center font-medium">{cls.students}</TableCell>
                                    <TableCell className="text-center">{cls.capacity}</TableCell>
                                    <TableCell className="text-center">{cls.subjects}</TableCell>
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
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Students
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit Class
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Users className="mr-2 h-4 w-4" />
                                                    Assign Teachers
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
