import { useAuth } from './context'
import { ModuleName, UserRole } from '@/types/tenant'

// Check if user has access to a specific module
export function useModuleAccess(moduleName: ModuleName): boolean {
    const { hasModule, user } = useAuth()

    // Super admin has access to everything
    if (user?.role === 'super_admin') return true

    return hasModule(moduleName)
}

// Check if user has one of the specified roles
export function useRoleAccess(allowedRoles: UserRole[]): boolean {
    const { user } = useAuth()

    if (!user) return false

    return allowedRoles.includes(user.role)
}

// Combined hook for checking both role and module access
export function useAccess(
    allowedRoles: UserRole[],
    requiredModule?: ModuleName
): { hasAccess: boolean; isLoading: boolean } {
    const { user, hasModule, isLoading } = useAuth()

    if (isLoading) {
        return { hasAccess: false, isLoading: true }
    }

    if (!user) {
        return { hasAccess: false, isLoading: false }
    }

    // Check role
    const hasRoleAccess = allowedRoles.includes(user.role) || user.role === 'super_admin'

    if (!hasRoleAccess) {
        return { hasAccess: false, isLoading: false }
    }

    // Check module if specified
    if (requiredModule) {
        const hasModuleAccess = user.role === 'super_admin' || hasModule(requiredModule)
        return { hasAccess: hasModuleAccess, isLoading: false }
    }

    return { hasAccess: true, isLoading: false }
}

// Get redirect path based on user role
export function useRoleRedirect(): string {
    const { user } = useAuth()

    if (!user) return '/login'

    switch (user.role) {
        case 'super_admin':
            return '/super-admin'
        case 'school_admin':
            return '/school/admin'
        case 'teacher':
            return '/school/teacher'
        case 'accountant':
            return '/school/accountant'
        case 'librarian':
            return '/school/librarian'
        case 'transport_manager':
            return '/school/transport'
        case 'parent':
        case 'student':
            return '/portal'
        default:
            return '/login'
    }
}

// Role-based navigation items
export function useNavigationByRole() {
    const { user, hasModule } = useAuth()

    if (!user) return []

    // Return navigation items based on role and enabled modules
    // This can be extended based on your sidebar logic

    return []
}

export { useAuth, useUser, useSchool, useIsAuthenticated } from './context'
