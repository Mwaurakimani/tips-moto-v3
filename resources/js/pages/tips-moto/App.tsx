import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardHeader } from './components/DashboardHeader';
import { StatsCards } from './components/StatsCards';
import { IncomeSummary } from './components/IncomeSummary';
import { RecentPurchases } from './components/RecentPurchases';
import { AccountsPage } from './components/AccountsPage';
import { MatchesPage } from './components/MatchesPage';
import { TipsPage } from './components/TipsPage';
import { SubscriptionsPage } from './components/SubscriptionsPage';
import { TransactionsPage } from './components/TransactionsPage';
import { NotificationsPage } from './components/NotificationsPage';
import { SettingsPage } from './components/SettingsPage';
import { ProfilePage } from './components/ProfilePage';
import { CustomerSupportPage } from './components/CustomerSupportPage';
import { UserHomepage } from './components/UserHomepage';
import { UserDashboard } from './components/UserDashboard';
import { AdminLoginPage } from './components/AdminLoginPage';
import { UserLoginPage } from './components/UserLoginPage';
import { UserSignUpPage } from './components/UserSignUpPage';
import { Toaster } from './components/ui/sonner';

console.log("test")

// Import utilities
import { getTodayDateString, getYesterdayDateString } from './utils/date-utils';
import { generateMatches, markTodaysFreeTips } from './utils/match-data';
import { createAuthHandlers } from './utils/auth-handlers';
import { createMatchHandlers } from './utils/match-handlers';

export default function App() {
  // Authentication states
  const [authState, setAuthState] = useState<'homepage' | 'userLogin' | 'userSignUp' | 'adminLogin' | 'userDashboard' | 'adminDashboard'>('homepage');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);

  // Admin dashboard states
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  
  // Global state for matches - diverse dataset
  const [allMatches, setAllMatches] = useState(() => {
    const matches = generateMatches();
    // Mark exactly 3 random tips from today as free
    markTodaysFreeTips(matches);
    
    // Enhanced Debug: Log detailed test data verification
    console.log('=== Enhanced Test Data Verification ===');
    console.log('Total matches generated:', matches.length);
    
    const todayString = getTodayDateString();
    const yesterdayString = getYesterdayDateString();
    
    console.log('Today\'s date string:', todayString);
    console.log('Yesterday\'s date string:', yesterdayString);
    
    const todayMatches = matches.filter(match => match.date === todayString);
    const yesterdayMatches = matches.filter(match => match.date === yesterdayString);
    
    console.log('Today\'s matches:', todayMatches.length);
    console.log('Yesterday\'s matches:', yesterdayMatches.length);
    
    if (yesterdayMatches.length > 0) {
      console.log('Yesterday\'s match details:', yesterdayMatches.map(m => ({
        id: m.id,
        teams: `${m.homeTeam} vs ${m.awayTeam}`,
        league: m.league,
        tips: m.tipsData.length,
        winningTips: m.tipsData.filter((tip: any) => tip.winningStatus === 'won').length
      })));
      
      const allYesterdayTips = yesterdayMatches.reduce((total, match) => total + match.tipsData.length, 0);
      const winningYesterdayTips = yesterdayMatches.reduce((total, match) => 
        total + match.tipsData.filter((tip: any) => tip.winningStatus === 'won').length, 0);
      
      console.log('Yesterday\'s total tips:', allYesterdayTips);
      console.log('Yesterday\'s winning tips:', winningYesterdayTips);
    } else {
      console.log('❌ No matches found for yesterday!');
    }
    
    if (todayMatches.length > 0) {
      const todayFreeTips = todayMatches.reduce((total, match) => 
        total + match.tipsData.filter((tip: any) => tip.free).length, 0);
      console.log('Today\'s free tips:', todayFreeTips);
    }
    
    // Sample recent matches for verification
    const recentMatches = matches.slice(0, 10);
    console.log('Sample recent matches:', recentMatches.map(m => ({
      date: m.date,
      teams: `${m.homeTeam} vs ${m.awayTeam}`,
      tips: m.tipsData.length
    })));
    
    return matches;
  });

  // Create handlers using factory functions
  const authHandlers = createAuthHandlers(setCurrentUser, setCurrentAdmin, setAuthState);
  const matchHandlers = createMatchHandlers(allMatches, setAllMatches);



  // Function to get today's free tips for the homepage
  const getTodaysFreeTips = () => {
    const todayDateString = getTodayDateString();
    const todayMatches = allMatches.filter(match => match.date === todayDateString);
    
    const freeTips: any[] = [];
    
    todayMatches.forEach(match => {
      match.tipsData.forEach((tip: any) => {
        if (tip.free) {
          freeTips.push({
            match: `${match.homeTeam} vs ${match.awayTeam}`,
            league: match.league,
            time: match.time,
            tip: tip.prediction,
            odds: '1.75', // Mock odds
            confidence: tip.riskLevel === 'low' ? 'High' : tip.riskLevel === 'mid' ? 'Medium' : 'Low',
            free: true
          });
        }
      });
    });

    return freeTips.slice(0, 3); // Ensure maximum 3 tips
  };

  const renderPageContent = () => {
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
            <TipsPage 
              matches={allMatches} 
              onTipUpdate={matchHandlers.handleTipUpdate}
              onViewHomepage={() => setAuthState('homepage')}
            />
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
            <ProfilePage 
              currentAdmin={currentAdmin}
              onPageChange={setCurrentPage}
            />
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
          <div className="max-w-7xl mx-auto space-y-6">
            <StatsCards matches={allMatches} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <IncomeSummary />
              <RecentPurchases onPageChange={setCurrentPage} />
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                {currentPage === 'marketing' ? 'Marketing' : 
                 currentPage === 'affiliate' ? 'Affiliate' :
                 currentPage === 'system' ? 'System' :
                 currentPage === 'model' ? 'Model' :
                 currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                This page is under construction
              </p>
            </div>
          </div>
        );
    }
  };

  // Render different views based on auth state
  switch (authState) {
    case 'adminLogin':
      return (
        <>
          <AdminLoginPage 
            onAdminLogin={authHandlers.handleAdminLogin}
            onGoToUserLogin={() => setAuthState('userLogin')}
            onBackToHomepage={() => setAuthState('homepage')}
          />
          <Toaster />
        </>
      );

    case 'userLogin':
      return (
        <>
          <UserLoginPage 
            onUserLogin={authHandlers.handleUserLogin}
            onGoToSignUp={() => setAuthState('userSignUp')}
            onGoToAdminLogin={() => setAuthState('adminLogin')}
            onBackToHomepage={() => setAuthState('homepage')}
          />
          <Toaster />
        </>
      );

    case 'userSignUp':
      return (
        <>
          <UserSignUpPage 
            onUserLogin={authHandlers.handleUserLogin}
            onGoToLogin={() => setAuthState('userLogin')}
            onGoToAdminLogin={() => setAuthState('adminLogin')}
            onBackToHomepage={() => setAuthState('homepage')}
          />
          <Toaster />
        </>
      );

    case 'userDashboard':
      return (
        <>
          <UserDashboard 
            onBackToHomepage={() => {
              setAuthState('homepage');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onLogout={authHandlers.handleLogout}
            allMatches={allMatches}
            userEmail={currentUser?.email || ''}
            userName={currentUser?.name || ''}
            currentUser={currentUser}
          />
          <Toaster />
        </>
      );

    case 'adminDashboard':
      return (
        <div className="flex h-screen bg-gray-50 dark:bg-black">
          <Sidebar 
            collapsed={sidebarCollapsed} 
            onToggle={setSidebarCollapsed}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
          <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'} min-w-0`}>
            <DashboardHeader 
              currentPage={currentPage} 
              onPageChange={setCurrentPage}
              currentAdmin={currentAdmin}
              onGoToHomepage={() => setAuthState('homepage')}
              onLogout={authHandlers.handleLogout}
            />
            <main className="flex-1 p-6 overflow-auto">
              {renderPageContent()}
            </main>
          </div>
          <Toaster />
        </div>
      );

    case 'homepage':
    default:
      return (
        <>
          <UserHomepage 
            onBackToAdmin={() => setAuthState('adminLogin')} 
            todaysFreeTips={getTodaysFreeTips()}
            allMatches={allMatches}
            onUserSignIn={authHandlers.handleUserSignIn}
            onUserGetStarted={authHandlers.handleUserGetStarted}
          />
          <Toaster />
        </>
      );
  }
}
