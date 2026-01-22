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
    Layers,
    Plus,
    Search,
    Users,
    User,
    Edit,
    MoreHorizontal,
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Section {
    id: string
    name: string
    class: string
    classTeacher: string
    students: number
    capacity: number
    room: string
    status: 'active' | 'inactive'
}

const sampleSections: Section[] = [
    { id: '1', name: 'Section A', class: 'Class 1', classTeacher: 'Mrs. Fatima Khan', students: 35, capacity: 40, room: 'Room 101', status: 'active' },
    { id: '2', name: 'Section B', class: 'Class 1', classTeacher: 'Mrs. Sara Ali', students: 32, capacity: 40, room: 'Room 102', status: 'active' },
    { id: '3', name: 'Section A', class: 'Class 5', classTeacher: 'Mr. Ahmad Shah', students: 42, capacity: 45, room: 'Room 106', status: 'active' },
    { id: '4', name: 'Section B', class: 'Class 5', classTeacher: 'Mrs. Nadia Iqbal', students: 38, capacity: 45, room: 'Room 107', status: 'active' },
    { id: '5', name: 'Section A', class: 'Class 9', classTeacher: 'Mr. Imran Ali', students: 45, capacity: 50, room: 'Room 301', status: 'active' },
    { id: '6', name: 'Section B', class: 'Class 9', classTeacher: 'Mr. Bilal Ahmed', students: 42, capacity: 50, room: 'Room 302', status: 'active' },
    { id: '7', name: 'Section A', class: 'Class 10', classTeacher: 'Dr. Hassan Raza', students: 42, capacity: 50, room: 'Room 303', status: 'active' },
    { id: '8', name: 'Section B', class: 'Class 10', classTeacher: 'Mrs. Ayesha Khan', students: 40, capacity: 50, room: 'Room 304', status: 'active' },
]

export default function SectionsPage() {
    const [sections] = useState<Section[]>(sampleSections)
    const [searchQuery, setSearchQuery] = useState('')
    const [classFilter, setClassFilter] = useState<string>('all')
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

    const filteredSections = sections.filter((section) => {
        const matchesSearch =
            section.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            section.classTeacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
            section.class.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesClass = classFilter === 'all' || section.class === classFilter
        return matchesSearch && matchesClass
    })

    const totalSections = sections.length
    const totalStudents = sections.reduce((acc, s) => acc + s.students, 0)
    const totalCapacity = sections.reduce((acc, s) => acc + s.capacity, 0)

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Sections Management</h1>
                    <p className="text-muted-foreground">
                        Manage class sections and assignments
                    </p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gradient-primary">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Section
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Section</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Class</Label>
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
                                    <Label>Section Name</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select section" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="A">Section A</SelectItem>
                                            <SelectItem value="B">Section B</SelectItem>
                                            <SelectItem value="C">Section C</SelectItem>
                                            <SelectItem value="D">Section D</SelectItem>
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
                                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                                <Button className="gradient-primary" onClick={() => setIsAddDialogOpen(false)}>Add Section</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Sections</CardTitle>
                        <Layers className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalSections}</div>
                        <p className="text-xs text-muted-foreground">Active sections</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-500">{totalStudents}</div>
                        <p className="text-xs text-muted-foreground">Enrolled</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Capacity Used</CardTitle>
                        <Layers className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{Math.round((totalStudents / totalCapacity) * 100)}%</div>
                        <p className="text-xs text-muted-foreground">{totalStudents}/{totalCapacity} seats</p>
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
                                placeholder="Search sections..."
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
                                <SelectItem value="Class 1">Class 1</SelectItem>
                                <SelectItem value="Class 5">Class 5</SelectItem>
                                <SelectItem value="Class 9">Class 9</SelectItem>
                                <SelectItem value="Class 10">Class 10</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Sections Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Layers className="h-5 w-5" />
                        All Sections
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Section</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Class Teacher</TableHead>
                                <TableHead>Room</TableHead>
                                <TableHead className="text-center">Students</TableHead>
                                <TableHead className="text-center">Capacity</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredSections.map((section) => (
                                <TableRow key={section.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                                <Layers className="h-5 w-5 text-primary" />
                                            </div>
                                            <span className="font-medium">{section.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{section.class}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            {section.classTeacher}
                                        </div>
                                    </TableCell>
                                    <TableCell>{section.room}</TableCell>
                                    <TableCell className="text-center font-medium">{section.students}</TableCell>
                                    <TableCell className="text-center">{section.capacity}</TableCell>
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
                                                    <Users className="mr-2 h-4 w-4" />
                                                    View Students
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit Section
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
