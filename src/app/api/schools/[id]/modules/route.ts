import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/client'

// GET /api/schools/[id]/modules - Get school modules
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = createServerClient()
        const { id } = await params

        const { data: modules, error } = await supabase
            .from('school_modules')
            .select('*')
            .eq('school_id', id)
            .order('module_name')

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Categorize modules
        const enabledModules = modules?.filter(m => m.is_enabled).map(m => m.module_name) || []
        const disabledModules = modules?.filter(m => !m.is_enabled).map(m => m.module_name) || []

        return NextResponse.json({
            modules,
            enabled: enabledModules,
            disabled: disabledModules,
            total: modules?.length || 0
        })
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// PUT /api/schools/[id]/modules - Update school modules
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = createServerClient()
        const { id } = await params
        const body = await request.json()

        const { enabled_modules } = body

        if (!Array.isArray(enabled_modules)) {
            return NextResponse.json(
                { error: 'enabled_modules must be an array' },
                { status: 400 }
            )
        }

        // Get all current modules for this school
        const { data: currentModules } = await supabase
            .from('school_modules')
            .select('module_name, is_enabled')
            .eq('school_id', id)

        const currentModuleNames = currentModules?.map(m => m.module_name) || []

        // Modules to add (new ones)
        const toAdd = enabled_modules.filter((m: string) => !currentModuleNames.includes(m))

        // Modules to enable (already exist but disabled)
        const toEnable = enabled_modules.filter((m: string) => {
            const existing = currentModules?.find(cm => cm.module_name === m)
            return existing && !existing.is_enabled
        })

        // Modules to disable (exist but not in new list)
        const toDisable = currentModuleNames.filter(m => !enabled_modules.includes(m))

        // Add new modules
        if (toAdd.length > 0) {
            const inserts = toAdd.map((moduleName: string) => ({
                school_id: id,
                module_name: moduleName,
                is_enabled: true
            }))
            await supabase.from('school_modules').insert(inserts)
        }

        // Enable modules
        if (toEnable.length > 0) {
            await supabase
                .from('school_modules')
                .update({
                    is_enabled: true,
                    enabled_at: new Date().toISOString(),
                    disabled_at: null
                })
                .eq('school_id', id)
                .in('module_name', toEnable)
        }

        // Disable modules
        if (toDisable.length > 0) {
            await supabase
                .from('school_modules')
                .update({
                    is_enabled: false,
                    disabled_at: new Date().toISOString()
                })
                .eq('school_id', id)
                .in('module_name', toDisable)
        }

        // Fetch updated modules
        const { data: updatedModules } = await supabase
            .from('school_modules')
            .select('*')
            .eq('school_id', id)
            .order('module_name')

        return NextResponse.json({
            success: true,
            modules: updatedModules,
            enabled: updatedModules?.filter(m => m.is_enabled).map(m => m.module_name) || [],
            changes: {
                added: toAdd,
                enabled: toEnable,
                disabled: toDisable
            },
            message: 'Modules updated successfully'
        })

    } catch (error) {
        console.error('Update modules error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
