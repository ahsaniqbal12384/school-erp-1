import { NextRequest, NextResponse } from 'next/server'
import { createClient, createUntypedClient } from '@/lib/supabase/server'
import type { AttendanceAlert, SchoolSettings } from '@/types/database.types'

// Type definitions for attendance records
interface AttendanceInput {
    student_id: string
    status: 'present' | 'absent' | 'late' | 'leave' | 'excused'
    remarks?: string
}

interface StudentWithProfile {
    id: string
    father_phone?: string
    mother_phone?: string
    profile?: {
        first_name: string
        last_name: string
    }
}

interface SchoolData {
    name: string
    settings?: SchoolSettings
}

interface AttendanceInsert {
    school_id: string
    class_id: string
    student_id: string
    date: string
    status: string
    remarks: string | null
    marked_by: string
}

export async function GET(request: NextRequest) {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const classId = searchParams.get('class_id')
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]
    const schoolId = searchParams.get('school_id')

    if (!schoolId) {
        return NextResponse.json({ error: 'School ID is required' }, { status: 400 })
    }

    try {
        let query = supabase
            .from('attendance')
            .select(`
                *,
                student:students(
                    id,
                    admission_no,
                    roll_no,
                    father_phone,
                    mother_phone,
                    profile:profiles(first_name, last_name)
                ),
                marked_by_user:profiles!attendance_marked_by_fkey(first_name, last_name)
            `)
            .eq('school_id', schoolId)
            .eq('date', date)

        if (classId) {
            query = query.eq('class_id', classId)
        }

        const { data, error } = await query.order('created_at', { ascending: true })

        if (error) {
            console.error('Error fetching attendance:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Attendance GET error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    const supabase = await createClient()
    const untypedSupabase = await createUntypedClient()
    
    try {
        const body = await request.json()
        const { school_id, class_id, date, attendance_records, marked_by, send_sms = true } = body

        if (!school_id || !class_id || !date || !attendance_records) {
            return NextResponse.json({ 
                error: 'Missing required fields: school_id, class_id, date, attendance_records' 
            }, { status: 400 })
        }

        // Validate date is a working day
        const schoolResult = await supabase
            .from('schools')
            .select('name, settings')
            .eq('id', school_id)
            .single()

        const schoolData = schoolResult.data as unknown as SchoolData | null

        if (schoolData) {
            const settings = schoolData.settings || {}
            const workingDays = settings.working_days || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
            const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
            
            if (!workingDays.includes(dayOfWeek)) {
                return NextResponse.json({ 
                    error: `Cannot mark attendance on ${dayOfWeek}. School operates on: ${workingDays.join(', ')}` 
                }, { status: 400 })
            }
        }

        // Prepare attendance records for upsert
        const typedRecords = attendance_records as AttendanceInput[]
        const records: AttendanceInsert[] = typedRecords.map((record) => ({
            school_id,
            class_id,
            student_id: record.student_id,
            date,
            status: record.status,
            remarks: record.remarks || null,
            marked_by,
        }))

        // Upsert attendance records (insert or update based on student_id + date unique constraint)
        const { data, error } = await supabase
            .from('attendance')
            .upsert(records as any, { 
                onConflict: 'student_id,date',
                ignoreDuplicates: false 
            })
            .select()

        if (error) {
            console.error('Error saving attendance:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Get absent/late students for SMS alerts
        const absentStudents = typedRecords.filter(
            (r) => r.status === 'absent' || r.status === 'late' || r.status === 'leave'
        )

        let smsResults = { sent: 0, failed: 0 }

        // Send SMS alerts if enabled
        if (send_sms && absentStudents.length > 0) {
            // Get student details with parent phone numbers
            const studentsResult = await supabase
                .from('students')
                .select('id, father_phone, mother_phone, profile:profiles(first_name, last_name)')
                .in('id', absentStudents.map((s) => s.student_id))

            const students = studentsResult.data as unknown as StudentWithProfile[] | null
            const attendanceData = data as unknown as Array<{ student_id: string; id: string }> | null

            if (students && schoolData) {
                for (const student of students) {
                    const record = absentStudents.find((r) => r.student_id === student.id)
                    const studentName = student.profile ? 
                        `${student.profile.first_name} ${student.profile.last_name}` : 
                        'Your child'
                    
                    const parentPhone = student.father_phone || student.mother_phone
                    
                    if (parentPhone && record) {
                        // Prepare alert message
                        let alertMessage = ''
                        if (record.status === 'absent') {
                            alertMessage = `Dear Parent, ${studentName} was marked ABSENT on ${date}. Please contact ${schoolData.name} if this is incorrect.`
                        } else if (record.status === 'late') {
                            alertMessage = `Dear Parent, ${studentName} arrived LATE on ${date}.`
                        } else if (record.status === 'leave') {
                            alertMessage = `Dear Parent, ${studentName} is marked on LEAVE on ${date}.`
                        }

                        // Log the SMS alert using untyped client for new table
                        const attendanceId = attendanceData?.find((d) => d.student_id === student.id)?.id
                        
                        const alertRecord: Partial<AttendanceAlert> = {
                            school_id,
                            attendance_id: attendanceId,
                            student_id: student.id,
                            parent_phone: parentPhone,
                            alert_type: record.status as 'absent' | 'late' | 'leave' | 'excused',
                            message: alertMessage,
                            status: 'pending'
                        }

                        const { error: alertError } = await untypedSupabase
                            .from('attendance_alerts')
                            .insert(alertRecord)

                        if (!alertError) {
                            smsResults.sent++
                        } else {
                            smsResults.failed++
                        }
                    }
                }
            }
        }

        // Calculate summary
        const summary = {
            total: typedRecords.length,
            present: typedRecords.filter((r) => r.status === 'present').length,
            absent: typedRecords.filter((r) => r.status === 'absent').length,
            late: typedRecords.filter((r) => r.status === 'late').length,
            leave: typedRecords.filter((r) => r.status === 'leave' || r.status === 'excused').length,
            sms_sent: smsResults.sent,
            sms_failed: smsResults.failed
        }

        return NextResponse.json({ 
            success: true, 
            message: 'Attendance saved successfully',
            summary,
            data 
        })
    } catch (error) {
        console.error('Attendance POST error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// Get attendance summary for a class/month
export async function PUT(request: NextRequest) {
    const supabase = await createClient()
    
    try {
        const body = await request.json()
        const { school_id, class_id, student_id, month, year } = body

        if (!school_id) {
            return NextResponse.json({ error: 'School ID is required' }, { status: 400 })
        }

        // Build date range for the month
        const startDate = `${year}-${String(month).padStart(2, '0')}-01`
        const endDate = new Date(year, month, 0).toISOString().split('T')[0]

        let query = supabase
            .from('attendance')
            .select('date, status, student_id')
            .eq('school_id', school_id)
            .gte('date', startDate)
            .lte('date', endDate)

        if (class_id) {
            query = query.eq('class_id', class_id)
        }

        if (student_id) {
            query = query.eq('student_id', student_id)
        }

        const { data, error } = await query

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Calculate statistics
        const records = data as Array<{ status: string }> | null
        const stats = {
            total_days: records?.length || 0,
            present: records?.filter(r => r.status === 'present').length || 0,
            absent: records?.filter(r => r.status === 'absent').length || 0,
            late: records?.filter(r => r.status === 'late').length || 0,
            leave: records?.filter(r => r.status === 'leave' || r.status === 'excused').length || 0,
        }

        stats.total_days = stats.present + stats.absent + stats.late + stats.leave
        const percentage = stats.total_days > 0 
            ? Math.round((stats.present / stats.total_days) * 100) 
            : 0

        return NextResponse.json({
            ...stats,
            percentage,
            records: data
        })
    } catch (error) {
        console.error('Attendance summary error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
