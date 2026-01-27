'use client'

import { useState, useEffect, useCallback } from 'react'
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
    Loader2,
    Coffee,
    Users,
} from 'lucide-react'
import { useTenant } from '@/lib/tenant'
import { useAuth } from '@/lib/auth'

interface Period {
    id: string
    name: string
    start_time: string
    end_time: string
    period_order: number
    is_break: boolean
}

interface TimetableEntry {
    id: string
    day_of_week: number
    room: string
    class: { id: string; name: string; section: string }
    subject: { id: string; name: string; code: string }
    period: Period
}

interface ClassOption {
    id: string
    name: string
    section: string
}

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function TeacherTimetablePage() {
    const { school } = useTenant()
    const { user } = useAuth()
    const [periods, setPeriods] = useState<Period[]>([])
    const [timetable, setTimetable] = useState<TimetableEntry[]>([])
    const [classes, setClasses] = useState<ClassOption[]>([])
    const [selectedClass, setSelectedClass] = useState<string>('')
    const [viewMode, setViewMode] = useState<'teacher' | 'class'>('teacher')
    const [loading, setLoading] = useState(true)

    // Working days (Monday to Saturday for Pakistan)
    const workingDays = [1, 2, 3, 4, 5, 6]

    const fetchData = useCallback(async () => {
        if (!school?.id) return

        try {
            setLoading(true)

            // Fetch periods
            const periodsRes = await fetch(`/api/timetable/periods?school_id=${school.id}`)
            if (periodsRes.ok) {
                const { data } = await periodsRes.json()
                setPeriods(data || [])
            }

            // Fetch classes
            const classesRes = await fetch(`/api/classes?school_id=${school.id}`)
            if (classesRes.ok) {
                const { data } = await classesRes.json()
                setClasses(data || [])
            }

            // Fetch timetable based on view mode
            let timetableUrl = `/api/timetable?school_id=${school.id}`
            if (viewMode === 'teacher' && user?.id) {
                timetableUrl += `&teacher_id=${user.id}`
            } else if (viewMode === 'class' && selectedClass) {
                timetableUrl += `&class_id=${selectedClass}`
            }

            const timetableRes = await fetch(timetableUrl)
            if (timetableRes.ok) {
                const { data } = await timetableRes.json()
                setTimetable(data || [])
            }
        } catch (error) {
            console.error('Error fetching timetable:', error)
        } finally {
            setLoading(false)
        }
    }, [school?.id, user?.id, viewMode, selectedClass])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const getTimetableCell = (periodId: string, dayOfWeek: number) => {
        const entry = timetable.find(
            t => t.period.id === periodId && t.day_of_week === dayOfWeek
        )
        return entry
    }

    const formatTime = (time: string) => {
        try {
            return new Date(`2024-01-01T${time}`).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            })
        } catch {
            return time
        }
    }

    // Calculate stats
    const totalPeriods = timetable.length
    const uniqueClasses = [...new Set(timetable.map(t => t.class?.id))].length
    const todayDay = new Date().getDay()
    const todayClasses = timetable.filter(t => t.day_of_week === todayDay).length

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Timetable</h1>
                    <p className="text-muted-foreground">
                        View your weekly class schedule
                    </p>
                </div>
                <div className="flex gap-3">
                    <Select value={viewMode} onValueChange={(v) => setViewMode(v as typeof viewMode)}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="teacher">My Schedule</SelectItem>
                            <SelectItem value="class">Class View</SelectItem>
                        </SelectContent>
                    </Select>
                    {viewMode === 'class' && (
                        <Select value={selectedClass} onValueChange={setSelectedClass}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent>
                                {classes.map((cls) => (
                                    <SelectItem key={cls.id} value={cls.id}>
                                        {cls.name} {cls.section}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Periods/Week</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalPeriods}</div>
                        <p className="text-xs text-muted-foreground">This week</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Classes</CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-500">{uniqueClasses}</div>
                        <p className="text-xs text-muted-foreground">Different classes</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Today</CardTitle>
                        <Calendar className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{todayClasses}</div>
                        <p className="text-xs text-muted-foreground">{dayNames[todayDay]}&apos;s classes</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Current Day</CardTitle>
                        <Calendar className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-500">{dayNames[todayDay]}</div>
                        <p className="text-xs text-muted-foreground">{new Date().toLocaleDateString()}</p>
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
                    {periods.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <Clock className="h-12 w-12 mb-4 opacity-50" />
                            <p>No periods configured</p>
                            <p className="text-sm">Ask administrator to set up period timings</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[800px]">
                                <thead>
                                    <tr>
                                        <th className="p-3 text-left font-medium text-muted-foreground border-b w-[120px]">
                                            Time
                                        </th>
                                        {workingDays.map((day) => (
                                            <th
                                                key={day}
                                                className={`p-3 text-center font-medium border-b ${
                                                    day === todayDay ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                                                }`}
                                            >
                                                {shortDays[day]}
                                                {day === todayDay && (
                                                    <Badge className="ml-2 text-xs">Today</Badge>
                                                )}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {periods.map((period) => (
                                        <tr key={period.id} className={period.is_break ? 'bg-orange-500/5' : ''}>
                                            <td className="p-3 border-b">
                                                <div className="flex items-center gap-2">
                                                    {period.is_break ? (
                                                        <Coffee className="h-4 w-4 text-orange-500" />
                                                    ) : (
                                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-sm">{period.name}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {formatTime(period.start_time)} - {formatTime(period.end_time)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            {workingDays.map((day) => {
                                                if (period.is_break) {
                                                    return (
                                                        <td key={day} className="p-3 border-b text-center">
                                                            <Badge variant="outline" className="bg-orange-500/10 text-orange-500">
                                                                <Coffee className="h-3 w-3 mr-1" />
                                                                Break
                                                            </Badge>
                                                        </td>
                                                    )
                                                }

                                                const entry = getTimetableCell(period.id, day)
                                                return (
                                                    <td
                                                        key={day}
                                                        className={`p-2 border-b ${
                                                            day === todayDay ? 'bg-primary/5' : ''
                                                        }`}
                                                    >
                                                        {entry ? (
                                                            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                                                                <div className="flex items-center gap-1 mb-1">
                                                                    <BookOpen className="h-3 w-3 text-primary" />
                                                                    <span className="font-medium text-sm text-primary">
                                                                        {entry.subject?.name || 'N/A'}
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {entry.class?.name} {entry.class?.section}
                                                                </p>
                                                                {entry.room && (
                                                                    <div className="flex items-center gap-1 mt-1">
                                                                        <Building2 className="h-3 w-3 text-muted-foreground" />
                                                                        <span className="text-xs text-muted-foreground">
                                                                            Room {entry.room}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="p-2 text-center text-muted-foreground text-xs">
                                                                Free
                                                            </div>
                                                        )}
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Today's Schedule Card */}
            {todayClasses > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Today&apos;s Schedule - {dayNames[todayDay]}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {periods
                                .filter(p => !p.is_break)
                                .map((period) => {
                                    const entry = getTimetableCell(period.id, todayDay)
                                    if (!entry) return null

                                    return (
                                        <div
                                            key={period.id}
                                            className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                                        >
                                            <div className="text-center min-w-[80px]">
                                                <p className="text-sm font-medium">{period.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatTime(period.start_time)}
                                                </p>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium">{entry.subject?.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {entry.class?.name} {entry.class?.section}
                                                </p>
                                            </div>
                                            {entry.room && (
                                                <Badge variant="outline">
                                                    <Building2 className="h-3 w-3 mr-1" />
                                                    Room {entry.room}
                                                </Badge>
                                            )}
                                        </div>
                                    )
                                })
                                .filter(Boolean)}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
