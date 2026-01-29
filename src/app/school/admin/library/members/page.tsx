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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Users,
    Plus,
    Search,
    GraduationCap,
    Briefcase,
    BookOpen,
    MoreHorizontal,
    Eye,
    Edit,
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface LibraryMember {
    id: string
    membershipNo: string
    name: string
    memberType: 'student' | 'staff'
    class?: string
    department?: string
    email: string
    phone: string
    currentBooks: number
    maxBooks: number
    totalIssued: number
    finesDue: number
    status: 'active' | 'suspended' | 'expired'
    joinDate: string
}

const sampleMembers: LibraryMember[] = [
    { id: '1', membershipNo: 'LIB-STD-001', name: 'Ahmed Khan', memberType: 'student', class: 'Class 10-A', email: 'ahmed@school.pk', phone: '+92-300-1234567', currentBooks: 2, maxBooks: 3, totalIssued: 15, finesDue: 0, status: 'active', joinDate: '2024-01-15' },
    { id: '2', membershipNo: 'LIB-STF-001', name: 'Dr. Sana Malik', memberType: 'staff', department: 'Science', email: 'sana@school.pk', phone: '+92-300-2345678', currentBooks: 3, maxBooks: 5, totalIssued: 28, finesDue: 0, status: 'active', joinDate: '2023-04-01' },
    { id: '3', membershipNo: 'LIB-STD-015', name: 'Fatima Ali', memberType: 'student', class: 'Class 9-B', email: 'fatima@school.pk', phone: '+92-300-3456789', currentBooks: 1, maxBooks: 3, totalIssued: 8, finesDue: 60, status: 'active', joinDate: '2024-02-10' },
    { id: '4', membershipNo: 'LIB-STD-022', name: 'Hassan Raza', memberType: 'student', class: 'Class 8-A', email: 'hassan@school.pk', phone: '+92-300-4567890', currentBooks: 0, maxBooks: 3, totalIssued: 12, finesDue: 0, status: 'active', joinDate: '2024-01-20' },
    { id: '5', membershipNo: 'LIB-STF-005', name: 'Mr. Ahmad Shah', memberType: 'staff', department: 'Urdu', email: 'ahmad@school.pk', phone: '+92-300-5678901', currentBooks: 2, maxBooks: 5, totalIssued: 35, finesDue: 0, status: 'active', joinDate: '2023-06-15' },
    { id: '6', membershipNo: 'LIB-STD-033', name: 'Zainab Hassan', memberType: 'student', class: 'Class 10-B', email: 'zainab@school.pk', phone: '+92-300-6789012', currentBooks: 1, maxBooks: 3, totalIssued: 6, finesDue: 120, status: 'suspended', joinDate: '2024-03-01' },
]

export default function LibraryMembersPage() {
    const [members, setMembers] = useState<LibraryMember[]>(sampleMembers)
    const [searchQuery, setSearchQuery] = useState('')
    const [memberTypeFilter, setMemberTypeFilter] = useState<string>('all')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

    const filteredMembers = members.filter((member) => {
        const matchesSearch =
            member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.membershipNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.email.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesType = memberTypeFilter === 'all' || member.memberType === memberTypeFilter
        const matchesStatus = statusFilter === 'all' || member.status === statusFilter
        return matchesSearch && matchesType && matchesStatus
    })

    const totalMembers = members.length
    const studentMembers = members.filter(m => m.memberType === 'student').length
    const staffMembers = members.filter(m => m.memberType === 'staff').length
    const activeMembers = members.filter(m => m.status === 'active').length

    const getStatusBadge = (status: LibraryMember['status']) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-500/10 text-green-500">Active</Badge>
            case 'suspended':
                return <Badge className="bg-red-500/10 text-red-500">Suspended</Badge>
            case 'expired':
                return <Badge className="bg-gray-500/10 text-gray-500">Expired</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Library Members</h1>
                    <p className="text-muted-foreground">
                        Manage library memberships for students and staff
                    </p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gradient-primary">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Member
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Add Library Member</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label>Member Type</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="student">Student</SelectItem>
                                        <SelectItem value="staff">Staff</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Select Student/Staff</Label>
                                <Input placeholder="Search by name or ID..." />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Max Books</Label>
                                    <Input type="number" defaultValue="3" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Max Days</Label>
                                    <Input type="number" defaultValue="14" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3">
                                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={() => setIsAddDialogOpen(false)}>
                                    Add Member
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalMembers}</div>
                        <p className="text-xs text-muted-foreground">Registered members</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Students</CardTitle>
                        <GraduationCap className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{studentMembers}</div>
                        <p className="text-xs text-muted-foreground">Student members</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Staff</CardTitle>
                        <Briefcase className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{staffMembers}</div>
                        <p className="text-xs text-muted-foreground">Staff members</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Active</CardTitle>
                        <BookOpen className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{activeMembers}</div>
                        <p className="text-xs text-muted-foreground">Can borrow books</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle>All Members</CardTitle>
                            <CardDescription>Manage library memberships</CardDescription>
                        </div>
                        <div className="flex gap-3 flex-wrap">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search members..."
                                    className="pl-8 w-[200px]"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Select value={memberTypeFilter} onValueChange={setMemberTypeFilter}>
                                <SelectTrigger className="w-[130px]">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="student">Students</SelectItem>
                                    <SelectItem value="staff">Staff</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[130px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="suspended">Suspended</SelectItem>
                                    <SelectItem value="expired">Expired</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Member</TableHead>
                                <TableHead>Membership No</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Class/Dept</TableHead>
                                <TableHead>Books</TableHead>
                                <TableHead>Fines Due</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredMembers.map((member) => (
                                <TableRow key={member.id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{member.name}</span>
                                            <span className="text-xs text-muted-foreground">{member.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono">{member.membershipNo}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {member.memberType === 'student' ? (
                                                <><GraduationCap className="w-3 h-3 mr-1" />Student</>
                                            ) : (
                                                <><Briefcase className="w-3 h-3 mr-1" />Staff</>
                                            )}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{member.class || member.department}</TableCell>
                                    <TableCell>
                                        <span className={member.currentBooks >= member.maxBooks ? 'text-red-500' : ''}>
                                            {member.currentBooks}/{member.maxBooks}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {member.finesDue > 0 ? (
                                            <span className="text-red-500 font-medium">Rs. {member.finesDue}</span>
                                        ) : (
                                            <span className="text-green-500">None</span>
                                        )}
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
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <BookOpen className="mr-2 h-4 w-4" />
                                                    View History
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
