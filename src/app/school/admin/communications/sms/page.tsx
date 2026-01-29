'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { toast } from 'sonner'
import {
    MessageSquare,
    Send,
    Users,
    Search,
    Phone,
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Loader2,
    Filter,
    Plus,
    Trash2,
    Eye,
    RefreshCw,
    Download,
    ChevronDown,
    UserCheck,
    GraduationCap,
    Briefcase,
    School,
    History,
    BarChart3,
    Smartphone,
} from 'lucide-react'

// Types
interface Recipient {
    id: string
    name: string
    phone: string
    type: 'parent' | 'teacher' | 'staff' | 'student'
    class?: string
    section?: string
    studentName?: string // For parents
    selected: boolean
}

interface SMSHistory {
    id: string
    message: string
    recipients: number
    delivered: number
    failed: number
    sentAt: string
    status: 'sent' | 'pending' | 'failed'
    targetType: string
}

interface SMSTemplate {
    id: string
    name: string
    message: string
    category: string
}

// Sample data
const sampleRecipients: Recipient[] = [
    // Parents
    { id: 'p1', name: 'Mr. Khalid Khan', phone: '03001234567', type: 'parent', class: '10', section: 'A', studentName: 'Ahmed Khan', selected: false },
    { id: 'p2', name: 'Mrs. Ayesha Ali', phone: '03012345678', type: 'parent', class: '10', section: 'A', studentName: 'Fatima Ali', selected: false },
    { id: 'p3', name: 'Mr. Hassan Raza', phone: '03023456789', type: 'parent', class: '10', section: 'A', studentName: 'Hassan Jr.', selected: false },
    { id: 'p4', name: 'Mrs. Sara Ahmed', phone: '03034567890', type: 'parent', class: '9', section: 'B', studentName: 'Usman Ahmed', selected: false },
    { id: 'p5', name: 'Mr. Tariq Malik', phone: '03045678901', type: 'parent', class: '9', section: 'B', studentName: 'Ayesha Malik', selected: false },
    { id: 'p6', name: 'Mrs. Nazia Shah', phone: '03056789012', type: 'parent', class: '8', section: 'A', studentName: 'Bilal Shah', selected: false },
    // Teachers
    { id: 't1', name: 'Mr. Ahmed (Math)', phone: '03111234567', type: 'teacher', selected: false },
    { id: 't2', name: 'Mrs. Fatima (English)', phone: '03112345678', type: 'teacher', selected: false },
    { id: 't3', name: 'Mr. Ali (Science)', phone: '03113456789', type: 'teacher', selected: false },
    { id: 't4', name: 'Ms. Sana (Urdu)', phone: '03114567890', type: 'teacher', selected: false },
    // Staff
    { id: 's1', name: 'Mr. Rizwan (Admin)', phone: '03211234567', type: 'staff', selected: false },
    { id: 's2', name: 'Mrs. Nadia (Accountant)', phone: '03212345678', type: 'staff', selected: false },
    { id: 's3', name: 'Mr. Imran (Security)', phone: '03213456789', type: 'staff', selected: false },
]

const sampleHistory: SMSHistory[] = [
    { id: '1', message: 'School will remain closed tomorrow due to weather conditions.', recipients: 1250, delivered: 1235, failed: 15, sentAt: '2026-01-28 10:30 AM', status: 'sent', targetType: 'All Parents' },
    { id: '2', message: 'Fee reminder: January fee is due by 10th. Please pay to avoid late fee.', recipients: 320, delivered: 318, failed: 2, sentAt: '2026-01-25 09:00 AM', status: 'sent', targetType: 'Pending Fee Parents' },
    { id: '3', message: 'PTM scheduled for Saturday, Feb 1st at 9:00 AM.', recipients: 450, delivered: 445, failed: 5, sentAt: '2026-01-20 02:00 PM', status: 'sent', targetType: 'Class 9-10 Parents' },
    { id: '4', message: 'Staff meeting tomorrow at 3:00 PM in conference room.', recipients: 45, delivered: 45, failed: 0, sentAt: '2026-01-18 04:00 PM', status: 'sent', targetType: 'All Staff' },
]

const smsTemplates: SMSTemplate[] = [
    { id: 't1', name: 'Absence Alert', message: 'Dear Parent, Your child {student_name} was marked ABSENT on {date}. Please contact school if incorrect.', category: 'Attendance' },
    { id: 't2', name: 'Late Arrival', message: 'Dear Parent, Your child {student_name} arrived LATE at {time} on {date}.', category: 'Attendance' },
    { id: 't3', name: 'Fee Reminder', message: 'Fee Reminder: {student_name}\'s fee of Rs.{amount} is due on {due_date}. Please pay to avoid late charges.', category: 'Fees' },
    { id: 't4', name: 'Fee Received', message: 'Payment Received: Rs.{amount} received for {student_name}. Thank you!', category: 'Fees' },
    { id: 't5', name: 'Exam Schedule', message: '{exam_name} exams will begin from {start_date}. Please ensure your child is prepared.', category: 'Exams' },
    { id: 't6', name: 'Result Announced', message: 'Results for {exam_name} have been announced. Check portal for details.', category: 'Exams' },
    { id: 't7', name: 'Holiday Notice', message: 'School Holiday: {reason}. School will remain closed from {from_date} to {to_date}.', category: 'General' },
    { id: 't8', name: 'PTM Notice', message: 'Parent Teacher Meeting scheduled for {date} at {time}. Your presence is requested.', category: 'General' },
    { id: 't9', name: 'Emergency', message: 'URGENT: {message}. Please contact school immediately.', category: 'Emergency' },
]

export default function SMSManagementPage() {
    // State
    const [recipients, setRecipients] = useState<Recipient[]>(sampleRecipients)
    const [history] = useState<SMSHistory[]>(sampleHistory)
    const [message, setMessage] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [targetType, setTargetType] = useState<string>('custom')
    const [classFilter, setClassFilter] = useState<string>('all')
    const [sectionFilter, setSectionFilter] = useState<string>('all')
    const [recipientTypeFilter, setRecipientTypeFilter] = useState<string>('all')
    const [isSending, setIsSending] = useState(false)
    const [showPreview, setShowPreview] = useState(false)
    const [selectedTemplate, setSelectedTemplate] = useState<SMSTemplate | null>(null)
    const [scheduleDate, setScheduleDate] = useState('')
    const [scheduleTime, setScheduleTime] = useState('')

    // Filtered recipients based on search and filters
    const filteredRecipients = useMemo(() => {
        return recipients.filter((r) => {
            const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.phone.includes(searchQuery) ||
                (r.studentName && r.studentName.toLowerCase().includes(searchQuery.toLowerCase()))
            const matchesClass = classFilter === 'all' || r.class === classFilter
            const matchesSection = sectionFilter === 'all' || r.section === sectionFilter
            const matchesType = recipientTypeFilter === 'all' || r.type === recipientTypeFilter
            return matchesSearch && matchesClass && matchesSection && matchesType
        })
    }, [recipients, searchQuery, classFilter, sectionFilter, recipientTypeFilter])

    // Selected recipients
    const selectedRecipients = useMemo(() => recipients.filter((r) => r.selected), [recipients])
    const selectedCount = selectedRecipients.length

    // SMS character count
    const charCount = message.length
    const smsCount = Math.ceil(charCount / 160) || 1
    const remainingChars = 160 - (charCount % 160)

    // Toggle recipient selection
    const toggleRecipient = (id: string) => {
        setRecipients((prev) =>
            prev.map((r) => (r.id === id ? { ...r, selected: !r.selected } : r))
        )
    }

    // Select all visible recipients
    const selectAllVisible = () => {
        const visibleIds = filteredRecipients.map((r) => r.id)
        setRecipients((prev) =>
            prev.map((r) => (visibleIds.includes(r.id) ? { ...r, selected: true } : r))
        )
    }

    // Deselect all
    const deselectAll = () => {
        setRecipients((prev) => prev.map((r) => ({ ...r, selected: false })))
    }

    // Select by target type
    const selectByTargetType = (type: string) => {
        setTargetType(type)
        
        setRecipients((prev) => {
            switch (type) {
                case 'all-parents':
                    return prev.map((r) => ({ ...r, selected: r.type === 'parent' }))
                case 'all-teachers':
                    return prev.map((r) => ({ ...r, selected: r.type === 'teacher' }))
                case 'all-staff':
                    return prev.map((r) => ({ ...r, selected: r.type === 'staff' || r.type === 'teacher' }))
                case 'class-parents':
                    return prev.map((r) => ({ ...r, selected: r.type === 'parent' && r.class === classFilter }))
                case 'everyone':
                    return prev.map((r) => ({ ...r, selected: true }))
                case 'custom':
                default:
                    return prev
            }
        })
    }

    // Use template
    const useTemplate = (template: SMSTemplate) => {
        setSelectedTemplate(template)
        setMessage(template.message)
    }

    // Send SMS
    const handleSendSMS = async () => {
        if (!message.trim()) {
            toast.error('Please enter a message')
            return
        }
        if (selectedCount === 0) {
            toast.error('Please select at least one recipient')
            return
        }

        setIsSending(true)

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000))

            // In real app, call API:
            // await fetch('/api/sms/send', {
            //     method: 'POST',
            //     body: JSON.stringify({
            //         recipients: selectedRecipients.map(r => r.phone),
            //         message,
            //         scheduleAt: scheduleDate && scheduleTime ? `${scheduleDate}T${scheduleTime}` : undefined
            //     })
            // })

            toast.success(`SMS sent successfully!`, {
                description: `Message delivered to ${selectedCount} recipient(s)`,
            })

            // Reset
            setMessage('')
            deselectAll()
            setShowPreview(false)
        } catch (error) {
            toast.error('Failed to send SMS')
        } finally {
            setIsSending(false)
        }
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'parent':
                return <Users className="h-4 w-4" />
            case 'teacher':
                return <GraduationCap className="h-4 w-4" />
            case 'staff':
                return <Briefcase className="h-4 w-4" />
            case 'student':
                return <School className="h-4 w-4" />
            default:
                return <Users className="h-4 w-4" />
        }
    }

    const getStatusBadge = (status: SMSHistory['status']) => {
        switch (status) {
            case 'sent':
                return <Badge className="bg-green-500/10 text-green-500">Sent</Badge>
            case 'pending':
                return <Badge className="bg-yellow-500/10 text-yellow-500">Pending</Badge>
            case 'failed':
                return <Badge className="bg-red-500/10 text-red-500">Failed</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">SMS Management</h1>
                    <p className="text-muted-foreground">
                        Send SMS announcements to parents, teachers, and staff
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Sync Contacts
                    </Button>
                    <Button variant="outline">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Reports
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">SMS Balance</CardTitle>
                        <Smartphone className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">5,420</div>
                        <p className="text-xs text-muted-foreground">Credits remaining</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Sent Today</CardTitle>
                        <Send className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-500">156</div>
                        <p className="text-xs text-muted-foreground">Messages sent</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">98.5%</div>
                        <p className="text-xs text-muted-foreground">Delivery rate</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{recipients.length}</div>
                        <p className="text-xs text-muted-foreground">In database</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="compose" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="compose">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Compose SMS
                    </TabsTrigger>
                    <TabsTrigger value="templates">
                        <FileText className="mr-2 h-4 w-4" />
                        Templates
                    </TabsTrigger>
                    <TabsTrigger value="history">
                        <History className="mr-2 h-4 w-4" />
                        History
                    </TabsTrigger>
                </TabsList>

                {/* Compose SMS Tab */}
                <TabsContent value="compose" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Left: Recipient Selection */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Select Recipients</span>
                                    <Badge variant="outline">{selectedCount} selected</Badge>
                                </CardTitle>
                                <CardDescription>
                                    Choose who should receive this message
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Quick Select */}
                                <div className="space-y-2">
                                    <Label>Quick Select</Label>
                                    <Select value={targetType} onValueChange={selectByTargetType}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select target group" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="custom">Manual Selection</SelectItem>
                                            <SelectItem value="all-parents">All Parents</SelectItem>
                                            <SelectItem value="all-teachers">All Teachers</SelectItem>
                                            <SelectItem value="all-staff">All Staff (Teachers + Office)</SelectItem>
                                            <SelectItem value="class-parents">Class-wise Parents</SelectItem>
                                            <SelectItem value="everyone">Everyone</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Filters */}
                                <div className="flex gap-2">
                                    <Select value={recipientTypeFilter} onValueChange={setRecipientTypeFilter}>
                                        <SelectTrigger className="w-[120px]">
                                            <SelectValue placeholder="Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Types</SelectItem>
                                            <SelectItem value="parent">Parents</SelectItem>
                                            <SelectItem value="teacher">Teachers</SelectItem>
                                            <SelectItem value="staff">Staff</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select value={classFilter} onValueChange={setClassFilter}>
                                        <SelectTrigger className="w-[100px]">
                                            <SelectValue placeholder="Class" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            <SelectItem value="10">Class 10</SelectItem>
                                            <SelectItem value="9">Class 9</SelectItem>
                                            <SelectItem value="8">Class 8</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select value={sectionFilter} onValueChange={setSectionFilter}>
                                        <SelectTrigger className="w-[100px]">
                                            <SelectValue placeholder="Section" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            <SelectItem value="A">Section A</SelectItem>
                                            <SelectItem value="B">Section B</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by name, phone, or student..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={selectAllVisible}>
                                        Select All ({filteredRecipients.length})
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={deselectAll}>
                                        Clear All
                                    </Button>
                                </div>

                                {/* Recipient List */}
                                <ScrollArea className="h-[300px] rounded-md border">
                                    <div className="p-2 space-y-1">
                                        {filteredRecipients.map((recipient) => (
                                            <div
                                                key={recipient.id}
                                                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-accent ${
                                                    recipient.selected ? 'bg-primary/10 border border-primary/30' : ''
                                                }`}
                                                onClick={() => toggleRecipient(recipient.id)}
                                            >
                                                <Checkbox
                                                    checked={recipient.selected}
                                                    onCheckedChange={() => toggleRecipient(recipient.id)}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        {getTypeIcon(recipient.type)}
                                                        <span className="font-medium truncate">{recipient.name}</span>
                                                        <Badge variant="outline" className="text-xs">
                                                            {recipient.type}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Phone className="h-3 w-3" />
                                                        {recipient.phone}
                                                        {recipient.studentName && (
                                                            <span>• Student: {recipient.studentName}</span>
                                                        )}
                                                        {recipient.class && (
                                                            <span>• Class {recipient.class}-{recipient.section}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>

                        {/* Right: Message Composition */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Compose Message</CardTitle>
                                <CardDescription>
                                    Write your SMS message (max 160 chars per SMS)
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Template Selector */}
                                <div className="space-y-2">
                                    <Label>Use Template (Optional)</Label>
                                    <Select onValueChange={(id) => {
                                        const template = smsTemplates.find(t => t.id === id)
                                        if (template) useTemplate(template)
                                    }}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a template" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {smsTemplates.map((template) => (
                                                <SelectItem key={template.id} value={template.id}>
                                                    {template.name} ({template.category})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Message Input */}
                                <div className="space-y-2">
                                    <Label>Message</Label>
                                    <Textarea
                                        placeholder="Type your message here..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        rows={6}
                                        className="resize-none"
                                    />
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>{charCount} characters</span>
                                        <span>{smsCount} SMS ({remainingChars} chars remaining in current SMS)</span>
                                    </div>
                                </div>

                                {/* Schedule (Optional) */}
                                <div className="space-y-2">
                                    <Label>Schedule (Optional)</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="date"
                                            value={scheduleDate}
                                            onChange={(e) => setScheduleDate(e.target.value)}
                                            className="flex-1"
                                        />
                                        <Input
                                            type="time"
                                            value={scheduleTime}
                                            onChange={(e) => setScheduleTime(e.target.value)}
                                            className="w-[120px]"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Leave empty to send immediately
                                    </p>
                                </div>

                                {/* Summary */}
                                {selectedCount > 0 && (
                                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                                        <h4 className="font-medium mb-2">Summary</h4>
                                        <div className="space-y-1 text-sm">
                                            <div className="flex justify-between">
                                                <span>Recipients:</span>
                                                <span className="font-medium">{selectedCount} people</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>SMS Count:</span>
                                                <span className="font-medium">{smsCount} SMS × {selectedCount} = {smsCount * selectedCount} total</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Estimated Cost:</span>
                                                <span className="font-medium">{smsCount * selectedCount} credits</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => setShowPreview(true)}
                                        disabled={!message.trim() || selectedCount === 0}
                                    >
                                        <Eye className="mr-2 h-4 w-4" />
                                        Preview
                                    </Button>
                                    <Button
                                        className="flex-1 gradient-primary"
                                        onClick={handleSendSMS}
                                        disabled={!message.trim() || selectedCount === 0 || isSending}
                                    >
                                        {isSending ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="mr-2 h-4 w-4" />
                                                Send SMS
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Templates Tab */}
                <TabsContent value="templates">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>SMS Templates</CardTitle>
                                    <CardDescription>Pre-defined message templates for common scenarios</CardDescription>
                                </div>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Template
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {smsTemplates.map((template) => (
                                    <Card key={template.id} className="card-hover">
                                        <CardHeader className="pb-2">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-base">{template.name}</CardTitle>
                                                <Badge variant="outline">{template.category}</Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                                                {template.message}
                                            </p>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full"
                                                onClick={() => {
                                                    useTemplate(template)
                                                    toast.success('Template loaded')
                                                }}
                                            >
                                                Use Template
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* History Tab */}
                <TabsContent value="history">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>SMS History</CardTitle>
                                    <CardDescription>View all sent messages and their delivery status</CardDescription>
                                </div>
                                <Button variant="outline">
                                    <Download className="mr-2 h-4 w-4" />
                                    Export
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Message</TableHead>
                                        <TableHead>Target</TableHead>
                                        <TableHead className="text-center">Recipients</TableHead>
                                        <TableHead className="text-center">Delivered</TableHead>
                                        <TableHead className="text-center">Failed</TableHead>
                                        <TableHead>Sent At</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {history.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="max-w-[300px]">
                                                <p className="truncate">{item.message}</p>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{item.targetType}</Badge>
                                            </TableCell>
                                            <TableCell className="text-center font-medium">
                                                {item.recipients}
                                            </TableCell>
                                            <TableCell className="text-center text-green-500 font-medium">
                                                {item.delivered}
                                            </TableCell>
                                            <TableCell className="text-center text-red-500 font-medium">
                                                {item.failed}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {item.sentAt}
                                            </TableCell>
                                            <TableCell>{getStatusBadge(item.status)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Preview Dialog */}
            <Dialog open={showPreview} onOpenChange={setShowPreview}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Preview SMS</DialogTitle>
                        <DialogDescription>
                            Review your message before sending
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-muted">
                            <p className="text-sm whitespace-pre-wrap">{message}</p>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Recipients:</span>
                                <span>{selectedCount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">SMS per person:</span>
                                <span>{smsCount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Total SMS:</span>
                                <span className="font-medium">{smsCount * selectedCount}</span>
                            </div>
                            {scheduleDate && scheduleTime && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Scheduled for:</span>
                                    <span>{scheduleDate} at {scheduleTime}</span>
                                </div>
                            )}
                        </div>
                        <Separator />
                        <div>
                            <p className="text-sm font-medium mb-2">Sample Recipients:</p>
                            <div className="space-y-1">
                                {selectedRecipients.slice(0, 3).map((r) => (
                                    <div key={r.id} className="text-sm text-muted-foreground">
                                        {r.name} ({r.phone})
                                    </div>
                                ))}
                                {selectedRecipients.length > 3 && (
                                    <p className="text-sm text-muted-foreground">
                                        ... and {selectedRecipients.length - 3} more
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowPreview(false)}>
                            Cancel
                        </Button>
                        <Button className="gradient-primary" onClick={handleSendSMS} disabled={isSending}>
                            {isSending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Confirm & Send
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

// Missing import for FileText
function FileText(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
    )
}
