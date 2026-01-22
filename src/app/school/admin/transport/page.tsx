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
    Bus,
    Plus,
    Search,
    MapPin,
    Users,
    Phone,
    Calendar,
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
    Navigation,
    Route,
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface BusRoute {
    id: string
    routeName: string
    busNumber: string
    driver: string
    driverPhone: string
    conductor: string
    capacity: number
    students: number
    stops: number
    startTime: string
    status: 'active' | 'inactive' | 'maintenance'
}

const sampleRoutes: BusRoute[] = [
    {
        id: '1',
        routeName: 'Route 1 - DHA Phase 5',
        busNumber: 'Bus-01',
        driver: 'Muhammad Aslam',
        driverPhone: '+92-300-1234567',
        conductor: 'Iqbal Ahmed',
        capacity: 45,
        students: 38,
        stops: 8,
        startTime: '7:00 AM',
        status: 'active',
    },
    {
        id: '2',
        routeName: 'Route 2 - Gulberg',
        busNumber: 'Bus-02',
        driver: 'Ahmad Khan',
        driverPhone: '+92-300-2345678',
        conductor: 'Rashid Ali',
        capacity: 45,
        students: 42,
        stops: 10,
        startTime: '6:45 AM',
        status: 'active',
    },
    {
        id: '3',
        routeName: 'Route 3 - Model Town',
        busNumber: 'Bus-03',
        driver: 'Hassan Raza',
        driverPhone: '+92-300-3456789',
        conductor: 'Kamran Shah',
        capacity: 40,
        students: 35,
        stops: 7,
        startTime: '6:50 AM',
        status: 'active',
    },
    {
        id: '4',
        routeName: 'Route 4 - Johar Town',
        busNumber: 'Bus-04',
        driver: 'Farhan Ahmed',
        driverPhone: '+92-300-4567890',
        conductor: 'Waseem Abbas',
        capacity: 50,
        students: 45,
        stops: 12,
        startTime: '6:30 AM',
        status: 'active',
    },
    {
        id: '5',
        routeName: 'Route 5 - Cantt',
        busNumber: 'Bus-05',
        driver: 'Imran Ali',
        driverPhone: '+92-300-5678901',
        conductor: 'Nadeem Khan',
        capacity: 45,
        students: 30,
        stops: 6,
        startTime: '7:10 AM',
        status: 'maintenance',
    },
    {
        id: '6',
        routeName: 'Route 6 - Faisal Town',
        busNumber: 'Bus-06',
        driver: 'Tahir Mahmood',
        driverPhone: '+92-300-6789012',
        conductor: 'Sajid Hussain',
        capacity: 40,
        students: 28,
        stops: 5,
        startTime: '7:05 AM',
        status: 'active',
    },
]

export default function TransportPage() {
    const [routes] = useState<BusRoute[]>(sampleRoutes)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

    const filteredRoutes = routes.filter((route) => {
        const matchesSearch =
            route.routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            route.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            route.driver.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'all' || route.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const totalBuses = routes.length
    const activeBuses = routes.filter((r) => r.status === 'active').length
    const totalStudents = routes.reduce((acc, r) => acc + r.students, 0)
    const totalCapacity = routes.reduce((acc, r) => acc + r.capacity, 0)

    const getStatusBadge = (status: BusRoute['status']) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-500/10 text-green-500">Active</Badge>
            case 'inactive':
                return <Badge className="bg-gray-500/10 text-gray-500">Inactive</Badge>
            case 'maintenance':
                return <Badge className="bg-yellow-500/10 text-yellow-500">Maintenance</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Transport Management</h1>
                    <p className="text-muted-foreground">
                        Manage school buses, routes, and drivers
                    </p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gradient-primary">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Route
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Add New Bus Route</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Route Name</Label>
                                    <Input placeholder="e.g., Route 7 - Bahria Town" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Bus Number</Label>
                                    <Input placeholder="e.g., Bus-07" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Driver Name</Label>
                                    <Input placeholder="Enter driver name" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Driver Phone</Label>
                                    <Input placeholder="+92-300-XXXXXXX" />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Conductor Name</Label>
                                    <Input placeholder="Enter conductor name" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Capacity</Label>
                                    <Input type="number" placeholder="45" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Start Time</Label>
                                    <Input type="time" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button className="gradient-primary" onClick={() => setIsAddDialogOpen(false)}>
                                    Add Route
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
                        <CardTitle className="text-sm font-medium">Total Buses</CardTitle>
                        <Bus className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalBuses}</div>
                        <p className="text-xs text-muted-foreground">In fleet</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
                        <Navigation className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{activeBuses}</div>
                        <p className="text-xs text-muted-foreground">Currently running</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalStudents}</div>
                        <p className="text-xs text-muted-foreground">Using transport</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Capacity Used</CardTitle>
                        <Route className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{Math.round((totalStudents / totalCapacity) * 100)}%</div>
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
                                placeholder="Search routes, buses, or drivers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="maintenance">Maintenance</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Routes Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Route className="h-5 w-5" />
                        Bus Routes
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Route</TableHead>
                                <TableHead>Bus</TableHead>
                                <TableHead>Driver</TableHead>
                                <TableHead className="text-center">Stops</TableHead>
                                <TableHead className="text-center">Students</TableHead>
                                <TableHead>Start Time</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredRoutes.map((route) => (
                                <TableRow key={route.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                                <MapPin className="h-5 w-5 text-primary" />
                                            </div>
                                            <span className="font-medium">{route.routeName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            <Bus className="mr-1 h-3 w-3" />
                                            {route.busNumber}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{route.driver}</p>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Phone className="h-3 w-3" />
                                                {route.driverPhone}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">{route.stops}</TableCell>
                                    <TableCell className="text-center">
                                        <span className="font-medium">{route.students}</span>
                                        <span className="text-muted-foreground">/{route.capacity}</span>
                                    </TableCell>
                                    <TableCell>{route.startTime}</TableCell>
                                    <TableCell>{getStatusBadge(route.status)}</TableCell>
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
                                                    <Navigation className="mr-2 h-4 w-4" />
                                                    Track Bus
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit Route
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
