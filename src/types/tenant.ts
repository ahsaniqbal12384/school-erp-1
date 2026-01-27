export type UserRole =
    | 'super_admin'
    | 'school_admin'
    | 'teacher'
    | 'parent'
    | 'student'
    | 'accountant'
    | 'librarian'
    | 'transport_manager'
    | 'staff'

export type SubscriptionPlan = 'basic' | 'standard' | 'premium' | 'enterprise'
export type SubscriptionStatus = 'active' | 'trial' | 'expired' | 'suspended' | 'cancelled'

export type ModuleName =
    | 'students'
    | 'staff'
    | 'fees'
    | 'attendance'
    | 'exams'
    | 'communications'
    | 'admissions'
    | 'homework'
    | 'reports'
    | 'transport'
    | 'library'
    | 'timetable'
    | 'inventory'
    | 'payroll'

export interface LoginCredentials {
    email: string
    password: string
    schoolSlug?: string
    selectedRole?: string  // The role user selected on login page
}

export interface School {
    id: string
    name: string
    slug: string
    email: string | null
    phone: string | null
    address: string | null
    city: string | null
    principal_name: string | null
    logo_url: string | null
    subscription_plan: SubscriptionPlan
    subscription_status: SubscriptionStatus
    subscription_expires_at: string | null
    is_active: boolean
    max_students: number
    max_staff: number
    created_at: string
    updated_at: string
    current_students?: number
    current_staff?: number
    enabled_modules?: string[]
}

export interface SchoolSettings {
    id: string
    school_id: string
    primary_color: string
    secondary_color: string
    accent_color: string
    school_motto: string | null
    academic_year: string
    term_system: string
    currency: string
    timezone: string
    date_format: string
    time_format: string
    sms_enabled: boolean
    email_enabled: boolean
    parent_portal_enabled: boolean
    student_portal_enabled: boolean
    online_payment_enabled: boolean
    biometric_attendance: boolean
    working_days: string[]
    school_timing_start: string
    school_timing_end: string
}

export interface User {
    id: string
    email: string
    first_name: string | null
    last_name: string | null
    full_name?: string
    role: UserRole
    phone: string | null
    school_id: string | null
    avatar_url: string | null
    is_active: boolean
    last_login: string | null
    created_at: string
}

// Helper to get full name from user
export function getUserFullName(user: User): string {
    if (user.full_name) return user.full_name
    const parts = [user.first_name, user.last_name].filter(Boolean)
    return parts.length > 0 ? parts.join(' ') : user.email
}

export interface TenantContext {
    school: School | null
    settings: SchoolSettings | null
    modules: ModuleName[]
    hasModule: (moduleName: ModuleName) => boolean
    isLoading: boolean
}

export interface AuthContextType {
    user: User | null
    school: School | null
    settings: SchoolSettings | null
    modules: ModuleName[]
    isLoading: boolean
    isAuthenticated: boolean
    login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>
    logout: () => Promise<void>
    hasModule: (moduleName: ModuleName) => boolean
    hasRole: (roles: UserRole[]) => boolean
}

export const AVAILABLE_MODULES = [
    { name: 'students', label: 'Student Management', category: 'core', description: 'Student profiles, parent links, and records.' },
    { name: 'staff', label: 'Staff Management', category: 'core', description: 'Employee records and departments.' },
    { name: 'attendance', label: 'Attendance', category: 'academic', description: 'Daily attendance tracking for students/staff.' },
    { name: 'exams', label: 'Exams & Grading', category: 'academic', description: 'Exam schedules, marksheets, and report cards.' },
    { name: 'homework', label: 'Homework', category: 'academic', description: 'Assignments and submissions tracking.' },
    { name: 'fees', label: 'Fee Management', category: 'finance', description: 'Fee structure, challans, and collections.' },
    { name: 'payroll', label: 'Payroll', category: 'finance', description: 'Salary processing and slips.' },
    { name: 'communications', label: 'Communications', category: 'operations', description: 'SMS alerts and broadcasts.' },
    { name: 'admissions', label: 'Admissions', category: 'operations', description: 'New inquiries and registrations.' },
    { name: 'transport', label: 'Transport', category: 'operations', description: 'Buses, routes, and tracking.' },
    { name: 'library', label: 'Library', category: 'operations', description: 'Book catalog and issuing system.' },
    { name: 'inventory', label: 'Inventory', category: 'operations', description: 'School assets and stocks.' },
    { name: 'timetable', label: 'Timetable', category: 'extras', description: 'Class and teacher schedules.' },
    { name: 'reports', label: 'Advanced Reports', category: 'extras', description: 'Audit logs and analytics.' },
]
