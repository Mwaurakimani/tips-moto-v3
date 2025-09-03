import { AccountsPage } from '@/pages/tips-moto/components/AccountsPage.js';
import { CustomerSupportPage } from '@/pages/tips-moto/components/CustomerSupportPage';
import { IncomeSummary } from '@/pages/tips-moto/components/IncomeSummary';
import { MatchesPage } from '@/pages/tips-moto/components/MatchesPage';
import { NotificationsPage } from '@/pages/tips-moto/components/NotificationsPage';
import { ProfilePage } from '@/pages/tips-moto/components/ProfilePage';
import { RecentPurchases } from '@/pages/tips-moto/components/RecentPurchases';
import { SettingsPage } from '@/pages/tips-moto/components/SettingsPage';
import { StatsCards } from '@/pages/tips-moto/components/StatsCards';
import { SubscriptionsPage } from '@/pages/tips-moto/components/SubscriptionsPage';
import { TipsPage } from '@/pages/tips-moto/components/TipsPage';
import { TransactionsPage } from '@/pages/tips-moto/components/TransactionsPage';


const renderPageContent = (currentPage) => {
    switch (currentPage) {
        case 'accounts':
            return (
                <div className="w-full">
                    <AccountsPage />
                </div>
            );
        case 'matches':
            return (
                <div className="w-full">
                    <MatchesPage
                        matches={allMatches}
                        onAddMatch={matchHandlers.handleAddMatch}
                        onMatchSave={matchHandlers.handleMatchSave}
                        onTipsUpdate={matchHandlers.handleTipsUpdate}
                    />
                </div>
            );
        case 'tips':
            return (
                <div className="w-full">
                    <TipsPage matches={allMatches} onTipUpdate={matchHandlers.handleTipUpdate} onViewHomepage={() => setAuthState('homepage')} />
                </div>
            );
        case 'subscriptions':
            return (
                <div className="w-full">
                    <SubscriptionsPage availableTips={matchHandlers.getAllAvailableTips()} />
                </div>
            );
        case 'transactions':
            return (
                <div className="w-full">
                    <TransactionsPage />
                </div>
            );
        case 'notifications':
            return (
                <div className="w-full">
                    <NotificationsPage />
                </div>
            );
        case 'settings':
            return (
                <div className="w-full">
                    <SettingsPage />
                </div>
            );
        case 'profile':
            return (
                <div className="w-full">
                    <ProfilePage currentAdmin={currentAdmin} onPageChange={setCurrentPage} />
                </div>
            );
        case 'support':
            return (
                <div className="w-full">
                    <CustomerSupportPage />
                </div>
            );
        case 'dashboard':
            return (
                <div className="mx-auto max-w-7xl space-y-6">
                    <StatsCards matches={allMatches} />
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <IncomeSummary />
                        <RecentPurchases onPageChange={setCurrentPage} />
                    </div>
                </div>
            );
        default:
            return (
                <div className="flex h-64 items-center justify-center">
                    <div className="text-center">
                        <h2 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white">
                            {currentPage === 'marketing'
                                ? 'Marketing'
                                : currentPage === 'affiliate'
                                    ? 'Affiliate'
                                    : currentPage === 'system'
                                        ? 'System'
                                        : currentPage === 'model'
                                            ? 'Model'
                                            : currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">This page is under construction</p>
                    </div>
                </div>
            );
    }
};


export default renderPageContent;
