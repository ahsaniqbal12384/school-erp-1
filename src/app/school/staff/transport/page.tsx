'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
    DialogDescription,
    DialogFooter,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Bus,
    MapPin,
    Users,
    Phone,
    Plus,
    Loader2,
    Edit,
    UserPlus,
} from 'lucide-react'
import { toast } from 'sonner'

type Vehicle = {
    id: string
    vehicle_no: string
    vehicle_type: string
    capacity: number
    driver_name: string
    driver_phone: string
    is_active: boolean
}

type Route = {
    id: string
    name: string
    description: string | null
    monthly_fee: number
    is_active: boolean
}

type StudentTransport = {
    id: string
    pickup_time: string | null
    dropoff_time: string | null
    student: { admission_no: string; father_name: string } | null
    route: { name: string } | null
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
        style: 'currency',
        currency: 'PKR',
        minimumFractionDigits: 0,
    }).format(amount)
}

export default function TransportManagerPage() {
    const supabase = createClient()
    const [vehicles, setVehicles] = useState<Vehicle[]>([])
    const [routes, setRoutes] = useState<Route[]>([])
    const [studentTransport, setStudentTransport] = useState<StudentTransport[]>([])
    const [students, setStudents] = useState<{ id: string; admission_no: string }[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false)
    const [isAssignStudentOpen, setIsAssignStudentOpen] = useState(false)
    const [newVehicle, setNewVehicle] = useState({
        vehicle_no: '',
        vehicle_type: 'bus',
        capacity: 40,
        driver_name: '',
        driver_phone: '',
    })
    const [assignData, setAssignData] = useState({
        student_id: '',
        route_id: '',
        pickup_time: '07:30',
        dropoff_time: '14:00',
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const [vehiclesRes, routesRes, transportRes, studentsRes] = await Promise.all([
                supabase.from('transport_vehicles').select('*').order('vehicle_no'),
                supabase.from('transport_routes').select('*').order('name'),
                supabase.from('student_transport').select('*, student:students(admission_no, father_name), route:transport_routes(name)'),
                supabase.from('students').select('id, admission_no').eq('status', 'active'),
            ])

            if (vehiclesRes.error) throw vehiclesRes.error
            if (routesRes.error) throw routesRes.error

            setVehicles(vehiclesRes.data || [])
            setRoutes(routesRes.data || [])
            setStudentTransport(transportRes.data || [])
            setStudents(studentsRes.data || [])
        } catch (err) {
            console.error('Error fetching data:', err)
            toast.error('Failed to load transport data')
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddVehicle = async () => {
        if (!newVehicle.vehicle_no || !newVehicle.driver_name || !newVehicle.driver_phone) {
            toast.error('Please fill required fields')
            return
        }

        try {
            const { error } = await supabase.from('transport_vehicles').insert({
                school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
                ...newVehicle,
                is_active: true,
            } as any)

            if (error) throw error

            toast.success('Vehicle added!')
            setIsAddVehicleOpen(false)
            setNewVehicle({ vehicle_no: '', vehicle_type: 'bus', capacity: 40, driver_name: '', driver_phone: '' })
            fetchData()
        } catch (err) {
            console.error('Error adding vehicle:', err)
            toast.error('Failed to add vehicle')
        }
    }

    const handleAssignStudent = async () => {
        if (!assignData.student_id || !assignData.route_id) {
            toast.error('Please select student and route')
            return
        }

        try {
            const { error } = await supabase.from('student_transport').insert({
                school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
                student_id: assignData.student_id,
                route_id: assignData.route_id,
                pickup_time: assignData.pickup_time,
                dropoff_time: assignData.dropoff_time,
                is_active: true,
            } as any)

            if (error) throw error

            toast.success('Student assigned to route!')
            setIsAssignStudentOpen(false)
            setAssignData({ student_id: '', route_id: '', pickup_time: '07:30', dropoff_time: '14:00' })
            fetchData()
        } catch (err) {
            console.error('Error assigning student:', err)
            toast.error('Failed to assign student')
        }
    }

    const totalCapacity = vehicles.reduce((sum, v) => sum + v.capacity, 0)
    const assignedStudents = studentTransport.length

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Transport Manager</h1>
                    <p className="text-muted-foreground">Manage vehicles, routes, and student assignments</p>
                </div>
                <div className="flex gap-3">
                    <Dialog open={isAssignStudentOpen} onOpenChange={setIsAssignStudentOpen}>
                        <DialogTrigger asChild>
                            <Button className="btn-premium text-white">
                                <UserPlus className="mr-2 h-4 w-4" />
                                Assign Student
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Assign Student to Route</DialogTitle>
                                <DialogDescription>Assign a student to a transport route</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Student</Label>
                                    <Select value={assignData.student_id} onValueChange={(v) => setAssignData({ ...assignData, student_id: v })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Student" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {students.map((s) => (
                                                <SelectItem key={s.id} value={s.id}>{s.admission_no}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Route</Label>
                                    <Select value={assignData.route_id} onValueChange={(v) => setAssignData({ ...assignData, route_id: v })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Route" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {routes.map((r) => (
                                                <SelectItem key={r.id} value={r.id}>{r.name} - {formatCurrency(r.monthly_fee)}/mo</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Pickup Time</Label>
                                        <Input
                                            type="time"
                                            value={assignData.pickup_time}
                                            onChange={(e) => setAssignData({ ...assignData, pickup_time: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Dropoff Time</Label>
                                        <Input
                                            type="time"
                                            value={assignData.dropoff_time}
                                            onChange={(e) => setAssignData({ ...assignData, dropoff_time: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAssignStudentOpen(false)}>Cancel</Button>
                                <Button onClick={handleAssignStudent}>Assign</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isAddVehicleOpen} onOpenChange={setIsAddVehicleOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Vehicle
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Vehicle</DialogTitle>
                                <DialogDescription>Register a new transport vehicle</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Vehicle No *</Label>
                                        <Input
                                            value={newVehicle.vehicle_no}
                                            onChange={(e) => setNewVehicle({ ...newVehicle, vehicle_no: e.target.value.toUpperCase() })}
                                            placeholder="LEA-1234"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Type</Label>
                                        <Select value={newVehicle.vehicle_type} onValueChange={(v) => setNewVehicle({ ...newVehicle, vehicle_type: v })}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="bus">Bus</SelectItem>
                                                <SelectItem value="coaster">Coaster</SelectItem>
                                                <SelectItem value="hiace">Hiace</SelectItem>
                                                <SelectItem value="van">Van</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Capacity</Label>
                                    <Input
                                        type="number"
                                        value={newVehicle.capacity}
                                        onChange={(e) => setNewVehicle({ ...newVehicle, capacity: parseInt(e.target.value) || 40 })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Driver Name *</Label>
                                        <Input
                                            value={newVehicle.driver_name}
                                            onChange={(e) => setNewVehicle({ ...newVehicle, driver_name: e.target.value })}
                                            placeholder="Driver name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Driver Phone *</Label>
                                        <Input
                                            value={newVehicle.driver_phone}
                                            onChange={(e) => setNewVehicle({ ...newVehicle, driver_phone: e.target.value })}
                                            placeholder="0300-1234567"
                                        />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddVehicleOpen(false)}>Cancel</Button>
                                <Button onClick={handleAddVehicle}>Add Vehicle</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <Bus className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{vehicles.length}</p>
                                <p className="text-xs text-muted-foreground">Vehicles</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                                <MapPin className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{routes.length}</p>
                                <p className="text-xs text-muted-foreground">Routes</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                                <Users className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{assignedStudents}</p>
                                <p className="text-xs text-muted-foreground">Students Assigned</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                                <Users className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{totalCapacity}</p>
                                <p className="text-xs text-muted-foreground">Total Capacity</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="vehicles" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="vehicles" className="gap-2">
                        <Bus className="h-4 w-4" />
                        Vehicles
                    </TabsTrigger>
                    <TabsTrigger value="routes" className="gap-2">
                        <MapPin className="h-4 w-4" />
                        Routes
                    </TabsTrigger>
                    <TabsTrigger value="students" className="gap-2">
                        <Users className="h-4 w-4" />
                        Student Assignments
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="vehicles">
                    <Card>
                        <CardHeader>
                            <CardTitle>Vehicle Fleet</CardTitle>
                            <CardDescription>All registered vehicles</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Vehicle No</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Capacity</TableHead>
                                        <TableHead>Driver</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {vehicles.map((v) => (
                                        <TableRow key={v.id}>
                                            <TableCell className="font-mono font-bold">{v.vehicle_no}</TableCell>
                                            <TableCell className="capitalize">{v.vehicle_type}</TableCell>
                                            <TableCell>{v.capacity} seats</TableCell>
                                            <TableCell>{v.driver_name}</TableCell>
                                            <TableCell>
                                                <span className="flex items-center gap-1 text-sm">
                                                    <Phone className="h-3 w-3" /> {v.driver_phone}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={v.is_active ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}>
                                                    {v.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="routes">
                    <Card>
                        <CardHeader>
                            <CardTitle>Transport Routes</CardTitle>
                            <CardDescription>Defined pickup/dropoff routes</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Route Name</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead className="text-right">Monthly Fee</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {routes.map((r) => (
                                        <TableRow key={r.id}>
                                            <TableCell className="font-medium">{r.name}</TableCell>
                                            <TableCell className="text-muted-foreground">{r.description || '-'}</TableCell>
                                            <TableCell className="text-right font-bold text-primary">{formatCurrency(r.monthly_fee)}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={r.is_active ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}>
                                                    {r.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="students">
                    <Card>
                        <CardHeader>
                            <CardTitle>Student Transport Assignments</CardTitle>
                            <CardDescription>Students assigned to transport routes</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student</TableHead>
                                        <TableHead>Route</TableHead>
                                        <TableHead>Pickup Time</TableHead>
                                        <TableHead>Dropoff Time</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {studentTransport.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                No students assigned yet
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        studentTransport.map((st) => (
                                            <TableRow key={st.id}>
                                                <TableCell className="font-medium">{st.student?.admission_no}</TableCell>
                                                <TableCell>{st.route?.name}</TableCell>
                                                <TableCell>{st.pickup_time || '-'}</TableCell>
                                                <TableCell>{st.dropoff_time || '-'}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
