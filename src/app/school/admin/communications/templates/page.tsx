'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
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
    DialogDescription,
    DialogFooter,
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
import { toast } from 'sonner'
import {
    MessageSquare,
    Plus,
    Edit,
    Trash2,
    Copy,
    Search,
    Clock,
    DollarSign,
    BookOpen,
    AlertTriangle,
    Bell,
    Calendar,
    CheckCircle,
    Save,
    Eye,
    X,
} from 'lucide-react'

// Types
interface SMSTemplate {
    id: string
    name: string
    message: string
    category: 'attendance' | 'fees' | 'exams' | 'general' | 'emergency' | 'events' | 'homework' | 'transport'
    variables: string[]
    is_active: boolean
    created_at: string
    usage_count: number
}

const categoryConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
    attendance: { label: 'Attendance', icon: Clock, color: 'bg-blue-500' },
    fees: { label: 'Fees', icon: DollarSign, color: 'bg-green-500' },
    exams: { label: 'Exams', icon: BookOpen, color: 'bg-purple-500' },
    general: { label: 'General', icon: Bell, color: 'bg-gray-500' },
    emergency: { label: 'Emergency', icon: AlertTriangle, color: 'bg-red-500' },
    events: { label: 'Events', icon: Calendar, color: 'bg-orange-500' },
    homework: { label: 'Homework', icon: BookOpen, color: 'bg-indigo-500' },
    transport: { label: 'Transport', icon: Clock, color: 'bg-cyan-500' },
}

// Default templates that schools can use
const defaultTemplates: SMSTemplate[] = [
    // Attendance Templates
    {
        id: '1',
        name: 'Absence Alert',
        message: 'Dear Parent, Your child {student_name} was marked ABSENT on {date}. Please contact school if this is incorrect. - {school_name}',
        category: 'attendance',
        variables: ['{student_name}', '{date}', '{school_name}'],
        is_active: true,
        created_at: new Date().toISOString(),
        usage_count: 450
    },
    {
        id: '2',
        name: 'Late Arrival',
        message: 'Dear Parent, {student_name} arrived LATE at {time} on {date}. Please ensure timely attendance. - {school_name}',
        category: 'attendance',
        variables: ['{student_name}', '{time}', '{date}', '{school_name}'],
        is_active: true,
        created_at: new Date().toISOString(),
        usage_count: 120
    },
    {
        id: '3',
        name: 'Leave Granted',
        message: 'Leave granted for {student_name} from {from_date} to {to_date}. Total {days} days. - {school_name}',
        category: 'attendance',
        variables: ['{student_name}', '{from_date}', '{to_date}', '{days}', '{school_name}'],
        is_active: true,
        created_at: new Date().toISOString(),
        usage_count: 89
    },
    {
        id: '4',
        name: 'Low Attendance Warning',
        message: 'Alert: {student_name}\'s attendance is {percentage}%. Minimum required is {min_percentage}%. Please ensure regular attendance. - {school_name}',
        category: 'attendance',
        variables: ['{student_name}', '{percentage}', '{min_percentage}', '{school_name}'],
        is_active: true,
        created_at: new Date().toISOString(),
        usage_count: 34
    },

    // Fee Templates
    {
        id: '5',
        name: 'Fee Due Reminder',
        message: 'Fee Reminder: {student_name}\'s fee of Rs.{amount} is due on {due_date}. Please pay to avoid late charges. - {school_name}',
        category: 'fees',
        variables: ['{student_name}', '{amount}', '{due_date}', '{school_name}'],
        is_active: true,
        created_at: new Date().toISOString(),
        usage_count: 890
    },
    {
        id: '6',
        name: 'Fee Received',
        message: 'Payment Received: Rs.{amount} received for {student_name}. Receipt No: {receipt_no}. Balance: Rs.{balance}. Thank you! - {school_name}',
        category: 'fees',
        variables: ['{amount}', '{student_name}', '{receipt_no}', '{balance}', '{school_name}'],
        is_active: true,
        created_at: new Date().toISOString(),
        usage_count: 780
    },
    {
        id: '7',
        name: 'Fee Overdue',
        message: 'OVERDUE: {student_name}\'s fee Rs.{amount} was due on {due_date}. Late fee Rs.{late_fee} applied. Please pay immediately. - {school_name}',
        category: 'fees',
        variables: ['{student_name}', '{amount}', '{due_date}', '{late_fee}', '{school_name}'],
        is_active: true,
        created_at: new Date().toISOString(),
        usage_count: 156
    },

    // Exam Templates
    {
        id: '8',
        name: 'Exam Schedule',
        message: '{exam_name} exams will begin from {start_date}. Date sheet available on portal. Please ensure your child is prepared. - {school_name}',
        category: 'exams',
        variables: ['{exam_name}', '{start_date}', '{school_name}'],
        is_active: true,
        created_at: new Date().toISOString(),
        usage_count: 320
    },
    {
        id: '9',
        name: 'Result Announced',
        message: 'Results for {exam_name} have been announced. {student_name} scored {percentage}%. Check portal for details. - {school_name}',
        category: 'exams',
        variables: ['{exam_name}', '{student_name}', '{percentage}', '{school_name}'],
        is_active: true,
        created_at: new Date().toISOString(),
        usage_count: 280
    },
    {
        id: '10',
        name: 'Exam Tomorrow',
        message: 'Reminder: {student_name} has {subject} exam tomorrow ({date}) at {time}. Please ensure proper preparation. - {school_name}',
        category: 'exams',
        variables: ['{student_name}', '{subject}', '{date}', '{time}', '{school_name}'],
        is_active: true,
        created_at: new Date().toISOString(),
        usage_count: 450
    },

    // General Templates
    {
        id: '11',
        name: 'Holiday Notice',
        message: 'School Holiday: {reason}. School will remain closed from {from_date} to {to_date}. Classes resume on {resume_date}. - {school_name}',
        category: 'general',
        variables: ['{reason}', '{from_date}', '{to_date}', '{resume_date}', '{school_name}'],
        is_active: true,
        created_at: new Date().toISOString(),
        usage_count: 45
    },
    {
        id: '12',
        name: 'PTM Notice',
        message: 'Parent Teacher Meeting scheduled for {date} at {time} for {class}. Your presence is requested. - {school_name}',
        category: 'general',
        variables: ['{date}', '{time}', '{class}', '{school_name}'],
        is_active: true,
        created_at: new Date().toISOString(),
        usage_count: 67
    },
    {
        id: '13',
        name: 'Welcome Message',
        message: 'Welcome to {school_name}! {student_name} has been admitted to {class}. Admission No: {admission_no}. We look forward to a great journey!',
        category: 'general',
        variables: ['{school_name}', '{student_name}', '{class}', '{admission_no}'],
        is_active: true,
        created_at: new Date().toISOString(),
        usage_count: 234
    },

    // Emergency Templates
    {
        id: '14',
        name: 'Emergency Alert',
        message: 'URGENT from {school_name}: {message}. Please contact school immediately at {phone}.',
        category: 'emergency',
        variables: ['{school_name}', '{message}', '{phone}'],
        is_active: true,
        created_at: new Date().toISOString(),
        usage_count: 3
    },
    {
        id: '15',
        name: 'School Closure',
        message: 'URGENT: Due to {reason}, school is closed today. Students already at school will be sent home safely. - {school_name}',
        category: 'emergency',
        variables: ['{reason}', '{school_name}'],
        is_active: true,
        created_at: new Date().toISOString(),
        usage_count: 2
    },

    // Event Templates
    {
        id: '16',
        name: 'Event Reminder',
        message: 'Reminder: {event_name} on {date} at {time}. Venue: {venue}. Your participation is valued! - {school_name}',
        category: 'events',
        variables: ['{event_name}', '{date}', '{time}', '{venue}', '{school_name}'],
        is_active: true,
        created_at: new Date().toISOString(),
        usage_count: 156
    },
    {
        id: '17',
        name: 'Sports Day',
        message: 'Annual Sports Day on {date}! {student_name} is participating in {events}. Timings: {time}. Parents are invited! - {school_name}',
        category: 'events',
        variables: ['{date}', '{student_name}', '{events}', '{time}', '{school_name}'],
        is_active: true,
        created_at: new Date().toISOString(),
        usage_count: 89
    },

    // Homework Templates
    {
        id: '18',
        name: 'Homework Reminder',
        message: 'Homework for {subject} due on {due_date}. Topic: {topic}. Please check diary for details. - {school_name}',
        category: 'homework',
        variables: ['{subject}', '{due_date}', '{topic}', '{school_name}'],
        is_active: true,
        created_at: new Date().toISOString(),
        usage_count: 567
    },
    {
        id: '19',
        name: 'Missing Homework',
        message: '{student_name} has not submitted {subject} homework due on {due_date}. Please ensure submission. - {school_name}',
        category: 'homework',
        variables: ['{student_name}', '{subject}', '{due_date}', '{school_name}'],
        is_active: true,
        created_at: new Date().toISOString(),
        usage_count: 234
    },

    // Transport Templates
    {
        id: '20',
        name: 'Bus Delay',
        message: 'Bus Route {route_no} is delayed by approx {delay_minutes} mins due to {reason}. Expected arrival: {new_time}. - {school_name}',
        category: 'transport',
        variables: ['{route_no}', '{delay_minutes}', '{reason}', '{new_time}', '{school_name}'],
        is_active: true,
        created_at: new Date().toISOString(),
        usage_count: 23
    },
    {
        id: '21',
        name: 'Route Change',
        message: 'Transport Update: {student_name}\'s pickup/drop route changed. New Route: {route_no}, Time: {time}. - {school_name}',
        category: 'transport',
        variables: ['{student_name}', '{route_no}', '{time}', '{school_name}'],
        is_active: true,
        created_at: new Date().toISOString(),
        usage_count: 12
    },
]

export default function SMSTemplatesPage() {
    const [templates, setTemplates] = useState<SMSTemplate[]>(defaultTemplates)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingTemplate, setEditingTemplate] = useState<SMSTemplate | null>(null)
    const [previewText, setPreviewText] = useState<string>('')
    const [showPreview, setShowPreview] = useState(false)

    // New template form state
    const [formData, setFormData] = useState<{
        name: string
        message: string
        category: string
        is_active: boolean
    }>({
        name: '',
        message: '',
        category: 'general',
        is_active: true,
    })

    // Filter templates
    const filteredTemplates = useMemo(() => {
        return templates.filter(t => {
            const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.message.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory
            return matchesSearch && matchesCategory
        })
    }, [templates, searchQuery, selectedCategory])

    // Extract variables from message
    const extractVariables = (message: string): string[] => {
        const matches = message.match(/\{[^}]+\}/g)
        return matches ? [...new Set(matches)] : []
    }

    // Open dialog for new template
    const handleNewTemplate = () => {
        setEditingTemplate(null)
        setFormData({
            name: '',
            message: '',
            category: 'general',
            is_active: true,
        })
        setIsDialogOpen(true)
    }

    // Open dialog for editing
    const handleEdit = (template: SMSTemplate) => {
        setEditingTemplate(template)
        setFormData({
            name: template.name,
            message: template.message,
            category: template.category,
            is_active: template.is_active,
        })
        setIsDialogOpen(true)
    }

    // Save template
    const handleSave = () => {
        const variables = extractVariables(formData.message)
        
        if (editingTemplate) {
            // Update existing
            setTemplates(prev => prev.map(t => 
                t.id === editingTemplate.id
                    ? { 
                        ...t, 
                        name: formData.name,
                        message: formData.message,
                        category: formData.category as SMSTemplate['category'],
                        is_active: formData.is_active,
                        variables 
                    }
                    : t
            ))
            toast.success('Template updated successfully')
        } else {
            // Create new
            const newTemplate: SMSTemplate = {
                id: Date.now().toString(),
                ...formData,
                category: formData.category as SMSTemplate['category'],
                variables,
                created_at: new Date().toISOString(),
                usage_count: 0,
            }
            setTemplates(prev => [...prev, newTemplate])
            toast.success('Template created successfully')
        }
        setIsDialogOpen(false)
    }

    // Delete template
    const handleDelete = (id: string) => {
        setTemplates(prev => prev.filter(t => t.id !== id))
        toast.success('Template deleted')
    }

    // Toggle template status
    const toggleStatus = (id: string) => {
        setTemplates(prev => prev.map(t =>
            t.id === id ? { ...t, is_active: !t.is_active } : t
        ))
    }

    // Copy template text
    const handleCopy = (message: string) => {
        navigator.clipboard.writeText(message)
        toast.success('Template copied to clipboard')
    }

    // Preview template
    const handlePreview = (template: SMSTemplate) => {
        let preview = template.message
        // Replace variables with sample data
        const sampleData: Record<string, string> = {
            '{student_name}': 'Ahmed Khan',
            '{date}': '29 Jan 2026',
            '{time}': '08:15 AM',
            '{school_name}': 'City Grammar School',
            '{amount}': '5,000',
            '{due_date}': '05 Feb 2026',
            '{receipt_no}': 'RCP-2026-001234',
            '{balance}': '0',
            '{exam_name}': 'Mid-Term Exams',
            '{percentage}': '85',
            '{subject}': 'Mathematics',
            '{class}': 'Class 10-A',
            '{from_date}': '01 Feb 2026',
            '{to_date}': '03 Feb 2026',
            '{resume_date}': '04 Feb 2026',
            '{reason}': 'Eid Holidays',
            '{phone}': '+92-42-35761234',
            '{topic}': 'Chapter 5 - Algebra',
            '{route_no}': 'R-15',
            '{delay_minutes}': '15',
            '{new_time}': '08:30 AM',
            '{event_name}': 'Annual Day',
            '{venue}': 'School Auditorium',
            '{events}': '100m Race, Long Jump',
            '{min_percentage}': '75',
            '{days}': '3',
            '{admission_no}': 'STU-2026-0001',
            '{late_fee}': '500',
            '{message}': 'Emergency closure due to weather',
        }
        
        Object.entries(sampleData).forEach(([key, value]) => {
            preview = preview.replace(new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'), value)
        })
        
        setPreviewText(preview)
        setShowPreview(true)
    }

    // Character count
    const charCount = formData.message.length
    const smsCount = Math.ceil(charCount / 160) || 1

    // Stats
    const stats = useMemo(() => ({
        total: templates.length,
        active: templates.filter(t => t.is_active).length,
        totalUsage: templates.reduce((acc, t) => acc + t.usage_count, 0),
    }), [templates])

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">SMS Templates</h1>
                    <p className="text-muted-foreground">
                        Manage reusable SMS templates for different purposes
                    </p>
                </div>
                <Button onClick={handleNewTemplate} className="gradient-primary">
                    <Plus className="mr-2 h-4 w-4" />
                    New Template
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                                <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Templates</p>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Active Templates</p>
                                <p className="text-2xl font-bold">{stats.active}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                                <Bell className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Sent</p>
                                <p className="text-2xl font-bold">{stats.totalUsage.toLocaleString()}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col gap-4 md:flex-row">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search templates..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-full md:w-[200px]">
                                <SelectValue placeholder="Filter by category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {Object.entries(categoryConfig).map(([key, config]) => (
                                    <SelectItem key={key} value={key}>
                                        {config.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Templates by Category */}
            <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList className="flex flex-wrap h-auto gap-2">
                    <TabsTrigger value="all">All</TabsTrigger>
                    {Object.entries(categoryConfig).map(([key, config]) => (
                        <TabsTrigger key={key} value={key} className="gap-1">
                            <config.icon className="h-4 w-4" />
                            {config.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value={selectedCategory} className="mt-4">
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[200px]">Template Name</TableHead>
                                        <TableHead>Message</TableHead>
                                        <TableHead className="w-[120px]">Category</TableHead>
                                        <TableHead className="w-[80px]">Used</TableHead>
                                        <TableHead className="w-[80px]">Status</TableHead>
                                        <TableHead className="w-[150px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredTemplates.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8">
                                                <p className="text-muted-foreground">No templates found</p>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredTemplates.map((template) => {
                                            const config = categoryConfig[template.category]
                                            return (
                                                <TableRow key={template.id}>
                                                    <TableCell className="font-medium">
                                                        {template.name}
                                                    </TableCell>
                                                    <TableCell className="max-w-md">
                                                        <p className="text-sm text-muted-foreground truncate">
                                                            {template.message}
                                                        </p>
                                                        {template.variables.length > 0 && (
                                                            <div className="flex flex-wrap gap-1 mt-1">
                                                                {template.variables.slice(0, 3).map((v, i) => (
                                                                    <Badge key={i} variant="outline" className="text-xs">
                                                                        {v}
                                                                    </Badge>
                                                                ))}
                                                                {template.variables.length > 3 && (
                                                                    <Badge variant="outline" className="text-xs">
                                                                        +{template.variables.length - 3}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className={`${config.color} text-white`}>
                                                            {config.label}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {template.usage_count}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Switch
                                                            checked={template.is_active}
                                                            onCheckedChange={() => toggleStatus(template.id)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handlePreview(template)}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleCopy(template.message)}
                                                            >
                                                                <Copy className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleEdit(template)}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-red-500 hover:text-red-600"
                                                                onClick={() => handleDelete(template.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Variable Reference */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Available Variables</CardTitle>
                    <CardDescription>
                        Use these placeholders in your templates. They will be replaced with actual data when sending.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                        <div className="space-y-2">
                            <h4 className="font-medium text-sm">Student</h4>
                            <div className="flex flex-wrap gap-1">
                                {['{student_name}', '{class}', '{admission_no}', '{roll_no}'].map(v => (
                                    <Badge key={v} variant="secondary" className="cursor-pointer" onClick={() => handleCopy(v)}>
                                        {v}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium text-sm">Date/Time</h4>
                            <div className="flex flex-wrap gap-1">
                                {['{date}', '{time}', '{due_date}', '{from_date}', '{to_date}'].map(v => (
                                    <Badge key={v} variant="secondary" className="cursor-pointer" onClick={() => handleCopy(v)}>
                                        {v}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium text-sm">Finance</h4>
                            <div className="flex flex-wrap gap-1">
                                {['{amount}', '{balance}', '{receipt_no}', '{late_fee}'].map(v => (
                                    <Badge key={v} variant="secondary" className="cursor-pointer" onClick={() => handleCopy(v)}>
                                        {v}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium text-sm">School</h4>
                            <div className="flex flex-wrap gap-1">
                                {['{school_name}', '{phone}', '{principal}'].map(v => (
                                    <Badge key={v} variant="secondary" className="cursor-pointer" onClick={() => handleCopy(v)}>
                                        {v}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {editingTemplate ? 'Edit Template' : 'Create New Template'}
                        </DialogTitle>
                        <DialogDescription>
                            Create reusable SMS templates with dynamic variables
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Template Name</Label>
                            <Input
                                placeholder="e.g., Absence Alert"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(v) => setFormData({ ...formData, category: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(categoryConfig).map(([key, config]) => (
                                        <SelectItem key={key} value={key}>
                                            {config.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Message</Label>
                                <span className="text-xs text-muted-foreground">
                                    {charCount} chars • {smsCount} SMS
                                </span>
                            </div>
                            <Textarea
                                placeholder="Type your message... Use {variable} for dynamic content"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                rows={4}
                            />
                            {extractVariables(formData.message).length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    <span className="text-xs text-muted-foreground">Variables:</span>
                                    {extractVariables(formData.message).map((v, i) => (
                                        <Badge key={i} variant="outline" className="text-xs">
                                            {v}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                            <div>
                                <p className="font-medium text-sm">Active</p>
                                <p className="text-xs text-muted-foreground">Template can be used for sending SMS</p>
                            </div>
                            <Switch
                                checked={formData.is_active}
                                onCheckedChange={(v) => setFormData({ ...formData, is_active: v })}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleSave} 
                            disabled={!formData.name || !formData.message}
                        >
                            <Save className="mr-2 h-4 w-4" />
                            {editingTemplate ? 'Update' : 'Create'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Preview Dialog */}
            <Dialog open={showPreview} onOpenChange={setShowPreview}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>SMS Preview</DialogTitle>
                        <DialogDescription>
                            How your message will look with sample data
                        </DialogDescription>
                    </DialogHeader>
                    <div className="bg-green-100 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white text-sm font-bold shrink-0">
                                SMS
                            </div>
                            <div>
                                <p className="text-sm font-medium mb-1">School SMS</p>
                                <p className="text-sm">{previewText}</p>
                            </div>
                        </div>
                    </div>
                    <div className="text-center text-sm text-muted-foreground">
                        {previewText.length} characters • {Math.ceil(previewText.length / 160)} SMS
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setShowPreview(false)}>
                            <X className="mr-2 h-4 w-4" />
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
