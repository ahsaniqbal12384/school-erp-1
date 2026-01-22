'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    MessageSquare,
    Send,
    Clock,
    CheckCircle,
    User,
} from 'lucide-react'

const previousMessages = [
    {
        id: '1',
        subject: 'Fee Payment Inquiry',
        message: 'I would like to know if there is any discount available for siblings.',
        date: '2024-01-15',
        status: 'replied',
        reply: 'Yes, we offer 10% sibling discount. Please visit the accounts office with both students IDs.',
        replyDate: '2024-01-16'
    },
    {
        id: '2',
        subject: 'Transport Route Change Request',
        message: 'We have shifted to DHA Phase 6. Kindly update the pickup point.',
        date: '2024-01-10',
        status: 'replied',
        reply: 'Route has been updated. New pickup time is 7:15 AM from DHA Phase 6 Main Gate.',
        replyDate: '2024-01-12'
    },
    {
        id: '3',
        subject: 'Leave Application',
        message: 'My child Fatima will be absent from Jan 20-25 due to family travel.',
        date: '2024-01-18',
        status: 'pending'
    },
]

export default function PortalMessagesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
                <p className="text-muted-foreground">
                    Communicate with school administration
                </p>
            </div>

            {/* New Message */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Send className="h-5 w-5" />
                        Send New Message
                    </CardTitle>
                    <CardDescription>Contact the school administration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Regarding Child</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select child" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="fatima">Fatima Khan - Class 5-A</SelectItem>
                                    <SelectItem value="ahmed">Ahmed Khan - Class 8-B</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Department</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Administration</SelectItem>
                                    <SelectItem value="accounts">Accounts</SelectItem>
                                    <SelectItem value="transport">Transport</SelectItem>
                                    <SelectItem value="academic">Academic</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Subject</Label>
                        <Input placeholder="Enter message subject" />
                    </div>
                    <div className="space-y-2">
                        <Label>Message</Label>
                        <Textarea placeholder="Type your message here..." rows={4} />
                    </div>
                    <div className="flex justify-end">
                        <Button className="gradient-primary">
                            <Send className="mr-2 h-4 w-4" />
                            Send Message
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Previous Messages */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Message History
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {previousMessages.map((msg) => (
                            <div key={msg.id} className="p-4 rounded-lg border">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h4 className="font-medium">{msg.subject}</h4>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {new Date(msg.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    {msg.status === 'replied' ? (
                                        <Badge className="bg-green-500/10 text-green-500">
                                            <CheckCircle className="mr-1 h-3 w-3" />
                                            Replied
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-yellow-500/10 text-yellow-500">
                                            <Clock className="mr-1 h-3 w-3" />
                                            Pending
                                        </Badge>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    <div className="p-3 rounded-lg bg-muted/50">
                                        <div className="flex items-center gap-2 mb-1">
                                            <User className="h-3 w-3 text-muted-foreground" />
                                            <span className="text-xs font-medium">You</span>
                                        </div>
                                        <p className="text-sm">{msg.message}</p>
                                    </div>
                                    {msg.reply && (
                                        <div className="p-3 rounded-lg bg-primary/5 border-l-2 border-primary">
                                            <div className="flex items-center gap-2 mb-1">
                                                <User className="h-3 w-3 text-primary" />
                                                <span className="text-xs font-medium text-primary">School Admin</span>
                                                <span className="text-xs text-muted-foreground">• {msg.replyDate}</span>
                                            </div>
                                            <p className="text-sm">{msg.reply}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
