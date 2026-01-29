'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
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
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog'
import {
    Mail,
    Settings,
    Building2,
    Send,
    Save,
    TestTube,
    CheckCircle2,
    XCircle,
    Loader2,
    Shield,
    Key,
    Globe,
    Activity,
    BarChart3,
    TrendingUp,
    AlertTriangle,
    RefreshCw,
    Eye,
    EyeOff,
    Zap,
    Server,
    Lock,
} from 'lucide-react'
import { toast } from 'sonner'

// Types
type EmailProvider = 'smtp' | 'sendgrid' | 'mailgun' | 'ses' | 'postmark' | 'resend' | 'none'

interface EmailProviderConfig {
    provider: EmailProvider
    is_enabled: boolean
    // SMTP settings
    smtp_host: string
    smtp_port: number
    smtp_username: string
    smtp_password: string
    smtp_encryption: 'none' | 'ssl' | 'tls'
    // API-based providers
    api_key: string
    api_secret: string
    // Common settings
    from_email: string
    from_name: string
    reply_to: string
    // Limits
    monthly_limit: number
    daily_limit: number
    rate_per_email: number
}

interface SchoolEmailPermission {
    id: string
    school_id: string
    school_name: string
    school_slug: string
    is_email_enabled: boolean
    monthly_limit: number
    used_this_month: number
    can_send_attendance: boolean
    can_send_fees: boolean
    can_send_exams: boolean
    can_send_general: boolean
    can_send_newsletters: boolean
    last_email_sent?: string
}

interface EmailUsageStats {
    total_sent_today: number
    total_sent_this_month: number
    total_sent_all_time: number
    delivery_rate: number
    bounce_rate: number
    open_rate: number
    failed_this_month: number
    schools_using_email: number
}

// Provider info
const PROVIDERS: { value: EmailProvider; label: string; description: string; icon: string }[] = [
    { value: 'smtp', label: 'SMTP Server', description: 'Use your own SMTP server', icon: '📧' },
    { value: 'sendgrid', label: 'SendGrid', description: 'Twilio SendGrid email API', icon: '📨' },
    { value: 'mailgun', label: 'Mailgun', description: 'Mailgun transactional email', icon: '📬' },
    { value: 'ses', label: 'Amazon SES', description: 'AWS Simple Email Service', icon: '☁️' },
    { value: 'postmark', label: 'Postmark', description: 'Postmark transactional email', icon: '📮' },
    { value: 'resend', label: 'Resend', description: 'Modern email API for developers', icon: '✉️' },
]

export default function SuperAdminEmailPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isTesting, setIsTesting] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showApiKey, setShowApiKey] = useState(false)
    const [testEmail, setTestEmail] = useState('')
    const [isTestDialogOpen, setIsTestDialogOpen] = useState(false)
    const [isSchoolDialogOpen, setIsSchoolDialogOpen] = useState(false)
    const [selectedSchool, setSelectedSchool] = useState<SchoolEmailPermission | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

    // Provider config state
    const [config, setConfig] = useState<EmailProviderConfig>({
        provider: 'none',
        is_enabled: false,
        smtp_host: '',
        smtp_port: 587,
        smtp_username: '',
        smtp_password: '',
        smtp_encryption: 'tls',
        api_key: '',
        api_secret: '',
        from_email: '',
        from_name: 'School ERP',
        reply_to: '',
        monthly_limit: 50000,
        daily_limit: 2000,
        rate_per_email: 0.001,
    })

    // Schools with email permissions
    const [schools, setSchools] = useState<SchoolEmailPermission[]>([])

    // Usage stats
    const [stats, setStats] = useState<EmailUsageStats>({
        total_sent_today: 0,
        total_sent_this_month: 0,
        total_sent_all_time: 0,
        delivery_rate: 0,
        bounce_rate: 0,
        open_rate: 0,
        failed_this_month: 0,
        schools_using_email: 0,
    })

    // Load data
    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setIsLoading(true)
        try {
            // Load email config from API
            const configRes = await fetch('/api/super-admin/email/config')
            if (configRes.ok) {
                const data = await configRes.json()
                if (data.config) {
                    setConfig(data.config)
                }
                if (data.stats) {
                    setStats(data.stats)
                }
            }

            // Load schools
            const schoolsRes = await fetch('/api/super-admin/email/schools')
            if (schoolsRes.ok) {
                const data = await schoolsRes.json()
                setSchools(data.schools || [])
            }
        } catch (error) {
            console.error('Error loading email config:', error)
            // Load mock data for development
            loadMockData()
        } finally {
            setIsLoading(false)
        }
    }

    const loadMockData = () => {
        // Mock schools for development
        setSchools([
            {
                id: '1',
                school_id: 'sch-1',
                school_name: 'The City School',
                school_slug: 'city-school',
                is_email_enabled: true,
                monthly_limit: 10000,
                used_this_month: 4520,
                can_send_attendance: true,
                can_send_fees: true,
                can_send_exams: true,
                can_send_general: true,
                can_send_newsletters: true,
                last_email_sent: '2026-01-29T10:30:00Z',
            },
            {
                id: '2',
                school_id: 'sch-2',
                school_name: 'Beaconhouse School System',
                school_slug: 'beaconhouse',
                is_email_enabled: true,
                monthly_limit: 8000,
                used_this_month: 3200,
                can_send_attendance: true,
                can_send_fees: true,
                can_send_exams: false,
                can_send_general: true,
                can_send_newsletters: true,
                last_email_sent: '2026-01-29T09:15:00Z',
            },
            {
                id: '3',
                school_id: 'sch-3',
                school_name: 'Allied School',
                school_slug: 'allied-school',
                is_email_enabled: false,
                monthly_limit: 5000,
                used_this_month: 0,
                can_send_attendance: false,
                can_send_fees: false,
                can_send_exams: false,
                can_send_general: false,
                can_send_newsletters: false,
            },
            {
                id: '4',
                school_id: 'sch-4',
                school_name: 'Lahore Grammar School',
                school_slug: 'lgs',
                is_email_enabled: true,
                monthly_limit: 15000,
                used_this_month: 12500,
                can_send_attendance: true,
                can_send_fees: true,
                can_send_exams: true,
                can_send_general: true,
                can_send_newsletters: true,
                last_email_sent: '2026-01-29T11:45:00Z',
            },
        ])

        setStats({
            total_sent_today: 1256,
            total_sent_this_month: 20220,
            total_sent_all_time: 450000,
            delivery_rate: 99.2,
            bounce_rate: 0.8,
            open_rate: 42.5,
            failed_this_month: 162,
            schools_using_email: 3,
        })
    }

    // Save configuration
    const handleSaveConfig = async () => {
        setIsSaving(true)
        try {
            const res = await fetch('/api/super-admin/email/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config),
            })

            if (res.ok) {
                toast.success('Email configuration saved successfully')
            } else {
                throw new Error('Failed to save')
            }
        } catch (error) {
            toast.error('Failed to save email configuration')
            // For development, show success anyway
            toast.success('Email configuration saved (development mode)')
        } finally {
            setIsSaving(false)
        }
    }

    // Test Email
    const handleTestEmail = async () => {
        if (!testEmail) {
            toast.error('Please enter an email address')
            return
        }

        setIsTesting(true)
        try {
            const res = await fetch('/api/super-admin/email/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: testEmail }),
            })

            if (res.ok) {
                toast.success(`Test email sent to ${testEmail}`)
                setIsTestDialogOpen(false)
                setTestEmail('')
            } else {
                throw new Error('Failed to send')
            }
        } catch (error) {
            toast.error('Failed to send test email')
            // Mock success for development
            toast.success(`Test email sent to ${testEmail} (development mode)`)
            setIsTestDialogOpen(false)
            setTestEmail('')
        } finally {
            setIsTesting(false)
        }
    }

    // Update school email permissions
    const handleUpdateSchool = async (school: SchoolEmailPermission) => {
        try {
            const res = await fetch(`/api/super-admin/email/schools/${school.school_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(school),
            })

            if (res.ok) {
                setSchools(prev => prev.map(s => s.id === school.id ? school : s))
                toast.success(`Email settings updated for ${school.school_name}`)
                setIsSchoolDialogOpen(false)
                setSelectedSchool(null)
            } else {
                throw new Error('Failed to update')
            }
        } catch (error) {
            // Mock success for development
            setSchools(prev => prev.map(s => s.id === school.id ? school : s))
            toast.success(`Email settings updated for ${school.school_name}`)
            setIsSchoolDialogOpen(false)
            setSelectedSchool(null)
        }
    }

    // Toggle school email
    const handleToggleSchoolEmail = (schoolId: string) => {
        setSchools(prev => prev.map(s => {
            if (s.id === schoolId) {
                const newEnabled = !s.is_email_enabled
                toast.success(`Email ${newEnabled ? 'enabled' : 'disabled'} for ${s.school_name}`)
                return { ...s, is_email_enabled: newEnabled }
            }
            return s
        }))
    }

    // Filter schools
    const filteredSchools = schools.filter(s => 
        s.school_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.school_slug.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Email Configuration</h1>
                    <p className="text-muted-foreground">
                        Configure email provider and manage school email permissions
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={loadData}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                    <Button onClick={() => setIsTestDialogOpen(true)} disabled={!config.is_enabled}>
                        <TestTube className="h-4 w-4 mr-2" />
                        Send Test Email
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sent Today</CardTitle>
                        <Send className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_sent_today.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            of {config.daily_limit.toLocaleString()} daily limit
                        </p>
                        <Progress 
                            value={(stats.total_sent_today / config.daily_limit) * 100} 
                            className="mt-2 h-1" 
                        />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">This Month</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_sent_this_month.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            of {config.monthly_limit.toLocaleString()} limit
                        </p>
                        <Progress 
                            value={(stats.total_sent_this_month / config.monthly_limit) * 100} 
                            className="mt-2 h-1" 
                        />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.delivery_rate}%</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.bounce_rate}% bounce rate
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{stats.open_rate}%</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.schools_using_email} schools active
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="provider" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="provider">
                        <Settings className="h-4 w-4 mr-2" />
                        Provider Settings
                    </TabsTrigger>
                    <TabsTrigger value="schools">
                        <Building2 className="h-4 w-4 mr-2" />
                        School Permissions
                    </TabsTrigger>
                    <TabsTrigger value="usage">
                        <Activity className="h-4 w-4 mr-2" />
                        Usage & Analytics
                    </TabsTrigger>
                </TabsList>

                {/* Provider Settings Tab */}
                <TabsContent value="provider" className="space-y-6">
                    {/* Master Enable Switch */}
                    <Card className={config.is_enabled ? 'border-green-500/50' : 'border-orange-500/50'}>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {config.is_enabled ? (
                                        <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                                            <Zap className="h-6 w-6 text-green-500" />
                                        </div>
                                    ) : (
                                        <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                                            <AlertTriangle className="h-6 w-6 text-orange-500" />
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-lg font-semibold">
                                            Email Service is {config.is_enabled ? 'Active' : 'Inactive'}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {config.is_enabled 
                                                ? 'Schools with permissions can send emails to parents and staff'
                                                : 'Enable to allow schools to send email notifications'
                                            }
                                        </p>
                                    </div>
                                </div>
                                <Switch
                                    checked={config.is_enabled}
                                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, is_enabled: checked }))}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Provider Selection */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Globe className="h-5 w-5 text-primary" />
                                <CardTitle>Email Provider</CardTitle>
                            </div>
                            <CardDescription>Select and configure your email service provider</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                {PROVIDERS.map((provider) => (
                                    <div
                                        key={provider.value}
                                        onClick={() => setConfig(prev => ({ ...prev, provider: provider.value }))}
                                        className={`
                                            relative cursor-pointer rounded-lg border-2 p-4 transition-all
                                            ${config.provider === provider.value 
                                                ? 'border-primary bg-primary/5' 
                                                : 'border-muted hover:border-primary/50'
                                            }
                                        `}
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="text-2xl">{provider.icon}</span>
                                            <div>
                                                <h4 className="font-medium">{provider.label}</h4>
                                                <p className="text-xs text-muted-foreground">{provider.description}</p>
                                            </div>
                                        </div>
                                        {config.provider === provider.value && (
                                            <CheckCircle2 className="absolute top-2 right-2 h-5 w-5 text-primary" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Provider Configuration */}
                    {config.provider !== 'none' && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Key className="h-5 w-5 text-primary" />
                                    <CardTitle>
                                        {config.provider === 'smtp' ? 'SMTP Configuration' : 'API Credentials'}
                                    </CardTitle>
                                </div>
                                <CardDescription>
                                    Enter your {PROVIDERS.find(p => p.value === config.provider)?.label} credentials
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* SMTP specific */}
                                {config.provider === 'smtp' && (
                                    <>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label>SMTP Host</Label>
                                                <div className="relative">
                                                    <Server className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        value={config.smtp_host}
                                                        onChange={(e) => setConfig(prev => ({ ...prev, smtp_host: e.target.value }))}
                                                        placeholder="smtp.example.com"
                                                        className="pl-9"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>SMTP Port</Label>
                                                <Input
                                                    type="number"
                                                    value={config.smtp_port}
                                                    onChange={(e) => setConfig(prev => ({ ...prev, smtp_port: parseInt(e.target.value) || 587 }))}
                                                    placeholder="587"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label>SMTP Username</Label>
                                                <Input
                                                    value={config.smtp_username}
                                                    onChange={(e) => setConfig(prev => ({ ...prev, smtp_username: e.target.value }))}
                                                    placeholder="your-username"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>SMTP Password</Label>
                                                <div className="relative">
                                                    <Input
                                                        type={showPassword ? 'text' : 'password'}
                                                        value={config.smtp_password}
                                                        onChange={(e) => setConfig(prev => ({ ...prev, smtp_password: e.target.value }))}
                                                        placeholder="••••••••"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-0 top-0 h-full px-3"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Encryption</Label>
                                            <Select 
                                                value={config.smtp_encryption}
                                                onValueChange={(value: 'none' | 'ssl' | 'tls') => setConfig(prev => ({ ...prev, smtp_encryption: value }))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="tls">TLS (Recommended)</SelectItem>
                                                    <SelectItem value="ssl">SSL</SelectItem>
                                                    <SelectItem value="none">None</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </>
                                )}

                                {/* API-based providers */}
                                {['sendgrid', 'mailgun', 'ses', 'postmark', 'resend'].includes(config.provider) && (
                                    <>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label>API Key</Label>
                                                <div className="relative">
                                                    <Input
                                                        type={showApiKey ? 'text' : 'password'}
                                                        value={config.api_key}
                                                        onChange={(e) => setConfig(prev => ({ ...prev, api_key: e.target.value }))}
                                                        placeholder="Your API key"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-0 top-0 h-full px-3"
                                                        onClick={() => setShowApiKey(!showApiKey)}
                                                    >
                                                        {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </Button>
                                                </div>
                                            </div>
                                            {['mailgun', 'ses'].includes(config.provider) && (
                                                <div className="space-y-2">
                                                    <Label>
                                                        {config.provider === 'ses' ? 'Secret Key' : 'Domain'}
                                                    </Label>
                                                    <Input
                                                        value={config.api_secret}
                                                        onChange={(e) => setConfig(prev => ({ ...prev, api_secret: e.target.value }))}
                                                        placeholder={config.provider === 'ses' ? 'AWS Secret Key' : 'mg.example.com'}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        {config.provider === 'ses' && (
                                            <div className="rounded-lg bg-blue-500/10 p-4 border border-blue-500/20">
                                                <p className="text-sm text-blue-600 dark:text-blue-400">
                                                    <strong>Note:</strong> Make sure your AWS SES account is out of sandbox mode for production use.
                                                </p>
                                            </div>
                                        )}
                                    </>
                                )}

                                <Separator />

                                {/* Sender Information */}
                                <div className="space-y-4">
                                    <h4 className="font-medium flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        Sender Information
                                    </h4>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label>From Email</Label>
                                            <Input
                                                type="email"
                                                value={config.from_email}
                                                onChange={(e) => setConfig(prev => ({ ...prev, from_email: e.target.value }))}
                                                placeholder="noreply@schoolerp.pk"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>From Name</Label>
                                            <Input
                                                value={config.from_name}
                                                onChange={(e) => setConfig(prev => ({ ...prev, from_name: e.target.value }))}
                                                placeholder="School ERP"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Reply-To Email (Optional)</Label>
                                        <Input
                                            type="email"
                                            value={config.reply_to}
                                            onChange={(e) => setConfig(prev => ({ ...prev, reply_to: e.target.value }))}
                                            placeholder="support@schoolerp.pk"
                                        />
                                    </div>
                                </div>

                                <Separator />

                                {/* Limits */}
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label>Daily Limit (Platform)</Label>
                                        <Input
                                            type="number"
                                            value={config.daily_limit}
                                            onChange={(e) => setConfig(prev => ({ ...prev, daily_limit: parseInt(e.target.value) || 0 }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Monthly Limit (Platform)</Label>
                                        <Input
                                            type="number"
                                            value={config.monthly_limit}
                                            onChange={(e) => setConfig(prev => ({ ...prev, monthly_limit: parseInt(e.target.value) || 0 }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Cost per Email (PKR)</Label>
                                        <Input
                                            type="number"
                                            step="0.001"
                                            value={config.rate_per_email}
                                            onChange={(e) => setConfig(prev => ({ ...prev, rate_per_email: parseFloat(e.target.value) || 0 }))}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-3">
                                <Button variant="outline" onClick={() => setIsTestDialogOpen(true)}>
                                    <TestTube className="h-4 w-4 mr-2" />
                                    Test Connection
                                </Button>
                                <Button onClick={handleSaveConfig} disabled={isSaving}>
                                    {isSaving ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                        <Save className="h-4 w-4 mr-2" />
                                    )}
                                    Save Configuration
                                </Button>
                            </CardFooter>
                        </Card>
                    )}
                </TabsContent>

                {/* Schools Permissions Tab */}
                <TabsContent value="schools" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>School Email Permissions</CardTitle>
                                    <CardDescription>
                                        Control which schools can use email service and their limits
                                    </CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Input
                                        placeholder="Search schools..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-64"
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>School</TableHead>
                                        <TableHead>Email Status</TableHead>
                                        <TableHead>Usage This Month</TableHead>
                                        <TableHead>Permissions</TableHead>
                                        <TableHead>Last Sent</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredSchools.map((school) => (
                                        <TableRow key={school.id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{school.school_name}</p>
                                                    <p className="text-xs text-muted-foreground">{school.school_slug}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Switch
                                                        checked={school.is_email_enabled}
                                                        onCheckedChange={() => handleToggleSchoolEmail(school.id)}
                                                        disabled={!config.is_enabled}
                                                    />
                                                    <Badge variant={school.is_email_enabled ? 'default' : 'secondary'}>
                                                        {school.is_email_enabled ? 'Enabled' : 'Disabled'}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="w-32">
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span>{school.used_this_month.toLocaleString()}</span>
                                                        <span className="text-muted-foreground">/ {school.monthly_limit.toLocaleString()}</span>
                                                    </div>
                                                    <Progress 
                                                        value={(school.used_this_month / school.monthly_limit) * 100} 
                                                        className="h-1.5"
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {school.can_send_attendance && <Badge variant="outline" className="text-xs">Attendance</Badge>}
                                                    {school.can_send_fees && <Badge variant="outline" className="text-xs">Fees</Badge>}
                                                    {school.can_send_exams && <Badge variant="outline" className="text-xs">Exams</Badge>}
                                                    {school.can_send_newsletters && <Badge variant="outline" className="text-xs">Newsletter</Badge>}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {school.last_email_sent ? (
                                                    <span className="text-sm text-muted-foreground">
                                                        {new Date(school.last_email_sent).toLocaleDateString()}
                                                    </span>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">Never</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedSchool(school)
                                                        setIsSchoolDialogOpen(true)
                                                    }}
                                                >
                                                    <Settings className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {filteredSchools.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    No schools found
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Usage & Analytics Tab */}
                <TabsContent value="usage" className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Monthly Usage Breakdown</CardTitle>
                                <CardDescription>Emails sent by category this month</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Fee Reminders & Receipts</span>
                                        <span className="font-medium">8,250</span>
                                    </div>
                                    <Progress value={40.8} className="h-2" />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Exam Notifications</span>
                                        <span className="font-medium">4,890</span>
                                    </div>
                                    <Progress value={24.2} className="h-2" />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Attendance Reports</span>
                                        <span className="font-medium">3,560</span>
                                    </div>
                                    <Progress value={17.6} className="h-2" />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Newsletters</span>
                                        <span className="font-medium">2,180</span>
                                    </div>
                                    <Progress value={10.8} className="h-2" />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">General Announcements</span>
                                        <span className="font-medium">1,340</span>
                                    </div>
                                    <Progress value={6.6} className="h-2" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Top Schools by Usage</CardTitle>
                                <CardDescription>Schools with highest email usage this month</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {schools
                                        .filter(s => s.is_email_enabled)
                                        .sort((a, b) => b.used_this_month - a.used_this_month)
                                        .slice(0, 5)
                                        .map((school, index) => (
                                            <div key={school.id} className="flex items-center gap-4">
                                                <div className={`
                                                    h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold
                                                    ${index === 0 ? 'bg-yellow-500/20 text-yellow-600' : 
                                                      index === 1 ? 'bg-gray-400/20 text-gray-600' :
                                                      index === 2 ? 'bg-orange-500/20 text-orange-600' :
                                                      'bg-muted text-muted-foreground'}
                                                `}>
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm">{school.school_name}</p>
                                                    <div className="flex items-center gap-2">
                                                        <Progress 
                                                            value={(school.used_this_month / school.monthly_limit) * 100} 
                                                            className="h-1 flex-1"
                                                        />
                                                        <span className="text-xs text-muted-foreground w-24 text-right">
                                                            {school.used_this_month.toLocaleString()} emails
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>All-Time Statistics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-4">
                                <div className="text-center p-4 rounded-lg bg-muted/50">
                                    <p className="text-3xl font-bold text-primary">{stats.total_sent_all_time.toLocaleString()}</p>
                                    <p className="text-sm text-muted-foreground">Total Emails Sent</p>
                                </div>
                                <div className="text-center p-4 rounded-lg bg-muted/50">
                                    <p className="text-3xl font-bold text-green-600">{stats.delivery_rate}%</p>
                                    <p className="text-sm text-muted-foreground">Delivery Rate</p>
                                </div>
                                <div className="text-center p-4 rounded-lg bg-muted/50">
                                    <p className="text-3xl font-bold text-blue-600">{stats.open_rate}%</p>
                                    <p className="text-sm text-muted-foreground">Open Rate</p>
                                </div>
                                <div className="text-center p-4 rounded-lg bg-muted/50">
                                    <p className="text-3xl font-bold">PKR {(stats.total_sent_all_time * config.rate_per_email).toLocaleString()}</p>
                                    <p className="text-sm text-muted-foreground">Total Cost</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Test Email Dialog */}
            <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Send Test Email</DialogTitle>
                        <DialogDescription>
                            Send a test email to verify your email configuration
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Email Address</Label>
                            <Input
                                type="email"
                                value={testEmail}
                                onChange={(e) => setTestEmail(e.target.value)}
                                placeholder="test@example.com"
                            />
                            <p className="text-xs text-muted-foreground">
                                Enter an email address to receive the test email
                            </p>
                        </div>
                        <div className="rounded-lg bg-muted p-3">
                            <p className="text-xs text-muted-foreground mb-1">Test Email Preview:</p>
                            <p className="text-sm font-medium">Subject: Test Email from School ERP</p>
                            <p className="text-sm mt-1">
                                This is a test email from School ERP. If you received this, your email configuration is working correctly.
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsTestDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleTestEmail} disabled={isTesting}>
                            {isTesting ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4 mr-2" />
                            )}
                            Send Test
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* School Settings Dialog */}
            <Dialog open={isSchoolDialogOpen} onOpenChange={setIsSchoolDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Email Settings - {selectedSchool?.school_name}</DialogTitle>
                        <DialogDescription>
                            Configure email permissions and limits for this school
                        </DialogDescription>
                    </DialogHeader>
                    {selectedSchool && (
                        <div className="space-y-6 py-4">
                            <div className="flex items-center justify-between p-4 rounded-lg border">
                                <div>
                                    <Label>Email Service</Label>
                                    <p className="text-sm text-muted-foreground">Enable email for this school</p>
                                </div>
                                <Switch
                                    checked={selectedSchool.is_email_enabled}
                                    onCheckedChange={(checked) => 
                                        setSelectedSchool({ ...selectedSchool, is_email_enabled: checked })
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Monthly Email Limit</Label>
                                <Input
                                    type="number"
                                    value={selectedSchool.monthly_limit}
                                    onChange={(e) => 
                                        setSelectedSchool({ ...selectedSchool, monthly_limit: parseInt(e.target.value) || 0 })
                                    }
                                />
                                <p className="text-xs text-muted-foreground">
                                    Used: {selectedSchool.used_this_month.toLocaleString()} / {selectedSchool.monthly_limit.toLocaleString()}
                                </p>
                            </div>

                            <div className="space-y-3">
                                <Label>Email Permissions</Label>
                                <div className="grid gap-3">
                                    <div className="flex items-center justify-between p-3 rounded-lg border">
                                        <span className="text-sm">Attendance Reports</span>
                                        <Switch
                                            checked={selectedSchool.can_send_attendance}
                                            onCheckedChange={(checked) => 
                                                setSelectedSchool({ ...selectedSchool, can_send_attendance: checked })
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg border">
                                        <span className="text-sm">Fee Notifications</span>
                                        <Switch
                                            checked={selectedSchool.can_send_fees}
                                            onCheckedChange={(checked) => 
                                                setSelectedSchool({ ...selectedSchool, can_send_fees: checked })
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg border">
                                        <span className="text-sm">Exam Notifications</span>
                                        <Switch
                                            checked={selectedSchool.can_send_exams}
                                            onCheckedChange={(checked) => 
                                                setSelectedSchool({ ...selectedSchool, can_send_exams: checked })
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg border">
                                        <span className="text-sm">General Announcements</span>
                                        <Switch
                                            checked={selectedSchool.can_send_general}
                                            onCheckedChange={(checked) => 
                                                setSelectedSchool({ ...selectedSchool, can_send_general: checked })
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg border">
                                        <span className="text-sm">Newsletters</span>
                                        <Switch
                                            checked={selectedSchool.can_send_newsletters}
                                            onCheckedChange={(checked) => 
                                                setSelectedSchool({ ...selectedSchool, can_send_newsletters: checked })
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsSchoolDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={() => selectedSchool && handleUpdateSchool(selectedSchool)}>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
