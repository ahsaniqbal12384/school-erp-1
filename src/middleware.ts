import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
    const url = request.nextUrl
    const hostname = request.headers.get('host') || ''

    // Define your main domain (e.g., localhost:3000 or yourdomain.com)
    const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'localhost:3000'

    // 1. Extract the subdomain
    const parts = hostname.split('.')
    let subdomain = ''

    if (hostname.includes('localhost')) {
        // For localhost development: citygrammar.localhost:3000
        if (parts.length > 1 && parts[0] !== 'localhost') {
            subdomain = parts[0]
        }
    } else {
        // For production: citygrammar.schoolerp.pk
        if (parts.length > 2) {
            subdomain = parts[0]
        }
    }

    // 2. Ignore common subdomains
    const reserved = ['www', 'api', 'admin', 'app', 'mail']
    if (reserved.includes(subdomain)) {
        subdomain = ''
    }

    // 3. Handle routing
    const res = NextResponse.next()

    if (subdomain) {
        // Set a header so the app knows which school this is
        res.headers.set('x-school-slug', subdomain)

        // Also set a cookie for client-side access
        res.cookies.set('school_slug', subdomain, {
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 1 week
        })
    } else {
        // On the main domain, clear the school cookie if it exists
        if (request.cookies.has('school_slug')) {
            res.cookies.delete('school_slug')
        }
    }

    return res
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
