'use client'

// Force dynamic rendering to support useSearchParams
export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    GraduationCap,
    Mail,
    Lock,
    ArrowRight,
    Building2,
    AlertCircle,
    Eye,
    EyeOff,
    Loader2,
    Shield,
    User,
    Users,
    BookOpen,
} from 'lucide-react'

// Role types for login
type LoginRole = 'super_admin' | 'school_admin' | 'teacher' | 'parent' | 'student'

interface RoleOption {
    id: LoginRole
    label: string
    icon: React.ReactNode
    description: string
    color: string
}

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { login, isAuthenticated, user, isLoading: authLoading } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [schoolSlug, setSchoolSlug] = useState<string | null>(null)
    const [selectedRole, setSelectedRole] = useState<LoginRole | null>(null)
    const [isMainDomain, setIsMainDomain] = useState(false)

    // Role options for school portal (no super_admin)
    const schoolRoles: RoleOption[] = [
        {
            id: 'school_admin',
            label: 'Admin',
            icon: <Shield className="h-6 w-6" />,
            description: 'School Administrator',
            color: 'from-purple-500 to-indigo-600',
        },
        {
            id: 'teacher',
            label: 'Teacher',
            icon: <BookOpen className="h-6 w-6" />,
            description: 'Teaching Staff',
            color: 'from-blue-500 to-cyan-600',
        },
        {
            id: 'parent',
            label: 'Parent',
            icon: <Users className="h-6 w-6" />,
            description: 'Parent/Guardian',
            color: 'from-green-500 to-emerald-600',
        },
        {
            id: 'student',
            label: 'Student',
            icon: <User className="h-6 w-6" />,
            description: 'Student Portal',
            color: 'from-orange-500 to-amber-600',
        },
    ]

    useEffect(() => {
        // Redirect if already logged in
        if (isAuthenticated && user) {
            if (user.role === 'super_admin') router.push('/super-admin')
            else if (user.role === 'school_admin') router.push('/school/admin')
            else if (user.role === 'teacher') router.push('/school/teacher')
            else router.push('/portal')
        }
    }, [isAuthenticated, user, router])

    useEffect(() => {
        // Detect school slug from hostname or params
        if (typeof window !== 'undefined') {
            const hostname = window.location.hostname
            const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'localhost:3000'

            // Check if we're on the main domain (no subdomain)
            // Also check for Vercel preview URLs (*.vercel.app)
            const isMain = hostname === 'localhost' ||
                hostname === mainDomain.split(':')[0] ||
                hostname.startsWith('www.') ||
                hostname.endsWith('.vercel.app') ||  // Vercel deployments
                hostname.endsWith('.netlify.app') || // Netlify deployments
                !hostname.includes('.')

            if (isMain) {
                setIsMainDomain(true)
                setSchoolSlug(null)
                setSelectedRole('super_admin')
            } else {
                // Extract subdomain
                const parts = hostname.split('.')
                if (parts.length >= 2 && parts[0] !== 'www') {
                    setSchoolSlug(parts[0])
                    setIsMainDomain(false)
                }
            }

            // Also check URL params
            const param = searchParams.get('school')
            if (param) {
                setSchoolSlug(param)
                setIsMainDomain(false)
            }
        }
    }, [searchParams])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            // For school portals, prevent super_admin login
            if (!isMainDomain && selectedRole === 'super_admin') {
                setError('Super Admin cannot login from school portal. Please use the main admin portal.')
                setIsLoading(false)
                return
            }

            const result = await login({
                email,
                password,
                schoolSlug: schoolSlug || undefined,
                selectedRole: selectedRole || undefined
            })

            if (!result.success) {
                setError(result.error || 'Invalid credentials')
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleRoleSelect = (role: LoginRole) => {
        setSelectedRole(role)
        setError('')
    }

    // Super Admin Login Page (Main Domain)
    if (isMainDomain) {
        return (
            <div className="min-h-screen flex">
                {/* Left Branding Panel */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-12 flex-col justify-between text-white relative overflow-hidden">
                    {/* Animated background elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                        {/* Grid pattern */}
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMXYxaC0xeiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9nPjwvc3ZnPg==')] opacity-40" />
                    </div>

                    <div className="flex items-center gap-3 relative z-10">
                        <div className="h-14 w-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                            <Shield className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">School ERP</h1>
                            <p className="text-sm text-white/60">Super Admin Portal</p>
                        </div>
                    </div>

                    <div className="space-y-6 relative z-10">
                        <h2 className="text-5xl font-bold leading-tight">
                            Platform<br />
                            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Control Center
                            </span>
                        </h2>
                        <p className="text-lg text-white/70 max-w-md">
                            Manage all schools, monitor subscriptions, and control platform-wide settings from one central dashboard.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg backdrop-blur">
                                <Building2 className="h-5 w-5 text-purple-400" />
                                <span className="text-sm">Multi-School</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg backdrop-blur">
                                <Shield className="h-5 w-5 text-indigo-400" />
                                <span className="text-sm">Full Control</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-sm opacity-60 relative z-10">© 2024 School ERP Platform. All rights reserved.</div>
                </div>

                {/* Login Form Panel */}
                <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                    <div className="w-full max-w-md space-y-8">
                        <div className="lg:hidden text-center mb-8">
                            <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
                                <Shield className="h-9 w-9 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold">Super Admin Portal</h1>
                        </div>

                        <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
                            <CardHeader className="text-center pb-2">
                                <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                                <CardDescription>Sign in to access the admin dashboard</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <form onSubmit={handleLogin} className="space-y-4">
                                    {error && (
                                        <div className="bg-red-500/10 text-red-600 dark:text-red-400 p-3 rounded-lg flex items-center gap-2 text-sm">
                                            <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label>Email Address</Label>
                                        <div className="relative group">
                                            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-purple-500" />
                                            <Input
                                                type="email"
                                                placeholder="superadmin@erp.pk"
                                                className="pl-11 h-12 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Password</Label>
                                        <div className="relative group">
                                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-purple-500" />
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                className="pl-11 pr-11 h-12 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-purple-500/30"
                                        disabled={isLoading || authLoading}
                                    >
                                        {isLoading ? (
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        ) : (
                                            <>Sign In <ArrowRight className="ml-2 h-5 w-5" /></>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }

    // School Portal Login Page (Subdomain)
    return (
        <div className="min-h-screen flex">
            {/* Left Branding Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-blue-600 to-cyan-600 p-12 flex-col justify-between text-white relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                    <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl" />
                </div>

                <div className="flex items-center gap-3 relative z-10">
                    <div className="h-14 w-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                        <GraduationCap className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold capitalize">{schoolSlug || 'School'}</h1>
                        <p className="text-sm text-white/70">Management Portal</p>
                    </div>
                </div>

                <div className="space-y-6 relative z-10">
                    <h2 className="text-5xl font-bold leading-tight">
                        Welcome to<br />
                        <span className="capitalize">{schoolSlug || 'Your School'}</span>
                    </h2>
                    <p className="text-lg text-white/80 max-w-md">
                        Access your personalized dashboard to manage academics, attendance, fees, and more.
                    </p>
                </div>

                <div className="text-sm opacity-60 relative z-10">© 2024 School ERP Platform</div>
            </div>

            {/* Login Form Panel */}
            <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
                <div className="w-full max-w-lg space-y-6">
                    {/* Mobile header */}
                    <div className="lg:hidden text-center mb-6">
                        <div className="h-16 w-16 bg-gradient-to-br from-primary to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <GraduationCap className="h-9 w-9 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold capitalize">{schoolSlug || 'School'} Portal</h1>
                    </div>

                    {!selectedRole ? (
                        // Role Selection
                        <div className="space-y-6">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Select Your Role</h2>
                                <p className="text-gray-500 dark:text-gray-400 mt-1">Choose how you want to sign in</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {schoolRoles.map((role) => (
                                    <button
                                        key={role.id}
                                        onClick={() => handleRoleSelect(role.id)}
                                        className="group relative p-6 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
                                    >
                                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                                            {role.icon}
                                        </div>
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{role.label}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{role.description}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        // Login Form
                        <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
                            <CardHeader className="pb-2">
                                <button
                                    onClick={() => setSelectedRole(null)}
                                    className="text-sm text-primary hover:underline mb-2 flex items-center gap-1"
                                >
                                    ← Change Role
                                </button>
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${schoolRoles.find(r => r.id === selectedRole)?.color} flex items-center justify-center text-white shadow-lg`}>
                                        {schoolRoles.find(r => r.id === selectedRole)?.icon}
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">
                                            {schoolRoles.find(r => r.id === selectedRole)?.label} Login
                                        </CardTitle>
                                        <CardDescription>Enter your credentials to continue</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <form onSubmit={handleLogin} className="space-y-4">
                                    {error && (
                                        <div className="bg-red-500/10 text-red-600 dark:text-red-400 p-3 rounded-lg flex items-center gap-2 text-sm">
                                            <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label>Email Address</Label>
                                        <div className="relative group">
                                            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-primary" />
                                            <Input
                                                type="email"
                                                placeholder="your.email@school.pk"
                                                className="pl-11 h-12 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Password</Label>
                                        <div className="relative group">
                                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-primary" />
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                className="pl-11 pr-11 h-12 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-12 gradient-primary font-semibold"
                                        disabled={isLoading || authLoading}
                                    >
                                        {isLoading ? (
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        ) : (
                                            <>Sign In <ArrowRight className="ml-2 h-5 w-5" /></>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}

function LoginLoading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-gray-500">Loading...</p>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<LoginLoading />}>
            <LoginForm />
        </Suspense>
    )
}
