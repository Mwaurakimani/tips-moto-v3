// Date utility functions
import { api } from '@/api/client';

export const getYesterdayDateString = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  });
};

// Function to get yesterday's winning tips
export const getYesterdaysWinningTips = (allMatches: any[]) => {
  const yesterdayDateString = getYesterdayDateString();
  const yesterdayMatches = allMatches.filter(match => match.date === yesterdayDateString);

  const winningTips: any[] = [];

  yesterdayMatches.forEach(match => {
    match.tipsData?.forEach((tip: any) => {
      if (tip.winningStatus === 'won') {
        // Generate realistic odds based on risk level
        const getOddsForRisk = (riskLevel: string) => {
          switch (riskLevel) {
            case 'low': return (1.2 + Math.random() * 0.6).toFixed(2); // 1.20 - 1.80
            case 'mid': return (1.8 + Math.random() * 1.0).toFixed(2); // 1.80 - 2.80
            case 'high': return (2.8 + Math.random() * 2.2).toFixed(2); // 2.80 - 5.00
            default: return '2.10';
          }
        };

        winningTips.push({
          match: `${match.homeTeam} vs ${match.awayTeam}`,
          league: match.league,
          time: match.time,
          tip: tip.prediction,
          tipType: tip.tipType,
          odds: getOddsForRisk(tip.riskLevel),
          riskLevel: tip.riskLevel,
          winningStatus: tip.winningStatus
        });
      }
    });
  });

  // Return first 10 winning tips, shuffled for variety
  return winningTips.sort(() => Math.random() - 0.5).slice(0, 10);
};

// Function to process today's free tips with fallback data
export const fetchAndProcessTodaysFreeTips = async () => {
    try {
        const res = await api.get('/api/tips/free-today');
        const todaysFreeTips = res.data?.data ?? [];

        return todaysFreeTips.length > 0
            ? todaysFreeTips
            : [
                {
                    match: 'No free tips available',
                    league: 'Check back tomorrow',
                    time: '---',
                    tip: 'Premium tips available',
                    odds: '---',
                    confidence: 'High',
                    free: false
                }
            ];
    } catch (err) {
        console.error('Error fetching free tips:', err);
        return [
            {
                match: 'Error loading tips',
                league: 'Try again later',
                time: '---',
                tip: '---',
                odds: '---',
                confidence: '---',
                free: false
            }
        ];
    }
};

