'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { User, School, SchoolSettings, ModuleName, LoginCredentials, UserRole, AuthContextType } from '@/types/tenant'
import { useRouter } from 'next/navigation'

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [school, setSchool] = useState<School | null>(null)
    const [settings, setSettings] = useState<SchoolSettings | null>(null)
    const [modules, setModules] = useState<ModuleName[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    // Verify session on mount
    useEffect(() => {
        const verifySession = async () => {
            const token = localStorage.getItem('auth_token')
            if (!token) {
                setIsLoading(false)
                return
            }

            try {
                const res = await fetch('/api/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })

                if (res.ok) {
                    const data = await res.json()
                    setUser(data.user)
                    setSchool(data.school)
                    setSettings(data.settings)
                    setModules(data.modules)
                } else {
                    localStorage.removeItem('auth_token')
                }
            } catch (err) {
                console.error('Session verification failed:', err)
            } finally {
                setIsLoading(false)
            }
        }

        verifySession()
    }, [])

    const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
        try {
            setIsLoading(true)
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            })

            const data = await res.json()

            if (!res.ok) {
                return { success: false, error: data.error || 'Login failed' }
            }

            localStorage.setItem('auth_token', data.token)
            setUser(data.user)

            // Re-verify after login to get full context
            const meRes = await fetch('/api/auth/me', {
                headers: { 'Authorization': `Bearer ${data.token}` }
            })

            if (meRes.ok) {
                const meData = await meRes.json()
                setSchool(meData.school)
                setSettings(meData.settings)
                setModules(meData.modules)
            }

            return { success: true }
        } catch (err) {
            return { success: false, error: 'Network error. Please try again.' }
        } finally {
            setIsLoading(false)
        }
    }

    const logout = async () => {
        const token = localStorage.getItem('auth_token')
        if (token) {
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            }).catch(() => { })
        }
        localStorage.removeItem('auth_token')
        setUser(null)
        setSchool(null)
        setSettings(null)
        setModules([])
        router.push('/login')
    }

    const hasModule = useCallback((moduleName: ModuleName): boolean => {
        if (user?.role === 'super_admin') return true
        return modules.includes(moduleName)
    }, [modules, user?.role])

    const hasRole = useCallback((roles: UserRole[]): boolean => {
        if (!user) return false
        return roles.includes(user.role)
    }, [user])

    const value: AuthContextType = {
        user,
        school,
        settings,
        modules,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        hasModule,
        hasRole,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within an AuthProvider')
    return context
}

export function useUser() {
    const { user } = useAuth()
    return user
}

export function useSchool() {
    const { school } = useAuth()
    return school
}

export function useIsAuthenticated() {
    const { isAuthenticated } = useAuth()
    return isAuthenticated
}
