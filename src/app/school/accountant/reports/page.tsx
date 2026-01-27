'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
} from '@/components/ui/dialog'
import {
    FileText,
    Download,
    Calendar,
    TrendingUp,
    DollarSign,
    Users,
    BarChart3,
    PieChart,
    Loader2,
    Eye,
    Clock,
} from 'lucide-react'
import { toast } from 'sonner'

const reportTypes = [
    { id: 'income', name: 'Income Report', description: 'Fee collection and other income', icon: TrendingUp },
    { id: 'expense', name: 'Expense Report', description: 'All expenses and payments', icon: DollarSign },
    { id: 'salary', name: 'Salary Report', description: 'Staff salaries and allowances', icon: Users },
    { id: 'balance', name: 'Balance Sheet', description: 'Assets and liabilities', icon: BarChart3 },
    { id: 'profitloss', name: 'Profit & Loss', description: 'Revenue vs expenses', icon: PieChart },
    { id: 'daybook', name: 'Day Book', description: 'Daily transactions', icon: Calendar },
]

const recentReports = [
    { id: '1', name: 'Monthly Income Report - January 2024', generated: '2024-01-18', type: 'income' },
    { id: '2', name: 'Salary Summary - January 2024', generated: '2024-01-05', type: 'salary' },
    { id: '3', name: 'Expense Report - December 2023', generated: '2024-01-02', type: 'expense' },
    { id: '4', name: 'Balance Sheet - Q4 2023', generated: '2024-01-01', type: 'balance' },
]

// Sample report data for preview
const getSampleReportData = (type: string) => {
    switch (type) {
        case 'income':
            return {
                title: 'Income Report',
                summary: { totalIncome: 5850000, feeCollection: 5200000, otherIncome: 650000 },
                items: [
                    { description: 'Tuition Fee', amount: 4500000, percentage: 77 },
                    { description: 'Admission Fee', amount: 400000, percentage: 7 },
                    { description: 'Transport Fee', amount: 300000, percentage: 5 },
                    { description: 'Library Fee', amount: 150000, percentage: 3 },
                    { description: 'Lab Fee', amount: 350000, percentage: 6 },
                    { description: 'Other', amount: 150000, percentage: 2 },
                ]
            }
        case 'expense':
            return {
                title: 'Expense Report',
                summary: { totalExpenses: 4250000, salaries: 3200000, operations: 1050000 },
                items: [
                    { description: 'Staff Salaries', amount: 3200000, percentage: 75 },
                    { description: 'Utilities', amount: 350000, percentage: 8 },
                    { description: 'Maintenance', amount: 250000, percentage: 6 },
                    { description: 'Supplies', amount: 200000, percentage: 5 },
                    { description: 'Transport', amount: 180000, percentage: 4 },
                    { description: 'Other', amount: 70000, percentage: 2 },
                ]
            }
        default:
            return {
                title: reportTypes.find(r => r.id === type)?.name || 'Report',
                summary: { total: 0 },
                items: []
            }
    }
}

export default function AccountantReportsPage() {
    const [selectedReport, setSelectedReport] = useState<string>('')
    const [fromDate, setFromDate] = useState<string>('')
    const [toDate, setToDate] = useState<string>('')
    const [format, setFormat] = useState<string>('pdf')
    const [groupBy, setGroupBy] = useState<string>('daily')
    const [isGenerating, setIsGenerating] = useState(false)
    const [isPreviewOpen, setIsPreviewOpen] = useState(false)
    const [previewData, setPreviewData] = useState<ReturnType<typeof getSampleReportData> | null>(null)
    const [downloadingId, setDownloadingId] = useState<string | null>(null)

    const handlePreview = async () => {
        if (!selectedReport) {
            toast.error('Please select a report type')
            return
        }

        setIsGenerating(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            const data = getSampleReportData(selectedReport)
            setPreviewData(data)
            setIsPreviewOpen(true)
        } catch {
            toast.error('Failed to generate preview')
        } finally {
            setIsGenerating(false)
        }
    }

    const handleGenerateReport = async () => {
        if (!selectedReport) {
            toast.error('Please select a report type')
            return
        }

        if (!fromDate || !toDate) {
            toast.error('Please select date range')
            return
        }

        setIsGenerating(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1500))

            const reportName = reportTypes.find(r => r.id === selectedReport)?.name || 'Report'

            // Generate file content based on format
            let content: string
            let mimeType: string
            let extension: string

            if (format === 'csv') {
                content = 'Category,Amount,Percentage\nTuition Fee,4500000,77%\nAdmission Fee,400000,7%\nTransport Fee,300000,5%'
                mimeType = 'text/csv'
                extension = 'csv'
            } else if (format === 'excel') {
                // For demo, we'll use CSV with .xlsx extension
                content = 'Category,Amount,Percentage\nTuition Fee,4500000,77%\nAdmission Fee,400000,7%\nTransport Fee,300000,5%'
                mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                extension = 'xlsx'
            } else {
                // For PDF, we'll create a simple text representation
                content = `${reportName}\n\nDate Range: ${fromDate} to ${toDate}\n\nGenerated on: ${new Date().toLocaleDateString()}\n\nThis is a sample report.`
                mimeType = 'text/plain'
                extension = 'txt' // In real app, would be PDF
            }

            // Download file
            const blob = new Blob([content], { type: mimeType })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${reportName.replace(/\s+/g, '_')}_${fromDate}_to_${toDate}.${extension}`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            window.URL.revokeObjectURL(url)

            toast.success('Report generated successfully', {
                description: `${reportName} downloaded as ${format.toUpperCase()}`
            })
        } catch {
            toast.error('Failed to generate report')
        } finally {
            setIsGenerating(false)
        }
    }

    const handleDownloadRecent = async (reportId: string, reportName: string) => {
        setDownloadingId(reportId)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))

            const content = `${reportName}\n\nThis is a previously generated report.\n\nGenerated on: ${recentReports.find(r => r.id === reportId)?.generated}`
            const blob = new Blob([content], { type: 'text/plain' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${reportName.replace(/\s+/g, '_')}.txt`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            window.URL.revokeObjectURL(url)

            toast.success('Report downloaded')
        } catch {
            toast.error('Failed to download report')
        } finally {
            setDownloadingId(null)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
                    <p className="text-muted-foreground">
                        Generate and view financial reports
                    </p>
                </div>
            </div>

            {/* Report Types */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {reportTypes.map((report) => (
                    <Card
                        key={report.id}
                        className={`card-hover cursor-pointer transition-all ${selectedReport === report.id ? 'border-primary ring-2 ring-primary/20' : ''}`}
                        onClick={() => setSelectedReport(report.id)}
                    >
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${selectedReport === report.id ? 'bg-primary text-primary-foreground' : 'bg-primary/10'}`}>
                                    <report.icon className={`h-6 w-6 ${selectedReport === report.id ? '' : 'text-primary'}`} />
                                </div>
                                <div>
                                    <h3 className="font-medium">{report.name}</h3>
                                    <p className="text-sm text-muted-foreground">{report.description}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Report Generator */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Generate Report
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label>Report Type *</Label>
                            <Select value={selectedReport} onValueChange={setSelectedReport}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select report type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {reportTypes.map((report) => (
                                        <SelectItem key={report.id} value={report.id}>
                                            {report.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>From Date *</Label>
                            <Input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>To Date *</Label>
                            <Input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Format</Label>
                            <Select value={format} onValueChange={setFormat}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pdf">PDF</SelectItem>
                                    <SelectItem value="excel">Excel</SelectItem>
                                    <SelectItem value="csv">CSV</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Group By</Label>
                            <Select value={groupBy} onValueChange={setGroupBy}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" onClick={handlePreview} disabled={isGenerating || !selectedReport}>
                            {isGenerating ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Eye className="mr-2 h-4 w-4" />
                            )}
                            Preview
                        </Button>
                        <Button className="gradient-primary" onClick={handleGenerateReport} disabled={isGenerating}>
                            {isGenerating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Download className="mr-2 h-4 w-4" />
                                    Generate Report
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Reports */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Recent Reports
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {recentReports.map((report) => (
                            <div key={report.id} className="flex items-center justify-between p-3 rounded-lg border">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                        <FileText className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{report.name}</p>
                                        <p className="text-xs text-muted-foreground">Generated on {report.generated}</p>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDownloadRecent(report.id, report.name)}
                                    disabled={downloadingId === report.id}
                                >
                                    {downloadingId === report.id ? (
                                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                    ) : (
                                        <Download className="mr-1 h-3 w-3" />
                                    )}
                                    Download
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Preview Dialog */}
            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Report Preview - {previewData?.title}</DialogTitle>
                    </DialogHeader>
                    {previewData && (
                        <div className="space-y-4 py-4">
                            {/* Summary */}
                            <div className="grid grid-cols-3 gap-4">
                                {Object.entries(previewData.summary).map(([key, value]) => (
                                    <div key={key} className="p-3 bg-muted rounded-lg text-center">
                                        <p className="text-sm text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                        <p className="text-xl font-bold">Rs. {(value as number).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Items Table */}
                            {previewData.items.length > 0 && (
                                <div className="border rounded-lg">
                                    <table className="w-full">
                                        <thead className="bg-muted">
                                            <tr>
                                                <th className="text-left p-3 font-medium">Category</th>
                                                <th className="text-right p-3 font-medium">Amount</th>
                                                <th className="text-right p-3 font-medium">%</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {previewData.items.map((item, index) => (
                                                <tr key={index} className="border-t">
                                                    <td className="p-3">{item.description}</td>
                                                    <td className="p-3 text-right">Rs. {item.amount.toLocaleString()}</td>
                                                    <td className="p-3 text-right">{item.percentage}%</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
                                    Close
                                </Button>
                                <Button className="gradient-primary" onClick={() => {
                                    setIsPreviewOpen(false)
                                    handleGenerateReport()
                                }}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download Report
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
