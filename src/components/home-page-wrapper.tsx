'use client'

import { useEffect, useState } from 'react'
import SchoolLandingPage from '@/components/school-landing-page'
import { Loader2 } from 'lucide-react'

interface HomePageWrapperProps {
    children: React.ReactNode
}

export default function HomePageWrapper({ children }: HomePageWrapperProps) {
    const [isMainDomain, setIsMainDomain] = useState<boolean | null>(null)
    const [schoolSlug, setSchoolSlug] = useState<string | null>(null)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const hostname = window.location.hostname
            
            // Treat these as main domain (no school subdomain)
            const isMain =
                hostname === 'localhost' ||
                hostname === '127.0.0.1' ||
                hostname === 'schoolerp.pk' ||
                hostname === 'www.schoolerp.pk' ||
                hostname.endsWith('.app.github.dev') // Codespaces preview URLs

            // Also check if the URL has a school parameter (for testing)
            const urlParams = new URLSearchParams(window.location.search)
            const schoolParam = urlParams.get('school')
            
            if (schoolParam) {
                // URL parameter override for testing
                setIsMainDomain(false)
                setSchoolSlug(schoolParam)
            } else if (isMain) {
                setIsMainDomain(true)
                setSchoolSlug(null)
            } else {
                // Extract subdomain for production tenant hosts (e.g., citygrammar.schoolerp.pk)
                const parts = hostname.split('.')
                if (parts.length >= 3 && parts[0] !== 'www') {
                    setIsMainDomain(false)
                    setSchoolSlug(parts[0])
                } else {
                    // Default to main domain
                    setIsMainDomain(true)
                    setSchoolSlug(null)
                }
            }
        }
    }, [])

    // Still loading
    if (isMainDomain === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <Loader2 className="h-12 w-12 animate-spin text-white" />
            </div>
        )
    }

    // School subdomain - show school landing page
    if (!isMainDomain && schoolSlug) {
        return <SchoolLandingPage schoolSlug={schoolSlug} />
    }

    // Main domain - show main marketing page (children)
    return <>{children}</>
}
