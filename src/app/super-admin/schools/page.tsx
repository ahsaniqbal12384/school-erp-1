'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
    Building2,
    Search,
    Plus,
    MoreHorizontal,
    Eye,
    Edit,
    Trash2,
    Globe,
    Users,
    GraduationCap,
    Settings,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    Copy,
    ExternalLink,
    Shield,
} from 'lucide-react'
import { AVAILABLE_MODULES, School, SubscriptionPlan, SubscriptionStatus } from '@/types/tenant'


// Sample schools data
const sampleSchools: School[] = [
    {
        id: '1',
        name: 'City Grammar School',
        slug: 'citygrammar',
        email: 'admin@citygrammar.edu.pk',
        phone: '+92-42-35761234',
        city: 'Lahore',
        address: '123 Main Boulevard, DHA',
        principal_name: 'Dr. Ahmad Khan',
        subscription_plan: 'premium',
        subscription_status: 'active',
        subscription_expires_at: '2025-12-31',
        max_students: 2000,
        max_staff: 200,
        is_active: true,
        logo_url: null,
        created_at: '2023-06-15',
        updated_at: '2023-06-15',
        current_students: 1250,
        current_staff: 85,
        enabled_modules: ['students', 'staff', 'fees', 'exams', 'transport', 'library', 'communications', 'admissions', 'homework', 'attendance']
    },
    {
        id: '2',
        name: 'Beacon Academy',
        slug: 'beacon',
        email: 'info@beaconacademy.pk',
        phone: '+92-42-35429876',
        city: 'Lahore',
        address: '45 Gulberg III',
        principal_name: 'Mrs. Fatima Ali',
        subscription_plan: 'standard',
        subscription_status: 'active',
        subscription_expires_at: '2025-06-30',
        max_students: 500,
        max_staff: 50,
        is_active: true,
        logo_url: null,
        created_at: '2024-01-10',
        updated_at: '2024-01-10',
        current_students: 320,
        current_staff: 28,
        enabled_modules: ['students', 'staff', 'fees', 'exams', 'communications', 'admissions', 'homework', 'attendance']
    },
    {
        id: '3',
        name: 'Knowledge High School',
        slug: 'knowledge-high',
        email: 'admin@knowledgehigh.pk',
        phone: '+92-51-2567890',
        city: 'Islamabad',
        address: 'Sector F-7/2',
        principal_name: 'Mr. Hassan Raza',
        subscription_plan: 'basic',
        subscription_status: 'trial',
        subscription_expires_at: '2024-02-15',
        max_students: 100,
        max_staff: 20,
        is_active: true,
        logo_url: null,
        created_at: '2024-01-15',
        updated_at: '2024-01-15',
        current_students: 45,
        current_staff: 8,
        enabled_modules: ['students', 'staff', 'fees', 'attendance', 'communications']
    },
    {
        id: '4',
        name: 'Elite International School',
        slug: 'elite-intl',
        email: 'contact@eliteinternational.edu.pk',
        phone: '+92-21-34567890',
        city: 'Karachi',
        address: 'Clifton Block 5',
        principal_name: 'Dr. Sana Malik',
        subscription_plan: 'enterprise',
        subscription_status: 'active',
        subscription_expires_at: '2026-01-01',
        max_students: -1, // Unlimited
        max_staff: -1,
        is_active: true,
        logo_url: null,
        created_at: '2022-08-20',
        updated_at: '2022-08-20',
        current_students: 3500,
        current_staff: 280,
        enabled_modules: ['students', 'staff', 'fees', 'exams', 'transport', 'library', 'communications', 'admissions', 'homework', 'attendance', 'timetable', 'reports', 'inventory']
    },
    {
        id: '5',
        name: 'Green Valley School',
        slug: 'greenvalley',
        email: 'admin@greenvalley.pk',
        phone: '+92-42-36543210',
        city: 'Lahore',
        address: 'Johar Town',
        principal_name: 'Mr. Usman Ali',
        subscription_plan: 'standard',
        subscription_status: 'suspended',
        subscription_expires_at: '2024-01-01',
        max_students: 500,
        max_staff: 50,
        is_active: false,
        logo_url: null,
        created_at: '2023-03-01',
        updated_at: '2023-03-01',
        current_students: 180,
        current_staff: 15,
        enabled_modules: ['students', 'staff', 'fees', 'exams', 'attendance']
    },
]

export default function SchoolsManagementPage() {
    const [schools, setSchools] = useState<School[]>(sampleSchools)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [planFilter, setPlanFilter] = useState<string>('all')
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isModulesDialogOpen, setIsModulesDialogOpen] = useState(false)
    const [selectedSchool, setSelectedSchool] = useState<School | null>(null)
    const [enabledModules, setEnabledModules] = useState<string[]>([])

    // New school form state
    const [newSchool, setNewSchool] = useState({
        name: '',
        slug: '',
        email: '',
        phone: '',
        city: '',
        principal_name: '',
        subscription_plan: 'basic',
    })

    const filteredSchools = schools.filter((school) => {
        const matchesSearch =
            school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            school.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (school.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (school.city?.toLowerCase() || '').includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'all' || school.subscription_status === statusFilter
        const matchesPlan = planFilter === 'all' || school.subscription_plan === planFilter
        return matchesSearch && matchesStatus && matchesPlan
    })

    const getStatusBadge = (status: School['subscription_status']) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-500/10 text-green-500"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>
            case 'trial':
                return <Badge className="bg-blue-500/10 text-blue-500"><Clock className="w-3 h-3 mr-1" />Trial</Badge>
            case 'suspended':
                return <Badge className="bg-red-500/10 text-red-500"><XCircle className="w-3 h-3 mr-1" />Suspended</Badge>
            case 'expired':
                return <Badge className="bg-gray-500/10 text-gray-500"><AlertCircle className="w-3 h-3 mr-1" />Expired</Badge>
        }
    }

    const getPlanBadge = (plan: School['subscription_plan']) => {
        switch (plan) {
            case 'basic':
                return <Badge variant="outline">Basic</Badge>
            case 'standard':
                return <Badge variant="outline" className="border-blue-500 text-blue-500">Standard</Badge>
            case 'premium':
                return <Badge variant="outline" className="border-purple-500 text-purple-500">Premium</Badge>
            case 'enterprise':
                return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Enterprise</Badge>
        }
    }

    const handleCreateSchool = () => {
        const school: School = {
            id: crypto.randomUUID(),
            name: newSchool.name,
            slug: newSchool.slug,
            email: newSchool.email,
            phone: newSchool.phone,
            city: newSchool.city,
            principal_name: newSchool.principal_name,
            address: null,
            logo_url: null,
            subscription_plan: newSchool.subscription_plan as SubscriptionPlan,
            subscription_status: 'trial',
            subscription_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            max_students: newSchool.subscription_plan === 'basic' ? 100 : newSchool.subscription_plan === 'standard' ? 500 : 2000,
            max_staff: newSchool.subscription_plan === 'basic' ? 20 : newSchool.subscription_plan === 'standard' ? 50 : 200,
            is_active: true,
            created_at: new Date().toISOString().split('T')[0],
            updated_at: new Date().toISOString().split('T')[0],
            current_students: 0,
            current_staff: 0,
            enabled_modules: ['students', 'staff', 'fees', 'attendance', 'communications'],
        }

        setSchools([...schools, school])
        setIsAddDialogOpen(false)
        setNewSchool({
            name: '',
            slug: '',
            email: '',
            phone: '',
            city: '',
            principal_name: '',
            subscription_plan: 'basic',
        })
    }

    const handleOpenModules = (school: School) => {
        setSelectedSchool(school)
        setEnabledModules(school.enabled_modules || [])
        setIsModulesDialogOpen(true)
    }

    const handleSaveModules = () => {
        if (selectedSchool) {
            setSchools(schools.map(s =>
                s.id === selectedSchool.id
                    ? { ...s, enabled_modules: enabledModules }
                    : s
            ))
        }
        setIsModulesDialogOpen(false)
    }

    const toggleModule = (moduleName: string) => {
        if (enabledModules.includes(moduleName)) {
            setEnabledModules(enabledModules.filter(m => m !== moduleName))
        } else {
            setEnabledModules([...enabledModules, moduleName])
        }
    }

    const copySchoolUrl = (slug: string) => {
        const url = `${slug}.yourapp.com`
        navigator.clipboard.writeText(url)
    }

    const totalSchools = schools.length
    const activeSchools = schools.filter(s => s.subscription_status === 'active').length
    const trialSchools = schools.filter(s => s.subscription_status === 'trial').length
    const totalStudents = schools.reduce((acc, s) => acc + (s.current_students || 0), 0)

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Schools Management</h1>
                    <p className="text-muted-foreground">
                        Create and manage schools, subscriptions, and module access
                    </p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gradient-primary">
                            <Plus className="mr-2 h-4 w-4" />
                            Add New School
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Create New School</DialogTitle>
                            <DialogDescription>
                                Add a new school to the platform. They will get a unique subdomain.
                            </DialogDescription>
                        </DialogHeader>
                        <Tabs defaultValue="info" className="mt-4">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="info">School Information</TabsTrigger>
                                <TabsTrigger value="subscription">Subscription</TabsTrigger>
                            </TabsList>
                            <TabsContent value="info" className="space-y-4 mt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>School Name *</Label>
                                        <Input
                                            placeholder="City Grammar School"
                                            value={newSchool.name}
                                            onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>URL Slug *</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="citygrammar"
                                                value={newSchool.slug}
                                                onChange={(e) => setNewSchool({ ...newSchool, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            URL: <span className="font-mono">{newSchool.slug || 'schoolname'}.yourapp.com</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Email *</Label>
                                        <Input
                                            type="email"
                                            placeholder="admin@school.pk"
                                            value={newSchool.email}
                                            onChange={(e) => setNewSchool({ ...newSchool, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Phone</Label>
                                        <Input
                                            placeholder="+92-42-XXXXXXX"
                                            value={newSchool.phone}
                                            onChange={(e) => setNewSchool({ ...newSchool, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>City</Label>
                                        <Input
                                            placeholder="Lahore"
                                            value={newSchool.city}
                                            onChange={(e) => setNewSchool({ ...newSchool, city: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Principal Name</Label>
                                        <Input
                                            placeholder="Dr. Ahmad Khan"
                                            value={newSchool.principal_name}
                                            onChange={(e) => setNewSchool({ ...newSchool, principal_name: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="subscription" className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Label>Subscription Plan</Label>
                                    <Select
                                        value={newSchool.subscription_plan}
                                        onValueChange={(v) => setNewSchool({ ...newSchool, subscription_plan: v })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="basic">
                                                <div className="flex flex-col">
                                                    <span>Basic - Rs. 2,999/month</span>
                                                    <span className="text-xs text-muted-foreground">100 students, 20 staff</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="standard">
                                                <div className="flex flex-col">
                                                    <span>Standard - Rs. 5,999/month</span>
                                                    <span className="text-xs text-muted-foreground">500 students, 50 staff</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="premium">
                                                <div className="flex flex-col">
                                                    <span>Premium - Rs. 9,999/month</span>
                                                    <span className="text-xs text-muted-foreground">2000 students, 200 staff</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="enterprise">
                                                <div className="flex flex-col">
                                                    <span>Enterprise - Rs. 19,999/month</span>
                                                    <span className="text-xs text-muted-foreground">Unlimited</span>
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Card className="bg-muted/50">
                                    <CardContent className="pt-4">
                                        <h4 className="font-medium mb-2">Default Modules for {newSchool.subscription_plan || 'Basic'} Plan:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {['students', 'staff', 'fees', 'attendance', 'communications'].map(mod => (
                                                <Badge key={mod} variant="secondary">{mod}</Badge>
                                            ))}
                                            {newSchool.subscription_plan === 'standard' && (
                                                <>
                                                    <Badge variant="secondary">exams</Badge>
                                                    <Badge variant="secondary">admissions</Badge>
                                                    <Badge variant="secondary">homework</Badge>
                                                </>
                                            )}
                                            {(newSchool.subscription_plan === 'premium' || newSchool.subscription_plan === 'enterprise') && (
                                                <>
                                                    <Badge variant="secondary">exams</Badge>
                                                    <Badge variant="secondary">transport</Badge>
                                                    <Badge variant="secondary">library</Badge>
                                                    <Badge variant="secondary">timetable</Badge>
                                                </>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            You can customize modules after creating the school.
                                        </p>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                        <div className="flex justify-end gap-3 mt-4">
                            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                            <Button className="gradient-primary" onClick={handleCreateSchool}>
                                <Plus className="mr-2 h-4 w-4" />
                                Create School
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalSchools}</div>
                        <p className="text-xs text-muted-foreground">Registered schools</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Active</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{activeSchools}</div>
                        <p className="text-xs text-muted-foreground">Paying customers</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">On Trial</CardTitle>
                        <Clock className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-500">{trialSchools}</div>
                        <p className="text-xs text-muted-foreground">Trial period</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <GraduationCap className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-500">{totalStudents.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Across all schools</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search schools..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="trial">Trial</SelectItem>
                                <SelectItem value="suspended">Suspended</SelectItem>
                                <SelectItem value="expired">Expired</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={planFilter} onValueChange={setPlanFilter}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Plan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Plans</SelectItem>
                                <SelectItem value="basic">Basic</SelectItem>
                                <SelectItem value="standard">Standard</SelectItem>
                                <SelectItem value="premium">Premium</SelectItem>
                                <SelectItem value="enterprise">Enterprise</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Schools Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        All Schools
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>School</TableHead>
                                <TableHead>URL</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-center">Students</TableHead>
                                <TableHead className="text-center">Modules</TableHead>
                                <TableHead>Expires</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredSchools.map((school) => (
                                <TableRow key={school.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                                <Building2 className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{school.name}</p>
                                                <p className="text-xs text-muted-foreground">{school.city} • {school.principal_name}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <code className="text-xs bg-muted px-2 py-1 rounded">{school.slug}.yourapp.com</code>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={() => copySchoolUrl(school.slug)}
                                            >
                                                <Copy className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                    <TableCell>{getPlanBadge(school.subscription_plan)}</TableCell>
                                    <TableCell>{getStatusBadge(school.subscription_status)}</TableCell>
                                    <TableCell className="text-center">
                                        <span className="font-medium">{school.current_students}</span>
                                        <span className="text-muted-foreground">/{school.max_students === -1 ? '∞' : school.max_students}</span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleOpenModules(school)}
                                        >
                                            <Shield className="h-4 w-4 mr-1" />
                                            {school.enabled_modules?.length || 0}
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <span className={school.subscription_expires_at && new Date(school.subscription_expires_at) < new Date() ? 'text-red-500' : ''}>
                                            {school.subscription_expires_at ? new Date(school.subscription_expires_at).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <ExternalLink className="mr-2 h-4 w-4" />
                                                    Visit Portal
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleOpenModules(school)}>
                                                    <Shield className="mr-2 h-4 w-4" />
                                                    Manage Modules
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit School
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-500">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete School
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Module Management Dialog */}
            <Dialog open={isModulesDialogOpen} onOpenChange={setIsModulesDialogOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Manage Modules - {selectedSchool?.name}</DialogTitle>
                        <DialogDescription>
                            Enable or disable modules for this school. Only enabled modules will be accessible.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {['core', 'academic', 'finance', 'operations', 'extras'].map((category) => (
                            <div key={category}>
                                <h4 className="font-medium mb-3 capitalize">{category} Modules</h4>
                                <div className="grid gap-3 md:grid-cols-2">
                                    {AVAILABLE_MODULES.filter(m => m.category === category).map((module) => (
                                        <div
                                            key={module.name}
                                            className={`flex items-center justify-between p-3 rounded-lg border ${enabledModules.includes(module.name) ? 'border-primary bg-primary/5' : ''
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${enabledModules.includes(module.name) ? 'bg-primary/10' : 'bg-muted'
                                                    }`}>
                                                    <Shield className={`h-4 w-4 ${enabledModules.includes(module.name) ? 'text-primary' : 'text-muted-foreground'}`} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">{module.label}</p>
                                                    <p className="text-xs text-muted-foreground">{module.description}</p>
                                                </div>
                                            </div>
                                            <Switch
                                                checked={enabledModules.includes(module.name)}
                                                onCheckedChange={() => toggleModule(module.name)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t">
                        <p className="text-sm text-muted-foreground">
                            {enabledModules.length} modules enabled
                        </p>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setIsModulesDialogOpen(false)}>Cancel</Button>
                            <Button className="gradient-primary" onClick={handleSaveModules}>
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
