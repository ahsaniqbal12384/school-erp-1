import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { type LucideIcon } from 'lucide-react'

interface StatCardProps {
    title: string
    value: string | number
    change?: {
        value: number
        type: 'increase' | 'decrease' | 'neutral'
    }
    trend?: {
        value: number
        type?: 'increase' | 'decrease' | 'neutral'
        label?: string
        positive?: boolean
    }
    icon: LucideIcon
    iconColor?: string
    description?: string
    className?: string
}

export function StatCard({
    title,
    value,
    change,
    trend,
    icon: Icon,
    iconColor = 'text-primary',
    description,
    className,
}: StatCardProps) {
    const displayChange = change || trend
    const hasPercentage = displayChange?.type != null
    return (
        <Card className={cn('stat-card card-shine group', className)}>
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <p className="text-3xl font-bold tracking-tight">{value}</p>
                        {displayChange && hasPercentage && (
                            <div className="flex items-center gap-1 text-sm">
                                <span
                                    className={cn(
                                        'font-medium',
                                        displayChange.type === 'increase' && 'text-emerald-600',
                                        displayChange.type === 'decrease' && 'text-red-600',
                                        displayChange.type === 'neutral' && 'text-muted-foreground'
                                    )}
                                >
                                    {displayChange.type === 'increase' && '+'}
                                    {displayChange.type === 'decrease' && '-'}
                                    {displayChange.value}%
                                </span>
                                <span className="text-muted-foreground">vs last month</span>
                            </div>
                        )}
                        {displayChange && !hasPercentage && displayChange.label && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <span className="font-medium">{displayChange.value}</span>
                                <span>{displayChange.label}</span>
                            </div>
                        )}
                        {description && (
                            <p className="text-sm text-muted-foreground">{description}</p>
                        )}
                    </div>
                    <div
                        className={cn(
                            'flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3',
                            iconColor === 'text-emerald-600' && 'bg-emerald-500/10',
                            iconColor === 'text-blue-600' && 'bg-blue-500/10',
                            iconColor === 'text-amber-600' && 'bg-amber-500/10',
                            iconColor === 'text-purple-600' && 'bg-purple-500/10',
                            iconColor === 'text-red-600' && 'bg-red-500/10'
                        )}
                    >
                        <Icon className={cn('h-6 w-6 transition-transform duration-300', iconColor)} />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

interface CurrencyStatCardProps {
    title: string
    value: number
    change?: {
        value: number
        type: 'increase' | 'decrease' | 'neutral'
    }
    trend?: {
        value: number
        type?: 'increase' | 'decrease' | 'neutral'
        label?: string
        positive?: boolean
    }
    icon: LucideIcon
    iconColor?: string
    className?: string
}

export function CurrencyStatCard({
    title,
    value,
    change,
    trend,
    icon: Icon,
    iconColor = 'text-primary',
    className,
}: CurrencyStatCardProps) {
    const formattedValue = new Intl.NumberFormat('en-PK', {
        style: 'currency',
        currency: 'PKR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value)

    const displayChange = change || trend
    const hasPercentage = displayChange?.type != null

    return (
        <Card className={cn('stat-card card-shine group', className)}>
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <p className="text-2xl font-bold tracking-tight">{formattedValue}</p>
                        {displayChange && hasPercentage && (
                            <div className="flex items-center gap-1 text-sm">
                                <span
                                    className={cn(
                                        'font-medium',
                                        displayChange.type === 'increase' && 'text-emerald-600',
                                        displayChange.type === 'decrease' && 'text-red-600',
                                        displayChange.type === 'neutral' && 'text-muted-foreground'
                                    )}
                                >
                                    {displayChange.type === 'increase' && '+'}
                                    {displayChange.type === 'decrease' && '-'}
                                    {displayChange.value}%
                                </span>
                                <span className="text-muted-foreground">vs last month</span>
                            </div>
                        )}
                        {displayChange && !hasPercentage && displayChange.label && (
                            <div className={cn(
                                "flex items-center gap-1 text-sm",
                                displayChange.positive === true && 'text-emerald-600',
                                displayChange.positive === false && 'text-red-600',
                                displayChange.positive === undefined && 'text-muted-foreground'
                            )}>
                                <span className="font-medium">{displayChange.value}</span>
                                <span>{displayChange.label}</span>
                            </div>
                        )}
                    </div>
                    <div
                        className={cn(
                            'flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3',
                            iconColor === 'text-emerald-600' && 'bg-emerald-500/10',
                            iconColor === 'text-blue-600' && 'bg-blue-500/10',
                            iconColor === 'text-amber-600' && 'bg-amber-500/10',
                            iconColor === 'text-purple-600' && 'bg-purple-500/10'
                        )}
                    >
                        <Icon className={cn('h-6 w-6 transition-transform duration-300', iconColor)} />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

interface MiniStatCardProps {
    title: string
    value: string | number
    trend?: 'up' | 'down' | 'neutral'
    className?: string
}

export function MiniStatCard({ title, value, trend, className }: MiniStatCardProps) {
    return (
        <div className={cn('rounded-lg bg-muted/50 p-4', className)}>
            <p className="text-sm text-muted-foreground">{title}</p>
            <div className="mt-1 flex items-baseline gap-2">
                <p className="text-2xl font-semibold">{value}</p>
                {trend && (
                    <span
                        className={cn(
                            'text-xs font-medium',
                            trend === 'up' && 'text-emerald-600',
                            trend === 'down' && 'text-red-600',
                            trend === 'neutral' && 'text-muted-foreground'
                        )}
                    >
                        {trend === 'up' && '↑'}
                        {trend === 'down' && '↓'}
                        {trend === 'neutral' && '→'}
                    </span>
                )}
            </div>
        </div>
    )
}
