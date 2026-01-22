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
    MessageSquare,
    Search,
    Phone,
    Mail,
    Clock,
    CheckCircle,
    GraduationCap,
    User,
} from 'lucide-react'

interface Inquiry {
    id: string
    inquiryNo: string
    studentName: string
    parentName: string
    phone: string
    email: string
    classInterested: string
    source: string
    date: string
    status: 'new' | 'contacted' | 'scheduled' | 'converted' | 'not-interested'
    notes?: string
}

const sampleInquiries: Inquiry[] = [
    { id: '1', inquiryNo: 'INQ-2024-001', studentName: 'Ali Hassan', parentName: 'Hassan Shah', phone: '+92-300-1234567', email: 'hassan@email.com', classInterested: 'Class 5', source: 'Website', date: '2024-01-18', status: 'new' },
    { id: '2', inquiryNo: 'INQ-2024-002', studentName: 'Sara Ahmed', parentName: 'Ahmed Raza', phone: '+92-300-2345678', email: 'ahmed@email.com', classInterested: 'Class 6', source: 'Walk-in', date: '2024-01-17', status: 'contacted' },
    { id: '3', inquiryNo: 'INQ-2024-003', studentName: 'Bilal Khan', parentName: 'Imran Khan', phone: '+92-300-3456789', email: 'imran@email.com', classInterested: 'Class 8', source: 'Referral', date: '2024-01-16', status: 'scheduled' },
    { id: '4', inquiryNo: 'INQ-2024-004', studentName: 'Fatima Ali', parentName: 'Ali Hussain', phone: '+92-300-4567890', email: 'ali@email.com', classInterested: 'Class 5', source: 'Website', date: '2024-01-15', status: 'converted' },
    { id: '5', inquiryNo: 'INQ-2024-005', studentName: 'Usman Tariq', parentName: 'Tariq Shah', phone: '+92-300-5678901', email: 'tariq@email.com', classInterested: 'Class 7', source: 'Social Media', date: '2024-01-14', status: 'not-interested' },
    { id: '6', inquiryNo: 'INQ-2024-006', studentName: 'Ayesha Malik', parentName: 'Asad Malik', phone: '+92-300-6789012', email: 'asad@email.com', classInterested: 'Class 9', source: 'Walk-in', date: '2024-01-13', status: 'new' },
]

export default function InquiriesPage() {
    const [inquiries] = useState<Inquiry[]>(sampleInquiries)
    const [searchQuery, setSearchQuery] = useState('')

    const filteredInquiries = inquiries.filter((inquiry) =>
        inquiry.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inquiry.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inquiry.inquiryNo.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const newCount = inquiries.filter((i) => i.status === 'new').length
    const contactedCount = inquiries.filter((i) => i.status === 'contacted').length
    const scheduledCount = inquiries.filter((i) => i.status === 'scheduled').length
    const convertedCount = inquiries.filter((i) => i.status === 'converted').length

    const getStatusBadge = (status: Inquiry['status']) => {
        switch (status) {
            case 'new':
                return <Badge className="bg-blue-500/10 text-blue-500">New</Badge>
            case 'contacted':
                return <Badge className="bg-yellow-500/10 text-yellow-500">Contacted</Badge>
            case 'scheduled':
                return <Badge className="bg-purple-500/10 text-purple-500">Scheduled</Badge>
            case 'converted':
                return <Badge className="bg-green-500/10 text-green-500">Converted</Badge>
            case 'not-interested':
                return <Badge className="bg-gray-500/10 text-gray-500">Not Interested</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admission Inquiries</h1>
                    <p className="text-muted-foreground">
                        Track and manage prospective student inquiries
                    </p>
                </div>
                <Button className="gradient-primary">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Add Inquiry
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">New Inquiries</CardTitle>
                        <MessageSquare className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-500">{newCount}</div>
                        <p className="text-xs text-muted-foreground">Need follow-up</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Contacted</CardTitle>
                        <Phone className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-500">{contactedCount}</div>
                        <p className="text-xs text-muted-foreground">In progress</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
                        <Clock className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-500">{scheduledCount}</div>
                        <p className="text-xs text-muted-foreground">Visit scheduled</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Converted</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{convertedCount}</div>
                        <p className="text-xs text-muted-foreground">Admissions</p>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search inquiries..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Inquiries Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        All Inquiries
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Inquiry No</TableHead>
                                <TableHead>Student</TableHead>
                                <TableHead>Parent</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Source</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredInquiries.map((inquiry) => (
                                <TableRow key={inquiry.id}>
                                    <TableCell className="font-medium text-primary">{inquiry.inquiryNo}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                                <GraduationCap className="h-4 w-4 text-primary" />
                                            </div>
                                            {inquiry.studentName}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            {inquiry.parentName}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <p className="flex items-center gap-1 text-sm">
                                                <Phone className="h-3 w-3" />
                                                {inquiry.phone}
                                            </p>
                                            <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Mail className="h-3 w-3" />
                                                {inquiry.email}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{inquiry.classInterested}</Badge>
                                    </TableCell>
                                    <TableCell>{inquiry.source}</TableCell>
                                    <TableCell>{new Date(inquiry.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
