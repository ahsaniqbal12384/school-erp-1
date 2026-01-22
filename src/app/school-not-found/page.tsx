'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { GraduationCap, AlertCircle, ArrowLeft, Home, Mail } from 'lucide-react'
import Link from 'next/link'

interface SchoolNotFoundProps {
    slug?: string
    reason?: 'not_found' | 'inactive' | 'suspended' | 'expired'
}

export default function SchoolNotFoundPage({ slug, reason = 'not_found' }: SchoolNotFoundProps) {
    const messages = {
        not_found: {
            title: 'School Not Found',
            description: `We couldn't find a school with the URL "${slug || 'unknown'}". Please check the URL and try again.`,
            icon: AlertCircle,
        },
        inactive: {
            title: 'School Deactivated',
            description: 'This school has been deactivated by the administrator.',
            icon: AlertCircle,
        },
        suspended: {
            title: 'Subscription Suspended',
            description: 'This school\'s subscription has been suspended. Please contact support.',
            icon: AlertCircle,
        },
        expired: {
            title: 'Subscription Expired',
            description: 'This school\'s subscription has expired. Please contact the school administrator.',
            icon: AlertCircle,
        },
    }

    const { title, description, icon: Icon } = messages[reason]

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
            <div className="w-full max-w-md space-y-6">
                {/* Logo */}
                <div className="flex items-center justify-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl gradient-primary">
                        <GraduationCap className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">School ERP</h1>
                        <p className="text-sm text-muted-foreground">Multi-tenant Platform</p>
                    </div>
                </div>

                {/* Error Card */}
                <Card className="border-red-200 dark:border-red-900">
                    <CardContent className="pt-6 text-center space-y-4">
                        <div className="flex justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
                                <Icon className="h-8 w-8 text-red-500" />
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold">{title}</h2>
                            <p className="text-muted-foreground mt-2">{description}</p>
                        </div>

                        {slug && (
                            <div className="p-3 rounded-lg bg-muted">
                                <p className="text-sm">
                                    <span className="text-muted-foreground">Requested URL: </span>
                                    <code className="font-mono text-primary">{slug}.yourapp.com</code>
                                </p>
                            </div>
                        )}

                        <div className="flex flex-col gap-2 pt-4">
                            <Button asChild>
                                <Link href="/">
                                    <Home className="mr-2 h-4 w-4" />
                                    Go to Main Site
                                </Link>
                            </Button>

                            <Button variant="outline" asChild>
                                <a href="mailto:support@yourapp.com">
                                    <Mail className="mr-2 h-4 w-4" />
                                    Contact Support
                                </a>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Help Section */}
                <div className="text-center text-sm text-muted-foreground">
                    <p>Are you a school administrator?</p>
                    <p>
                        <Link href="/register" className="text-primary hover:underline">
                            Register your school
                        </Link>
                        {' '}or{' '}
                        <Link href="/login" className="text-primary hover:underline">
                            Login to your account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
