'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart'
import {
    Bar,
    BarChart,
    Line,
    LineChart,
    Pie,
    PieChart,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
} from 'recharts'

// Fee Collection Chart
interface FeeCollectionData {
    month: string
    collected: number
    pending: number
}

const feeCollectionConfig = {
    collected: {
        label: 'Collected',
        color: 'hsl(160, 84%, 39%)', // Emerald
    },
    pending: {
        label: 'Pending',
        color: 'hsl(38, 92%, 50%)', // Amber
    },
} satisfies ChartConfig

const defaultFeeData: FeeCollectionData[] = [
    { month: 'Sep', collected: 450000, pending: 120000 },
    { month: 'Oct', collected: 520000, pending: 95000 },
    { month: 'Nov', collected: 480000, pending: 110000 },
    { month: 'Dec', collected: 550000, pending: 85000 },
    { month: 'Jan', collected: 490000, pending: 140000 },
]

export function FeeCollectionChart({ data = defaultFeeData }: { data?: FeeCollectionData[] }) {
    return (
        <ChartContainer config={feeCollectionConfig} className="h-[300px]">
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={(value) => `${value / 1000}k`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="collected" fill="var(--color-collected)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" fill="var(--color-pending)" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ChartContainer>
    )
}

// Attendance Trend Chart
interface AttendanceData {
    day: string
    present: number
    absent: number
}

const attendanceConfig = {
    present: {
        label: 'Present',
        color: 'hsl(160, 84%, 39%)',
    },
    absent: {
        label: 'Absent',
        color: 'hsl(0, 84%, 60%)',
    },
} satisfies ChartConfig

const defaultAttendanceData: AttendanceData[] = [
    { day: 'Mon', present: 95, absent: 5 },
    { day: 'Tue', present: 92, absent: 8 },
    { day: 'Wed', present: 88, absent: 12 },
    { day: 'Thu', present: 94, absent: 6 },
    { day: 'Fri', present: 90, absent: 10 },
]

export function AttendanceTrendChart({ data = defaultAttendanceData }: { data?: AttendanceData[] }) {
    return (
        <ChartContainer config={attendanceConfig} className="h-[300px]">
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" className="text-xs" />
                <YAxis className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="present"
                    stroke="var(--color-present)"
                    strokeWidth={2}
                    dot={{ fill: 'var(--color-present)' }}
                />
                <Line
                    type="monotone"
                    dataKey="absent"
                    stroke="var(--color-absent)"
                    strokeWidth={2}
                    dot={{ fill: 'var(--color-absent)' }}
                />
            </LineChart>
        </ChartContainer>
    )
}

// Student Distribution by Class Pie Chart
interface ClassDistribution {
    name: string
    value: number
}

const COLORS = [
    'hsl(160, 84%, 39%)',
    'hsl(200, 84%, 45%)',
    'hsl(260, 84%, 55%)',
    'hsl(38, 92%, 50%)',
    'hsl(0, 84%, 60%)',
    'hsl(320, 84%, 50%)',
]

const defaultClassData: ClassDistribution[] = [
    { name: 'Class 6', value: 45 },
    { name: 'Class 7', value: 52 },
    { name: 'Class 8', value: 48 },
    { name: 'Class 9', value: 38 },
    { name: 'Class 10', value: 42 },
]

export function ClassDistributionChart({ data = defaultClassData }: { data?: ClassDistribution[] }) {
    return (
        <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={false}
                    >
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <ChartTooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}

// Inquiry Funnel Chart
interface InquiryFunnelData {
    stage: string
    count: number
    fill: string
}

export function InquiryFunnelChart({ data }: { data: InquiryFunnelData[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Admission Funnel</CardTitle>
                <CardDescription>Inquiry to admission conversion</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {data.map((item, index) => {
                        const percentage = (item.count / data[0].count) * 100
                        return (
                            <div key={item.stage} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">{item.stage}</span>
                                    <span className="text-muted-foreground">{item.count}</span>
                                </div>
                                <div className="h-3 rounded-full bg-muted overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{
                                            width: `${percentage}%`,
                                            backgroundColor: item.fill,
                                        }}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}

// Revenue Chart for Super Admin
interface RevenueData {
    month: string
    revenue: number
    schools: number
}

const revenueConfig = {
    revenue: {
        label: 'Revenue (PKR)',
        color: 'hsl(160, 84%, 39%)',
    },
} satisfies ChartConfig

export function RevenueChart({ data }: { data: RevenueData[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Monthly Recurring Revenue</CardTitle>
                <CardDescription>Platform revenue over time (in PKR)</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={revenueConfig} className="h-[300px]">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis className="text-xs" tickFormatter={(value) => `${value / 1000}k`} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="var(--color-revenue)"
                            strokeWidth={3}
                            dot={{ fill: 'var(--color-revenue)', strokeWidth: 2 }}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
