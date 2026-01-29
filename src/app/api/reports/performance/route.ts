import { NextRequest, NextResponse } from 'next/server'
import { createUntypedClient as createClient } from '@/lib/supabase/server'

// GET - Fetch class performance data
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId')
    const classId = searchParams.get('classId')
    const examId = searchParams.get('examId')
    const academicYear = searchParams.get('academicYear')

    if (!schoolId) {
      return NextResponse.json({ error: 'School ID is required' }, { status: 400 })
    }

    let query = supabase
      .from('class_performance')
      .select(`
        *,
        class:classes(id, name, section),
        exam:exams(id, name, exam_type)
      `)
      .eq('school_id', schoolId)
      .order('calculated_at', { ascending: false })

    if (classId) {
      query = query.eq('class_id', classId)
    }

    if (examId) {
      query = query.eq('exam_id', examId)
    }

    if (academicYear) {
      query = query.eq('academic_year', academicYear)
    }

    const { data, error } = await query.limit(50)

    if (error) {
      console.error('Error fetching class performance:', error)
      return NextResponse.json({ error: 'Failed to fetch performance data' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Performance API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Calculate and store class performance
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { school_id, class_id, exam_id, academic_year } = body

    if (!school_id || !class_id || !exam_id) {
      return NextResponse.json(
        { error: 'Required fields: school_id, class_id, exam_id' },
        { status: 400 }
      )
    }

    // Get student IDs for the class first
    const { data: classStudents } = await supabase
      .from('students')
      .select('id')
      .eq('class_id', class_id)
    
    const studentIds = classStudents?.map((s: { id: string }) => s.id) || []
    
    if (studentIds.length === 0) {
      return NextResponse.json({ error: 'No students found in this class' }, { status: 404 })
    }

    // Get exam results for the class
    const { data: results, error: resultsError } = await supabase
      .from('exam_results')
      .select(`
        student_id,
        marks_obtained,
        total_marks,
        percentage,
        grade
      `)
      .eq('exam_id', exam_id)
      .in('student_id', studentIds)

    if (resultsError) {
      console.error('Error fetching results:', resultsError)
      return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 })
    }

    if (!results || results.length === 0) {
      return NextResponse.json({ error: 'No results found for this class and exam' }, { status: 404 })
    }

    const totalStudents = results.length
    const percentages = results.map((r: { percentage?: number }) => r.percentage || 0)
    
    const averagePercentage = percentages.reduce((a: number, b: number) => a + b, 0) / totalStudents
    const highestPercentage = Math.max(...percentages)
    const lowestPercentage = Math.min(...percentages)
    
    // Calculate pass count (assuming 40% is passing)
    const passCount = results.filter((r: { percentage?: number }) => (r.percentage || 0) >= 40).length
    const passPercentage = (passCount / totalStudents) * 100

    // Grade distribution
    const gradeDistribution: Record<string, number> = {}
    results.forEach((r: { grade?: string }) => {
      const grade = r.grade || 'N/A'
      gradeDistribution[grade] = (gradeDistribution[grade] || 0) + 1
    })

    const performanceData = {
      school_id,
      class_id,
      exam_id,
      academic_year: academic_year || new Date().getFullYear().toString(),
      total_students: totalStudents,
      appeared_students: totalStudents,
      passed_students: passCount,
      failed_students: totalStudents - passCount,
      average_percentage: Math.round(averagePercentage * 100) / 100,
      highest_percentage: highestPercentage,
      lowest_percentage: lowestPercentage,
      pass_percentage: Math.round(passPercentage * 100) / 100,
      grade_distribution: gradeDistribution,
      calculated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('class_performance')
      .upsert(performanceData, {
        onConflict: 'school_id,class_id,exam_id,academic_year',
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving performance:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Performance API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
