/**
 * Utility functions for tips management
 */

export const createNewTip = (baseData = {}) => {
    return {
        id: Date.now() + Math.random() * 1000,
        homeTeam: '',
        awayTeam: '',
        match: '',
        league: '',
        time: '',
        date: new Date().toISOString().split('T')[0],
        prediction: '',
        odds: '',
        riskLevel: 'mid',
        winningStatus: 'pending',
        confidence: 70,
        analysisReason: '',
        createdAt: new Date().toISOString(),
        ...baseData,
    };
};

export const validateTip = (tip) => {
    const errors = [];
    
    if (!tip.homeTeam?.trim()) errors.push('Home team is required');
    if (!tip.awayTeam?.trim()) errors.push('Away team is required');
    if (!tip.league?.trim()) errors.push('League is required');
    if (!tip.prediction?.trim()) errors.push('Prediction is required');
    if (!tip.time?.trim()) errors.push('Match time is required');
    
    return {
        isValid: errors.length === 0,
        errors,
    };
};

export const formatTipForDisplay = (tip) => {
    return {
        ...tip,
        match: tip.match || `${tip.homeTeam} vs ${tip.awayTeam}`,
        displayTime: formatTime(tip.time),
        displayDate: formatDate(tip.date || tip.matchDate),
        riskLevelLabel: getRiskLevelLabel(tip.riskLevel),
    };
};

export const filterTipsByStatus = (tips, status) => {
    if (status === 'all') return tips;
    return tips.filter(tip => tip.winningStatus === status);
};

export const sortTips = (tips, sortBy = 'date', order = 'desc') => {
    const sorted = [...tips].sort((a, b) => {
        switch (sortBy) {
            case 'date':
                return new Date(a.date || a.matchDate) - new Date(b.date || b.matchDate);
            case 'league':
                return a.league.localeCompare(b.league);
            case 'risk':
                const riskOrder = { low: 1, mid: 2, high: 3 };
                return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
            case 'status':
                return a.winningStatus.localeCompare(b.winningStatus);
            default:
                return 0;
        }
    });
    
    return order === 'desc' ? sorted.reverse() : sorted;
};

export const calculateTipsStats = (tips) => {
    const stats = {
        total: tips.length,
        won: 0,
        lost: 0,
        pending: 0,
        void: 0,
        winRate: 0,
    };
    
    tips.forEach(tip => {
        if (tip.winningStatus === 'won') stats.won++;
        else if (tip.winningStatus === 'lost') stats.lost++;
        else if (tip.winningStatus === 'pending') stats.pending++;
        else if (tip.winningStatus === 'void') stats.void++;
    });
    
    const decided = stats.won + stats.lost;
    stats.winRate = decided > 0 ? ((stats.won / decided) * 100).toFixed(1) : 0;
    
    return stats;
};

// Helper functions
const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
};

const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
};

const getRiskLevelLabel = (level) => {
    const labels = {
        low: 'Low Risk',
        mid: 'Medium Risk',
        high: 'High Risk',
    };
    return labels[level?.toLowerCase()] || 'Medium Risk';
};
