'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
import { Separator } from '@/components/ui/separator'
import {
    Settings,
    Building2,
    Mail,
    Bell,
    Shield,
    Palette,
    Database,
    Globe,
    Save,
    Key,
    CreditCard,
} from 'lucide-react'

export default function SuperAdminSettingsPage() {
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [smsNotifications, setSmsNotifications] = useState(false)
    const [twoFactorAuth, setTwoFactorAuth] = useState(true)
    const [autoBackup, setAutoBackup] = useState(true)
    const [maintenanceMode, setMaintenanceMode] = useState(false)

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
                <p className="text-muted-foreground">
                    Configure global platform settings and preferences
                </p>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="billing">Billing</TabsTrigger>
                    <TabsTrigger value="system">System</TabsTrigger>
                </TabsList>

                {/* General Settings */}
                <TabsContent value="general" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-primary" />
                                <CardTitle>Platform Information</CardTitle>
                            </div>
                            <CardDescription>Basic platform configuration</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="platformName">Platform Name</Label>
                                    <Input id="platformName" defaultValue="Pakistani School ERP" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="supportEmail">Support Email</Label>
                                    <Input id="supportEmail" type="email" defaultValue="support@schoolerp.pk" />
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="supportPhone">Support Phone</Label>
                                    <Input id="supportPhone" defaultValue="+92-42-35761234" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="timezone">Default Timezone</Label>
                                    <Select defaultValue="asia_karachi">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="asia_karachi">Asia/Karachi (PKT)</SelectItem>
                                            <SelectItem value="utc">UTC</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Separator />
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="currency">Default Currency</Label>
                                    <Select defaultValue="pkr">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pkr">PKR - Pakistani Rupee</SelectItem>
                                            <SelectItem value="usd">USD - US Dollar</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="language">Default Language</Label>
                                    <Select defaultValue="en">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="en">English</SelectItem>
                                            <SelectItem value="ur">Urdu</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button className="gradient-primary">
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Changes
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Palette className="h-5 w-5 text-primary" />
                                <CardTitle>Branding</CardTitle>
                            </div>
                            <CardDescription>Customize platform appearance</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Logo (Light Mode)</Label>
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-32 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                                            <span className="text-xs text-muted-foreground">Upload Logo</span>
                                        </div>
                                        <Button variant="outline" size="sm">Upload</Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Logo (Dark Mode)</Label>
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-32 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-gray-900">
                                            <span className="text-xs text-gray-400">Upload Logo</span>
                                        </div>
                                        <Button variant="outline" size="sm">Upload</Button>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Primary Color</Label>
                                <div className="flex items-center gap-4">
                                    <Input type="color" defaultValue="#6366f1" className="h-10 w-20" />
                                    <Input defaultValue="#6366f1" className="w-32" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notifications Settings */}
                <TabsContent value="notifications" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Bell className="h-5 w-5 text-primary" />
                                <CardTitle>Notification Preferences</CardTitle>
                            </div>
                            <CardDescription>Configure how you receive alerts</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Email Notifications</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Receive important updates via email
                                    </p>
                                </div>
                                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>SMS Notifications</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Get critical alerts via SMS
                                    </p>
                                </div>
                                <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
                            </div>
                            <Separator />
                            <div className="space-y-4">
                                <Label>Notification Types</Label>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="flex items-center justify-between rounded-lg border p-4">
                                        <span className="text-sm">New School Registration</span>
                                        <Switch defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg border p-4">
                                        <span className="text-sm">Payment Received</span>
                                        <Switch defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg border p-4">
                                        <span className="text-sm">Subscription Expiring</span>
                                        <Switch defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg border p-4">
                                        <span className="text-sm">Support Ticket Created</span>
                                        <Switch defaultChecked />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Mail className="h-5 w-5 text-primary" />
                                <CardTitle>Email Configuration</CardTitle>
                            </div>
                            <CardDescription>SMTP settings for outgoing emails</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="smtpHost">SMTP Host</Label>
                                    <Input id="smtpHost" defaultValue="smtp.sendgrid.net" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="smtpPort">SMTP Port</Label>
                                    <Input id="smtpPort" defaultValue="587" />
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="smtpUser">SMTP Username</Label>
                                    <Input id="smtpUser" defaultValue="apikey" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="smtpPass">SMTP Password</Label>
                                    <Input id="smtpPass" type="password" defaultValue="********" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3">
                                <Button variant="outline">Test Connection</Button>
                                <Button className="gradient-primary">
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Settings
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security Settings */}
                <TabsContent value="security" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-primary" />
                                <CardTitle>Security Settings</CardTitle>
                            </div>
                            <CardDescription>Configure security and authentication</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Two-Factor Authentication</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Require 2FA for all admin accounts
                                    </p>
                                </div>
                                <Switch checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
                            </div>
                            <Separator />
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Session Timeout (minutes)</Label>
                                    <Select defaultValue="30">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="15">15 minutes</SelectItem>
                                            <SelectItem value="30">30 minutes</SelectItem>
                                            <SelectItem value="60">1 hour</SelectItem>
                                            <SelectItem value="120">2 hours</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Password Policy</Label>
                                    <Select defaultValue="strong">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="basic">Basic (8+ characters)</SelectItem>
                                            <SelectItem value="medium">Medium (8+ with numbers)</SelectItem>
                                            <SelectItem value="strong">Strong (8+ with symbols)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Key className="h-5 w-5 text-primary" />
                                <CardTitle>API Keys</CardTitle>
                            </div>
                            <CardDescription>Manage API access keys</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="rounded-lg border p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Production API Key</p>
                                        <p className="text-sm text-muted-foreground">pk_live_****************************</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm">Show</Button>
                                        <Button variant="outline" size="sm">Regenerate</Button>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-lg border p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Test API Key</p>
                                        <p className="text-sm text-muted-foreground">pk_test_****************************</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm">Show</Button>
                                        <Button variant="outline" size="sm">Regenerate</Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Billing Settings */}
                <TabsContent value="billing" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-primary" />
                                <CardTitle>Payment Gateway</CardTitle>
                            </div>
                            <CardDescription>Configure payment processing</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Active Payment Gateway</Label>
                                <Select defaultValue="jazzcash">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="jazzcash">JazzCash</SelectItem>
                                        <SelectItem value="easypaisa">Easypaisa</SelectItem>
                                        <SelectItem value="stripe">Stripe</SelectItem>
                                        <SelectItem value="manual">Manual/Bank Transfer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="merchantId">Merchant ID</Label>
                                    <Input id="merchantId" placeholder="Enter merchant ID" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="secretKey">Secret Key</Label>
                                    <Input id="secretKey" type="password" placeholder="Enter secret key" />
                                </div>
                            </div>
                            <Separator />
                            <div className="space-y-4">
                                <Label>Subscription Plans Pricing</Label>
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="space-y-2 rounded-lg border p-4">
                                        <Label>Basic Plan (PKR/year)</Label>
                                        <Input defaultValue="40000" />
                                    </div>
                                    <div className="space-y-2 rounded-lg border p-4">
                                        <Label>Standard Plan (PKR/year)</Label>
                                        <Input defaultValue="80000" />
                                    </div>
                                    <div className="space-y-2 rounded-lg border p-4">
                                        <Label>Premium Plan (PKR/year)</Label>
                                        <Input defaultValue="150000" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* System Settings */}
                <TabsContent value="system" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Database className="h-5 w-5 text-primary" />
                                <CardTitle>Database & Backup</CardTitle>
                            </div>
                            <CardDescription>System maintenance settings</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Automatic Daily Backup</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Backup database every day at 2:00 AM PKT
                                    </p>
                                </div>
                                <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <Label>Backup Retention</Label>
                                <Select defaultValue="30">
                                    <SelectTrigger className="w-[200px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="7">7 days</SelectItem>
                                        <SelectItem value="14">14 days</SelectItem>
                                        <SelectItem value="30">30 days</SelectItem>
                                        <SelectItem value="90">90 days</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline">
                                    <Database className="mr-2 h-4 w-4" />
                                    Create Backup Now
                                </Button>
                                <Button variant="outline">View Backup History</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Globe className="h-5 w-5 text-primary" />
                                <CardTitle>Maintenance Mode</CardTitle>
                            </div>
                            <CardDescription>Take the platform offline for maintenance</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4">
                                <div className="space-y-0.5">
                                    <Label>Enable Maintenance Mode</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Users will see a maintenance page
                                    </p>
                                </div>
                                <Switch
                                    checked={maintenanceMode}
                                    onCheckedChange={setMaintenanceMode}
                                />
                            </div>
                            {maintenanceMode && (
                                <div className="space-y-2">
                                    <Label>Maintenance Message</Label>
                                    <Input
                                        defaultValue="We are performing scheduled maintenance. Please check back soon."
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
