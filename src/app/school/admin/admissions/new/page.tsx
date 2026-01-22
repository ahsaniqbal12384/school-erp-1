'use client'

import { useState } from 'react'
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
    UserPlus,
    User,
    Phone,
    Mail,
    Home,
    Calendar,
    GraduationCap,
    FileText,
    Save,
    ArrowLeft,
} from 'lucide-react'
import Link from 'next/link'

export default function NewAdmissionPage() {
    const [currentStep, setCurrentStep] = useState(1)

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/school/admin/admissions/registrations">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">New Admission</h1>
                    <p className="text-muted-foreground">
                        Register a new student for admission
                    </p>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-4">
                {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex items-center gap-2">
                        <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full font-medium ${step <= currentStep
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground'
                                }`}
                        >
                            {step}
                        </div>
                        <span className={`hidden md:inline text-sm ${step <= currentStep ? 'font-medium' : 'text-muted-foreground'}`}>
                            {step === 1 && 'Student Info'}
                            {step === 2 && 'Parent Info'}
                            {step === 3 && 'Academic Info'}
                            {step === 4 && 'Documents'}
                        </span>
                        {step < 4 && <div className="h-px w-8 bg-muted" />}
                    </div>
                ))}
            </div>

            {/* Step 1: Student Information */}
            {currentStep === 1 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Student Information
                        </CardTitle>
                        <CardDescription>Enter the student&apos;s personal details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>First Name *</Label>
                                <Input placeholder="Enter first name" />
                            </div>
                            <div className="space-y-2">
                                <Label>Last Name *</Label>
                                <Input placeholder="Enter last name" />
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label>Date of Birth *</Label>
                                <Input type="date" />
                            </div>
                            <div className="space-y-2">
                                <Label>Gender *</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Blood Group</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select blood group" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="A+">A+</SelectItem>
                                        <SelectItem value="A-">A-</SelectItem>
                                        <SelectItem value="B+">B+</SelectItem>
                                        <SelectItem value="B-">B-</SelectItem>
                                        <SelectItem value="O+">O+</SelectItem>
                                        <SelectItem value="O-">O-</SelectItem>
                                        <SelectItem value="AB+">AB+</SelectItem>
                                        <SelectItem value="AB-">AB-</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Nationality</Label>
                                <Input placeholder="Pakistani" defaultValue="Pakistani" />
                            </div>
                            <div className="space-y-2">
                                <Label>Religion</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select religion" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="islam">Islam</SelectItem>
                                        <SelectItem value="christianity">Christianity</SelectItem>
                                        <SelectItem value="hinduism">Hinduism</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Current Address *</Label>
                            <Textarea placeholder="Enter complete address" rows={3} />
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={() => setCurrentStep(2)}>
                                Next: Parent Information
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Step 2: Parent Information */}
            {currentStep === 2 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Parent/Guardian Information
                        </CardTitle>
                        <CardDescription>Enter parent or guardian details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Father&apos;s Name *</Label>
                                <Input placeholder="Enter father's full name" />
                            </div>
                            <div className="space-y-2">
                                <Label>Father&apos;s CNIC *</Label>
                                <Input placeholder="XXXXX-XXXXXXX-X" />
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Father&apos;s Occupation</Label>
                                <Input placeholder="Enter occupation" />
                            </div>
                            <div className="space-y-2">
                                <Label>Father&apos;s Phone *</Label>
                                <Input placeholder="+92-XXX-XXXXXXX" />
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Mother&apos;s Name</Label>
                                <Input placeholder="Enter mother's full name" />
                            </div>
                            <div className="space-y-2">
                                <Label>Mother&apos;s Phone</Label>
                                <Input placeholder="+92-XXX-XXXXXXX" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Email Address *</Label>
                            <Input type="email" placeholder="parent@email.com" />
                        </div>
                        <div className="space-y-2">
                            <Label>Emergency Contact</Label>
                            <div className="grid gap-4 md:grid-cols-2">
                                <Input placeholder="Contact Name" />
                                <Input placeholder="Phone Number" />
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <Button variant="outline" onClick={() => setCurrentStep(1)}>
                                Back
                            </Button>
                            <Button onClick={() => setCurrentStep(3)}>
                                Next: Academic Information
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Step 3: Academic Information */}
            {currentStep === 3 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <GraduationCap className="h-5 w-5" />
                            Academic Information
                        </CardTitle>
                        <CardDescription>Enter academic and enrollment details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Applying for Class *</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Class 1</SelectItem>
                                        <SelectItem value="2">Class 2</SelectItem>
                                        <SelectItem value="3">Class 3</SelectItem>
                                        <SelectItem value="4">Class 4</SelectItem>
                                        <SelectItem value="5">Class 5</SelectItem>
                                        <SelectItem value="6">Class 6</SelectItem>
                                        <SelectItem value="7">Class 7</SelectItem>
                                        <SelectItem value="8">Class 8</SelectItem>
                                        <SelectItem value="9">Class 9</SelectItem>
                                        <SelectItem value="10">Class 10</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Academic Session *</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select session" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="2024-25">2024-25</SelectItem>
                                        <SelectItem value="2025-26">2025-26</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Previous School Name</Label>
                                <Input placeholder="Enter previous school name" />
                            </div>
                            <div className="space-y-2">
                                <Label>Previous Class</Label>
                                <Input placeholder="Last class attended" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Reason for Leaving Previous School</Label>
                            <Textarea placeholder="Enter reason (optional)" rows={2} />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Transport Required</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="yes">Yes</SelectItem>
                                        <SelectItem value="no">No</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Admission Type</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="regular">Regular</SelectItem>
                                        <SelectItem value="transfer">Transfer</SelectItem>
                                        <SelectItem value="sibling">Sibling</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <Button variant="outline" onClick={() => setCurrentStep(2)}>
                                Back
                            </Button>
                            <Button onClick={() => setCurrentStep(4)}>
                                Next: Documents
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Step 4: Documents */}
            {currentStep === 4 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Required Documents
                        </CardTitle>
                        <CardDescription>Upload required documents for admission</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Student Photo *</Label>
                                <Input type="file" accept="image/*" />
                                <p className="text-xs text-muted-foreground">Passport size photo (max 2MB)</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Birth Certificate *</Label>
                                <Input type="file" accept=".pdf,.jpg,.png" />
                                <p className="text-xs text-muted-foreground">PDF or image format</p>
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Father&apos;s CNIC Copy *</Label>
                                <Input type="file" accept=".pdf,.jpg,.png" />
                            </div>
                            <div className="space-y-2">
                                <Label>Mother&apos;s CNIC Copy</Label>
                                <Input type="file" accept=".pdf,.jpg,.png" />
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Previous School Leaving Certificate</Label>
                                <Input type="file" accept=".pdf,.jpg,.png" />
                            </div>
                            <div className="space-y-2">
                                <Label>Last Report Card</Label>
                                <Input type="file" accept=".pdf,.jpg,.png" />
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <Button variant="outline" onClick={() => setCurrentStep(3)}>
                                Back
                            </Button>
                            <Button className="gradient-primary">
                                <Save className="mr-2 h-4 w-4" />
                                Submit Application
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
