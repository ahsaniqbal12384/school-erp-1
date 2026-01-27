'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
    Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

const emptyFormData = {
    isbn: '',
    title: '',
    author: '',
    publisher: '',
    category: '',
    publicationYear: '',
    edition: '',
    quantity: '1',
    price: '',
    shelfLocation: '',
    description: '',
}

export default function AddBookPage() {
    const router = useRouter()
    const [formData, setFormData] = useState(emptyFormData)
    const [isLoading, setIsLoading] = useState(false)

    const generateAccessionNumber = () => {
        const year = new Date().getFullYear()
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
        return `LIB-${year}-${random}`
    }

    const handleAddBook = async () => {
        if (!formData.isbn || !formData.title || !formData.author || !formData.category || !formData.quantity || !formData.shelfLocation) {
            toast.error('Please fill in all required fields')
            return
        }

        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            const accessionNumber = generateAccessionNumber()
            
            toast.success('Book added successfully', {
                description: `${formData.title} (${accessionNumber}) has been added to the catalog`
            })
            
            // Navigate back to catalog
            router.push('/school/librarian/catalog')
        } catch {
            toast.error('Failed to add book')
        } finally {
            setIsLoading(false)
        }
    }

    const handleReset = () => {
        setFormData(emptyFormData)
    }

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
                            <Input
                                placeholder="978-0-000-00000-0"
                                value={formData.isbn}
                                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Accession Number</Label>
                            <Input placeholder="Auto-generated on save" disabled className="bg-muted" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Book Title *</Label>
                        <Input
                            placeholder="Enter book title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Author *</Label>
                            <Input
                                placeholder="Author name"
                                value={formData.author}
                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Publisher</Label>
                            <Input
                                placeholder="Publisher name"
                                value={formData.publisher}
                                onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label>Category *</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => setFormData({ ...formData, category: value })}
                            >
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
                            <Input
                                type="number"
                                placeholder="2024"
                                value={formData.publicationYear}
                                onChange={(e) => setFormData({ ...formData, publicationYear: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Edition</Label>
                            <Input
                                placeholder="e.g., 1st, 2nd"
                                value={formData.edition}
                                onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label>Quantity *</Label>
                            <Input
                                type="number"
                                placeholder="1"
                                min="1"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Price per Copy (Rs.)</Label>
                            <Input
                                type="number"
                                placeholder="0"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Shelf Location *</Label>
                            <Input
                                placeholder="e.g., A-101"
                                value={formData.shelfLocation}
                                onChange={(e) => setFormData({ ...formData, shelfLocation: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            placeholder="Brief description of the book (optional)"
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Book Cover</Label>
                        <Input type="file" accept="image/*" />
                        <p className="text-xs text-muted-foreground">Upload book cover image (max 2MB)</p>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" onClick={handleReset}>
                            Reset Form
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/school/librarian/catalog">Cancel</Link>
                        </Button>
                        <Button className="gradient-primary" onClick={handleAddBook} disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Add Book
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
