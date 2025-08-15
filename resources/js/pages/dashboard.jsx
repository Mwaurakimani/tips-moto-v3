import { IncomeSummary } from "../pages/tips-moto/components/IncomeSummary";
import { RecentPurchases } from '..//pages/tips-moto/components/RecentPurchases';
import { StatsCards } from '..//pages/tips-moto/components/StatsCards';
import { UserDashboard } from '..//pages/tips-moto/components/UserDashboard';
import { Toaster } from '..//pages/tips-moto/components/ui/sonner';
import { useEffect, useState } from 'react';

// Import utilities
import { createAuthHandlers } from '..//pages/tips-moto/utils/auth-handlers';
import { getTodayDateString, getYesterdayDateString } from '..//pages/tips-moto/utils/date-utils';
import { generateMatches, markTodaysFreeTips } from '..//pages/tips-moto/utils/match-data';
import axios from 'axios';


export default function AppContainer({ children }) {
    // Authentication states
    const [authState, setAuthState] = useState('userDashboard');

    const [authUser, setAuthUser] = useState(null);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);

    useEffect(() => {
        const successCallback = (resp ) => setAuthUser(resp.data.user);
        const failedCallback = () => setAuthUser(null);
        const finalCallback = () => setIsLoadingAuth(false);

        const fetchAuthUser = async (successCallback,failedCallback,finalCallback) => {
            try {
                const res = await axios.get(route('api_me'));
                successCallback(res)
            } catch (err) {
                console.error('No authenticated user found:', err);
                failedCallback()
            } finally {
                finalCallback()
            }
        };

        fetchAuthUser(successCallback, failedCallback, finalCallback);
    }, []);

    const [currentUser, setCurrentUser] = useState(null);
    const [currentAdmin, setCurrentAdmin] = useState(null);

    // Admin dashboard states
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [currentPage, setCurrentPage] = useState('dashboard');

    // Global state for matches - diverse dataset
    const [allMatches, setAllMatches] = useState(() => {[]});

    // Create handlers using factory functions
    const authHandlers = createAuthHandlers(setCurrentUser, setCurrentAdmin, setAuthState);

    const renderPageContent = () => {
        return (
            <div className="mx-auto max-w-7xl space-y-6">
                <StatsCards matches={allMatches} />
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <IncomeSummary />
                    <RecentPurchases onPageChange={setCurrentPage} />
                </div>
            </div>
        );
    };

    // Check if children are provided (for Inertia integration)
    if (children) {
        return (
            <>
                {children}
                <Toaster />
            </>
        );
    }

    if (isLoadingAuth) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div>Loading Your Dashboard...</div>
                {/* Or a fancy spinner component */}
            </div>
        );
    }

    // Render different views based on auth state
    return (
        <>
            <UserDashboard
                onBackToHomepage={() => {
                    setAuthState('homepage');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onLogout={authHandlers.handleLogout}
                allMatches={allMatches}
                // Now it's safe to access authUser because we know the check is done.
                // Use optional chaining (?.) for extra safety in case the user isn't logged in.
                userEmail={authUser?.email}
                userName={authUser ? `${authUser.first_name} ${authUser.last_name}` : ''}
                currentUser={currentUser} // Note: You might want to consolidate currentUser and authUser
            />
            <Toaster />
        </>
    );
}
