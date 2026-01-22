'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Calendar,
    MapPin,
    Clock,
    Users,
    GraduationCap,
    Trophy,
    BookOpen,
    Bell,
} from 'lucide-react'

const upcomingEvents = [
    {
        id: '1',
        title: 'Parent-Teacher Meeting',
        date: '2024-01-25',
        time: '10:00 AM - 2:00 PM',
        location: 'School Auditorium',
        type: 'meeting',
        description: 'Discuss your child\'s academic progress and performance with teachers.',
        forClasses: ['All Classes']
    },
    {
        id: '2',
        title: 'Annual Sports Day',
        date: '2024-02-05',
        time: '8:00 AM - 4:00 PM',
        location: 'School Playground',
        type: 'sports',
        description: 'Annual sports competition with various athletic events.',
        forClasses: ['All Classes']
    },
    {
        id: '3',
        title: 'Science Exhibition',
        date: '2024-02-10',
        time: '9:00 AM - 1:00 PM',
        location: 'Science Lab',
        type: 'exhibition',
        description: 'Students showcase their science projects.',
        forClasses: ['Class 6-10']
    },
    {
        id: '4',
        title: 'Term 2 Exams Begin',
        date: '2024-02-15',
        time: '8:30 AM',
        location: 'Respective Classrooms',
        type: 'exam',
        description: 'Second term examinations for all classes.',
        forClasses: ['All Classes']
    },
    {
        id: '5',
        title: 'Art Competition',
        date: '2024-02-20',
        time: '10:00 AM - 12:00 PM',
        location: 'Art Room',
        type: 'competition',
        description: 'Inter-class art and drawing competition.',
        forClasses: ['Class 1-5']
    },
]

const getEventIcon = (type: string) => {
    switch (type) {
        case 'meeting':
            return Users
        case 'sports':
            return Trophy
        case 'exhibition':
            return BookOpen
        case 'exam':
            return GraduationCap
        case 'competition':
            return Trophy
        default:
            return Calendar
    }
}

const getEventColor = (type: string) => {
    switch (type) {
        case 'meeting':
            return 'bg-blue-500/10 text-blue-500'
        case 'sports':
            return 'bg-green-500/10 text-green-500'
        case 'exhibition':
            return 'bg-purple-500/10 text-purple-500'
        case 'exam':
            return 'bg-red-500/10 text-red-500'
        case 'competition':
            return 'bg-orange-500/10 text-orange-500'
        default:
            return 'bg-gray-500/10 text-gray-500'
    }
}

export default function PortalEventsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">School Events</h1>
                <p className="text-muted-foreground">
                    Upcoming events and important dates
                </p>
            </div>

            {/* Next Event Alert */}
            <Card className="border-primary/50 bg-primary/5">
                <CardContent className="py-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            <Bell className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium">Upcoming: Parent-Teacher Meeting</p>
                            <p className="text-sm text-muted-foreground">
                                January 25, 2024 at 10:00 AM - Don&apos;t forget to attend!
                            </p>
                        </div>
                        <Button>Add to Calendar</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Events List */}
            <div className="grid gap-4">
                {upcomingEvents.map((event) => {
                    const EventIcon = getEventIcon(event.type)
                    return (
                        <Card key={event.id} className="card-hover">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className={`flex h-14 w-14 items-center justify-center rounded-lg ${getEventColor(event.type)}`}>
                                        <EventIcon className="h-7 w-7" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold">{event.title}</h3>
                                                <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                                            </div>
                                            <Badge variant="outline" className="capitalize">{event.type}</Badge>
                                        </div>
                                        <div className="flex flex-wrap gap-4 mt-4">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                {new Date(event.date).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                {event.time}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                                {event.location}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 mt-3">
                                            <span className="text-sm text-muted-foreground">For:</span>
                                            {event.forClasses.map((cls, idx) => (
                                                <Badge key={idx} variant="secondary">{cls}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Calendar Widget */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Event Calendar
                    </CardTitle>
                    <CardDescription>View all events in calendar format</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>Calendar view coming soon</p>
                        <p className="text-sm">View events by month</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
