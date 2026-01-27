'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
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
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
    Plus,
    Calendar,
    Trash2,
    ListTodo,
    AlertCircle,
    CheckCircle2,
    Clock,
    Loader2
} from 'lucide-react'
import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns'

interface Todo {
    id: string
    title: string
    description: string | null
    due_date: string | null
    priority: 'low' | 'medium' | 'high'
    category: string
    status: 'pending' | 'in_progress' | 'completed'
    completed_at: string | null
    created_at: string
}

interface TodoWidgetProps {
    compact?: boolean
    maxItems?: number
    showAddButton?: boolean
    className?: string
}

const priorityColors = {
    low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    high: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
}

const categoryColors: Record<string, string> = {
    general: 'bg-gray-100 text-gray-700',
    academic: 'bg-purple-100 text-purple-700',
    fees: 'bg-green-100 text-green-700',
    meeting: 'bg-orange-100 text-orange-700',
    deadline: 'bg-red-100 text-red-700',
    personal: 'bg-cyan-100 text-cyan-700'
}

export function TodoWidget({ compact = false, maxItems = 10, showAddButton = true, className = '' }: TodoWidgetProps) {
    const [todos, setTodos] = useState<Todo[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending')
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [newTodo, setNewTodo] = useState({
        title: '',
        description: '',
        due_date: '',
        priority: 'medium' as const,
        category: 'general'
    })
    const [submitting, setSubmitting] = useState(false)

    const fetchTodos = useCallback(async () => {
        try {
            const res = await fetch(`/api/todos?status=${filter}&limit=${maxItems}`)
            if (res.ok) {
                const data = await res.json()
                setTodos(data.todos || [])
            }
        } catch (error) {
            console.error('Failed to fetch todos:', error)
        } finally {
            setLoading(false)
        }
    }, [filter, maxItems])

    useEffect(() => {
        fetchTodos()
    }, [fetchTodos])

    const handleAddTodo = async () => {
        if (!newTodo.title.trim()) return

        setSubmitting(true)
        try {
            const res = await fetch('/api/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTodo)
            })

            if (res.ok) {
                setNewTodo({ title: '', description: '', due_date: '', priority: 'medium', category: 'general' })
                setIsAddDialogOpen(false)
                fetchTodos()
            }
        } catch (error) {
            console.error('Failed to add todo:', error)
        } finally {
            setSubmitting(false)
        }
    }

    const handleToggleComplete = async (todo: Todo) => {
        const newStatus = todo.status === 'completed' ? 'pending' : 'completed'
        
        // Optimistic update
        setTodos(prev => prev.map(t => 
            t.id === todo.id ? { ...t, status: newStatus } : t
        ))

        try {
            const res = await fetch(`/api/todos/${todo.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })

            if (!res.ok) {
                // Revert on error
                setTodos(prev => prev.map(t => 
                    t.id === todo.id ? { ...t, status: todo.status } : t
                ))
            }
        } catch (error) {
            console.error('Failed to update todo:', error)
            setTodos(prev => prev.map(t => 
                t.id === todo.id ? { ...t, status: todo.status } : t
            ))
        }
    }

    const handleDelete = async (id: string) => {
        setTodos(prev => prev.filter(t => t.id !== id))

        try {
            await fetch(`/api/todos/${id}`, { method: 'DELETE' })
        } catch (error) {
            console.error('Failed to delete todo:', error)
            fetchTodos()
        }
    }

    const formatDueDate = (dateStr: string | null) => {
        if (!dateStr) return null
        const date = parseISO(dateStr)
        if (isToday(date)) return 'Today'
        if (isTomorrow(date)) return 'Tomorrow'
        return format(date, 'MMM d')
    }

    const getDueDateColor = (dateStr: string | null, status: string) => {
        if (!dateStr || status === 'completed') return 'text-muted-foreground'
        const date = parseISO(dateStr)
        if (isPast(date) && !isToday(date)) return 'text-red-500'
        if (isToday(date)) return 'text-orange-500'
        return 'text-muted-foreground'
    }

    const pendingCount = todos.filter(t => t.status !== 'completed').length
    const completedCount = todos.filter(t => t.status === 'completed').length

    return (
        <Card className={className}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <ListTodo className="h-5 w-5" />
                        My Tasks
                        {pendingCount > 0 && (
                            <Badge variant="secondary" className="ml-1">
                                {pendingCount}
                            </Badge>
                        )}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        {!compact && (
                            <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
                                <SelectTrigger className="w-[110px] h-8">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                        {showAddButton && (
                            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm" variant="outline">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add New Task</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 pt-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="title">Title *</Label>
                                            <Input
                                                id="title"
                                                placeholder="What needs to be done?"
                                                value={newTodo.title}
                                                onChange={(e) => setNewTodo(prev => ({ ...prev, title: e.target.value }))}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="description">Description</Label>
                                            <Textarea
                                                id="description"
                                                placeholder="Add details..."
                                                value={newTodo.description}
                                                onChange={(e) => setNewTodo(prev => ({ ...prev, description: e.target.value }))}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="due_date">Due Date</Label>
                                                <Input
                                                    id="due_date"
                                                    type="date"
                                                    value={newTodo.due_date}
                                                    onChange={(e) => setNewTodo(prev => ({ ...prev, due_date: e.target.value }))}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Priority</Label>
                                                <Select 
                                                    value={newTodo.priority} 
                                                    onValueChange={(v: any) => setNewTodo(prev => ({ ...prev, priority: v }))}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="low">Low</SelectItem>
                                                        <SelectItem value="medium">Medium</SelectItem>
                                                        <SelectItem value="high">High</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Category</Label>
                                            <Select 
                                                value={newTodo.category} 
                                                onValueChange={(v) => setNewTodo(prev => ({ ...prev, category: v }))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="general">General</SelectItem>
                                                    <SelectItem value="academic">Academic</SelectItem>
                                                    <SelectItem value="fees">Fees</SelectItem>
                                                    <SelectItem value="meeting">Meeting</SelectItem>
                                                    <SelectItem value="deadline">Deadline</SelectItem>
                                                    <SelectItem value="personal">Personal</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Button 
                                            className="w-full" 
                                            onClick={handleAddTodo}
                                            disabled={submitting || !newTodo.title.trim()}
                                        >
                                            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                                            Add Task
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : todos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                        <CheckCircle2 className="h-10 w-10 mb-2 opacity-50" />
                        <p className="text-sm">
                            {filter === 'completed' ? 'No completed tasks' : 'No pending tasks'}
                        </p>
                        {filter === 'pending' && showAddButton && (
                            <Button 
                                variant="link" 
                                size="sm" 
                                onClick={() => setIsAddDialogOpen(true)}
                            >
                                Add your first task
                            </Button>
                        )}
                    </div>
                ) : (
                    <ScrollArea className={compact ? 'h-[200px]' : 'h-[300px]'}>
                        <div className="space-y-2">
                            {todos.map((todo) => (
                                <div
                                    key={todo.id}
                                    className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                                        todo.status === 'completed' 
                                            ? 'bg-muted/50 opacity-60' 
                                            : 'hover:bg-muted/50'
                                    }`}
                                >
                                    <Checkbox
                                        checked={todo.status === 'completed'}
                                        onCheckedChange={() => handleToggleComplete(todo)}
                                        className="mt-0.5"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className={`font-medium text-sm ${
                                                todo.status === 'completed' ? 'line-through' : ''
                                            }`}>
                                                {todo.title}
                                            </p>
                                            <Badge variant="outline" className={`text-xs ${priorityColors[todo.priority]}`}>
                                                {todo.priority}
                                            </Badge>
                                        </div>
                                        {!compact && todo.description && (
                                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                                {todo.description}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-2 mt-1.5">
                                            {todo.due_date && (
                                                <span className={`flex items-center gap-1 text-xs ${getDueDateColor(todo.due_date, todo.status)}`}>
                                                    <Calendar className="h-3 w-3" />
                                                    {formatDueDate(todo.due_date)}
                                                </span>
                                            )}
                                            <Badge variant="outline" className={`text-xs ${categoryColors[todo.category] || categoryColors.general}`}>
                                                {todo.category}
                                            </Badge>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                        onClick={() => handleDelete(todo.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                )}
                {!compact && (completedCount > 0 || pendingCount > 0) && (
                    <div className="flex items-center justify-between mt-4 pt-3 border-t text-xs text-muted-foreground">
                        <span>{pendingCount} pending</span>
                        <span>{completedCount} completed</span>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default TodoWidget
