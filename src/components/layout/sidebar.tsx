'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import {
    GraduationCap,
    LayoutDashboard,
    Users,
    UserPlus,
    DollarSign,
    Bus,
    BookOpen,
    ClipboardList,
    Calendar,
    Bell,
    Settings,
    HelpCircle,
    Menu,
    ChevronDown,
    Building2,
    Wallet,
    FileText,
    UserCheck,
    type LucideIcon,
} from 'lucide-react'
import { useState } from 'react'

interface NavItem {
    title: string
    href: string
    icon: LucideIcon
    badge?: string
    children?: NavItem[]
}

interface SidebarProps {
    role: 'super_admin' | 'school_admin' | 'teacher' | 'parent' | 'student' | 'accountant' | 'librarian' | 'transport_manager' | 'transport'
}

// Navigation items by role
const superAdminNav: NavItem[] = [
    { title: 'Dashboard', href: '/super-admin', icon: LayoutDashboard },
    { title: 'Schools', href: '/super-admin/schools', icon: Building2 },
    { title: 'Subscriptions', href: '/super-admin/subscriptions', icon: Wallet },
    { title: 'Support Tickets', href: '/super-admin/tickets', icon: HelpCircle, badge: '5' },
    { title: 'Reports', href: '/super-admin/reports', icon: FileText },
    { title: 'Settings', href: '/super-admin/settings', icon: Settings },
]

const schoolAdminNav: NavItem[] = [
    { title: 'Dashboard', href: '/school/admin', icon: LayoutDashboard },
    {
        title: 'Admissions',
        href: '/school/admin/admissions',
        icon: UserPlus,
        children: [
            { title: 'Inquiries', href: '/school/admin/admissions/inquiries', icon: ClipboardList },
            { title: 'Registrations', href: '/school/admin/admissions/registrations', icon: FileText },
            { title: 'New Admission', href: '/school/admin/admissions/new', icon: UserPlus },
        ]
    },
    {
        title: 'Students',
        href: '/school/admin/students',
        icon: GraduationCap,
        children: [
            { title: 'All Students', href: '/school/admin/students', icon: Users },
            { title: 'Attendance', href: '/school/admin/students/attendance', icon: UserCheck },
            { title: 'Classes', href: '/school/admin/academics/classes', icon: Building2 },
        ]
    },
    {
        title: 'Staff & HR',
        href: '/school/admin/staff',
        icon: Users,
        children: [
            { title: 'All Staff', href: '/school/admin/staff', icon: Users },
            { title: 'Payroll', href: '/school/admin/staff/payroll', icon: Wallet },
            { title: 'Attendance', href: '/school/admin/staff/attendance', icon: UserCheck },
            { title: 'Leaves', href: '/school/admin/staff/leaves', icon: Calendar },
        ]
    },
    {
        title: 'Fees & Finance',
        href: '/school/admin/fees',
        icon: DollarSign,
        children: [
            { title: 'Fee Collection', href: '/school/admin/fees/collection', icon: Wallet },
            { title: 'Bulk Generate', href: '/school/admin/fees/bulk-generate', icon: FileText },
            { title: 'Defaults Report', href: '/school/admin/fees/defaults', icon: ClipboardList },
            { title: 'Fee Structure', href: '/school/admin/fees/structure', icon: Settings },
        ]
    },
    { title: 'Transport', href: '/school/admin/transport', icon: Bus },
    { title: 'Library', href: '/school/admin/library', icon: BookOpen },
    {
        title: 'Exams & Grades',
        href: '/school/admin/exams',
        icon: ClipboardList,
        children: [
            { title: 'Exams', href: '/school/admin/exams', icon: ClipboardList },
            { title: 'Gradebook', href: '/school/admin/exams/grades', icon: FileText },
            { title: 'Report Cards', href: '/school/admin/exams/reports', icon: FileText },
        ]
    },
    { title: 'Communication', href: '/school/admin/communications/broadcasts', icon: Bell },
    { title: 'Settings', href: '/school/admin/settings', icon: Settings },
]

const teacherNav: NavItem[] = [
    { title: 'Dashboard', href: '/school/teacher', icon: LayoutDashboard },
    { title: 'My Classes', href: '/school/teacher/classes', icon: Building2 },
    { title: 'Attendance', href: '/school/teacher/attendance', icon: UserCheck },
    { title: 'Gradebook', href: '/school/teacher/gradebook', icon: ClipboardList },
    { title: 'Homework', href: '/school/teacher/homework', icon: BookOpen },
    { title: 'Diary', href: '/school/teacher/diary', icon: FileText },
    { title: 'Timetable', href: '/school/teacher/timetable', icon: Calendar },
]

const parentNav: NavItem[] = [
    { title: 'Dashboard', href: '/portal', icon: LayoutDashboard },
    { title: 'My Children', href: '/portal/children', icon: GraduationCap },
    { title: 'Fees & Payments', href: '/portal/fees', icon: DollarSign },
    { title: 'Attendance', href: '/portal/attendance', icon: UserCheck },
    { title: 'Results', href: '/portal/results', icon: ClipboardList },
    { title: 'Homework', href: '/portal/homework', icon: BookOpen },
    { title: 'Diary', href: '/portal/diary', icon: FileText },
    { title: 'Transport', href: '/portal/transport', icon: Bus },
]

function getNavItems(role: SidebarProps['role']): NavItem[] {
    switch (role) {
        case 'super_admin':
            return superAdminNav
        case 'school_admin':
            return schoolAdminNav
        case 'teacher':
            return teacherNav
        case 'parent':
        case 'student':
            return parentNav
        case 'accountant':
            return schoolAdminNav.filter(item =>
                ['Dashboard', 'Fees & Finance', 'Reports'].includes(item.title)
            )
        case 'librarian':
            return [
                { title: 'Dashboard', href: '/school/librarian', icon: LayoutDashboard },
                { title: 'Catalog', href: '/school/librarian/catalog', icon: BookOpen },
                { title: 'Issue Book', href: '/school/librarian/issue', icon: FileText },
                { title: 'Return Book', href: '/school/librarian/return', icon: ClipboardList },
                { title: 'Issued Books', href: '/school/librarian/issued', icon: BookOpen },
                { title: 'Add Book', href: '/school/librarian/add', icon: UserPlus },
            ]
        case 'transport_manager':
        case 'transport':
            return [
                { title: 'Dashboard', href: '/school/transport', icon: LayoutDashboard },
                { title: 'Live Tracking', href: '/school/transport/tracking', icon: Bus },
                { title: 'Routes', href: '/school/transport/routes', icon: ClipboardList },
                { title: 'Drivers', href: '/school/transport/drivers', icon: Users },
                { title: 'Maintenance', href: '/school/transport/maintenance', icon: Settings },
            ]
        case 'accountant':
            return [
                { title: 'Dashboard', href: '/school/accountant', icon: LayoutDashboard },
                { title: 'Fee Collection', href: '/school/accountant/fees', icon: DollarSign },
                { title: 'Expenses', href: '/school/accountant/expenses', icon: Wallet },
                { title: 'Payroll', href: '/school/accountant/payroll', icon: Users },
                { title: 'Reports', href: '/school/accountant/reports', icon: FileText },
            ]
        default:
            return []
    }
}

function NavItemComponent({ item, collapsed }: { item: NavItem; collapsed?: boolean }) {
    const pathname = usePathname()
    const [isExpanded, setIsExpanded] = useState(false)
    const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
    const hasChildren = item.children && item.children.length > 0

    if (hasChildren) {
        return (
            <div className="space-y-1">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={cn(
                        'w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                        isActive
                            ? 'sidebar-active text-primary'
                            : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    )}
                >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {!collapsed && (
                        <>
                            <span className="flex-1 text-left">{item.title}</span>
                            <ChevronDown className={cn(
                                'h-4 w-4 transition-transform duration-200',
                                isExpanded && 'rotate-180'
                            )} />
                        </>
                    )}
                </button>
                {!collapsed && isExpanded && (
                    <div className="ml-4 space-y-1 border-l-2 border-border pl-4">
                        {item.children!.map((child) => (
                            <Link
                                key={child.href}
                                href={child.href}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200',
                                    pathname === child.href
                                        ? 'bg-primary/10 text-primary font-medium'
                                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                                )}
                            >
                                <child.icon className="h-4 w-4" />
                                <span>{child.title}</span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        )
    }

    return (
        <Link
            href={item.href}
            className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                    ? 'sidebar-active text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            )}
        >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && (
                <>
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                        <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                            {item.badge}
                        </span>
                    )}
                </>
            )}
        </Link>
    )
}

export function Sidebar({ role }: SidebarProps) {
    const navItems = getNavItems(role)

    return (
        <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-sidebar">
            {/* Logo */}
            <div className="flex h-16 items-center gap-3 border-b border-border px-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
                    <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-bold">School ERP</span>
                    <span className="text-xs text-muted-foreground">Pakistani Schools</span>
                </div>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 py-4">
                <nav className="space-y-1 px-3">
                    {navItems.map((item) => (
                        <NavItemComponent key={item.href} item={item} />
                    ))}
                </nav>
            </ScrollArea>

            {/* Footer */}
            <div className="border-t border-border p-4">
                <div className="flex items-center gap-3 rounded-lg bg-accent/50 p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <HelpCircle className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs font-medium">Need Help?</p>
                        <p className="text-xs text-muted-foreground">Contact Support</p>
                    </div>
                </div>
            </div>
        </aside>
    )
}

export function MobileSidebar({ role }: SidebarProps) {
    const navItems = getNavItems(role)

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
                {/* Logo */}
                <div className="flex h-16 items-center gap-3 border-b border-border px-6">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
                        <GraduationCap className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold">School ERP</span>
                        <span className="text-xs text-muted-foreground">Pakistani Schools</span>
                    </div>
                </div>

                {/* Navigation */}
                <ScrollArea className="flex-1 py-4">
                    <nav className="space-y-1 px-3">
                        {navItems.map((item) => (
                            <NavItemComponent key={item.href} item={item} />
                        ))}
                    </nav>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}
