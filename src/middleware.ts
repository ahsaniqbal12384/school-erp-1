import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
    const hostname = (request.headers.get('host') || '').toLowerCase()

    // Normalize main domain (strip port so "localhost:3000" and "localhost" both work)
    const mainDomain = (process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'localhost:3000')
        .toLowerCase()
        .replace(/:\d+$/, '')

    // Codespaces/preview hosts look like <hash>-3000.app.github.dev and should behave like main domain
    const isCodespacesHost = hostname.endsWith('.app.github.dev')
    const isLocalHost = hostname === 'localhost' || hostname.startsWith('localhost:')
    const isExplicitMain = hostname === mainDomain || hostname.endsWith(`.${mainDomain}`)

    let subdomain = ''

    if (!isCodespacesHost && !isLocalHost && !isExplicitMain) {
        // Extract subdomain for real tenant hosts (e.g., citygrammar.schoolerp.pk)
        const parts = hostname.split('.')
        if (parts.length > 2) {
            subdomain = parts[0]
        }

        // Ignore reserved subdomains
        const reserved = ['www', 'api', 'admin', 'app', 'mail']
        if (reserved.includes(subdomain)) {
            subdomain = ''
        }
    }

    const res = NextResponse.next()

    if (subdomain) {
        res.headers.set('x-school-slug', subdomain)
        res.cookies.set('school_slug', subdomain, {
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 1 week
        })
    } else if (request.cookies.has('school_slug')) {
        // Ensure stale tenant cookies are cleared on main/preview hosts
        res.cookies.delete('school_slug')
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
