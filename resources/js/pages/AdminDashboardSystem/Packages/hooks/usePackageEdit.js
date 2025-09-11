import { useState, useCallback } from 'react';

/**
 * Custom hook for managing package editing state
 */
export function usePackageEdit(initialPackage) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedPackage, setEditedPackage] = useState({ ...initialPackage });

    const startEditing = useCallback(() => {
        setIsEditing(true);
    }, []);

    const cancelEditing = useCallback(() => {
        setEditedPackage({ ...initialPackage });
        setIsEditing(false);
    }, [initialPackage]);

    const saveChanges = useCallback(() => {
        setIsEditing(false);
        return editedPackage;
    }, [editedPackage]);

    const updateField = useCallback((field, value) => {
        setEditedPackage((prev) => ({
            ...prev,
            [field]: value,
        }));
    }, []);

    const updateNestedField = useCallback((parentField, field, value) => {
        setEditedPackage((prev) => ({
            ...prev,
            [parentField]: {
                ...prev[parentField],
                [field]: value,
            },
        }));
    }, []);

    return {
        isEditing,
        editedPackage,
        startEditing,
        cancelEditing,
        saveChanges,
        updateField,
        updateNestedField,
    };
}
