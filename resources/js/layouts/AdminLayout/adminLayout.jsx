import { ThemeProvider } from '@/pages/tips-moto/components/contexts/ThemeContext.js';
import { DashboardHeader } from '@/pages/tips-moto/components/DashboardHeader.js';
import { Sidebar } from '@/pages/tips-moto/components/Sidebar.js';
import { Toaster } from '@/pages/tips-moto/components/ui/sonner.js';
import { createAuthHandlers } from '@/pages/tips-moto/utils/auth-handlers.js';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { fetchAuthUser } from '@/lib/authChecker.js';

export default function AdminLayout({ children }) {
    const { props } = usePage(); // Access Inertia props
    const currentPageTitle = props.currentPageTitle || 'Dashboard';
    // Destructure the user from props
    const rawUser = props.auth.user;

    // Format the dates
    const formattedDate = new Date(rawUser.created_at).toLocaleString('en-US', {
        month: 'short',
        year: 'numeric',
    });

    // Authentication
    const [authUser, setAuthUser] = useState(null);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);

    // Create the initial state object with derived properties
    const [currentUser, setCurrentUser] = useState({
        ...rawUser,
        joinDate: formattedDate,
        lastLogin: formattedDate,
    });

    const [currentAdmin, setCurrentAdmin] = useState(currentUser);


    const [authState, setAuthState] = useState('adminDashboard');

    // Admin dashboard states
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [currentPage, setCurrentPage] = useState(currentPageTitle);
    const [allMatches, setAllMatches] = useState([]);

    const authHandlers = createAuthHandlers(setCurrentUser, setCurrentAdmin, setAuthState);

    useEffect(() => {
        setCurrentPage(currentPageTitle);
    }, [currentPageTitle]);

    return (
        <ThemeProvider>
            <div className="flex h-screen bg-background">
                <Sidebar collapsed={sidebarCollapsed} onToggle={setSidebarCollapsed} currentPage={currentPage} onPageChange={setCurrentPage} />
                <div className={`flex flex-1 flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'} min-w-0`}>
                    <DashboardHeader
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                        currentAdmin={currentAdmin}
                        onGoToHomepage={() => setAuthState('homepage')}
                        onLogout={authHandlers.handleLogout}
                    />
                    <main className="flex-1 overflow-auto bg-background p-6">{children}</main>
                </div>
                <Toaster />
            </div>
        </ThemeProvider>
    );
}
