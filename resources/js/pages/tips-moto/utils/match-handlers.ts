import { toast } from 'sonner';
import { createDateTime, getTodayDateString } from './date-utils';

// Match handlers factory
export const createMatchHandlers = (
  allMatches: any[],
  setAllMatches: (matches: any[] | ((prev: any[]) => any[])) => void
) => {
  // Handle adding a new match
  const handleAddMatch = (newMatchData: {
    league: string;
    homeTeam: string;
    awayTeam: string;
    date: string;
    time: string;
    status: string;
  }) => {
    // Generate a new ID (find the highest existing ID and add 1)
    const maxId = Math.max(...allMatches.map(m => m.id));
    const newId = maxId + 1;

    // Create dateTime for sorting
    const dateTime = createDateTime(newMatchData.date, newMatchData.time);

    // Create the new match object
    const newMatch = {
      id: newId,
      league: newMatchData.league,
      homeTeam: newMatchData.homeTeam,
      awayTeam: newMatchData.awayTeam,
      date: newMatchData.date,
      time: newMatchData.time,
      tips: 0, // New matches start with 0 tips
      tipsData: [], // Empty tips array
      status: newMatchData.status,
      dateTime: dateTime
    };

    // Add the new match to the state
    setAllMatches(prevMatches => {
      const updatedMatches = [...prevMatches, newMatch];
      // Sort by dateTime in descending order (newest matches first)
      return updatedMatches.sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());
    });
  };

  // Handle match updates from the detail view
  const handleMatchSave = (matchId: number, updatedFields: Partial<{
    league: string;
    homeTeam: string;
    awayTeam: string;
    date: string;
    time: string;
  }>) => {
    setAllMatches(prevMatches =>
      prevMatches.map(match => {
        if (match.id === matchId) {
          const updatedMatch = { ...match, ...updatedFields };
          // If date or time was updated, recalculate dateTime
          if (updatedFields.date || updatedFields.time) {
            updatedMatch.dateTime = createDateTime(
              updatedFields.date || match.date,
              updatedFields.time || match.time
            );
          }
          return updatedMatch;
        }
        return match;
      }).sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime()) // Re-sort after update
    );
  };

  // Function to count today's free tips across all matches
  const countTodaysFreeTips = (matches: any[], excludeMatchId?: number) => {
    const todayDateString = getTodayDateString();
    let freeCount = 0;

    matches.forEach(match => {
      if (match.date === todayDateString && match.id !== excludeMatchId) {
        match.tipsData.forEach((tip: any) => {
          if (tip.free) {
            freeCount++;
          }
        });
      }
    });

    return freeCount;
  };

  // Function to extract all tips from all matches for package selection
  const getAllAvailableTips = () => {
    const tips: any[] = [];

    allMatches.forEach(match => {
      match.tipsData.forEach((tip: any) => {
        tips.push({
          ...tip,
          matchId: match.id,
          league: match.league,
          homeTeam: match.homeTeam,
          awayTeam: match.awayTeam,
          matchDate: match.date,
          matchTime: match.time,
          matchStatus: match.status
        });
      });
    });

    return tips.sort((a, b) => b.matchId - a.matchId); // Sort by newest matches first
  };

  // Handle individual tip updates from the TipsPage
  const handleTipUpdate = (matchId: number, tipId: number, updatedTipData: Partial<any>) => {
    // Find the current tip to determine what changed
    const currentMatch = allMatches.find(m => m.id === matchId);
    const currentTip = currentMatch?.tipsData.find((t: any) => t.id === tipId);

    setAllMatches(prevMatches => {
      const updatedMatches = prevMatches.map(match => {
        if (match.id === matchId) {
          const updatedTipsData = match.tipsData.map((tip: any) => {
            if (tip.id === tipId) {
              return { ...tip, ...updatedTipData };
            }
            return tip;
          });
          return { ...match, tipsData: updatedTipsData };
        }
        return match;
      });

      // Show specific save confirmation based on what changed
      if (updatedTipData.hasOwnProperty('free')) {
        const wasFreeBefore = currentTip?.free;
        const isFreeNow = updatedTipData.free;

        if (wasFreeBefore !== isFreeNow) {
          toast.success(
            `Tip ${isFreeNow ? 'marked as free' : 'marked as premium'}!`,
            {
              description: `Changes saved and ${isFreeNow ? 'now visible' : 'removed from'} the homepage.`,
              duration: 4000,
            }
          );
        }
      } else {
        toast.success('Changes Saved Successfully!', {
          description: 'Tip updates have been saved and will reflect immediately.',
          duration: 3000,
        });
      }

      return updatedMatches;
    });
  };

  // Handle tips updates from the detail view with free tip validation
  const handleTipsUpdate = (matchId: number, newTips: any[]) => {
    // Check if the updated tips violate the daily free tip limit
    const currentMatch = allMatches.find(m => m.id === matchId);
    if (!currentMatch) return;

    // Only validate if this is today's match
    if (currentMatch.date === getTodayDateString()) {
      const currentFreeTipsCount = countTodaysFreeTips(allMatches, matchId);
      const newFreeTipsCount = newTips.filter(tip => tip.free).length;

      // Check if the new tips would exceed the limit
      if (currentFreeTipsCount + newFreeTipsCount > 3) {
        // Limit to only 3 free tips for today - keep first 3 as free, rest as premium
        let freeTipsUsed = currentFreeTipsCount;
        newTips = newTips.map(tip => {
          if (tip.free && freeTipsUsed < 3) {
            freeTipsUsed++;
            return tip;
          } else if (tip.free && freeTipsUsed >= 3) {
            return { ...tip, free: false };
          }
          return tip;
        });

        // Show a warning to the user
        toast.warning('Daily Free Tip Limit Reached', {
          description: `You can only have 3 free tips per day. Extra tips have been set to premium.`,
          duration: 5000,
        });
      }
    }

    setAllMatches(prevMatches =>
      prevMatches.map(match =>
        match.id === matchId
          ? { ...match, tips: newTips.length, tipsData: newTips }
          : match
      )
    );
  };

  return {
    handleAddMatch,
    handleMatchSave,
    handleTipUpdate,
    handleTipsUpdate,
    getAllAvailableTips,
    countTodaysFreeTips
  };
};
