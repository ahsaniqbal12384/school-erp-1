'use client'

import { useState, useEffect } from 'react'
import { Bell, Search, User, Settings, LogOut, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ThemeToggle } from '@/components/theme-toggle'
import { MobileSidebar } from '@/components/layout/sidebar'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth/context'
import { useRouter } from 'next/navigation'

interface Notification {
    id: string
    title: string
    message: string
    type: 'info' | 'warning' | 'success'
    read: boolean
    createdAt: Date
}

interface HeaderProps {
    role: 'super_admin' | 'school_admin' | 'teacher' | 'parent' | 'student' | 'accountant' | 'librarian' | 'transport_manager'
    user?: {
        name: string
        email: string
        avatar?: string
    }
    schoolName?: string
}

export function Header({ role, user, schoolName }: HeaderProps) {
    const router = useRouter()
    const { logout } = useAuth()
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: '1',
            title: 'New admission inquiry',
            message: 'Muhammad Ali inquired about Class 5 admission',
            type: 'info',
            read: false,
            createdAt: new Date(Date.now() - 2 * 60 * 1000),
        },
        {
            id: '2',
            title: 'Fee payment received',
            message: 'Rs. 15,000 received via JazzCash',
            type: 'success',
            read: false,
            createdAt: new Date(Date.now() - 15 * 60 * 1000),
        },
        {
            id: '3',
            title: 'Attendance alert',
            message: 'Class 8-A has low attendance today (65%)',
            type: 'warning',
            read: false,
            createdAt: new Date(Date.now() - 60 * 60 * 1000),
        },
    ])

    const unreadCount = notifications.filter(n => !n.read).length

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        )
    }

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    }

    const handleLogout = async () => {
        await logout()
        router.push('/login')
    }

    const handleProfileSettings = () => {
        if (role === 'super_admin') {
            router.push('/super-admin/settings?tab=profile')
        } else if (role === 'school_admin') {
            router.push('/school/admin/settings?tab=profile')
        } else if (role === 'teacher') {
            router.push('/school/teacher/settings?tab=profile')
        } else {
            router.push('/portal/settings?tab=profile')
        }
    }

    const handleAccountSettings = () => {
        if (role === 'super_admin') {
            router.push('/super-admin/settings?tab=account')
        } else if (role === 'school_admin') {
            router.push('/school/admin/settings?tab=account')
        } else if (role === 'teacher') {
            router.push('/school/teacher/settings?tab=account')
        } else {
            router.push('/portal/settings?tab=account')
        }
    }

    const handleSystemSettings = () => {
        router.push('/super-admin/settings')
    }

    const formatTimeAgo = (date: Date) => {
        const minutes = Math.floor((Date.now() - date.getTime()) / 60000)
        if (minutes < 60) return `${minutes} minutes ago`
        const hours = Math.floor(minutes / 60)
        if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
        return `${Math.floor(hours / 24)} day${hours >= 48 ? 's' : ''} ago`
    }

    const getNotificationColor = (type: string) => {
        switch (type) {
            case 'warning': return 'bg-amber-500'
            case 'success': return 'bg-emerald-500'
            default: return 'bg-primary'
        }
    }

    const initials = user?.name
        ? user.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
        : 'U'

    return (
        <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6">
            {/* Mobile Menu */}
            <MobileSidebar role={role} />

            {/* Search */}
            <div className="hidden md:flex flex-1 items-center gap-4 md:gap-6">
                <form className="flex-1 max-w-md">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search students, staff, invoices..."
                            className="w-full pl-9 bg-muted/50 border-0 focus-visible:bg-background focus-visible:ring-1"
                        />
                    </div>
                </form>
            </div>

            {/* School Name (for non-super admin) */}
            {schoolName && role !== 'super_admin' && (
                <div className="hidden lg:flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">School:</span>
                    <span className="font-medium">{schoolName}</span>
                </div>
            )}

            {/* Right Actions */}
            <div className="flex items-center gap-2 ml-auto">
                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Notifications */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative h-9 w-9">
                            <Bell className="h-4 w-4" />
                            {unreadCount > 0 && (
                                <Badge
                                    variant="destructive"
                                    className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                                >
                                    {unreadCount}
                                </Badge>
                            )}
                            <span className="sr-only">Notifications</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                        <DropdownMenuLabel className="flex items-center justify-between">
                            <span>Notifications</span>
                            {unreadCount > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs text-primary h-auto p-1"
                                    onClick={markAllAsRead}
                                >
                                    Mark all read
                                </Button>
                            )}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <div className="max-h-80 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-4 text-center text-sm text-muted-foreground">
                                    No notifications
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <DropdownMenuItem
                                        key={notification.id}
                                        className="flex flex-col items-start gap-1 p-3 cursor-pointer"
                                        onClick={() => markAsRead(notification.id)}
                                    >
                                        <div className="flex items-center gap-2">
                                            {!notification.read && (
                                                <div className={`h-2 w-2 rounded-full ${getNotificationColor(notification.type)}`} />
                                            )}
                                            <span className={`text-sm font-medium ${notification.read ? 'text-muted-foreground' : ''}`}>
                                                {notification.title}
                                            </span>
                                        </div>
                                        <span className="text-xs text-muted-foreground pl-4">
                                            {notification.message}
                                        </span>
                                        <span className="text-xs text-muted-foreground pl-4">
                                            {formatTimeAgo(notification.createdAt)}
                                        </span>
                                    </DropdownMenuItem>
                                ))
                            )}
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="w-full justify-center text-primary">
                            View all notifications
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-9 gap-2 pl-2 pr-3">
                            <Avatar className="h-7 w-7">
                                <AvatarImage src={user?.avatar} alt={user?.name} />
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="hidden md:flex flex-col items-start">
                                <span className="text-sm font-medium">{user?.name || 'User'}</span>
                                <span className="text-xs text-muted-foreground capitalize">
                                    {role.replace('_', ' ')}
                                </span>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium">{user?.name || 'User'}</p>
                                <p className="text-xs text-muted-foreground">{user?.email}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleProfileSettings} className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            Profile Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleAccountSettings} className="cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            Account Settings
                        </DropdownMenuItem>
                        {role === 'super_admin' && (
                            <DropdownMenuItem onClick={handleSystemSettings} className="cursor-pointer">
                                <Shield className="mr-2 h-4 w-4" />
                                System Settings
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="text-destructive focus:text-destructive cursor-pointer"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
