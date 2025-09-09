import { ThemeProvider } from '@/pages/tips-moto/components/contexts/ThemeContext.js';
import { UserDashboardHeader } from '@/pages/tips-moto/components/UserDashboardHeader';
import { UserDesktopSidebar } from '@/pages/tips-moto/components/UserDesktopSidebar';
import { UserMobileBottomNav } from '@/pages/tips-moto/components/UserMobileBottomNav';
import { Toaster } from '@/pages/tips-moto/components/ui/sonner.js';
import { usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function UserDashboardLayout({ children }) {
    const { props, url } = usePage(); // Access Inertia props and current URL
    
    // Get user data from Inertia props
    const rawUser = props.auth?.user;
    
    // Get current page from URL path
    const getCurrentPageFromUrl = (url) => {
        if (url.includes('/dashboard/packages')) return 'packages';
        if (url.includes('/dashboard/my-tips')) return 'my-tips';
        if (url.includes('/dashboard/account')) return 'account';
        return 'dashboard';
    };

    const [currentPage, setCurrentPage] = useState(getCurrentPageFromUrl(url));

    // Update current page when URL changes
    useEffect(() => {
        setCurrentPage(getCurrentPageFromUrl(url));
    }, [url]);

    // Format the user data with fallbacks
    const currentUser = rawUser ? {
        ...rawUser,
        name: `${rawUser.first_name || ''} ${rawUser.last_name || ''}`.trim() || 'User',
        email: rawUser.email || 'user@example.com',
        avatar: rawUser.avatar_url || '',
        subscriptionTier: rawUser.subscription_tier || 'Trial',
        subscriptionStatus: rawUser.subscription_status || 'active',
        subscriptionExpiry: rawUser.subscription_expiry || '2025-02-15',
        totalSpent: rawUser.total_spent || 0,
        joinDate: rawUser.created_at ? new Date(rawUser.created_at).toLocaleDateString() : new Date().toLocaleDateString(),
        tipsAccessed: rawUser.tips_accessed || 0,
        winRate: rawUser.win_rate || 0,
        phone: rawUser.phone || '',
        location: rawUser.location || 'Kenya'
    } : {
        name: 'Guest User',
        email: 'guest@example.com',
        avatar: '',
        subscriptionTier: 'Trial',
        subscriptionStatus: 'inactive',
        subscriptionExpiry: '2025-02-15',
        totalSpent: 0,
        joinDate: new Date().toLocaleDateString(),
        tipsAccessed: 0,
        winRate: 0,
        phone: '',
        location: 'Kenya'
    };

    // Navigation handler for Inertia routing
    const handlePageChange = (page) => {
        setCurrentPage(page);
        
        // Navigate using Inertia router
        switch (page) {
            case 'packages':
                router.visit(route('dashboard.packages'));
                break;
            case 'my-tips':
                router.visit(route('dashboard.my-tips'));
                break;
            case 'account':
                router.visit(route('dashboard.account'));
                break;
            default:
                router.visit(route('dashboard'));
                break;
        }
    };

    // Logout handler
    const handleLogout = () => {
        router.post(route('logout'));
    };

    // Back to homepage handler
    const handleBackToHomepage = () => {
        router.visit(route('home'));
    };

    return (
        <ThemeProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-black">
                {/* Desktop Sidebar */}
                <UserDesktopSidebar
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    currentUser={currentUser}
                    isOpen={true}
                />

                {/* Main Content */}
                <div className="xl:ml-64">
                    {/* Header */}
                    <UserDashboardHeader
                        currentUser={currentUser}
                        onLogout={handleLogout}
                        onBackToHomepage={handleBackToHomepage}
                    />

                    {/* Page Content - This is where Inertia will render the specific page component */}
                    <main className="p-4 lg:p-6 pb-20 xl:pb-6">
                        <div className="max-w-7xl mx-auto">
                            {children}
                        </div>
                    </main>
                </div>

                {/* Mobile Bottom Navigation */}
                <UserMobileBottomNav
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
                
                <Toaster />
            </div>
        </ThemeProvider>
    );
}