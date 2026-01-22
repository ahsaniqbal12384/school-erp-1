'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    FileText,
    Calendar,
    BookOpen,
    User,
    Clock,
} from 'lucide-react'

interface DiaryEntry {
    id: string
    childName: string
    class: string
    date: string
    subject: string
    teacher: string
    topic: string
    description: string
    homework: string
}

const sampleDiary: DiaryEntry[] = [
    {
        id: '1',
        childName: 'Ahmed Khan',
        class: 'Class 10-A',
        date: '2024-01-20',
        subject: 'Mathematics',
        teacher: 'Mr. Imran Ali',
        topic: 'Quadratic Equations',
        description: 'Introduction to quadratic equations. Learned standard form ax² + bx + c = 0 and factorization method.',
        homework: 'Exercise 4.1, Questions 1-10',
    },
    {
        id: '2',
        childName: 'Ahmed Khan',
        class: 'Class 10-A',
        date: '2024-01-20',
        subject: 'Physics',
        teacher: 'Dr. Sana Malik',
        topic: 'Motion in Straight Line',
        description: 'Covered velocity-time graphs and calculating displacement from graphs.',
        homework: 'Draw v-t graphs for given scenarios',
    },
    {
        id: '3',
        childName: 'Ahmed Khan',
        class: 'Class 10-A',
        date: '2024-01-19',
        subject: 'English',
        teacher: 'Mrs. Ayesha Khan',
        topic: 'Essay Writing Techniques',
        description: 'Discussed structure of argumentative essays - introduction, body paragraphs, and conclusion.',
        homework: 'Write introduction for Climate Change essay',
    },
    {
        id: '4',
        childName: 'Fatima Khan',
        class: 'Class 7-B',
        date: '2024-01-20',
        subject: 'Mathematics',
        teacher: 'Mr. Hassan Raza',
        topic: 'Fractions',
        description: 'Converting between fractions and decimals. Practice problems on addition of fractions.',
        homework: 'Exercise 2.3, Questions 1-15',
    },
    {
        id: '5',
        childName: 'Fatima Khan',
        class: 'Class 7-B',
        date: '2024-01-20',
        subject: 'Science',
        teacher: 'Ms. Fatima Noor',
        topic: 'Cell Structure',
        description: 'Studied plant and animal cells. Identified key differences between them.',
        homework: 'Draw labeled diagram of plant cell',
    },
    {
        id: '6',
        childName: 'Fatima Khan',
        class: 'Class 7-B',
        date: '2024-01-19',
        subject: 'Urdu',
        teacher: 'Mr. Ahmad Shah',
        topic: 'Ghazal Poetry',
        description: 'Introduction to ghazal format. Read and analyzed a famous ghazal.',
        homework: 'Summarize the ghazal in your own words',
    },
]

export default function PortalDiaryPage() {
    const [diary] = useState<DiaryEntry[]>(sampleDiary)
    const [selectedChild, setSelectedChild] = useState<string>('all')
    const [selectedDate, setSelectedDate] = useState<string>('all')

    const filteredDiary = diary.filter((entry) => {
        const matchesChild = selectedChild === 'all' || entry.childName === selectedChild
        const matchesDate = selectedDate === 'all' || entry.date === selectedDate
        return matchesChild && matchesDate
    })

    // Group entries by date
    const groupedDiary = filteredDiary.reduce((acc, entry) => {
        if (!acc[entry.date]) {
            acc[entry.date] = []
        }
        acc[entry.date].push(entry)
        return acc
    }, {} as Record<string, DiaryEntry[]>)

    const uniqueDates = [...new Set(diary.map((e) => e.date))].sort().reverse()

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Class Diary</h1>
                    <p className="text-muted-foreground">
                        Daily class activities and lessons
                    </p>
                </div>
                <div className="flex gap-3">
                    <Select value={selectedChild} onValueChange={setSelectedChild}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select child" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Children</SelectItem>
                            <SelectItem value="Ahmed Khan">Ahmed Khan</SelectItem>
                            <SelectItem value="Fatima Khan">Fatima Khan</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={selectedDate} onValueChange={setSelectedDate}>
                        <SelectTrigger className="w-[180px]">
                            <Calendar className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Date" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Dates</SelectItem>
                            {uniqueDates.map((date) => (
                                <SelectItem key={date} value={date}>
                                    {new Date(date).toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Today&apos;s Entries</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {diary.filter((e) => e.date === new Date().toISOString().split('T')[0]).length}
                        </div>
                        <p className="text-xs text-muted-foreground">New diary entries</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Subjects Covered</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Set(diary.map((e) => e.subject)).size}
                        </div>
                        <p className="text-xs text-muted-foreground">Different subjects</p>
                    </CardContent>
                </Card>
                <Card className="card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{diary.length}</div>
                        <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                </Card>
            </div>

            {/* Diary Entries by Date */}
            {Object.entries(groupedDiary)
                .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                .map(([date, entries]) => (
                    <div key={date} className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <Calendar className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold">
                                    {new Date(date).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </h2>
                                <p className="text-sm text-muted-foreground">{entries.length} entries</p>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            {entries.map((entry) => (
                                <Card key={entry.id} className="card-hover">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-primary">
                                                    <BookOpen className="mr-1 h-3 w-3" />
                                                    {entry.subject}
                                                </Badge>
                                                <Badge variant="secondary">{entry.childName}</Badge>
                                            </div>
                                        </div>
                                        <CardTitle className="text-lg">{entry.topic}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-1">Lesson Summary</p>
                                            <p className="text-sm">{entry.description}</p>
                                        </div>

                                        {entry.homework && (
                                            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <FileText className="h-4 w-4 text-yellow-600" />
                                                    <span className="text-sm font-medium text-yellow-600">Homework</span>
                                                </div>
                                                <p className="text-sm">{entry.homework}</p>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2 pt-2 text-sm text-muted-foreground">
                                            <User className="h-3 w-3" />
                                            <span>{entry.teacher}</span>
                                            <span>•</span>
                                            <span>{entry.class}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}
        </div>
    )
}
