/**
 * Formatting utilities for packages
 */

export const formatCurrency = (amount, currency = 'KES') => {
    if (typeof amount !== 'number') {
        amount = parseFloat(amount) || 0;
    }
    
    return `${currency} ${amount.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })}`;
};

export const formatDate = (date) => {
    if (!date) return '';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export const formatDateTime = (date) => {
    if (!date) return '';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    return d.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const formatPercentage = (value, decimals = 1) => {
    if (typeof value !== 'number') {
        value = parseFloat(value) || 0;
    }
    
    return `${value.toFixed(decimals)}%`;
};

export const formatNumber = (value, decimals = 0) => {
    if (typeof value !== 'number') {
        value = parseFloat(value) || 0;
    }
    
    return value.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
};

export const getIntervalLabel = (interval) => {
    const labels = {
        daily: 'Daily',
        weekly: 'Weekly',
        monthly: 'Monthly',
        yearly: 'Yearly',
        annual: 'Annual',
    };
    
    return labels[interval?.toLowerCase()] || interval;
};

export const getPackageTypeLabel = (type) => {
    const labels = {
        jackpot: 'Jackpot Package',
        match: 'Match Package',
        premium: 'Premium Package',
        vip: 'VIP Package',
        standard: 'Standard Package',
    };
    
    return labels[type?.toLowerCase()] || 'Package';
};
