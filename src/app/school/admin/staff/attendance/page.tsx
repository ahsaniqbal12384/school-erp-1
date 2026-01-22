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
import { Checkbox } from '@/components/ui/checkbox'
import {
    UserCheck,
    Search,
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    Users,
    Save,
    Download,
    User,
} from 'lucide-react'

interface StaffMember {
    id: string
    employeeId: string
    name: string
    department: string
    designation: string
    status: 'present' | 'absent' | 'late' | 'leave' | 'half-day' | null
    checkIn?: string
    checkOut?: string
}

const sampleStaff: StaffMember[] = [
    { id: '1', employeeId: 'EMP001', name: 'Mr. Imran Ali', department: 'Teaching', designation: 'Senior Teacher', status: 'present', checkIn: '7:45 AM', checkOut: '-' },
    { id: '2', employeeId: 'EMP002', name: 'Dr. Sana Malik', department: 'Teaching', designation: 'Head of Science', status: 'present', checkIn: '7:30 AM', checkOut: '-' },
    { id: '3', employeeId: 'EMP003', name: 'Mrs. Ayesha Khan', department: 'Teaching', designation: 'English Teacher', status: 'late', checkIn: '8:15 AM', checkOut: '-' },
    { id: '4', employeeId: 'EMP004', name: 'Mr. Hassan Raza', department: 'Teaching', designation: 'Math Teacher', status: 'present', checkIn: '7:50 AM', checkOut: '-' },
    { id: '5', employeeId: 'EMP005', name: 'Ms. Fatima Noor', department: 'Teaching', designation: 'Science Teacher', status: 'absent' },
    { id: '6', employeeId: 'EMP006', name: 'Mr. Ahmad Shah', department: 'Teaching', designation: 'Urdu Teacher', status: 'present', checkIn: '7:40 AM', checkOut: '-' },
    { id: '7', employeeId: 'EMP007', name: 'Mr. Usman Khan', department: 'Admin', designation: 'Office Manager', status: 'present', checkIn: '8:00 AM', checkOut: '-' },
    { id: '8', employeeId: 'EMP008', name: 'Mrs. Zainab Ali', department: 'Admin', designation: 'Accountant', status: 'leave' },
    { id: '9', employeeId: 'EMP009', name: 'Mr. Bilal Ahmed', department: 'Support', designation: 'IT Support', status: 'present', checkIn: '7:55 AM', checkOut: '-' },
    { id: '10', employeeId: 'EMP010', name: 'Mr. Aslam Pervez', department: 'Support', designation: 'Maintenance', status: 'half-day', checkIn: '7:30 AM', checkOut: '12:30 PM' },
]

export default function StaffAttendancePage() {
    const [staff, setStaff] = useState<StaffMember[]>(sampleStaff)
    const [selectedDepartment, setSelectedDepartment] = useState<string>('all')
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
    const [searchQuery, setSearchQuery] = useState('')

    const filteredStaff = staff.filter((member) => {
        const matchesSearch =
            member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesDept = selectedDepartment === 'all' || member.department === selectedDepartment
        return matchesSearch && matchesDept
    })

    const presentCount = staff.filter((s) => s.status === 'present').length
    const absentCount = staff.filter((s) => s.status === 'absent').length
    const lateCount = staff.filter((s) => s.status === 'late').length
    const leaveCount = staff.filter((s) => s.status === 'leave').length

    const updateStatus = (staffId: string, status: StaffMember['status']) => {
        setStaff((prev) =>
            prev.map((s) => (s.id === staffId ? { ...s, status } : s))
        )
    }

    const getStatusBadge = (status: StaffMember['status']) => {
        switch (status) {
            case 'present':
                return <Badge className="bg-green-500/10 text-green-500">Present</Badge>
            case 'absent':
                return <Badge className="bg-red-500/10 text-red-500">Absent</Badge>
            case 'late':
                return <Badge className="bg-yellow-500/10 text-yellow-500">Late</Badge>
            case 'leave':
                return <Badge className="bg-blue-500/10 text-blue-500">On Leave</Badge>
            case 'half-day':
                return <Badge className="bg-purple-500/10 text-purple-500">Half Day</Badge>
            default:
                return <Badge variant="outline">Not Marked</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Staff Attendance</h1>
                    <p className="text-muted-foreground">
                        Record daily staff attendance
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export Report
                    </Button>
                    <Button className="gradient-primary">
                        <Save className="mr-2 h-4 w-4" />
                        Save Attendance
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-5">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{staff.length}</div>
                        <p className="text-xs text-muted-foreground">All departments</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Present</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{presentCount}</div>
                        <p className="text-xs text-muted-foreground">{((presentCount / staff.length) * 100).toFixed(0)}%</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Absent</CardTitle>
                        <XCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">{absentCount}</div>
                        <p className="text-xs text-muted-foreground">{((absentCount / staff.length) * 100).toFixed(0)}%</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Late</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-500">{lateCount}</div>
                        <p className="text-xs text-muted-foreground">Arrived late</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">On Leave</CardTitle>
                        <Calendar className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-500">{leaveCount}</div>
                        <p className="text-xs text-muted-foreground">Approved leave</p>
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
                                placeholder="Search staff..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Department" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Departments</SelectItem>
                                <SelectItem value="Teaching">Teaching</SelectItem>
                                <SelectItem value="Admin">Admin</SelectItem>
                                <SelectItem value="Support">Support</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-[180px]"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Attendance Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <UserCheck className="h-5 w-5" />
                            Staff Attendance - {new Date(selectedDate).toLocaleDateString()}
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Emp ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead className="text-center">Present</TableHead>
                                <TableHead className="text-center">Absent</TableHead>
                                <TableHead className="text-center">Late</TableHead>
                                <TableHead className="text-center">Leave</TableHead>
                                <TableHead>Check In</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStaff.map((member) => (
                                <TableRow key={member.id}>
                                    <TableCell className="font-medium">{member.employeeId}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                                <User className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{member.name}</p>
                                                <p className="text-xs text-muted-foreground">{member.designation}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{member.department}</Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Checkbox
                                            checked={member.status === 'present'}
                                            onCheckedChange={() => updateStatus(member.id, 'present')}
                                        />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Checkbox
                                            checked={member.status === 'absent'}
                                            onCheckedChange={() => updateStatus(member.id, 'absent')}
                                        />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Checkbox
                                            checked={member.status === 'late'}
                                            onCheckedChange={() => updateStatus(member.id, 'late')}
                                        />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Checkbox
                                            checked={member.status === 'leave'}
                                            onCheckedChange={() => updateStatus(member.id, 'leave')}
                                        />
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {member.checkIn || '-'}
                                    </TableCell>
                                    <TableCell>{getStatusBadge(member.status)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
