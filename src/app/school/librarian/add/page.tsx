'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
    BookOpen,
    Save,
    ArrowLeft,
} from 'lucide-react'
import Link from 'next/link'

export default function AddBookPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/school/librarian/catalog">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Add New Book</h1>
                    <p className="text-muted-foreground">
                        Add a new book to the library catalog
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Book Information
                    </CardTitle>
                    <CardDescription>Enter the book details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>ISBN *</Label>
                            <Input placeholder="978-0-000-00000-0" />
                        </div>
                        <div className="space-y-2">
                            <Label>Accession Number</Label>
                            <Input placeholder="Auto-generated" disabled />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Book Title *</Label>
                        <Input placeholder="Enter book title" />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Author *</Label>
                            <Input placeholder="Author name" />
                        </div>
                        <div className="space-y-2">
                            <Label>Publisher</Label>
                            <Input placeholder="Publisher name" />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label>Category *</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="science">Science</SelectItem>
                                    <SelectItem value="mathematics">Mathematics</SelectItem>
                                    <SelectItem value="english">English</SelectItem>
                                    <SelectItem value="urdu">Urdu</SelectItem>
                                    <SelectItem value="social">Social Studies</SelectItem>
                                    <SelectItem value="computer">Computer</SelectItem>
                                    <SelectItem value="islamic">Islamic Studies</SelectItem>
                                    <SelectItem value="fiction">Fiction</SelectItem>
                                    <SelectItem value="reference">Reference</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Publication Year</Label>
                            <Input type="number" placeholder="2024" />
                        </div>
                        <div className="space-y-2">
                            <Label>Edition</Label>
                            <Input placeholder="e.g., 1st, 2nd" />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label>Quantity *</Label>
                            <Input type="number" placeholder="1" />
                        </div>
                        <div className="space-y-2">
                            <Label>Price per Copy (Rs.)</Label>
                            <Input type="number" placeholder="0" />
                        </div>
                        <div className="space-y-2">
                            <Label>Shelf Location *</Label>
                            <Input placeholder="e.g., A-101" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea placeholder="Brief description of the book (optional)" rows={3} />
                    </div>

                    <div className="space-y-2">
                        <Label>Book Cover</Label>
                        <Input type="file" accept="image/*" />
                        <p className="text-xs text-muted-foreground">Upload book cover image (max 2MB)</p>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" asChild>
                            <Link href="/school/librarian/catalog">Cancel</Link>
                        </Button>
                        <Button className="gradient-primary">
                            <Save className="mr-2 h-4 w-4" />
                            Add Book
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
