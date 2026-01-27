import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/client'

// Helper to verify auth token
async function verifyAuth(request: NextRequest) {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) return null

    const supabase = createServerClient()
    const { data: session } = await supabase
        .from('user_sessions')
        .select('*, users(*)')
        .eq('token', token)
        .gt('expires_at', new Date().toISOString())
        .single()

    return session
}

// GET /api/portal/transport - Get transport information
export async function GET(request: NextRequest) {
    try {
        const session = await verifyAuth(request)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = session.users
        const supabase = createServerClient()

        const searchParams = request.nextUrl.searchParams
        const studentId = searchParams.get('student_id')

        // Get transport assignment for the student
        const { data: assignment, error: assignmentError } = await supabase
            .from('student_transport')
            .select(`
                *,
                transport_routes(
                    id, name, description, start_point, end_point,
                    pickup_time, drop_time, monthly_fee
                ),
                transport_vehicles(
                    id, vehicle_number, type, capacity, driver_name, driver_phone
                )
            `)
            .eq('student_id', studentId || user.id)
            .single()

        if (assignmentError) {
            return NextResponse.json({
                assignment: null,
                route: null,
                vehicle: null,
                tracking: null,
                source: 'empty'
            })
        }

        // Get live tracking data (if available)
        let tracking = null
        if (assignment?.vehicle_id) {
            const { data: trackingData } = await supabase
                .from('vehicle_tracking')
                .select('*')
                .eq('vehicle_id', assignment.vehicle_id)
                .order('timestamp', { ascending: false })
                .limit(1)
                .single()

            tracking = trackingData
        }

        return NextResponse.json({
            assignment,
            route: assignment?.transport_routes || null,
            vehicle: assignment?.transport_vehicles || null,
            tracking
        })
    } catch (error) {
        console.error('Portal transport error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
