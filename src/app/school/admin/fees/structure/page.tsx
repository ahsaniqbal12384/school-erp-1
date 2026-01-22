'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
    DollarSign,
    Plus,
    Edit,
    Trash2,
    Building2,
    GraduationCap,
    MoreHorizontal,
    Settings,
    Save,
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface FeeComponent {
    id: string
    name: string
    amount: number
    type: 'monthly' | 'annual' | 'one-time'
    optional: boolean
}

interface ClassFeeStructure {
    id: string
    className: string
    tuitionFee: number
    components: FeeComponent[]
    totalMonthly: number
    totalAnnual: number
}

const sampleFeeStructures: ClassFeeStructure[] = [
    {
        id: '1',
        className: 'Pre-Nursery',
        tuitionFee: 8000,
        components: [
            { id: '1', name: 'Tuition Fee', amount: 8000, type: 'monthly', optional: false },
            { id: '2', name: 'Activity Fee', amount: 500, type: 'monthly', optional: false },
            { id: '3', name: 'Transport Fee', amount: 3000, type: 'monthly', optional: true },
        ],
        totalMonthly: 11500,
        totalAnnual: 138000,
    },
    {
        id: '2',
        className: 'Nursery - Prep',
        tuitionFee: 10000,
        components: [
            { id: '1', name: 'Tuition Fee', amount: 10000, type: 'monthly', optional: false },
            { id: '2', name: 'Activity Fee', amount: 500, type: 'monthly', optional: false },
            { id: '3', name: 'Lab Fee', amount: 300, type: 'monthly', optional: false },
            { id: '4', name: 'Transport Fee', amount: 3500, type: 'monthly', optional: true },
        ],
        totalMonthly: 14300,
        totalAnnual: 171600,
    },
    {
        id: '3',
        className: 'Class 1 - 5',
        tuitionFee: 12000,
        components: [
            { id: '1', name: 'Tuition Fee', amount: 12000, type: 'monthly', optional: false },
            { id: '2', name: 'Activity Fee', amount: 600, type: 'monthly', optional: false },
            { id: '3', name: 'Computer Lab', amount: 500, type: 'monthly', optional: false },
            { id: '4', name: 'Science Lab', amount: 400, type: 'monthly', optional: false },
            { id: '5', name: 'Transport Fee', amount: 4000, type: 'monthly', optional: true },
        ],
        totalMonthly: 17500,
        totalAnnual: 210000,
    },
    {
        id: '4',
        className: 'Class 6 - 8',
        tuitionFee: 14000,
        components: [
            { id: '1', name: 'Tuition Fee', amount: 14000, type: 'monthly', optional: false },
            { id: '2', name: 'Activity Fee', amount: 700, type: 'monthly', optional: false },
            { id: '3', name: 'Computer Lab', amount: 600, type: 'monthly', optional: false },
            { id: '4', name: 'Science Lab', amount: 500, type: 'monthly', optional: false },
            { id: '5', name: 'Library Fee', amount: 300, type: 'monthly', optional: false },
            { id: '6', name: 'Transport Fee', amount: 4500, type: 'monthly', optional: true },
        ],
        totalMonthly: 20600,
        totalAnnual: 247200,
    },
    {
        id: '5',
        className: 'Class 9 - 10 (Matric)',
        tuitionFee: 16000,
        components: [
            { id: '1', name: 'Tuition Fee', amount: 16000, type: 'monthly', optional: false },
            { id: '2', name: 'Activity Fee', amount: 800, type: 'monthly', optional: false },
            { id: '3', name: 'Computer Lab', amount: 700, type: 'monthly', optional: false },
            { id: '4', name: 'Science Lab', amount: 600, type: 'monthly', optional: false },
            { id: '5', name: 'Board Exam Fee', amount: 5000, type: 'annual', optional: false },
            { id: '6', name: 'Transport Fee', amount: 5000, type: 'monthly', optional: true },
        ],
        totalMonthly: 23100,
        totalAnnual: 277200,
    },
]

const annualCharges = [
    { name: 'Admission Fee', amount: 25000, description: 'One-time at admission' },
    { name: 'Registration Fee', amount: 5000, description: 'One-time at admission' },
    { name: 'Annual Fund', amount: 10000, description: 'Yearly in April' },
    { name: 'Sports Fee', amount: 3000, description: 'Yearly' },
    { name: 'Examination Fee', amount: 2000, description: 'Per term' },
]

export default function FeeStructurePage() {
    const [structures] = useState<ClassFeeStructure[]>(sampleFeeStructures)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Fee Structure</h1>
                    <p className="text-muted-foreground">
                        Configure fee structure for all classes
                    </p>
                </div>
                <div className="flex gap-3">
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gradient-primary">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Fee Category
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Add New Fee Category</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label>Category Name</Label>
                                    <Input placeholder="e.g., Sports Fee" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Amount (PKR)</Label>
                                        <Input type="number" placeholder="0" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Type</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="monthly">Monthly</SelectItem>
                                                <SelectItem value="annual">Annual</SelectItem>
                                                <SelectItem value="one-time">One-Time</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Applicable Classes</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select classes" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Classes</SelectItem>
                                            <SelectItem value="primary">Primary (1-5)</SelectItem>
                                            <SelectItem value="middle">Middle (6-8)</SelectItem>
                                            <SelectItem value="matric">Matric (9-10)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button className="gradient-primary" onClick={() => setIsAddDialogOpen(false)}>
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Category
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Fee Categories</CardTitle>
                        <Settings className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8</div>
                        <p className="text-xs text-muted-foreground">Active categories</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Class Groups</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{structures.length}</div>
                        <p className="text-xs text-muted-foreground">Different structures</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Monthly Fee</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            Rs. {Math.round(structures.reduce((acc, s) => acc + s.totalMonthly, 0) / structures.length).toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">Across all classes</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Jan 2024</div>
                        <p className="text-xs text-muted-foreground">Academic year</p>
                    </CardContent>
                </Card>
            </div>

            {/* Class-wise Fee Structure */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Class-wise Fee Structure
                    </CardTitle>
                    <CardDescription>Monthly fee breakdown for each class group</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Class Group</TableHead>
                                <TableHead className="text-right">Tuition Fee</TableHead>
                                <TableHead className="text-right">Other Charges</TableHead>
                                <TableHead className="text-right">Total Monthly</TableHead>
                                <TableHead className="text-right">Total Annual</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {structures.map((structure) => (
                                <TableRow key={structure.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                                <GraduationCap className="h-5 w-5 text-primary" />
                                            </div>
                                            <span className="font-medium">{structure.className}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        Rs. {structure.tuitionFee.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        Rs. {(structure.totalMonthly - structure.tuitionFee).toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        Rs. {structure.totalMonthly.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-primary">
                                        Rs. {structure.totalAnnual.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit Structure
                                                </DropdownMenuItem>
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

            {/* Annual & One-Time Charges */}
            <Card>
                <CardHeader>
                    <CardTitle>Annual & One-Time Charges</CardTitle>
                    <CardDescription>Charges applicable once per year or at admission</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {annualCharges.map((charge, index) => (
                            <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                                <div>
                                    <p className="font-medium">{charge.name}</p>
                                    <p className="text-xs text-muted-foreground">{charge.description}</p>
                                </div>
                                <Badge variant="outline" className="text-lg font-bold">
                                    Rs. {charge.amount.toLocaleString()}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
