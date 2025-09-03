import { useState } from 'react';
import { UserHomepage } from './pages/tips-moto/components/UserHomepage';
import { Toaster } from './pages/tips-moto/components/ui/sonner';

// Import utilities
import { createAuthHandlers } from './pages/tips-moto/utils/auth-handlers';
import { getTodayDateString, getYesterdayDateString } from './pages/tips-moto/utils/date-utils';
import { generateMatches, markTodaysFreeTips } from './pages/tips-moto/utils/match-data';
import { createMatchHandlers } from './pages/tips-moto/utils/match-handlers';

export default function AppContainer({ children, defaultPage }) {
    const [authState, setAuthState] = useState('homepage');
    const [currentUser, setCurrentUser] = useState(null);
    const [currentAdmin, setCurrentAdmin] = useState(null);

    const authHandlers = createAuthHandlers(setCurrentUser, setCurrentAdmin, setAuthState);

    const [allMatches, setAllMatches] = useState(() => {
        const matches = generateMatches();

        // Mark exactly 3 random tips from today as free
        markTodaysFreeTips(matches);

        // Enhanced Debug: Log detailed test data verification

        const todayString = getTodayDateString();
        const yesterdayString = getYesterdayDateString();

        const todayMatches = matches.filter((match) => match.date === todayString);
        const yesterdayMatches = matches.filter((match) => match.date === yesterdayString);

        if (yesterdayMatches.length > 0) {
            const allYesterdayTips = yesterdayMatches.reduce((total, match) => total + match.tipsData.length, 0);
            const winningYesterdayTips = yesterdayMatches.reduce(
                (total, match) => total + match.tipsData.filter((tip) => (tip).winningStatus === 'won').length,
                0,
            );
        } else {
        }

        if (todayMatches.length > 0) {
            const todayFreeTips = todayMatches.reduce((total, match) => total + match.tipsData.filter((tip) => (tip).free).length, 0);
        }

        // Sample recent matches for verification
        const recentMatches = matches.slice(0, 10);

        return matches;
    });

    return (
        <>
            <UserHomepage
                onBackToAdmin={() => setAuthState('adminLogin')}
                allMatches={allMatches}
                onUserSignIn={authHandlers.handleUserSignIn}
                onUserGetStarted={authHandlers.handleUserGetStarted}
            />
            <Toaster />
        </>
    );
}
