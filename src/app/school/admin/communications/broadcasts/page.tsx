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
    Loader2,
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

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

const emptyFormData = {
    title: '',
    message: '',
    audience: '',
    channel: '',
    scheduleDate: '',
}

export default function BroadcastsPage() {
    const [broadcasts, setBroadcasts] = useState<Broadcast[]>(sampleBroadcasts)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedBroadcast, setSelectedBroadcast] = useState<Broadcast | null>(null)
    const [formData, setFormData] = useState(emptyFormData)
    const [isLoading, setIsLoading] = useState(false)

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

    const getRecipientCount = (audience: string): number => {
        const counts: Record<string, number> = {
            'all-parents': 1250,
            'all-students': 1150,
            'all-staff': 85,
            'class-specific': 40,
            'pending-fees': 320,
        }
        return counts[audience] || 100
    }

    const handleSaveAsDraft = async () => {
        if (!formData.title || !formData.message) {
            toast.error('Please provide title and message')
            return
        }

        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))

            const newBroadcast: Broadcast = {
                id: String(broadcasts.length + 1),
                title: formData.title,
                message: formData.message,
                audience: formData.audience || 'All Parents',
                channel: (formData.channel as Broadcast['channel']) || 'both',
                sentDate: '',
                recipients: getRecipientCount(formData.audience),
                delivered: 0,
                status: 'draft',
            }

            setBroadcasts([newBroadcast, ...broadcasts])
            setFormData(emptyFormData)
            setIsAddDialogOpen(false)
            toast.success('Draft saved successfully')
        } catch {
            toast.error('Failed to save draft')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSendNow = async () => {
        if (!formData.title || !formData.message || !formData.audience || !formData.channel) {
            toast.error('Please fill in all required fields')
            return
        }

        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1500))

            const recipients = getRecipientCount(formData.audience)
            const delivered = Math.floor(recipients * (0.95 + Math.random() * 0.05))

            const newBroadcast: Broadcast = {
                id: String(broadcasts.length + 1),
                title: formData.title,
                message: formData.message,
                audience: formData.audience === 'all-parents' ? 'All Parents' : formData.audience,
                channel: formData.channel as Broadcast['channel'],
                sentDate: new Date().toISOString().split('T')[0],
                recipients,
                delivered,
                status: 'sent',
            }

            setBroadcasts([newBroadcast, ...broadcasts])
            setFormData(emptyFormData)
            setIsAddDialogOpen(false)
            toast.success('Broadcast sent successfully', {
                description: `Sent to ${delivered} of ${recipients} recipients`
            })
        } catch {
            toast.error('Failed to send broadcast')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSendDraft = async (broadcast: Broadcast) => {
        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1500))

            const delivered = Math.floor(broadcast.recipients * (0.95 + Math.random() * 0.05))

            setBroadcasts(broadcasts.map(b =>
                b.id === broadcast.id
                    ? {
                        ...b,
                        status: 'sent',
                        sentDate: new Date().toISOString().split('T')[0],
                        delivered,
                    }
                    : b
            ))
            toast.success('Broadcast sent successfully', {
                description: `Sent to ${delivered} of ${broadcast.recipients} recipients`
            })
        } catch {
            toast.error('Failed to send broadcast')
        } finally {
            setIsLoading(false)
        }
    }

    const handleUpdateBroadcast = async () => {
        if (!selectedBroadcast || !formData.title || !formData.message) {
            toast.error('Please fill in required fields')
            return
        }

        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))

            setBroadcasts(broadcasts.map(b =>
                b.id === selectedBroadcast.id
                    ? {
                        ...b,
                        title: formData.title,
                        message: formData.message,
                        audience: formData.audience || b.audience,
                        channel: (formData.channel as Broadcast['channel']) || b.channel,
                    }
                    : b
            ))
            setIsEditDialogOpen(false)
            setSelectedBroadcast(null)
            toast.success('Broadcast updated successfully')
        } catch {
            toast.error('Failed to update broadcast')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!selectedBroadcast) return

        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 500))

            setBroadcasts(broadcasts.filter(b => b.id !== selectedBroadcast.id))
            setIsDeleteDialogOpen(false)
            setSelectedBroadcast(null)
            toast.success('Broadcast deleted')
        } catch {
            toast.error('Failed to delete broadcast')
        } finally {
            setIsLoading(false)
        }
    }

    const openViewDialog = (broadcast: Broadcast) => {
        setSelectedBroadcast(broadcast)
        setIsViewDialogOpen(true)
    }

    const openEditDialog = (broadcast: Broadcast) => {
        setSelectedBroadcast(broadcast)
        setFormData({
            title: broadcast.title,
            message: broadcast.message,
            audience: broadcast.audience,
            channel: broadcast.channel,
            scheduleDate: broadcast.sentDate,
        })
        setIsEditDialogOpen(true)
    }

    const openDeleteDialog = (broadcast: Broadcast) => {
        setSelectedBroadcast(broadcast)
        setIsDeleteDialogOpen(true)
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
                                <Label>Title *</Label>
                                <Input
                                    placeholder="Enter broadcast title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Message *</Label>
                                <Textarea
                                    placeholder="Type your message here..."
                                    rows={4}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Target Audience</Label>
                                    <Select
                                        value={formData.audience}
                                        onValueChange={(value) => setFormData({ ...formData, audience: value })}
                                    >
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
                                    <Select
                                        value={formData.channel}
                                        onValueChange={(value) => setFormData({ ...formData, channel: value })}
                                    >
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
                                <Input
                                    type="datetime-local"
                                    value={formData.scheduleDate}
                                    onChange={(e) => setFormData({ ...formData, scheduleDate: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="outline" onClick={handleSaveAsDraft} disabled={isLoading}>
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Save as Draft
                                </Button>
                                <Button className="gradient-primary" onClick={handleSendNow} disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="mr-2 h-4 w-4" />
                                            Send Now
                                        </>
                                    )}
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
                                                <DropdownMenuItem onClick={() => openViewDialog(broadcast)}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Details
                                                </DropdownMenuItem>
                                                {broadcast.status === 'draft' && (
                                                    <>
                                                        <DropdownMenuItem onClick={() => openEditDialog(broadcast)}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleSendDraft(broadcast)}>
                                                            <Send className="mr-2 h-4 w-4" />
                                                            Send Now
                                                        </DropdownMenuItem>
                                                    </>
                                                )}
                                                <DropdownMenuItem
                                                    className="text-red-500"
                                                    onClick={() => openDeleteDialog(broadcast)}
                                                >
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

            {/* View Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Broadcast Details</DialogTitle>
                    </DialogHeader>
                    {selectedBroadcast && (
                        <div className="space-y-4 py-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Title</p>
                                <p className="font-medium">{selectedBroadcast.title}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Message</p>
                                <p className="text-sm">{selectedBroadcast.message}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Audience</p>
                                    <p className="font-medium">{selectedBroadcast.audience}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Channel</p>
                                    <div className="flex items-center gap-2">
                                        {getChannelIcon(selectedBroadcast.channel)}
                                        <span className="capitalize">{selectedBroadcast.channel}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Status</p>
                                    {getStatusBadge(selectedBroadcast.status)}
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Sent Date</p>
                                    <p className="font-medium">{selectedBroadcast.sentDate || 'Not sent'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Recipients</p>
                                    <p className="font-medium">{selectedBroadcast.recipients}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Delivered</p>
                                    <p className="font-medium">{selectedBroadcast.delivered}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Broadcast</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Message</Label>
                            <Textarea
                                rows={4}
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button className="gradient-primary" onClick={handleUpdateBroadcast} disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Broadcast</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete &quot;{selectedBroadcast?.title}&quot;? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
