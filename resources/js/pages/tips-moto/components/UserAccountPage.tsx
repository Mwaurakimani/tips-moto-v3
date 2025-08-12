import { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Crown,
  Shield,
  Bell,
  Lock,
  CreditCard,
  Settings,
  Eye,
  EyeOff,
  Save,
  Edit
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';

interface UserAccountPageProps {
  currentUser: any;
}

export function UserAccountPage({ currentUser }: UserAccountPageProps) {
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    location: currentUser?.location || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    tipAlerts: true,
    weeklyReport: true,
    marketingEmails: false
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferenceChange = (field: string, value: boolean) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Handle save logic here
    setEditMode(false);
    console.log('Saving:', formData, preferences);
  };

  return (
    <div className="space-y-6 pb-20 xl:pb-6">
      {/* Profile Header */}
      <Card className="border-none shadow-lg bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-2xl">
                  {currentUser?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              <Button 
                size="sm" 
                className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-white dark:bg-black border-2 border-orange-500"
                onClick={() => setEditMode(!editMode)}
              >
                <Edit className="h-3 w-3 text-orange-500" />
              </Button>
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentUser?.name || 'User Name'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                {currentUser?.email || 'user@example.com'}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <Badge className={`${
                  currentUser?.subscriptionTier === 'VIP' 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
                    : 'bg-blue-500 text-white'
                }`}>
                  {currentUser?.subscriptionTier === 'VIP' && <Crown className="h-3 w-3 mr-1" />}
                  {currentUser?.subscriptionTier || 'Premium'} Member
                </Badge>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${
                    currentUser?.subscriptionStatus === 'active' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {currentUser?.subscriptionStatus === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <Card className="lg:col-span-2 border-none shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-orange-500" />
                <span>Personal Information</span>
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setEditMode(!editMode)}
                className="border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20"
              >
                {editMode ? 'Cancel' : 'Edit'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!editMode}
                  className="disabled:opacity-70"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!editMode}
                  className="disabled:opacity-70"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!editMode}
                  placeholder="+254 700 000 000"
                  className="disabled:opacity-70"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  disabled={!editMode}
                  placeholder="Nairobi, Kenya"
                  className="disabled:opacity-70"
                />
              </div>
            </div>

            {editMode && (
              <>
                <Separator className="my-6" />
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center space-x-2">
                    <Lock className="h-4 w-4 text-orange-500" />
                    <span>Change Password</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPassword ? "text" : "password"}
                          value={formData.currentPassword}
                          onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                          placeholder="Enter current password"
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
                      <Input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        value={formData.newPassword}
                        onChange={(e) => handleInputChange('newPassword', e.target.value)}
                        placeholder="Enter new password"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {editMode && (
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions & Preferences */}
        <div className="space-y-6">
          {/* Subscription Info */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Crown className="h-5 w-5 text-orange-500" />
                <span>Subscription</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 rounded-xl">
                <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">
                  {currentUser?.subscriptionTier || 'Premium'} Plan
                </h3>
                <p className="text-sm text-purple-700 dark:text-purple-300 mb-3">
                  Expires: {new Date(currentUser?.subscriptionExpiry || Date.now() + 30*24*60*60*1000).toLocaleDateString()}
                </p>
                <Button size="sm" className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                  Manage Subscription
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-orange-500" />
                <span>Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(preferences).map(([key, value]) => {
                const labels: Record<string, { title: string; description: string; icon: any }> = {
                  emailNotifications: { title: 'Email Notifications', description: 'Receive updates via email', icon: Mail },
                  smsNotifications: { title: 'SMS Notifications', description: 'Receive updates via SMS', icon: Phone },
                  pushNotifications: { title: 'Push Notifications', description: 'Receive browser notifications', icon: Bell },
                  tipAlerts: { title: 'Tip Alerts', description: 'Get notified of new tips', icon: Bell },
                  weeklyReport: { title: 'Weekly Reports', description: 'Performance summaries', icon: Calendar },
                  marketingEmails: { title: 'Marketing Emails', description: 'Promotional content', icon: Mail }
                };
                
                const config = labels[key];
                if (!config) return null;
                
                const Icon = config.icon;
                
                return (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium text-sm">{config.title}</p>
                        <p className="text-xs text-gray-500">{config.description}</p>
                      </div>
                    </div>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) => handlePreferenceChange(key, checked)}
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
