'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
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
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Users,
    Key,
    Loader2,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Download,
    Copy,
    RefreshCw,
    UserPlus,
} from 'lucide-react'
import { useTenant } from '@/lib/tenant'
import { toast } from 'sonner'

interface ClassOption {
    id: string
    name: string
    section: string
}

interface Student {
    id: string
    admission_no: string
    roll_no: string
    father_name: string
    class_id: string
    has_login: boolean
    user_id: string | null
    login_active: boolean
    class?: {
        id: string
        name: string
        section: string
    }
}

interface Credential {
    student_id: string
    admission_no: string
    email: string
    password: string
    user_id?: string
    status: 'created' | 'exists' | 'error'
    error?: string
}

export default function BulkLoginPage() {
    const { school } = useTenant()
    const [classes, setClasses] = useState<ClassOption[]>([])
    const [students, setStudents] = useState<Student[]>([])
    const [selectedClass, setSelectedClass] = useState('')
    const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set())
    const [loading, setLoading] = useState(true)
    const [generating, setGenerating] = useState(false)
    const [credentials, setCredentials] = useState<Credential[]>([])
    const [showCredentials, setShowCredentials] = useState(false)

    // Fetch classes
    useEffect(() => {
        const fetchClasses = async () => {
            if (!school?.id) return

            try {
                const response = await fetch(`/api/classes?school_id=${school.id}`)
                if (response.ok) {
                    const { data } = await response.json()
                    setClasses(data || [])
                }
            } catch (error) {
                console.error('Error fetching classes:', error)
            }
        }

        fetchClasses()
    }, [school?.id])

    // Fetch students when class changes
    const fetchStudents = useCallback(async () => {
        if (!school?.id || !selectedClass) {
            setStudents([])
            return
        }

        try {
            setLoading(true)
            const response = await fetch(
                `/api/users/bulk-login?school_id=${school.id}&class_id=${selectedClass}`
            )
            if (response.ok) {
                const { data } = await response.json()
                setStudents(data || [])
                setSelectedStudents(new Set())
            }
        } catch (error) {
            console.error('Error fetching students:', error)
        } finally {
            setLoading(false)
        }
    }, [school?.id, selectedClass])

    useEffect(() => {
        fetchStudents()
    }, [fetchStudents])

    const toggleStudent = (studentId: string) => {
        setSelectedStudents(prev => {
            const newSet = new Set(prev)
            if (newSet.has(studentId)) {
                newSet.delete(studentId)
            } else {
                newSet.add(studentId)
            }
            return newSet
        })
    }

    const toggleAll = () => {
        const studentsWithoutLogin = students.filter(s => !s.has_login)
        if (selectedStudents.size === studentsWithoutLogin.length) {
            setSelectedStudents(new Set())
        } else {
            setSelectedStudents(new Set(studentsWithoutLogin.map(s => s.id)))
        }
    }

    const generateLogins = async () => {
        if (!school?.id || selectedStudents.size === 0) {
            toast.error('Please select at least one student')
            return
        }

        setGenerating(true)
        try {
            const response = await fetch('/api/users/bulk-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    school_id: school.id,
                    class_id: selectedClass,
                    student_ids: Array.from(selectedStudents),
                    school_slug: school.slug
                })
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || 'Failed to generate logins')
            }

            setCredentials(result.credentials)
            setShowCredentials(true)
            toast.success(result.message)
            fetchStudents() // Refresh to show updated login status
        } catch (error) {
            console.error('Error generating logins:', error)
            toast.error(error instanceof Error ? error.message : 'Failed to generate logins')
        } finally {
            setGenerating(false)
        }
    }

    const resetPassword = async (userId: string, admissionNo: string) => {
        try {
            const response = await fetch('/api/users/bulk-login', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId })
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error)
            }

            toast.success(`Password reset for ${admissionNo}. New password: ${result.password}`)

            // Copy to clipboard
            navigator.clipboard.writeText(result.password)
        } catch (error) {
            toast.error('Failed to reset password')
        }
    }

    const copyCredentials = () => {
        const text = credentials
            .filter(c => c.status === 'created')
            .map(c => `${c.admission_no}\t${c.email}\t${c.password}`)
            .join('\n')
        navigator.clipboard.writeText(`Admission No\tEmail\tPassword\n${text}`)
        toast.success('Credentials copied to clipboard')
    }

    const downloadCredentials = () => {
        const csvContent = [
            'Admission No,Email,Password,Status',
            ...credentials.map(c => `${c.admission_no},${c.email},${c.password},${c.status}`)
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `student_logins_${selectedClass}_${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        URL.revokeObjectURL(url)
        toast.success('Credentials downloaded')
    }

    const studentsWithoutLogin = students.filter(s => !s.has_login)
    const studentsWithLogin = students.filter(s => s.has_login)

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Bulk Login Generation</h1>
                    <p className="text-muted-foreground">
                        Generate login credentials for students by class
                    </p>
                </div>
            </div>

            {/* Class Selection */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Select Class
                    </CardTitle>
                    <CardDescription>
                        Choose a class to view and generate student logins
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                        <SelectTrigger className="w-[300px]">
                            <SelectValue placeholder="Select a class" />
                        </SelectTrigger>
                        <SelectContent>
                            {classes.map((cls) => (
                                <SelectItem key={cls.id} value={cls.id}>
                                    {cls.name} {cls.section}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {selectedClass && (
                <>
                    {/* Stats */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-500/10 rounded-full">
                                        <Users className="h-6 w-6 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total Students</p>
                                        <p className="text-2xl font-bold">{students.length}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-green-500/10 rounded-full">
                                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">With Login</p>
                                        <p className="text-2xl font-bold">{studentsWithLogin.length}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-orange-500/10 rounded-full">
                                        <AlertCircle className="h-6 w-6 text-orange-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Without Login</p>
                                        <p className="text-2xl font-bold">{studentsWithoutLogin.length}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Students Table */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Key className="h-5 w-5" />
                                        Students
                                    </CardTitle>
                                    <CardDescription>
                                        Select students to generate login credentials
                                    </CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={fetchStudents}
                                        disabled={loading}
                                    >
                                        <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                                        Refresh
                                    </Button>
                                    <Button
                                        onClick={generateLogins}
                                        disabled={generating || selectedStudents.size === 0}
                                        className="gradient-primary"
                                    >
                                        {generating ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <UserPlus className="mr-2 h-4 w-4" />
                                        )}
                                        Generate Logins ({selectedStudents.size})
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            ) : students.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                    <Users className="h-12 w-12 mb-4 opacity-50" />
                                    <p>No students found in this class</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[50px]">
                                                <Checkbox
                                                    checked={
                                                        studentsWithoutLogin.length > 0 &&
                                                        selectedStudents.size === studentsWithoutLogin.length
                                                    }
                                                    onCheckedChange={toggleAll}
                                                    disabled={studentsWithoutLogin.length === 0}
                                                />
                                            </TableHead>
                                            <TableHead>Roll No</TableHead>
                                            <TableHead>Admission No</TableHead>
                                            <TableHead>Father Name</TableHead>
                                            <TableHead>Login Status</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {students.map((student) => (
                                            <TableRow key={student.id}>
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedStudents.has(student.id)}
                                                        onCheckedChange={() => toggleStudent(student.id)}
                                                        disabled={student.has_login}
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {student.roll_no || '-'}
                                                </TableCell>
                                                <TableCell>{student.admission_no}</TableCell>
                                                <TableCell>{student.father_name || '-'}</TableCell>
                                                <TableCell>
                                                    {student.has_login ? (
                                                        <Badge variant="outline" className="bg-green-500/10 text-green-600">
                                                            <CheckCircle2 className="mr-1 h-3 w-3" />
                                                            Has Login
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="bg-orange-500/10 text-orange-600">
                                                            <XCircle className="mr-1 h-3 w-3" />
                                                            No Login
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {student.has_login && student.user_id && (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => resetPassword(student.user_id!, student.admission_no)}
                                                        >
                                                            <RefreshCw className="mr-1 h-3 w-3" />
                                                            Reset Password
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </>
            )}

            {/* Credentials Dialog */}
            <Dialog open={showCredentials} onOpenChange={setShowCredentials}>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Generated Login Credentials</DialogTitle>
                        <DialogDescription>
                            Share these credentials with students. They can change their password after first login.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={copyCredentials}>
                                <Copy className="mr-2 h-4 w-4" />
                                Copy All
                            </Button>
                            <Button variant="outline" onClick={downloadCredentials}>
                                <Download className="mr-2 h-4 w-4" />
                                Download CSV
                            </Button>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Admission No</TableHead>
                                    <TableHead>Email (Username)</TableHead>
                                    <TableHead>Password</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {credentials.map((cred, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{cred.admission_no}</TableCell>
                                        <TableCell>
                                            <code className="text-sm bg-muted px-2 py-1 rounded">
                                                {cred.email}
                                            </code>
                                        </TableCell>
                                        <TableCell>
                                            {cred.status === 'created' ? (
                                                <code className="text-sm bg-green-500/10 text-green-600 px-2 py-1 rounded">
                                                    {cred.password}
                                                </code>
                                            ) : (
                                                <span className="text-muted-foreground">{cred.password}</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {cred.status === 'created' && (
                                                <Badge className="bg-green-500">Created</Badge>
                                            )}
                                            {cred.status === 'exists' && (
                                                <Badge variant="secondary">Already Exists</Badge>
                                            )}
                                            {cred.status === 'error' && (
                                                <Badge variant="destructive">Error</Badge>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="text-sm text-muted-foreground">
                            <p><strong>Note:</strong> Students can login using their email and password.</p>
                            <p>They can change their password from their profile settings after logging in.</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
