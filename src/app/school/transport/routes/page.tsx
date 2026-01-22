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
    Route,
    Search,
    Plus,
    MapPin,
    Users,
    Clock,
    Edit,
    MoreHorizontal,
    Bus,
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface TransportRoute {
    id: string
    routeNo: string
    name: string
    bus: string
    driver: string
    startPoint: string
    endPoint: string
    stops: number
    students: number
    morningTime: string
    afternoonTime: string
    status: 'active' | 'inactive'
}

const sampleRoutes: TransportRoute[] = [
    { id: '1', routeNo: 'R-001', name: 'DHA Phase 5 Route', bus: 'Bus-01', driver: 'Muhammad Aslam', startPoint: 'DHA Phase 5 Main Gate', endPoint: 'School', stops: 8, students: 38, morningTime: '7:00 AM', afternoonTime: '2:30 PM', status: 'active' },
    { id: '2', routeNo: 'R-002', name: 'Gulberg Route', bus: 'Bus-02', driver: 'Ahmad Khan', startPoint: 'Gulberg III Main Market', endPoint: 'School', stops: 6, students: 42, morningTime: '7:15 AM', afternoonTime: '2:30 PM', status: 'active' },
    { id: '3', routeNo: 'R-003', name: 'Model Town Route', bus: 'Bus-03', driver: 'Hassan Raza', startPoint: 'Model Town Link Road', endPoint: 'School', stops: 7, students: 35, morningTime: '7:00 AM', afternoonTime: '2:30 PM', status: 'active' },
    { id: '4', routeNo: 'R-004', name: 'Johar Town Route', bus: 'Bus-04', driver: 'Farhan Ahmed', startPoint: 'Johar Town Block D', endPoint: 'School', stops: 9, students: 45, morningTime: '6:45 AM', afternoonTime: '2:30 PM', status: 'active' },
    { id: '5', routeNo: 'R-005', name: 'Cantt Area Route', bus: 'Bus-05', driver: 'Imran Ali', startPoint: 'Cantt Railway Station', endPoint: 'School', stops: 5, students: 30, morningTime: '7:30 AM', afternoonTime: '2:30 PM', status: 'active' },
    { id: '6', routeNo: 'R-006', name: 'Garden Town Route', bus: 'Bus-06', driver: 'Bilal Shah', startPoint: 'Garden Town Main Boulevard', endPoint: 'School', stops: 6, students: 32, morningTime: '7:15 AM', afternoonTime: '2:30 PM', status: 'active' },
]

export default function TransportRoutesPage() {
    const [routes] = useState<TransportRoute[]>(sampleRoutes)
    const [searchQuery, setSearchQuery] = useState('')
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

    const filteredRoutes = routes.filter((route) =>
        route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.routeNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.driver.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const totalRoutes = routes.length
    const totalStudents = routes.reduce((acc, r) => acc + r.students, 0)
    const totalStops = routes.reduce((acc, r) => acc + r.stops, 0)

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Route Management</h1>
                    <p className="text-muted-foreground">
                        Manage bus routes and stops
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
                            <DialogTitle>Add New Route</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Route Name</Label>
                                    <Input placeholder="e.g., DHA Phase 5 Route" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Assign Bus</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select bus" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="bus-07">Bus-07 (Available)</SelectItem>
                                            <SelectItem value="bus-08">Bus-08 (Available)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Starting Point</Label>
                                    <Input placeholder="First pickup location" />
                                </div>
                                <div className="space-y-2">
                                    <Label>End Point</Label>
                                    <Input placeholder="School" defaultValue="School" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Assign Driver</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select driver" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="d1">Muhammad Aslam</SelectItem>
                                            <SelectItem value="d2">Ahmad Khan</SelectItem>
                                            <SelectItem value="d3">Hassan Raza</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Pickup Time</Label>
                                    <Input type="time" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                                <Button className="gradient-primary" onClick={() => setIsAddDialogOpen(false)}>Add Route</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Routes</CardTitle>
                        <Route className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalRoutes}</div>
                        <p className="text-xs text-muted-foreground">Active routes</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Students Covered</CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-500">{totalStudents}</div>
                        <p className="text-xs text-muted-foreground">Using transport</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Stops</CardTitle>
                        <MapPin className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{totalStops}</div>
                        <p className="text-xs text-muted-foreground">Pickup points</p>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search routes by name, number, or driver..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Routes Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Route className="h-5 w-5" />
                        All Routes
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Route</TableHead>
                                <TableHead>Bus & Driver</TableHead>
                                <TableHead>Start Point</TableHead>
                                <TableHead className="text-center">Stops</TableHead>
                                <TableHead className="text-center">Students</TableHead>
                                <TableHead>Timings</TableHead>
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
                                                <Route className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{route.name}</p>
                                                <p className="text-xs text-muted-foreground">{route.routeNo}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Bus className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium">{route.bus}</p>
                                                <p className="text-xs text-muted-foreground">{route.driver}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm">
                                            <MapPin className="h-3 w-3 text-muted-foreground" />
                                            {route.startPoint}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">{route.stops}</TableCell>
                                    <TableCell className="text-center font-medium">{route.students}</TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <p className="flex items-center gap-1">
                                                <Clock className="h-3 w-3 text-green-500" />
                                                {route.morningTime}
                                            </p>
                                            <p className="flex items-center gap-1 text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                {route.afternoonTime}
                                            </p>
                                        </div>
                                    </TableCell>
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
                                                    <MapPin className="mr-2 h-4 w-4" />
                                                    View Stops
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Users className="mr-2 h-4 w-4" />
                                                    View Students
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit Route
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
