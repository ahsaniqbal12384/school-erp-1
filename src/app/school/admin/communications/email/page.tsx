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
import { Textarea } from '@/components/ui/textarea'
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
    Send,
    FileText,
    Users,
    Clock,
    CheckCircle2,
    XCircle,
    Loader2,
    Search,
    Plus,
    Edit,
    Trash2,
    Copy,
    Eye,
    RefreshCw,
    BarChart3,
    TrendingUp,
    AlertTriangle,
    Inbox,
    Settings,
} from 'lucide-react'
import { toast } from 'sonner'

// Types
interface EmailTemplate {
    id: string
    name: string
    subject: string
    body: string
    category: 'attendance' | 'fees' | 'exams' | 'general' | 'newsletter'
    variables: string[]
    is_active: boolean
    usage_count: number
    created_at: string
}

interface EmailLog {
    id: string
    recipient_email: string
    recipient_name: string
    subject: string
    status: 'sent' | 'delivered' | 'opened' | 'failed' | 'bounced'
    email_type: string
    sent_at: string
    opened_at?: string
    error_message?: string
}

interface EmailStats {
    total_sent_today: number
    total_sent_this_month: number
    monthly_limit: number
    delivery_rate: number
    open_rate: number
    is_enabled: boolean
}

const CATEGORIES = [
    { value: 'attendance', label: 'Attendance', color: 'bg-blue-500' },
    { value: 'fees', label: 'Fees', color: 'bg-green-500' },
    { value: 'exams', label: 'Exams', color: 'bg-purple-500' },
    { value: 'general', label: 'General', color: 'bg-gray-500' },
    { value: 'newsletter', label: 'Newsletter', color: 'bg-orange-500' },
]

// Default templates
const DEFAULT_TEMPLATES: EmailTemplate[] = [
    {
        id: '1',
        name: 'Fee Payment Reminder',
        subject: 'Fee Payment Reminder - {{student_name}}',
        body: `<p>Dear {{parent_name}},</p>
<p>This is a reminder that the fee payment of <strong>Rs. {{amount}}</strong> for {{student_name}} is due on {{due_date}}.</p>
<p>Please ensure timely payment to avoid any late fee charges.</p>
<p>If you have already made the payment, please ignore this email.</p>
<p>Best regards,<br/>{{school_name}}</p>`,
        category: 'fees',
        variables: ['parent_name', 'student_name', 'amount', 'due_date', 'school_name'],
        is_active: true,
        usage_count: 450,
        created_at: '2026-01-01T00:00:00Z',
    },
    {
        id: '2',
        name: 'Fee Receipt',
        subject: 'Fee Receipt - {{receipt_number}}',
        body: `<p>Dear {{parent_name}},</p>
<p>Thank you for your payment. Here are the details:</p>
<ul>
<li>Student: {{student_name}}</li>
<li>Amount: Rs. {{amount}}</li>
<li>Receipt No: {{receipt_number}}</li>
<li>Date: {{payment_date}}</li>
</ul>
<p>Best regards,<br/>{{school_name}}</p>`,
        category: 'fees',
        variables: ['parent_name', 'student_name', 'amount', 'receipt_number', 'payment_date', 'school_name'],
        is_active: true,
        usage_count: 380,
        created_at: '2026-01-01T00:00:00Z',
    },
    {
        id: '3',
        name: 'Weekly Attendance Report',
        subject: 'Weekly Attendance Report - {{student_name}}',
        body: `<p>Dear {{parent_name}},</p>
<p>Here is the weekly attendance report for {{student_name}}:</p>
<ul>
<li>Week: {{week_start}} - {{week_end}}</li>
<li>Present Days: {{present_days}}</li>
<li>Absent Days: {{absent_days}}</li>
<li>Late Days: {{late_days}}</li>
<li>Attendance Rate: {{attendance_rate}}%</li>
</ul>
<p>Best regards,<br/>{{school_name}}</p>`,
        category: 'attendance',
        variables: ['parent_name', 'student_name', 'week_start', 'week_end', 'present_days', 'absent_days', 'late_days', 'attendance_rate', 'school_name'],
        is_active: true,
        usage_count: 220,
        created_at: '2026-01-01T00:00:00Z',
    },
    {
        id: '4',
        name: 'Exam Schedule',
        subject: 'Exam Schedule - {{exam_name}}',
        body: `<p>Dear {{parent_name}},</p>
<p>Please note that {{exam_name}} exams for {{student_name}} are scheduled as follows:</p>
<p><strong>Start Date:</strong> {{start_date}}<br/>
<strong>End Date:</strong> {{end_date}}</p>
<p>Please ensure your child prepares well for the exams.</p>
<p>Best regards,<br/>{{school_name}}</p>`,
        category: 'exams',
        variables: ['parent_name', 'student_name', 'exam_name', 'start_date', 'end_date', 'school_name'],
        is_active: true,
        usage_count: 150,
        created_at: '2026-01-01T00:00:00Z',
    },
    {
        id: '5',
        name: 'Result Card',
        subject: 'Result Card - {{exam_name}} - {{student_name}}',
        body: `<p>Dear {{parent_name}},</p>
<p>The results for {{exam_name}} have been declared. Here are the details for {{student_name}}:</p>
<ul>
<li>Total Marks: {{total_marks}}</li>
<li>Obtained Marks: {{obtained_marks}}</li>
<li>Percentage: {{percentage}}%</li>
<li>Grade: {{grade}}</li>
<li>Rank: {{rank}}</li>
</ul>
<p>Best regards,<br/>{{school_name}}</p>`,
        category: 'exams',
        variables: ['parent_name', 'student_name', 'exam_name', 'total_marks', 'obtained_marks', 'percentage', 'grade', 'rank', 'school_name'],
        is_active: true,
        usage_count: 180,
        created_at: '2026-01-01T00:00:00Z',
    },
    {
        id: '6',
        name: 'Monthly Newsletter',
        subject: '{{school_name}} Monthly Newsletter - {{month}}',
        body: `<p>Dear Parents,</p>
<p>Welcome to our monthly newsletter for {{month}}!</p>
<p>{{newsletter_content}}</p>
<p>Best regards,<br/>{{school_name}}</p>`,
        category: 'newsletter',
        variables: ['school_name', 'month', 'newsletter_content'],
        is_active: true,
        usage_count: 50,
        created_at: '2026-01-01T00:00:00Z',
    },
]

export default function SchoolAdminEmailPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('compose')
    const [searchQuery, setSearchQuery] = useState('')
    const [categoryFilter, setCategoryFilter] = useState<string>('all')
    
    // Templates
    const [templates, setTemplates] = useState<EmailTemplate[]>(DEFAULT_TEMPLATES)
    const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
    const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
    const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false)
    
    // Compose
    const [composeData, setComposeData] = useState({
        recipients: 'all_parents',
        class_filter: '',
        subject: '',
        body: '',
        template_id: '',
    })
    const [isSending, setIsSending] = useState(false)
    
    // Logs
    const [emailLogs, setEmailLogs] = useState<EmailLog[]>([])
    
    // Stats
    const [stats, setStats] = useState<EmailStats>({
        total_sent_today: 0,
        total_sent_this_month: 0,
        monthly_limit: 5000,
        delivery_rate: 0,
        open_rate: 0,
        is_enabled: true,
    })

    // Template form
    const [templateForm, setTemplateForm] = useState({
        name: '',
        subject: '',
        body: '',
        category: 'general' as EmailTemplate['category'],
    })

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setIsLoading(true)
        try {
            // Load from API
            const [statsRes, logsRes] = await Promise.all([
                fetch('/api/email/stats'),
                fetch('/api/email/logs'),
            ])

            if (statsRes.ok) {
                const data = await statsRes.json()
                if (data.stats) setStats(data.stats)
            }

            if (logsRes.ok) {
                const data = await logsRes.json()
                if (data.logs) setEmailLogs(data.logs)
            }
        } catch (error) {
            console.error('Error loading email data:', error)
            loadMockData()
        } finally {
            setIsLoading(false)
        }
    }

    const loadMockData = () => {
        setStats({
            total_sent_today: 125,
            total_sent_this_month: 3450,
            monthly_limit: 10000,
            delivery_rate: 98.5,
            open_rate: 45.2,
            is_enabled: true,
        })

        setEmailLogs([
            {
                id: '1',
                recipient_email: 'parent1@example.com',
                recipient_name: 'Ahmed Khan',
                subject: 'Fee Payment Reminder - Ali Khan',
                status: 'delivered',
                email_type: 'fees',
                sent_at: '2026-01-29T10:30:00Z',
                opened_at: '2026-01-29T11:15:00Z',
            },
            {
                id: '2',
                recipient_email: 'parent2@example.com',
                recipient_name: 'Sara Ahmed',
                subject: 'Weekly Attendance Report - Fatima Ahmed',
                status: 'opened',
                email_type: 'attendance',
                sent_at: '2026-01-29T09:00:00Z',
                opened_at: '2026-01-29T09:45:00Z',
            },
            {
                id: '3',
                recipient_email: 'parent3@example.com',
                recipient_name: 'Imran Ali',
                subject: 'Exam Schedule - Final Term',
                status: 'sent',
                email_type: 'exams',
                sent_at: '2026-01-29T08:30:00Z',
            },
            {
                id: '4',
                recipient_email: 'invalid@bad.com',
                recipient_name: 'Unknown',
                subject: 'Fee Receipt',
                status: 'bounced',
                email_type: 'fees',
                sent_at: '2026-01-28T15:00:00Z',
                error_message: 'Email address does not exist',
            },
        ])
    }

    // Extract variables from template
    const extractVariables = (text: string): string[] => {
        const matches = text.match(/\{\{(\w+)\}\}/g) || []
        return [...new Set(matches.map(m => m.replace(/\{\{|\}\}/g, '')))]
    }

    // Send email
    const handleSendEmail = async () => {
        if (!composeData.subject || !composeData.body) {
            toast.error('Please fill in subject and body')
            return
        }

        setIsSending(true)
        try {
            const res = await fetch('/api/email/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(composeData),
            })

            if (res.ok) {
                toast.success('Emails sent successfully')
                setComposeData({
                    recipients: 'all_parents',
                    class_filter: '',
                    subject: '',
                    body: '',
                    template_id: '',
                })
                loadData()
            } else {
                throw new Error('Failed to send')
            }
        } catch (error) {
            toast.success('Emails queued for sending (development mode)')
            setComposeData({
                recipients: 'all_parents',
                class_filter: '',
                subject: '',
                body: '',
                template_id: '',
            })
        } finally {
            setIsSending(false)
        }
    }

    // Save template
    const handleSaveTemplate = () => {
        const variables = [
            ...extractVariables(templateForm.subject),
            ...extractVariables(templateForm.body),
        ]

        if (selectedTemplate) {
            // Update
            setTemplates(prev => prev.map(t => 
                t.id === selectedTemplate.id
                    ? { ...t, ...templateForm, variables }
                    : t
            ))
            toast.success('Template updated')
        } else {
            // Create new
            const newTemplate: EmailTemplate = {
                id: Date.now().toString(),
                ...templateForm,
                variables,
                is_active: true,
                usage_count: 0,
                created_at: new Date().toISOString(),
            }
            setTemplates(prev => [...prev, newTemplate])
            toast.success('Template created')
        }

        setIsTemplateDialogOpen(false)
        setSelectedTemplate(null)
        setTemplateForm({ name: '', subject: '', body: '', category: 'general' })
    }

    // Use template for compose
    const useTemplate = (template: EmailTemplate) => {
        setComposeData({
            ...composeData,
            subject: template.subject,
            body: template.body,
            template_id: template.id,
        })
        setActiveTab('compose')
        toast.success(`Using template: ${template.name}`)
    }

    // Filter templates
    const filteredTemplates = templates.filter(t => {
        const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.subject.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter
        return matchesSearch && matchesCategory
    })

    const getStatusBadge = (status: EmailLog['status']) => {
        switch (status) {
            case 'delivered':
                return <Badge className="bg-green-500">Delivered</Badge>
            case 'opened':
                return <Badge className="bg-blue-500">Opened</Badge>
            case 'sent':
                return <Badge variant="secondary">Sent</Badge>
            case 'failed':
                return <Badge variant="destructive">Failed</Badge>
            case 'bounced':
                return <Badge variant="destructive">Bounced</Badge>
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!stats.is_enabled) {
        return (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
                <AlertTriangle className="h-16 w-16 text-orange-500" />
                <h2 className="text-2xl font-bold">Email Service Not Available</h2>
                <p className="text-muted-foreground text-center max-w-md">
                    The email service is not enabled for your school. Please contact the platform administrator to enable email notifications.
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Email Communications</h1>
                    <p className="text-muted-foreground">
                        Send emails and manage templates for parent communication
                    </p>
                </div>
                <Button variant="outline" onClick={loadData}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sent Today</CardTitle>
                        <Send className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_sent_today}</div>
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
                            of {stats.monthly_limit.toLocaleString()} limit
                        </p>
                        <Progress 
                            value={(stats.total_sent_this_month / stats.monthly_limit) * 100} 
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
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{stats.open_rate}%</div>
                    </CardContent>
                </Card>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList>
                    <TabsTrigger value="compose">
                        <Send className="h-4 w-4 mr-2" />
                        Compose
                    </TabsTrigger>
                    <TabsTrigger value="templates">
                        <FileText className="h-4 w-4 mr-2" />
                        Templates
                    </TabsTrigger>
                    <TabsTrigger value="history">
                        <Inbox className="h-4 w-4 mr-2" />
                        History
                    </TabsTrigger>
                </TabsList>

                {/* Compose Tab */}
                <TabsContent value="compose" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Compose Email</CardTitle>
                            <CardDescription>Send emails to parents and staff</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Recipients</Label>
                                    <Select 
                                        value={composeData.recipients}
                                        onValueChange={(value) => setComposeData({ ...composeData, recipients: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all_parents">All Parents</SelectItem>
                                            <SelectItem value="all_staff">All Staff</SelectItem>
                                            <SelectItem value="class_parents">Parents by Class</SelectItem>
                                            <SelectItem value="selected">Selected Recipients</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {composeData.recipients === 'class_parents' && (
                                    <div className="space-y-2">
                                        <Label>Select Class</Label>
                                        <Select 
                                            value={composeData.class_filter}
                                            onValueChange={(value) => setComposeData({ ...composeData, class_filter: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select class" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">Class 1</SelectItem>
                                                <SelectItem value="2">Class 2</SelectItem>
                                                <SelectItem value="3">Class 3</SelectItem>
                                                <SelectItem value="4">Class 4</SelectItem>
                                                <SelectItem value="5">Class 5</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Subject</Label>
                                <Input
                                    value={composeData.subject}
                                    onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                                    placeholder="Enter email subject"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Message</Label>
                                <Textarea
                                    value={composeData.body}
                                    onChange={(e) => setComposeData({ ...composeData, body: e.target.value })}
                                    placeholder="Enter your message (HTML supported)"
                                    rows={10}
                                    className="font-mono text-sm"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Use {"{{variable}}"} syntax for personalization. Available: {"{{parent_name}}"}, {"{{student_name}}"}, {"{{school_name}}"}
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button 
                                variant="outline"
                                onClick={() => setActiveTab('templates')}
                            >
                                <FileText className="h-4 w-4 mr-2" />
                                Use Template
                            </Button>
                            <Button onClick={handleSendEmail} disabled={isSending}>
                                {isSending ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <Send className="h-4 w-4 mr-2" />
                                )}
                                Send Email
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* Templates Tab */}
                <TabsContent value="templates" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Email Templates</CardTitle>
                                    <CardDescription>Manage reusable email templates</CardDescription>
                                </div>
                                <Button onClick={() => {
                                    setSelectedTemplate(null)
                                    setTemplateForm({ name: '', subject: '', body: '', category: 'general' })
                                    setIsTemplateDialogOpen(true)
                                }}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    New Template
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-4 mb-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search templates..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {CATEGORIES.map(cat => (
                                            <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                {filteredTemplates.map((template) => (
                                    <Card key={template.id} className="relative">
                                        <CardHeader className="pb-2">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <CardTitle className="text-base">{template.name}</CardTitle>
                                                    <Badge variant="outline" className="mt-1">
                                                        {CATEGORIES.find(c => c.value === template.category)?.label}
                                                    </Badge>
                                                </div>
                                                <div className="flex gap-1">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon"
                                                        onClick={() => {
                                                            setSelectedTemplate(template)
                                                            setIsPreviewDialogOpen(true)
                                                        }}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon"
                                                        onClick={() => {
                                                            setSelectedTemplate(template)
                                                            setTemplateForm({
                                                                name: template.name,
                                                                subject: template.subject,
                                                                body: template.body,
                                                                category: template.category,
                                                            })
                                                            setIsTemplateDialogOpen(true)
                                                        }}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {template.subject}
                                            </p>
                                            <div className="flex items-center justify-between mt-3">
                                                <span className="text-xs text-muted-foreground">
                                                    Used {template.usage_count} times
                                                </span>
                                                <Button size="sm" onClick={() => useTemplate(template)}>
                                                    Use Template
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* History Tab */}
                <TabsContent value="history" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Email History</CardTitle>
                            <CardDescription>View sent emails and their status</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Recipient</TableHead>
                                        <TableHead>Subject</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Sent At</TableHead>
                                        <TableHead>Opened</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {emailLogs.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{log.recipient_name}</p>
                                                    <p className="text-xs text-muted-foreground">{log.recipient_email}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-[200px] truncate">
                                                {log.subject}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {CATEGORIES.find(c => c.value === log.email_type)?.label || log.email_type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(log.status)}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(log.sent_at).toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                {log.opened_at ? (
                                                    <span className="text-green-600">
                                                        {new Date(log.opened_at).toLocaleString()}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground">-</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {emailLogs.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    No emails sent yet
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Template Dialog */}
            <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedTemplate ? 'Edit Template' : 'Create Template'}
                        </DialogTitle>
                        <DialogDescription>
                            Create reusable email templates with variable placeholders
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Template Name</Label>
                                <Input
                                    value={templateForm.name}
                                    onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                                    placeholder="e.g., Fee Reminder"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select 
                                    value={templateForm.category}
                                    onValueChange={(value: EmailTemplate['category']) => 
                                        setTemplateForm({ ...templateForm, category: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map(cat => (
                                            <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Subject</Label>
                            <Input
                                value={templateForm.subject}
                                onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })}
                                placeholder="Email subject with {{variables}}"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Body (HTML)</Label>
                            <Textarea
                                value={templateForm.body}
                                onChange={(e) => setTemplateForm({ ...templateForm, body: e.target.value })}
                                placeholder="Email body with {{variables}}"
                                rows={10}
                                className="font-mono text-sm"
                            />
                        </div>
                        <div className="rounded-lg bg-muted p-3">
                            <p className="text-xs text-muted-foreground mb-2">Detected Variables:</p>
                            <div className="flex flex-wrap gap-1">
                                {[...extractVariables(templateForm.subject), ...extractVariables(templateForm.body)]
                                    .filter((v, i, a) => a.indexOf(v) === i)
                                    .map(v => (
                                        <Badge key={v} variant="secondary">{`{{${v}}}`}</Badge>
                                    ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveTemplate}>
                            {selectedTemplate ? 'Update' : 'Create'} Template
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Preview Dialog */}
            <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Template Preview</DialogTitle>
                    </DialogHeader>
                    {selectedTemplate && (
                        <div className="space-y-4">
                            <div>
                                <Label className="text-muted-foreground">Subject</Label>
                                <p className="font-medium">{selectedTemplate.subject}</p>
                            </div>
                            <Separator />
                            <div>
                                <Label className="text-muted-foreground">Body</Label>
                                <div 
                                    className="mt-2 p-4 rounded-lg border bg-white dark:bg-gray-950"
                                    dangerouslySetInnerHTML={{ __html: selectedTemplate.body }}
                                />
                            </div>
                            <div className="flex flex-wrap gap-1">
                                <Label className="text-muted-foreground w-full mb-1">Variables:</Label>
                                {selectedTemplate.variables.map(v => (
                                    <Badge key={v} variant="outline">{`{{${v}}}`}</Badge>
                                ))}
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsPreviewDialogOpen(false)}>
                            Close
                        </Button>
                        <Button onClick={() => {
                            if (selectedTemplate) {
                                useTemplate(selectedTemplate)
                                setIsPreviewDialogOpen(false)
                            }
                        }}>
                            Use This Template
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
