'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Wallet,
    CreditCard,
    FileText,
    Users,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    CheckCircle,
    AlertCircle,
} from 'lucide-react'
import Link from 'next/link'

const stats = [
    {
        title: 'Total Revenue',
        value: 'Rs. 12.5M',
        change: '+18%',
        changeLabel: 'from last month',
        trend: 'up',
        icon: DollarSign,
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
    },
    {
        title: 'Pending Collection',
        value: 'Rs. 3.2M',
        change: '125',
        changeLabel: 'defaulters',
        trend: 'down',
        icon: Clock,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
    },
    {
        title: 'Expenses',
        value: 'Rs. 8.5M',
        change: '+5%',
        changeLabel: 'from last month',
        trend: 'up',
        icon: TrendingDown,
        color: 'text-red-500',
        bgColor: 'bg-red-500/10',
    },
    {
        title: 'Net Profit',
        value: 'Rs. 4.0M',
        change: '+22%',
        changeLabel: 'from last month',
        trend: 'up',
        icon: TrendingUp,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
    },
]

const recentTransactions = [
    { id: 'TXN-001', type: 'income', description: 'Fee Collection - Class 10-A', amount: 450000, date: '2024-01-18', status: 'completed' },
    { id: 'TXN-002', type: 'expense', description: 'Staff Salaries - January', amount: 2850000, date: '2024-01-05', status: 'completed' },
    { id: 'TXN-003', type: 'income', description: 'Admission Fees - New Students', amount: 250000, date: '2024-01-15', status: 'completed' },
    { id: 'TXN-004', type: 'expense', description: 'Electricity Bill', amount: 125000, date: '2024-01-10', status: 'completed' },
    { id: 'TXN-005', type: 'expense', description: 'Lab Equipment Purchase', amount: 350000, date: '2024-01-08', status: 'pending' },
]

const pendingTasks = [
    { task: 'Process salary for 12 pending staff', priority: 'high', due: 'Today' },
    { task: 'Generate fee challans for February', priority: 'medium', due: 'Jan 25' },
    { task: 'Submit monthly financial report', priority: 'high', due: 'Jan 31' },
    { task: 'Review vendor invoices', priority: 'low', due: 'Feb 5' },
]

export default function AccountantDashboard() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Accountant Dashboard</h1>
                    <p className="text-muted-foreground">
                        Financial overview and pending tasks
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" asChild>
                        <Link href="/school/accountant/reports">
                            <FileText className="mr-2 h-4 w-4" />
                            Financial Reports
                        </Link>
                    </Button>
                    <Button className="gradient-primary" asChild>
                        <Link href="/school/accountant/fees">
                            <DollarSign className="mr-2 h-4 w-4" />
                            Collect Fees
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card key={index} className="card-hover">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.bgColor}`}>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <div className="flex items-center text-xs">
                                {stat.trend === 'up' ? (
                                    <ArrowUpRight className={`mr-1 h-3 w-3 ${stat.title === 'Expenses' ? 'text-red-500' : 'text-green-500'}`} />
                                ) : (
                                    <ArrowDownRight className="mr-1 h-3 w-3 text-yellow-500" />
                                )}
                                <span className={stat.title === 'Expenses' ? 'text-red-500' : stat.trend === 'up' ? 'text-green-500' : 'text-yellow-500'}>
                                    {stat.change}
                                </span>
                                <span className="text-muted-foreground ml-1">{stat.changeLabel}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Recent Transactions */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Wallet className="h-5 w-5" />
                                    Recent Transactions
                                </CardTitle>
                                <CardDescription>Latest financial activities</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/school/accountant/transactions">View All</Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentTransactions.map((txn) => (
                                <div key={txn.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${txn.type === 'income' ? 'bg-green-500/10' : 'bg-red-500/10'
                                            }`}>
                                            {txn.type === 'income' ? (
                                                <ArrowUpRight className="h-5 w-5 text-green-500" />
                                            ) : (
                                                <ArrowDownRight className="h-5 w-5 text-red-500" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{txn.description}</p>
                                            <p className="text-xs text-muted-foreground">{txn.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-medium ${txn.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                                            {txn.type === 'income' ? '+' : '-'}Rs. {(txn.amount / 1000).toFixed(0)}K
                                        </p>
                                        {txn.status === 'pending' && (
                                            <Badge className="bg-yellow-500/10 text-yellow-500">Pending</Badge>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Pending Tasks */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5" />
                                    Pending Tasks
                                </CardTitle>
                                <CardDescription>Tasks requiring attention</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {pendingTasks.map((task, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${task.priority === 'high' ? 'bg-red-500/10' :
                                            task.priority === 'medium' ? 'bg-yellow-500/10' : 'bg-blue-500/10'
                                        }`}>
                                        <Clock className={`h-4 w-4 ${task.priority === 'high' ? 'text-red-500' :
                                                task.priority === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                                            }`} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">{task.task}</p>
                                        <p className="text-xs text-muted-foreground">Due: {task.due}</p>
                                    </div>
                                    <Badge
                                        className={
                                            task.priority === 'high' ? 'bg-red-500/10 text-red-500' :
                                                task.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-500' :
                                                    'bg-blue-500/10 text-blue-500'
                                        }
                                    >
                                        {task.priority}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-4">
                <Link href="/school/accountant/fees">
                    <Card className="card-hover cursor-pointer">
                        <CardContent className="pt-6 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 mx-auto mb-3">
                                <CreditCard className="h-6 w-6 text-green-500" />
                            </div>
                            <p className="font-medium">Fee Collection</p>
                            <p className="text-xs text-muted-foreground">Collect payments</p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/school/accountant/expenses">
                    <Card className="card-hover cursor-pointer">
                        <CardContent className="pt-6 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 mx-auto mb-3">
                                <TrendingDown className="h-6 w-6 text-red-500" />
                            </div>
                            <p className="font-medium">Expenses</p>
                            <p className="text-xs text-muted-foreground">Record expenses</p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/school/accountant/payroll">
                    <Card className="card-hover cursor-pointer">
                        <CardContent className="pt-6 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10 mx-auto mb-3">
                                <Users className="h-6 w-6 text-purple-500" />
                            </div>
                            <p className="font-medium">Payroll</p>
                            <p className="text-xs text-muted-foreground">Process salaries</p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/school/accountant/reports">
                    <Card className="card-hover cursor-pointer">
                        <CardContent className="pt-6 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 mx-auto mb-3">
                                <FileText className="h-6 w-6 text-blue-500" />
                            </div>
                            <p className="font-medium">Reports</p>
                            <p className="text-xs text-muted-foreground">Financial reports</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    )
}
