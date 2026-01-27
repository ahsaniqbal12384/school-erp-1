// Utility functions for multi-tenant operations

/**
 * Extract school slug from hostname
 * e.g., "citygrammar.yourapp.com" -> "citygrammar"
 */
export function getSchoolSlugFromHost(hostname: string, mainDomain?: string): string | null {
    const domain = mainDomain || process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'localhost:3000'

    // Remove port if present
    const hostWithoutPort = hostname.split(':')[0]
    const domainWithoutPort = domain.split(':')[0]

    // Codespaces/preview hosts (e.g., *.app.github.dev) should behave like the main domain
    if (hostWithoutPort.endsWith('.app.github.dev')) {
        return null
    }

    // If it's the main domain or localhost, no subdomain
    if (hostWithoutPort === domainWithoutPort || hostWithoutPort === 'localhost') {
        return null
    }

    // Extract subdomain
    const parts = hostWithoutPort.split('.')

    // Must have at least 2 parts for subdomain
    if (parts.length < 2) {
        return null
    }

    // Get the first part as subdomain
    const subdomain = parts[0]

    // Ignore common subdomains
    if (['www', 'admin', 'api', 'app', 'mail'].includes(subdomain)) {
        return null
    }

    return subdomain
}

/**
 * Get school slug from URL path
 * e.g., "/s/citygrammar/dashboard" -> "citygrammar"
 */
export function getSchoolSlugFromPath(pathname: string): string | null {
    const match = pathname.match(/^\/s\/([^\/]+)/)
    return match ? match[1] : null
}

/**
 * Get school slug from cookie
 */
export function getSchoolSlugFromCookie(): string | null {
    if (typeof document === 'undefined') return null

    const match = document.cookie.match(/school_slug=([^;]+)/)
    return match ? decodeURIComponent(match[1]) : null
}

/**
 * Set school slug in cookie
 */
export function setSchoolSlugCookie(slug: string): void {
    if (typeof document === 'undefined') return

    document.cookie = `school_slug=${encodeURIComponent(slug)}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=lax`
}

/**
 * Clear school slug cookie
 */
export function clearSchoolSlugCookie(): void {
    if (typeof document === 'undefined') return

    document.cookie = 'school_slug=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
}

/**
 * Get current school slug from any available source
 */
export function getCurrentSchoolSlug(): string | null {
    if (typeof window === 'undefined') return null

    // Try from URL first
    const fromPath = getSchoolSlugFromPath(window.location.pathname)
    if (fromPath) return fromPath

    // Try from hostname (subdomain)
    const fromHost = getSchoolSlugFromHost(window.location.host)
    if (fromHost) return fromHost

    // Try from URL params
    const params = new URLSearchParams(window.location.search)
    const fromParam = params.get('school')
    if (fromParam) return fromParam

    // Try from cookie
    const fromCookie = getSchoolSlugFromCookie()
    if (fromCookie) return fromCookie

    // Try from localStorage
    const fromStorage = localStorage.getItem('school_slug')
    if (fromStorage) return fromStorage

    return null
}

/**
 * Build URL for a specific school
 */
export function buildSchoolUrl(slug: string, path: string = '/'): string {
    const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'localhost:3000'
    const protocol = mainDomain.includes('localhost') ? 'http' : 'https'

    // In development, use path-based routing
    if (mainDomain.includes('localhost')) {
        return `${protocol}://${mainDomain}/s/${slug}${path}`
    }

    // In production, use subdomain routing
    return `${protocol}://${slug}.${mainDomain}${path}`
}

/**
 * Check if current context is Super Admin (main domain)
 */
export function isSuperAdminContext(): boolean {
    const slug = getCurrentSchoolSlug()
    return slug === null
}

/**
 * Validate school slug format
 */
export function isValidSchoolSlug(slug: string): boolean {
    // Must be lowercase alphanumeric with hyphens
    const regex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/

    // Must be between 3 and 50 characters
    if (slug.length < 3 || slug.length > 50) return false

    // Must not be a reserved word
    const reserved = ['admin', 'api', 'www', 'mail', 'app', 'login', 'register', 'super-admin', 'superadmin']
    if (reserved.includes(slug)) return false

    return regex.test(slug)
}

/**
 * Generate a slug from school name
 */
export function generateSlugFromName(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens
        .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
        .substring(0, 50) // Limit length
}
