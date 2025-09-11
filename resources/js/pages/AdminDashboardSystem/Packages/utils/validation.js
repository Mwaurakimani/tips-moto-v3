/**
 * Validation utilities for packages
 */

export const validatePackageName = (name) => {
    if (!name || name.trim().length === 0) {
        return { isValid: false, error: 'Package name is required' };
    }
    if (name.length < 3) {
        return { isValid: false, error: 'Package name must be at least 3 characters' };
    }
    if (name.length > 50) {
        return { isValid: false, error: 'Package name must not exceed 50 characters' };
    }
    return { isValid: true, error: null };
};

export const validatePackagePrice = (price) => {
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) {
        return { isValid: false, error: 'Price must be a valid number' };
    }
    if (numPrice <= 0) {
        return { isValid: false, error: 'Price must be greater than 0' };
    }
    if (numPrice > 1000000) {
        return { isValid: false, error: 'Price seems too high' };
    }
    return { isValid: true, error: null };
};

export const validatePackageTips = (tipsCount) => {
    const numTips = parseInt(tipsCount);
    if (isNaN(numTips)) {
        return { isValid: false, error: 'Tips count must be a valid number' };
    }
    if (numTips < 1) {
        return { isValid: false, error: 'Package must contain at least 1 tip' };
    }
    if (numTips > 100) {
        return { isValid: false, error: 'Package cannot contain more than 100 tips' };
    }
    return { isValid: true, error: null };
};

export const validatePackage = (packageData) => {
    const errors = {};
    
    // Validate name
    const nameValidation = validatePackageName(packageData.name);
    if (!nameValidation.isValid) {
        errors.name = nameValidation.error;
    }
    
    // Validate price
    const priceValidation = validatePackagePrice(packageData.price);
    if (!priceValidation.isValid) {
        errors.price = priceValidation.error;
    }
    
    // Validate tips count
    if (packageData.features?.tips) {
        const tipsValidation = validatePackageTips(packageData.features.tips);
        if (!tipsValidation.isValid) {
            errors.tips = tipsValidation.error;
        }
    }
    
    // Validate interval
    const validIntervals = ['Daily', 'Weekly', 'Monthly', 'Yearly'];
    if (!validIntervals.includes(packageData.interval)) {
        errors.interval = 'Invalid interval selected';
    }
    
    // Validate category
    const validCategories = ['jackpot', 'match', 'premium', 'vip', 'standard'];
    if (packageData.features?.category && 
        !validCategories.includes(packageData.features.category.toLowerCase())) {
        errors.category = 'Invalid category selected';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};
