import { AddTipDialog } from '@/pages/tips-moto/components/AddTipDialog';
import { Badge } from '@/pages/tips-moto/components/ui/badge';
import { Button } from '@/pages/tips-moto/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/tips-moto/components/ui/card';
import { Input } from '@/pages/tips-moto/components/ui/input';
import { Label } from '@/pages/tips-moto/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/pages/tips-moto/components/ui/select';
import { Switch } from '@/pages/tips-moto/components/ui/switch';
import { router } from '@inertiajs/react';
import { ArrowLeft, Edit, Home, Save, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import DebugJson from '@/components/ui/JsonDebug.js';

export function MatchDetailView({
    match,
    onBack,
    onSave,
    setSelectedTipMatch
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedMatch, setEditedMatch] = useState({
        league: match.league,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        date: match.date,
        time: match.time,
    });

    // State for tips
    const [tips, setTips] = useState(match.tipsData || []);
    const [editingTipId, setEditingTipId] = useState(null);
    const [editedTip, setEditedTip] = useState(null);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        // Save the changes by calling the parent's onSave callback
        onSave(match.id, editedMatch);
        setIsEditing(false);
    };

    const handleCancel = () => {
        // Reset to original values
        setEditedMatch({
            league: match.league,
            homeTeam: match.homeTeam,
            awayTeam: match.awayTeam,
            date: match.date,
            time: match.time,
        });
        setIsEditing(false);
    };

    const handleInputChange = (field, value) => {
        setEditedMatch((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleAddTip = (tipData) => {
        router.post(route('adminDashboard.tip.add', match.id), tipData, {
            onSuccess: (page) => {
                console.log('Tip added successfully');

                // Use the returned tip from the server instead of creating a temporary one
                const newTip = page.props.flash?.newTip || {
                    id: Date.now(),
                    match_id: match.id,
                    prediction_type: tipData.subType,
                    pick_label: tipData.value,
                    risk_level: tipData.riskLevel,
                    is_free: tipData.free,
                    result: tipData.winningStatus,
                    ...tipData,
                };

                // Update local state
                const newTips = [...tips, newTip];
                setTips(newTips);

                // Call the tips update handler
                handleTipsUpdate(match.id, newTips);
            },
            onError: (errors) => {
                console.log('Failed to add tip:', errors);
            },
        });
    };

    // In MatchDetailView component
    const handleTipsUpdate = (matchId, newTips) => {
        if (match && match.id === matchId) {
            setSelectedTipMatch((prev) => ({
                ...prev,
                tips: newTips.length,
                tipsData: newTips,
            }));
        }
    };

    const handleDeleteTip = (tipId) => {
        if (confirm('Are you sure you want to delete this tip?')) {
            router.delete(route('adminDashboard.tip.delete', tipId), {
                onSuccess: (page) => {
                    console.log('Tip deleted successfully');
                    const newTips = tips.filter((tip) => tip.id !== tipId);
                    setTips(newTips);
                    handleTipsUpdate(match.id, newTips);
                },
                onError: (errors) => {
                    console.log('Failed to delete tip:', errors);
                },
            });
        }
    };

    const handleEditTip = (tip) => {
        setEditingTipId(tip.id);

        console.log(tip);

        // Map database fields to frontend edit form
        setEditedTip({
            ...tip,
            tipType: tip.pick_label || tip.tipType,
            subType: mapPredictionTypeToSubType(tip.prediction_type),
            value: tip.pick_label || tip.value,
            prediction: mapPickLabelToPrediction(tip.tipType, tip.prediction),
            riskLevel: tip.risk_level || tip.riskLevel,
            winningStatus: tip.result || tip.winningStatus,
            free: tip.is_free !== undefined ? tip.is_free : tip.free,
        });
    };

    // Helper functions to map database values back to frontend values
    const mapPredictionTypeToSubType = (predictionType) => {
        switch (predictionType) {
            case '1_X_2':
                return '1 X 2';
            case '1X_X2_12':
                return 'Double Chance';
            case 'Over/Under':
                return 'Goals';
            case 'GG_NG':
                return 'Both Teams Score';
            default:
                return predictionType;
        }
    };



    const mapPickLabelToPrediction = (predictionType, predictionValue) => {
        switch (predictionType) {
            case '1_X_2':
                if (predictionValue === 1) {
                    return "Home Win"
                }else if(predictionValue === 0){
                    return "Draw"
                }else {
                    return "Away Win"
                }

            case '1X_X2_12':
                if (predictionValue === 1) {
                    return "Home Win or Draw"
                }else if(predictionValue === 0){
                    return "Draw or Away"
                }else {
                    return "Home win or Away Win"
                }

            case 'GG_NG':
                if (predictionValue === 1) {
                    return "GG"
                }else {
                    return "NG"
                }

            default:
                return predictionType;
        }
    };

    const handleSaveTip = () => {
        if (editedTip && editingTipId !== null) {
            // Send update request to server first
            router.put(
                route('adminDashboard.tip.update', editingTipId),
                {
                    tipType: editedTip.tipType,
                    subType: editedTip.subType,
                    value: editedTip.value || editedTip.tipType, // Use tipType as value if no separate value
                    prediction: editedTip.prediction,
                    riskLevel: editedTip.riskLevel,
                    winningStatus: editedTip.winningStatus,
                    free: editedTip.free,
                },
                {
                    onSuccess: (page) => {
                        console.log('Tip updated successfully');

                        // Update local state after successful server update
                        const newTips = tips.map((tip) => (tip.id === editingTipId ? { ...tip, ...editedTip } : tip));
                        setTips(newTips);
                        handleTipsUpdate(match.id, newTips);

                        // Reset editing state
                        setEditingTipId(null);
                        setEditedTip(null);
                    },
                    onError: (errors) => {
                        console.log('Failed to update tip:', errors);
                        // Handle errors - show toast notification
                    },
                },
            );
        }
    };

    const handleCancelTipEdit = () => {
        setEditingTipId(null);
        setEditedTip(null);
    };

    const handleTipInputChange = (field, value) => {
        setEditedTip((prev) => {
            const updated = { ...prev, [field]: value };

            // Auto-update prediction when tipType changes
            if (field === 'tipType') {
                updated.prediction = mapPickLabelToPrediction(value);
                // You might also want to update subType based on tipType
                if (['1', 'X', '2'].includes(value)) {
                    updated.subType = '1 X 2';
                } else if (['1X', '12', 'X2'].includes(value)) {
                    updated.subType = 'Double Chance';
                } else if (['GG', 'NG'].includes(value)) {
                    updated.subType = 'Both Teams Score';
                } else if (value.includes('Over') || value.includes('Under')) {
                    updated.subType = 'Goals';
                }
            }

            return updated;
        });
    };

    // Use editedMatch for display to show current values
    const displayMatch = isEditing
        ? editedMatch
        : {
              league: match.league,
              homeTeam: match.homeTeam,
              awayTeam: match.awayTeam,
              date: match.date,
              time: match.time,
          };

    return (
        <div className="w-full space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onBack}
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>View All matches</span>
                    </Button>
                </div>
                <div className="flex items-center space-x-3">
                    <Button className="bg-blue-600 text-white hover:bg-blue-700">Update</Button>
                    <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                        Delete match
                    </Button>
                </div>
            </div>

            {/* Match Details */}
            <Card className="border-gray-700 bg-gray-800 text-white">
                <CardContent className="p-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Home className="h-4 w-4 text-gray-400" />
                            {isEditing ? (
                                <div className="flex items-center space-x-2">
                                    <Label htmlFor="league" className="text-sm text-gray-300">
                                        League:
                                    </Label>
                                    <Input
                                        id="league"
                                        value={editedMatch.league}
                                        onChange={(e) => handleInputChange('league', e.target.value)}
                                        className="w-64 border-gray-600 bg-gray-700 text-sm text-white"
                                    />
                                </div>
                            ) : (
                                <span className="text-gray-300">{displayMatch.league}</span>
                            )}
                        </div>
                        <div className="flex items-center space-x-2">
                            {isEditing ? (
                                <>
                                    <Button variant="ghost" size="sm" onClick={handleSave} className="text-green-400 hover:text-green-300">
                                        <Save className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={handleCancel} className="text-red-400 hover:text-red-300">
                                        <X className="h-4 w-4" />
                                    </Button>
                                </>
                            ) : (
                                <Button variant="ghost" size="sm" onClick={handleEditClick} className="text-gray-400 hover:text-white">
                                    <Edit className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        {/* Home Team */}
                        <div className="flex flex-col items-center space-y-4">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-600">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-500">
                                    <div className="h-8 w-8 rounded-full bg-gray-400"></div>
                                </div>
                            </div>
                            {isEditing ? (
                                <div className="flex flex-col items-center space-y-2">
                                    <Label htmlFor="homeTeam" className="text-sm text-gray-300">
                                        Home Team
                                    </Label>
                                    <Input
                                        id="homeTeam"
                                        value={editedMatch.homeTeam}
                                        onChange={(e) => handleInputChange('homeTeam', e.target.value)}
                                        className="w-48 border-gray-600 bg-gray-700 text-center text-white"
                                    />
                                </div>
                            ) : (
                                <h3 className="text-center text-xl font-semibold">{displayMatch.homeTeam}</h3>
                            )}
                        </div>

                        {/* Match Time */}
                        <div className="text-center">
                            {isEditing ? (
                                <div className="space-y-4">
                                    <div className="flex flex-col items-center space-y-2">
                                        <Label htmlFor="time" className="text-sm text-gray-300">
                                            Time
                                        </Label>
                                        <Input
                                            id="time"
                                            value={editedMatch.time}
                                            onChange={(e) => handleInputChange('time', e.target.value)}
                                            className="w-32 border-gray-600 bg-gray-700 text-center text-white"
                                            placeholder="12:00 pm"
                                        />
                                    </div>
                                    <div className="flex flex-col items-center space-y-2">
                                        <Label htmlFor="date" className="text-sm text-gray-300">
                                            Date
                                        </Label>
                                        <Input
                                            id="date"
                                            value={editedMatch.date}
                                            onChange={(e) => handleInputChange('date', e.target.value)}
                                            className="w-40 border-gray-600 bg-gray-700 text-center text-white"
                                            placeholder="Jul 07 2025"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-2 text-2xl font-bold">{displayMatch.time}</div>
                                    <div className="text-gray-300">{displayMatch.date}</div>
                                </>
                            )}
                        </div>

                        {/* Away Team */}
                        <div className="flex flex-col items-center space-y-4">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-600">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-500">
                                    <div className="h-8 w-8 rounded-full bg-gray-400"></div>
                                </div>
                            </div>
                            {isEditing ? (
                                <div className="flex flex-col items-center space-y-2">
                                    <Label htmlFor="awayTeam" className="text-sm text-gray-300">
                                        Away Team
                                    </Label>
                                    <Input
                                        id="awayTeam"
                                        value={editedMatch.awayTeam}
                                        onChange={(e) => handleInputChange('awayTeam', e.target.value)}
                                        className="w-48 border-gray-600 bg-gray-700 text-center text-white"
                                    />
                                </div>
                            ) : (
                                <h3 className="text-center text-xl font-semibold">{displayMatch.awayTeam}</h3>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tips Section */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Tips ({tips.length})</CardTitle>
                        <AddTipDialog onAddTip={handleAddTip} />
                    </div>
                </CardHeader>
                <CardContent>
                    {tips.length === 0 ? (
                        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                            <div className="mb-2 text-lg font-medium">No tips yet</div>
                            <div className="text-sm">Click "Add Tip" to create the first tip for this match</div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {tips.map((tip) => (
                                <Card key={tip.id} className="border-gray-700 bg-gray-800">
                                    <CardContent className="p-4">
                                        {editingTipId === tip.id ? (
                                            // Edit mode for this tip
                                            <div className="space-y-4">
                                                <div className="mb-3 flex items-center justify-between">
                                                    <span className="text-sm font-medium text-white">Edit Tip</span>
                                                    <div className="flex space-x-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={handleSaveTip}
                                                            className="h-6 w-6 p-0 text-green-400 hover:text-green-300"
                                                        >
                                                            <Save className="h-3 w-3" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={handleCancelTipEdit}
                                                            className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <div>
                                                        <Label className="text-xs text-gray-300">Tip Type</Label>
                                                        <Select
                                                            value={editedTip?.tipType || ''}
                                                            onValueChange={(value) => handleTipInputChange('tipType', value)}
                                                        >
                                                            <SelectTrigger className="border-gray-600 bg-gray-700 text-sm text-white">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="1X_X2_12">1X_X2_12</SelectItem>
                                                                <SelectItem value="1_X_2">1_X_2</SelectItem>
                                                                <SelectItem value="GG_NG">GG_NG</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div>
                                                        <Label className="text-xs text-gray-300">Prediction</Label>
                                                        <Select
                                                            value={editedTip?.prediction || ''}
                                                            onValueChange={(value) => handleTipInputChange('prediction', value)}
                                                        >
                                                            <SelectTrigger className="border-gray-600 bg-gray-700 text-sm text-white">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {editedTip?.tipType === '1_X_2' ? <>
                                                                    <SelectItem value="Home Win">Home Win</SelectItem>
                                                                    <SelectItem value="Draw">Draw</SelectItem>
                                                                    <SelectItem value="Away Win">Away Win</SelectItem>
                                                                </>: <></>}

                                                                {editedTip?.tipType === '1X_X2_12' ? <>
                                                                    <SelectItem value="Home Win or Draw">Home Win or Draw</SelectItem>
                                                                    <SelectItem value="Draw or Away">Draw or Away</SelectItem>
                                                                    <SelectItem value="Home win or Away Win">Home win or Away Win</SelectItem>
                                                                </>: <></>}

                                                                {editedTip?.tipType === 'GG_NG' ? <>
                                                                    <SelectItem value="GG">GG</SelectItem>
                                                                    <SelectItem value="NG">NG</SelectItem>
                                                                </>: <></>}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div>
                                                        <Label className="text-xs text-gray-300">Risk Level</Label>
                                                        <Select
                                                            value={editedTip?.riskLevel || ''}
                                                            onValueChange={(value) => handleTipInputChange('riskLevel', value)}
                                                        >
                                                            <SelectTrigger className="border-gray-600 bg-gray-700 text-sm text-white">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="low">Low</SelectItem>
                                                                <SelectItem value="mid">Mid</SelectItem>
                                                                <SelectItem value="high">High</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div>
                                                        <Label className="text-xs text-gray-300">Winning Status</Label>
                                                        <Select
                                                            value={editedTip?.winningStatus || 'pending'}
                                                            onValueChange={(value) => handleTipInputChange('winningStatus', value)}
                                                        >
                                                            <SelectTrigger className="border-gray-600 bg-gray-700 text-sm text-white">
                                                                <SelectValue placeholder="Select status" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="pending">Pending</SelectItem>
                                                                <SelectItem value="won">Won</SelectItem>
                                                                <SelectItem value="lost">Lost</SelectItem>
                                                                <SelectItem value="void">Void</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <Label className="text-xs text-gray-300">Mark as Free</Label>
                                                        <Switch
                                                            checked={editedTip?.free || false}
                                                            onCheckedChange={(checked) => handleTipInputChange('free', checked)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            // Display mode for this tip
                                            <div className="space-y-3">
                                                <div className="text-center">
                                                    <div className="mb-1 text-2xl font-bold text-white">{tip.tipType}</div>
                                                    <div className="text-sm text-gray-400">Tip Type</div>
                                                    <div className="text-sm text-gray-300">{tip.prediction || tip.subType}</div>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-gray-400">Risk Level</span>
                                                        <Badge
                                                            className={`px-2 py-1 text-xs ${
                                                                tip.riskLevel === 'low'
                                                                    ? 'bg-green-600 text-white'
                                                                    : tip.riskLevel === 'mid'
                                                                      ? 'bg-yellow-600 text-white'
                                                                      : tip.riskLevel === 'high'
                                                                        ? 'bg-red-600 text-white'
                                                                        : 'bg-gray-600 text-white'
                                                            }`}
                                                        >
                                                            {tip.riskLevel}
                                                        </Badge>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-gray-400">Free</span>
                                                        <span className="text-sm text-gray-300">{tip.free ? 'Yes' : 'No'}</span>
                                                    </div>
                                                </div>

                                                <div className="mt-4 flex space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEditTip(tip)}
                                                        className="flex-1 border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDeleteTip(tip.id)}
                                                        className="flex-1 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
