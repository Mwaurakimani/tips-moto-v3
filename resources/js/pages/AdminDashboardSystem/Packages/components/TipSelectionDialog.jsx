import { Badge } from '@/pages/tips-moto/components/ui/badge';
import { Button } from '@/pages/tips-moto/components/ui/button';
import { X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function TipSelectionDialog({ availableTips, editedTips, setEditedTips, subscriptionId, onClose }) {
    const [selectedTipsToAdd, setSelectedTipsToAdd] = useState([]);

    const handleTipSelectionToggle = (tipId) => {
        setSelectedTipsToAdd((prev) =>
            prev.includes(tipId) ? prev.filter((id) => id !== tipId) : [...prev, tipId]
        );
    };

    const handleAddSelectedTips = () => {
        const tipsToAdd = availableTips.filter((tip) => selectedTipsToAdd.includes(tip.id));


        // Create copies with new IDs to avoid conflicts
        const newTips = tipsToAdd.map((tip) => ({
            ...tip,
            id: tip.id,
            packageId: subscriptionId,
            addedToPackageAt: new Date().toISOString(),
        }));

        setEditedTips((prev) => [...prev, ...newTips]);

        toast.success('Tips Added Successfully!', {
            description: `${newTips.length} tip${newTips.length > 1 ? 's' : ''} added to the package.`,
            duration: 4000,
        });

        onClose();
    };

    const handleCancelTipSelection = () => {
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
            <div className="max-h-[80vh] max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl dark:bg-gray-800">
                <div className="border-b border-gray-200 p-6 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Select Tips to Add</h3>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                Choose from {availableTips.length} available tips
                            </p>
                        </div>
                        <Button variant="ghost" onClick={handleCancelTipSelection} className="text-gray-400 hover:text-gray-600">
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                <div className="max-h-96 overflow-y-auto p-6">
                    {availableTips.length === 0 ? (
                        <div className="py-8 text-center">
                            <p className="text-gray-500 dark:text-gray-400">
                                No tips available. Please add some tips in the Tips page first.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3">
                            {availableTips.map((tip) => {
                                const isSelected = selectedTipsToAdd.includes(tip.id);
                                const isAlreadyInPackage = editedTips.some(
                                    // (existingTip) => existingTip.id === tip.id || (existingTip.matchId === tip.matchId && existingTip.tipType === tip.tipType),
                                    (existingTip) => existingTip.id === tip.id,
                                );

                                return (
                                    <div
                                        key={tip.id}
                                        className={`cursor-pointer rounded-lg border p-4 transition-all ${
                                            isAlreadyInPackage
                                                ? 'cursor-not-allowed border-gray-300 bg-gray-100 opacity-50 dark:border-gray-600 dark:bg-gray-700'
                                                : isSelected
                                                  ? 'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20'
                                                  : 'border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700'
                                        }`}
                                        onClick={() => !isAlreadyInPackage && handleTipSelectionToggle(tip.id)}
                                    >
                                        <div className="flex items-start space-x-3">
                                            <div className="mt-1 flex-shrink-0">
                                                {isAlreadyInPackage ? (
                                                    <div className="h-4 w-4 rounded border bg-gray-400"></div>
                                                ) : (
                                                    <div
                                                        className={`h-4 w-4 rounded border ${
                                                            isSelected
                                                                ? 'border-blue-600 bg-blue-600'
                                                                : 'border-gray-300 dark:border-gray-600'
                                                        }`}
                                                    >
                                                        {isSelected && (
                                                            <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="mb-2 flex items-center space-x-2">
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {tip.homeTeam} vs {tip.awayTeam}
                                                    </span>
                                                    <Badge variant="outline" className="text-xs">
                                                        {tip.tipType}
                                                    </Badge>
                                                    {isAlreadyInPackage && (
                                                        <Badge className="bg-gray-500 text-xs">Already Added</Badge>
                                                    )}
                                                </div>
                                                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                                    <div className="flex items-center space-x-4">
                                                        <span>League: {tip.league}</span>
                                                        <span>Prediction: {tip.prediction}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-4">
                                                        <span>Date: {tip.matchDate || tip.date}</span>
                                                        <span>Time: {tip.matchTime || tip.time}</span>
                                                        <Badge
                                                            className={`text-xs ${
                                                                tip.riskLevel === 'low'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : tip.riskLevel === 'mid'
                                                                      ? 'bg-yellow-100 text-yellow-800'
                                                                      : 'bg-red-100 text-red-800'
                                                            }`}
                                                        >
                                                            {tip.riskLevel?.toUpperCase() || 'MID'} Risk
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="border-t border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedTipsToAdd.length} tip{selectedTipsToAdd.length !== 1 ? 's' : ''} selected
                        </p>
                        <div className="flex items-center space-x-3">
                            <Button variant="outline" onClick={handleCancelTipSelection}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleAddSelectedTips}
                                disabled={selectedTipsToAdd.length === 0}
                                className="bg-blue-600 text-white hover:bg-blue-700"
                            >
                                Add {selectedTipsToAdd.length} Tip{selectedTipsToAdd.length !== 1 ? 's' : ''}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
