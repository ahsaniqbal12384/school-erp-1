'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
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
    Loader2,
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

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
    const [staff, setStaff] = useState<StaffMember[]>(sampleStaff)
    const [searchQuery, setSearchQuery] = useState('')
    const [departmentFilter, setDepartmentFilter] = useState<string>('all')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    
    // Dialog states
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        department: 'Teaching',
        designation: '',
        gender: 'male' as 'male' | 'female',
        phone: '',
        email: '',
        salary: 50000,
    })

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

    const resetForm = () => {
        setFormData({
            name: '',
            department: 'Teaching',
            designation: '',
            gender: 'male',
            phone: '',
            email: '',
            salary: 50000,
        })
    }

    const handleExport = () => {
        setIsLoading(true)
        const headers = ['Employee ID', 'Name', 'Department', 'Designation', 'Gender', 'Phone', 'Email', 'Join Date', 'Salary', 'Status']
        const csvContent = [
            headers.join(','),
            ...filteredStaff.map(s => 
                [s.employeeId, s.name, s.department, s.designation, s.gender, s.phone, s.email, s.joinDate, s.salary, s.status].join(',')
            )
        ].join('\n')
        
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `staff_export_${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
        
        setIsLoading(false)
        toast.success('Staff data exported successfully')
    }

    const handleAddStaff = () => {
        if (!formData.name || !formData.designation || !formData.phone || !formData.email) {
            toast.error('Please fill in all required fields')
            return
        }
        
        setIsLoading(true)
        const maxId = Math.max(...staff.map(s => parseInt(s.employeeId.replace('EMP', ''))))
        const newStaff: StaffMember = {
            id: String(staff.length + 1),
            employeeId: `EMP${String(maxId + 1).padStart(3, '0')}`,
            name: formData.name,
            department: formData.department,
            designation: formData.designation,
            gender: formData.gender,
            phone: formData.phone,
            email: formData.email,
            joinDate: new Date().toISOString().split('T')[0],
            salary: formData.salary,
            status: 'active',
        }
        
        setTimeout(() => {
            setStaff([...staff, newStaff])
            setIsAddDialogOpen(false)
            resetForm()
            setIsLoading(false)
            toast.success(`Staff member ${newStaff.name} added successfully`)
        }, 500)
    }

    const handleEditStaff = () => {
        if (!selectedStaff || !formData.name || !formData.designation || !formData.phone) {
            toast.error('Please fill in all required fields')
            return
        }
        
        setIsLoading(true)
        setTimeout(() => {
            setStaff(staff.map(s => 
                s.id === selectedStaff.id 
                    ? { ...s, ...formData }
                    : s
            ))
            setIsEditDialogOpen(false)
            setSelectedStaff(null)
            resetForm()
            setIsLoading(false)
            toast.success('Staff member updated successfully')
        }, 500)
    }

    const handleDeleteStaff = () => {
        if (!selectedStaff) return
        
        setIsLoading(true)
        setTimeout(() => {
            setStaff(staff.filter(s => s.id !== selectedStaff.id))
            setIsDeleteDialogOpen(false)
            setSelectedStaff(null)
            setIsLoading(false)
            toast.success('Staff member deleted successfully')
        }, 500)
    }

    const openViewDialog = (member: StaffMember) => {
        setSelectedStaff(member)
        setIsViewDialogOpen(true)
    }

    const openEditDialog = (member: StaffMember) => {
        setSelectedStaff(member)
        setFormData({
            name: member.name,
            department: member.department,
            designation: member.designation,
            gender: member.gender,
            phone: member.phone,
            email: member.email,
            salary: member.salary,
        })
        setIsEditDialogOpen(true)
    }

    const openDeleteDialog = (member: StaffMember) => {
        setSelectedStaff(member)
        setIsDeleteDialogOpen(true)
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
                    <Button variant="outline" onClick={handleExport} disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                        Export
                    </Button>
                    <Button className="gradient-primary" onClick={() => { resetForm(); setIsAddDialogOpen(true) }}>
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
                        Staff Records ({filteredStaff.length})
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
                                            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${member.gender === 'male' ? 'bg-blue-500/10' : 'bg-pink-500/10'}`}>
                                                <User className={`h-4 w-4 ${member.gender === 'male' ? 'text-blue-500' : 'text-pink-500'}`} />
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
                                                <DropdownMenuItem onClick={() => openViewDialog(member)}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Profile
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => openEditDialog(member)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-500" onClick={() => openDeleteDialog(member)}>
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredStaff.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                        No staff found matching your criteria
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Add Staff Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add New Staff Member</DialogTitle>
                        <DialogDescription>Enter staff information below</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Full Name *</Label>
                            <Input 
                                value={formData.name} 
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter full name"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Department</Label>
                                <Select value={formData.department} onValueChange={(v) => setFormData({ ...formData, department: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Teaching">Teaching</SelectItem>
                                        <SelectItem value="Admin">Admin</SelectItem>
                                        <SelectItem value="Support">Support</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Gender</Label>
                                <Select value={formData.gender} onValueChange={(v: 'male' | 'female') => setFormData({ ...formData, gender: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Designation *</Label>
                            <Input 
                                value={formData.designation} 
                                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                placeholder="e.g., Senior Teacher, Office Manager"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Phone Number *</Label>
                            <Input 
                                value={formData.phone} 
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+92-300-1234567"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Email *</Label>
                            <Input 
                                type="email"
                                value={formData.email} 
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="staff@school.pk"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Monthly Salary (PKR)</Label>
                            <Input 
                                type="number"
                                value={formData.salary} 
                                onChange={(e) => setFormData({ ...formData, salary: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddStaff} disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                            Add Staff
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Staff Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Staff Profile</DialogTitle>
                    </DialogHeader>
                    {selectedStaff && (
                        <div className="space-y-4 py-4">
                            <div className="flex items-center gap-4">
                                <div className={`flex h-16 w-16 items-center justify-center rounded-full ${selectedStaff.gender === 'male' ? 'bg-blue-500/10' : 'bg-pink-500/10'}`}>
                                    <User className={`h-8 w-8 ${selectedStaff.gender === 'male' ? 'text-blue-500' : 'text-pink-500'}`} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{selectedStaff.name}</h3>
                                    <p className="text-sm text-muted-foreground">{selectedStaff.employeeId}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                <div>
                                    <p className="text-sm text-muted-foreground">Department</p>
                                    <p className="font-medium">{selectedStaff.department}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Designation</p>
                                    <p className="font-medium">{selectedStaff.designation}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Gender</p>
                                    <p className="font-medium capitalize">{selectedStaff.gender}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Status</p>
                                    {getStatusBadge(selectedStaff.status)}
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Phone</p>
                                    <p className="font-medium">{selectedStaff.phone}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-medium">{selectedStaff.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Join Date</p>
                                    <p className="font-medium">{selectedStaff.joinDate}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Salary</p>
                                    <p className="font-medium">Rs. {selectedStaff.salary.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
                        <Button onClick={() => { setIsViewDialogOpen(false); selectedStaff && openEditDialog(selectedStaff) }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Staff
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Staff Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Staff Member</DialogTitle>
                        <DialogDescription>Update staff information</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Full Name *</Label>
                            <Input 
                                value={formData.name} 
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Department</Label>
                                <Select value={formData.department} onValueChange={(v) => setFormData({ ...formData, department: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Teaching">Teaching</SelectItem>
                                        <SelectItem value="Admin">Admin</SelectItem>
                                        <SelectItem value="Support">Support</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Gender</Label>
                                <Select value={formData.gender} onValueChange={(v: 'male' | 'female') => setFormData({ ...formData, gender: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Designation *</Label>
                            <Input 
                                value={formData.designation} 
                                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Phone Number *</Label>
                            <Input 
                                value={formData.phone} 
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Email *</Label>
                            <Input 
                                type="email"
                                value={formData.email} 
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Monthly Salary (PKR)</Label>
                            <Input 
                                type="number"
                                value={formData.salary} 
                                onChange={(e) => setFormData({ ...formData, salary: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleEditStaff} disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Staff Member</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <strong>{selectedStaff?.name}</strong>? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteStaff} className="bg-red-500 hover:bg-red-600">
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
