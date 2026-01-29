'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Settings,
    BookOpen,
    Clock,
    DollarSign,
    Bell,
    Save,
} from 'lucide-react'
import { toast } from 'sonner'

export default function LibrarySettingsPage() {
    // General Settings
    const [libraryName, setLibraryName] = useState('School Main Library')
    const [openTime, setOpenTime] = useState('08:00')
    const [closeTime, setCloseTime] = useState('16:00')
    const [workingDays, setWorkingDays] = useState(['monday', 'tuesday', 'wednesday', 'thursday', 'friday'])

    // Borrowing Settings
    const [studentMaxBooks, setStudentMaxBooks] = useState('3')
    const [staffMaxBooks, setStaffMaxBooks] = useState('5')
    const [studentBorrowDays, setStudentBorrowDays] = useState('14')
    const [staffBorrowDays, setStaffBorrowDays] = useState('30')
    const [renewalsAllowed, setRenewalsAllowed] = useState('2')
    const [reservationExpiry, setReservationExpiry] = useState('3')

    // Fine Settings
    const [finePerDay, setFinePerDay] = useState('15')
    const [maxFine, setMaxFine] = useState('500')
    const [gracePeriod, setGracePeriod] = useState('0')
    const [fineOnWeekends, setFineOnWeekends] = useState(false)
    const [autoSuspendOnFine, setAutoSuspendOnFine] = useState(true)
    const [suspendThreshold, setSuspendThreshold] = useState('200')

    // Notification Settings
    const [dueDateReminder, setDueDateReminder] = useState(true)
    const [reminderDays, setReminderDays] = useState('2')
    const [overdueNotification, setOverdueNotification] = useState(true)
    const [reservationNotification, setReservationNotification] = useState(true)
    const [fineNotification, setFineNotification] = useState(true)

    const handleSave = () => {
        toast.success('Settings saved successfully')
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Library Settings</h1>
                    <p className="text-muted-foreground">
                        Configure library policies and preferences
                    </p>
                </div>
                <Button onClick={handleSave} className="gradient-primary">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                </Button>
            </div>

            <Tabs defaultValue="general" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="general">
                        <Settings className="w-4 h-4 mr-2" />
                        General
                    </TabsTrigger>
                    <TabsTrigger value="borrowing">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Borrowing
                    </TabsTrigger>
                    <TabsTrigger value="fines">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Fines
                    </TabsTrigger>
                    <TabsTrigger value="notifications">
                        <Bell className="w-4 h-4 mr-2" />
                        Notifications
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Settings</CardTitle>
                            <CardDescription>Basic library information and timings</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Library Name</Label>
                                <Input
                                    value={libraryName}
                                    onChange={(e) => setLibraryName(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Opening Time</Label>
                                    <Input
                                        type="time"
                                        value={openTime}
                                        onChange={(e) => setOpenTime(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Closing Time</Label>
                                    <Input
                                        type="time"
                                        value={closeTime}
                                        onChange={(e) => setCloseTime(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Working Days</Label>
                                <div className="flex flex-wrap gap-2">
                                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                                        <Button
                                            key={day}
                                            variant={workingDays.includes(day) ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => {
                                                if (workingDays.includes(day)) {
                                                    setWorkingDays(workingDays.filter(d => d !== day))
                                                } else {
                                                    setWorkingDays([...workingDays, day])
                                                }
                                            }}
                                        >
                                            {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="borrowing">
                    <Card>
                        <CardHeader>
                            <CardTitle>Borrowing Rules</CardTitle>
                            <CardDescription>Configure book borrowing policies</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h4 className="font-medium">Student Limits</h4>
                                    <div className="space-y-2">
                                        <Label>Maximum Books</Label>
                                        <Input
                                            type="number"
                                            value={studentMaxBooks}
                                            onChange={(e) => setStudentMaxBooks(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Borrowing Period (days)</Label>
                                        <Input
                                            type="number"
                                            value={studentBorrowDays}
                                            onChange={(e) => setStudentBorrowDays(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="font-medium">Staff Limits</h4>
                                    <div className="space-y-2">
                                        <Label>Maximum Books</Label>
                                        <Input
                                            type="number"
                                            value={staffMaxBooks}
                                            onChange={(e) => setStaffMaxBooks(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Borrowing Period (days)</Label>
                                        <Input
                                            type="number"
                                            value={staffBorrowDays}
                                            onChange={(e) => setStaffBorrowDays(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="border-t pt-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Renewals Allowed</Label>
                                        <Input
                                            type="number"
                                            value={renewalsAllowed}
                                            onChange={(e) => setRenewalsAllowed(e.target.value)}
                                        />
                                        <p className="text-xs text-muted-foreground">Number of times a book can be renewed</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Reservation Expiry (days)</Label>
                                        <Input
                                            type="number"
                                            value={reservationExpiry}
                                            onChange={(e) => setReservationExpiry(e.target.value)}
                                        />
                                        <p className="text-xs text-muted-foreground">Days to collect reserved book</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="fines">
                    <Card>
                        <CardHeader>
                            <CardTitle>Fine Settings</CardTitle>
                            <CardDescription>Configure overdue fine policies</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Fine Per Day (Rs.)</Label>
                                    <Input
                                        type="number"
                                        value={finePerDay}
                                        onChange={(e) => setFinePerDay(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Maximum Fine (Rs.)</Label>
                                    <Input
                                        type="number"
                                        value={maxFine}
                                        onChange={(e) => setMaxFine(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Grace Period (days)</Label>
                                    <Input
                                        type="number"
                                        value={gracePeriod}
                                        onChange={(e) => setGracePeriod(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="border-t pt-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Charge Fine on Weekends</Label>
                                        <p className="text-xs text-muted-foreground">Include Saturday and Sunday in fine calculation</p>
                                    </div>
                                    <Switch
                                        checked={fineOnWeekends}
                                        onCheckedChange={setFineOnWeekends}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Auto-Suspend on High Fines</Label>
                                        <p className="text-xs text-muted-foreground">Automatically suspend borrowing privileges when fines exceed threshold</p>
                                    </div>
                                    <Switch
                                        checked={autoSuspendOnFine}
                                        onCheckedChange={setAutoSuspendOnFine}
                                    />
                                </div>
                                {autoSuspendOnFine && (
                                    <div className="space-y-2">
                                        <Label>Suspend Threshold (Rs.)</Label>
                                        <Input
                                            type="number"
                                            value={suspendThreshold}
                                            onChange={(e) => setSuspendThreshold(e.target.value)}
                                            className="w-[200px]"
                                        />
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Settings</CardTitle>
                            <CardDescription>Configure email and SMS notifications</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Due Date Reminder</Label>
                                        <p className="text-xs text-muted-foreground">Send reminder before book due date</p>
                                    </div>
                                    <Switch
                                        checked={dueDateReminder}
                                        onCheckedChange={setDueDateReminder}
                                    />
                                </div>
                                {dueDateReminder && (
                                    <div className="space-y-2 pl-4 border-l-2">
                                        <Label>Days Before Due Date</Label>
                                        <Input
                                            type="number"
                                            value={reminderDays}
                                            onChange={(e) => setReminderDays(e.target.value)}
                                            className="w-[100px]"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Overdue Notification</Label>
                                    <p className="text-xs text-muted-foreground">Notify when book becomes overdue</p>
                                </div>
                                <Switch
                                    checked={overdueNotification}
                                    onCheckedChange={setOverdueNotification}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Reservation Available</Label>
                                    <p className="text-xs text-muted-foreground">Notify when reserved book is available</p>
                                </div>
                                <Switch
                                    checked={reservationNotification}
                                    onCheckedChange={setReservationNotification}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Fine Notification</Label>
                                    <p className="text-xs text-muted-foreground">Notify about fines and payment receipts</p>
                                </div>
                                <Switch
                                    checked={fineNotification}
                                    onCheckedChange={setFineNotification}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
