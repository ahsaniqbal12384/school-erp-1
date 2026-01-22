'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import {
    Bus,
    MapPin,
    Clock,
    Phone,
    User,
    Navigation,
    CheckCircle,
    AlertCircle,
    Calendar,
} from 'lucide-react'

interface TransportInfo {
    childName: string
    class: string
    route: string
    busNumber: string
    driver: string
    driverPhone: string
    conductor: string
    pickupTime: string
    dropTime: string
    pickupStop: string
    dropStop: string
    monthlyFee: number
    status: 'active' | 'inactive'
}

interface TrackingInfo {
    time: string
    location: string
    status: 'completed' | 'current' | 'upcoming'
}

const sampleTransport: TransportInfo[] = [
    {
        childName: 'Ahmed Khan',
        class: 'Class 10-A',
        route: 'Route 5 - Gulberg to School',
        busNumber: 'Bus-05',
        driver: 'Muhammad Aslam',
        driverPhone: '+92-300-1234567',
        conductor: 'Iqbal Ahmed',
        pickupTime: '7:15 AM',
        dropTime: '2:30 PM',
        pickupStop: 'Gulberg III, Main Boulevard',
        dropStop: 'Gulberg III, Main Boulevard',
        monthlyFee: 5000,
        status: 'active',
    },
    {
        childName: 'Fatima Khan',
        class: 'Class 7-B',
        route: 'Route 5 - Gulberg to School',
        busNumber: 'Bus-05',
        driver: 'Muhammad Aslam',
        driverPhone: '+92-300-1234567',
        conductor: 'Iqbal Ahmed',
        pickupTime: '7:15 AM',
        dropTime: '2:30 PM',
        pickupStop: 'Gulberg III, Main Boulevard',
        dropStop: 'Gulberg III, Main Boulevard',
        monthlyFee: 5000,
        status: 'active',
    },
]

const todayTracking: TrackingInfo[] = [
    { time: '7:00 AM', location: 'Bus departed from depot', status: 'completed' },
    { time: '7:10 AM', location: 'Liberty Market Stop', status: 'completed' },
    { time: '7:15 AM', location: 'Gulberg III - Your Stop (Picked Up)', status: 'completed' },
    { time: '7:25 AM', location: 'MM Alam Road Stop', status: 'completed' },
    { time: '7:35 AM', location: 'Cavalry Ground Stop', status: 'current' },
    { time: '7:45 AM', location: 'Arrived at School', status: 'upcoming' },
]

export default function PortalTransportPage() {
    const [transport] = useState<TransportInfo[]>(sampleTransport)
    const [selectedChild, setSelectedChild] = useState<string>('all')
    const [tracking] = useState<TrackingInfo[]>(todayTracking)

    const filteredTransport = transport.filter((t) => {
        return selectedChild === 'all' || t.childName === selectedChild
    })

    const currentTransport = filteredTransport[0]

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Transport</h1>
                    <p className="text-muted-foreground">
                        Track school bus and transport details
                    </p>
                </div>
                <Select value={selectedChild} onValueChange={setSelectedChild}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select child" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Children</SelectItem>
                        <SelectItem value="Ahmed Khan">Ahmed Khan</SelectItem>
                        <SelectItem value="Fatima Khan">Fatima Khan</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Bus Status</CardTitle>
                        <Bus className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">On Route</div>
                        <p className="text-xs text-muted-foreground">Currently moving</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Pickup Time</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{currentTransport?.pickupTime}</div>
                        <p className="text-xs text-muted-foreground">Morning</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Drop Time</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{currentTransport?.dropTime}</div>
                        <p className="text-xs text-muted-foreground">Afternoon</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Fee</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Rs. {(currentTransport?.monthlyFee || 0).toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Per child</p>
                    </CardContent>
                </Card>
            </div>

            {/* Live Tracking */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Navigation className="h-5 w-5 text-primary" />
                            <CardTitle>Live Bus Tracking</CardTitle>
                        </div>
                        <Badge className="bg-green-500/10 text-green-500">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                            Live
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        {tracking.map((point, index) => (
                            <div key={index} className="flex gap-4 pb-6 last:pb-0">
                                <div className="relative flex flex-col items-center">
                                    <div className={`
                    flex h-8 w-8 items-center justify-center rounded-full border-2
                    ${point.status === 'completed' ? 'bg-green-500 border-green-500 text-white' :
                                            point.status === 'current' ? 'bg-primary border-primary text-white animate-pulse' :
                                                'bg-muted border-muted-foreground/30'}
                  `}>
                                        {point.status === 'completed' ? (
                                            <CheckCircle className="h-4 w-4" />
                                        ) : point.status === 'current' ? (
                                            <Bus className="h-4 w-4" />
                                        ) : (
                                            <MapPin className="h-4 w-4" />
                                        )}
                                    </div>
                                    {index < tracking.length - 1 && (
                                        <div className={`
                      w-0.5 h-full absolute top-8
                      ${point.status === 'completed' ? 'bg-green-500' : 'bg-muted-foreground/30'}
                    `} />
                                    )}
                                </div>
                                <div className="flex-1 pb-2">
                                    <div className="flex items-center justify-between">
                                        <p className={`font-medium ${point.status === 'current' ? 'text-primary' : ''}`}>
                                            {point.location}
                                        </p>
                                        <span className="text-sm text-muted-foreground">{point.time}</span>
                                    </div>
                                    {point.status === 'current' && (
                                        <Badge className="mt-1 bg-primary/10 text-primary">Bus is here</Badge>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Transport Details */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bus className="h-5 w-5" />
                        Transport Details
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Child</TableHead>
                                <TableHead>Route</TableHead>
                                <TableHead>Bus</TableHead>
                                <TableHead>Pickup Stop</TableHead>
                                <TableHead>Schedule</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTransport.map((t, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{t.childName}</p>
                                            <p className="text-sm text-muted-foreground">{t.class}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            <MapPin className="mr-1 h-3 w-3" />
                                            {t.route}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">{t.busNumber}</TableCell>
                                    <TableCell className="text-sm">{t.pickupStop}</TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <p>Pickup: {t.pickupTime}</p>
                                            <p className="text-muted-foreground">Drop: {t.dropTime}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {t.status === 'active' ? (
                                            <Badge className="bg-green-500/10 text-green-500">Active</Badge>
                                        ) : (
                                            <Badge variant="outline">Inactive</Badge>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Driver Contact */}
            <Card>
                <CardHeader>
                    <CardTitle>Driver & Staff Contact</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                <User className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">{currentTransport?.driver}</p>
                                <p className="text-sm text-muted-foreground">Driver</p>
                            </div>
                            <Button variant="outline" size="sm">
                                <Phone className="mr-2 h-4 w-4" />
                                Call
                            </Button>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                <User className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">{currentTransport?.conductor}</p>
                                <p className="text-sm text-muted-foreground">Conductor</p>
                            </div>
                            <Button variant="outline" size="sm">
                                <Phone className="mr-2 h-4 w-4" />
                                Call
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
