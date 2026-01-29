'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
    MessageSquare,
    Mail,
    Bell,
    Smartphone,
    Send,
    Users,
    ArrowRight,
} from 'lucide-react'

export default function CommunicationsPage() {
    const modules = [
        {
            title: 'SMS Management',
            description: 'Send SMS to parents, teachers, and staff. Supports bulk messaging and templates.',
            icon: Smartphone,
            href: '/school/admin/communications/sms',
            color: 'text-green-500',
            bgColor: 'bg-green-500/10',
            stats: '5,420 credits',
        },
        {
            title: 'Broadcasts',
            description: 'Send announcements via SMS, Email, or In-App notifications.',
            icon: Bell,
            href: '/school/admin/communications/broadcasts',
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/10',
            stats: '12 sent this month',
        },
        {
            title: 'Email Campaigns',
            description: 'Create and send email campaigns to parents and staff.',
            icon: Mail,
            href: '/school/admin/communications/email',
            color: 'text-purple-500',
            bgColor: 'bg-purple-500/10',
            stats: 'Coming soon',
        },
        {
            title: 'Messages',
            description: 'View and respond to messages from parents and staff.',
            icon: MessageSquare,
            href: '/school/admin/communications/messages',
            color: 'text-orange-500',
            bgColor: 'bg-orange-500/10',
            stats: '5 unread',
        },
    ]

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Communications</h1>
                <p className="text-muted-foreground">
                    Manage all school communications - SMS, Email, and Announcements
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">SMS Sent Today</CardTitle>
                        <Send className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">156</div>
                        <p className="text-xs text-muted-foreground">+12% from yesterday</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
                        <Smartphone className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">98.5%</div>
                        <p className="text-xs text-muted-foreground">Last 30 days</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
                        <MessageSquare className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5</div>
                        <p className="text-xs text-muted-foreground">Needs response</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,250</div>
                        <p className="text-xs text-muted-foreground">Parents & Staff</p>
                    </CardContent>
                </Card>
            </div>

            {/* Communication Modules */}
            <div className="grid gap-4 md:grid-cols-2">
                {modules.map((module) => (
                    <Card key={module.title} className="card-hover">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className={`p-3 rounded-lg ${module.bgColor}`}>
                                    <module.icon className={`h-6 w-6 ${module.color}`} />
                                </div>
                                <span className="text-sm text-muted-foreground">{module.stats}</span>
                            </div>
                            <CardTitle className="mt-4">{module.title}</CardTitle>
                            <CardDescription>{module.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href={module.href}>
                                <Button variant="outline" className="w-full">
                                    Open
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
