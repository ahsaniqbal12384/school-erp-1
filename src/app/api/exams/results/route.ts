// Exam Results/Grades API Routes
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET - Fetch exam results
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { searchParams } = new URL(request.url)
        const schoolId = searchParams.get('school_id')
        const examId = searchParams.get('exam_id')
        const classId = searchParams.get('class_id')
        const studentId = searchParams.get('student_id')
        const subjectId = searchParams.get('subject_id')

        if (!schoolId) {
            return NextResponse.json({ error: 'School ID required' }, { status: 400 })
        }

        let query = supabase
            .from('grades')
            .select(`
                *,
                student:students(id, first_name, last_name, roll_number,
                    class:classes(id, name, section)
                ),
                exam:exams(id, name, exam_type),
                subject:subjects(id, name, code)
            `)
            .eq('school_id', schoolId)
            .order('created_at', { ascending: false })

        if (examId) {
            query = query.eq('exam_id', examId)
        }
        if (classId) {
            query = query.eq('class_id', classId)
        }
        if (studentId) {
            query = query.eq('student_id', studentId)
        }
        if (subjectId) {
            query = query.eq('subject_id', subjectId)
        }

        const { data, error } = await query

        if (error) throw error

        return NextResponse.json({ data })
    } catch (error: unknown) {
        console.error('Results fetch error:', error)
        const message = error instanceof Error ? error.message : 'Failed to fetch results'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// POST - Enter exam results (bulk)
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const body = await request.json()

        const { school_id, exam_id, class_id, subject_id, results, entered_by } = body

        if (!school_id || !exam_id || !class_id || !subject_id || !results?.length) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Get grade scale for the school
        const { data: gradeScales } = await (supabase
            .from('grade_scales') as any)
            .select('*')
            .eq('school_id', school_id)
            .order('min_percentage', { ascending: false })

        // Calculate grade for each result
        const gradeRecords = results.map((result: {
            student_id: string;
            marks_obtained: number;
            max_marks: number;
            remarks?: string;
        }) => {
            const percentage = (result.marks_obtained / result.max_marks) * 100
            let grade = 'F'
            let gradePoint = 0
            let gradeRemarks = ''

            if (gradeScales?.length) {
                for (const scale of gradeScales) {
                    if (percentage >= scale.min_percentage && percentage <= scale.max_percentage) {
                        grade = scale.grade
                        gradePoint = scale.grade_point
                        gradeRemarks = scale.remarks
                        break
                    }
                }
            }

            return {
                school_id,
                exam_id,
                class_id,
                student_id: result.student_id,
                subject_id,
                marks_obtained: result.marks_obtained,
                max_marks: result.max_marks,
                percentage,
                grade,
                grade_point: gradePoint,
                remarks: result.remarks || gradeRemarks,
                entered_by
            }
        })

        // Delete existing results for this exam/class/subject combination
        await supabase
            .from('grades')
            .delete()
            .eq('exam_id', exam_id)
            .eq('class_id', class_id)
            .eq('subject_id', subject_id)

        // Insert new results
        const { data, error } = await (supabase
            .from('grades') as any)
            .insert(gradeRecords)
            .select()

        if (error) throw error

        return NextResponse.json({ data, count: gradeRecords.length }, { status: 201 })
    } catch (error: unknown) {
        console.error('Results entry error:', error)
        const message = error instanceof Error ? error.message : 'Failed to enter results'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
