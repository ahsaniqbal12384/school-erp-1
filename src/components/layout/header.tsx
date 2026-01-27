'use client'

import { useState, useEffect } from 'react'
import { Search, User, Settings, LogOut, Shield } from 'lucide-react'
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
import { NotificationBell } from '@/components/layout/notification-bell'
import { useAuth } from '@/lib/auth/context'
import { useRouter } from 'next/navigation'

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
                <NotificationBell />

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
