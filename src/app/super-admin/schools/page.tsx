'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
    Building2,
    Search,
    Plus,
    MoreHorizontal,
    Eye,
    Edit,
    Trash2,
    Users,
    GraduationCap,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    Copy,
    ExternalLink,
    Shield,
    Loader2,
    RefreshCw,
} from 'lucide-react'
import { AVAILABLE_MODULES, School, SubscriptionPlan, SubscriptionStatus } from '@/types/tenant'
import { useToast } from '@/hooks/use-toast'

// Extended school type to include related data from API
interface SchoolWithRelations extends School {
    school_settings?: Record<string, unknown> | null
    school_modules?: Array<{ module_name: string; is_enabled: boolean }> | null
}

export default function SchoolsManagementPage() {
    const { toast } = useToast()
    
    // State
    const [schools, setSchools] = useState<SchoolWithRelations[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [planFilter, setPlanFilter] = useState<string>('all')
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isModulesDialogOpen, setIsModulesDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedSchool, setSelectedSchool] = useState<SchoolWithRelations | null>(null)
    const [enabledModules, setEnabledModules] = useState<string[]>([])
    const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, totalPages: 1 })

    // New/Edit school form state
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        email: '',
        phone: '',
        city: '',
        address: '',
        principal_name: '',
        subscription_plan: 'basic',
    })

    // Fetch schools from API
    const fetchSchools = useCallback(async () => {
        setIsLoading(true)
        try {
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
            })
            
            if (statusFilter !== 'all') params.append('status', statusFilter)
            if (planFilter !== 'all') params.append('plan', planFilter)
            if (searchQuery) params.append('search', searchQuery)

            const response = await fetch(`/api/schools?${params.toString()}`)
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch schools')
            }

            // Transform the data to include enabled_modules array
            const transformedSchools = (data.schools || []).map((school: SchoolWithRelations) => ({
                ...school,
                enabled_modules: school.school_modules
                    ?.filter(m => m.is_enabled)
                    .map(m => m.module_name) || [],
                current_students: school.current_students || 0,
                current_staff: school.current_staff || 0,
            }))

            setSchools(transformedSchools)
            setPagination(prev => ({
                ...prev,
                total: data.pagination?.total || 0,
                totalPages: data.pagination?.totalPages || 1,
            }))
        } catch (error) {
            console.error('Error fetching schools:', error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to fetch schools",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }, [pagination.page, pagination.limit, statusFilter, planFilter, searchQuery, toast])

    // Fetch schools on mount and when filters change
    useEffect(() => {
        fetchSchools()
    }, [fetchSchools])

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchSchools()
        }, 300)
        return () => clearTimeout(timer)
    }, [searchQuery]) // eslint-disable-line react-hooks/exhaustive-deps

    // Create new school
    const handleCreateSchool = async () => {
        if (!formData.name || !formData.slug || !formData.email) {
            toast({
                title: "Validation Error",
                description: "Name, URL Slug, and Email are required",
                variant: "destructive",
            })
            return
        }

        setIsSaving(true)
        try {
            const response = await fetch('/api/schools', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create school')
            }

            toast({
                title: "Success!",
                description: data.message || "School created successfully",
            })

            setIsAddDialogOpen(false)
            resetForm()
            fetchSchools()
        } catch (error) {
            console.error('Error creating school:', error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to create school",
                variant: "destructive",
            })
        } finally {
            setIsSaving(false)
        }
    }

    // Update school
    const handleUpdateSchool = async () => {
        if (!selectedSchool) return

        setIsSaving(true)
        try {
            const response = await fetch(`/api/schools/${selectedSchool.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update school')
            }

            toast({
                title: "Success!",
                description: "School updated successfully",
            })

            setIsEditDialogOpen(false)
            resetForm()
            fetchSchools()
        } catch (error) {
            console.error('Error updating school:', error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to update school",
                variant: "destructive",
            })
        } finally {
            setIsSaving(false)
        }
    }

    // Delete/Deactivate school
    const handleDeleteSchool = async () => {
        if (!selectedSchool) return

        setIsSaving(true)
        try {
            const response = await fetch(`/api/schools/${selectedSchool.id}`, {
                method: 'DELETE',
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete school')
            }

            toast({
                title: "Success!",
                description: data.message || "School has been deactivated",
            })

            setIsDeleteDialogOpen(false)
            setSelectedSchool(null)
            fetchSchools()
        } catch (error) {
            console.error('Error deleting school:', error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to delete school",
                variant: "destructive",
            })
        } finally {
            setIsSaving(false)
        }
    }

    // Update modules
    const handleSaveModules = async () => {
        if (!selectedSchool) return

        setIsSaving(true)
        try {
            const response = await fetch(`/api/schools/${selectedSchool.id}/modules`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ enabled_modules: enabledModules }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update modules')
            }

            toast({
                title: "Success!",
                description: "Modules updated successfully",
            })

            setIsModulesDialogOpen(false)
            fetchSchools()
        } catch (error) {
            console.error('Error updating modules:', error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to update modules",
                variant: "destructive",
            })
        } finally {
            setIsSaving(false)
        }
    }

    // Helper functions
    const resetForm = () => {
        setFormData({
            name: '',
            slug: '',
            email: '',
            phone: '',
            city: '',
            address: '',
            principal_name: '',
            subscription_plan: 'basic',
        })
        setSelectedSchool(null)
    }

    const openEditDialog = (school: SchoolWithRelations) => {
        setSelectedSchool(school)
        setFormData({
            name: school.name,
            slug: school.slug,
            email: school.email || '',
            phone: school.phone || '',
            city: school.city || '',
            address: school.address || '',
            principal_name: school.principal_name || '',
            subscription_plan: school.subscription_plan,
        })
        setIsEditDialogOpen(true)
    }

    const openModulesDialog = (school: SchoolWithRelations) => {
        setSelectedSchool(school)
        setEnabledModules(school.enabled_modules || [])
        setIsModulesDialogOpen(true)
    }

    const openDeleteDialog = (school: SchoolWithRelations) => {
        setSelectedSchool(school)
        setIsDeleteDialogOpen(true)
    }

    const toggleModule = (moduleName: string) => {
        if (enabledModules.includes(moduleName)) {
            setEnabledModules(enabledModules.filter(m => m !== moduleName))
        } else {
            setEnabledModules([...enabledModules, moduleName])
        }
    }

    const copySchoolUrl = (slug: string) => {
        // Use actual domain from environment or fallback
        const domain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'localhost:3000'
        const url = `${slug}.${domain}`
        navigator.clipboard.writeText(url)
        toast({
            title: "Copied!",
            description: `URL copied: ${url}`,
        })
    }

    const getStatusBadge = (status: SubscriptionStatus) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-500/10 text-green-500"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>
            case 'trial':
                return <Badge className="bg-blue-500/10 text-blue-500"><Clock className="w-3 h-3 mr-1" />Trial</Badge>
            case 'suspended':
                return <Badge className="bg-red-500/10 text-red-500"><XCircle className="w-3 h-3 mr-1" />Suspended</Badge>
            case 'expired':
                return <Badge className="bg-gray-500/10 text-gray-500"><AlertCircle className="w-3 h-3 mr-1" />Expired</Badge>
            case 'cancelled':
                return <Badge className="bg-gray-500/10 text-gray-500"><XCircle className="w-3 h-3 mr-1" />Cancelled</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const getPlanBadge = (plan: SubscriptionPlan) => {
        switch (plan) {
            case 'basic':
                return <Badge variant="outline">Basic</Badge>
            case 'standard':
                return <Badge variant="outline" className="border-blue-500 text-blue-500">Standard</Badge>
            case 'premium':
                return <Badge variant="outline" className="border-purple-500 text-purple-500">Premium</Badge>
            case 'enterprise':
                return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Enterprise</Badge>
            default:
                return <Badge variant="outline">{plan}</Badge>
        }
    }

    // Stats calculations
    const totalSchools = schools.length
    const activeSchools = schools.filter(s => s.subscription_status === 'active').length
    const trialSchools = schools.filter(s => s.subscription_status === 'trial').length
    const totalStudents = schools.reduce((acc, s) => acc + (s.current_students || 0), 0)

    // Get the current domain for display
    const displayDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'localhost:3000'

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Schools Management</h1>
                    <p className="text-muted-foreground">
                        Create and manage schools, subscriptions, and module access
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchSchools} disabled={isLoading}>
                        <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
                        setIsAddDialogOpen(open)
                        if (!open) resetForm()
                    }}>
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
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>URL Slug *</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="citygrammar"
                                                    value={formData.slug}
                                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                URL: <span className="font-mono">{formData.slug || 'schoolname'}.{displayDomain}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Email *</Label>
                                            <Input
                                                type="email"
                                                placeholder="admin@school.pk"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Phone</Label>
                                            <Input
                                                placeholder="+92-42-XXXXXXX"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>City</Label>
                                            <Input
                                                placeholder="Lahore"
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Principal Name</Label>
                                            <Input
                                                placeholder="Dr. Ahmad Khan"
                                                value={formData.principal_name}
                                                onChange={(e) => setFormData({ ...formData, principal_name: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Address</Label>
                                        <Input
                                            placeholder="123 Main Boulevard, DHA Phase 5"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        />
                                    </div>
                                </TabsContent>
                                <TabsContent value="subscription" className="space-y-4 mt-4">
                                    <div className="space-y-2">
                                        <Label>Subscription Plan</Label>
                                        <Select
                                            value={formData.subscription_plan}
                                            onValueChange={(v) => setFormData({ ...formData, subscription_plan: v })}
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
                                            <h4 className="font-medium mb-2">Default Modules for {formData.subscription_plan || 'Basic'} Plan:</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {['students', 'staff', 'fees', 'attendance', 'communications'].map(mod => (
                                                    <Badge key={mod} variant="secondary">{mod}</Badge>
                                                ))}
                                                {formData.subscription_plan === 'standard' && (
                                                    <>
                                                        <Badge variant="secondary">exams</Badge>
                                                        <Badge variant="secondary">admissions</Badge>
                                                        <Badge variant="secondary">homework</Badge>
                                                    </>
                                                )}
                                                {(formData.subscription_plan === 'premium' || formData.subscription_plan === 'enterprise') && (
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
                                <Button className="gradient-primary" onClick={handleCreateSchool} disabled={isSaving}>
                                    {isSaving ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Plus className="mr-2 h-4 w-4" />
                                    )}
                                    Create School
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
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
                        {isLoading && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading && schools.length === 0 ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : schools.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium">No schools found</h3>
                            <p className="text-muted-foreground mb-4">Get started by creating your first school.</p>
                            <Button onClick={() => setIsAddDialogOpen(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add New School
                            </Button>
                        </div>
                    ) : (
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
                                {schools.map((school) => (
                                    <TableRow key={school.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                                    <Building2 className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{school.name}</p>
                                                    <p className="text-xs text-muted-foreground">{school.city} • {school.principal_name || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <code className="text-xs bg-muted px-2 py-1 rounded">{school.slug}.{displayDomain}</code>
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
                                            <span className="font-medium">{school.current_students || 0}</span>
                                            <span className="text-muted-foreground">/{school.max_students === -1 ? '∞' : school.max_students}</span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openModulesDialog(school)}
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
                                                    <DropdownMenuItem onClick={() => {
                                                        const url = `http://${school.slug}.${displayDomain}`
                                                        window.open(url, '_blank')
                                                    }}>
                                                        <ExternalLink className="mr-2 h-4 w-4" />
                                                        Visit Portal
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => openModulesDialog(school)}>
                                                        <Shield className="mr-2 h-4 w-4" />
                                                        Manage Modules
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => openEditDialog(school)}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit School
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem 
                                                        className="text-red-500"
                                                        onClick={() => openDeleteDialog(school)}
                                                    >
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
                    )}
                </CardContent>
            </Card>

            {/* Edit School Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
                setIsEditDialogOpen(open)
                if (!open) resetForm()
            }}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit School</DialogTitle>
                        <DialogDescription>
                            Update school information and settings.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>School Name *</Label>
                                <Input
                                    placeholder="City Grammar School"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>URL Slug *</Label>
                                <Input
                                    placeholder="citygrammar"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                                />
                                <p className="text-xs text-muted-foreground">
                                    URL: <span className="font-mono">{formData.slug}.{displayDomain}</span>
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Email *</Label>
                                <Input
                                    type="email"
                                    placeholder="admin@school.pk"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Phone</Label>
                                <Input
                                    placeholder="+92-42-XXXXXXX"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>City</Label>
                                <Input
                                    placeholder="Lahore"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Principal Name</Label>
                                <Input
                                    placeholder="Dr. Ahmad Khan"
                                    value={formData.principal_name}
                                    onChange={(e) => setFormData({ ...formData, principal_name: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Address</Label>
                            <Input
                                placeholder="123 Main Boulevard, DHA Phase 5"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Subscription Plan</Label>
                            <Select
                                value={formData.subscription_plan}
                                onValueChange={(v) => setFormData({ ...formData, subscription_plan: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="basic">Basic</SelectItem>
                                    <SelectItem value="standard">Standard</SelectItem>
                                    <SelectItem value="premium">Premium</SelectItem>
                                    <SelectItem value="enterprise">Enterprise</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                        <Button className="gradient-primary" onClick={handleUpdateSchool} disabled={isSaving}>
                            {isSaving ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <CheckCircle className="mr-2 h-4 w-4" />
                            )}
                            Save Changes
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

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
                            <Button className="gradient-primary" onClick={handleSaveModules} disabled={isSaving}>
                                {isSaving ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                )}
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will deactivate <strong>{selectedSchool?.name}</strong> and suspend their account. 
                            All users from this school will no longer be able to access the system.
                            This action can be reversed by reactivating the school later.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleDeleteSchool}
                            className="bg-red-500 hover:bg-red-600"
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Trash2 className="mr-2 h-4 w-4" />
                            )}
                            Deactivate School
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
