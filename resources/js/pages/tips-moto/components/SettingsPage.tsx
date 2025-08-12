import { useState } from 'react';
import {
  User,
  Bell,
  CreditCard,
  Shield,
  Globe,
  Code,
  Info,
  Save,
  Eye,
  EyeOff,
  Smartphone,
  Mail,
  MessageSquare,
  DollarSign,
  Clock,
  Languages,
  Lock,
  Key,
  Activity,
  Server,
  Database,
  Cpu
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { toast } from 'sonner';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Settings state with better structure
  const [settings, setSettings] = useState({
    // General
    timezone: 'Africa/Nairobi',
    currency: 'KES',
    language: 'en',
    dateFormat: 'dd/mm/yyyy',

    // Account
    firstName: 'John',
    lastName: 'Kamau',
    email: 'john.kamau@email.com',
    phone: '+254 712 345 678',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',

    // Notifications
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    tipAlerts: true,
    matchReminders: true,

    // Platform
    oddsFormat: 'decimal',
    defaultBetType: 'single',
    autoRefresh: true,
    showFreeTips: true,
    compactView: false,

    // Security
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: '30',

    // API
    apiEnabled: false,
    apiKey: 'tm_sk_1234567890abcdef'
  });

  // Handle input changes
  const handleInputChange = (field: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle save operations
  const handleSave = (section: string) => {
    // Validation for password change
    if (section === 'Account' && settings.newPassword) {
      if (settings.newPassword !== settings.confirmPassword) {
        toast.error('New passwords do not match!');
        return;
      }
      if (settings.newPassword.length < 6) {
        toast.error('Password must be at least 6 characters long!');
        return;
      }
      if (!settings.currentPassword) {
        toast.error('Please enter your current password!');
        return;
      }
    }

    // Simulate API call delay
    setTimeout(() => {
      toast.success(`${section} settings saved successfully!`);

      // Clear password fields after successful save
      if (section === 'Account') {
        setSettings(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      }
    }, 500);
  };

  // Generate new API key
  const generateApiKey = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'tm_sk_';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setSettings(prev => ({ ...prev, apiKey: result }));
    toast.success('New API key generated successfully!');
  };

   return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your account settings and preferences
          </p>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-600">
          <Activity className="h-3 w-3 mr-1" />
          System Active
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7 h-auto p-1">
          <TabsTrigger value="general" className="flex flex-col gap-1 p-3">
            <Globe className="h-4 w-4" />
            <span className="text-xs">General</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="flex flex-col gap-1 p-3">
            <User className="h-4 w-4" />
            <span className="text-xs">Account</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex flex-col gap-1 p-3">
            <Bell className="h-4 w-4" />
            <span className="text-xs">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex flex-col gap-1 p-3">
            <CreditCard className="h-4 w-4" />
            <span className="text-xs">Payment</span>
          </TabsTrigger>
          <TabsTrigger value="platform" className="flex flex-col gap-1 p-3">
            <Server className="h-4 w-4" />
            <span className="text-xs">Platform</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex flex-col gap-1 p-3">
            <Shield className="h-4 w-4" />
            <span className="text-xs">Security</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex flex-col gap-1 p-3">
            <Code className="h-4 w-4" />
            <span className="text-xs">API</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                General Preferences
              </CardTitle>
              <CardDescription>
                Configure your basic application preferences and regional settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) => handleInputChange('timezone', value)}
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Nairobi">East Africa Time (EAT)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time (EST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={settings.currency}
                    onValueChange={(value) => handleInputChange('currency', value)}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KES">Kenyan Shilling (KES)</SelectItem>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => handleInputChange('language', value)}
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="sw">Kiswahili</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select
                    value={settings.dateFormat}
                    onValueChange={(value) => handleInputChange('dateFormat', value)}
                  >
                    <SelectTrigger id="dateFormat">
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave('General')} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Settings */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Information
              </CardTitle>
              <CardDescription>
                Update your personal information and account details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="" alt="Profile" />
                  <AvatarFallback className="bg-orange-500 text-white text-lg">
                    {settings.firstName[0]}{settings.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">Change Photo</Button>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={settings.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={settings.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={settings.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Change Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter current password"
                        value={settings.currentPassword}
                        onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={settings.newPassword}
                        onChange={(e) => handleInputChange('newPassword', e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={settings.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave('Account')} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how you want to be notified about important updates and activities.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Receive notifications via email
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Receive notifications via SMS
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => handleInputChange('smsNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Receive push notifications on your device
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => handleInputChange('pushNotifications', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Tip Alerts</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Get notified when new tips are available
                    </p>
                  </div>
                  <Switch
                    checked={settings.tipAlerts}
                    onCheckedChange={(checked) => handleInputChange('tipAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Match Reminders</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receive reminders before matches start
                    </p>
                  </div>
                  <Switch
                    checked={settings.matchReminders}
                    onCheckedChange={(checked) => handleInputChange('matchReminders', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Marketing Emails</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receive promotional emails and offers
                    </p>
                  </div>
                  <Switch
                    checked={settings.marketingEmails}
                    onCheckedChange={(checked) => handleInputChange('marketingEmails', checked)}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave('Notification')} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Methods
              </CardTitle>
              <CardDescription>
                Manage your payment methods and billing information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">MPESA</span>
                    </div>
                    <div>
                      <p className="font-medium">M-Pesa</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">+254 712 *** 678</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-600">Primary</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">VISA</span>
                    </div>
                    <div>
                      <p className="font-medium">Visa ending in 4242</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Expires 12/26</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                <CreditCard className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Billing Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="billingAddress">Billing Address</Label>
                    <Input id="billingAddress" placeholder="Enter billing address" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Enter city" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State/County</Label>
                    <Input id="state" placeholder="Enter state or county" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input id="postalCode" placeholder="Enter postal code" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave('Payment')} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Platform Settings */}
        <TabsContent value="platform" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Platform Preferences
              </CardTitle>
              <CardDescription>
                Customize how you view and interact with tips and matches.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="oddsFormat">Odds Format</Label>
                  <Select
                    value={settings.oddsFormat}
                    onValueChange={(value) => handleInputChange('oddsFormat', value)}
                  >
                    <SelectTrigger id="oddsFormat">
                      <SelectValue placeholder="Select odds format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="decimal">Decimal (1.85)</SelectItem>
                      <SelectItem value="fractional">Fractional (17/20)</SelectItem>
                      <SelectItem value="american">American (-118)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultBetType">Default Bet Type</Label>
                  <Select
                    value={settings.defaultBetType}
                    onValueChange={(value) => handleInputChange('defaultBetType', value)}
                  >
                    <SelectTrigger id="defaultBetType">
                      <SelectValue placeholder="Select bet type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single Bet</SelectItem>
                      <SelectItem value="accumulator">Accumulator</SelectItem>
                      <SelectItem value="system">System Bet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto Refresh</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Automatically refresh odds and match data
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoRefresh}
                    onCheckedChange={(checked) => handleInputChange('autoRefresh', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show Free Tips</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Display free tips alongside premium content
                    </p>
                  </div>
                  <Switch
                    checked={settings.showFreeTips}
                    onCheckedChange={(checked) => handleInputChange('showFreeTips', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Compact View</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Use a more compact layout for lists and tables
                    </p>
                  </div>
                  <Switch
                    checked={settings.compactView}
                    onCheckedChange={(checked) => handleInputChange('compactView', checked)}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave('Platform')} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your account security and privacy settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Key className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => handleInputChange('twoFactorAuth', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <p className="font-medium">Login Alerts</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Get notified of new login attempts
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.loginAlerts}
                    onCheckedChange={(checked) => handleInputChange('loginAlerts', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Select
                    value={settings.sessionTimeout}
                    onValueChange={(value) => handleInputChange('sessionTimeout', value)}
                  >
                    <SelectTrigger id="sessionTimeout">
                      <SelectValue placeholder="Select timeout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Recent Login Activity</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div>
                      <p className="font-medium">Current Session</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Nairobi, Kenya • Chrome on Windows
                      </p>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-600">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Yesterday at 2:34 PM</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Mombasa, Kenya • Safari on iPhone
                      </p>
                    </div>
                    <Button variant="outline" size="sm">Revoke</Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave('Security')} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Settings */}
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                API Access
              </CardTitle>
              <CardDescription>
                Manage API access for third-party integrations and developers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable API Access</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Allow access to Tips Moto API endpoints
                  </p>
                </div>
                <Switch
                  checked={settings.apiEnabled}
                  onCheckedChange={(checked) => handleInputChange('apiEnabled', checked)}
                />
              </div>

              {settings.apiEnabled && (
                <>
                  <Separator />

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="apiKey">API Key</Label>
                      <div className="flex gap-2">
                        <Input
                          id="apiKey"
                          value={settings.apiKey}
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button onClick={generateApiKey} variant="outline">
                          Regenerate
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Keep your API key secure. Never share it in client-side code.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">API Usage</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 border rounded-lg text-center">
                          <div className="text-2xl font-bold text-orange-600">1,247</div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Requests Today</p>
                        </div>
                        <div className="p-4 border rounded-lg text-center">
                          <div className="text-2xl font-bold text-orange-600">34,891</div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Requests This Month</p>
                        </div>
                        <div className="p-4 border rounded-lg text-center">
                          <div className="text-2xl font-bold text-green-600">99.2%</div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Uptime</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Documentation</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Access our comprehensive API documentation to integrate Tips Moto into your applications.
                      </p>
                      <Button variant="outline">
                        <Code className="h-4 w-4 mr-2" />
                        View API Docs
                      </Button>
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end">
                <Button onClick={() => handleSave('API')} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* System Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            System Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Version</p>
              <p className="font-medium">v2.1.4</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Last Updated</p>
              <p className="font-medium">July 14, 2025</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Server Status</p>
              <p className="font-medium text-green-600">Operational</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Data Center</p>
              <p className="font-medium">Nairobi, KE</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
