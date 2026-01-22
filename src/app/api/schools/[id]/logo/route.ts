import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/client'

// POST /api/schools/[id]/logo - Upload school logo
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = createServerClient()
        const { id } = await params

        const formData = await request.formData()
        const file = formData.get('logo') as File | null

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            )
        }

        // Validate file type
        const allowedTypes = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Allowed: PNG, JPEG, SVG, WebP' },
                { status: 400 }
            )
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            return NextResponse.json(
                { error: 'File too large. Maximum size is 2MB' },
                { status: 400 }
            )
        }

        // Generate unique filename
        const ext = file.name.split('.').pop()
        const filename = `logos/${id}/logo_${Date.now()}.${ext}`

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('school-assets')
            .upload(filename, file, {
                cacheControl: '3600',
                upsert: true
            })

        if (uploadError) {
            console.error('Upload error:', uploadError)
            return NextResponse.json(
                { error: 'Failed to upload file' },
                { status: 500 }
            )
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('school-assets')
            .getPublicUrl(filename)

        const logoUrl = urlData.publicUrl

        // Update school record
        const { error: updateError } = await supabase
            .from('schools')
            .update({
                logo_url: logoUrl,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)

        if (updateError) {
            return NextResponse.json(
                { error: 'Failed to update school record' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            logo_url: logoUrl,
            message: 'Logo uploaded successfully'
        })

    } catch (error) {
        console.error('Logo upload error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// DELETE /api/schools/[id]/logo - Remove school logo
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = createServerClient()
        const { id } = await params

        // Get current logo URL
        const { data: school } = await supabase
            .from('schools')
            .select('logo_url')
            .eq('id', id)
            .single()

        if (school?.logo_url) {
            // Extract filename from URL
            const urlParts = school.logo_url.split('/')
            const filename = urlParts.slice(-2).join('/')

            // Delete from storage
            await supabase.storage
                .from('school-assets')
                .remove([`logos/${id}/${filename.split('/').pop()}`])
        }

        // Update school record
        await supabase
            .from('schools')
            .update({
                logo_url: null,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)

        return NextResponse.json({
            success: true,
            message: 'Logo removed successfully'
        })

    } catch (error) {
        console.error('Logo delete error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
