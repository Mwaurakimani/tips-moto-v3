import { useState, useEffect } from 'react';
import {
    ArrowLeft,
    Edit,
    Save,
    X,
    Calendar,
    DollarSign,
    Target,
    Clock,
    Users,
    Info,
    Trash2,
    Plus,
    ChevronUp,
    ChevronDown,
    Copy
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';

export function PackageDetailView({
                                      subscription,
                                      onBack,
                                      onUpdateSubscription,
                                      onDeleteSubscription,
                                      availableTips = []
                                  }) {
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingTips, setIsEditingTips] = useState(false);
    const [editedSubscription, setEditedSubscription] = useState({ ...subscription });
    const [editedTips, setEditedTips] = useState(subscription.tipsData || []);
    const [deletingSubscription, setDeletingSubscription] = useState(null);
    const [showTipSelector, setShowTipSelector] = useState(false);
    const [selectedTipsToAdd, setSelectedTipsToAdd] = useState([]);

    useEffect(() => {
        setEditedTips(subscription.tipsData || []);
    }, [subscription.tipsData]);

    const getStatusBadge = (status) => {
        return status === true
            ? <Badge className="bg-green-600 text-white">Active</Badge>
            : <Badge variant="secondary">Inactive</Badge>;
    };

    const getDescriptionBadge = (description) => {
        switch (description) {
            case 'jackpot':
                return <Badge className="bg-purple-600 text-white">Jackpot</Badge>;
            case 'match':
                return <Badge className="bg-blue-600 text-white">Match</Badge>;
            case 'premium':
                return <Badge className="bg-yellow-600 text-white">Premium</Badge>;
            default:
                return <Badge variant="secondary">{description}</Badge>;
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        const updatedSubscription = {
            ...subscription,
            ...editedSubscription
        };

        onUpdateSubscription(updatedSubscription);
        setIsEditing(false);
    };

    const handleTipsSave = () => {
        const updatedSubscription = {
            ...subscription,
            tips: editedTips.length,
            tipsData: editedTips
        };

        onUpdateSubscription(updatedSubscription);
        setIsEditingTips(false);

        toast.success('Tips Updated Successfully!', {
            description: `Package now contains ${editedTips.length} tips. Changes have been saved.`,
            duration: 4000
        });
    };

    const handleTipsCancel = () => {
        setEditedTips(subscription.tipsData || []);
        setIsEditingTips(false);
    };

    const handleCancel = () => {
        setEditedSubscription({
            ...subscription
        });
        setIsEditing(false);
    };

    const handleInputChange = (field, value) => {
        setEditedSubscription(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleDeleteClick = () => {
        setDeletingSubscription(subscription);
    };

    const handleDeleteSubscription = (subscriptionId) => {
        onDeleteSubscription(subscriptionId);
        setDeletingSubscription(null);
        onBack();
    };

    const handleTipChange = (tipIndex, field, value) => {
        setEditedTips(prev => prev.map((tip, index) => {
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
        }));
    };

    const handleAddTip = () => {
        if (availableTips.length === 0) {
            toast.error('No Tips Available', {
                description: 'Please add some tips in the Tips page first before adding them to packages.',
                duration: 5000
            });
            return;
        }
        setShowTipSelector(true);
    };

    const handleTipSelectionToggle = (tipId) => {
        setSelectedTipsToAdd(prev =>
            prev.includes(tipId)
                ? prev.filter(id => id !== tipId)
                : [...prev, tipId]
        );
    };

    const handleAddSelectedTips = () => {
        const tipsToAdd = availableTips.filter(tip => selectedTipsToAdd.includes(tip.id));

        // Create copies with new IDs to avoid conflicts
        const newTips = tipsToAdd.map(tip => ({
            ...tip,
            id: Date.now() + Math.random() * 1000 + tip.id, // Ensure unique ID
            packageId: subscription.id, // Track which package this tip belongs to
            addedToPackageAt: new Date().toISOString() // Track when added
        }));

        setEditedTips(prev => [...prev, ...newTips]);
        setShowTipSelector(false);
        setSelectedTipsToAdd([]);

        toast.success('Tips Added Successfully!', {
            description: `${newTips.length} tip${newTips.length > 1 ? 's' : ''} added to the package.`,
            duration: 4000
        });
    };

    const handleCancelTipSelection = () => {
        setShowTipSelector(false);
        setSelectedTipsToAdd([]);
    };

    const handleRemoveTip = (tipIndex) => {
        setEditedTips(prev => prev.filter((_, index) => index !== tipIndex));
    };

    const handleMoveTip = (tipIndex, direction) => {
        setEditedTips(prev => {
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
            match: tipToDuplicate.match + ' (Copy)'
        };

        setEditedTips(prev => {
            const newTips = [...prev];
            newTips.splice(tipIndex + 1, 0, duplicatedTip);
            return newTips;
        });
    };

    const displaySubscription = isEditing ? editedSubscription : {
        ...subscription
    };

    const analytics = {
        totalSubscribers: Math.floor(Math.random() * 500) + 50,
        activeSubscribers: Math.floor(Math.random() * 400) + 30,
        weeklyRevenue: subscription.price * (Math.floor(Math.random() * 20) + 5),
        successRate: Math.floor(Math.random() * 30) + 60,
        averageRating: (Math.random() * 2 + 3).toFixed(1),
        totalRevenue: subscription.price * (Math.floor(Math.random() * 100) + 20)
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onBack}
                        className="flex items-center space-x-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to Packages</span>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {displaySubscription.name}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Package #{subscription.id} • {getDescriptionBadge(displaySubscription.description)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Package Information */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center space-x-2">
                                    <Info className="h-5 w-5" />
                                    <span>Package Information</span>
                                </CardTitle>
                                <div className="flex items-center space-x-2">
                                    {isEditing ? (
                                        <>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleSave}
                                                className="text-green-600 hover:text-green-700"
                                            >
                                                <Save className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleCancel}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleEditClick}
                                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Package Name */}
                            {isEditing ? (
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm text-gray-600 dark:text-gray-400">Package
                                        Name</Label>
                                    <Input
                                        id="name"
                                        value={editedSubscription.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <div
                                        className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                        <Info className="h-4 w-4" />
                                        <span>Package Name</span>
                                    </div>
                                    <p className="font-medium text-black dark:text-white">{displaySubscription.name}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div
                                        className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                        <Calendar className="h-4 w-4" />
                                        <span>Created Date</span>
                                    </div>
                                    <p className="font-medium text-black dark:text-white">{subscription.created_at}</p>
                                </div>

                                <div className="space-y-2">
                                    <div
                                        className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                        <Target className="h-4 w-4" />
                                        <span>Package Type</span>
                                    </div>
                                    {isEditing ? (
                                        <Select
                                            value={editedSubscription.features.category}
                                            onValueChange={(value) => handleInputChange('editedSubscription.features.category', value)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="jackpot">Jackpot</SelectItem>
                                                <SelectItem value="match">Match</SelectItem>
                                                <SelectItem value="premium">Premium</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        getDescriptionBadge(displaySubscription.features.category)
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <div
                                        className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                        <Clock className="h-4 w-4" />
                                        <span>Frequency</span>
                                    </div>
                                    {isEditing ? (
                                        <Select
                                            value={editedSubscription.interval}
                                            onValueChange={(value) => handleInputChange('interval', value)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Daily">Daily</SelectItem>
                                                <SelectItem value="Weekly">Weekly</SelectItem>
                                                <SelectItem value="Monthly">Monthly</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <Badge variant="outline">{displaySubscription.interval}</Badge>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <div
                                        className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                        <DollarSign className="h-4 w-4" />
                                        <span>Price</span>
                                    </div>
                                    {isEditing ? (
                                        <Input
                                            type="number"
                                            value={editedSubscription.price}
                                            onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                                            className="w-full"
                                            min="1"
                                            step="0.01"
                                        />
                                    ) : (
                                        <p className="font-medium text-green-600 text-lg">
                                            KES {displaySubscription.price.toLocaleString()}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <div
                                        className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                        <Target className="h-4 w-4" />
                                        <span>Tips Count</span>
                                    </div>
                                    {isEditing ? (
                                        <Input
                                            type="number"
                                            value={editedSubscription.features.tips}
                                            onChange={(e) => handleInputChange('editedSubscription.features.tips', parseInt(e.target.value) || 0)}
                                            className="w-full"
                                            min="1"
                                        />
                                    ) : (
                                        <p className="font-medium text-black dark:text-white">{displaySubscription.features.tips}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <div
                                        className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                        <span>Status</span>
                                    </div>
                                    {isEditing ? (
                                        <Select
                                            value={editedSubscription.is_active}
                                            onValueChange={(value) => handleInputChange('is_active', value === 'Active')}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Active">Active</SelectItem>
                                                <SelectItem value="Inactive">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        getStatusBadge(displaySubscription.is_active)
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Package Description */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Package Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    This {displaySubscription.features.category} package
                                    provides {displaySubscription.features.tips} carefully selected tips.
                                    Our expert analysts use advanced statistical models and insider knowledge to deliver
                                    high-quality predictions
                                    that maximize your winning potential.
                                </p>

                                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                    <h4 className="font-medium text-black dark:text-white mb-2">Key Features:</h4>
                                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                        {/*<li>• {displaySubscription.tips} expert predictions per {displaySubscription.duration.toLowerCase()}</li>*/}
                                        <li>• Detailed analysis and reasoning for each tip</li>
                                        <li>• Real-time notifications when new tips are available</li>
                                        <li>• Historical performance tracking</li>
                                        <li>• 24/7 customer support</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Package Tips */}
                    {((subscription.tipsData && subscription.tipsData.length > 0) || isEditingTips) && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center space-x-2">
                                        <Target className="h-5 w-5" />
                                        <span>Package Tips ({isEditingTips ? editedTips.length : (subscription.tipsData?.length || 0)})</span>
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
                                        <div
                                            className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                            <div className="flex items-center space-x-2">
                                                <Info className="h-4 w-4 text-blue-600" />
                                                <span className="text-sm text-blue-800 dark:text-blue-200">
                          You are now editing tips. Click Save to confirm changes or Cancel to discard.
                        </span>
                                            </div>
                                            <Button
                                                onClick={handleAddTip}
                                                size="sm"
                                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                            >
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add Tips From Library
                                            </Button>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
                                        {(isEditingTips ? editedTips : (subscription.tipsData?.slice(0, 10) || [])).map((tip, index) => (
                                            <div key={tip.id || index}
                                                 className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border">
                                                {isEditingTips ? (
                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <h5 className="font-medium text-black dark:text-white">Tip
                                                                #{index + 1}</h5>
                                                            <div className="flex items-center space-x-1">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleMoveTip(index, 'up')}
                                                                    disabled={index === 0}
                                                                    className="h-6 w-6 p-0"
                                                                >
                                                                    <ChevronUp className="h-3 w-3" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleMoveTip(index, 'down')}
                                                                    disabled={index === editedTips.length - 1}
                                                                    className="h-6 w-6 p-0"
                                                                >
                                                                    <ChevronDown className="h-3 w-3" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleDuplicateTip(index)}
                                                                    className="h-6 w-6 p-0 text-blue-600"
                                                                >
                                                                    <Copy className="h-3 w-3" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleRemoveTip(index)}
                                                                    className="h-6 w-6 p-0 text-red-600"
                                                                >
                                                                    <Trash2 className="h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div className="space-y-1">
                                                                <Label className="text-xs">Home Team</Label>
                                                                <Input
                                                                    value={tip.homeTeam || ''}
                                                                    onChange={(e) => handleTipChange(index, 'homeTeam', e.target.value)}
                                                                    className="h-8 text-sm"
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <Label className="text-xs">Away Team</Label>
                                                                <Input
                                                                    value={tip.awayTeam || ''}
                                                                    onChange={(e) => handleTipChange(index, 'awayTeam', e.target.value)}
                                                                    className="h-8 text-sm"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div className="space-y-1">
                                                                <Label className="text-xs">League</Label>
                                                                <Input
                                                                    value={tip.league || ''}
                                                                    onChange={(e) => handleTipChange(index, 'league', e.target.value)}
                                                                    className="h-8 text-sm"
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <Label className="text-xs">Match Time</Label>
                                                                <Input
                                                                    value={tip.time || ''}
                                                                    onChange={(e) => handleTipChange(index, 'time', e.target.value)}
                                                                    className="h-8 text-sm"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div className="space-y-1">
                                                                <Label className="text-xs">Prediction</Label>
                                                                <Select
                                                                    value={tip.prediction || ''}
                                                                    onValueChange={(value) => handleTipChange(index, 'prediction', value)}
                                                                >
                                                                    <SelectTrigger className="h-8 text-sm">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="Home Win">Home
                                                                            Win</SelectItem>
                                                                        <SelectItem value="Draw">Draw</SelectItem>
                                                                        <SelectItem value="Away Win">Away
                                                                            Win</SelectItem>
                                                                        <SelectItem value="Home Win or Draw">Home Win or
                                                                            Draw</SelectItem>
                                                                        <SelectItem value="Home Win or Away Win">Home
                                                                            Win or Away Win</SelectItem>
                                                                        <SelectItem value="Draw or Away Win">Draw or
                                                                            Away Win</SelectItem>
                                                                        <SelectItem value="Over 1.5 Goals">Over 1.5
                                                                            Goals</SelectItem>
                                                                        <SelectItem value="Over 2.5 Goals">Over 2.5
                                                                            Goals</SelectItem>
                                                                        <SelectItem value="Under 2.5 Goals">Under 2.5
                                                                            Goals</SelectItem>
                                                                        <SelectItem value="Both Teams Score">Both Teams
                                                                            Score</SelectItem>
                                                                        <SelectItem value="Clean Sheet">Clean
                                                                            Sheet</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <Label className="text-xs">Odds</Label>
                                                                <Input
                                                                    value={tip.odds || ''}
                                                                    onChange={(e) => handleTipChange(index, 'odds', e.target.value)}
                                                                    className="h-8 text-sm"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-3 gap-3">
                                                            <div className="space-y-1">
                                                                <Label className="text-xs">Risk Level</Label>
                                                                <Select
                                                                    value={tip.riskLevel || ''}
                                                                    onValueChange={(value) => handleTipChange(index, 'riskLevel', value)}
                                                                >
                                                                    <SelectTrigger className="h-8 text-sm">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="low">Low</SelectItem>
                                                                        <SelectItem value="mid">Medium</SelectItem>
                                                                        <SelectItem value="high">High</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <Label className="text-xs">Status</Label>
                                                                <Select
                                                                    value={tip.winningStatus || ''}
                                                                    onValueChange={(value) => handleTipChange(index, 'winningStatus', value)}
                                                                >
                                                                    <SelectTrigger className="h-8 text-sm">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="pending">Pending</SelectItem>
                                                                        <SelectItem value="won">Won</SelectItem>
                                                                        <SelectItem value="lost">Lost</SelectItem>
                                                                        <SelectItem value="void">Void</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <Label className="text-xs">Confidence %</Label>
                                                                <Input
                                                                    type="number"
                                                                    min="0"
                                                                    max="100"
                                                                    value={tip.confidence || ''}
                                                                    onChange={(e) => handleTipChange(index, 'confidence', parseInt(e.target.value) || 0)}
                                                                    className="h-8 text-sm"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <Label className="text-xs">Analysis Reason</Label>
                                                            <Textarea
                                                                value={tip.analysisReason || ''}
                                                                onChange={(e) => handleTipChange(index, 'analysisReason', e.target.value)}
                                                                className="text-sm min-h-[60px]"
                                                                placeholder="Enter analysis reasoning..."
                                                            />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div className="flex-1">
                                                                <h5 className="font-medium text-black dark:text-white">{tip.match}</h5>
                                                                <p className="text-sm text-gray-600 dark:text-gray-400">{tip.league}</p>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <Badge
                                                                    className={
                                                                        tip.winningStatus === 'won' ? 'bg-green-600 text-white' :
                                                                            tip.winningStatus === 'lost' ? 'bg-red-600 text-white' :
                                                                                tip.winningStatus === 'void' ? 'bg-gray-600 text-white' :
                                                                                    'bg-yellow-600 text-white'
                                                                    }
                                                                >
                                                                    {tip.winningStatus.charAt(0).toUpperCase() + tip.winningStatus.slice(1)}
                                                                </Badge>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4 mb-3">
                                                            <div>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">Prediction</p>
                                                                <p className="font-medium text-orange-600">{tip.prediction}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">Odds</p>
                                                                <p className="font-bold text-green-600">{tip.odds}</p>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4 mb-3">
                                                            <div>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">Risk
                                                                    Level</p>
                                                                <Badge
                                                                    variant="outline"
                                                                    className={
                                                                        tip.riskLevel === 'low' ? 'border-green-500 text-green-600' :
                                                                            tip.riskLevel === 'mid' ? 'border-yellow-500 text-yellow-600' :
                                                                                'border-red-500 text-red-600'
                                                                    }
                                                                >
                                                                    {tip.riskLevel.charAt(0).toUpperCase() + tip.riskLevel.slice(1)}
                                                                </Badge>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">Confidence</p>
                                                                <p className="font-medium text-blue-600">{tip.confidence}%</p>
                                                            </div>
                                                        </div>

                                                        {tip.analysisReason && (
                                                            <div
                                                                className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Analysis</p>
                                                                <p className="text-sm text-gray-700 dark:text-gray-300">{tip.analysisReason}</p>
                                                            </div>
                                                        )}

                                                        <div
                                                            className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                                            <div
                                                                className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                                                <span>Match Time: {tip.time}</span>
                                                                <span>Expected Return: {tip.expectedReturn}</span>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {!isEditingTips && subscription.tipsData && subscription.tipsData.length > 10 && (
                                        <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Showing 10 of {subscription.tipsData.length} tips
                                            </p>
                                            <Badge variant="outline" className="mt-2">
                                                {subscription.tipsData.filter(tip => tip.winningStatus === 'won').length} Won
                                                • {' '}
                                                {subscription.tipsData.filter(tip => tip.winningStatus === 'lost').length} Lost
                                                • {' '}
                                                {subscription.tipsData.filter(tip => tip.winningStatus === 'pending').length} Pending
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Analytics Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Users className="h-5 w-5" />
                                <span>Analytics</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Subscribers</span>
                                    <span
                                        className="font-semibold text-black dark:text-white">{analytics.totalSubscribers}</span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Active Subscribers</span>
                                    <span className="font-semibold text-green-600">{analytics.activeSubscribers}</span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Success Rate</span>
                                    <span className="font-semibold text-blue-600">{analytics.successRate}%</span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Average Rating</span>
                                    <span className="font-semibold text-yellow-600">{analytics.averageRating}/5.0</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <DollarSign className="h-5 w-5" />
                                <span>Revenue</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Weekly Revenue</span>
                                    <span className="font-semibold text-green-600">
                    KES {analytics.weeklyRevenue.toLocaleString()}
                  </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</span>
                                    <span className="font-semibold text-green-600">
                    KES {analytics.totalRevenue.toLocaleString()}
                  </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Revenue per User</span>
                                    <span className="font-semibold text-green-600">
                    KES {Math.round(analytics.totalRevenue / analytics.totalSubscribers).toLocaleString()}
                  </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button
                                onClick={handleDeleteClick}
                                className="w-full flex items-center justify-center space-x-2"
                                variant="destructive"
                            >
                                <Trash2 className="h-4 w-4" />
                                <span>Delete Package</span>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            {deletingSubscription && (
                <DeleteConfirmationDialog
                    isOpen={!!deletingSubscription}
                    onClose={() => setDeletingSubscription(null)}
                    onConfirm={() => handleDeleteSubscription(deletingSubscription.id)}
                    title="Delete Subscription Package"
                    description={`Are you sure you want to delete "${deletingSubscription.name}"? This action cannot be undone.`}
                />
            )}

            {/* Tip Selection Dialog */}
            {showTipSelector && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl max-h-[80vh] overflow-hidden">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Select Tips to Add
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        Choose from {availableTips.length} available tips
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    onClick={handleCancelTipSelection}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        <div className="p-6 max-h-96 overflow-y-auto">
                            {availableTips.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 dark:text-gray-400">
                                        No tips available. Please add some tips in the Tips page first.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-3">
                                    {availableTips.map((tip) => {
                                        const isSelected = selectedTipsToAdd.includes(tip.id);
                                        const isAlreadyInPackage = editedTips.some(existingTip =>
                                            existingTip.id === tip.id ||
                                            (existingTip.matchId === tip.matchId && existingTip.tipType === tip.tipType)
                                        );

                                        return (
                                            <div
                                                key={tip.id}
                                                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                                    isAlreadyInPackage
                                                        ? 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 opacity-50 cursor-not-allowed'
                                                        : isSelected
                                                            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
                                                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                }`}
                                                onClick={() => !isAlreadyInPackage && handleTipSelectionToggle(tip.id)}
                                            >
                                                <div className="flex items-start space-x-3">
                                                    <div className="flex-shrink-0 mt-1">
                                                        {isAlreadyInPackage ? (
                                                            <div className="w-4 h-4 bg-gray-400 rounded border"></div>
                                                        ) : (
                                                            <div className={`w-4 h-4 rounded border ${
                                                                isSelected
                                                                    ? 'bg-blue-600 border-blue-600'
                                                                    : 'border-gray-300 dark:border-gray-600'
                                                            }`}>
                                                                {isSelected && (
                                                                    <svg className="w-4 h-4 text-white"
                                                                         fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd"
                                                                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                              clipRule="evenodd" />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center space-x-2 mb-2">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {tip.homeTeam} vs {tip.awayTeam}
                              </span>
                                                            <Badge variant="outline" className="text-xs">
                                                                {tip.tipType}
                                                            </Badge>
                                                            {isAlreadyInPackage && (
                                                                <Badge className="text-xs bg-gray-500">
                                                                    Already Added
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div
                                                            className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                                            <div className="flex items-center space-x-4">
                                                                <span>League: {tip.league}</span>
                                                                <span>Prediction: {tip.prediction}</span>
                                                            </div>
                                                            <div className="flex items-center space-x-4">
                                                                <span>Date: {tip.matchDate || tip.date}</span>
                                                                <span>Time: {tip.matchTime || tip.time}</span>
                                                                <Badge className={`text-xs ${
                                                                    tip.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                                                                        tip.riskLevel === 'mid' ? 'bg-yellow-100 text-yellow-800' :
                                                                            'bg-red-100 text-red-800'
                                                                }`}>
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

                        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {selectedTipsToAdd.length} tip{selectedTipsToAdd.length !== 1 ? 's' : ''} selected
                                </p>
                                <div className="flex items-center space-x-3">
                                    <Button
                                        variant="outline"
                                        onClick={handleCancelTipSelection}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleAddSelectedTips}
                                        disabled={selectedTipsToAdd.length === 0}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        Add {selectedTipsToAdd.length} Tip{selectedTipsToAdd.length !== 1 ? 's' : ''}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
