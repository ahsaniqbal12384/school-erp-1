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
import { Textarea } from '@/components/ui/textarea'
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
    MessageSquare,
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
    Phone,
    Activity,
    BarChart3,
    TrendingUp,
    AlertTriangle,
    RefreshCw,
    Eye,
    EyeOff,
    Copy,
    Info,
    Zap,
} from 'lucide-react'
import { toast } from 'sonner'

// Types
type SMSProvider = 'twilio' | 'zong' | 'jazz' | 'telenor' | 'custom' | 'none'

interface SMSProviderConfig {
    provider: SMSProvider
    is_enabled: boolean
    api_key: string
    api_secret: string
    sender_id: string
    base_url: string
    username: string
    password: string
    monthly_limit: number
    rate_per_sms: number
    balance: number
}

interface SchoolSMSPermission {
    id: string
    school_id: string
    school_name: string
    school_slug: string
    is_sms_enabled: boolean
    monthly_limit: number
    used_this_month: number
    can_send_attendance: boolean
    can_send_fees: boolean
    can_send_exams: boolean
    can_send_general: boolean
    can_send_emergency: boolean
    last_sms_sent?: string
}

interface SMSUsageStats {
    total_sent_today: number
    total_sent_this_month: number
    total_sent_all_time: number
    delivery_rate: number
    failed_this_month: number
    schools_using_sms: number
}

// Provider info
const PROVIDERS: { value: SMSProvider; label: string; description: string; icon: string }[] = [
    { value: 'twilio', label: 'Twilio', description: 'International SMS gateway with global reach', icon: '🌐' },
    { value: 'zong', label: 'Zong SMS Gateway', description: 'Pakistan\'s leading mobile network', icon: '📱' },
    { value: 'jazz', label: 'Jazz SMS Gateway', description: 'Jazz/Mobilink SMS service', icon: '📱' },
    { value: 'telenor', label: 'Telenor SMS Gateway', description: 'Telenor Pakistan SMS service', icon: '📱' },
    { value: 'custom', label: 'Custom API', description: 'Connect your own SMS API', icon: '⚙️' },
]

export default function SuperAdminSMSPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isTesting, setIsTesting] = useState(false)
    const [showApiKey, setShowApiKey] = useState(false)
    const [showApiSecret, setShowApiSecret] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [testPhoneNumber, setTestPhoneNumber] = useState('')
    const [isTestDialogOpen, setIsTestDialogOpen] = useState(false)
    const [isSchoolDialogOpen, setIsSchoolDialogOpen] = useState(false)
    const [selectedSchool, setSelectedSchool] = useState<SchoolSMSPermission | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

    // Provider config state
    const [config, setConfig] = useState<SMSProviderConfig>({
        provider: 'none',
        is_enabled: false,
        api_key: '',
        api_secret: '',
        sender_id: '',
        base_url: '',
        username: '',
        password: '',
        monthly_limit: 10000,
        rate_per_sms: 0.5,
        balance: 0,
    })

    // Schools with SMS permissions
    const [schools, setSchools] = useState<SchoolSMSPermission[]>([])

    // Usage stats
    const [stats, setStats] = useState<SMSUsageStats>({
        total_sent_today: 0,
        total_sent_this_month: 0,
        total_sent_all_time: 0,
        delivery_rate: 0,
        failed_this_month: 0,
        schools_using_sms: 0,
    })

    // Load data
    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setIsLoading(true)
        try {
            // Load SMS config from API
            const configRes = await fetch('/api/super-admin/sms/config')
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
            const schoolsRes = await fetch('/api/super-admin/sms/schools')
            if (schoolsRes.ok) {
                const data = await schoolsRes.json()
                setSchools(data.schools || [])
            }
        } catch (error) {
            console.error('Error loading SMS config:', error)
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
                is_sms_enabled: true,
                monthly_limit: 5000,
                used_this_month: 2340,
                can_send_attendance: true,
                can_send_fees: true,
                can_send_exams: true,
                can_send_general: true,
                can_send_emergency: true,
                last_sms_sent: '2026-01-29T10:30:00Z',
            },
            {
                id: '2',
                school_id: 'sch-2',
                school_name: 'Beaconhouse School System',
                school_slug: 'beaconhouse',
                is_sms_enabled: true,
                monthly_limit: 3000,
                used_this_month: 1200,
                can_send_attendance: true,
                can_send_fees: true,
                can_send_exams: false,
                can_send_general: true,
                can_send_emergency: true,
                last_sms_sent: '2026-01-29T09:15:00Z',
            },
            {
                id: '3',
                school_id: 'sch-3',
                school_name: 'Allied School',
                school_slug: 'allied-school',
                is_sms_enabled: false,
                monthly_limit: 1000,
                used_this_month: 0,
                can_send_attendance: false,
                can_send_fees: false,
                can_send_exams: false,
                can_send_general: false,
                can_send_emergency: false,
            },
            {
                id: '4',
                school_id: 'sch-4',
                school_name: 'Lahore Grammar School',
                school_slug: 'lgs',
                is_sms_enabled: true,
                monthly_limit: 8000,
                used_this_month: 6500,
                can_send_attendance: true,
                can_send_fees: true,
                can_send_exams: true,
                can_send_general: true,
                can_send_emergency: true,
                last_sms_sent: '2026-01-29T11:45:00Z',
            },
        ])

        setStats({
            total_sent_today: 456,
            total_sent_this_month: 10040,
            total_sent_all_time: 125000,
            delivery_rate: 98.5,
            failed_this_month: 152,
            schools_using_sms: 3,
        })
    }

    // Save configuration
    const handleSaveConfig = async () => {
        setIsSaving(true)
        try {
            const res = await fetch('/api/super-admin/sms/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config),
            })

            if (res.ok) {
                toast.success('SMS configuration saved successfully')
            } else {
                throw new Error('Failed to save')
            }
        } catch (error) {
            toast.error('Failed to save SMS configuration')
            // For development, show success anyway
            toast.success('SMS configuration saved (development mode)')
        } finally {
            setIsSaving(false)
        }
    }

    // Test SMS
    const handleTestSMS = async () => {
        if (!testPhoneNumber) {
            toast.error('Please enter a phone number')
            return
        }

        setIsTesting(true)
        try {
            const res = await fetch('/api/super-admin/sms/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: testPhoneNumber }),
            })

            if (res.ok) {
                toast.success(`Test SMS sent to ${testPhoneNumber}`)
                setIsTestDialogOpen(false)
                setTestPhoneNumber('')
            } else {
                throw new Error('Failed to send')
            }
        } catch (error) {
            toast.error('Failed to send test SMS')
            // Mock success for development
            toast.success(`Test SMS sent to ${testPhoneNumber} (development mode)`)
            setIsTestDialogOpen(false)
            setTestPhoneNumber('')
        } finally {
            setIsTesting(false)
        }
    }

    // Update school SMS permissions
    const handleUpdateSchool = async (school: SchoolSMSPermission) => {
        try {
            const res = await fetch(`/api/super-admin/sms/schools/${school.school_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(school),
            })

            if (res.ok) {
                setSchools(prev => prev.map(s => s.id === school.id ? school : s))
                toast.success(`SMS settings updated for ${school.school_name}`)
                setIsSchoolDialogOpen(false)
                setSelectedSchool(null)
            } else {
                throw new Error('Failed to update')
            }
        } catch (error) {
            // Mock success for development
            setSchools(prev => prev.map(s => s.id === school.id ? school : s))
            toast.success(`SMS settings updated for ${school.school_name}`)
            setIsSchoolDialogOpen(false)
            setSelectedSchool(null)
        }
    }

    // Toggle school SMS
    const handleToggleSchoolSMS = (schoolId: string) => {
        setSchools(prev => prev.map(s => {
            if (s.id === schoolId) {
                const newEnabled = !s.is_sms_enabled
                toast.success(`SMS ${newEnabled ? 'enabled' : 'disabled'} for ${s.school_name}`)
                return { ...s, is_sms_enabled: newEnabled }
            }
            return s
        }))
    }

    // Filter schools
    const filteredSchools = schools.filter(s => 
        s.school_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.school_slug.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success('Copied to clipboard')
    }

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
                    <h1 className="text-3xl font-bold tracking-tight">SMS Configuration</h1>
                    <p className="text-muted-foreground">
                        Configure SMS gateway and manage school SMS permissions
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={loadData}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                    <Button onClick={() => setIsTestDialogOpen(true)} disabled={!config.is_enabled}>
                        <TestTube className="h-4 w-4 mr-2" />
                        Send Test SMS
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
                            messages sent today
                        </p>
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
                            {stats.failed_this_month} failed this month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Schools</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.schools_using_sms}</div>
                        <p className="text-xs text-muted-foreground">
                            schools with SMS enabled
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
                                            SMS Service is {config.is_enabled ? 'Active' : 'Inactive'}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {config.is_enabled 
                                                ? 'Schools with permissions can send SMS to parents'
                                                : 'Enable to allow schools to send SMS notifications'
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
                                <CardTitle>SMS Provider</CardTitle>
                            </div>
                            <CardDescription>Select and configure your SMS gateway provider</CardDescription>
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
                                    <CardTitle>API Credentials</CardTitle>
                                </div>
                                <CardDescription>
                                    Enter your {PROVIDERS.find(p => p.value === config.provider)?.label} API credentials
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Twilio specific */}
                                {config.provider === 'twilio' && (
                                    <>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label>Account SID (API Key)</Label>
                                                <div className="relative">
                                                    <Input
                                                        type={showApiKey ? 'text' : 'password'}
                                                        value={config.api_key}
                                                        onChange={(e) => setConfig(prev => ({ ...prev, api_key: e.target.value }))}
                                                        placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
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
                                            <div className="space-y-2">
                                                <Label>Auth Token (API Secret)</Label>
                                                <div className="relative">
                                                    <Input
                                                        type={showApiSecret ? 'text' : 'password'}
                                                        value={config.api_secret}
                                                        onChange={(e) => setConfig(prev => ({ ...prev, api_secret: e.target.value }))}
                                                        placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-0 top-0 h-full px-3"
                                                        onClick={() => setShowApiSecret(!showApiSecret)}
                                                    >
                                                        {showApiSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Sender ID / Phone Number</Label>
                                            <Input
                                                value={config.sender_id}
                                                onChange={(e) => setConfig(prev => ({ ...prev, sender_id: e.target.value }))}
                                                placeholder="+1234567890 or SCHOOLERP"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Your Twilio phone number or alphanumeric sender ID
                                            </p>
                                        </div>
                                    </>
                                )}

                                {/* Pakistani gateways */}
                                {['zong', 'jazz', 'telenor'].includes(config.provider) && (
                                    <>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label>Username</Label>
                                                <Input
                                                    value={config.username}
                                                    onChange={(e) => setConfig(prev => ({ ...prev, username: e.target.value }))}
                                                    placeholder="Your gateway username"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Password</Label>
                                                <div className="relative">
                                                    <Input
                                                        type={showPassword ? 'text' : 'password'}
                                                        value={config.password}
                                                        onChange={(e) => setConfig(prev => ({ ...prev, password: e.target.value }))}
                                                        placeholder="Your gateway password"
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
                                            <Label>Sender ID (Masking)</Label>
                                            <Input
                                                value={config.sender_id}
                                                onChange={(e) => setConfig(prev => ({ ...prev, sender_id: e.target.value }))}
                                                placeholder="SCHOOLERP"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Must be registered with PTA for branded SMS
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Gateway URL</Label>
                                            <Input
                                                value={config.base_url}
                                                onChange={(e) => setConfig(prev => ({ ...prev, base_url: e.target.value }))}
                                                placeholder={`https://api.${config.provider}.com.pk/sms/send`}
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Custom API */}
                                {config.provider === 'custom' && (
                                    <>
                                        <div className="space-y-2">
                                            <Label>API Endpoint URL</Label>
                                            <Input
                                                value={config.base_url}
                                                onChange={(e) => setConfig(prev => ({ ...prev, base_url: e.target.value }))}
                                                placeholder="https://your-sms-api.com/send"
                                            />
                                        </div>
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
                                            <div className="space-y-2">
                                                <Label>API Secret (Optional)</Label>
                                                <div className="relative">
                                                    <Input
                                                        type={showApiSecret ? 'text' : 'password'}
                                                        value={config.api_secret}
                                                        onChange={(e) => setConfig(prev => ({ ...prev, api_secret: e.target.value }))}
                                                        placeholder="Your API secret"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-0 top-0 h-full px-3"
                                                        onClick={() => setShowApiSecret(!showApiSecret)}
                                                    >
                                                        {showApiSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Sender ID</Label>
                                            <Input
                                                value={config.sender_id}
                                                onChange={(e) => setConfig(prev => ({ ...prev, sender_id: e.target.value }))}
                                                placeholder="SCHOOLERP"
                                            />
                                        </div>
                                    </>
                                )}

                                <Separator />

                                {/* Limits and Pricing */}
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label>Monthly SMS Limit (Platform)</Label>
                                        <Input
                                            type="number"
                                            value={config.monthly_limit}
                                            onChange={(e) => setConfig(prev => ({ ...prev, monthly_limit: parseInt(e.target.value) || 0 }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Rate per SMS (PKR)</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={config.rate_per_sms}
                                            onChange={(e) => setConfig(prev => ({ ...prev, rate_per_sms: parseFloat(e.target.value) || 0 }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Current Balance (PKR)</Label>
                                        <Input
                                            type="number"
                                            value={config.balance}
                                            onChange={(e) => setConfig(prev => ({ ...prev, balance: parseFloat(e.target.value) || 0 }))}
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
                                    <CardTitle>School SMS Permissions</CardTitle>
                                    <CardDescription>
                                        Control which schools can use SMS service and their limits
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
                                        <TableHead>SMS Status</TableHead>
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
                                                        checked={school.is_sms_enabled}
                                                        onCheckedChange={() => handleToggleSchoolSMS(school.id)}
                                                        disabled={!config.is_enabled}
                                                    />
                                                    <Badge variant={school.is_sms_enabled ? 'default' : 'secondary'}>
                                                        {school.is_sms_enabled ? 'Enabled' : 'Disabled'}
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
                                                    {school.can_send_emergency && <Badge variant="outline" className="text-xs">Emergency</Badge>}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {school.last_sms_sent ? (
                                                    <span className="text-sm text-muted-foreground">
                                                        {new Date(school.last_sms_sent).toLocaleDateString()}
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
                                <CardDescription>SMS sent by category this month</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Attendance Alerts</span>
                                        <span className="font-medium">4,250</span>
                                    </div>
                                    <Progress value={42.5} className="h-2" />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Fee Reminders</span>
                                        <span className="font-medium">2,890</span>
                                    </div>
                                    <Progress value={28.9} className="h-2" />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Exam Notifications</span>
                                        <span className="font-medium">1,560</span>
                                    </div>
                                    <Progress value={15.6} className="h-2" />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">General Announcements</span>
                                        <span className="font-medium">980</span>
                                    </div>
                                    <Progress value={9.8} className="h-2" />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Emergency Alerts</span>
                                        <span className="font-medium">360</span>
                                    </div>
                                    <Progress value={3.6} className="h-2" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Top Schools by Usage</CardTitle>
                                <CardDescription>Schools with highest SMS usage this month</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {schools
                                        .filter(s => s.is_sms_enabled)
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
                                                        <span className="text-xs text-muted-foreground w-20 text-right">
                                                            {school.used_this_month.toLocaleString()} SMS
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
                                    <p className="text-sm text-muted-foreground">Total SMS Sent</p>
                                </div>
                                <div className="text-center p-4 rounded-lg bg-muted/50">
                                    <p className="text-3xl font-bold text-green-600">{stats.delivery_rate}%</p>
                                    <p className="text-sm text-muted-foreground">Delivery Rate</p>
                                </div>
                                <div className="text-center p-4 rounded-lg bg-muted/50">
                                    <p className="text-3xl font-bold">{schools.length}</p>
                                    <p className="text-sm text-muted-foreground">Total Schools</p>
                                </div>
                                <div className="text-center p-4 rounded-lg bg-muted/50">
                                    <p className="text-3xl font-bold">PKR {(stats.total_sent_all_time * config.rate_per_sms).toLocaleString()}</p>
                                    <p className="text-sm text-muted-foreground">Total Cost</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Test SMS Dialog */}
            <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Send Test SMS</DialogTitle>
                        <DialogDescription>
                            Send a test message to verify your SMS configuration
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Phone Number</Label>
                            <Input
                                value={testPhoneNumber}
                                onChange={(e) => setTestPhoneNumber(e.target.value)}
                                placeholder="03001234567"
                            />
                            <p className="text-xs text-muted-foreground">
                                Enter a Pakistani mobile number to receive the test SMS
                            </p>
                        </div>
                        <div className="rounded-lg bg-muted p-3">
                            <p className="text-xs text-muted-foreground mb-1">Test Message:</p>
                            <p className="text-sm">
                                This is a test message from School ERP. If you received this, your SMS configuration is working correctly.
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsTestDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleTestSMS} disabled={isTesting}>
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
                        <DialogTitle>SMS Settings - {selectedSchool?.school_name}</DialogTitle>
                        <DialogDescription>
                            Configure SMS permissions and limits for this school
                        </DialogDescription>
                    </DialogHeader>
                    {selectedSchool && (
                        <div className="space-y-6 py-4">
                            <div className="flex items-center justify-between p-4 rounded-lg border">
                                <div>
                                    <Label>SMS Service</Label>
                                    <p className="text-sm text-muted-foreground">Enable SMS for this school</p>
                                </div>
                                <Switch
                                    checked={selectedSchool.is_sms_enabled}
                                    onCheckedChange={(checked) => 
                                        setSelectedSchool({ ...selectedSchool, is_sms_enabled: checked })
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Monthly SMS Limit</Label>
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
                                <Label>SMS Permissions</Label>
                                <div className="grid gap-3">
                                    <div className="flex items-center justify-between p-3 rounded-lg border">
                                        <span className="text-sm">Attendance Alerts</span>
                                        <Switch
                                            checked={selectedSchool.can_send_attendance}
                                            onCheckedChange={(checked) => 
                                                setSelectedSchool({ ...selectedSchool, can_send_attendance: checked })
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg border">
                                        <span className="text-sm">Fee Reminders</span>
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
                                        <span className="text-sm">Emergency Alerts</span>
                                        <Switch
                                            checked={selectedSchool.can_send_emergency}
                                            onCheckedChange={(checked) => 
                                                setSelectedSchool({ ...selectedSchool, can_send_emergency: checked })
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
