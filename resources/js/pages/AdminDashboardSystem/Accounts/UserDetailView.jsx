import { useState } from 'react';
import { ArrowLeft, User, Mail, Phone, Calendar, Shield, Activity, Edit, Save, X } from 'lucide-react';
import { Button } from '@/pages/tips-moto/components/ui/button.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/tips-moto/components/ui/card';
import { Badge } from '@/pages/tips-moto/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/pages/tips-moto/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/pages/tips-moto/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/pages/tips-moto/components/ui/select';

export function UserDetailView({ user, onBack, onUserUpdate }) {
    const [activeTab, setActiveTab] = useState('subscriptions');
    const [isEditingRole, setIsEditingRole] = useState(false);
    const [isEditingStatus, setIsEditingStatus] = useState(false);
    const [editedRole, setEditedRole] = useState(user.role);
    const [editedStatus, setEditedStatus] = useState(user.status || 'active');

    const handleSuspend = () => {
        // Handle suspend action
    };

    const handleDelete = () => {
        // Handle delete action
    };

    const handleSaveRole = () => {
        if (onUserUpdate) {
            onUserUpdate(user.id, { role: editedRole });
        }
        setIsEditingRole(false);
    };

    const handleCancelRoleEdit = () => {
        setEditedRole(user.role);
        setIsEditingRole(false);
    };

    const handleSaveStatus = () => {
        if (onUserUpdate) {
            onUserUpdate(user.id, { status: editedStatus });
        }
        setIsEditingStatus(false);
    };

    const handleCancelStatusEdit = () => {
        setEditedStatus(user.status || 'active');
        setIsEditingStatus(false);
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'Admin':
                return 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900';
            case 'Premium':
                return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200';
            case 'Guest':
            default:
                return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
            case 'suspended':
                return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200';
            case 'inactive':
                return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
            default:
                return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
        }
    };

    // Get user initials for avatar
    const getInitials = (name) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Mock subscriptions data
    const subscriptions = [];

    // Mock transactions data
    const transactions = [];

    return (
        <div className="space-y-6 w-full">
            {/* Header with Back Button */}
            <div className="flex items-center space-x-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onBack}
                    className="h-9 px-3 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Accounts
                </Button>
                <div className="border-l border-gray-300 dark:border-gray-600 h-6"></div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">View User</h1>
            </div>

            {/* User Information Card */}
            <Card className="border-gray-200 dark:border-gray-700">
                <CardContent className="p-8">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
                        {/* User Profile Section */}
                        <div className="flex-1">
                            {/* Header with Avatar and Name */}
                            <div className="flex items-start space-x-6 mb-6">
                                {/* User Avatar */}
                                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl flex items-center justify-center border border-gray-200 dark:border-gray-600">
                  <span className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                    {getInitials(user.user)}
                  </span>
                                </div>

                                {/* User Info */}
                                <div className="flex-1">
                                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
                                        {user.user}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        User ID: #{user.id}
                                    </p>
                                </div>
                            </div>

                            {/* User Details Grid - positioned below avatar */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                                        <Mail className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                            Email Address
                                        </p>
                                        <p className="text-sm text-gray-900 dark:text-white truncate">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                                        <Phone className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                            Phone Number
                                        </p>
                                        <p className="text-sm text-gray-900 dark:text-white font-mono">
                                            {user.phone}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                                        <Shield className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                                User Role
                                            </p>
                                            {!isEditingRole && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setIsEditingRole(true)}
                                                    className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                                >
                                                    <Edit className="h-3 w-3" />
                                                </Button>
                                            )}
                                        </div>
                                        {isEditingRole ? (
                                            <div className="flex items-center space-x-2">
                                                <Select value={editedRole} onValueChange={setEditedRole}>
                                                    <SelectTrigger className="h-8 text-xs">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Admin">Admin</SelectItem>
                                                        <SelectItem value="Premium">Premium</SelectItem>
                                                        <SelectItem value="Guest">Guest</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={handleSaveRole}
                                                    className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                                                >
                                                    <Save className="h-3 w-3" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={handleCancelRoleEdit}
                                                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <Badge className={`${getRoleBadgeColor(editedRole)} text-xs px-2.5 py-1 font-medium`}>
                                                {editedRole}
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                                        <Activity className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                                Account Status
                                            </p>
                                            {!isEditingStatus && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setIsEditingStatus(true)}
                                                    className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                                >
                                                    <Edit className="h-3 w-3" />
                                                </Button>
                                            )}
                                        </div>
                                        {isEditingStatus ? (
                                            <div className="flex items-center space-x-2">
                                                <Select value={editedStatus} onValueChange={setEditedStatus}>
                                                    <SelectTrigger className="h-8 text-xs">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="active">Active</SelectItem>
                                                        <SelectItem value="suspended">Suspended</SelectItem>
                                                        <SelectItem value="inactive">Inactive</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={handleSaveStatus}
                                                    className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                                                >
                                                    <Save className="h-3 w-3" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={handleCancelStatusEdit}
                                                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <Badge className={`${getStatusColor(editedStatus)} text-xs px-2.5 py-1 font-medium`}>
                                                {editedStatus.charAt(0).toUpperCase() + editedStatus.slice(1)}
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 md:col-span-2 lg:col-span-1">
                                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                                        <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                            Date Joined
                                        </p>
                                        <p className="text-sm text-gray-900 dark:text-white">
                                            {user.dateJoined}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex lg:flex-col flex-row gap-3 lg:min-w-[140px]">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleSuspend}
                                className="flex-1 lg:flex-none border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                Suspend User
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleDelete}
                                className="flex-1 lg:flex-none border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                                Delete User
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs Section */}
            <Card>
                <CardContent className="p-0">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <div className="bg-gray-50 dark:bg-gray-900/50 px-6 pt-6">
                            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                                <button
                                    onClick={() => setActiveTab('subscriptions')}
                                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                                        activeTab === 'subscriptions'
                                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                    }`}
                                >
                                    Subscriptions
                                </button>
                                <button
                                    onClick={() => setActiveTab('transactions')}
                                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                                        activeTab === 'transactions'
                                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                    }`}
                                >
                                    Transactions
                                </button>
                            </div>
                        </div>

                        <TabsContent value="subscriptions" className="mt-0">
                            <div className="p-6 pt-4">
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        User Subscriptions
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        Manage and view all subscription packages for this user
                                    </p>
                                </div>

                                {subscriptions.length > 0 ? (
                                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                                                    <TableHead className="px-4 py-3 font-medium">Package</TableHead>
                                                    <TableHead className="px-4 py-3 font-medium">Start Date</TableHead>
                                                    <TableHead className="px-4 py-3 font-medium">End Date</TableHead>
                                                    <TableHead className="px-4 py-3 font-medium">Status</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {subscriptions.map((subscription, index) => (
                                                    <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                        <TableCell className="px-4 py-3">{subscription.package}</TableCell>
                                                        <TableCell className="px-4 py-3">{subscription.startDate}</TableCell>
                                                        <TableCell className="px-4 py-3">{subscription.endDate}</TableCell>
                                                        <TableCell className="px-4 py-3">
                                                            <Badge className={getStatusColor(subscription.status)}>
                                                                {subscription.status}
                                                            </Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/30">
                                        <div className="text-center py-16">
                                            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <User className="w-6 h-6 text-gray-400" />
                                            </div>
                                            <h4 className="text-base font-medium text-gray-900 dark:text-white mb-2">
                                                No Subscriptions Found
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                This user hasn't subscribed to any packages yet.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="transactions" className="mt-0">
                            <div className="p-6 pt-4">
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        User Transactions
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        View all payment transactions and purchase history
                                    </p>
                                </div>

                                {transactions.length > 0 ? (
                                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                                                    <TableHead className="px-4 py-3 font-medium">Transaction ID</TableHead>
                                                    <TableHead className="px-4 py-3 font-medium">Amount (Ksh)</TableHead>
                                                    <TableHead className="px-4 py-3 font-medium">Payment Method</TableHead>
                                                    <TableHead className="px-4 py-3 font-medium">Package Purchased</TableHead>
                                                    <TableHead className="px-4 py-3 font-medium">Date</TableHead>
                                                    <TableHead className="px-4 py-3 font-medium">Status</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {transactions.map((transaction, index) => (
                                                    <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                        <TableCell className="px-4 py-3 font-mono text-sm">{transaction.id}</TableCell>
                                                        <TableCell className="px-4 py-3">{transaction.amount}</TableCell>
                                                        <TableCell className="px-4 py-3">{transaction.paymentMethod}</TableCell>
                                                        <TableCell className="px-4 py-3">{transaction.package}</TableCell>
                                                        <TableCell className="px-4 py-3">{transaction.date}</TableCell>
                                                        <TableCell className="px-4 py-3">
                                                            <Badge className={getStatusColor(transaction.status)}>
                                                                {transaction.status}
                                                            </Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/30">
                                        <div className="text-center py-16">
                                            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <User className="w-6 h-6 text-gray-400" />
                                            </div>
                                            <h4 className="text-base font-medium text-gray-900 dark:text-white mb-2">
                                                No Transactions Found
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                This user hasn't made any transactions yet.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
