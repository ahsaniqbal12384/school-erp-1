'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import {
    Building2,
    Mail,
    Shield,
    Palette,
    Database,
    Globe,
    Save,
    Key,
    CreditCard,
    Loader2,
    MessageSquare,
    Send,
    Smartphone,
    AlertTriangle,
    TestTube,
} from 'lucide-react'

interface PlatformSettings {
    // General
    platform_name: string
    platform_domain: string
    support_email: string
    support_phone: string
    default_timezone: string
    default_currency: string
    default_language: string
    
    // Branding
    primary_color: string
    secondary_color: string
    logo_light_url: string | null
    logo_dark_url: string | null
    
    // Email Settings
    email_notifications: boolean
    smtp_host: string
    smtp_port: string
    smtp_username: string
    smtp_password: string
    smtp_from_email: string
    smtp_from_name: string
    smtp_encryption: string
    
    // SMS Settings
    sms_notifications: boolean
    sms_provider: string
    sms_api_key: string
    sms_api_secret: string
    sms_sender_id: string
    sms_account_sid: string
    
    // Security
    two_factor_auth: boolean
    session_timeout_minutes: number
    password_policy: string
    max_login_attempts: number
    lockout_duration_minutes: number
    
    // Billing
    payment_gateway: string
    payment_merchant_id: string
    payment_secret_key: string
    plan_basic_price: number
    plan_standard_price: number
    plan_premium_price: number
    
    // System
    auto_backup: boolean
    backup_retention_days: number
    maintenance_mode: boolean
    maintenance_message: string
    
    // API Keys
    api_key_production: string
    api_key_test: string
    
    trial_days: number
}

export default function SuperAdminSettingsPage() {
    const [settings, setSettings] = useState<PlatformSettings | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isTesting, setIsTesting] = useState(false)
    
    // Form state mirrors the settings
    const [formData, setFormData] = useState<Partial<PlatformSettings>>({})
    
    // UI state
    const [showSmtpPassword, setShowSmtpPassword] = useState(false)
    const [showSmsSecret, setShowSmsSecret] = useState(false)
    const [showProdKey, setShowProdKey] = useState(false)
    const [showTestKey, setShowTestKey] = useState(false)

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings')
            if (res.ok) {
                const data = await res.json()
                setSettings(data.settings)
                setFormData(data.settings)
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error)
            toast.error('Failed to load settings')
        } finally {
            setIsLoading(false)
        }
    }

    const updateFormData = (key: keyof PlatformSettings, value: unknown) => {
        setFormData(prev => ({ ...prev, [key]: value }))
    }

    const handleSave = async (section?: string) => {
        setIsSaving(true)
        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                const data = await res.json()
                setSettings(data.settings)
                toast.success(section ? `${section} settings saved successfully` : 'Settings saved successfully')
            } else {
                const error = await res.json()
                toast.error(error.error || 'Failed to save settings')
            }
        } catch (error) {
            toast.error('An error occurred while saving')
        } finally {
            setIsSaving(false)
        }
    }

    const handleTestSmtp = async () => {
        if (!formData.smtp_host || !formData.smtp_username || !formData.smtp_from_email) {
            toast.error('Please fill in SMTP Host, Username, and From Email first')
            return
        }
        setIsTesting(true)
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'test-smtp',
                    ...formData
                })
            })
            const data = await res.json()
            if (data.success) {
                toast.success(data.message)
            } else {
                toast.error(data.error || 'SMTP test failed')
            }
        } catch {
            toast.error('Failed to test SMTP connection')
        } finally {
            setIsTesting(false)
        }
    }

    const handleTestSms = async () => {
        if (!formData.sms_provider || !formData.sms_api_key || !formData.sms_sender_id) {
            toast.error('Please fill in SMS Provider, API Key, and Sender ID first')
            return
        }
        setIsTesting(true)
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'test-sms',
                    ...formData
                })
            })
            const data = await res.json()
            if (data.success) {
                toast.success(data.message)
            } else {
                toast.error(data.error || 'SMS test failed')
            }
        } catch {
            toast.error('Failed to test SMS configuration')
        } finally {
            setIsTesting(false)
        }
    }

    const generateApiKey = (type: 'production' | 'test') => {
        const prefix = type === 'production' ? 'pk_live_' : 'pk_test_'
        const key = prefix + Array.from({ length: 32 }, () => 
            'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 36)]
        ).join('')
        updateFormData(type === 'production' ? 'api_key_production' : 'api_key_test', key)
        toast.success(`New ${type} API key generated. Don't forget to save!`)
    }

    const handleLogoUpload = (type: 'light' | 'dark') => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (file) {
                const reader = new FileReader()
                reader.onload = (event) => {
                    const dataUrl = event.target?.result as string
                    updateFormData(type === 'light' ? 'logo_light_url' : 'logo_dark_url', dataUrl)
                    toast.success(`${type === 'light' ? 'Light' : 'Dark'} mode logo uploaded. Don't forget to save!`)
                }
                reader.readAsDataURL(file)
            }
        }
        input.click()
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <Skeleton className="h-8 w-64 mb-2" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <Skeleton className="h-12 w-full max-w-2xl" />
                <Skeleton className="h-96 w-full" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
                <p className="text-muted-foreground">
                    Configure email, SMS, security, and other platform settings
                </p>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="email">Email</TabsTrigger>
                    <TabsTrigger value="sms">SMS</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="billing">Billing</TabsTrigger>
                    <TabsTrigger value="system">System</TabsTrigger>
                </TabsList>

                {/* General Settings */}
                <TabsContent value="general" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-primary" />
                                <CardTitle>Platform Information</CardTitle>
                            </div>
                            <CardDescription>Basic platform configuration and contact details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="platformName">Platform Name</Label>
                                    <Input 
                                        id="platformName" 
                                        value={formData.platform_name || ''}
                                        onChange={(e) => updateFormData('platform_name', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="platformDomain">Platform Domain</Label>
                                    <Input 
                                        id="platformDomain" 
                                        value={formData.platform_domain || ''}
                                        onChange={(e) => updateFormData('platform_domain', e.target.value)}
                                        placeholder="yourschoolerp.com"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Schools will get URLs like: schoolname.{formData.platform_domain || 'yourdomain.com'}
                                    </p>
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="supportEmail">Support Email</Label>
                                    <Input 
                                        id="supportEmail" 
                                        type="email" 
                                        value={formData.support_email || ''}
                                        onChange={(e) => updateFormData('support_email', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="supportPhone">Support Phone</Label>
                                    <Input 
                                        id="supportPhone" 
                                        value={formData.support_phone || ''}
                                        onChange={(e) => updateFormData('support_phone', e.target.value)}
                                    />
                                </div>
                            </div>
                            <Separator />
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label>Default Timezone</Label>
                                    <Select 
                                        value={formData.default_timezone || 'Asia/Karachi'} 
                                        onValueChange={(v) => updateFormData('default_timezone', v)}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Asia/Karachi">Asia/Karachi (PKT)</SelectItem>
                                            <SelectItem value="UTC">UTC</SelectItem>
                                            <SelectItem value="Asia/Dubai">Asia/Dubai (GST)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Default Currency</Label>
                                    <Select 
                                        value={formData.default_currency || 'PKR'} 
                                        onValueChange={(v) => updateFormData('default_currency', v)}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PKR">PKR - Pakistani Rupee</SelectItem>
                                            <SelectItem value="USD">USD - US Dollar</SelectItem>
                                            <SelectItem value="AED">AED - UAE Dirham</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Default Language</Label>
                                    <Select 
                                        value={formData.default_language || 'en'} 
                                        onValueChange={(v) => updateFormData('default_language', v)}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="en">English</SelectItem>
                                            <SelectItem value="ur">Urdu</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Palette className="h-5 w-5 text-primary" />
                                <CardTitle>Branding</CardTitle>
                            </div>
                            <CardDescription>Customize platform appearance</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Logo (Light Mode)</Label>
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-32 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center overflow-hidden bg-white">
                                            {formData.logo_light_url ? (
                                                <img src={formData.logo_light_url} alt="Light logo" className="h-full w-full object-contain" />
                                            ) : (
                                                <span className="text-xs text-muted-foreground">No Logo</span>
                                            )}
                                        </div>
                                        <Button variant="outline" size="sm" onClick={() => handleLogoUpload('light')}>Upload</Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Logo (Dark Mode)</Label>
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-32 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-gray-900 overflow-hidden">
                                            {formData.logo_dark_url ? (
                                                <img src={formData.logo_dark_url} alt="Dark logo" className="h-full w-full object-contain" />
                                            ) : (
                                                <span className="text-xs text-gray-400">No Logo</span>
                                            )}
                                        </div>
                                        <Button variant="outline" size="sm" onClick={() => handleLogoUpload('dark')}>Upload</Button>
                                    </div>
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Primary Color</Label>
                                    <div className="flex items-center gap-2">
                                        <Input 
                                            type="color" 
                                            value={formData.primary_color || '#6366f1'} 
                                            onChange={(e) => updateFormData('primary_color', e.target.value)}
                                            className="h-10 w-20" 
                                        />
                                        <Input 
                                            value={formData.primary_color || '#6366f1'} 
                                            onChange={(e) => updateFormData('primary_color', e.target.value)}
                                            className="w-32" 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Secondary Color</Label>
                                    <div className="flex items-center gap-2">
                                        <Input 
                                            type="color" 
                                            value={formData.secondary_color || '#06b6d4'} 
                                            onChange={(e) => updateFormData('secondary_color', e.target.value)}
                                            className="h-10 w-20" 
                                        />
                                        <Input 
                                            value={formData.secondary_color || '#06b6d4'} 
                                            onChange={(e) => updateFormData('secondary_color', e.target.value)}
                                            className="w-32" 
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button className="gradient-primary" onClick={() => handleSave('General')} disabled={isSaving}>
                                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Save General Settings
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Email Settings */}
                <TabsContent value="email" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Mail className="h-5 w-5 text-primary" />
                                <CardTitle>Email Notifications</CardTitle>
                            </div>
                            <CardDescription>Enable and configure email notifications</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Enable Email Notifications</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Send system notifications, alerts, and reports via email
                                    </p>
                                </div>
                                <Switch 
                                    checked={formData.email_notifications || false} 
                                    onCheckedChange={(v) => updateFormData('email_notifications', v)} 
                                />
                            </div>

                            {formData.email_notifications && (
                                <>
                                    <Separator />
                                    <div className="space-y-4">
                                        <h4 className="font-medium flex items-center gap-2">
                                            <Send className="h-4 w-4" />
                                            SMTP Configuration
                                        </h4>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label>SMTP Host *</Label>
                                                <Input 
                                                    placeholder="smtp.gmail.com or smtp.sendgrid.net"
                                                    value={formData.smtp_host || ''}
                                                    onChange={(e) => updateFormData('smtp_host', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>SMTP Port *</Label>
                                                <Select 
                                                    value={formData.smtp_port || '587'} 
                                                    onValueChange={(v) => updateFormData('smtp_port', v)}
                                                >
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="25">25 (Standard)</SelectItem>
                                                        <SelectItem value="465">465 (SSL)</SelectItem>
                                                        <SelectItem value="587">587 (TLS)</SelectItem>
                                                        <SelectItem value="2525">2525 (Alternative)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label>SMTP Username *</Label>
                                                <Input 
                                                    placeholder="your-email@gmail.com or apikey"
                                                    value={formData.smtp_username || ''}
                                                    onChange={(e) => updateFormData('smtp_username', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>SMTP Password *</Label>
                                                <div className="flex gap-2">
                                                    <Input 
                                                        type={showSmtpPassword ? 'text' : 'password'}
                                                        placeholder="Your SMTP password or API key"
                                                        value={formData.smtp_password || ''}
                                                        onChange={(e) => updateFormData('smtp_password', e.target.value)}
                                                    />
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        onClick={() => setShowSmtpPassword(!showSmtpPassword)}
                                                    >
                                                        {showSmtpPassword ? 'Hide' : 'Show'}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label>From Email *</Label>
                                                <Input 
                                                    type="email"
                                                    placeholder="noreply@yourschoolerp.com"
                                                    value={formData.smtp_from_email || ''}
                                                    onChange={(e) => updateFormData('smtp_from_email', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>From Name</Label>
                                                <Input 
                                                    placeholder="School ERP"
                                                    value={formData.smtp_from_name || ''}
                                                    onChange={(e) => updateFormData('smtp_from_name', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Encryption</Label>
                                            <Select 
                                                value={formData.smtp_encryption || 'tls'} 
                                                onValueChange={(v) => updateFormData('smtp_encryption', v)}
                                            >
                                                <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="tls">TLS (Recommended)</SelectItem>
                                                    <SelectItem value="ssl">SSL</SelectItem>
                                                    <SelectItem value="none">None</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="flex justify-end gap-3 pt-4">
                                {formData.email_notifications && (
                                    <Button variant="outline" onClick={handleTestSmtp} disabled={isTesting}>
                                        {isTesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <TestTube className="mr-2 h-4 w-4" />}
                                        Test Connection
                                    </Button>
                                )}
                                <Button className="gradient-primary" onClick={() => handleSave('Email')} disabled={isSaving}>
                                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Save Email Settings
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SMS Settings */}
                <TabsContent value="sms" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-primary" />
                                <CardTitle>SMS Notifications</CardTitle>
                            </div>
                            <CardDescription>Enable and configure SMS notifications</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Enable SMS Notifications</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Send alerts, reminders, and OTPs via SMS
                                    </p>
                                </div>
                                <Switch 
                                    checked={formData.sms_notifications || false} 
                                    onCheckedChange={(v) => updateFormData('sms_notifications', v)} 
                                />
                            </div>

                            {formData.sms_notifications && (
                                <>
                                    <Separator />
                                    <div className="space-y-4">
                                        <h4 className="font-medium flex items-center gap-2">
                                            <Smartphone className="h-4 w-4" />
                                            SMS Gateway Configuration
                                        </h4>
                                        <div className="space-y-2">
                                            <Label>SMS Provider *</Label>
                                            <Select 
                                                value={formData.sms_provider || ''} 
                                                onValueChange={(v) => updateFormData('sms_provider', v)}
                                            >
                                                <SelectTrigger className="w-64"><SelectValue placeholder="Select provider" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="twilio">Twilio</SelectItem>
                                                    <SelectItem value="nexmo">Nexmo (Vonage)</SelectItem>
                                                    <SelectItem value="zong">Zong SMS (Pakistan)</SelectItem>
                                                    <SelectItem value="jazz">Jazz SMS (Pakistan)</SelectItem>
                                                    <SelectItem value="telenor">Telenor SMS (Pakistan)</SelectItem>
                                                    <SelectItem value="custom">Custom HTTP API</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label>API Key / Username *</Label>
                                                <Input 
                                                    placeholder="Your SMS API key"
                                                    value={formData.sms_api_key || ''}
                                                    onChange={(e) => updateFormData('sms_api_key', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>API Secret / Password</Label>
                                                <div className="flex gap-2">
                                                    <Input 
                                                        type={showSmsSecret ? 'text' : 'password'}
                                                        placeholder="Your SMS API secret"
                                                        value={formData.sms_api_secret || ''}
                                                        onChange={(e) => updateFormData('sms_api_secret', e.target.value)}
                                                    />
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        onClick={() => setShowSmsSecret(!showSmsSecret)}
                                                    >
                                                        {showSmsSecret ? 'Hide' : 'Show'}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label>Sender ID *</Label>
                                                <Input 
                                                    placeholder="SCHOOLERP"
                                                    value={formData.sms_sender_id || ''}
                                                    onChange={(e) => updateFormData('sms_sender_id', e.target.value)}
                                                />
                                                <p className="text-xs text-muted-foreground">Appears as sender name in SMS</p>
                                            </div>
                                            {formData.sms_provider === 'twilio' && (
                                                <div className="space-y-2">
                                                    <Label>Account SID (Twilio)</Label>
                                                    <Input 
                                                        placeholder="ACxxxxxxxx"
                                                        value={formData.sms_account_sid || ''}
                                                        onChange={(e) => updateFormData('sms_account_sid', e.target.value)}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="flex justify-end gap-3 pt-4">
                                {formData.sms_notifications && (
                                    <Button variant="outline" onClick={handleTestSms} disabled={isTesting}>
                                        {isTesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <TestTube className="mr-2 h-4 w-4" />}
                                        Test SMS
                                    </Button>
                                )}
                                <Button className="gradient-primary" onClick={() => handleSave('SMS')} disabled={isSaving}>
                                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Save SMS Settings
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security Settings */}
                <TabsContent value="security" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-primary" />
                                <CardTitle>Security Settings</CardTitle>
                            </div>
                            <CardDescription>Configure authentication and security policies</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Two-Factor Authentication</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Require 2FA for admin accounts
                                    </p>
                                </div>
                                <Switch 
                                    checked={formData.two_factor_auth || false} 
                                    onCheckedChange={(v) => updateFormData('two_factor_auth', v)} 
                                />
                            </div>
                            <Separator />
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Session Timeout</Label>
                                    <Select 
                                        value={String(formData.session_timeout_minutes || 30)} 
                                        onValueChange={(v) => updateFormData('session_timeout_minutes', parseInt(v))}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="15">15 minutes</SelectItem>
                                            <SelectItem value="30">30 minutes</SelectItem>
                                            <SelectItem value="60">1 hour</SelectItem>
                                            <SelectItem value="120">2 hours</SelectItem>
                                            <SelectItem value="480">8 hours</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Password Policy</Label>
                                    <Select 
                                        value={formData.password_policy || 'strong'} 
                                        onValueChange={(v) => updateFormData('password_policy', v)}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="basic">Basic (8+ characters)</SelectItem>
                                            <SelectItem value="medium">Medium (8+ with numbers)</SelectItem>
                                            <SelectItem value="strong">Strong (8+ with symbols)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Max Login Attempts</Label>
                                    <Input 
                                        type="number"
                                        value={formData.max_login_attempts || 5}
                                        onChange={(e) => updateFormData('max_login_attempts', parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Lockout Duration (minutes)</Label>
                                    <Input 
                                        type="number"
                                        value={formData.lockout_duration_minutes || 15}
                                        onChange={(e) => updateFormData('lockout_duration_minutes', parseInt(e.target.value))}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button className="gradient-primary" onClick={() => handleSave('Security')} disabled={isSaving}>
                                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Save Security Settings
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Key className="h-5 w-5 text-primary" />
                                <CardTitle>API Keys</CardTitle>
                            </div>
                            <CardDescription>Manage API access keys for integrations</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="rounded-lg border p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Production API Key</p>
                                        <p className="text-sm text-muted-foreground font-mono">
                                            {showProdKey ? (formData.api_key_production || 'Not generated') : (formData.api_key_production ? 'pk_live_****************************' : 'Not generated')}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => setShowProdKey(!showProdKey)}>
                                            {showProdKey ? 'Hide' : 'Show'}
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => generateApiKey('production')}>
                                            {formData.api_key_production ? 'Regenerate' : 'Generate'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-lg border p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Test API Key</p>
                                        <p className="text-sm text-muted-foreground font-mono">
                                            {showTestKey ? (formData.api_key_test || 'Not generated') : (formData.api_key_test ? 'pk_test_****************************' : 'Not generated')}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => setShowTestKey(!showTestKey)}>
                                            {showTestKey ? 'Hide' : 'Show'}
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => generateApiKey('test')}>
                                            {formData.api_key_test ? 'Regenerate' : 'Generate'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end pt-2">
                                <Button className="gradient-primary" onClick={() => handleSave('API Keys')} disabled={isSaving}>
                                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Save API Keys
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Billing Settings */}
                <TabsContent value="billing" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-primary" />
                                <CardTitle>Payment Gateway</CardTitle>
                            </div>
                            <CardDescription>Configure payment processing for subscriptions</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Active Payment Gateway</Label>
                                <Select 
                                    value={formData.payment_gateway || 'manual'} 
                                    onValueChange={(v) => updateFormData('payment_gateway', v)}
                                >
                                    <SelectTrigger className="w-64"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="manual">Manual / Bank Transfer</SelectItem>
                                        <SelectItem value="jazzcash">JazzCash</SelectItem>
                                        <SelectItem value="easypaisa">Easypaisa</SelectItem>
                                        <SelectItem value="stripe">Stripe</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {formData.payment_gateway !== 'manual' && (
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Merchant ID</Label>
                                        <Input 
                                            placeholder="Enter merchant ID"
                                            value={formData.payment_merchant_id || ''}
                                            onChange={(e) => updateFormData('payment_merchant_id', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Secret Key</Label>
                                        <Input 
                                            type="password"
                                            placeholder="Enter secret key"
                                            value={formData.payment_secret_key || ''}
                                            onChange={(e) => updateFormData('payment_secret_key', e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}
                            <Separator />
                            <div className="space-y-4">
                                <Label className="text-base">Subscription Plan Pricing (PKR/year)</Label>
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="space-y-2 rounded-lg border p-4">
                                        <Label>Basic Plan</Label>
                                        <Input 
                                            type="number"
                                            value={formData.plan_basic_price || 40000}
                                            onChange={(e) => updateFormData('plan_basic_price', parseInt(e.target.value))}
                                        />
                                    </div>
                                    <div className="space-y-2 rounded-lg border p-4">
                                        <Label>Standard Plan</Label>
                                        <Input 
                                            type="number"
                                            value={formData.plan_standard_price || 80000}
                                            onChange={(e) => updateFormData('plan_standard_price', parseInt(e.target.value))}
                                        />
                                    </div>
                                    <div className="space-y-2 rounded-lg border p-4">
                                        <Label>Premium Plan</Label>
                                        <Input 
                                            type="number"
                                            value={formData.plan_premium_price || 150000}
                                            onChange={(e) => updateFormData('plan_premium_price', parseInt(e.target.value))}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Trial Period (days)</Label>
                                <Input 
                                    type="number"
                                    className="w-32"
                                    value={formData.trial_days || 30}
                                    onChange={(e) => updateFormData('trial_days', parseInt(e.target.value))}
                                />
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button className="gradient-primary" onClick={() => handleSave('Billing')} disabled={isSaving}>
                                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Save Billing Settings
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* System Settings */}
                <TabsContent value="system" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Database className="h-5 w-5 text-primary" />
                                <CardTitle>Database & Backup</CardTitle>
                            </div>
                            <CardDescription>System maintenance settings</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Automatic Daily Backup</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Backup database every day at 2:00 AM PKT
                                    </p>
                                </div>
                                <Switch 
                                    checked={formData.auto_backup || false} 
                                    onCheckedChange={(v) => updateFormData('auto_backup', v)} 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Backup Retention</Label>
                                <Select 
                                    value={String(formData.backup_retention_days || 30)} 
                                    onValueChange={(v) => updateFormData('backup_retention_days', parseInt(v))}
                                >
                                    <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="7">7 days</SelectItem>
                                        <SelectItem value="14">14 days</SelectItem>
                                        <SelectItem value="30">30 days</SelectItem>
                                        <SelectItem value="90">90 days</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button className="gradient-primary" onClick={() => handleSave('Backup')} disabled={isSaving}>
                                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Save Backup Settings
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Globe className="h-5 w-5 text-primary" />
                                <CardTitle>Maintenance Mode</CardTitle>
                            </div>
                            <CardDescription>Take the platform offline for maintenance</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                        Enable Maintenance Mode
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Users will see a maintenance page and cannot access the platform
                                    </p>
                                </div>
                                <Switch
                                    checked={formData.maintenance_mode || false}
                                    onCheckedChange={(v) => updateFormData('maintenance_mode', v)}
                                />
                            </div>
                            {formData.maintenance_mode && (
                                <div className="space-y-2">
                                    <Label>Maintenance Message</Label>
                                    <Input
                                        value={formData.maintenance_message || ''}
                                        onChange={(e) => updateFormData('maintenance_message', e.target.value)}
                                        placeholder="We are performing scheduled maintenance. Please check back soon."
                                    />
                                </div>
                            )}
                            <div className="flex justify-end pt-4">
                                <Button className="gradient-primary" onClick={() => handleSave('System')} disabled={isSaving}>
                                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Save System Settings
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
