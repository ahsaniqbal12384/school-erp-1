// Report Card Generation API
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET - Generate report card data for a student
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { searchParams } = new URL(request.url)
        const schoolId = searchParams.get('school_id')
        const studentId = searchParams.get('student_id')
        const examId = searchParams.get('exam_id')
        const academicYearId = searchParams.get('academic_year_id')

        if (!schoolId || !studentId) {
            return NextResponse.json({ error: 'School ID and Student ID required' }, { status: 400 })
        }

        // Get student info
        const { data: student, error: studentError } = await (supabase
            .from('students') as any)
            .select(`
                *,
                class:classes(id, name, section, grade_level),
                school:schools(id, name, address, phone, email, logo_url)
            `)
            .eq('id', studentId)
            .single()

        if (studentError) throw studentError

        // Get grades query
        let gradesQuery = (supabase
            .from('grades') as any)
            .select(`
                *,
                exam:exams(id, name, exam_type),
                subject:subjects(id, name, code)
            `)
            .eq('school_id', schoolId)
            .eq('student_id', studentId)

        if (examId) {
            gradesQuery = gradesQuery.eq('exam_id', examId)
        }

        const { data: grades, error: gradesError } = await gradesQuery

        if (gradesError) throw gradesError

        // Get attendance summary for the term
        const { data: attendance } = await (supabase
            .from('attendance') as any)
            .select('status')
            .eq('student_id', studentId)

        const totalDays = attendance?.length || 0
        const presentDays = attendance?.filter((a: any) => a.status === 'present').length || 0
        const absentDays = attendance?.filter((a: any) => a.status === 'absent').length || 0
        const lateDays = attendance?.filter((a: any) => a.status === 'late').length || 0

        // Calculate overall stats
        const totalMarks = grades?.reduce((sum: number, g: any) => sum + (g.marks_obtained || 0), 0) || 0
        const maxMarks = grades?.reduce((sum: number, g: any) => sum + (g.max_marks || 0), 0) || 0
        const overallPercentage = maxMarks > 0 ? ((totalMarks / maxMarks) * 100).toFixed(2) : 0
        const avgGradePoint = grades?.length 
            ? (grades.reduce((sum: number, g: any) => sum + (g.grade_point || 0), 0) / grades.length).toFixed(2) 
            : 0

        // Group grades by exam
        const gradesByExam: Record<string, any[]> = {}
        grades?.forEach((grade: any) => {
            const examName = grade.exam?.name || 'Unknown'
            if (!gradesByExam[examName]) {
                gradesByExam[examName] = []
            }
            gradesByExam[examName].push(grade)
        })

        // Get rank in class (if exam specified)
        let rank = null
        if (examId && student.class_id) {
            const { data: classResults } = await (supabase
                .from('grades') as any)
                .select('student_id, marks_obtained')
                .eq('exam_id', examId)
                .eq('class_id', student.class_id)

            if (classResults) {
                // Calculate total marks per student
                const studentTotals: Record<string, number> = {}
                classResults.forEach((r: any) => {
                    studentTotals[r.student_id] = (studentTotals[r.student_id] || 0) + (r.marks_obtained || 0)
                })

                // Sort and find rank
                const sortedStudents = Object.entries(studentTotals)
                    .sort(([, a], [, b]) => b - a)
                    .map(([id]) => id)
                
                rank = sortedStudents.indexOf(studentId) + 1
            }
        }

        return NextResponse.json({
            student,
            grades,
            gradesByExam,
            attendance: {
                totalDays,
                presentDays,
                absentDays,
                lateDays,
                attendancePercentage: totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : 0
            },
            summary: {
                totalMarks,
                maxMarks,
                overallPercentage,
                avgGradePoint,
                rank,
                totalSubjects: grades?.length || 0
            }
        })
    } catch (error: unknown) {
        console.error('Report card error:', error)
        const message = error instanceof Error ? error.message : 'Failed to generate report card'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
