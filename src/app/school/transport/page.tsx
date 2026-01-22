'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Bus,
    Users,
    MapPin,
    Navigation,
    AlertCircle,
    CheckCircle,
    Clock,
    Phone,
    Route,
    Fuel,
} from 'lucide-react'
import Link from 'next/link'

const stats = [
    {
        title: 'Total Buses',
        value: '12',
        description: 'In fleet',
        icon: Bus,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
    },
    {
        title: 'Active Routes',
        value: '10',
        description: 'Currently running',
        icon: Route,
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
    },
    {
        title: 'Students',
        value: '850',
        description: 'Using transport',
        icon: Users,
        color: 'text-purple-500',
        bgColor: 'bg-purple-500/10',
    },
    {
        title: 'Maintenance Due',
        value: '2',
        description: 'Need attention',
        icon: AlertCircle,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
    },
]

const activeRoutes = [
    { id: '1', route: 'Route 1 - DHA Phase 5', bus: 'Bus-01', driver: 'Muhammad Aslam', students: 38, status: 'on-route', lastLocation: 'DHA Phase 5 Main Gate' },
    { id: '2', route: 'Route 2 - Gulberg', bus: 'Bus-02', driver: 'Ahmad Khan', students: 42, status: 'on-route', lastLocation: 'Gulberg III' },
    { id: '3', route: 'Route 3 - Model Town', bus: 'Bus-03', driver: 'Hassan Raza', students: 35, status: 'completed', lastLocation: 'School' },
    { id: '4', route: 'Route 4 - Johar Town', bus: 'Bus-04', driver: 'Farhan Ahmed', students: 45, status: 'on-route', lastLocation: 'Johar Town Block D' },
    { id: '5', route: 'Route 5 - Cantt', bus: 'Bus-05', driver: 'Imran Ali', students: 30, status: 'delayed', lastLocation: 'Cantt Main Road' },
]

const drivers = [
    { name: 'Muhammad Aslam', phone: '+92-300-1234567', bus: 'Bus-01', status: 'on-duty' },
    { name: 'Ahmad Khan', phone: '+92-300-2345678', bus: 'Bus-02', status: 'on-duty' },
    { name: 'Hassan Raza', phone: '+92-300-3456789', bus: 'Bus-03', status: 'available' },
    { name: 'Farhan Ahmed', phone: '+92-300-4567890', bus: 'Bus-04', status: 'on-duty' },
]

export default function TransportDashboard() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Transport Dashboard</h1>
                    <p className="text-muted-foreground">
                        Manage buses, routes, and drivers
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" asChild>
                        <Link href="/school/transport/tracking">
                            <Navigation className="mr-2 h-4 w-4" />
                            Live Tracking
                        </Link>
                    </Button>
                    <Button className="gradient-primary" asChild>
                        <Link href="/school/transport/routes">
                            <Route className="mr-2 h-4 w-4" />
                            Manage Routes
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card key={index} className="card-hover">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.bgColor}`}>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">{stat.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Delayed Alert */}
            <Card className="border-yellow-500/50 bg-yellow-500/5">
                <CardContent className="py-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10">
                            <Clock className="h-6 w-6 text-yellow-500" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-yellow-500">Route 5 - Cantt Delayed</p>
                            <p className="text-sm text-muted-foreground">
                                Bus-05 is running 15 minutes behind schedule due to traffic
                            </p>
                        </div>
                        <Button variant="outline">Notify Parents</Button>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Active Routes */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Route className="h-5 w-5" />
                                    Active Routes
                                </CardTitle>
                                <CardDescription>Current route status</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/school/transport/routes">View All</Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {activeRoutes.map((route) => (
                                <div key={route.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${route.status === 'completed' ? 'bg-green-500/10' :
                                                route.status === 'delayed' ? 'bg-yellow-500/10' : 'bg-blue-500/10'
                                            }`}>
                                            <Bus className={`h-5 w-5 ${route.status === 'completed' ? 'text-green-500' :
                                                    route.status === 'delayed' ? 'text-yellow-500' : 'text-blue-500'
                                                }`} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{route.route}</p>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                {route.lastLocation}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant="outline" className="mb-1">{route.students} students</Badge>
                                        <br />
                                        {route.status === 'completed' ? (
                                            <Badge className="bg-green-500/10 text-green-500">Completed</Badge>
                                        ) : route.status === 'delayed' ? (
                                            <Badge className="bg-yellow-500/10 text-yellow-500">Delayed</Badge>
                                        ) : (
                                            <Badge className="bg-blue-500/10 text-blue-500">On Route</Badge>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Drivers */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Drivers
                                </CardTitle>
                                <CardDescription>Driver status and contact</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {drivers.map((driver, index) => (
                                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                                    <div className="flex items-center gap-3">
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${driver.status === 'on-duty' ? 'bg-green-500/10' : 'bg-gray-500/10'
                                            }`}>
                                            <Users className={`h-5 w-5 ${driver.status === 'on-duty' ? 'text-green-500' : 'text-gray-500'
                                                }`} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{driver.name}</p>
                                            <p className="text-xs text-muted-foreground">{driver.bus}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button size="sm" variant="ghost">
                                            <Phone className="h-4 w-4" />
                                        </Button>
                                        {driver.status === 'on-duty' ? (
                                            <Badge className="bg-green-500/10 text-green-500">On Duty</Badge>
                                        ) : (
                                            <Badge variant="outline">Available</Badge>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-4">
                <Link href="/school/transport/tracking">
                    <Card className="card-hover cursor-pointer">
                        <CardContent className="pt-6 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 mx-auto mb-3">
                                <Navigation className="h-6 w-6 text-blue-500" />
                            </div>
                            <p className="font-medium">Live Tracking</p>
                            <p className="text-xs text-muted-foreground">Track all buses</p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/school/transport/routes">
                    <Card className="card-hover cursor-pointer">
                        <CardContent className="pt-6 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 mx-auto mb-3">
                                <Route className="h-6 w-6 text-green-500" />
                            </div>
                            <p className="font-medium">Routes</p>
                            <p className="text-xs text-muted-foreground">Manage routes</p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/school/transport/drivers">
                    <Card className="card-hover cursor-pointer">
                        <CardContent className="pt-6 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10 mx-auto mb-3">
                                <Users className="h-6 w-6 text-purple-500" />
                            </div>
                            <p className="font-medium">Drivers</p>
                            <p className="text-xs text-muted-foreground">Driver management</p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/school/transport/maintenance">
                    <Card className="card-hover cursor-pointer">
                        <CardContent className="pt-6 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10 mx-auto mb-3">
                                <Fuel className="h-6 w-6 text-orange-500" />
                            </div>
                            <p className="font-medium">Maintenance</p>
                            <p className="text-xs text-muted-foreground">Vehicle service</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    )
}
