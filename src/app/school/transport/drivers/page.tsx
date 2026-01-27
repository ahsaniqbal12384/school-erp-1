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
    Loader2,
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

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
]

const emptyFormData = {
    name: '',
    phone: '',
    cnic: '',
    licenseNo: '',
    licenseExpiry: '',
    joinDate: new Date().toISOString().split('T')[0],
    assignedBus: '',
}

export default function DriversPage() {
    const [drivers, setDrivers] = useState<Driver[]>(sampleDrivers)
    const [searchQuery, setSearchQuery] = useState('')
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [isReassignDialogOpen, setIsReassignDialogOpen] = useState(false)
    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
    const [formData, setFormData] = useState(emptyFormData)
    const [isLoading, setIsLoading] = useState(false)
    const [newBusAssignment, setNewBusAssignment] = useState('')

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

    const generateEmployeeId = () => {
        const nextNum = drivers.length + 1
        return `DRV-${String(nextNum).padStart(3, '0')}`
    }

    const handleAddDriver = async () => {
        if (!formData.name || !formData.phone || !formData.cnic || !formData.licenseNo || !formData.licenseExpiry) {
            toast.error('Please fill in all required fields')
            return
        }

        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))

            const newDriver: Driver = {
                id: String(drivers.length + 1),
                employeeId: generateEmployeeId(),
                name: formData.name,
                phone: formData.phone,
                cnic: formData.cnic,
                licenseNo: formData.licenseNo,
                licenseExpiry: formData.licenseExpiry,
                assignedBus: formData.assignedBus || 'Not Assigned',
                assignedRoute: formData.assignedBus ? `R-00${drivers.length + 1}` : 'Not Assigned',
                joinDate: formData.joinDate,
                status: 'available',
            }

            setDrivers([...drivers, newDriver])
            setFormData(emptyFormData)
            setIsAddDialogOpen(false)
            toast.success('Driver added successfully', {
                description: `${newDriver.name} has been registered`
            })
        } catch {
            toast.error('Failed to add driver')
        } finally {
            setIsLoading(false)
        }
    }

    const handleEditDriver = async () => {
        if (!selectedDriver || !formData.name || !formData.phone) {
            toast.error('Please fill in required fields')
            return
        }

        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))

            setDrivers(drivers.map(driver =>
                driver.id === selectedDriver.id
                    ? {
                        ...driver,
                        name: formData.name,
                        phone: formData.phone,
                        cnic: formData.cnic || driver.cnic,
                        licenseNo: formData.licenseNo || driver.licenseNo,
                        licenseExpiry: formData.licenseExpiry || driver.licenseExpiry,
                    }
                    : driver
            ))
            setIsEditDialogOpen(false)
            setSelectedDriver(null)
            toast.success('Driver updated successfully')
        } catch {
            toast.error('Failed to update driver')
        } finally {
            setIsLoading(false)
        }
    }

    const handleReassignBus = async () => {
        if (!selectedDriver || !newBusAssignment) {
            toast.error('Please select a bus')
            return
        }

        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))

            setDrivers(drivers.map(driver =>
                driver.id === selectedDriver.id
                    ? {
                        ...driver,
                        assignedBus: newBusAssignment,
                        status: 'on-duty',
                    }
                    : driver
            ))
            setIsReassignDialogOpen(false)
            setSelectedDriver(null)
            setNewBusAssignment('')
            toast.success('Bus reassigned successfully')
        } catch {
            toast.error('Failed to reassign bus')
        } finally {
            setIsLoading(false)
        }
    }

    const handleCall = (driver: Driver) => {
        toast.info(`Calling ${driver.name}`, {
            description: driver.phone
        })
    }

    const openEditDialog = (driver: Driver) => {
        setSelectedDriver(driver)
        setFormData({
            name: driver.name,
            phone: driver.phone,
            cnic: driver.cnic,
            licenseNo: driver.licenseNo,
            licenseExpiry: driver.licenseExpiry,
            joinDate: driver.joinDate,
            assignedBus: driver.assignedBus,
        })
        setIsEditDialogOpen(true)
    }

    const openViewDialog = (driver: Driver) => {
        setSelectedDriver(driver)
        setIsViewDialogOpen(true)
    }

    const openReassignDialog = (driver: Driver) => {
        setSelectedDriver(driver)
        setNewBusAssignment('')
        setIsReassignDialogOpen(true)
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
                                    <Label>Full Name *</Label>
                                    <Input
                                        placeholder="Driver's full name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Phone Number *</Label>
                                    <Input
                                        placeholder="+92-XXX-XXXXXXX"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>CNIC Number *</Label>
                                    <Input
                                        placeholder="XXXXX-XXXXXXX-X"
                                        value={formData.cnic}
                                        onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>License Number *</Label>
                                    <Input
                                        placeholder="License number"
                                        value={formData.licenseNo}
                                        onChange={(e) => setFormData({ ...formData, licenseNo: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>License Expiry *</Label>
                                    <Input
                                        type="date"
                                        value={formData.licenseExpiry}
                                        onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Join Date</Label>
                                    <Input
                                        type="date"
                                        value={formData.joinDate}
                                        onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Assign Bus (Optional)</Label>
                                <Select
                                    value={formData.assignedBus}
                                    onValueChange={(value) => setFormData({ ...formData, assignedBus: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select bus (optional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Bus-07">Bus-07 (Available)</SelectItem>
                                        <SelectItem value="Bus-08">Bus-08 (Available)</SelectItem>
                                        <SelectItem value="Bus-09">Bus-09 (Available)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="outline" onClick={() => {
                                    setIsAddDialogOpen(false)
                                    setFormData(emptyFormData)
                                }}>
                                    Cancel
                                </Button>
                                <Button className="gradient-primary" onClick={handleAddDriver} disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Adding...
                                        </>
                                    ) : (
                                        'Add Driver'
                                    )}
                                </Button>
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
                        <p className="text-xs text-muted-foreground">Registered</p>
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
                                <TableHead>Employee ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>License</TableHead>
                                <TableHead>Assignment</TableHead>
                                <TableHead>Join Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredDrivers.map((driver) => (
                                <TableRow key={driver.id}>
                                    <TableCell className="font-medium text-primary">{driver.employeeId}</TableCell>
                                    <TableCell className="font-medium">{driver.name}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-auto p-0 text-sm font-normal hover:text-primary"
                                            onClick={() => handleCall(driver)}
                                        >
                                            <Phone className="mr-1 h-3 w-3" />
                                            {driver.phone}
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <p>{driver.licenseNo}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Exp: {new Date(driver.licenseExpiry).toLocaleDateString()}
                                            </p>
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
                                                <DropdownMenuItem onClick={() => openViewDialog(driver)}>
                                                    <FileText className="mr-2 h-4 w-4" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => openEditDialog(driver)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => openReassignDialog(driver)}>
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

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Driver</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Full Name *</Label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Phone Number *</Label>
                                <Input
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>CNIC Number</Label>
                                <Input
                                    value={formData.cnic}
                                    onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>License Number</Label>
                                <Input
                                    value={formData.licenseNo}
                                    onChange={(e) => setFormData({ ...formData, licenseNo: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>License Expiry</Label>
                            <Input
                                type="date"
                                value={formData.licenseExpiry}
                                onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button className="gradient-primary" onClick={handleEditDriver} disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* View Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Driver Details</DialogTitle>
                    </DialogHeader>
                    {selectedDriver && (
                        <div className="space-y-4 py-4">
                            <div className="flex items-center gap-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                    <User className="h-8 w-8 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{selectedDriver.name}</h3>
                                    <p className="text-muted-foreground">{selectedDriver.employeeId}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Phone</p>
                                    <p className="font-medium">{selectedDriver.phone}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">CNIC</p>
                                    <p className="font-medium">{selectedDriver.cnic}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">License Number</p>
                                    <p className="font-medium">{selectedDriver.licenseNo}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">License Expiry</p>
                                    <p className="font-medium">{new Date(selectedDriver.licenseExpiry).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Assigned Bus</p>
                                    <p className="font-medium">{selectedDriver.assignedBus}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Route</p>
                                    <p className="font-medium">{selectedDriver.assignedRoute}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Join Date</p>
                                    <p className="font-medium">{new Date(selectedDriver.joinDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Status</p>
                                    {getStatusBadge(selectedDriver.status)}
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                                    Close
                                </Button>
                                <Button onClick={() => handleCall(selectedDriver)}>
                                    <Phone className="mr-2 h-4 w-4" />
                                    Call Driver
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Reassign Bus Dialog */}
            <Dialog open={isReassignDialogOpen} onOpenChange={setIsReassignDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reassign Bus</DialogTitle>
                    </DialogHeader>
                    {selectedDriver && (
                        <div className="space-y-4 py-4">
                            <div className="p-4 bg-muted rounded-lg">
                                <p className="font-medium">{selectedDriver.name}</p>
                                <p className="text-sm text-muted-foreground">
                                    Currently assigned: {selectedDriver.assignedBus}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label>Select New Bus</Label>
                                <Select value={newBusAssignment} onValueChange={setNewBusAssignment}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select bus" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Bus-01">Bus-01</SelectItem>
                                        <SelectItem value="Bus-02">Bus-02</SelectItem>
                                        <SelectItem value="Bus-03">Bus-03</SelectItem>
                                        <SelectItem value="Bus-04">Bus-04</SelectItem>
                                        <SelectItem value="Bus-05">Bus-05</SelectItem>
                                        <SelectItem value="Bus-06">Bus-06</SelectItem>
                                        <SelectItem value="Bus-07">Bus-07</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="outline" onClick={() => setIsReassignDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button className="gradient-primary" onClick={handleReassignBus} disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Reassigning...
                                        </>
                                    ) : (
                                        'Reassign Bus'
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
