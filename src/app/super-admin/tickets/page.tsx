'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import {
    Ticket,
    Search,
    Clock,
    CheckCircle,
    AlertCircle,
    XCircle,
    MessageSquare,
    Building2,
    User,
    Calendar,
    Send,
    Loader2,
} from 'lucide-react'

interface SupportTicket {
    id: string
    ticketNo: string
    school: string
    subject: string
    description: string
    priority: 'low' | 'medium' | 'high' | 'critical'
    status: 'open' | 'in-progress' | 'resolved' | 'closed'
    category: string
    createdBy: string
    createdAt: string
    updatedAt: string
    assignedTo?: string
    messages: number
}

const sampleTickets: SupportTicket[] = [
    {
        id: '1',
        ticketNo: 'TKT-001',
        school: 'Lahore Grammar School',
        subject: 'Unable to generate fee challan',
        description: 'Getting error when trying to generate fee challans for January.',
        priority: 'high',
        status: 'open',
        category: 'Billing',
        createdBy: 'Mr. Ahmad Shah',
        createdAt: '2024-01-18T10:30:00',
        updatedAt: '2024-01-18T10:30:00',
        messages: 3,
    },
    {
        id: '2',
        ticketNo: 'TKT-002',
        school: 'Beaconhouse School',
        subject: 'Student attendance not syncing',
        description: 'Attendance marked on mobile app is not reflecting in the dashboard.',
        priority: 'medium',
        status: 'in-progress',
        category: 'Technical',
        createdBy: 'Ms. Fatima Ali',
        createdAt: '2024-01-17T14:45:00',
        updatedAt: '2024-01-18T09:15:00',
        assignedTo: 'Tech Support Team',
        messages: 5,
    },
    {
        id: '3',
        ticketNo: 'TKT-003',
        school: 'The City School',
        subject: 'Request for additional user accounts',
        description: 'Need 10 more teacher accounts for new staff members.',
        priority: 'low',
        status: 'resolved',
        category: 'Account',
        createdBy: 'Mr. Hassan Raza',
        createdAt: '2024-01-15T11:20:00',
        updatedAt: '2024-01-16T16:40:00',
        assignedTo: 'Admin Team',
        messages: 4,
    },
    {
        id: '4',
        ticketNo: 'TKT-004',
        school: 'Froebel\'s International',
        subject: 'System very slow during peak hours',
        description: 'The system becomes extremely slow between 8 AM and 10 AM.',
        priority: 'critical',
        status: 'in-progress',
        category: 'Performance',
        createdBy: 'Dr. Sana Malik',
        createdAt: '2024-01-18T08:00:00',
        updatedAt: '2024-01-18T11:30:00',
        assignedTo: 'DevOps Team',
        messages: 8,
    },
    {
        id: '5',
        ticketNo: 'TKT-005',
        school: 'Allied School',
        subject: 'Report card template customization',
        description: 'Want to add school logo and change the layout of report cards.',
        priority: 'low',
        status: 'closed',
        category: 'Feature Request',
        createdBy: 'Mr. Usman Khan',
        createdAt: '2024-01-10T09:30:00',
        updatedAt: '2024-01-14T15:00:00',
        assignedTo: 'Product Team',
        messages: 6,
    },
    {
        id: '6',
        ticketNo: 'TKT-006',
        school: 'Lahore Grammar School',
        subject: 'SMS notifications not being sent',
        description: 'Parents are not receiving SMS notifications for fee reminders.',
        priority: 'high',
        status: 'open',
        category: 'Integration',
        createdBy: 'Mrs. Zainab Ali',
        createdAt: '2024-01-18T12:00:00',
        updatedAt: '2024-01-18T12:00:00',
        messages: 1,
    },
]

export default function TicketsPage() {
    const [tickets, setTickets] = useState<SupportTicket[]>(sampleTickets)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [priorityFilter, setPriorityFilter] = useState<string>('all')
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
    const [responseText, setResponseText] = useState('')
    const [assignedTeam, setAssignedTeam] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)

    const filteredTickets = tickets.filter((ticket) => {
        const matchesSearch =
            ticket.ticketNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.school.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
        const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter
        return matchesSearch && matchesStatus && matchesPriority
    })

    const handleCloseTicket = async () => {
        if (!selectedTicket) return
        setIsSubmitting(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        setTickets(prev => prev.map(t => 
            t.id === selectedTicket.id ? { ...t, status: 'closed' as const, updatedAt: new Date().toISOString() } : t
        ))
        toast.success(`Ticket ${selectedTicket.ticketNo} closed successfully`)
        setIsSubmitting(false)
        setDialogOpen(false)
    }

    const handleSendResponse = async () => {
        if (!selectedTicket || !responseText.trim()) {
            toast.error('Please enter a response')
            return
        }
        setIsSubmitting(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        setTickets(prev => prev.map(t => 
            t.id === selectedTicket.id ? { 
                ...t, 
                status: 'in-progress' as const, 
                messages: t.messages + 1,
                assignedTo: assignedTeam || t.assignedTo,
                updatedAt: new Date().toISOString() 
            } : t
        ))
        toast.success(`Response sent for ticket ${selectedTicket.ticketNo}`)
        setResponseText('')
        setIsSubmitting(false)
        setDialogOpen(false)
    }

    const openTicketDialog = (ticket: SupportTicket) => {
        setSelectedTicket(ticket)
        setAssignedTeam(ticket.assignedTo || '')
        setResponseText('')
        setDialogOpen(true)
    }

    const openCount = tickets.filter((t) => t.status === 'open').length
    const inProgressCount = tickets.filter((t) => t.status === 'in-progress').length
    const resolvedCount = tickets.filter((t) => t.status === 'resolved').length
    const criticalCount = tickets.filter((t) => t.priority === 'critical' && t.status !== 'closed').length

    const getPriorityBadge = (priority: SupportTicket['priority']) => {
        switch (priority) {
            case 'critical':
                return <Badge className="bg-red-500 text-white">Critical</Badge>
            case 'high':
                return <Badge className="bg-orange-500 text-white">High</Badge>
            case 'medium':
                return <Badge className="bg-yellow-500 text-white">Medium</Badge>
            case 'low':
                return <Badge className="bg-gray-500 text-white">Low</Badge>
        }
    }

    const getStatusBadge = (status: SupportTicket['status']) => {
        switch (status) {
            case 'open':
                return (
                    <Badge className="bg-blue-500/10 text-blue-500">
                        <AlertCircle className="mr-1 h-3 w-3" />
                        Open
                    </Badge>
                )
            case 'in-progress':
                return (
                    <Badge className="bg-yellow-500/10 text-yellow-500">
                        <Clock className="mr-1 h-3 w-3" />
                        In Progress
                    </Badge>
                )
            case 'resolved':
                return (
                    <Badge className="bg-green-500/10 text-green-500">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Resolved
                    </Badge>
                )
            case 'closed':
                return (
                    <Badge variant="outline">
                        <XCircle className="mr-1 h-3 w-3" />
                        Closed
                    </Badge>
                )
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Support Tickets</h1>
                    <p className="text-muted-foreground">
                        Manage support requests from schools
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
                        <AlertCircle className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-500">{openCount}</div>
                        <p className="text-xs text-muted-foreground">Awaiting response</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-500">{inProgressCount}</div>
                        <p className="text-xs text-muted-foreground">Being worked on</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{resolvedCount}</div>
                        <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                </Card>
                <Card className="card-hover border-red-500/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Critical</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">{criticalCount}</div>
                        <p className="text-xs text-muted-foreground">Need immediate attention</p>
                    </CardContent>
                </Card>
            </div>

            {/* Critical Alert */}
            {criticalCount > 0 && (
                <Card className="border-red-500/50 bg-red-500/5">
                    <CardContent className="flex items-center gap-4 py-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                            <AlertCircle className="h-6 w-6 text-red-500" />
                        </div>
                        <div>
                            <p className="font-medium text-red-500">Critical Tickets Pending</p>
                            <p className="text-sm text-muted-foreground">
                                {criticalCount} critical ticket(s) require immediate attention
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search tickets..."
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
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Priority</SelectItem>
                                <SelectItem value="critical">Critical</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Tickets Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Ticket className="h-5 w-5" />
                        All Tickets
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ticket</TableHead>
                                <TableHead>School</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="text-center">Messages</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTickets.map((ticket) => (
                                <TableRow key={ticket.id}>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium text-primary">{ticket.ticketNo}</p>
                                            <p className="text-sm text-muted-foreground line-clamp-1">{ticket.subject}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Building2 className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">{ticket.school}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{ticket.category}</Badge>
                                    </TableCell>
                                    <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                                    <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <p>{new Date(ticket.createdAt).toLocaleDateString()}</p>
                                            <p className="text-muted-foreground">{new Date(ticket.createdAt).toLocaleTimeString()}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline" className="gap-1">
                                            <MessageSquare className="h-3 w-3" />
                                            {ticket.messages}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => openTicketDialog(ticket)}
                                        >
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Ticket Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl">
                    {selectedTicket && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <span className="text-primary">{selectedTicket.ticketNo}</span>
                                    {getPriorityBadge(selectedTicket.priority)}
                                    {getStatusBadge(selectedTicket.status)}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-medium">{selectedTicket.subject}</h3>
                                    <p className="text-sm text-muted-foreground mt-1">{selectedTicket.description}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Building2 className="h-4 w-4 text-muted-foreground" />
                                        <span>{selectedTicket.school}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <span>{selectedTicket.createdBy}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span>Created: {new Date(selectedTicket.createdAt).toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span>Updated: {new Date(selectedTicket.updatedAt).toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Assign To</Label>
                                    <Select value={assignedTeam} onValueChange={setAssignedTeam}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select team" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Tech Support Team">Tech Support Team</SelectItem>
                                            <SelectItem value="Admin Team">Admin Team</SelectItem>
                                            <SelectItem value="DevOps Team">DevOps Team</SelectItem>
                                            <SelectItem value="Product Team">Product Team</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Add Response</Label>
                                    <Textarea 
                                        placeholder="Type your response..." 
                                        rows={3} 
                                        value={responseText}
                                        onChange={(e) => setResponseText(e.target.value)}
                                    />
                                </div>
                                <div className="flex justify-end gap-3">
                                    <Button 
                                        variant="outline" 
                                        onClick={handleCloseTicket}
                                        disabled={isSubmitting || selectedTicket.status === 'closed'}
                                    >
                                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
                                        Close Ticket
                                    </Button>
                                    <Button 
                                        className="gradient-primary"
                                        onClick={handleSendResponse}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                        Send Response
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
