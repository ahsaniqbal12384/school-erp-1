import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/client'

// GET /api/schools/[id] - Get school details
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = createServerClient()
        const { id } = await params

        const { data: school, error } = await supabase
            .from('schools')
            .select(`
        *,
        school_settings (*),
        school_modules (*)
      `)
            .eq('id', id)
            .single()

        if (error) {
            return NextResponse.json({ error: 'School not found' }, { status: 404 })
        }

        return NextResponse.json({ school })
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// PATCH /api/schools/[id] - Update school
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = createServerClient()
        const { id } = await params
        const body = await request.json()

        // Separate school data from settings and modules
        const {
            school_settings,
            enabled_modules,
            ...schoolData
        } = body

        // Update school
        if (Object.keys(schoolData).length > 0) {
            const { error: schoolError } = await supabase
                .from('schools')
                .update({
                    ...schoolData,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)

            if (schoolError) {
                return NextResponse.json({ error: schoolError.message }, { status: 500 })
            }
        }

        // Update settings if provided
        if (school_settings) {
            const { error: settingsError } = await supabase
                .from('school_settings')
                .update({
                    ...school_settings,
                    updated_at: new Date().toISOString()
                })
                .eq('school_id', id)

            if (settingsError) {
                return NextResponse.json({ error: settingsError.message }, { status: 500 })
            }
        }

        // Update modules if provided
        if (enabled_modules && Array.isArray(enabled_modules)) {
            // Get current modules
            const { data: currentModules } = await supabase
                .from('school_modules')
                .select('module_name')
                .eq('school_id', id)

            const currentModuleNames = currentModules?.map(m => m.module_name) || []

            // Find modules to enable and disable
            const toEnable = enabled_modules.filter((m: string) => !currentModuleNames.includes(m))
            const toDisable = currentModuleNames.filter(m => !enabled_modules.includes(m))

            // Insert new modules
            if (toEnable.length > 0) {
                const inserts = toEnable.map((moduleName: string) => ({
                    school_id: id,
                    module_name: moduleName,
                    is_enabled: true
                }))
                await supabase.from('school_modules').insert(inserts)
            }

            // Update disabled modules
            if (toDisable.length > 0) {
                await supabase
                    .from('school_modules')
                    .update({ is_enabled: false, disabled_at: new Date().toISOString() })
                    .eq('school_id', id)
                    .in('module_name', toDisable)
            }

            // Re-enable previously disabled modules
            const toReEnable = enabled_modules.filter((m: string) =>
                currentModuleNames.includes(m)
            )
            if (toReEnable.length > 0) {
                await supabase
                    .from('school_modules')
                    .update({ is_enabled: true, disabled_at: null })
                    .eq('school_id', id)
                    .in('module_name', toReEnable)
            }
        }

        // Fetch updated school
        const { data: updatedSchool } = await supabase
            .from('schools')
            .select('*, school_settings(*), school_modules(*)')
            .eq('id', id)
            .single()

        return NextResponse.json({
            success: true,
            school: updatedSchool,
            message: 'School updated successfully'
        })

    } catch (error) {
        console.error('Update school error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// DELETE /api/schools/[id] - Delete school
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = createServerClient()
        const { id } = await params

        // Soft delete - just mark as inactive
        const { error } = await supabase
            .from('schools')
            .update({
                is_active: false,
                subscription_status: 'cancelled',
                updated_at: new Date().toISOString()
            })
            .eq('id', id)

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            message: 'School has been deactivated'
        })

    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
