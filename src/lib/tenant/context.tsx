'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { School, SchoolSettings, ModuleName, TenantContext as TenantContextType } from '@/types/tenant'
import { supabase } from '@/lib/supabase/client'

const TenantContext = createContext<TenantContextType | null>(null)

interface TenantProviderProps {
    children: React.ReactNode
    schoolSlug?: string // From subdomain or URL
}

export function TenantProvider({ children, schoolSlug }: TenantProviderProps) {
    const [school, setSchool] = useState<School | null>(null)
    const [settings, setSettings] = useState<SchoolSettings | null>(null)
    const [modules, setModules] = useState<ModuleName[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Fetch school data by slug
    const fetchSchoolBySlug = useCallback(async (slug: string) => {
        try {
            // Fetch school
            const { data: schoolData, error: schoolError } = await supabase
                .from('schools')
                .select('*')
                .eq('slug', slug)
                .eq('is_active', true)
                .single()

            if (schoolError || !schoolData) {
                console.error('School not found:', schoolError)
                setIsLoading(false)
                return
            }

            setSchool(schoolData)

            // Fetch school settings
            const { data: settingsData } = await supabase
                .from('school_settings')
                .select('*')
                .eq('school_id', schoolData.id)
                .single()

            if (settingsData) {
                setSettings(settingsData)
                // Apply school branding colors
                if (typeof document !== 'undefined') {
                    const root = document.documentElement
                    if (settingsData.primary_color) {
                        root.style.setProperty('--school-primary', settingsData.primary_color)
                    }
                    if (settingsData.secondary_color) {
                        root.style.setProperty('--school-secondary', settingsData.secondary_color)
                    }
                    if (settingsData.accent_color) {
                        root.style.setProperty('--school-accent', settingsData.accent_color)
                    }
                }
            }

            // Fetch enabled modules
            const { data: modulesData } = await supabase
                .from('school_modules')
                .select('module_name')
                .eq('school_id', schoolData.id)
                .eq('is_enabled', true)

            if (modulesData) {
                setModules(modulesData.map(m => m.module_name as ModuleName))
            }

            setIsLoading(false)
        } catch (error) {
            console.error('Error fetching school:', error)
            setIsLoading(false)
        }
    }, [])

    // Check if school has access to a module
    const hasModule = useCallback((moduleName: ModuleName): boolean => {
        return modules.includes(moduleName)
    }, [modules])

    // Fetch school on mount if slug provided
    useEffect(() => {
        let mounted = true

        async function init() {
            if (schoolSlug) {
                await fetchSchoolBySlug(schoolSlug)
            } else {
                // Try to get slug from localStorage or URL
                const storedSlug = localStorage.getItem('school_slug')
                if (storedSlug && mounted) {
                    await fetchSchoolBySlug(storedSlug)
                } else if (mounted) {
                    setIsLoading(false)
                }
            }
        }

        init()
        return () => { mounted = false }
    }, [schoolSlug, fetchSchoolBySlug])

    const value: TenantContextType = {
        school,
        settings,
        modules,
        hasModule,
        isLoading,
    }

    return (
        <TenantContext.Provider value={value}>
            {children}
        </TenantContext.Provider>
    )
}

export function useTenant() {
    const context = useContext(TenantContext)
    if (!context) {
        throw new Error('useTenant must be used within a TenantProvider')
    }
    return context
}

// Hook to check module access
export function useHasModule(moduleName: ModuleName): boolean {
    const { hasModule } = useTenant()
    return hasModule(moduleName)
}

// Hook to get school settings
export function useSchoolSettings(): SchoolSettings | null {
    const { settings } = useTenant()
    return settings
}

export default TenantContext
