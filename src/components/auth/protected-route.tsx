'use client'

import { useAuth } from '@/lib/auth/context'
import { ModuleName, UserRole } from '@/types/tenant'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShieldX, ArrowLeft, Lock, AlertCircle } from 'lucide-react'

interface ProtectedRouteProps {
    children: React.ReactNode
    allowedRoles?: UserRole[]
    requiredModule?: ModuleName
    fallbackPath?: string
}

export function ProtectedRoute({
    children,
    allowedRoles,
    requiredModule,
    fallbackPath = '/login'
}: ProtectedRouteProps) {
    const { user, hasModule, isLoading, isAuthenticated } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push(fallbackPath)
        }
    }, [isLoading, isAuthenticated, router, fallbackPath])

    if (isLoading) {
        return <LoadingScreen />
    }

    if (!isAuthenticated || !user) {
        return <LoadingScreen />
    }

    // Check role access
    if (allowedRoles && allowedRoles.length > 0) {
        const hasRoleAccess = allowedRoles.includes(user.role) || user.role === 'super_admin'
        if (!hasRoleAccess) {
            return <AccessDenied reason="role" />
        }
    }

    // Check module access
    if (requiredModule) {
        const hasModuleAccess = user.role === 'super_admin' || hasModule(requiredModule)
        if (!hasModuleAccess) {
            return <AccessDenied reason="module" moduleName={requiredModule} />
        }
    }

    return <>{children}</>
}

function LoadingScreen() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto" />
                <p className="text-muted-foreground">Loading...</p>
            </div>
        </div>
    )
}

interface AccessDeniedProps {
    reason: 'role' | 'module'
    moduleName?: string
}

function AccessDenied({ reason, moduleName }: AccessDeniedProps) {
    const router = useRouter()

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="max-w-md w-full">
                <CardContent className="pt-6 text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
                            {reason === 'role' ? (
                                <ShieldX className="h-8 w-8 text-red-500" />
                            ) : (
                                <Lock className="h-8 w-8 text-red-500" />
                            )}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold">Access Denied</h2>
                        <p className="text-muted-foreground mt-2">
                            {reason === 'role'
                                ? "You don't have permission to access this page."
                                : `The "${moduleName}" module is not enabled for your school.`
                            }
                        </p>
                    </div>

                    {reason === 'module' && (
                        <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                            <div className="flex items-start gap-3 text-left">
                                <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-medium text-yellow-600">Module Not Available</p>
                                    <p className="text-muted-foreground mt-1">
                                        Contact your school administrator or upgrade your subscription to access this feature.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <Button onClick={() => router.back()}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Go Back
                        </Button>
                        <Button variant="outline" onClick={() => router.push('/')}>
                            Go to Dashboard
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

// Higher-order component for protecting pages
export function withModuleAccess<P extends object>(
    Component: React.ComponentType<P>,
    requiredModule: ModuleName
) {
    return function ProtectedComponent(props: P) {
        return (
            <ProtectedRoute requiredModule={requiredModule}>
                <Component {...props} />
            </ProtectedRoute>
        )
    }
}

// Higher-order component for protecting pages by role
export function withRoleAccess<P extends object>(
    Component: React.ComponentType<P>,
    allowedRoles: UserRole[]
) {
    return function ProtectedComponent(props: P) {
        return (
            <ProtectedRoute allowedRoles={allowedRoles}>
                <Component {...props} />
            </ProtectedRoute>
        )
    }
}

export default ProtectedRoute
