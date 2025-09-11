import { Crown, Edit, Eye, EyeOff, Lock, Save, User } from 'lucide-react';
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { toast } from 'sonner';
import { router } from '@inertiajs/react';
import axios from 'axios';

export function UserAccountPage({ currentUser }) {
    const [editMode, setEditMode] = useState(false);
    const [showPasswordCurrent, setShowPasswordCurrent] = useState(false);
    const [showPasswordNew,setShowPasswordNew] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [formData, setFormData] = useState({
        first_name: currentUser?.first_name || '',
        last_name: currentUser?.last_name || '',
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        phone: currentUser?.phone || '',
        location: currentUser?.location || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [preferences, setPreferences] = useState({
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        tipAlerts: true,
        weeklyReport: true,
        marketingEmails: false,
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handlePreferenceChange = (field, value) => {
        setPreferences(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        try {
            // Prepare data for API submission
            const updateData = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                phone: formData.phone,
                ...(formData.newPassword && {
                    current_password: formData.currentPassword,
                    new_password: formData.newPassword,
                    new_password_confirmation: formData.confirmPassword
                })
            };

            // Axios or fetch call to Laravel endpoint
            const response = await axios.put('/api/user/profile', updateData);
            toast.success('Profile updated successfully');

            router.reload();

            setEditMode(false);
        } catch (error) {
            // Laravel will return validation errors in error.response.data.errors
            if (error.response && error.response.data.errors) {
                const errors = error.response.data.errors;

                // Display validation errors
                Object.keys(errors).forEach(key => {
                    errors[key].forEach(errorMessage => {
                        toast.error(errorMessage);
                    });
                });
            } else {
                // Handle network or unexpected errors
                toast.error('An unexpected error occurred. Please try again.');
            }
        }
    };

    const getAvatarInitials = () => {
        return currentUser?.first_name
            ?.split(' ')
            .map(n => n[0])
            .join('') || 'U';
    };

    return (
        <div className="space-y-6 pb-20 xl:pb-6">
            {/* Profile Header */}
            <Card className="border-none bg-gradient-to-r from-orange-50 to-red-50 shadow-lg dark:from-orange-950/30 dark:to-red-950/30">
                <CardContent className="p-6">
                    <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
                        <div className="relative">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={currentUser?.avatar} alt={currentUser?.first_name} />
                                <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-2xl text-white">
                                    {getAvatarInitials()}
                                </AvatarFallback>
                            </Avatar>
                            <Button
                                size="sm"
                                className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full border-2 border-orange-500 bg-white p-0 dark:bg-black"
                                onClick={() => setEditMode(!editMode)}
                            >
                                <Edit className="h-3 w-3 text-orange-500" />
                            </Button>
                        </div>

                        <div className="flex-1 text-center sm:text-left">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {currentUser?.first_name || 'User Name'}
                            </h1>
                            <p className="mb-3 text-gray-600 dark:text-gray-400">
                                {currentUser?.email || 'user@example.com'}
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                                <Badge
                                    className={`${
                                        currentUser?.subscriptionTier === 'VIP'
                                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                                            : 'bg-blue-500 text-white'
                                    }`}
                                >
                                    {currentUser?.subscriptionTier === 'VIP' && <Crown className="mr-1 h-3 w-3" />}
                                    {currentUser?.subscriptionTier || 'Premium'} Member
                                </Badge>
                                <div className="flex items-center space-x-1">
                                    <div
                                        className={`h-2 w-2 rounded-full ${
                                            currentUser?.subscriptionStatus === 'active' ? 'bg-green-500' : 'bg-red-500'
                                        }`}
                                    />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {currentUser?.subscriptionStatus === 'active' ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Personal Information */}
                <Card className="border-none shadow-lg lg:col-span-2">
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
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="first_name">First Name</Label>
                                <Input
                                    id="first_name"
                                    value={formData.first_name}
                                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                                    disabled={!editMode}
                                    className="disabled:opacity-70"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="last_name">Last Name</Label>
                                <Input
                                    id="last_name"
                                    value={formData.last_name}
                                    onChange={(e) => handleInputChange('last_name', e.target.value)}
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
                        </div>

                        {editMode && (
                            <>
                                <Separator className="my-6" />
                                <div className="space-y-4">
                                    <h3 className="flex items-center space-x-2 font-semibold">
                                        <Lock className="h-4 w-4 text-orange-500" />
                                        <span>Change Password</span>
                                    </h3>

                                    <div className="grid grid-rows-1 gap-4 sm:grid-cols-1">
                                        <div className="space-y-2">
                                            <Label htmlFor="currentPassword">Current Password</Label>
                                            <div className="relative">
                                                <Input
                                                    id="currentPassword"
                                                    type={showPasswordCurrent ? 'text' : 'password'}
                                                    value={formData.currentPassword}
                                                    onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                                                    placeholder="Enter current password"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute top-0 right-0 h-full px-3"
                                                    onClick={() => setShowPasswordCurrent(!showPasswordCurrent)}
                                                >
                                                    {showPasswordCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex flex-col space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="newPassword">New Password</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="newPassword"
                                                        type={showPasswordNew ? 'text' : 'password'}
                                                        value={formData.newPassword}
                                                        onChange={(e) => handleInputChange('newPassword', e.target.value)}
                                                        placeholder="Enter new password"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute top-0 right-0 h-full px-3"
                                                        onClick={() => setShowPasswordNew(!showPasswordNew)}
                                                    >
                                                        {showPasswordNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="confirmPassword"
                                                        type={showPasswordConfirm ? 'text' : 'password'}
                                                        value={formData.confirmPassword}
                                                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                                        placeholder="Confirm new password"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute top-0 right-0 h-full px-3"
                                                        onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                                    >
                                                        {showPasswordConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {editMode && (
                            <div className="flex justify-end space-x-2 pt-4">
                                <Button variant="outline" onClick={() => setEditMode(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                                >
                                    <Save className="mr-2 h-4 w-4" />
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
                            <div className="rounded-xl bg-gradient-to-r from-purple-50 to-violet-50 p-4 text-center dark:from-purple-950/30 dark:to-violet-950/30">
                                <h3 className="mb-1 font-semibold text-purple-900 dark:text-purple-100">
                                    {currentUser?.subscriptionTier || 'Premium'} Plan
                                </h3>
                                <p className="mb-3 text-sm text-purple-700 dark:text-purple-300">
                                    Expires: {'18/08/205'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
