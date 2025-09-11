import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook for managing tips editing state
 */
export function useTipsEdit(initialTips = []) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTips, setEditedTips] = useState(initialTips);

    useEffect(() => {
        setEditedTips(initialTips);
    }, [initialTips]);

    const startEditing = useCallback(() => {
        setIsEditing(true);
    }, []);

    const cancelEditing = useCallback(() => {
        setEditedTips(initialTips);
        setIsEditing(false);
    }, [initialTips]);

    const saveChanges = useCallback(() => {
        setIsEditing(false);
        return editedTips;
    }, [editedTips]);

    const updateTip = useCallback((tipIndex, field, value) => {
        setEditedTips((prev) =>
            prev.map((tip, index) => {
                if (index === tipIndex) {
                    const updatedTip = { ...tip, [field]: value };

                    // Auto-update match field when teams change
                    if (field === 'homeTeam' || field === 'awayTeam') {
                        const homeTeam = field === 'homeTeam' ? value : tip.homeTeam;
                        const awayTeam = field === 'awayTeam' ? value : tip.awayTeam;
                        updatedTip.match = `${homeTeam} vs ${awayTeam}`;
                    }

                    return updatedTip;
                }
                return tip;
            })
        );
    }, []);

    const addTip = useCallback((tip) => {
        setEditedTips((prev) => [...prev, tip]);
    }, []);

    const addMultipleTips = useCallback((tips) => {
        setEditedTips((prev) => [...prev, ...tips]);
    }, []);

    const removeTip = useCallback((tipIndex) => {
        setEditedTips((prev) => prev.filter((_, index) => index !== tipIndex));
    }, []);

    const moveTip = useCallback((tipIndex, direction) => {
        setEditedTips((prev) => {
            const newTips = [...prev];
            const targetIndex = direction === 'up' ? tipIndex - 1 : tipIndex + 1;

            if (targetIndex >= 0 && targetIndex < newTips.length) {
                [newTips[tipIndex], newTips[targetIndex]] = [newTips[targetIndex], newTips[tipIndex]];
            }

            return newTips;
        });
    }, []);

    const duplicateTip = useCallback((tipIndex) => {
        setEditedTips((prev) => {
            const tipToDuplicate = prev[tipIndex];
            const duplicatedTip = {
                ...tipToDuplicate,
                id: Date.now() + Math.random() * 1000,
                match: tipToDuplicate.match + ' (Copy)',
            };

            const newTips = [...prev];
            newTips.splice(tipIndex + 1, 0, duplicatedTip);
            return newTips;
        });
    }, []);

    return {
        isEditing,
        editedTips,
        startEditing,
        cancelEditing,
        saveChanges,
        updateTip,
        addTip,
        addMultipleTips,
        removeTip,
        moveTip,
        duplicateTip,
    };
}
