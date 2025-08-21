import { ChevronDown, Home, LogOut, Settings, Shield, UserCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NotificationDropdown } from './NotificationDropdown';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from './ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { router } from '@inertiajs/react';

interface CurrentAdmin {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role?: string|null;
    avatar: string;
    joinDate: string;
    lastLogin: string;
    // Add optional fields for real functionality
    joinDateISO?: string; // ISO date string for calculations
    lastLoginISO?: string; // ISO date string for calculations
}

interface DashboardHeaderProps {
    currentPage: string;
    onPageChange: (page: string) => void;
    currentAdmin: CurrentAdmin;
    onGoToHomepage?: () => void;
    onLogout?: () => void;
}

export function DashboardHeader({ currentPage, onPageChange, currentAdmin, onGoToHomepage, onLogout }: DashboardHeaderProps) {
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [formattedDates, setFormattedDates] = useState({
        joinDate: currentAdmin.joinDate,
        lastLogin: currentAdmin.lastLogin,
    });

    const pageTitle = currentPage === 'dashboard' ? 'Dashboard' : currentPage.charAt(0).toUpperCase() + currentPage.slice(1);

    // Format dates dynamically (for demonstration of real functionality)
    useEffect(() => {
        const formatAccountDates = () => {
            try {
                // In a real app, these would come from the API as ISO strings
                const joinDate = currentAdmin.joinDateISO ? new Date(currentAdmin.joinDateISO) : new Date('2024-01-15');
                const lastLogin = currentAdmin.lastLoginISO ? new Date(currentAdmin.lastLoginISO) : new Date();

                const now = new Date();

                // Format join date
                const joinYear = joinDate.getFullYear();
                const joinMonth = joinDate.toLocaleDateString('en-US', { month: 'short' });
                const formattedJoinDate = `${joinMonth} ${joinYear}`;

                // Format last login with relative time
                const timeDiff = now.getTime() - lastLogin.getTime();
                const minutesDiff = Math.floor(timeDiff / (1000 * 60));
                const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
                const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

                let formattedLastLogin;
                if (minutesDiff < 60) {
                    formattedLastLogin = minutesDiff <= 1 ? 'Just now' : `${minutesDiff} min ago`;
                } else if (hoursDiff < 24) {
                    formattedLastLogin = hoursDiff === 1 ? '1 hour ago' : `${hoursDiff} hours ago`;
                } else if (daysDiff === 1) {
                    formattedLastLogin = 'Yesterday';
                } else if (daysDiff <= 7) {
                    formattedLastLogin = `${daysDiff} days ago`;
                } else {
                    formattedLastLogin = lastLogin.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: lastLogin.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
                    });
                }

                setFormattedDates({
                    joinDate: formattedJoinDate,
                    lastLogin: formattedLastLogin,
                });
            } catch (error:any) {
                // Fallback to static values if date parsing fails
                setFormattedDates({
                    joinDate: currentAdmin.joinDate,
                    lastLogin: currentAdmin.lastLogin,
                });
            }
        };

        formatAccountDates();

        // Update last login time every minute for real-time display
        const interval = setInterval(formatAccountDates, 60000);
        return () => clearInterval(interval);
    }, [currentAdmin.joinDateISO, currentAdmin.lastLoginISO, currentAdmin.joinDate, currentAdmin.lastLogin]);

    const handleSettingsClick = () => {
        onPageChange('settings');
    };

    const handleViewProfile = () => {
        onPageChange('profile');
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);

        // Simulate logout process
        setTimeout(() => {
            setIsLoggingOut(false);
            setShowLogoutDialog(false);

            // Call the logout handler from App.tsx
            if (onLogout) {
                onLogout();
            }

            // In a real app, you would:
            // 1. Clear authentication tokens
            // 2. Clear user session
            // 3. Redirect to login page
            // 4. Clear any cached data
            // 5. Update last login time in backend

            // For demo purposes, we'll just show the logout success
        }, 1500);
    };

    return (
        <>
            <header className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-black">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{pageTitle}</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Welcome back, {currentAdmin.first_name}!</p>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Home Button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                router.visit(route('home'))
                            }}
                            className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                            title={onGoToHomepage ? 'Go to User Homepage' : 'Go to Dashboard'}
                        >
                            <Home className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </Button>

                        {/* Notifications */}
                        {/*<NotificationDropdown />*/}

                        {/* User Profile Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex items-center space-x-3 rounded-lg px-8 py-8 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {currentAdmin.first_name} {currentAdmin.last_name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{currentAdmin.role}</p>
                                    </div>
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={currentAdmin.avatar} alt={`${currentAdmin.first_name} ${currentAdmin.last_name}`} />
                                        <AvatarFallback className="bg-orange-500 text-white">
                                            {currentAdmin.first_name[0]}
                                            {currentAdmin.last_name[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-64 p-2" sideOffset={8}>
                                {/* User Info Header */}
                                <DropdownMenuLabel className="px-3 py-2">
                                    <div className="flex items-center space-x-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={currentAdmin.avatar} alt={`${currentAdmin.first_name} ${currentAdmin.last_name}`} />
                                            <AvatarFallback className="bg-orange-500 text-white">
                                                {currentAdmin.first_name[0]}
                                                {currentAdmin.last_name[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                                {currentAdmin.first_name} {currentAdmin.last_name}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{currentAdmin.email}</p>
                                            <div className="mt-1 flex items-center gap-2">
                                                <Shield className="h-3 w-3 text-orange-500" />
                                                <span className="text-xs text-orange-600 dark:text-orange-400">{currentAdmin.role}</span>
                                            </div>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>

                                <DropdownMenuSeparator />

                                {/* Profile Actions */}
                                <DropdownMenuItem onClick={handleViewProfile} className="cursor-pointer px-3 py-2">
                                    <UserCircle className="mr-3 h-4 w-4" />
                                    View Profile
                                </DropdownMenuItem>

                                <DropdownMenuItem onClick={handleSettingsClick} className="cursor-pointer px-3 py-2">
                                    <Settings className="mr-3 h-4 w-4" />
                                    Account Settings
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                {/* Account Info - NOW FUNCTIONAL */}
                                <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400">
                                    <div className="mb-1 flex items-center justify-between">
                                        <span>Member since:</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{formattedDates.joinDate}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Last login:</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{formattedDates.lastLogin}</span>
                                    </div>
                                </div>

                                <DropdownMenuSeparator />

                                {/* Logout */}
                                <DropdownMenuItem
                                    onClick={() => setShowLogoutDialog(true)}
                                    className="cursor-pointer px-3 py-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                                >
                                    <LogOut className="mr-3 h-4 w-4" />
                                    Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            {/* Logout Confirmation Dialog */}
            <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Sign Out</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to sign out of your Tips Moto admin account? You will need to log in again to access the dashboard.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isLoggingOut}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleLogout} disabled={isLoggingOut} className="bg-red-600 hover:bg-red-700 focus:ring-red-600">
                            {isLoggingOut ? (
                                <>
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                    Signing out...
                                </>
                            ) : (
                                <>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Sign Out
                                </>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
