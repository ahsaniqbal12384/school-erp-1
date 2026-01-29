'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import {
    UserCheck,
    Search,
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    Users,
    Save,
    Download,
    AlertCircle,
    Loader2,
    MessageSquare,
    Info,
} from 'lucide-react'

interface Student {
    id: string
    rollNo: string
    name: string
    class: string
    section: string
    fatherPhone?: string
    motherPhone?: string
    isAbsent: boolean      // Only track if absent (default = present)
    isLate: boolean
    isLeave: boolean
    remarks?: string
}

// Sample students - in real app, fetch from API based on class
const generateSampleStudents = (): Student[] => {
    const names = [
        'Ahmed Khan', 'Fatima Ali', 'Hassan Raza', 'Sara Ahmed', 'Usman Tariq',
        'Ayesha Malik', 'Ali Hassan', 'Zainab Shah', 'Bilal Ahmed', 'Maryam Khan',
        'Muhammad Imran', 'Hira Naz', 'Hamza Sheikh', 'Amna Bibi', 'Shahzaib Ahmed',
        'Sana Fatima', 'Talha Malik', 'Noor Ul Huda', 'Fahad Khan', 'Kiran Tariq',
        'Asad Ali', 'Mahnoor Iqbal', 'Waqas Shah', 'Rabia Aslam', 'Junaid Ahmed',
        'Arooj Zahra', 'Farhan Siddiqui', 'Mehwish Akram', 'Rehan Qureshi', 'Nimra Hassan',
    ]
    
    return names.map((name, index) => ({
        id: `std_${index + 1}`,
        rollNo: String(1001 + index),
        name,
        class: 'Class 10',
        section: 'A',
        fatherPhone: `03${Math.floor(Math.random() * 9) + 1}${String(Math.floor(Math.random() * 10000000)).padStart(7, '0')}`,
        motherPhone: `03${Math.floor(Math.random() * 9) + 1}${String(Math.floor(Math.random() * 10000000)).padStart(7, '0')}`,
        isAbsent: false,  // Everyone present by default
        isLate: false,
        isLeave: false,
        remarks: '',
    }))
}

// School working days configuration
const WORKING_DAYS_CONFIG = {
    'mon-sat': ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    'mon-fri': ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
}

export default function TeacherAttendancePage() {
    const [students, setStudents] = useState<Student[]>([])
    const [selectedClass, setSelectedClass] = useState<string>('10-A')
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
    const [searchQuery, setSearchQuery] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const [showRemarksDialog, setShowRemarksDialog] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
    const [tempRemarks, setTempRemarks] = useState('')
    
    // School configuration - in real app, fetch from school settings
    const [workingDays] = useState<string[]>(WORKING_DAYS_CONFIG['mon-sat'])
    const [smsEnabled] = useState(true)

    // Initialize students when class changes
    useEffect(() => {
        setStudents(generateSampleStudents())
    }, [selectedClass])

    // Check if selected date is a working day
    const isWorkingDay = (dateStr: string): boolean => {
        const date = new Date(dateStr)
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
        return workingDays.includes(dayName)
    }

    const filteredStudents = students.filter((student) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.rollNo.includes(searchQuery)
    )

    // Calculate counts based on absent/late/leave flags
    const absentCount = students.filter((s) => s.isAbsent && !s.isLeave).length
    const lateCount = students.filter((s) => s.isLate && !s.isAbsent).length
    const leaveCount = students.filter((s) => s.isLeave).length
    const presentCount = students.length - absentCount - leaveCount

    // Toggle absent status
    const toggleAbsent = (studentId: string) => {
        setStudents((prev) =>
            prev.map((s) => {
                if (s.id === studentId) {
                    const newIsAbsent = !s.isAbsent
                    return { 
                        ...s, 
                        isAbsent: newIsAbsent,
                        isLate: newIsAbsent ? false : s.isLate, // Clear late if marking absent
                    }
                }
                return s
            })
        )
    }

    // Toggle late status
    const toggleLate = (studentId: string) => {
        setStudents((prev) =>
            prev.map((s) => {
                if (s.id === studentId) {
                    return { 
                        ...s, 
                        isLate: !s.isLate,
                        isAbsent: false, // Can't be late and absent
                    }
                }
                return s
            })
        )
    }

    // Toggle leave status
    const toggleLeave = (studentId: string) => {
        setStudents((prev) =>
            prev.map((s) => {
                if (s.id === studentId) {
                    const newIsLeave = !s.isLeave
                    return { 
                        ...s, 
                        isLeave: newIsLeave,
                        isAbsent: newIsLeave ? true : s.isAbsent, // Leave counts as absent
                        isLate: false,
                    }
                }
                return s
            })
        )
    }

    // Open remarks dialog
    const openRemarksDialog = (student: Student) => {
        setSelectedStudent(student)
        setTempRemarks(student.remarks || '')
        setShowRemarksDialog(true)
    }

    // Save remarks
    const saveRemarks = () => {
        if (selectedStudent) {
            setStudents((prev) =>
                prev.map((s) =>
                    s.id === selectedStudent.id ? { ...s, remarks: tempRemarks } : s
                )
            )
        }
        setShowRemarksDialog(false)
        setSelectedStudent(null)
        setTempRemarks('')
    }

    // Get status display
    const getStatusDisplay = (student: Student) => {
        if (student.isLeave) {
            return <Badge className="bg-blue-500/10 text-blue-500">Leave</Badge>
        }
        if (student.isAbsent) {
            return <Badge className="bg-red-500/10 text-red-500">Absent</Badge>
        }
        if (student.isLate) {
            return <Badge className="bg-yellow-500/10 text-yellow-500">Late</Badge>
        }
        return <Badge className="bg-green-500/10 text-green-500">Present</Badge>
    }

    // Save attendance
    const handleSaveAttendance = async () => {
        if (!isWorkingDay(selectedDate)) {
            toast.error('Cannot mark attendance on a non-working day')
            return
        }

        setIsSaving(true)

        try {
            // Prepare attendance data
            const attendanceData = students.map((s) => ({
                studentId: s.id,
                date: selectedDate,
                status: s.isLeave ? 'leave' : s.isAbsent ? 'absent' : s.isLate ? 'late' : 'present',
                remarks: s.remarks,
            }))

            // Get absent students for SMS
            const absentStudents = students.filter((s) => s.isAbsent || s.isLeave)

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500))

            // In real app, call API:
            // await fetch('/api/attendance', { method: 'POST', body: JSON.stringify(attendanceData) })

            toast.success(`Attendance saved successfully!`, {
                description: `${presentCount} present, ${absentCount} absent, ${lateCount} late, ${leaveCount} on leave`,
            })

            // SMS notification for absent students
            if (smsEnabled && absentStudents.length > 0) {
                toast.info(`SMS sent to ${absentStudents.length} parent(s)`, {
                    description: 'Absence notifications delivered',
                })
            }

            setShowConfirmDialog(false)
        } catch (error) {
            toast.error('Failed to save attendance')
        } finally {
            setIsSaving(false)
        }
    }

    const dayName = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' })
    const isValidWorkingDay = isWorkingDay(selectedDate)

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mark Attendance</h1>
                    <p className="text-muted-foreground">
                        All students are marked present by default. Only mark those who are absent.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button 
                        className="gradient-primary"
                        onClick={() => setShowConfirmDialog(true)}
                        disabled={!isValidWorkingDay}
                    >
                        <Save className="mr-2 h-4 w-4" />
                        Save Attendance
                    </Button>
                </div>
            </div>

            {/* Info Banner */}
            <Card className="border-blue-500/30 bg-blue-500/5">
                <CardContent className="py-4">
                    <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div>
                            <p className="font-medium text-blue-500">Quick Attendance Mode</p>
                            <p className="text-sm text-muted-foreground">
                                All students are <strong>PRESENT by default</strong>. Simply check the students who are 
                                <span className="text-red-500 font-medium"> Absent</span>,
                                <span className="text-yellow-500 font-medium"> Late</span>, or on 
                                <span className="text-blue-500 font-medium"> Leave</span>.
                                {smsEnabled && ' Parents will receive SMS for absent students.'}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Non-Working Day Warning */}
            {!isValidWorkingDay && (
                <Card className="border-orange-500/30 bg-orange-500/5">
                    <CardContent className="py-4">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-orange-500" />
                            <div>
                                <p className="font-medium text-orange-500">Non-Working Day</p>
                                <p className="text-sm text-muted-foreground">
                                    {dayName} is not a working day. School operates {workingDays.length === 6 ? 'Monday to Saturday' : 'Monday to Friday'}.
                                </p>
                            </div>
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
                        <p className="text-xs text-muted-foreground">In this class</p>
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
                        <CardTitle className="text-sm font-medium">On Leave</CardTitle>
                        <Calendar className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-500">{leaveCount}</div>
                        <p className="text-xs text-muted-foreground">Approved leave</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or roll number..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={selectedClass} onValueChange={setSelectedClass}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Class" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10-A">Class 10-A</SelectItem>
                                <SelectItem value="10-B">Class 10-B</SelectItem>
                                <SelectItem value="9-A">Class 9-A</SelectItem>
                                <SelectItem value="9-B">Class 9-B</SelectItem>
                                <SelectItem value="8-A">Class 8-A</SelectItem>
                                <SelectItem value="8-B">Class 8-B</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="flex items-center gap-2">
                            <Input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-[180px]"
                            />
                            <Badge variant={isValidWorkingDay ? 'default' : 'secondary'}>
                                {dayName}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Attendance Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <UserCheck className="h-5 w-5" />
                            Class {selectedClass} - Attendance Sheet
                        </CardTitle>
                        <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Roll No</TableHead>
                                <TableHead>Student Name</TableHead>
                                <TableHead className="text-center w-[100px]">
                                    <span className="flex items-center justify-center gap-1">
                                        <XCircle className="h-4 w-4 text-red-500" />
                                        Absent
                                    </span>
                                </TableHead>
                                <TableHead className="text-center w-[100px]">
                                    <span className="flex items-center justify-center gap-1">
                                        <Clock className="h-4 w-4 text-yellow-500" />
                                        Late
                                    </span>
                                </TableHead>
                                <TableHead className="text-center w-[100px]">
                                    <span className="flex items-center justify-center gap-1">
                                        <Calendar className="h-4 w-4 text-blue-500" />
                                        Leave
                                    </span>
                                </TableHead>
                                <TableHead className="w-[100px]">Status</TableHead>
                                <TableHead className="w-[100px]">Remarks</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStudents.map((student) => (
                                <TableRow 
                                    key={student.id}
                                    className={student.isAbsent || student.isLeave ? 'bg-red-500/5' : student.isLate ? 'bg-yellow-500/5' : ''}
                                >
                                    <TableCell className="font-medium">{student.rollNo}</TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{student.name}</p>
                                            {(student.isAbsent || student.isLeave) && student.fatherPhone && (
                                                <p className="text-xs text-muted-foreground">
                                                    📱 {student.fatherPhone}
                                                </p>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Checkbox
                                            checked={student.isAbsent && !student.isLeave}
                                            onCheckedChange={() => toggleAbsent(student.id)}
                                            className="border-red-500 data-[state=checked]:bg-red-500"
                                        />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Checkbox
                                            checked={student.isLate}
                                            onCheckedChange={() => toggleLate(student.id)}
                                            disabled={student.isAbsent || student.isLeave}
                                            className="border-yellow-500 data-[state=checked]:bg-yellow-500"
                                        />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Checkbox
                                            checked={student.isLeave}
                                            onCheckedChange={() => toggleLeave(student.id)}
                                            className="border-blue-500 data-[state=checked]:bg-blue-500"
                                        />
                                    </TableCell>
                                    <TableCell>{getStatusDisplay(student)}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => openRemarksDialog(student)}
                                            className={student.remarks ? 'text-primary' : 'text-muted-foreground'}
                                        >
                                            <MessageSquare className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Confirm Save Dialog */}
            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Attendance Submission</DialogTitle>
                        <DialogDescription>
                            Please review the attendance summary before saving.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 rounded-lg bg-green-500/10">
                                <p className="text-3xl font-bold text-green-500">{presentCount}</p>
                                <p className="text-sm text-muted-foreground">Present</p>
                            </div>
                            <div className="text-center p-4 rounded-lg bg-red-500/10">
                                <p className="text-3xl font-bold text-red-500">{absentCount}</p>
                                <p className="text-sm text-muted-foreground">Absent</p>
                            </div>
                            <div className="text-center p-4 rounded-lg bg-yellow-500/10">
                                <p className="text-3xl font-bold text-yellow-500">{lateCount}</p>
                                <p className="text-sm text-muted-foreground">Late</p>
                            </div>
                            <div className="text-center p-4 rounded-lg bg-blue-500/10">
                                <p className="text-3xl font-bold text-blue-500">{leaveCount}</p>
                                <p className="text-sm text-muted-foreground">On Leave</p>
                            </div>
                        </div>

                        {smsEnabled && (absentCount > 0 || leaveCount > 0) && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
                                <MessageSquare className="h-5 w-5 text-primary" />
                                <p className="text-sm">
                                    SMS will be sent to <strong>{absentCount + leaveCount}</strong> parent(s) for absent/leave students
                                </p>
                            </div>
                        )}

                        <div className="text-sm text-muted-foreground">
                            <p>Date: <strong>{new Date(selectedDate).toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong></p>
                            <p>Class: <strong>{selectedClass}</strong></p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                            Cancel
                        </Button>
                        <Button 
                            className="gradient-primary" 
                            onClick={handleSaveAttendance}
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Confirm & Save
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Remarks Dialog */}
            <Dialog open={showRemarksDialog} onOpenChange={setShowRemarksDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Remarks</DialogTitle>
                        <DialogDescription>
                            Add notes for {selectedStudent?.name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Label>Remarks</Label>
                        <Textarea
                            value={tempRemarks}
                            onChange={(e) => setTempRemarks(e.target.value)}
                            placeholder="Enter remarks (e.g., Sick, Family emergency, etc.)"
                            rows={3}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowRemarksDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={saveRemarks}>
                            Save Remarks
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
