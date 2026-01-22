'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Settings,
    Building2,
    Palette,
    Bell,
    Shield,
    Globe,
    Upload,
    Save,
    CheckCircle,
    Calendar,
    Clock,
    DollarSign,
    Mail,
    MessageSquare,
    Users,
    Smartphone,
} from 'lucide-react'

interface SchoolSettingsData {
    // Basic Info
    name: string
    slug: string
    email: string
    phone: string
    address: string
    city: string
    website: string
    principal_name: string
    established_year: string
    school_motto: string
    school_vision: string
    // Branding
    logo_url: string
    primary_color: string
    secondary_color: string
    accent_color: string
    // Academic
    academic_year: string
    term_system: string
    grading_system: string
    // Localization
    currency: string
    timezone: string
    date_format: string
    time_format: string
    // Working
    working_days: string[]
    school_timing_start: string
    school_timing_end: string
    // Features
    sms_enabled: boolean
    email_enabled: boolean
    parent_portal_enabled: boolean
    student_portal_enabled: boolean
    online_payment_enabled: boolean
    biometric_attendance: boolean
}

const defaultSettings: SchoolSettingsData = {
    name: 'City Grammar School',
    slug: 'citygrammar',
    email: 'admin@citygrammar.edu.pk',
    phone: '+92-42-35761234',
    address: '123 Main Boulevard, DHA Phase 5',
    city: 'Lahore',
    website: 'www.citygrammar.edu.pk',
    principal_name: 'Dr. Ahmad Khan',
    established_year: '1995',
    school_motto: 'Excellence in Education',
    school_vision: 'To be the leading educational institution nurturing future leaders',
    logo_url: '',
    primary_color: '#3b82f6',
    secondary_color: '#8b5cf6',
    accent_color: '#10b981',
    academic_year: '2024-2025',
    term_system: 'semester',
    grading_system: 'percentage',
    currency: 'PKR',
    timezone: 'Asia/Karachi',
    date_format: 'DD/MM/YYYY',
    time_format: '12h',
    working_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    school_timing_start: '08:00',
    school_timing_end: '14:00',
    sms_enabled: true,
    email_enabled: true,
    parent_portal_enabled: true,
    student_portal_enabled: true,
    online_payment_enabled: false,
    biometric_attendance: false,
}

const weekDays = [
    { id: 'monday', label: 'Monday' },
    { id: 'tuesday', label: 'Tuesday' },
    { id: 'wednesday', label: 'Wednesday' },
    { id: 'thursday', label: 'Thursday' },
    { id: 'friday', label: 'Friday' },
    { id: 'saturday', label: 'Saturday' },
    { id: 'sunday', label: 'Sunday' },
]

export default function SchoolSettingsPage() {
    const [settings, setSettings] = useState<SchoolSettingsData>(defaultSettings)
    const [isSaving, setIsSaving] = useState(false)
    const [saveSuccess, setSaveSuccess] = useState(false)

    const handleSave = async () => {
        setIsSaving(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsSaving(false)
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
    }

    const toggleWorkingDay = (day: string) => {
        if (settings.working_days.includes(day)) {
            setSettings({ ...settings, working_days: settings.working_days.filter(d => d !== day) })
        } else {
            setSettings({ ...settings, working_days: [...settings.working_days, day] })
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">School Settings</h1>
                    <p className="text-muted-foreground">
                                        Customize your school&apos;s profile, branding, and preferences
                    </p>
                </div>
                <Button
                    className="gradient-primary"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <>Saving...</>
                    ) : saveSuccess ? (
                        <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Saved!
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>

            {/* Current Plan Info */}
            <Card className="border-primary/50 bg-primary/5">
                <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                <Shield className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium">Premium Plan</p>
                                <p className="text-sm text-muted-foreground">
                                    Your subscription is active until December 31, 2025
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <Badge className="bg-green-500/10 text-green-500">Active</Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                                Contact Super Admin to upgrade
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="general">
                        <Building2 className="mr-2 h-4 w-4" />
                        General
                    </TabsTrigger>
                    <TabsTrigger value="branding">
                        <Palette className="mr-2 h-4 w-4" />
                        Branding
                    </TabsTrigger>
                    <TabsTrigger value="academic">
                        <Calendar className="mr-2 h-4 w-4" />
                        Academic
                    </TabsTrigger>
                    <TabsTrigger value="notifications">
                        <Bell className="mr-2 h-4 w-4" />
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger value="features">
                        <Settings className="mr-2 h-4 w-4" />
                        Features
                    </TabsTrigger>
                </TabsList>

                {/* General Settings */}
                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>School Information</CardTitle>
                            <CardDescription>Basic details about your school</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>School Name</Label>
                                    <Input
                                        value={settings.name}
                                        onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>URL Slug</Label>
                                    <div className="flex gap-2 items-center">
                                        <Input
                                            value={settings.slug}
                                            disabled
                                            className="bg-muted"
                                        />
                                        <span className="text-sm text-muted-foreground whitespace-nowrap">.yourapp.com</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Contact Super Admin to change URL</p>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        value={settings.email}
                                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Phone</Label>
                                    <Input
                                        value={settings.phone}
                                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Address</Label>
                                <Textarea
                                    value={settings.address}
                                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                                    rows={2}
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label>City</Label>
                                    <Input
                                        value={settings.city}
                                        onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Website</Label>
                                    <Input
                                        value={settings.website}
                                        onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Established Year</Label>
                                    <Input
                                        value={settings.established_year}
                                        onChange={(e) => setSettings({ ...settings, established_year: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Principal Name</Label>
                                    <Input
                                        value={settings.principal_name}
                                        onChange={(e) => setSettings({ ...settings, principal_name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>School Motto</Label>
                                    <Input
                                        value={settings.school_motto}
                                        onChange={(e) => setSettings({ ...settings, school_motto: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>School Vision</Label>
                                <Textarea
                                    value={settings.school_vision}
                                    onChange={(e) => setSettings({ ...settings, school_vision: e.target.value })}
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Branding Settings */}
                <TabsContent value="branding">
                    <div className="grid gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Logo & Images</CardTitle>
                                <CardDescription>Upload your school&apos;s logo and branding images</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center gap-6">
                                    <div className="flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed bg-muted">
                                        {settings.logo_url ? (
                                            <img src={settings.logo_url} alt="Logo" className="h-full w-full object-contain rounded-lg" />
                                        ) : (
                                            <Building2 className="h-12 w-12 text-muted-foreground" />
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-medium">School Logo</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Recommended: 200x200px, PNG or SVG
                                        </p>
                                        <Button variant="outline" size="sm">
                                            <Upload className="mr-2 h-4 w-4" />
                                            Upload Logo
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Color Theme</CardTitle>
                                <CardDescription>Customize your school&apos;s color scheme</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label>Primary Color</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                type="color"
                                                value={settings.primary_color}
                                                onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                                                className="w-12 h-10 p-1 cursor-pointer"
                                            />
                                            <Input
                                                value={settings.primary_color}
                                                onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                                                className="flex-1"
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">Used for buttons, links</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Secondary Color</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                type="color"
                                                value={settings.secondary_color}
                                                onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                                                className="w-12 h-10 p-1 cursor-pointer"
                                            />
                                            <Input
                                                value={settings.secondary_color}
                                                onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                                                className="flex-1"
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">Used for accents, highlights</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Accent Color</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                type="color"
                                                value={settings.accent_color}
                                                onChange={(e) => setSettings({ ...settings, accent_color: e.target.value })}
                                                className="w-12 h-10 p-1 cursor-pointer"
                                            />
                                            <Input
                                                value={settings.accent_color}
                                                onChange={(e) => setSettings({ ...settings, accent_color: e.target.value })}
                                                className="flex-1"
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">Used for success states</p>
                                    </div>
                                </div>

                                {/* Preview */}
                                <div className="p-4 rounded-lg border">
                                    <h4 className="font-medium mb-3">Preview</h4>
                                    <div className="flex gap-3">
                                        <Button style={{ backgroundColor: settings.primary_color }}>
                                            Primary Button
                                        </Button>
                                        <Button style={{ backgroundColor: settings.secondary_color }}>
                                            Secondary
                                        </Button>
                                        <Badge style={{ backgroundColor: settings.accent_color }}>
                                            Success Badge
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Academic Settings */}
                <TabsContent value="academic">
                    <div className="grid gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Academic Year Settings</CardTitle>
                                <CardDescription>Configure academic calendar and grading</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label>Academic Year</Label>
                                        <Input
                                            value={settings.academic_year}
                                            onChange={(e) => setSettings({ ...settings, academic_year: e.target.value })}
                                            placeholder="2024-2025"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Term System</Label>
                                        <Select
                                            value={settings.term_system}
                                            onValueChange={(v) => setSettings({ ...settings, term_system: v })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="semester">Semester (2 terms)</SelectItem>
                                                <SelectItem value="trimester">Trimester (3 terms)</SelectItem>
                                                <SelectItem value="quarterly">Quarterly (4 terms)</SelectItem>
                                                <SelectItem value="annual">Annual</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Grading System</Label>
                                        <Select
                                            value={settings.grading_system}
                                            onValueChange={(v) => setSettings({ ...settings, grading_system: v })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="percentage">Percentage</SelectItem>
                                                <SelectItem value="gpa">GPA (4.0 Scale)</SelectItem>
                                                <SelectItem value="grades">Letter Grades (A-F)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>School Timing</CardTitle>
                                <CardDescription>Set working days and school hours</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <Label className="mb-3 block">Working Days</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {weekDays.map((day) => (
                                            <Button
                                                key={day.id}
                                                variant={settings.working_days.includes(day.id) ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => toggleWorkingDay(day.id)}
                                            >
                                                {day.label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>School Start Time</Label>
                                        <Input
                                            type="time"
                                            value={settings.school_timing_start}
                                            onChange={(e) => setSettings({ ...settings, school_timing_start: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>School End Time</Label>
                                        <Input
                                            type="time"
                                            value={settings.school_timing_end}
                                            onChange={(e) => setSettings({ ...settings, school_timing_end: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Localization</CardTitle>
                                <CardDescription>Regional settings for your school</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-4">
                                    <div className="space-y-2">
                                        <Label>Currency</Label>
                                        <Select
                                            value={settings.currency}
                                            onValueChange={(v) => setSettings({ ...settings, currency: v })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="PKR">PKR (Pakistani Rupee)</SelectItem>
                                                <SelectItem value="USD">USD (US Dollar)</SelectItem>
                                                <SelectItem value="GBP">GBP (British Pound)</SelectItem>
                                                <SelectItem value="AED">AED (UAE Dirham)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Timezone</Label>
                                        <Select
                                            value={settings.timezone}
                                            onValueChange={(v) => setSettings({ ...settings, timezone: v })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Asia/Karachi">Asia/Karachi (PKT)</SelectItem>
                                                <SelectItem value="Asia/Dubai">Asia/Dubai (GST)</SelectItem>
                                                <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Date Format</Label>
                                        <Select
                                            value={settings.date_format}
                                            onValueChange={(v) => setSettings({ ...settings, date_format: v })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                                                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                                                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Time Format</Label>
                                        <Select
                                            value={settings.time_format}
                                            onValueChange={(v) => setSettings({ ...settings, time_format: v })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="12h">12 Hour (AM/PM)</SelectItem>
                                                <SelectItem value="24h">24 Hour</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Notification Settings */}
                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                            <CardDescription>Configure how notifications are sent</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-lg border">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                                            <Mail className="h-5 w-5 text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Email Notifications</p>
                                            <p className="text-sm text-muted-foreground">Send notifications via email</p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={settings.email_enabled}
                                        onCheckedChange={(v) => setSettings({ ...settings, email_enabled: v })}
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-lg border">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                                            <MessageSquare className="h-5 w-5 text-green-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium">SMS Notifications</p>
                                            <p className="text-sm text-muted-foreground">Send SMS to parents and staff</p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={settings.sms_enabled}
                                        onCheckedChange={(v) => setSettings({ ...settings, sms_enabled: v })}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Features Settings */}
                <TabsContent value="features">
                    <Card>
                        <CardHeader>
                            <CardTitle>Portal & Features</CardTitle>
                            <CardDescription>Enable or disable school features</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-lg border">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                                        <Users className="h-5 w-5 text-purple-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Parent Portal</p>
                                        <p className="text-sm text-muted-foreground">Allow parents to access the portal</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={settings.parent_portal_enabled}
                                    onCheckedChange={(v) => setSettings({ ...settings, parent_portal_enabled: v })}
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-lg border">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                                        <GraduationCap className="h-5 w-5 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Student Portal</p>
                                        <p className="text-sm text-muted-foreground">Allow students to access the portal</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={settings.student_portal_enabled}
                                    onCheckedChange={(v) => setSettings({ ...settings, student_portal_enabled: v })}
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-lg border">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                                        <DollarSign className="h-5 w-5 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Online Payment</p>
                                        <p className="text-sm text-muted-foreground">Accept online fee payments</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={settings.online_payment_enabled}
                                    onCheckedChange={(v) => setSettings({ ...settings, online_payment_enabled: v })}
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-lg border">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                                        <Smartphone className="h-5 w-5 text-orange-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Biometric Attendance</p>
                                        <p className="text-sm text-muted-foreground">Use biometric devices for attendance</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={settings.biometric_attendance}
                                    onCheckedChange={(v) => setSettings({ ...settings, biometric_attendance: v })}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

function GraduationCap(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
    )
}
