import { NextRequest, NextResponse } from 'next/server'
import { createUntypedClient as createClient } from '@/lib/supabase/server'

// GET - Fetch generated reports
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId')
    const reportType = searchParams.get('reportType')

    if (!schoolId) {
      return NextResponse.json({ error: 'School ID is required' }, { status: 400 })
    }

    let query = supabase
      .from('generated_reports')
      .select(`
        *,
        report_type:report_types(id, name, category)
      `)
      .eq('school_id', schoolId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (reportType) {
      query = query.eq('report_type_id', reportType)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching reports:', error)
      return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Reports API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Generate a new report
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const {
      school_id,
      report_type_id,
      name,
      parameters,
      generated_by,
    } = body

    if (!school_id || !report_type_id || !name) {
      return NextResponse.json(
        { error: 'Required fields: school_id, report_type_id, name' },
        { status: 400 }
      )
    }

    // Create report record with pending status
    const { data: report, error: reportError } = await supabase
      .from('generated_reports')
      .insert({
        school_id,
        report_type_id,
        name,
        parameters: parameters || {},
        status: 'pending',
        generated_by,
      })
      .select()
      .single()

    if (reportError) {
      console.error('Error creating report:', reportError)
      return NextResponse.json({ error: reportError.message }, { status: 500 })
    }

    // In a real implementation, you would trigger a background job here
    // to generate the actual report data and update the status

    // For now, let's simulate report generation
    const reportData = await generateReportData(supabase, school_id, report_type_id, parameters)

    // Update report with generated data
    const { data: updatedReport, error: updateError } = await supabase
      .from('generated_reports')
      .update({
        data: reportData,
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', report.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating report:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json(updatedReport, { status: 201 })
  } catch (error) {
    console.error('Reports API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper function to generate report data based on type
async function generateReportData(
  supabase: Awaited<ReturnType<typeof createClient>>,
  schoolId: string,
  reportTypeId: string,
  parameters: Record<string, unknown>
) {
  // Get report type
  const { data: reportType } = await supabase
    .from('report_types')
    .select('code')
    .eq('id', reportTypeId)
    .single()

  const code = reportType?.code

  switch (code) {
    case 'student_list':
      return generateStudentListReport(supabase, schoolId, parameters)
    case 'fee_collection':
      return generateFeeReport(supabase, schoolId, parameters)
    case 'attendance_summary':
      return generateAttendanceReport(supabase, schoolId, parameters)
    default:
      return { message: 'Report type not implemented' }
  }
}

async function generateStudentListReport(
  supabase: Awaited<ReturnType<typeof createClient>>,
  schoolId: string,
  parameters: Record<string, unknown>
) {
  const { data } = await supabase
    .from('students')
    .select(`
      id, first_name, last_name, admission_no, 
      class:classes(name),
      created_at
    `)
    .eq('school_id', schoolId)
    .eq('status', 'active')
    .order('first_name')

  return {
    total: data?.length || 0,
    students: data || [],
    generatedAt: new Date().toISOString(),
  }
}

async function generateFeeReport(
  supabase: Awaited<ReturnType<typeof createClient>>,
  schoolId: string,
  parameters: Record<string, unknown>
) {
  const { data } = await supabase
    .from('fee_payments')
    .select(`
      id, amount, payment_date, payment_method,
      invoice:fee_invoices(
        student:students(first_name, last_name, admission_no)
      )
    `)
    .eq('school_id', schoolId)
    .order('payment_date', { ascending: false })
    .limit(100)

  const total = data?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0

  return {
    totalCollection: total,
    payments: data || [],
    generatedAt: new Date().toISOString(),
  }
}

async function generateAttendanceReport(
  supabase: Awaited<ReturnType<typeof createClient>>,
  schoolId: string,
  parameters: Record<string, unknown>
) {
  const { data } = await supabase
    .from('attendance')
    .select('status')
    .eq('school_id', schoolId)

  const summary = {
    total: data?.length || 0,
    present: data?.filter(a => a.status === 'present').length || 0,
    absent: data?.filter(a => a.status === 'absent').length || 0,
  }

  return {
    summary,
    generatedAt: new Date().toISOString(),
  }
}
