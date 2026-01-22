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
    Users,
    Search,
    Plus,
    Phone,
    Bus,
    Edit,
    MoreHorizontal,
    User,
    Calendar,
    FileText,
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Driver {
    id: string
    employeeId: string
    name: string
    phone: string
    cnic: string
    licenseNo: string
    licenseExpiry: string
    assignedBus: string
    assignedRoute: string
    joinDate: string
    status: 'on-duty' | 'available' | 'off-duty' | 'on-leave'
}

const sampleDrivers: Driver[] = [
    { id: '1', employeeId: 'DRV-001', name: 'Muhammad Aslam', phone: '+92-300-1234567', cnic: '35201-1234567-1', licenseNo: 'LHR-12345', licenseExpiry: '2025-06-15', assignedBus: 'Bus-01', assignedRoute: 'R-001', joinDate: '2019-04-01', status: 'on-duty' },
    { id: '2', employeeId: 'DRV-002', name: 'Ahmad Khan', phone: '+92-300-2345678', cnic: '35201-2345678-2', licenseNo: 'LHR-23456', licenseExpiry: '2024-08-20', assignedBus: 'Bus-02', assignedRoute: 'R-002', joinDate: '2020-06-15', status: 'on-duty' },
    { id: '3', employeeId: 'DRV-003', name: 'Hassan Raza', phone: '+92-300-3456789', cnic: '35201-3456789-3', licenseNo: 'LHR-34567', licenseExpiry: '2025-03-10', assignedBus: 'Bus-03', assignedRoute: 'R-003', joinDate: '2018-09-01', status: 'available' },
    { id: '4', employeeId: 'DRV-004', name: 'Farhan Ahmed', phone: '+92-300-4567890', cnic: '35201-4567890-4', licenseNo: 'LHR-45678', licenseExpiry: '2024-11-25', assignedBus: 'Bus-04', assignedRoute: 'R-004', joinDate: '2021-01-10', status: 'on-duty' },
    { id: '5', employeeId: 'DRV-005', name: 'Imran Ali', phone: '+92-300-5678901', cnic: '35201-5678901-5', licenseNo: 'LHR-56789', licenseExpiry: '2024-02-28', assignedBus: 'Bus-05', assignedRoute: 'R-005', joinDate: '2017-03-20', status: 'on-duty' },
    { id: '6', employeeId: 'DRV-006', name: 'Bilal Shah', phone: '+92-300-6789012', cnic: '35201-6789012-6', licenseNo: 'LHR-67890', licenseExpiry: '2025-09-15', assignedBus: 'Bus-06', assignedRoute: 'R-006', joinDate: '2022-08-01', status: 'on-leave' },
]

export default function DriversPage() {
    const [drivers] = useState<Driver[]>(sampleDrivers)
    const [searchQuery, setSearchQuery] = useState('')
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

    const filteredDrivers = drivers.filter((driver) =>
        driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.phone.includes(searchQuery)
    )

    const totalDrivers = drivers.length
    const onDutyCount = drivers.filter((d) => d.status === 'on-duty').length
    const availableCount = drivers.filter((d) => d.status === 'available').length

    const getStatusBadge = (status: Driver['status']) => {
        switch (status) {
            case 'on-duty':
                return <Badge className="bg-green-500/10 text-green-500">On Duty</Badge>
            case 'available':
                return <Badge className="bg-blue-500/10 text-blue-500">Available</Badge>
            case 'off-duty':
                return <Badge variant="outline">Off Duty</Badge>
            case 'on-leave':
                return <Badge className="bg-yellow-500/10 text-yellow-500">On Leave</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Driver Management</h1>
                    <p className="text-muted-foreground">
                        Manage drivers and their assignments
                    </p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gradient-primary">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Driver
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Add New Driver</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Full Name</Label>
                                    <Input placeholder="Driver's full name" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Phone Number</Label>
                                    <Input placeholder="+92-XXX-XXXXXXX" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>CNIC Number</Label>
                                    <Input placeholder="XXXXX-XXXXXXX-X" />
                                </div>
                                <div className="space-y-2">
                                    <Label>License Number</Label>
                                    <Input placeholder="License number" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>License Expiry</Label>
                                    <Input type="date" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Join Date</Label>
                                    <Input type="date" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                                <Button className="gradient-primary" onClick={() => setIsAddDialogOpen(false)}>Add Driver</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalDrivers}</div>
                        <p className="text-xs text-muted-foreground">Registered drivers</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">On Duty</CardTitle>
                        <User className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{onDutyCount}</div>
                        <p className="text-xs text-muted-foreground">Currently working</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Available</CardTitle>
                        <User className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-500">{availableCount}</div>
                        <p className="text-xs text-muted-foreground">Ready to assign</p>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search drivers by name, ID, or phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Drivers Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        All Drivers
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Driver</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>License</TableHead>
                                <TableHead>Assigned</TableHead>
                                <TableHead>Join Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredDrivers.map((driver) => (
                                <TableRow key={driver.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                                <User className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{driver.name}</p>
                                                <p className="text-xs text-muted-foreground">{driver.employeeId}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm">
                                            <Phone className="h-3 w-3 text-muted-foreground" />
                                            {driver.phone}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-mono text-sm">{driver.licenseNo}</p>
                                            <p className="text-xs text-muted-foreground">Exp: {driver.licenseExpiry}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Bus className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium">{driver.assignedBus}</p>
                                                <p className="text-xs text-muted-foreground">{driver.assignedRoute}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm">
                                            <Calendar className="h-3 w-3 text-muted-foreground" />
                                            {new Date(driver.joinDate).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(driver.status)}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <FileText className="mr-2 h-4 w-4" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Bus className="mr-2 h-4 w-4" />
                                                    Reassign Bus
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
