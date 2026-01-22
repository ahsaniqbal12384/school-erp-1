'use client'

import { AuthProvider } from '@/lib/auth/context'
import { TenantProvider } from '@/lib/tenant/context'

interface ProvidersProps {
    children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
    return (
        <TenantProvider>
            <AuthProvider>
                {children}
            </AuthProvider>
        </TenantProvider>
    )
}
