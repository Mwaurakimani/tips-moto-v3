import { useState } from 'react';
import { UserDashboardHeader } from './UserDashboardHeader';
import { UserMobileBottomNav } from './UserMobileBottomNav';
import { UserDesktopSidebar } from './UserDesktopSidebar';
import { UserDashboardOverview } from './UserDashboardOverview';
import { UserPackagesBrowser } from './UserPackagesBrowser';
import { UserMyTips } from './UserMyTips';
import { UserAccountPage } from './UserAccountPage';
import { ThemeProvider } from './contexts/ThemeContext';

interface UserDashboardProps {
  onBackToHomepage: () => void;
  onLogout?: () => void;
  allMatches: any[];
  userEmail?: string;
  userName?: string;
  currentUser?: any;
}

export function UserDashboard({
  onBackToHomepage,
  onLogout,
  allMatches,
  userEmail = "user@example.com",
  userName = "John Doe",
  currentUser: propCurrentUser
}: UserDashboardProps) {
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Use prop data or fallback to mock data
  const currentUser = propCurrentUser || {
    name: userName,
    email: userEmail,
    avatar: '',
    subscriptionTier: propCurrentUser?.subscriptionStatus === 'VIP' ? 'VIP' : 'Trial',
    subscriptionStatus: propCurrentUser?.subscriptionStatus || 'active',
    subscriptionExpiry: '2025-02-15',
    totalSpent: 2450,
    joinDate: propCurrentUser?.joinDate || '2024-11-15',
    tipsAccessed: 127,
    winRate: 87.5,
    phone: '+254 700 123 456',
    location: 'Nairobi, Kenya'
  };

  const renderPageContent = () => {
    switch (currentPage) {
      case 'packages':
        return <UserPackagesBrowser allMatches={allMatches} currentUser={currentUser} />;
      case 'my-tips':
        return <UserMyTips onGoToPackages={setCurrentPage} />;
      case 'account':
        return <UserAccountPage currentUser={currentUser} />;
      default:
        return <UserDashboardOverview currentUser={currentUser} allMatches={allMatches} />;
    }
  };



  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        {/* Desktop Sidebar - Always rendered, visibility controlled by CSS classes */}
        <UserDesktopSidebar
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          currentUser={currentUser}
          isOpen={true}
        />



        {/* Main Content */}
        <div className="xl:ml-64">
          {/* Header */}
          <UserDashboardHeader
            currentUser={currentUser}
            onLogout={onLogout}
            onBackToHomepage={onBackToHomepage}
          />

          {/* Page Content */}
          <main className="p-4 lg:p-6 pb-20 xl:pb-6">
            <div className="max-w-7xl mx-auto">
              {renderPageContent()}
            </div>
          </main>
        </div>

        {/* Mobile Bottom Navigation - Always rendered, visibility controlled by CSS classes */}
        <UserMobileBottomNav
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </ThemeProvider>
  );
}
