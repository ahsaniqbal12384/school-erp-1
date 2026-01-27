'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Globe,
    Palette,
    Layout,
    MessageSquare,
    Image as ImageIcon,
    Phone,
    Mail,
    MapPin,
    Facebook,
    Instagram,
    Youtube,
    Save,
    Loader2,
    Eye,
    ExternalLink,
} from 'lucide-react'
import { useTenant } from '@/lib/tenant'
import { toast } from 'sonner'

interface PortalSettings {
    id?: string
    hero_title: string
    hero_subtitle: string
    hero_image_url: string
    hero_background_color: string
    logo_url: string
    primary_color: string
    secondary_color: string
    contact_email: string
    contact_phone: string
    contact_address: string
    facebook_url: string
    instagram_url: string
    youtube_url: string
    whatsapp_number: string
    show_about_section: boolean
    about_text: string
    show_facilities_section: boolean
    show_contact_section: boolean
    announcement_text: string
    announcement_active: boolean
    show_student_login: boolean
    show_parent_login: boolean
    show_teacher_login: boolean
    show_admin_login: boolean
}

const defaultSettings: PortalSettings = {
    hero_title: 'Welcome to Our School',
    hero_subtitle: 'Empowering minds, shaping futures',
    hero_image_url: '',
    hero_background_color: '#1e40af',
    logo_url: '',
    primary_color: '#3b82f6',
    secondary_color: '#06b6d4',
    contact_email: '',
    contact_phone: '',
    contact_address: '',
    facebook_url: '',
    instagram_url: '',
    youtube_url: '',
    whatsapp_number: '',
    show_about_section: true,
    about_text: '',
    show_facilities_section: true,
    show_contact_section: true,
    announcement_text: '',
    announcement_active: false,
    show_student_login: true,
    show_parent_login: true,
    show_teacher_login: true,
    show_admin_login: true,
}

export default function PortalSettingsPage() {
    const { school } = useTenant()
    const [settings, setSettings] = useState<PortalSettings>(defaultSettings)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        const fetchSettings = async () => {
            if (!school?.id) return

            try {
                const response = await fetch(`/api/schools/portal-settings?school_id=${school.id}`)
                if (response.ok) {
                    const data = await response.json()
                    if (data.settings) {
                        setSettings({ ...defaultSettings, ...data.settings })
                    }
                }
            } catch (error) {
                console.error('Error fetching settings:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchSettings()
    }, [school?.id])

    const handleSave = async () => {
        if (!school?.id) return

        setSaving(true)
        try {
            const response = await fetch('/api/schools/portal-settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    school_id: school.id,
                    ...settings
                })
            })

            if (!response.ok) throw new Error('Failed to save')

            toast.success('Portal settings saved successfully!')
        } catch (error) {
            toast.error('Failed to save settings')
        } finally {
            setSaving(false)
        }
    }

    const updateSettings = (key: keyof PortalSettings, value: string | boolean) => {
        setSettings(prev => ({ ...prev, [key]: value }))
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Portal Settings</h1>
                    <p className="text-muted-foreground">
                        Customize your school&apos;s public landing page and login portal
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={() => window.open(`/?school=${school?.slug}`, '_blank')}
                    >
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                    </Button>
                    <Button onClick={handleSave} disabled={saving} className="gradient-primary">
                        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="branding" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
                    <TabsTrigger value="branding">Branding</TabsTrigger>
                    <TabsTrigger value="hero">Hero Section</TabsTrigger>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                    <TabsTrigger value="login">Login Options</TabsTrigger>
                </TabsList>

                {/* Branding Tab */}
                <TabsContent value="branding">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Palette className="h-5 w-5" />
                                Branding & Colors
                            </CardTitle>
                            <CardDescription>
                                Customize your school&apos;s brand colors and logo
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Logo URL</Label>
                                    <Input
                                        placeholder="https://example.com/logo.png"
                                        value={settings.logo_url}
                                        onChange={(e) => updateSettings('logo_url', e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Upload your logo to a hosting service and paste the URL here
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Primary Color</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            value={settings.primary_color}
                                            onChange={(e) => updateSettings('primary_color', e.target.value)}
                                            className="w-16 h-10 p-1"
                                        />
                                        <Input
                                            value={settings.primary_color}
                                            onChange={(e) => updateSettings('primary_color', e.target.value)}
                                            className="flex-1"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Secondary Color</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            value={settings.secondary_color}
                                            onChange={(e) => updateSettings('secondary_color', e.target.value)}
                                            className="w-16 h-10 p-1"
                                        />
                                        <Input
                                            value={settings.secondary_color}
                                            onChange={(e) => updateSettings('secondary_color', e.target.value)}
                                            className="flex-1"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Color Preview */}
                            <div className="p-4 rounded-lg border">
                                <p className="text-sm text-muted-foreground mb-3">Preview</p>
                                <div className="flex gap-4 items-center">
                                    <div
                                        className="w-20 h-10 rounded"
                                        style={{ background: `linear-gradient(135deg, ${settings.primary_color}, ${settings.secondary_color})` }}
                                    />
                                    <span className="text-sm">Button / Header Gradient</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Hero Section Tab */}
                <TabsContent value="hero">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Layout className="h-5 w-5" />
                                Hero Section
                            </CardTitle>
                            <CardDescription>
                                Customize the main banner that visitors see first
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Hero Title</Label>
                                <Input
                                    placeholder="Welcome to Our School"
                                    value={settings.hero_title}
                                    onChange={(e) => updateSettings('hero_title', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Hero Subtitle</Label>
                                <Textarea
                                    placeholder="Empowering minds, shaping futures"
                                    value={settings.hero_subtitle}
                                    onChange={(e) => updateSettings('hero_subtitle', e.target.value)}
                                    rows={2}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Background Image URL (Optional)</Label>
                                <Input
                                    placeholder="https://example.com/hero-image.jpg"
                                    value={settings.hero_image_url}
                                    onChange={(e) => updateSettings('hero_image_url', e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Leave empty to use gradient background
                                </p>
                            </div>

                            <Separator />

                            {/* Announcement Banner */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Announcement Banner</Label>
                                        <p className="text-xs text-muted-foreground">
                                            Show a special announcement at the top of your page
                                        </p>
                                    </div>
                                    <Switch
                                        checked={settings.announcement_active}
                                        onCheckedChange={(checked) => updateSettings('announcement_active', checked)}
                                    />
                                </div>
                                {settings.announcement_active && (
                                    <Textarea
                                        placeholder="Important: Admissions open for 2025-26!"
                                        value={settings.announcement_text}
                                        onChange={(e) => updateSettings('announcement_text', e.target.value)}
                                        rows={2}
                                    />
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Content Tab */}
                <TabsContent value="content">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5" />
                                Page Content
                            </CardTitle>
                            <CardDescription>
                                Control which sections appear on your landing page
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* About Section */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>About Section</Label>
                                        <p className="text-xs text-muted-foreground">
                                            Show information about your school
                                        </p>
                                    </div>
                                    <Switch
                                        checked={settings.show_about_section}
                                        onCheckedChange={(checked) => updateSettings('show_about_section', checked)}
                                    />
                                </div>
                                {settings.show_about_section && (
                                    <Textarea
                                        placeholder="Write about your school's history, mission, and values..."
                                        value={settings.about_text}
                                        onChange={(e) => updateSettings('about_text', e.target.value)}
                                        rows={4}
                                    />
                                )}
                            </div>

                            <Separator />

                            {/* Facilities Section */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Facilities Section</Label>
                                    <p className="text-xs text-muted-foreground">
                                        Show your school facilities (manage in separate page)
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.show_facilities_section}
                                    onCheckedChange={(checked) => updateSettings('show_facilities_section', checked)}
                                />
                            </div>

                            <Separator />

                            {/* Contact Section */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Contact Section</Label>
                                    <p className="text-xs text-muted-foreground">
                                        Show contact information on landing page
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.show_contact_section}
                                    onCheckedChange={(checked) => updateSettings('show_contact_section', checked)}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Contact Tab */}
                <TabsContent value="contact">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Phone className="h-5 w-5" />
                                Contact Information
                            </CardTitle>
                            <CardDescription>
                                Contact details shown on your landing page
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Phone className="h-4 w-4" /> Phone Number
                                    </Label>
                                    <Input
                                        placeholder="0300-1234567"
                                        value={settings.contact_phone}
                                        onChange={(e) => updateSettings('contact_phone', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" /> Email Address
                                    </Label>
                                    <Input
                                        type="email"
                                        placeholder="info@yourschool.edu.pk"
                                        value={settings.contact_email}
                                        onChange={(e) => updateSettings('contact_email', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" /> Address
                                </Label>
                                <Textarea
                                    placeholder="123 School Street, City, Pakistan"
                                    value={settings.contact_address}
                                    onChange={(e) => updateSettings('contact_address', e.target.value)}
                                    rows={2}
                                />
                            </div>

                            <Separator />

                            <h3 className="font-medium">Social Media Links</h3>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Facebook className="h-4 w-4" /> Facebook
                                    </Label>
                                    <Input
                                        placeholder="https://facebook.com/yourschool"
                                        value={settings.facebook_url}
                                        onChange={(e) => updateSettings('facebook_url', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Instagram className="h-4 w-4" /> Instagram
                                    </Label>
                                    <Input
                                        placeholder="https://instagram.com/yourschool"
                                        value={settings.instagram_url}
                                        onChange={(e) => updateSettings('instagram_url', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Youtube className="h-4 w-4" /> YouTube
                                    </Label>
                                    <Input
                                        placeholder="https://youtube.com/@yourschool"
                                        value={settings.youtube_url}
                                        onChange={(e) => updateSettings('youtube_url', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Phone className="h-4 w-4" /> WhatsApp
                                    </Label>
                                    <Input
                                        placeholder="+923001234567"
                                        value={settings.whatsapp_number}
                                        onChange={(e) => updateSettings('whatsapp_number', e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Login Options Tab */}
                <TabsContent value="login">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5" />
                                Login Options
                            </CardTitle>
                            <CardDescription>
                                Control which login options are visible on your portal
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4">
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <Label>Admin Login</Label>
                                        <p className="text-xs text-muted-foreground">
                                            Allow school administrators to login
                                        </p>
                                    </div>
                                    <Switch
                                        checked={settings.show_admin_login}
                                        onCheckedChange={(checked) => updateSettings('show_admin_login', checked)}
                                    />
                                </div>
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <Label>Teacher Login</Label>
                                        <p className="text-xs text-muted-foreground">
                                            Allow teachers to login to their portal
                                        </p>
                                    </div>
                                    <Switch
                                        checked={settings.show_teacher_login}
                                        onCheckedChange={(checked) => updateSettings('show_teacher_login', checked)}
                                    />
                                </div>
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <Label>Parent Login</Label>
                                        <p className="text-xs text-muted-foreground">
                                            Allow parents to login and view their children&apos;s info
                                        </p>
                                    </div>
                                    <Switch
                                        checked={settings.show_parent_login}
                                        onCheckedChange={(checked) => updateSettings('show_parent_login', checked)}
                                    />
                                </div>
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <Label>Student Login</Label>
                                        <p className="text-xs text-muted-foreground">
                                            Allow students to login to their portal
                                        </p>
                                    </div>
                                    <Switch
                                        checked={settings.show_student_login}
                                        onCheckedChange={(checked) => updateSettings('show_student_login', checked)}
                                    />
                                </div>
                            </div>

                            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                                    <strong>Note:</strong> Super Admin login is only available on the main platform (schoolerp.pk), 
                                    not on individual school portals.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
