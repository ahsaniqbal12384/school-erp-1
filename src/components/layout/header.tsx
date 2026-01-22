'use client'

import { Bell, Search } from 'lucide-react'
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
                            <Badge
                                variant="destructive"
                                className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                            >
                                3
                            </Badge>
                            <span className="sr-only">Notifications</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                        <DropdownMenuLabel className="flex items-center justify-between">
                            <span>Notifications</span>
                            <Button variant="ghost" size="sm" className="text-xs text-primary">
                                Mark all read
                            </Button>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <div className="max-h-80 overflow-y-auto">
                            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-primary" />
                                    <span className="text-sm font-medium">New admission inquiry</span>
                                </div>
                                <span className="text-xs text-muted-foreground pl-4">
                                    Muhammad Ali inquired about Class 5 admission
                                </span>
                                <span className="text-xs text-muted-foreground pl-4">2 minutes ago</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-primary" />
                                    <span className="text-sm font-medium">Fee payment received</span>
                                </div>
                                <span className="text-xs text-muted-foreground pl-4">
                                    Rs. 15,000 received via JazzCash
                                </span>
                                <span className="text-xs text-muted-foreground pl-4">15 minutes ago</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-amber-500" />
                                    <span className="text-sm font-medium">Attendance alert</span>
                                </div>
                                <span className="text-xs text-muted-foreground pl-4">
                                    Class 8-A has low attendance today (65%)
                                </span>
                                <span className="text-xs text-muted-foreground pl-4">1 hour ago</span>
                            </DropdownMenuItem>
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
                        <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                        <DropdownMenuItem>Account Settings</DropdownMenuItem>
                        {role === 'super_admin' && (
                            <DropdownMenuItem>System Settings</DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
