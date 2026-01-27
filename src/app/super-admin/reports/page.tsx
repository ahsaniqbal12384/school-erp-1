'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
    FileText,
    Search,
    Download,
    Calendar,
    TrendingUp,
    Building2,
    Users,
    DollarSign,
    BarChart3,
    PieChart,
    Filter,
    Loader2,
} from 'lucide-react'

interface Report {
    id: string
    name: string
    type: 'financial' | 'academic' | 'enrollment' | 'operational'
    description: string
    lastGenerated: string
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly'
}

const sampleReports: Report[] = [
    {
        id: '1',
        name: 'Revenue Summary Report',
        type: 'financial',
        description: 'Complete revenue breakdown by school, plan, and region',
        lastGenerated: '2024-01-20',
        frequency: 'monthly',
    },
    {
        id: '2',
        name: 'School Enrollment Trends',
        type: 'enrollment',
        description: 'Student enrollment trends across all schools',
        lastGenerated: '2024-01-19',
        frequency: 'weekly',
    },
    {
        id: '3',
        name: 'Platform Usage Analytics',
        type: 'operational',
        description: 'User activity and feature usage statistics',
        lastGenerated: '2024-01-20',
        frequency: 'daily',
    },
    {
        id: '4',
        name: 'Subscription Renewals Report',
        type: 'financial',
        description: 'Upcoming renewals and payment forecasts',
        lastGenerated: '2024-01-18',
        frequency: 'weekly',
    },
    {
        id: '5',
        name: 'Academic Performance Overview',
        type: 'academic',
        description: 'Aggregate exam results and pass rates by school',
        lastGenerated: '2024-01-15',
        frequency: 'quarterly',
    },
    {
        id: '6',
        name: 'Regional Distribution Report',
        type: 'enrollment',
        description: 'School and student distribution by city/region',
        lastGenerated: '2024-01-20',
        frequency: 'monthly',
    },
]

export default function ReportsPage() {
    const [reports] = useState<Report[]>(sampleReports)
    const [searchQuery, setSearchQuery] = useState('')
    const [typeFilter, setTypeFilter] = useState<string>('all')
    const [generatingReport, setGeneratingReport] = useState<string | null>(null)
    const [customReportOpen, setCustomReportOpen] = useState(false)
    const [customReportType, setCustomReportType] = useState('financial')
    const [customReportFormat, setCustomReportFormat] = useState('csv')

    const filteredReports = reports.filter((report) => {
        const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesType = typeFilter === 'all' || report.type === typeFilter
        return matchesSearch && matchesType
    })

    const handleGenerateReport = async (reportId: string, reportName: string) => {
        setGeneratingReport(reportId)
        try {
            const response = await fetch('/api/reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reportType: reportId, format: 'json' })
            })
            if (response.ok) {
                toast.success(`${reportName} generated successfully`)
            } else {
                toast.error('Failed to generate report')
            }
        } catch {
            toast.error('Error generating report')
        } finally {
            setGeneratingReport(null)
        }
    }

    const handleDownloadReport = async (reportId: string, reportName: string) => {
        toast.info(`Downloading ${reportName}...`)
        try {
            const response = await fetch('/api/reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reportType: reportId, format: 'csv' })
            })
            if (response.ok) {
                const data = await response.json()
                // Convert to CSV and download
                const csv = convertToCSV(data.data || [])
                downloadFile(csv, `${reportName.toLowerCase().replace(/\s+/g, '-')}.csv`, 'text/csv')
                toast.success('Report downloaded successfully')
            } else {
                toast.error('Failed to download report')
            }
        } catch {
            toast.error('Error downloading report')
        }
    }

    const handleGenerateCustomReport = async () => {
        setGeneratingReport('custom')
        try {
            const response = await fetch('/api/reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reportType: customReportType, format: customReportFormat })
            })
            if (response.ok) {
                const data = await response.json()
                if (customReportFormat === 'csv') {
                    const csv = convertToCSV(data.data || [])
                    downloadFile(csv, `custom-report-${customReportType}.csv`, 'text/csv')
                }
                toast.success('Custom report generated successfully')
                setCustomReportOpen(false)
            } else {
                toast.error('Failed to generate custom report')
            }
        } catch {
            toast.error('Error generating custom report')
        } finally {
            setGeneratingReport(null)
        }
    }

    const convertToCSV = (data: Record<string, unknown>[]) => {
        if (!data.length) return ''
        const headers = Object.keys(data[0])
        const rows = data.map(row => headers.map(h => JSON.stringify(row[h] ?? '')).join(','))
        return [headers.join(','), ...rows].join('\n')
    }

    const downloadFile = (content: string, filename: string, type: string) => {
        const blob = new Blob([content], { type })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        a.click()
        URL.revokeObjectURL(url)
    }

    const getTypeBadge = (type: Report['type']) => {
        switch (type) {
            case 'financial':
                return <Badge className="bg-green-500/10 text-green-500">Financial</Badge>
            case 'academic':
                return <Badge className="bg-blue-500/10 text-blue-500">Academic</Badge>
            case 'enrollment':
                return <Badge className="bg-purple-500/10 text-purple-500">Enrollment</Badge>
            case 'operational':
                return <Badge className="bg-orange-500/10 text-orange-500">Operational</Badge>
        }
    }

    const getTypeIcon = (type: Report['type']) => {
        switch (type) {
            case 'financial':
                return <DollarSign className="h-5 w-5 text-green-500" />
            case 'academic':
                return <BarChart3 className="h-5 w-5 text-blue-500" />
            case 'enrollment':
                return <Users className="h-5 w-5 text-purple-500" />
            case 'operational':
                return <PieChart className="h-5 w-5 text-orange-500" />
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
                    <p className="text-muted-foreground">
                        Generate and download platform-wide reports
                    </p>
                </div>
                <Dialog open={customReportOpen} onOpenChange={setCustomReportOpen}>
                    <DialogTrigger asChild>
                        <Button className="gradient-primary">
                            <FileText className="mr-2 h-4 w-4" />
                            Generate Custom Report
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Generate Custom Report</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label>Report Type</Label>
                                <Select value={customReportType} onValueChange={setCustomReportType}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="schools">Schools Overview</SelectItem>
                                        <SelectItem value="subscriptions">Subscriptions</SelectItem>
                                        <SelectItem value="users">User Activity</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Format</Label>
                                <Select value={customReportFormat} onValueChange={setCustomReportFormat}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="csv">CSV</SelectItem>
                                        <SelectItem value="json">JSON</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button 
                                className="w-full gradient-primary" 
                                onClick={handleGenerateCustomReport}
                                disabled={generatingReport === 'custom'}
                            >
                                {generatingReport === 'custom' ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
                                ) : (
                                    <><FileText className="mr-2 h-4 w-4" /> Generate Report</>
                                )}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">127</div>
                        <p className="text-xs text-green-500">+12% this month</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">48,250</div>
                        <p className="text-xs text-green-500">+8% this month</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Rs. 8.5M</div>
                        <p className="text-xs text-green-500">+15% vs last month</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12,450</div>
                        <p className="text-xs text-muted-foreground">Daily average</p>
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
                                placeholder="Search reports..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-[180px]">
                                <Filter className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Report Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="financial">Financial</SelectItem>
                                <SelectItem value="academic">Academic</SelectItem>
                                <SelectItem value="enrollment">Enrollment</SelectItem>
                                <SelectItem value="operational">Operational</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Reports Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Available Reports</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Report Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Frequency</TableHead>
                                <TableHead>Last Generated</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredReports.map((report) => (
                                <TableRow key={report.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                                {getTypeIcon(report.type)}
                                            </div>
                                            <span className="font-medium">{report.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{getTypeBadge(report.type)}</TableCell>
                                    <TableCell className="max-w-[300px] text-muted-foreground">
                                        {report.description}
                                    </TableCell>
                                    <TableCell className="capitalize">{report.frequency}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm">
                                            <Calendar className="h-3 w-3 text-muted-foreground" />
                                            {new Date(report.lastGenerated).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => handleGenerateReport(report.id, report.name)}
                                                disabled={generatingReport === report.id}
                                            >
                                                {generatingReport === report.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    'Generate'
                                                )}
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon"
                                                onClick={() => handleDownloadReport(report.id, report.name)}
                                            >
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </div>
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
