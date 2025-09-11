/**
 * Utility functions for package badges
 */

export const getStatusBadgeProps = (status) => {
    return status === true
        ? { className: 'bg-green-600 text-white', label: 'Active' }
        : { className: 'bg-gray-500 text-white', label: 'Inactive' };
};

export const getDescriptionBadgeProps = (description) => {
    const badges = {
        jackpot: { className: 'bg-purple-600 text-white', label: 'Jackpot' },
        match: { className: 'bg-blue-600 text-white', label: 'Match' },
        premium: { className: 'bg-yellow-600 text-white', label: 'Premium' },
        vip: { className: 'bg-indigo-600 text-white', label: 'VIP' },
        standard: { className: 'bg-gray-600 text-white', label: 'Standard' },
    };
    
    return badges[description?.toLowerCase()] || { 
        className: 'bg-gray-500 text-white', 
        label: description || 'Unknown' 
    };
};

export const getRiskLevelBadgeProps = (riskLevel) => {
    const levels = {
        low: { 
            className: 'border-green-500 text-green-600 bg-green-50 dark:bg-green-900/20', 
            label: 'Low Risk' 
        },
        mid: { 
            className: 'border-yellow-500 text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20', 
            label: 'Medium Risk' 
        },
        medium: { 
            className: 'border-yellow-500 text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20', 
            label: 'Medium Risk' 
        },
        high: { 
            className: 'border-red-500 text-red-600 bg-red-50 dark:bg-red-900/20', 
            label: 'High Risk' 
        },
    };
    
    return levels[riskLevel?.toLowerCase()] || levels.mid;
};

export const getWinningStatusBadgeProps = (status) => {
    const statuses = {
        won: { className: 'bg-green-600 text-white', label: 'Won' },
        lost: { className: 'bg-red-600 text-white', label: 'Lost' },
        void: { className: 'bg-gray-600 text-white', label: 'Void' },
        pending: { className: 'bg-yellow-600 text-white', label: 'Pending' },
    };
    
    return statuses[status?.toLowerCase()] || statuses.pending;
};
