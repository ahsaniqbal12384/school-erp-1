'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { useAuth } from '@/lib/auth/context'
import { getUserFullName } from '@/types/tenant'
import { Loader2 } from 'lucide-react'

export default function LibrarianLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const { user, school, isLoading, isAuthenticated } = useAuth()

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login')
        } else if (!isLoading && user && user.role !== 'librarian') {
            router.push('/login')
        }
    }, [isLoading, isAuthenticated, user, router])

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!isAuthenticated || !user || user.role !== 'librarian') {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    const currentUser = {
        name: getUserFullName(user),
        email: user.email,
        avatar: user.avatar_url || undefined,
    }

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar role="librarian" />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header role="librarian" user={currentUser} schoolName={school?.name} />
                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
