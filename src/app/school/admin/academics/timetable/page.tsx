'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Clock,
    Calendar,
    Plus,
    Save,
    Trash2,
    Loader2,
    Coffee,
    Settings,
} from 'lucide-react'
import { useTenant } from '@/lib/tenant'
import { toast } from 'sonner'

interface Period {
    id?: string
    name: string
    start_time: string
    end_time: string
    period_order: number
    is_break: boolean
}

interface ClassOption {
    id: string
    name: string
    section: string
}

interface SubjectOption {
    id: string
    name: string
    code: string
}

interface TeacherOption {
    id: string
    first_name: string
    last_name: string
}

interface TimetableEntry {
    period_id: string
    day_of_week: number
    subject_id?: string
    teacher_id?: string
    room?: string
}

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const workingDays = [1, 2, 3, 4, 5, 6] // Monday to Saturday

export default function TimetableManagementPage() {
    const { school } = useTenant()
    const [periods, setPeriods] = useState<Period[]>([])
    const [classes, setClasses] = useState<ClassOption[]>([])
    const [subjects, setSubjects] = useState<SubjectOption[]>([])
    const [teachers, setTeachers] = useState<TeacherOption[]>([])
    const [timetable, setTimetable] = useState<TimetableEntry[]>([])

    const [selectedClass, setSelectedClass] = useState('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [isPeriodDialogOpen, setIsPeriodDialogOpen] = useState(false)

    // New period form
    const [newPeriods, setNewPeriods] = useState<Period[]>([
        { name: 'Period 1', start_time: '08:00', end_time: '08:45', period_order: 1, is_break: false },
        { name: 'Period 2', start_time: '08:45', end_time: '09:30', period_order: 2, is_break: false },
        { name: 'Break', start_time: '09:30', end_time: '10:00', period_order: 3, is_break: true },
        { name: 'Period 3', start_time: '10:00', end_time: '10:45', period_order: 4, is_break: false },
        { name: 'Period 4', start_time: '10:45', end_time: '11:30', period_order: 5, is_break: false },
        { name: 'Period 5', start_time: '11:30', end_time: '12:15', period_order: 6, is_break: false },
        { name: 'Lunch', start_time: '12:15', end_time: '13:00', period_order: 7, is_break: true },
        { name: 'Period 6', start_time: '13:00', end_time: '13:45', period_order: 8, is_break: false },
        { name: 'Period 7', start_time: '13:45', end_time: '14:30', period_order: 9, is_break: false },
    ])

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            if (!school?.id) return

            try {
                setLoading(true)
                const [periodsRes, classesRes, subjectsRes] = await Promise.all([
                    fetch(`/api/timetable/periods?school_id=${school.id}`),
                    fetch(`/api/classes?school_id=${school.id}`),
                    fetch(`/api/subjects?school_id=${school.id}`)
                ])

                if (periodsRes.ok) {
                    const { data } = await periodsRes.json()
                    setPeriods(data || [])
                }
                if (classesRes.ok) {
                    const { data } = await classesRes.json()
                    setClasses(data || [])
                    if (data?.length > 0) {
                        setSelectedClass(data[0].id)
                    }
                }
                if (subjectsRes.ok) {
                    const { data } = await subjectsRes.json()
                    setSubjects(data || [])
                }

                // Fetch teachers (users with role teacher)
                // For now, we'll leave this empty as we need a users API
                setTeachers([])
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [school?.id])

    // Fetch timetable when class changes
    const fetchTimetable = useCallback(async () => {
        if (!school?.id || !selectedClass) return

        try {
            const response = await fetch(`/api/timetable?school_id=${school.id}&class_id=${selectedClass}`)
            if (response.ok) {
                const { data } = await response.json()
                // Convert to our format
                const entries: TimetableEntry[] = data?.map((e: { period: { id: string }; day_of_week: number; subject?: { id: string }; teacher?: { id: string }; room?: string }) => ({
                    period_id: e.period?.id,
                    day_of_week: e.day_of_week,
                    subject_id: e.subject?.id,
                    teacher_id: e.teacher?.id,
                    room: e.room
                })) || []
                setTimetable(entries)
            }
        } catch (error) {
            console.error('Error fetching timetable:', error)
        }
    }, [school?.id, selectedClass])

    useEffect(() => {
        fetchTimetable()
    }, [fetchTimetable])

    const savePeriods = async () => {
        if (!school?.id) return

        setSaving(true)
        try {
            // Delete existing periods first
            await fetch(`/api/timetable/periods?school_id=${school.id}`, {
                method: 'DELETE'
            })

            // Create new periods
            const response = await fetch('/api/timetable/periods', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    school_id: school.id,
                    periods: newPeriods
                })
            })

            if (!response.ok) throw new Error('Failed to save periods')

            const { data } = await response.json()
            setPeriods(data)
            toast.success('Periods saved successfully!')
            setIsPeriodDialogOpen(false)
        } catch (error) {
            console.error('Error saving periods:', error)
            toast.error('Failed to save periods')
        } finally {
            setSaving(false)
        }
    }

    const updateTimetableEntry = (periodId: string, dayOfWeek: number, field: string, value: string) => {
        setTimetable(prev => {
            const existingIndex = prev.findIndex(
                e => e.period_id === periodId && e.day_of_week === dayOfWeek
            )

            if (existingIndex >= 0) {
                const updated = [...prev]
                updated[existingIndex] = { ...updated[existingIndex], [field]: value || undefined }
                return updated
            } else {
                return [...prev, {
                    period_id: periodId,
                    day_of_week: dayOfWeek,
                    [field]: value || undefined
                }]
            }
        })
    }

    const saveTimetable = async () => {
        if (!school?.id || !selectedClass) {
            toast.error('Please select a class')
            return
        }

        setSaving(true)
        try {
            // Filter out entries without subject
            const validEntries = timetable.filter(e => e.subject_id)

            const response = await fetch('/api/timetable', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    school_id: school.id,
                    class_id: selectedClass,
                    entries: validEntries
                })
            })

            if (!response.ok) throw new Error('Failed to save timetable')

            const { count } = await response.json()
            toast.success(`Timetable saved! ${count} entries created.`)
        } catch (error) {
            console.error('Error saving timetable:', error)
            toast.error('Failed to save timetable')
        } finally {
            setSaving(false)
        }
    }

    const getEntry = (periodId: string, dayOfWeek: number) => {
        return timetable.find(
            e => e.period_id === periodId && e.day_of_week === dayOfWeek
        )
    }

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
                    <h1 className="text-3xl font-bold tracking-tight">Timetable Management</h1>
                    <p className="text-muted-foreground">
                        Configure periods and create class timetables
                    </p>
                </div>
                <div className="flex gap-3">
                    <Dialog open={isPeriodDialogOpen} onOpenChange={setIsPeriodDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <Settings className="mr-2 h-4 w-4" />
                                Configure Periods
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Configure School Periods</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Start</TableHead>
                                            <TableHead>End</TableHead>
                                            <TableHead>Break?</TableHead>
                                            <TableHead></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {newPeriods.map((period, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <Input
                                                        value={period.name}
                                                        onChange={(e) => {
                                                            const updated = [...newPeriods]
                                                            updated[index].name = e.target.value
                                                            setNewPeriods(updated)
                                                        }}
                                                        className="w-[120px]"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="time"
                                                        value={period.start_time}
                                                        onChange={(e) => {
                                                            const updated = [...newPeriods]
                                                            updated[index].start_time = e.target.value
                                                            setNewPeriods(updated)
                                                        }}
                                                        className="w-[100px]"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="time"
                                                        value={period.end_time}
                                                        onChange={(e) => {
                                                            const updated = [...newPeriods]
                                                            updated[index].end_time = e.target.value
                                                            setNewPeriods(updated)
                                                        }}
                                                        className="w-[100px]"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <input
                                                        type="checkbox"
                                                        checked={period.is_break}
                                                        onChange={(e) => {
                                                            const updated = [...newPeriods]
                                                            updated[index].is_break = e.target.checked
                                                            setNewPeriods(updated)
                                                        }}
                                                        className="h-4 w-4"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => {
                                                            setNewPeriods(newPeriods.filter((_, i) => i !== index))
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setNewPeriods([
                                            ...newPeriods,
                                            {
                                                name: `Period ${newPeriods.length + 1}`,
                                                start_time: '08:00',
                                                end_time: '08:45',
                                                period_order: newPeriods.length + 1,
                                                is_break: false
                                            }
                                        ])
                                    }}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Period
                                </Button>
                                <div className="flex justify-end gap-3 pt-4">
                                    <Button variant="outline" onClick={() => setIsPeriodDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={savePeriods} disabled={saving}>
                                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Save Periods
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <Button className="gradient-primary" onClick={saveTimetable} disabled={saving || !selectedClass}>
                        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Timetable
                    </Button>
                </div>
            </div>

            {/* Class Selection */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                        <Label>Select Class:</Label>
                        <Select value={selectedClass} onValueChange={setSelectedClass}>
                            <SelectTrigger className="w-[200px]">
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
                    </div>
                </CardContent>
            </Card>

            {/* Timetable Grid */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Class Timetable
                        {selectedClass && classes.find(c => c.id === selectedClass) && (
                            <Badge variant="outline" className="ml-2">
                                {classes.find(c => c.id === selectedClass)?.name} {classes.find(c => c.id === selectedClass)?.section}
                            </Badge>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {periods.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <Clock className="h-12 w-12 mb-4 opacity-50" />
                            <p>No periods configured</p>
                            <p className="text-sm">Click &quot;Configure Periods&quot; to set up school timings</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1000px]">
                                <thead>
                                    <tr>
                                        <th className="p-2 text-left font-medium text-muted-foreground border-b w-[100px]">
                                            Time
                                        </th>
                                        {workingDays.map((day) => (
                                            <th key={day} className="p-2 text-center font-medium text-muted-foreground border-b">
                                                {shortDays[day]}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {periods.map((period) => (
                                        <tr key={period.id} className={period.is_break ? 'bg-orange-500/5' : ''}>
                                            <td className="p-2 border-b">
                                                <div className="flex items-center gap-1">
                                                    {period.is_break ? (
                                                        <Coffee className="h-3 w-3 text-orange-500" />
                                                    ) : (
                                                        <Clock className="h-3 w-3 text-muted-foreground" />
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-xs">{period.name}</p>
                                                        <p className="text-[10px] text-muted-foreground">
                                                            {period.start_time} - {period.end_time}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            {workingDays.map((day) => {
                                                if (period.is_break) {
                                                    return (
                                                        <td key={day} className="p-2 border-b text-center">
                                                            <Badge variant="outline" className="text-[10px] bg-orange-500/10 text-orange-500">
                                                                Break
                                                            </Badge>
                                                        </td>
                                                    )
                                                }

                                                const entry = getEntry(period.id!, day)
                                                return (
                                                    <td key={day} className="p-1 border-b">
                                                        <div className="space-y-1">
                                                            <Select
                                                                value={entry?.subject_id || ''}
                                                                onValueChange={(v) => updateTimetableEntry(period.id!, day, 'subject_id', v)}
                                                            >
                                                                <SelectTrigger className="h-7 text-xs">
                                                                    <SelectValue placeholder="Subject" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="">None</SelectItem>
                                                                    {subjects.map((s) => (
                                                                        <SelectItem key={s.id} value={s.id}>
                                                                            {s.name}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <Input
                                                                placeholder="Room"
                                                                value={entry?.room || ''}
                                                                onChange={(e) => updateTimetableEntry(period.id!, day, 'room', e.target.value)}
                                                                className="h-6 text-[10px]"
                                                            />
                                                        </div>
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
        </div>
    )
}
