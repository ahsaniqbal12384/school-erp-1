'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
    FileText,
    Plus,
    Search,
    Download,
    GraduationCap,
    DollarSign,
    CheckCircle,
    AlertCircle,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function BulkGeneratePage() {
    const [selectedClass, setSelectedClass] = useState<string>('')
    const [selectedMonth, setSelectedMonth] = useState<string>('')
    const [isGenerating, setIsGenerating] = useState(false)
    const [generationComplete, setGenerationComplete] = useState(false)

    const classes = [
        { id: '1', name: 'Class 1-A', students: 35, feeAmount: 8000 },
        { id: '2', name: 'Class 1-B', students: 32, feeAmount: 8000 },
        { id: '3', name: 'Class 2-A', students: 38, feeAmount: 8500 },
        { id: '4', name: 'Class 3-A', students: 40, feeAmount: 9000 },
        { id: '5', name: 'Class 4-A', students: 36, feeAmount: 9500 },
        { id: '6', name: 'Class 5-A', students: 42, feeAmount: 10000 },
        { id: '7', name: 'Class 6-A', students: 38, feeAmount: 11000 },
        { id: '8', name: 'Class 7-A', students: 35, feeAmount: 11500 },
        { id: '9', name: 'Class 8-A', students: 40, feeAmount: 12000 },
        { id: '10', name: 'Class 9-A', students: 45, feeAmount: 13000 },
        { id: '11', name: 'Class 10-A', students: 42, feeAmount: 15000 },
    ]

    const handleGenerate = () => {
        setIsGenerating(true)
        setTimeout(() => {
            setIsGenerating(false)
            setGenerationComplete(true)
        }, 2000)
    }

    const totalStudents = classes.reduce((acc, c) => acc + c.students, 0)
    const totalAmount = classes.reduce((acc, c) => acc + c.students * c.feeAmount, 0)

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Bulk Generate Challans</h1>
                    <p className="text-muted-foreground">
                        Generate fee challans for multiple students at once
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalStudents}</div>
                        <p className="text-xs text-muted-foreground">Across all classes</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{classes.length}</div>
                        <p className="text-xs text-muted-foreground">Active classes</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Expected Collection</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">Rs. {(totalAmount / 1000000).toFixed(1)}M</div>
                        <p className="text-xs text-muted-foreground">Monthly target</p>
                    </CardContent>
                </Card>
            </div>

            {/* Generation Form */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Plus className="h-5 w-5" />
                        Generate Challans
                    </CardTitle>
                    <CardDescription>Select class and month to generate fee challans</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label>Select Class</Label>
                            <Select value={selectedClass} onValueChange={setSelectedClass}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select class" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Classes</SelectItem>
                                    {classes.map((cls) => (
                                        <SelectItem key={cls.id} value={cls.id}>
                                            {cls.name} ({cls.students} students)
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Fee Month</Label>
                            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select month" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="jan-2024">January 2024</SelectItem>
                                    <SelectItem value="feb-2024">February 2024</SelectItem>
                                    <SelectItem value="mar-2024">March 2024</SelectItem>
                                    <SelectItem value="apr-2024">April 2024</SelectItem>
                                    <SelectItem value="may-2024">May 2024</SelectItem>
                                    <SelectItem value="jun-2024">June 2024</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Due Date</Label>
                            <Input type="date" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label>Fee Components (Auto-calculated)</Label>
                        <div className="grid gap-4 md:grid-cols-4">
                            <div className="p-4 rounded-lg border bg-muted/50">
                                <p className="text-sm text-muted-foreground">Tuition Fee</p>
                                <p className="text-lg font-bold">Varies by class</p>
                            </div>
                            <div className="p-4 rounded-lg border bg-muted/50">
                                <p className="text-sm text-muted-foreground">Computer Lab</p>
                                <p className="text-lg font-bold">Rs. 500</p>
                            </div>
                            <div className="p-4 rounded-lg border bg-muted/50">
                                <p className="text-sm text-muted-foreground">Library Fee</p>
                                <p className="text-lg font-bold">Rs. 200</p>
                            </div>
                            <div className="p-4 rounded-lg border bg-muted/50">
                                <p className="text-sm text-muted-foreground">Sports Fee</p>
                                <p className="text-lg font-bold">Rs. 300</p>
                            </div>
                        </div>
                    </div>

                    {generationComplete && (
                        <Card className="border-green-500/50 bg-green-500/5">
                            <CardContent className="py-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                                        <CheckCircle className="h-6 w-6 text-green-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-green-500">Challans Generated Successfully!</p>
                                        <p className="text-sm text-muted-foreground">
                                            {totalStudents} challans have been generated for January 2024
                                        </p>
                                    </div>
                                    <Button variant="outline">
                                        <Download className="mr-2 h-4 w-4" />
                                        Download All
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <div className="flex justify-end gap-3">
                        <Button variant="outline">Preview</Button>
                        <Button
                            className="gradient-primary"
                            onClick={handleGenerate}
                            disabled={isGenerating || !selectedClass || !selectedMonth}
                        >
                            {isGenerating ? (
                                <>Generating...</>
                            ) : (
                                <>
                                    <FileText className="mr-2 h-4 w-4" />
                                    Generate Challans
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Class-wise Breakdown */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        Class-wise Fee Structure
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {classes.map((cls) => (
                            <div key={cls.id} className="p-4 rounded-lg border hover:border-primary/50 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-medium">{cls.name}</h3>
                                    <Badge variant="outline">{cls.students} students</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Monthly Fee</span>
                                    <span className="font-bold">Rs. {cls.feeAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                    <span className="text-sm text-muted-foreground">Total Expected</span>
                                    <span className="text-green-500 font-medium">
                                        Rs. {(cls.students * cls.feeAmount).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
