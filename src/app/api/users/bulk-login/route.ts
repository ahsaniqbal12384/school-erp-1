// Bulk Login Generation API
// POST: Generate login credentials for students in a class
// GET: Retrieve previously generated credentials

import { createClient } from '@/lib/supabase/server'
import { createServerClient } from '@/lib/supabase/client'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// Helper function to generate random password
function generatePassword(length: number = 8): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let password = ''
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
}

// Helper function to create username from admission number
function createUsername(admissionNo: string, schoolSlug: string): string {
    // Format: admission_no@school_slug (e.g., ANS-2024-001@demo-school)
    return `${admissionNo.toLowerCase().replace(/[^a-z0-9]/g, '')}@${schoolSlug}`
}

// GET - Get students with their login status
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { searchParams } = new URL(request.url)
        const schoolId = searchParams.get('school_id')
        const classId = searchParams.get('class_id')

        if (!schoolId) {
            return NextResponse.json({ error: 'School ID required' }, { status: 400 })
        }

        let query = supabase
            .from('students')
            .select(`
                id,
                admission_no,
                roll_no,
                father_name,
                class_id,
                status,
                profile_id,
                class:classes(id, name, section)
            `)
            .eq('school_id', schoolId)
            .eq('status', 'active')

        if (classId) {
            query = query.eq('class_id', classId)
        }

        const { data: students, error } = await query.order('roll_no', { ascending: true })

        if (error) throw error

        // Check which students have user accounts
        // We'll check by looking for users with email matching admission_no pattern
        const { data: existingUsers } = await (supabase
            .from('users') as any)
            .select('id, email, is_active')
            .eq('school_id', schoolId)
            .eq('role', 'student')

        // Create a map of existing users by email prefix
        const userMap = new Map<string, { id: string; is_active: boolean }>()
        existingUsers?.forEach((user: any) => {
            const prefix = user.email.split('@')[0]
            userMap.set(prefix.toLowerCase(), { id: user.id, is_active: user.is_active })
        })

        // Enrich students with login status
        const enrichedStudents = students?.map((student: any) => {
            const emailPrefix = student.admission_no.toLowerCase().replace(/[^a-z0-9]/g, '')
            const existingUser = userMap.get(emailPrefix)
            return {
                ...student,
                has_login: !!existingUser,
                user_id: existingUser?.id || null,
                login_active: existingUser?.is_active || false
            }
        })

        return NextResponse.json({ data: enrichedStudents })
    } catch (error: unknown) {
        console.error('Bulk login GET error:', error)
        const message = error instanceof Error ? error.message : 'Failed to fetch students'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// POST - Generate bulk logins for selected students
export async function POST(request: NextRequest) {
    try {
        const supabase = createServerClient()
        const body = await request.json()

        const {
            school_id,
            class_id,
            student_ids, // Array of student IDs to create logins for
            school_slug, // School slug for email domain
        } = body

        if (!school_id || !school_slug) {
            return NextResponse.json({ error: 'School ID and slug required' }, { status: 400 })
        }

        if (!student_ids || !Array.isArray(student_ids) || student_ids.length === 0) {
            return NextResponse.json({ error: 'At least one student must be selected' }, { status: 400 })
        }

        // Fetch selected students
        const { data: students, error: fetchError } = await supabase
            .from('students')
            .select('id, admission_no, father_name, class_id')
            .in('id', student_ids)
            .eq('school_id', school_id)

        if (fetchError) throw fetchError
        if (!students || students.length === 0) {
            return NextResponse.json({ error: 'No valid students found' }, { status: 400 })
        }

        // Generate credentials for each student
        const credentials: Array<{
            student_id: string
            admission_no: string
            email: string
            password: string
            user_id?: string
            status: 'created' | 'exists' | 'error'
            error?: string
        }> = []

        for (const student of students) {
            const email = `${student.admission_no.toLowerCase().replace(/[^a-z0-9]/g, '')}@${school_slug}.edu.pk`
            const password = generatePassword(8)

            // Check if user already exists
            const { data: existingUser } = await supabase
                .from('users')
                .select('id')
                .eq('email', email)
                .single()

            if (existingUser) {
                credentials.push({
                    student_id: student.id,
                    admission_no: student.admission_no,
                    email,
                    password: '****', // Don't reveal existing passwords
                    user_id: existingUser.id,
                    status: 'exists'
                })
                continue
            }

            try {
                // Hash password
                const password_hash = await bcrypt.hash(password, 10)

                // Create user
                const { data: newUser, error: createError } = await supabase
                    .from('users')
                    .insert({
                        email,
                        password_hash,
                        first_name: student.father_name?.split(' ')[0] || 'Student',
                        last_name: student.admission_no,
                        role: 'student',
                        school_id,
                        is_active: true
                    })
                    .select('id')
                    .single()

                if (createError) throw createError

                // Update student with user reference (if column exists)
                // This may fail if user_id column doesn't exist, but that's okay
                await supabase
                    .from('students')
                    .update({ profile_id: newUser.id })
                    .eq('id', student.id)
                    .select()

                credentials.push({
                    student_id: student.id,
                    admission_no: student.admission_no,
                    email,
                    password, // Plain text password for admin to share
                    user_id: newUser.id,
                    status: 'created'
                })
            } catch (err: unknown) {
                credentials.push({
                    student_id: student.id,
                    admission_no: student.admission_no,
                    email,
                    password: '',
                    status: 'error',
                    error: err instanceof Error ? err.message : 'Failed to create user'
                })
            }
        }

        const created = credentials.filter(c => c.status === 'created').length
        const existing = credentials.filter(c => c.status === 'exists').length
        const errors = credentials.filter(c => c.status === 'error').length

        return NextResponse.json({
            success: true,
            message: `Created ${created} logins, ${existing} already existed, ${errors} failed`,
            credentials,
            summary: { created, existing, errors, total: credentials.length }
        })
    } catch (error: unknown) {
        console.error('Bulk login POST error:', error)
        const message = error instanceof Error ? error.message : 'Failed to create bulk logins'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// PATCH - Reset password for a student
export async function PATCH(request: NextRequest) {
    try {
        const supabase = createServerClient()
        const body = await request.json()

        const { user_id, new_password } = body

        if (!user_id) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 })
        }

        const password = new_password || generatePassword(8)
        const password_hash = await bcrypt.hash(password, 10)

        const { error } = await supabase
            .from('users')
            .update({ password_hash })
            .eq('id', user_id)

        if (error) throw error

        return NextResponse.json({
            success: true,
            message: 'Password reset successfully',
            password // Return new password for admin
        })
    } catch (error: unknown) {
        console.error('Password reset error:', error)
        const message = error instanceof Error ? error.message : 'Failed to reset password'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
