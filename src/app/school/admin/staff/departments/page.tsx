'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { Textarea } from '@/components/ui/textarea'
import {
    Building2,
    Plus,
    Edit,
    Trash2,
    Users,
    MoreHorizontal,
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Department {
    id: string
    name: string
    description: string
    headName: string
    staffCount: number
    isActive: boolean
}

const sampleDepartments: Department[] = [
    { id: '1', name: 'Teaching', description: 'All teaching staff including teachers and professors', headName: 'Dr. Sana Malik', staffCount: 45, isActive: true },
    { id: '2', name: 'Administration', description: 'Administrative and management staff', headName: 'Mr. Usman Khan', staffCount: 12, isActive: true },
    { id: '3', name: 'Finance', description: 'Accounting and finance department', headName: 'Mrs. Zainab Ali', staffCount: 5, isActive: true },
    { id: '4', name: 'IT & Technical', description: 'IT support and technical staff', headName: 'Mr. Bilal Ahmed', staffCount: 4, isActive: true },
    { id: '5', name: 'Support Staff', description: 'Maintenance, security, and other support', headName: 'Mr. Aslam Pervez', staffCount: 15, isActive: true },
    { id: '6', name: 'Library', description: 'Library management and support', headName: 'Mrs. Ayesha Khan', staffCount: 3, isActive: true },
    { id: '7', name: 'Transport', description: 'Drivers and transport coordinators', headName: 'Mr. Hassan Raza', staffCount: 8, isActive: true },
]

export default function DepartmentsPage() {
    const [departments, setDepartments] = useState<Department[]>(sampleDepartments)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    })

    const handleSubmit = () => {
        if (editingDepartment) {
            setDepartments(departments.map(d => 
                d.id === editingDepartment.id 
                    ? { ...d, name: formData.name, description: formData.description }
                    : d
            ))
        } else {
            const newDept: Department = {
                id: String(departments.length + 1),
                name: formData.name,
                description: formData.description,
                headName: 'Not Assigned',
                staffCount: 0,
                isActive: true,
            }
            setDepartments([...departments, newDept])
        }
        setIsDialogOpen(false)
        setEditingDepartment(null)
        setFormData({ name: '', description: '' })
    }

    const handleEdit = (dept: Department) => {
        setEditingDepartment(dept)
        setFormData({ name: dept.name, description: dept.description })
        setIsDialogOpen(true)
    }

    const handleDelete = (id: string) => {
        setDepartments(departments.filter(d => d.id !== id))
    }

    const totalStaff = departments.reduce((sum, d) => sum + d.staffCount, 0)

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
                    <p className="text-muted-foreground">
                        Manage staff departments and organization structure
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gradient-primary" onClick={() => {
                            setEditingDepartment(null)
                            setFormData({ name: '', description: '' })
                        }}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Department
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingDepartment ? 'Edit Department' : 'Add New Department'}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Department Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter department name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Enter department description"
                                    rows={3}
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSubmit}>
                                    {editingDepartment ? 'Update' : 'Create'}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Departments</CardTitle>
                        <Building2 className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{departments.length}</div>
                        <p className="text-xs text-muted-foreground">Active departments</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
                        <Users className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalStaff}</div>
                        <p className="text-xs text-muted-foreground">Across all departments</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Largest Department</CardTitle>
                        <Building2 className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Teaching</div>
                        <p className="text-xs text-muted-foreground">45 staff members</p>
                    </CardContent>
                </Card>
            </div>

            {/* Departments Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Departments</CardTitle>
                    <CardDescription>List of all departments in the organization</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Department</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Head</TableHead>
                                <TableHead>Staff Count</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {departments.map((dept) => (
                                <TableRow key={dept.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="h-4 w-4 text-muted-foreground" />
                                            {dept.name}
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[300px] truncate">
                                        {dept.description}
                                    </TableCell>
                                    <TableCell>{dept.headName}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{dept.staffCount} members</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={dept.isActive ? 'default' : 'secondary'}>
                                            {dept.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEdit(dept)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    className="text-red-600"
                                                    onClick={() => handleDelete(dept.id)}
                                                >
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
