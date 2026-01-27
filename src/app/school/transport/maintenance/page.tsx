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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Wrench,
    Search,
    Plus,
    Bus,
    Calendar,
    AlertCircle,
    Clock,
    Fuel,
    MoreHorizontal,
    Edit,
    CheckCircle,
    Loader2,
    FileText,
    Download,
} from 'lucide-react'
import { toast } from 'sonner'

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

const emptyFormData = {
    bus: '',
    type: '' as 'scheduled' | 'repair' | 'inspection' | '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    cost: '',
    vendor: '',
}

export default function MaintenancePage() {
    const [records, setRecords] = useState<MaintenanceRecord[]>(sampleRecords)
    const [searchQuery, setSearchQuery] = useState('')
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isOverdueDialogOpen, setIsOverdueDialogOpen] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null)
    const [formData, setFormData] = useState(emptyFormData)
    const [isLoading, setIsLoading] = useState(false)
    const [statusFilter, setStatusFilter] = useState<string>('all')

    const filteredRecords = records.filter((record) => {
        const matchesSearch = record.bus.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'all' || record.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const totalCost = records.reduce((acc, r) => acc + r.cost, 0)
    const scheduledCount = records.filter((r) => r.status === 'scheduled').length
    const overdueCount = records.filter((r) => r.status === 'overdue').length
    const overdueRecords = records.filter((r) => r.status === 'overdue')

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

    const handleAddRecord = async () => {
        if (!formData.bus || !formData.type || !formData.description || !formData.cost || !formData.vendor) {
            toast.error('Please fill in all required fields')
            return
        }

        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))

            const newRecord: MaintenanceRecord = {
                id: String(records.length + 1),
                bus: formData.bus,
                type: formData.type as 'scheduled' | 'repair' | 'inspection',
                description: formData.description,
                date: formData.date,
                cost: parseInt(formData.cost),
                vendor: formData.vendor,
                status: 'scheduled',
            }

            setRecords([newRecord, ...records])
            setFormData(emptyFormData)
            setIsAddDialogOpen(false)
            toast.success('Maintenance record added', {
                description: `${formData.description} scheduled for ${formData.bus}`
            })
        } catch {
            toast.error('Failed to add record')
        } finally {
            setIsLoading(false)
        }
    }

    const handleEditRecord = async () => {
        if (!selectedRecord || !formData.description || !formData.cost) {
            toast.error('Please fill in required fields')
            return
        }

        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))

            setRecords(records.map(record =>
                record.id === selectedRecord.id
                    ? {
                        ...record,
                        description: formData.description,
                        date: formData.date,
                        cost: parseInt(formData.cost),
                        vendor: formData.vendor,
                    }
                    : record
            ))
            setIsEditDialogOpen(false)
            setSelectedRecord(null)
            toast.success('Record updated successfully')
        } catch {
            toast.error('Failed to update record')
        } finally {
            setIsLoading(false)
        }
    }

    const handleMarkComplete = async (record: MaintenanceRecord) => {
        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 500))
            setRecords(records.map(r =>
                r.id === record.id ? { ...r, status: 'completed' } : r
            ))
            toast.success(`${record.bus} maintenance marked as complete`)
        } catch {
            toast.error('Failed to update status')
        } finally {
            setIsLoading(false)
        }
    }

    const handleExportRecords = () => {
        const csvContent = [
            ['Bus', 'Type', 'Description', 'Date', 'Vendor', 'Cost', 'Status'].join(','),
            ...records.map(r => [
                r.bus,
                r.type,
                `"${r.description}"`,
                r.date,
                `"${r.vendor}"`,
                r.cost,
                r.status
            ].join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `maintenance-records-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        URL.revokeObjectURL(url)
        toast.success('Records exported successfully')
    }

    const openEditDialog = (record: MaintenanceRecord) => {
        setSelectedRecord(record)
        setFormData({
            bus: record.bus,
            type: record.type,
            description: record.description,
            date: record.date,
            cost: String(record.cost),
            vendor: record.vendor,
        })
        setIsEditDialogOpen(true)
    }

    const handleViewOverdue = () => {
        setIsOverdueDialogOpen(true)
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
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleExportRecords}>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
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
                                        <Label>Bus *</Label>
                                        <Select
                                            value={formData.bus}
                                            onValueChange={(value) => setFormData({ ...formData, bus: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select bus" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[1, 2, 3, 4, 5, 6].map((n) => (
                                                    <SelectItem key={n} value={`Bus-0${n}`}>Bus-0{n}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Type *</Label>
                                        <Select
                                            value={formData.type}
                                            onValueChange={(value) => setFormData({ ...formData, type: value as 'scheduled' | 'repair' | 'inspection' })}
                                        >
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
                                    <Label>Description *</Label>
                                    <Input
                                        placeholder="Maintenance description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Date</Label>
                                        <Input
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Cost (Rs.) *</Label>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            value={formData.cost}
                                            onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Vendor/Service Provider *</Label>
                                    <Input
                                        placeholder="Vendor name"
                                        value={formData.vendor}
                                        onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <Button variant="outline" onClick={() => {
                                        setIsAddDialogOpen(false)
                                        setFormData(emptyFormData)
                                    }}>
                                        Cancel
                                    </Button>
                                    <Button className="gradient-primary" onClick={handleAddRecord} disabled={isLoading}>
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Adding...
                                            </>
                                        ) : (
                                            'Add Record'
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
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
                            <Button variant="outline" onClick={handleViewOverdue}>View Overdue</Button>
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

            {/* Search and Filter */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search maintenance records..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="scheduled">Scheduled</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="overdue">Overdue</SelectItem>
                            </SelectContent>
                        </Select>
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
                                <TableHead className="text-right">Actions</TableHead>
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
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => openEditDialog(record)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit Record
                                                </DropdownMenuItem>
                                                {record.status !== 'completed' && (
                                                    <DropdownMenuItem onClick={() => handleMarkComplete(record)}>
                                                        <CheckCircle className="mr-2 h-4 w-4" />
                                                        Mark Complete
                                                    </DropdownMenuItem>
                                                )}
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
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Maintenance Record</DialogTitle>
                    </DialogHeader>
                    {selectedRecord && (
                        <div className="grid gap-4 py-4">
                            <div className="p-3 bg-muted rounded-lg">
                                <p className="font-medium">{selectedRecord.bus}</p>
                                <p className="text-sm text-muted-foreground">{getTypeBadge(selectedRecord.type)}</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Input
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Date</Label>
                                    <Input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Cost (Rs.)</Label>
                                    <Input
                                        type="number"
                                        value={formData.cost}
                                        onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Vendor</Label>
                                <Input
                                    value={formData.vendor}
                                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button className="gradient-primary" onClick={handleEditRecord} disabled={isLoading}>
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
                    )}
                </DialogContent>
            </Dialog>

            {/* Overdue Dialog */}
            <Dialog open={isOverdueDialogOpen} onOpenChange={setIsOverdueDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-500">
                            <AlertCircle className="h-5 w-5" />
                            Overdue Maintenance
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        {overdueRecords.length > 0 ? (
                            <div className="space-y-4">
                                {overdueRecords.map((record) => (
                                    <div key={record.id} className="p-4 border border-red-500/30 rounded-lg bg-red-500/5">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <Bus className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">{record.bus}</span>
                                            </div>
                                            {getTypeBadge(record.type)}
                                        </div>
                                        <p className="text-sm mb-2">{record.description}</p>
                                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                                            <span>Due: {new Date(record.date).toLocaleDateString()}</span>
                                            <span>Rs. {record.cost.toLocaleString()}</span>
                                        </div>
                                        <Button
                                            size="sm"
                                            className="mt-3 w-full"
                                            onClick={() => {
                                                handleMarkComplete(record)
                                                setIsOverdueDialogOpen(false)
                                            }}
                                        >
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                            Mark as Completed
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                                <p className="text-lg font-medium">All caught up!</p>
                                <p className="text-sm text-muted-foreground">No overdue maintenance records</p>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
