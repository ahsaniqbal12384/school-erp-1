'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
    FileText,
    Search,
    Download,
    Calendar,
    TrendingUp,
    DollarSign,
    Users,
    BarChart3,
    PieChart,
} from 'lucide-react'

const reportTypes = [
    { id: 'income', name: 'Income Report', description: 'Fee collection and other income', icon: TrendingUp },
    { id: 'expense', name: 'Expense Report', description: 'All expenses and payments', icon: DollarSign },
    { id: 'salary', name: 'Salary Report', description: 'Staff salaries and allowances', icon: Users },
    { id: 'balance', name: 'Balance Sheet', description: 'Assets and liabilities', icon: BarChart3 },
    { id: 'profitloss', name: 'Profit & Loss', description: 'Revenue vs expenses', icon: PieChart },
    { id: 'daybook', name: 'Day Book', description: 'Daily transactions', icon: Calendar },
]

const recentReports = [
    { name: 'Monthly Income Report - January 2024', generated: '2024-01-18', type: 'income' },
    { name: 'Salary Summary - January 2024', generated: '2024-01-05', type: 'salary' },
    { name: 'Expense Report - December 2023', generated: '2024-01-02', type: 'expense' },
    { name: 'Balance Sheet - Q4 2023', generated: '2024-01-01', type: 'balance' },
]

export default function AccountantReportsPage() {
    const [selectedReport, setSelectedReport] = useState<string>('')

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
                        className={`card-hover cursor-pointer ${selectedReport === report.id ? 'border-primary' : ''}`}
                        onClick={() => setSelectedReport(report.id)}
                    >
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                    <report.icon className="h-6 w-6 text-primary" />
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
                            <Label>Report Type</Label>
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
                            <Label>From Date</Label>
                            <Input type="date" />
                        </div>
                        <div className="space-y-2">
                            <Label>To Date</Label>
                            <Input type="date" />
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Format</Label>
                            <Select defaultValue="pdf">
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
                            <Select defaultValue="daily">
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
                        <Button variant="outline">Preview</Button>
                        <Button className="gradient-primary">
                            <Download className="mr-2 h-4 w-4" />
                            Generate Report
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
                        {recentReports.map((report, index) => (
                            <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                        <FileText className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{report.name}</p>
                                        <p className="text-xs text-muted-foreground">Generated on {report.generated}</p>
                                    </div>
                                </div>
                                <Button size="sm" variant="outline">
                                    <Download className="mr-1 h-3 w-3" />
                                    Download
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function Clock(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    )
}
