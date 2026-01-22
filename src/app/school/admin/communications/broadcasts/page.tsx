'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Bell,
    Plus,
    Search,
    Users,
    Calendar,
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
    Send,
    MessageSquare,
    Mail,
    Smartphone,
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Broadcast {
    id: string
    title: string
    message: string
    audience: string
    channel: 'sms' | 'email' | 'both' | 'app'
    sentDate: string
    recipients: number
    delivered: number
    status: 'sent' | 'scheduled' | 'draft'
}

const sampleBroadcasts: Broadcast[] = [
    {
        id: '1',
        title: 'Winter Vacation Announcement',
        message: 'School will remain closed from Dec 23 to Jan 2 for winter break.',
        audience: 'All Parents',
        channel: 'both',
        sentDate: '2024-01-15',
        recipients: 1250,
        delivered: 1235,
        status: 'sent',
    },
    {
        id: '2',
        title: 'Fee Payment Reminder',
        message: 'This is a reminder that January fees are due by the 10th.',
        audience: 'Pending Fee Parents',
        channel: 'sms',
        sentDate: '2024-01-08',
        recipients: 320,
        delivered: 315,
        status: 'sent',
    },
    {
        id: '3',
        title: 'PTM Schedule',
        message: 'Parent Teacher Meeting scheduled for Jan 25, 2024.',
        audience: 'All Parents',
        channel: 'email',
        sentDate: '2024-01-18',
        recipients: 1250,
        delivered: 1180,
        status: 'sent',
    },
    {
        id: '4',
        title: 'Sports Day Invitation',
        message: 'Annual Sports Day on Feb 15. Parents are invited.',
        audience: 'All Parents',
        channel: 'both',
        sentDate: '2024-02-01',
        recipients: 1250,
        delivered: 0,
        status: 'scheduled',
    },
    {
        id: '5',
        title: 'Exam Schedule Announcement',
        message: 'First terminal exams will begin from Feb 20.',
        audience: 'Class 9-10 Parents',
        channel: 'both',
        sentDate: '',
        recipients: 450,
        delivered: 0,
        status: 'draft',
    },
]

export default function BroadcastsPage() {
    const [broadcasts] = useState<Broadcast[]>(sampleBroadcasts)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

    const filteredBroadcasts = broadcasts.filter((broadcast) => {
        const matchesSearch =
            broadcast.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            broadcast.message.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'all' || broadcast.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const sentCount = broadcasts.filter((b) => b.status === 'sent').length
    const scheduledCount = broadcasts.filter((b) => b.status === 'scheduled').length
    const draftCount = broadcasts.filter((b) => b.status === 'draft').length
    const totalDelivered = broadcasts.reduce((acc, b) => acc + b.delivered, 0)

    const getStatusBadge = (status: Broadcast['status']) => {
        switch (status) {
            case 'sent':
                return <Badge className="bg-green-500/10 text-green-500">Sent</Badge>
            case 'scheduled':
                return <Badge className="bg-blue-500/10 text-blue-500">Scheduled</Badge>
            case 'draft':
                return <Badge variant="outline">Draft</Badge>
        }
    }

    const getChannelIcon = (channel: Broadcast['channel']) => {
        switch (channel) {
            case 'sms':
                return <Smartphone className="h-4 w-4" />
            case 'email':
                return <Mail className="h-4 w-4" />
            case 'both':
                return (
                    <div className="flex gap-1">
                        <Smartphone className="h-4 w-4" />
                        <Mail className="h-4 w-4" />
                    </div>
                )
            case 'app':
                return <MessageSquare className="h-4 w-4" />
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Broadcasts</h1>
                    <p className="text-muted-foreground">
                        Send announcements to parents, students, and staff
                    </p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gradient-primary">
                            <Plus className="mr-2 h-4 w-4" />
                            New Broadcast
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Create New Broadcast</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input placeholder="Enter broadcast title" />
                            </div>
                            <div className="space-y-2">
                                <Label>Message</Label>
                                <Textarea
                                    placeholder="Type your message here..."
                                    rows={4}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Target Audience</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select audience" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all-parents">All Parents</SelectItem>
                                            <SelectItem value="all-students">All Students</SelectItem>
                                            <SelectItem value="all-staff">All Staff</SelectItem>
                                            <SelectItem value="class-specific">Specific Class</SelectItem>
                                            <SelectItem value="pending-fees">Pending Fee Parents</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Channel</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select channel" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sms">SMS Only</SelectItem>
                                            <SelectItem value="email">Email Only</SelectItem>
                                            <SelectItem value="both">SMS + Email</SelectItem>
                                            <SelectItem value="app">In-App Notification</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Schedule (Optional)</Label>
                                <Input type="datetime-local" />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                    Save as Draft
                                </Button>
                                <Button className="gradient-primary" onClick={() => setIsAddDialogOpen(false)}>
                                    <Send className="mr-2 h-4 w-4" />
                                    Send Now
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
                        <Send className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{sentCount}</div>
                        <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
                        <Calendar className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-500">{scheduledCount}</div>
                        <p className="text-xs text-muted-foreground">Pending</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Drafts</CardTitle>
                        <Edit className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{draftCount}</div>
                        <p className="text-xs text-muted-foreground">Unsent</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Delivered</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalDelivered.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Messages</p>
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
                                placeholder="Search broadcasts..."
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
                                <SelectItem value="sent">Sent</SelectItem>
                                <SelectItem value="scheduled">Scheduled</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Broadcasts Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Broadcast History
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Audience</TableHead>
                                <TableHead>Channel</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-center">Delivered</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredBroadcasts.map((broadcast) => (
                                <TableRow key={broadcast.id}>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{broadcast.title}</p>
                                            <p className="text-sm text-muted-foreground line-clamp-1">
                                                {broadcast.message}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            <Users className="mr-1 h-3 w-3" />
                                            {broadcast.audience}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{getChannelIcon(broadcast.channel)}</TableCell>
                                    <TableCell>
                                        {broadcast.sentDate ? (
                                            <div className="flex items-center gap-1 text-sm">
                                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                                {new Date(broadcast.sentDate).toLocaleDateString()}
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {broadcast.status === 'sent' ? (
                                            <span>
                                                {broadcast.delivered}/{broadcast.recipients}
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground">{broadcast.recipients}</span>
                                        )}
                                    </TableCell>
                                    <TableCell>{getStatusBadge(broadcast.status)}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Details
                                                </DropdownMenuItem>
                                                {broadcast.status === 'draft' && (
                                                    <>
                                                        <DropdownMenuItem>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Send className="mr-2 h-4 w-4" />
                                                            Send Now
                                                        </DropdownMenuItem>
                                                    </>
                                                )}
                                                <DropdownMenuItem className="text-red-500">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
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
        </div>
    )
}
