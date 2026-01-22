import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Refresh session if expired
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Protected routes logic
    const pathname = request.nextUrl.pathname

    // Public routes that don't require authentication
    const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/reset-password']
    const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith('/api/public'))

    // Check if user is trying to access protected routes
    if (!user && !isPublicRoute && !pathname.startsWith('/_next')) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        url.searchParams.set('redirect', pathname)
        return NextResponse.redirect(url)
    }

    // If logged in user tries to access login/register, redirect to dashboard
    if (user && (pathname === '/login' || pathname === '/register')) {
        const url = request.nextUrl.clone()
        // Redirect based on user role (we'll check this in the page)
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}
