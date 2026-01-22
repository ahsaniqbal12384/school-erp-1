'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Clock,
    Calendar,
    Building2,
    BookOpen,
} from 'lucide-react'

interface TimeSlot {
    time: string
    monday?: ClassSlot
    tuesday?: ClassSlot
    wednesday?: ClassSlot
    thursday?: ClassSlot
    friday?: ClassSlot
    saturday?: ClassSlot
}

interface ClassSlot {
    class: string
    section: string
    subject: string
    room: string
}

const sampleTimetable: TimeSlot[] = [
    {
        time: '8:00 - 8:45',
        monday: { class: 'Class 10', section: 'A', subject: 'Mathematics', room: '201' },
        wednesday: { class: 'Class 10', section: 'A', subject: 'Mathematics', room: '201' },
        friday: { class: 'Class 10', section: 'A', subject: 'Mathematics', room: '201' },
    },
    {
        time: '8:45 - 9:30',
        monday: { class: 'Class 10', section: 'B', subject: 'Mathematics', room: '202' },
        wednesday: { class: 'Class 10', section: 'B', subject: 'Mathematics', room: '202' },
        friday: { class: 'Class 10', section: 'B', subject: 'Mathematics', room: '202' },
    },
    {
        time: '9:30 - 10:15',
        tuesday: { class: 'Class 9', section: 'A', subject: 'Mathematics', room: '105' },
        thursday: { class: 'Class 9', section: 'A', subject: 'Mathematics', room: '105' },
    },
    {
        time: '10:15 - 10:30',
    },
    {
        time: '10:30 - 11:15',
        tuesday: { class: 'Class 9', section: 'B', subject: 'Mathematics', room: '106' },
        thursday: { class: 'Class 9', section: 'B', subject: 'Mathematics', room: '106' },
    },
    {
        time: '11:15 - 12:00',
        monday: { class: 'Class 8', section: 'A', subject: 'Mathematics', room: '103' },
        wednesday: { class: 'Class 8', section: 'A', subject: 'Mathematics', room: '103' },
    },
    {
        time: '12:00 - 12:45',
    },
    {
        time: '12:45 - 1:30',
    },
    {
        time: '1:30 - 2:15',
        monday: { class: 'Class 8', section: 'B', subject: 'Mathematics', room: '104' },
        friday: { class: 'Class 8', section: 'B', subject: 'Mathematics', room: '104' },
    },
    {
        time: '2:15 - 3:00',
        tuesday: { class: 'Class 7', section: 'A', subject: 'Mathematics', room: '101' },
        thursday: { class: 'Class 7', section: 'A', subject: 'Mathematics', room: '101' },
    },
]

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const

export default function TeacherTimetablePage() {
    const [timetable] = useState<TimeSlot[]>(sampleTimetable)
    const [selectedWeek] = useState('current')

    const totalClasses = timetable.reduce((acc, slot) => {
        let count = 0
        days.forEach((day) => {
            if (slot[day]) count++
        })
        return acc + count
    }, 0)

    const todayDay = days[new Date().getDay() - 1] || 'monday'
    const todayClasses = timetable.filter((slot) => slot[todayDay]).length

    const renderCell = (slot: ClassSlot | undefined) => {
        if (!slot) {
            return <div className="h-full min-h-[80px] rounded-lg bg-muted/30" />
        }
        return (
            <div className="h-full min-h-[80px] rounded-lg bg-primary/10 p-3 border border-primary/20 hover:bg-primary/15 transition-colors">
                <div className="flex items-center gap-1 mb-1">
                    <Building2 className="h-3 w-3 text-primary" />
                    <span className="text-sm font-medium">{slot.class}-{slot.section}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <BookOpen className="h-3 w-3" />
                    <span>{slot.subject}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                    Room {slot.room}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Timetable</h1>
                    <p className="text-muted-foreground">
                        Your weekly class schedule
                    </p>
                </div>
                <Select value={selectedWeek}>
                    <SelectTrigger className="w-[200px]">
                        <Calendar className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Select week" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="current">Current Week</SelectItem>
                        <SelectItem value="next">Next Week</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Weekly Classes</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalClasses}</div>
                        <p className="text-xs text-muted-foreground">Total this week</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Today&apos;s Classes</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{todayClasses}</div>
                        <p className="text-xs text-muted-foreground">Scheduled today</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Free Periods</CardTitle>
                        <Clock className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">
                            {timetable.length * 6 - totalClasses}
                        </div>
                        <p className="text-xs text-muted-foreground">This week</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Working Days</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">6</div>
                        <p className="text-xs text-muted-foreground">Mon - Sat</p>
                    </CardContent>
                </Card>
            </div>

            {/* Timetable Grid */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Weekly Schedule
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="p-3 text-left font-medium text-muted-foreground border-b">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            Time
                                        </div>
                                    </th>
                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                                        <th key={day} className="p-3 text-center font-medium border-b min-w-[120px]">
                                            <Badge variant={day.toLowerCase() === todayDay ? 'default' : 'outline'}>
                                                {day}
                                            </Badge>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {timetable.map((slot, index) => (
                                    <tr key={index} className={slot.time === '10:15 - 10:30' || slot.time === '12:00 - 12:45' ? 'bg-muted/20' : ''}>
                                        <td className="p-3 border-b font-medium text-sm whitespace-nowrap">
                                            {slot.time}
                                            {(slot.time === '10:15 - 10:30') && (
                                                <Badge variant="outline" className="ml-2 text-xs">Break</Badge>
                                            )}
                                            {(slot.time === '12:00 - 12:45') && (
                                                <Badge variant="outline" className="ml-2 text-xs">Lunch</Badge>
                                            )}
                                        </td>
                                        <td className="p-2 border-b">{renderCell(slot.monday)}</td>
                                        <td className="p-2 border-b">{renderCell(slot.tuesday)}</td>
                                        <td className="p-2 border-b">{renderCell(slot.wednesday)}</td>
                                        <td className="p-2 border-b">{renderCell(slot.thursday)}</td>
                                        <td className="p-2 border-b">{renderCell(slot.friday)}</td>
                                        <td className="p-2 border-b">{renderCell(slot.saturday)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
