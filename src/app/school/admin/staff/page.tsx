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
    Users,
    Search,
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
    Phone,
    Mail,
    Download,
    Plus,
    User,
    Building2,
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface StaffMember {
    id: string
    employeeId: string
    name: string
    department: string
    designation: string
    gender: 'male' | 'female'
    phone: string
    email: string
    joinDate: string
    salary: number
    status: 'active' | 'inactive' | 'resigned'
}

const sampleStaff: StaffMember[] = [
    { id: '1', employeeId: 'EMP001', name: 'Mr. Imran Ali', department: 'Teaching', designation: 'Senior Teacher', gender: 'male', phone: '+92-300-1234567', email: 'imran@school.pk', joinDate: '2018-04-01', salary: 80000, status: 'active' },
    { id: '2', employeeId: 'EMP002', name: 'Dr. Sana Malik', department: 'Teaching', designation: 'Head of Science', gender: 'female', phone: '+92-300-2345678', email: 'sana@school.pk', joinDate: '2015-04-01', salary: 120000, status: 'active' },
    { id: '3', employeeId: 'EMP003', name: 'Mrs. Ayesha Khan', department: 'Teaching', designation: 'English Teacher', gender: 'female', phone: '+92-300-3456789', email: 'ayesha@school.pk', joinDate: '2019-04-01', salary: 65000, status: 'active' },
    { id: '4', employeeId: 'EMP004', name: 'Mr. Hassan Raza', department: 'Teaching', designation: 'Math Teacher', gender: 'male', phone: '+92-300-4567890', email: 'hassan@school.pk', joinDate: '2020-04-01', salary: 70000, status: 'active' },
    { id: '5', employeeId: 'EMP005', name: 'Ms. Fatima Noor', department: 'Teaching', designation: 'Science Teacher', gender: 'female', phone: '+92-300-5678901', email: 'fatima@school.pk', joinDate: '2021-04-01', salary: 60000, status: 'active' },
    { id: '6', employeeId: 'EMP006', name: 'Mr. Ahmad Shah', department: 'Teaching', designation: 'Urdu Teacher', gender: 'male', phone: '+92-300-6789012', email: 'ahmad@school.pk', joinDate: '2019-04-01', salary: 55000, status: 'active' },
    { id: '7', employeeId: 'EMP007', name: 'Mr. Usman Khan', department: 'Admin', designation: 'Office Manager', gender: 'male', phone: '+92-300-7890123', email: 'usman@school.pk', joinDate: '2017-04-01', salary: 50000, status: 'active' },
    { id: '8', employeeId: 'EMP008', name: 'Mrs. Zainab Ali', department: 'Admin', designation: 'Accountant', gender: 'female', phone: '+92-300-8901234', email: 'zainab@school.pk', joinDate: '2018-04-01', salary: 55000, status: 'active' },
    { id: '9', employeeId: 'EMP009', name: 'Mr. Bilal Ahmed', department: 'Support', designation: 'IT Support', gender: 'male', phone: '+92-300-9012345', email: 'bilal@school.pk', joinDate: '2020-04-01', salary: 45000, status: 'active' },
    { id: '10', employeeId: 'EMP010', name: 'Mr. Aslam Pervez', department: 'Support', designation: 'Maintenance', gender: 'male', phone: '+92-300-0123456', email: 'aslam@school.pk', joinDate: '2016-04-01', salary: 35000, status: 'inactive' },
]

export default function StaffPage() {
    const [staff] = useState<StaffMember[]>(sampleStaff)
    const [searchQuery, setSearchQuery] = useState('')
    const [departmentFilter, setDepartmentFilter] = useState<string>('all')
    const [statusFilter, setStatusFilter] = useState<string>('all')

    const filteredStaff = staff.filter((member) => {
        const matchesSearch =
            member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.designation.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesDept = departmentFilter === 'all' || member.department === departmentFilter
        const matchesStatus = statusFilter === 'all' || member.status === statusFilter
        return matchesSearch && matchesDept && matchesStatus
    })

    const totalStaff = staff.length
    const activeStaff = staff.filter((s) => s.status === 'active').length
    const teachingStaff = staff.filter((s) => s.department === 'Teaching').length
    const adminStaff = staff.filter((s) => s.department === 'Admin').length

    const getStatusBadge = (status: StaffMember['status']) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-500/10 text-green-500">Active</Badge>
            case 'inactive':
                return <Badge className="bg-yellow-500/10 text-yellow-500">Inactive</Badge>
            case 'resigned':
                return <Badge className="bg-gray-500/10 text-gray-500">Resigned</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">All Staff</h1>
                    <p className="text-muted-foreground">
                        Manage staff records and information
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Button className="gradient-primary">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Staff
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalStaff}</div>
                        <p className="text-xs text-muted-foreground">All employees</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Active</CardTitle>
                        <User className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{activeStaff}</div>
                        <p className="text-xs text-muted-foreground">Currently working</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Teaching</CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-500">{teachingStaff}</div>
                        <p className="text-xs text-muted-foreground">Teachers</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Admin & Support</CardTitle>
                        <Building2 className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-500">{adminStaff + (totalStaff - teachingStaff - adminStaff)}</div>
                        <p className="text-xs text-muted-foreground">Non-teaching</p>
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
                                placeholder="Search by name, ID, or designation..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Department" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Depts</SelectItem>
                                <SelectItem value="Teaching">Teaching</SelectItem>
                                <SelectItem value="Admin">Admin</SelectItem>
                                <SelectItem value="Support">Support</SelectItem>
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
                                <SelectItem value="resigned">Resigned</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Staff Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Staff Records
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Emp ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Designation</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStaff.map((member) => (
                                <TableRow key={member.id}>
                                    <TableCell className="font-medium">{member.employeeId}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${member.gender === 'male' ? 'bg-blue-500/10' : 'bg-pink-500/10'
                                                }`}>
                                                <User className={`h-4 w-4 ${member.gender === 'male' ? 'text-blue-500' : 'text-pink-500'
                                                    }`} />
                                            </div>
                                            <span>{member.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{member.department}</Badge>
                                    </TableCell>
                                    <TableCell>{member.designation}</TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <p className="flex items-center gap-1">
                                                <Phone className="h-3 w-3 text-muted-foreground" />
                                                {member.phone}
                                            </p>
                                            <p className="flex items-center gap-1 text-muted-foreground">
                                                <Mail className="h-3 w-3" />
                                                {member.email}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(member.status)}</TableCell>
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
