'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Navigation,
    Bus,
    MapPin,
    Clock,
    Users,
    Phone,
    CheckCircle,
    AlertCircle,
    Loader2,
    RefreshCw,
} from 'lucide-react'
import { toast } from 'sonner'

interface ActiveBus {
    id: string
    busNo: string
    route: string
    driver: string
    driverPhone: string
    currentLocation: string
    students: number
    status: 'on-route' | 'at-stop' | 'completed' | 'delayed'
    eta?: string
    lastUpdate: string
    lat: number
    lng: number
}

const initialBuses: ActiveBus[] = [
    { id: '1', busNo: 'Bus-01', route: 'DHA Phase 5 Route', driver: 'Muhammad Aslam', driverPhone: '+92-300-1234567', currentLocation: 'DHA Phase 5 - Stop 4/8', students: 38, status: 'on-route', eta: '15 mins', lastUpdate: '2 mins ago', lat: 31.4826, lng: 74.3621 },
    { id: '2', busNo: 'Bus-02', route: 'Gulberg Route', driver: 'Ahmad Khan', driverPhone: '+92-300-2345678', currentLocation: 'Gulberg III - Stop 3/6', students: 42, status: 'at-stop', eta: '20 mins', lastUpdate: '1 min ago', lat: 31.5127, lng: 74.3466 },
    { id: '3', busNo: 'Bus-03', route: 'Model Town Route', driver: 'Hassan Raza', driverPhone: '+92-300-3456789', currentLocation: 'School', students: 35, status: 'completed', lastUpdate: '10 mins ago', lat: 31.4823, lng: 74.3294 },
    { id: '4', busNo: 'Bus-04', route: 'Johar Town Route', driver: 'Farhan Ahmed', driverPhone: '+92-300-4567890', currentLocation: 'Johar Town Block D - Stop 5/9', students: 45, status: 'on-route', eta: '25 mins', lastUpdate: '3 mins ago', lat: 31.4691, lng: 74.2733 },
    { id: '5', busNo: 'Bus-05', route: 'Cantt Route', driver: 'Imran Ali', driverPhone: '+92-300-5678901', currentLocation: 'Cantt Main Road - Traffic', students: 30, status: 'delayed', eta: '35 mins', lastUpdate: '5 mins ago', lat: 31.5497, lng: 74.3436 },
    { id: '6', busNo: 'Bus-06', route: 'Garden Town Route', driver: 'Bilal Shah', driverPhone: '+92-300-6789012', currentLocation: 'Garden Town - Stop 2/6', students: 32, status: 'on-route', eta: '30 mins', lastUpdate: '2 mins ago', lat: 31.5017, lng: 74.3223 },
]

export default function LiveTrackingPage() {
    const [activeBuses, setActiveBuses] = useState<ActiveBus[]>(initialBuses)
    const [isMapDialogOpen, setIsMapDialogOpen] = useState(false)
    const [selectedBus, setSelectedBus] = useState<ActiveBus | null>(null)
    const [isNotifying, setIsNotifying] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [lastRefresh, setLastRefresh] = useState(new Date())

    const getStatusBadge = (status: ActiveBus['status']) => {
        switch (status) {
            case 'on-route':
                return <Badge className="bg-blue-500/10 text-blue-500">On Route</Badge>
            case 'at-stop':
                return <Badge className="bg-green-500/10 text-green-500">At Stop</Badge>
            case 'completed':
                return <Badge className="bg-gray-500/10 text-gray-500">Completed</Badge>
            case 'delayed':
                return <Badge className="bg-yellow-500/10 text-yellow-500">Delayed</Badge>
        }
    }

    const onRouteCount = activeBuses.filter((b) => b.status === 'on-route' || b.status === 'at-stop').length
    const completedCount = activeBuses.filter((b) => b.status === 'completed').length
    const delayedCount = activeBuses.filter((b) => b.status === 'delayed').length

    const handleViewMap = () => {
        setSelectedBus(null)
        setIsMapDialogOpen(true)
        toast.info('Opening map view', {
            description: 'Showing all bus locations'
        })
    }

    const handleViewBusOnMap = (bus: ActiveBus) => {
        setSelectedBus(bus)
        setIsMapDialogOpen(true)
        toast.info(`Tracking ${bus.busNo}`, {
            description: bus.currentLocation
        })
    }

    const handleCallDriver = (bus: ActiveBus) => {
        toast.info(`Calling ${bus.driver}`, {
            description: bus.driverPhone
        })
    }

    const handleNotifyParents = async () => {
        setIsNotifying(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1500))
            
            const delayedBuses = activeBuses.filter(b => b.status === 'delayed')
            toast.success('Parents notified successfully', {
                description: `Sent delay notifications for ${delayedBuses.length} bus(es) to affected parents`
            })
        } catch {
            toast.error('Failed to send notifications')
        } finally {
            setIsNotifying(false)
        }
    }

    const handleRefresh = async () => {
        setIsRefreshing(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            // Simulate location updates
            setActiveBuses(buses => buses.map(bus => {
                if (bus.status === 'on-route' || bus.status === 'at-stop') {
                    const timeAgo = Math.floor(Math.random() * 3) + 1
                    return {
                        ...bus,
                        lastUpdate: `${timeAgo} min${timeAgo > 1 ? 's' : ''} ago`,
                    }
                }
                return bus
            }))
            
            setLastRefresh(new Date())
            toast.success('Locations updated')
        } catch {
            toast.error('Failed to refresh')
        } finally {
            setIsRefreshing(false)
        }
    }

    // Auto-refresh every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveBuses(buses => buses.map(bus => {
                if (bus.status === 'on-route' || bus.status === 'at-stop') {
                    return {
                        ...bus,
                        lastUpdate: `${Math.floor(Math.random() * 5) + 1} mins ago`,
                    }
                }
                return bus
            }))
        }, 30000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Live Tracking</h1>
                    <p className="text-muted-foreground">
                        Real-time bus locations and status
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
                        {isRefreshing ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <RefreshCw className="mr-2 h-4 w-4" />
                        )}
                        Refresh
                    </Button>
                    <Button className="gradient-primary" onClick={handleViewMap}>
                        <Navigation className="mr-2 h-4 w-4" />
                        View Map
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Active Buses</CardTitle>
                        <Bus className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-500">{onRouteCount}</div>
                        <p className="text-xs text-muted-foreground">Currently on route</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{completedCount}</div>
                        <p className="text-xs text-muted-foreground">Reached school</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Delayed</CardTitle>
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-500">{delayedCount}</div>
                        <p className="text-xs text-muted-foreground">Behind schedule</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Students</CardTitle>
                        <Users className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-500">
                            {activeBuses.reduce((acc, b) => acc + b.students, 0)}
                        </div>
                        <p className="text-xs text-muted-foreground">In transit</p>
                    </CardContent>
                </Card>
            </div>

            {/* Delayed Alert */}
            {delayedCount > 0 && (
                <Card className="border-yellow-500/50 bg-yellow-500/5">
                    <CardContent className="py-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10">
                                <AlertCircle className="h-6 w-6 text-yellow-500" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-yellow-500">{delayedCount} Bus Delayed</p>
                                <p className="text-sm text-muted-foreground">
                                    Bus-05 running 15 minutes behind schedule due to traffic
                                </p>
                            </div>
                            <Button variant="outline" onClick={handleNotifyParents} disabled={isNotifying}>
                                {isNotifying ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Notifying...
                                    </>
                                ) : (
                                    'Notify Parents'
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Last Update Info */}
            <div className="text-sm text-muted-foreground">
                Last updated: {lastRefresh.toLocaleTimeString()}
            </div>

            {/* Bus Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {activeBuses.map((bus) => (
                    <Card key={bus.id} className={`card-hover ${bus.status === 'delayed' ? 'border-yellow-500/50' : ''}`}>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${bus.status === 'completed' ? 'bg-green-500/10' :
                                            bus.status === 'delayed' ? 'bg-yellow-500/10' : 'bg-blue-500/10'
                                        }`}>
                                        <Bus className={`h-5 w-5 ${bus.status === 'completed' ? 'text-green-500' :
                                                bus.status === 'delayed' ? 'text-yellow-500' : 'text-blue-500'
                                            }`} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">{bus.busNo}</CardTitle>
                                        <p className="text-xs text-muted-foreground">{bus.route}</p>
                                    </div>
                                </div>
                                {getStatusBadge(bus.status)}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">{bus.currentLocation}</p>
                                    <p className="text-xs text-muted-foreground">Updated {bus.lastUpdate}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <span>{bus.students} students</span>
                                </div>
                                {bus.eta && (
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span>ETA: {bus.eta}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t">
                                <div className="text-sm">
                                    <p className="text-muted-foreground">Driver</p>
                                    <p className="font-medium">{bus.driver}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" onClick={() => handleViewBusOnMap(bus)}>
                                        <MapPin className="h-3 w-3" />
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => handleCallDriver(bus)}>
                                        <Phone className="mr-1 h-3 w-3" />
                                        Call
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Map Dialog */}
            <Dialog open={isMapDialogOpen} onOpenChange={setIsMapDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedBus ? `Tracking ${selectedBus.busNo}` : 'All Bus Locations'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        {/* Map Placeholder - In production, integrate with a maps API */}
                        <div className="h-[500px] rounded-lg bg-muted flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-green-500/10" />
                            <div className="text-center z-10">
                                <Navigation className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                <p className="text-lg font-medium">Map View</p>
                                <p className="text-sm text-muted-foreground">
                                    {selectedBus 
                                        ? `${selectedBus.busNo} - ${selectedBus.currentLocation}`
                                        : 'Showing all active buses'
                                    }
                                </p>
                                {selectedBus && (
                                    <div className="mt-4 p-4 bg-background/80 rounded-lg text-left">
                                        <p className="font-medium">{selectedBus.driver}</p>
                                        <p className="text-sm text-muted-foreground">{selectedBus.driverPhone}</p>
                                        <p className="text-sm mt-2">
                                            <span className="text-muted-foreground">Students: </span>
                                            {selectedBus.students}
                                        </p>
                                        {selectedBus.eta && (
                                            <p className="text-sm">
                                                <span className="text-muted-foreground">ETA: </span>
                                                {selectedBus.eta}
                                            </p>
                                        )}
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Coordinates: {selectedBus.lat.toFixed(4)}, {selectedBus.lng.toFixed(4)}
                                        </p>
                                    </div>
                                )}
                            </div>
                            
                            {/* Simulated bus markers */}
                            {!selectedBus && (
                                <div className="absolute inset-0 pointer-events-none">
                                    {activeBuses.map((bus, index) => (
                                        <div
                                            key={bus.id}
                                            className="absolute"
                                            style={{
                                                top: `${20 + (index * 12)}%`,
                                                left: `${15 + (index * 13)}%`,
                                            }}
                                        >
                                            <div className={`flex items-center justify-center h-8 w-8 rounded-full shadow-lg ${
                                                bus.status === 'completed' ? 'bg-green-500' :
                                                bus.status === 'delayed' ? 'bg-yellow-500' : 'bg-blue-500'
                                            }`}>
                                                <Bus className="h-4 w-4 text-white" />
                                            </div>
                                            <p className="text-xs font-medium mt-1 bg-background/80 px-1 rounded">
                                                {bus.busNo}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {selectedBus && (
                            <div className="flex justify-end gap-2 mt-4">
                                <Button variant="outline" onClick={() => setSelectedBus(null)}>
                                    Show All Buses
                                </Button>
                                <Button onClick={() => handleCallDriver(selectedBus)}>
                                    <Phone className="mr-2 h-4 w-4" />
                                    Call Driver
                                </Button>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
