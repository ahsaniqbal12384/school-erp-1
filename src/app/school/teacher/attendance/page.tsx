'use client'

import { useState, useEffect, useCallback } from 'react'
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    UserCheck,
    Search,
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
    Users,
    Save,
    Download,
    Loader2,
    AlertTriangle,
} from 'lucide-react'
import { useTenant } from '@/lib/tenant'
import { useAuth } from '@/lib/auth'
import { toast } from 'sonner'

interface Student {
    id: string
    first_name: string
    last_name: string
    roll_number: string
    gender: string
    class: {
        id: string
        name: string
        section: string
    }
}

interface AttendanceRecord {
    student_id: string
    status: 'present' | 'absent' | 'late' | 'excused'
    remarks?: string
}

interface ClassOption {
    id: string
    name: string
    section: string
    grade_level: number
}

export default function TeacherAttendancePage() {
    const { school } = useTenant()
    const { user } = useAuth()
    const [classes, setClasses] = useState<ClassOption[]>([])
    const [students, setStudents] = useState<Student[]>([])
    const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>({})
    const [existingAttendance, setExistingAttendance] = useState<boolean>(false)
    const [selectedClass, setSelectedClass] = useState<string>('')
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
    const [searchQuery, setSearchQuery] = useState('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [isExporting, setIsExporting] = useState(false)

    // Fetch classes
    useEffect(() => {
        const fetchClasses = async () => {
            if (!school?.id) return
            try {
                const response = await fetch(`/api/classes?school_id=${school.id}`)
                if (response.ok) {
                    const { data } = await response.json()
                    setClasses(data || [])
                    if (data?.length > 0) {
                        setSelectedClass(data[0].id)
                    }
                }
            } catch (error) {
                console.error('Error fetching classes:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchClasses()
    }, [school?.id])

    // Fetch students and existing attendance when class or date changes
    const fetchStudentsAndAttendance = useCallback(async () => {
        if (!school?.id || !selectedClass) return
        
        try {
            setLoading(true)
            
            // Fetch students for selected class
            const studentsRes = await fetch(`/api/students?school_id=${school.id}&class_id=${selectedClass}`)
            if (studentsRes.ok) {
                const { data } = await studentsRes.json()
                setStudents(data || [])
                
                // Initialize attendance with all students marked as 'present' by default
                const initialAttendance: Record<string, AttendanceRecord> = {}
                data?.forEach((student: Student) => {
                    initialAttendance[student.id] = {
                        student_id: student.id,
                        status: 'present',
                        remarks: ''
                    }
                })
                setAttendance(initialAttendance)
            }

            // Fetch existing attendance for this date
            const attendanceRes = await fetch(
                `/api/attendance?school_id=${school.id}&class_id=${selectedClass}&date=${selectedDate}`
            )
            if (attendanceRes.ok) {
                const { data } = await attendanceRes.json()
                if (data?.length > 0) {
                    setExistingAttendance(true)
                    // Update attendance with existing records
                    const existingRecords: Record<string, AttendanceRecord> = {}
                    data.forEach((record: { student_id: string; status: string; remarks?: string }) => {
                        existingRecords[record.student_id] = {
                            student_id: record.student_id,
                            status: record.status as AttendanceRecord['status'],
                            remarks: record.remarks || ''
                        }
                    })
                    setAttendance(prev => ({ ...prev, ...existingRecords }))
                } else {
                    setExistingAttendance(false)
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error)
            toast.error('Failed to load data')
        } finally {
            setLoading(false)
        }
    }, [school?.id, selectedClass, selectedDate])

    useEffect(() => {
        fetchStudentsAndAttendance()
    }, [fetchStudentsAndAttendance])

    const filteredStudents = students.filter((student) =>
        `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.roll_number?.includes(searchQuery)
    )

    const updateStatus = (studentId: string, status: AttendanceRecord['status']) => {
        setAttendance((prev) => ({
            ...prev,
            [studentId]: { ...prev[studentId], student_id: studentId, status }
        }))
    }

    const markAllPresent = () => {
        const updated: Record<string, AttendanceRecord> = {}
        students.forEach((student) => {
            updated[student.id] = { student_id: student.id, status: 'present', remarks: '' }
        })
        setAttendance(updated)
    }

    const saveAttendance = async () => {
        if (!school?.id || !selectedClass) {
            toast.error('Please select a class')
            return
        }

        setSaving(true)
        try {
            const attendanceRecords = Object.values(attendance)
            
            const response = await fetch('/api/attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    school_id: school.id,
                    class_id: selectedClass,
                    date: selectedDate,
                    attendance_records: attendanceRecords,
                    marked_by: user?.id
                })
            })

            if (!response.ok) {
                throw new Error('Failed to save attendance')
            }

            const { count } = await response.json()
            toast.success(`Attendance saved for ${count} students!`)
            setExistingAttendance(true)
        } catch (error) {
            console.error('Error saving attendance:', error)
            toast.error('Failed to save attendance')
        } finally {
            setSaving(false)
        }
    }

    const handleExportAttendance = async () => {
        if (students.length === 0) {
            toast.error('No attendance data to export')
            return
        }

        setIsExporting(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 500))
            
            const selectedClassData = classes.find(c => c.id === selectedClass)
            const className = selectedClassData ? `${selectedClassData.name} ${selectedClassData.section}` : 'Unknown'
            
            // Create CSV content
            const headers = ['Roll No', 'Student Name', 'Gender', 'Status', 'Remarks']
            const rows = students.map(student => {
                const record = attendance[student.id]
                return [
                    student.roll_number,
                    `${student.first_name} ${student.last_name}`,
                    student.gender,
                    record?.status || 'Not Marked',
                    record?.remarks || ''
                ]
            })

            const csvContent = [
                `Attendance Report - ${className}`,
                `Date: ${new Date(selectedDate).toLocaleDateString()}`,
                `Total Students: ${students.length}`,
                `Present: ${presentCount}, Absent: ${absentCount}, Late: ${lateCount}, Excused: ${excusedCount}`,
                '',
                headers.join(','),
                ...rows.map(row => row.join(','))
            ].join('\n')

            // Download file
            const blob = new Blob([csvContent], { type: 'text/csv' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `attendance_${className.replace(/\s+/g, '_')}_${selectedDate}.csv`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            window.URL.revokeObjectURL(url)

            toast.success('Attendance exported successfully')
        } catch {
            toast.error('Failed to export attendance')
        } finally {
            setIsExporting(false)
        }
    }

    const getStatusBadge = (status: AttendanceRecord['status']) => {
        switch (status) {
            case 'present':
                return <Badge className="bg-green-500/10 text-green-500">Present</Badge>
            case 'absent':
                return <Badge className="bg-red-500/10 text-red-500">Absent</Badge>
            case 'late':
                return <Badge className="bg-yellow-500/10 text-yellow-500">Late</Badge>
            case 'excused':
                return <Badge className="bg-blue-500/10 text-blue-500">Excused</Badge>
            default:
                return <Badge variant="outline">Not Marked</Badge>
        }
    }

    // Calculate stats
    const presentCount = Object.values(attendance).filter((a) => a.status === 'present').length
    const absentCount = Object.values(attendance).filter((a) => a.status === 'absent').length
    const lateCount = Object.values(attendance).filter((a) => a.status === 'late').length
    const excusedCount = Object.values(attendance).filter((a) => a.status === 'excused').length

    if (loading && classes.length === 0) {
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
                    <h1 className="text-3xl font-bold tracking-tight">Mark Attendance</h1>
                    <p className="text-muted-foreground">
                        Record daily student attendance
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={markAllPresent}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark All Present
                    </Button>
                    <Button className="gradient-primary" onClick={saveAttendance} disabled={saving}>
                        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Attendance
                    </Button>
                </div>
            </div>

            {existingAttendance && (
                <Card className="border-yellow-500/50 bg-yellow-500/5">
                    <CardContent className="py-3">
                        <div className="flex items-center gap-2 text-yellow-600">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="text-sm">Attendance already marked for this date. Saving will update existing records.</span>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-5">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{students.length}</div>
                        <p className="text-xs text-muted-foreground">In selected class</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Present</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{presentCount}</div>
                        <p className="text-xs text-muted-foreground">{students.length > 0 ? ((presentCount / students.length) * 100).toFixed(0) : 0}%</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Absent</CardTitle>
                        <XCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">{absentCount}</div>
                        <p className="text-xs text-muted-foreground">{students.length > 0 ? ((absentCount / students.length) * 100).toFixed(0) : 0}%</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Late</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-500">{lateCount}</div>
                        <p className="text-xs text-muted-foreground">Arrived late</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Excused</CardTitle>
                        <UserCheck className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-500">{excusedCount}</div>
                        <p className="text-xs text-muted-foreground">With leave</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <Input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-[180px]"
                            />
                        </div>
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
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search student..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Button variant="outline" onClick={handleExportAttendance} disabled={isExporting || students.length === 0}>
                            {isExporting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Exporting...
                                </>
                            ) : (
                                <>
                                    <Download className="mr-2 h-4 w-4" />
                                    Export
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Attendance Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserCheck className="h-5 w-5" />
                        Student Attendance - {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : filteredStudents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <Users className="h-12 w-12 mb-4 opacity-50" />
                            <p>No students found</p>
                            <p className="text-sm">Select a different class or check your search</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">Roll No</TableHead>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead className="w-[100px]">Gender</TableHead>
                                    <TableHead className="w-[120px]">Status</TableHead>
                                    <TableHead>Mark Attendance</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredStudents.map((student) => (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-medium">{student.roll_number}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                                    student.gender === 'male' ? 'bg-blue-500/10' : 'bg-pink-500/10'
                                                }`}>
                                                    <span className={`text-sm font-medium ${
                                                        student.gender === 'male' ? 'text-blue-500' : 'text-pink-500'
                                                    }`}>
                                                        {student.first_name[0]}{student.last_name[0]}
                                                    </span>
                                                </div>
                                                <span>{student.first_name} {student.last_name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize">{student.gender}</Badge>
                                        </TableCell>
                                        <TableCell>{getStatusBadge(attendance[student.id]?.status || 'present')}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant={attendance[student.id]?.status === 'present' ? 'default' : 'outline'}
                                                    className={attendance[student.id]?.status === 'present' ? 'bg-green-500 hover:bg-green-600' : ''}
                                                    onClick={() => updateStatus(student.id, 'present')}
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant={attendance[student.id]?.status === 'absent' ? 'default' : 'outline'}
                                                    className={attendance[student.id]?.status === 'absent' ? 'bg-red-500 hover:bg-red-600' : ''}
                                                    onClick={() => updateStatus(student.id, 'absent')}
                                                >
                                                    <XCircle className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant={attendance[student.id]?.status === 'late' ? 'default' : 'outline'}
                                                    className={attendance[student.id]?.status === 'late' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
                                                    onClick={() => updateStatus(student.id, 'late')}
                                                >
                                                    <Clock className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant={attendance[student.id]?.status === 'excused' ? 'default' : 'outline'}
                                                    className={attendance[student.id]?.status === 'excused' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                                                    onClick={() => updateStatus(student.id, 'excused')}
                                                >
                                                    E
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
