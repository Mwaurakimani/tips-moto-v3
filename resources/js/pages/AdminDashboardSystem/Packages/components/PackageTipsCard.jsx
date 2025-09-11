import { Button } from '@/pages/tips-moto/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/tips-moto/components/ui/card';
import { Edit, Info, Plus, Save, Target, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { TipDisplay } from './TipDisplay';
import { TipEditForm } from './TipEditForm';

export function PackageTipsCard({ subscription, onUpdateSubscription, availableTips = [], onOpenTipSelector }) {
    const [isEditingTips, setIsEditingTips] = useState(false);
    const [editedTips, setEditedTips] = useState(subscription.tipsData || []);

    useEffect(() => {
        setEditedTips(subscription.tipsData || []);
    }, [subscription.tipsData]);

    const handleTipsSave = () => {
        const updatedSubscription = {
            ...subscription,
            tips: editedTips.length,
            tipsData: editedTips,
        };

        onUpdateSubscription(updatedSubscription);
        setIsEditingTips(false);
    };

    const handleTipsCancel = () => {
        setEditedTips(subscription.tipsData || []);
        setIsEditingTips(false);
    };

    const handleTipChange = (tipIndex, field, value) => {
        setEditedTips((prev) =>
            prev.map((tip, index) => {
                if (index === tipIndex) {
                    const updatedTip = { ...tip, [field]: value };

                    if (field === 'homeTeam' || field === 'awayTeam') {
                        const homeTeam = field === 'homeTeam' ? value : tip.homeTeam;
                        const awayTeam = field === 'awayTeam' ? value : tip.awayTeam;
                        updatedTip.match = `${homeTeam} vs ${awayTeam}`;
                    }

                    return updatedTip;
                }
                return tip;
            }),
        );
    };

    const handleAddTip = () => {
        if (availableTips.length === 0) {
            toast.error('No Tips Available', {
                description: 'Please add some tips in the Tips page first before adding them to packages.',
                duration: 5000,
            });
            return;
        }
        onOpenTipSelector(editedTips, setEditedTips);
    };

    const handleRemoveTip = (tipIndex) => {
        setEditedTips((prev) => prev.filter((_, index) => index !== tipIndex));
    };

    const handleMoveTip = (tipIndex, direction) => {
        setEditedTips((prev) => {
            const newTips = [...prev];
            const targetIndex = direction === 'up' ? tipIndex - 1 : tipIndex + 1;

            if (targetIndex >= 0 && targetIndex < newTips.length) {
                [newTips[tipIndex], newTips[targetIndex]] = [newTips[targetIndex], newTips[tipIndex]];
            }

            return newTips;
        });
    };

    const handleDuplicateTip = (tipIndex) => {
        const tipToDuplicate = editedTips[tipIndex];
        const duplicatedTip = {
            ...tipToDuplicate,
            id: Date.now() + Math.random() * 1000,
            match: tipToDuplicate.match + ' (Copy)',
        };

        setEditedTips((prev) => {
            const newTips = [...prev];
            newTips.splice(tipIndex + 1, 0, duplicatedTip);
            return newTips;
        });
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                        <Target className="h-5 w-5" />
                        <span>Package Tips ({isEditingTips ? editedTips.length : subscription.tipsData?.length || 0})</span>
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                        {isEditingTips ? (
                            <>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleTipsSave}
                                    className="text-green-600 hover:text-green-700"
                                >
                                    <Save className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleTipsCancel}
                                    className="text-red-600 hover:text-red-700"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsEditingTips(true)}
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {isEditingTips && (
                        <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
                            <div className="flex items-center space-x-2">
                                <Info className="h-4 w-4 text-blue-600" />
                                <span className="text-sm text-blue-800 dark:text-blue-200">
                                    You are now editing tips. Click Save to confirm changes or Cancel to discard.
                                </span>
                            </div>
                            <Button onClick={handleAddTip} size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Tips From Library
                            </Button>
                        </div>
                    )}

                    <div className="grid max-h-96 grid-cols-1 gap-4 overflow-y-auto">
                        {(isEditingTips ? editedTips : subscription.tipsData?.slice(0, 10) || []).map((tip, index) => (
                            <div key={tip.id || index} className="rounded-lg border bg-gray-50 p-4 dark:bg-gray-800">
                                {isEditingTips ? (
                                    <TipEditForm
                                        tip={tip}
                                        index={index}
                                        onTipChange={handleTipChange}
                                        onMoveTip={handleMoveTip}
                                        onDuplicateTip={handleDuplicateTip}
                                        onRemoveTip={handleRemoveTip}
                                        isFirst={index === 0}
                                        isLast={index === editedTips.length - 1}
                                    />
                                ) : (
                                    <TipDisplay tip={tip} index={index} />
                                )}
                            </div>
                        ))}
                    </div>

                    {!isEditingTips && subscription.tipsData && subscription.tipsData.length > 10 && (
                        <div className="border-t border-gray-200 pt-4 text-center dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Showing 10 of {subscription.tipsData.length} tips
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
