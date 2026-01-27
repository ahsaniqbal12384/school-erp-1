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
    Eye,
    Loader2,
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

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
]

const emptyFormData = {
    name: '',
    bus: '',
    driver: '',
    startPoint: '',
    endPoint: 'School',
    morningTime: '',
}

export default function TransportRoutesPage() {
    const [routes, setRoutes] = useState<TransportRoute[]>(sampleRoutes)
    const [searchQuery, setSearchQuery] = useState('')
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [isStudentsDialogOpen, setIsStudentsDialogOpen] = useState(false)
    const [selectedRoute, setSelectedRoute] = useState<TransportRoute | null>(null)
    const [formData, setFormData] = useState(emptyFormData)
    const [isLoading, setIsLoading] = useState(false)

    const filteredRoutes = routes.filter((route) =>
        route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.routeNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.driver.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const totalRoutes = routes.length
    const totalStudents = routes.reduce((acc, r) => acc + r.students, 0)
    const totalStops = routes.reduce((acc, r) => acc + r.stops, 0)

    const generateRouteNo = () => {
        const nextNum = routes.length + 1
        return `R-${String(nextNum).padStart(3, '0')}`
    }

    const handleAddRoute = async () => {
        if (!formData.name || !formData.bus || !formData.driver || !formData.startPoint || !formData.morningTime) {
            toast.error('Please fill in all required fields')
            return
        }

        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))

            const newRoute: TransportRoute = {
                id: String(routes.length + 1),
                routeNo: generateRouteNo(),
                name: formData.name,
                bus: formData.bus,
                driver: formData.driver,
                startPoint: formData.startPoint,
                endPoint: formData.endPoint,
                stops: 0,
                students: 0,
                morningTime: formData.morningTime,
                afternoonTime: '2:30 PM',
                status: 'active',
            }

            setRoutes([...routes, newRoute])
            setFormData(emptyFormData)
            setIsAddDialogOpen(false)
            toast.success('Route added successfully', {
                description: `${newRoute.name} has been created`
            })
        } catch {
            toast.error('Failed to add route')
        } finally {
            setIsLoading(false)
        }
    }

    const handleEditRoute = async () => {
        if (!selectedRoute || !formData.name) {
            toast.error('Please fill in required fields')
            return
        }

        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))

            setRoutes(routes.map(route =>
                route.id === selectedRoute.id
                    ? {
                        ...route,
                        name: formData.name,
                        bus: formData.bus || route.bus,
                        driver: formData.driver || route.driver,
                        startPoint: formData.startPoint || route.startPoint,
                        endPoint: formData.endPoint,
                        morningTime: formData.morningTime || route.morningTime,
                    }
                    : route
            ))
            setIsEditDialogOpen(false)
            setSelectedRoute(null)
            toast.success('Route updated successfully')
        } catch {
            toast.error('Failed to update route')
        } finally {
            setIsLoading(false)
        }
    }

    const openEditDialog = (route: TransportRoute) => {
        setSelectedRoute(route)
        setFormData({
            name: route.name,
            bus: route.bus,
            driver: route.driver,
            startPoint: route.startPoint,
            endPoint: route.endPoint,
            morningTime: route.morningTime,
        })
        setIsEditDialogOpen(true)
    }

    const openViewDialog = (route: TransportRoute) => {
        setSelectedRoute(route)
        setIsViewDialogOpen(true)
    }

    const openStudentsDialog = (route: TransportRoute) => {
        setSelectedRoute(route)
        setIsStudentsDialogOpen(true)
    }

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
                                    <Label>Route Name *</Label>
                                    <Input
                                        placeholder="e.g., DHA Phase 5 Route"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Assign Bus *</Label>
                                    <Select
                                        value={formData.bus}
                                        onValueChange={(value) => setFormData({ ...formData, bus: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select bus" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Bus-07">Bus-07 (Available)</SelectItem>
                                            <SelectItem value="Bus-08">Bus-08 (Available)</SelectItem>
                                            <SelectItem value="Bus-09">Bus-09 (Available)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Starting Point *</Label>
                                    <Input
                                        placeholder="First pickup location"
                                        value={formData.startPoint}
                                        onChange={(e) => setFormData({ ...formData, startPoint: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>End Point</Label>
                                    <Input
                                        value={formData.endPoint}
                                        onChange={(e) => setFormData({ ...formData, endPoint: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Assign Driver *</Label>
                                    <Select
                                        value={formData.driver}
                                        onValueChange={(value) => setFormData({ ...formData, driver: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select driver" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Muhammad Aslam">Muhammad Aslam</SelectItem>
                                            <SelectItem value="Ahmad Khan">Ahmad Khan</SelectItem>
                                            <SelectItem value="Hassan Raza">Hassan Raza</SelectItem>
                                            <SelectItem value="Farhan Ahmed">Farhan Ahmed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Pickup Time *</Label>
                                    <Input
                                        type="time"
                                        value={formData.morningTime}
                                        onChange={(e) => setFormData({ ...formData, morningTime: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="outline" onClick={() => {
                                    setIsAddDialogOpen(false)
                                    setFormData(emptyFormData)
                                }}>
                                    Cancel
                                </Button>
                                <Button className="gradient-primary" onClick={handleAddRoute} disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Adding...
                                        </>
                                    ) : (
                                        'Add Route'
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
                                <TableHead>Route No</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Bus / Driver</TableHead>
                                <TableHead>Starting Point</TableHead>
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
                                    <TableCell className="font-medium text-primary">{route.routeNo}</TableCell>
                                    <TableCell className="font-medium">{route.name}</TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <p>{route.bus}</p>
                                            <p className="text-muted-foreground">{route.driver}</p>
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
                                                <DropdownMenuItem onClick={() => openViewDialog(route)}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Stops
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => openStudentsDialog(route)}>
                                                    <Users className="mr-2 h-4 w-4" />
                                                    View Students
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => openEditDialog(route)}>
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

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Route</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Route Name *</Label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Assign Bus</Label>
                                <Select
                                    value={formData.bus}
                                    onValueChange={(value) => setFormData({ ...formData, bus: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Bus-01">Bus-01</SelectItem>
                                        <SelectItem value="Bus-02">Bus-02</SelectItem>
                                        <SelectItem value="Bus-03">Bus-03</SelectItem>
                                        <SelectItem value="Bus-04">Bus-04</SelectItem>
                                        <SelectItem value="Bus-05">Bus-05</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Starting Point</Label>
                                <Input
                                    value={formData.startPoint}
                                    onChange={(e) => setFormData({ ...formData, startPoint: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>End Point</Label>
                                <Input
                                    value={formData.endPoint}
                                    onChange={(e) => setFormData({ ...formData, endPoint: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Assign Driver</Label>
                                <Select
                                    value={formData.driver}
                                    onValueChange={(value) => setFormData({ ...formData, driver: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Muhammad Aslam">Muhammad Aslam</SelectItem>
                                        <SelectItem value="Ahmad Khan">Ahmad Khan</SelectItem>
                                        <SelectItem value="Hassan Raza">Hassan Raza</SelectItem>
                                        <SelectItem value="Farhan Ahmed">Farhan Ahmed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Pickup Time</Label>
                                <Input
                                    type="time"
                                    value={formData.morningTime}
                                    onChange={(e) => setFormData({ ...formData, morningTime: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button className="gradient-primary" onClick={handleEditRoute} disabled={isLoading}>
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

            {/* View Stops Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Route Stops - {selectedRoute?.name}</DialogTitle>
                    </DialogHeader>
                    {selectedRoute && (
                        <div className="space-y-4 py-4">
                            <div className="p-4 bg-muted rounded-lg">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total Stops</p>
                                        <p className="text-2xl font-bold">{selectedRoute.stops}</p>
                                    </div>
                                    <MapPin className="h-8 w-8 text-primary" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                {Array.from({ length: selectedRoute.stops }).map((_, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <p className="font-medium">Stop {i + 1}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {i === 0 ? selectedRoute.startPoint : i === selectedRoute.stops - 1 ? selectedRoute.endPoint : `Pickup Point ${i}`}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end">
                                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* View Students Dialog */}
            <Dialog open={isStudentsDialogOpen} onOpenChange={setIsStudentsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Students - {selectedRoute?.name}</DialogTitle>
                    </DialogHeader>
                    {selectedRoute && (
                        <div className="space-y-4 py-4">
                            <div className="p-4 bg-muted rounded-lg">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total Students</p>
                                        <p className="text-2xl font-bold">{selectedRoute.students}</p>
                                    </div>
                                    <Users className="h-8 w-8 text-blue-500" />
                                </div>
                            </div>
                            <div className="border rounded-lg overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Class</TableHead>
                                            <TableHead>Stop</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {Array.from({ length: Math.min(5, selectedRoute.students) }).map((_, i) => (
                                            <TableRow key={i}>
                                                <TableCell className="font-medium">Student {i + 1}</TableCell>
                                                <TableCell>Class {8 + Math.floor(i / 2)}</TableCell>
                                                <TableCell>Stop {(i % selectedRoute.stops) + 1}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            {selectedRoute.students > 5 && (
                                <p className="text-sm text-muted-foreground text-center">
                                    And {selectedRoute.students - 5} more students...
                                </p>
                            )}
                            <div className="flex justify-end">
                                <Button variant="outline" onClick={() => setIsStudentsDialogOpen(false)}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
