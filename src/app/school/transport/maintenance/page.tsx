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
    Wrench,
    Search,
    Plus,
    Bus,
    Calendar,
    AlertCircle,
    CheckCircle,
    Clock,
    Fuel,
} from 'lucide-react'

interface MaintenanceRecord {
    id: string
    bus: string
    type: 'scheduled' | 'repair' | 'inspection'
    description: string
    date: string
    cost: number
    vendor: string
    status: 'completed' | 'scheduled' | 'in-progress' | 'overdue'
}

const sampleRecords: MaintenanceRecord[] = [
    { id: '1', bus: 'Bus-01', type: 'scheduled', description: 'Oil Change & Filter Replacement', date: '2024-01-15', cost: 15000, vendor: 'Auto Care Service', status: 'completed' },
    { id: '2', bus: 'Bus-02', type: 'repair', description: 'Break Pad Replacement', date: '2024-01-18', cost: 25000, vendor: 'City Motors', status: 'in-progress' },
    { id: '3', bus: 'Bus-03', type: 'inspection', description: 'Annual Fitness Inspection', date: '2024-01-20', cost: 5000, vendor: 'Motor Vehicle Authority', status: 'scheduled' },
    { id: '4', bus: 'Bus-04', type: 'scheduled', description: 'Tire Rotation & Balance', date: '2024-01-10', cost: 8000, vendor: 'Tire Shop', status: 'completed' },
    { id: '5', bus: 'Bus-05', type: 'repair', description: 'AC Compressor Repair', date: '2024-01-08', cost: 45000, vendor: 'Auto AC Experts', status: 'completed' },
    { id: '6', bus: 'Bus-06', type: 'scheduled', description: 'Engine Tuning', date: '2024-01-05', cost: 12000, vendor: 'Auto Care Service', status: 'overdue' },
]

export default function MaintenancePage() {
    const [records] = useState<MaintenanceRecord[]>(sampleRecords)
    const [searchQuery, setSearchQuery] = useState('')
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

    const filteredRecords = records.filter((record) =>
        record.bus.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const totalCost = records.reduce((acc, r) => acc + r.cost, 0)
    const scheduledCount = records.filter((r) => r.status === 'scheduled').length
    const overdueCount = records.filter((r) => r.status === 'overdue').length

    const getStatusBadge = (status: MaintenanceRecord['status']) => {
        switch (status) {
            case 'completed':
                return <Badge className="bg-green-500/10 text-green-500">Completed</Badge>
            case 'scheduled':
                return <Badge className="bg-blue-500/10 text-blue-500">Scheduled</Badge>
            case 'in-progress':
                return <Badge className="bg-yellow-500/10 text-yellow-500">In Progress</Badge>
            case 'overdue':
                return <Badge className="bg-red-500/10 text-red-500">Overdue</Badge>
        }
    }

    const getTypeBadge = (type: MaintenanceRecord['type']) => {
        switch (type) {
            case 'scheduled':
                return <Badge variant="outline">Scheduled</Badge>
            case 'repair':
                return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Repair</Badge>
            case 'inspection':
                return <Badge variant="outline" className="border-blue-500 text-blue-500">Inspection</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Vehicle Maintenance</h1>
                    <p className="text-muted-foreground">
                        Track vehicle maintenance and service records
                    </p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gradient-primary">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Record
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Maintenance Record</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Bus</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select bus" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[1, 2, 3, 4, 5, 6].map((n) => (
                                                <SelectItem key={n} value={`bus-${n}`}>Bus-0{n}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Type</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="scheduled">Scheduled Maintenance</SelectItem>
                                            <SelectItem value="repair">Repair</SelectItem>
                                            <SelectItem value="inspection">Inspection</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Input placeholder="Maintenance description" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Date</Label>
                                    <Input type="date" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Cost (Rs.)</Label>
                                    <Input type="number" placeholder="0" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Vendor/Service Provider</Label>
                                <Input placeholder="Vendor name" />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                                <Button className="gradient-primary" onClick={() => setIsAddDialogOpen(false)}>Add Record</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Overdue Alert */}
            {overdueCount > 0 && (
                <Card className="border-red-500/50 bg-red-500/5">
                    <CardContent className="py-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                                <AlertCircle className="h-6 w-6 text-red-500" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-red-500">{overdueCount} Overdue Service(s)</p>
                                <p className="text-sm text-muted-foreground">
                                    Some vehicles have pending maintenance that is overdue
                                </p>
                            </div>
                            <Button variant="outline">View Overdue</Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Records</CardTitle>
                        <Wrench className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{records.length}</div>
                        <p className="text-xs text-muted-foreground">This year</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
                        <Fuel className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">Rs. {(totalCost / 1000).toFixed(0)}K</div>
                        <p className="text-xs text-muted-foreground">Maintenance expenses</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
                        <Clock className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-500">{scheduledCount}</div>
                        <p className="text-xs text-muted-foreground">Upcoming</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">{overdueCount}</div>
                        <p className="text-xs text-muted-foreground">Need attention</p>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search maintenance records..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Records Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Wrench className="h-5 w-5" />
                        Maintenance Records
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Bus</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Vendor</TableHead>
                                <TableHead className="text-right">Cost</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredRecords.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Bus className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">{record.bus}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{getTypeBadge(record.type)}</TableCell>
                                    <TableCell>{record.description}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm">
                                            <Calendar className="h-3 w-3 text-muted-foreground" />
                                            {new Date(record.date).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell>{record.vendor}</TableCell>
                                    <TableCell className="text-right font-medium">Rs. {record.cost.toLocaleString()}</TableCell>
                                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
