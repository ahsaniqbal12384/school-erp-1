'use client'

// Force dynamic rendering to support useSearchParams
export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    GraduationCap,
    Mail,
    Lock,
    ArrowRight,
    Building2,
    AlertCircle,
    CheckCircle,
    Eye,
    EyeOff,
    Loader2,
} from 'lucide-react'

const demoAccounts = [
    { role: 'Super Admin', email: 'superadmin@erp.pk', password: 'admin123' },
    { role: 'School Admin', email: 'admin@school.pk', password: 'password123' },
    { role: 'Teacher', email: 'teacher@school.pk', password: 'password123' },
    { role: 'Parent', email: 'parent@school.pk', password: 'password123' },
]

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { login, isAuthenticated, user } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [schoolSlug, setSchoolSlug] = useState<string | null>(null)

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
            const parts = hostname.split('.')
            if (parts.length >= 2 && parts[0] !== 'localhost' && parts[0] !== 'www') {
                const slug = parts[0]
                const timer = setTimeout(() => {
                    setSchoolSlug(prev => prev !== slug ? slug : prev)
                }, 0)
                return () => clearTimeout(timer)
            } else {
                const param = searchParams.get('school')
                if (param) {
                    const timer = setTimeout(() => {
                        setSchoolSlug(prev => prev !== param ? param : prev)
                    }, 0)
                    return () => clearTimeout(timer)
                }
            }
        }
    }, [searchParams])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        const result = await login({ email, password, schoolSlug: schoolSlug || undefined })

        if (!result.success) {
            setError(result.error || 'Invalid credentials')
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Branding Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-purple-700 p-12 flex-col justify-between text-white">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                        <GraduationCap className="h-7 w-7" />
                    </div>
                    <h1 className="text-2xl font-bold">School ERP</h1>
                </div>
                <div className="space-y-6">
                    <h2 className="text-5xl font-bold leading-tight">Empowering Schools,<br />Enabling Futures.</h2>
                    <p className="text-lg text-white/80 max-w-md">Pakistan&apos;s most advanced multi-tenant platform for school management and student success.</p>
                </div>
                <div className="text-sm opacity-60">© 2024 School ERP Platform</div>
            </div>

            {/* Login Form Panel */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8">
                    {schoolSlug && (
                        <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg justify-center">
                            <Building2 className="h-5 w-5 text-primary" />
                            <span className="font-semibold uppercase">{schoolSlug} Portal</span>
                        </div>
                    )}

                    <Card className="shadow-2xl border-0">
                        <CardHeader className="text-center">
                            <CardTitle className="text-3xl font-bold">Sign In</CardTitle>
                            <CardDescription>Enter your credentials to manage your school</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleLogin} className="space-y-4">
                                {error && (
                                    <div className="bg-destructive/10 text-destructive p-3 rounded-md flex items-center gap-2 text-sm">
                                        <AlertCircle className="h-4 w-4" /> {error}
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label>Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="name@school.edu"
                                            className="pl-10"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            className="pl-10 pr-10"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-muted-foreground">
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full h-11 gradient-primary mt-2">
                                    Sign In <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </form>

                            <div className="mt-8 space-y-4">
                                <div className="relative"><div className="absolute inset-0 flex items-center"><span className="w-full border-t"></span></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Demo Access</span></div></div>
                                <div className="grid grid-cols-2 gap-2">
                                    {demoAccounts.map(acc => (
                                        <Button key={acc.role} variant="outline" size="sm" onClick={() => { setEmail(acc.email); setPassword(acc.password); }}>
                                            {acc.role}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function LoginLoading() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
