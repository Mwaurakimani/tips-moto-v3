import { useState } from 'react';
import { ArrowLeft, Edit, Home, Save, X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/pages/tips-moto/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/tips-moto/components/ui/card';
import { Badge } from '@/pages/tips-moto/components/ui/badge';
import { Input } from '@/pages/tips-moto/components/ui/input';
import { Label } from '@/pages/tips-moto/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/pages/tips-moto/components/ui/select';
import { Switch } from '@/pages/tips-moto/components/ui/switch';
import {AddTipDialog} from '@/pages/tips-moto/components/AddTipDialog'

export function MatchDetailView({ match, onBack, onSave, onTipsUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedMatch, setEditedMatch] = useState({
        league: match.league,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        date: match.date,
        time: match.time
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
            time: match.time
        });
        setIsEditing(false);
    };

    const handleInputChange = (field, value) => {
        setEditedMatch(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddTip = (tipData) => {
        const newTip = {
            id: Math.max(0, ...tips.map(t => t.id)) + 1,
            ...tipData
        };

        const newTips = [...tips, newTip];
        setTips(newTips);
        onTipsUpdate(match.id, newTips);
    };

    const handleDeleteTip = (tipId) => {
        const newTips = tips.filter(tip => tip.id !== tipId);
        setTips(newTips);
        onTipsUpdate(match.id, newTips);
    };

    const handleEditTip = (tip) => {
        setEditingTipId(tip.id);
        setEditedTip({ ...tip });
    };

    const handleSaveTip = () => {
        if (editedTip && editingTipId !== null) {
            const newTips = tips.map(tip =>
                tip.id === editingTipId ? editedTip : tip
            );
            setTips(newTips);
            onTipsUpdate(match.id, newTips);
            setEditingTipId(null);
            setEditedTip(null);
        }
    };

    const handleCancelTipEdit = () => {
        setEditingTipId(null);
        setEditedTip(null);
    };

    const handleTipInputChange = (field, value) => {
        setEditedTip(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Use editedMatch for display to show current values
    const displayMatch = isEditing ? editedMatch : {
        league: match.league,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        date: match.date,
        time: match.time
    };

    return (
        <div className="space-y-6 w-full">
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
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        Update
                    </Button>
                    <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                        Delete match
                    </Button>
                </div>
            </div>

            {/* Match Details */}
            <Card className="bg-gray-800 text-white border-gray-700">
                <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-2">
                            <Home className="h-4 w-4 text-gray-400" />
                            {isEditing ? (
                                <div className="flex items-center space-x-2">
                                    <Label htmlFor="league" className="text-gray-300 text-sm">League:</Label>
                                    <Input
                                        id="league"
                                        value={editedMatch.league}
                                        onChange={(e) => handleInputChange('league', e.target.value)}
                                        className="bg-gray-700 border-gray-600 text-white text-sm w-64"
                                    />
                                </div>
                            ) : (
                                <span className="text-gray-300">{displayMatch.league}</span>
                            )}
                        </div>
                        <div className="flex items-center space-x-2">
                            {isEditing ? (
                                <>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleSave}
                                        className="text-green-400 hover:text-green-300"
                                    >
                                        <Save className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleCancel}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleEditClick}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        {/* Home Team */}
                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center">
                                <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center">
                                    <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
                                </div>
                            </div>
                            {isEditing ? (
                                <div className="flex flex-col items-center space-y-2">
                                    <Label htmlFor="homeTeam" className="text-gray-300 text-sm">Home Team</Label>
                                    <Input
                                        id="homeTeam"
                                        value={editedMatch.homeTeam}
                                        onChange={(e) => handleInputChange('homeTeam', e.target.value)}
                                        className="bg-gray-700 border-gray-600 text-white text-center w-48"
                                    />
                                </div>
                            ) : (
                                <h3 className="text-xl font-semibold text-center">{displayMatch.homeTeam}</h3>
                            )}
                        </div>

                        {/* Match Time */}
                        <div className="text-center">
                            {isEditing ? (
                                <div className="space-y-4">
                                    <div className="flex flex-col items-center space-y-2">
                                        <Label htmlFor="time" className="text-gray-300 text-sm">Time</Label>
                                        <Input
                                            id="time"
                                            value={editedMatch.time}
                                            onChange={(e) => handleInputChange('time', e.target.value)}
                                            className="bg-gray-700 border-gray-600 text-white text-center w-32"
                                            placeholder="12:00 pm"
                                        />
                                    </div>
                                    <div className="flex flex-col items-center space-y-2">
                                        <Label htmlFor="date" className="text-gray-300 text-sm">Date</Label>
                                        <Input
                                            id="date"
                                            value={editedMatch.date}
                                            onChange={(e) => handleInputChange('date', e.target.value)}
                                            className="bg-gray-700 border-gray-600 text-white text-center w-40"
                                            placeholder="Jul 07 2025"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="text-2xl font-bold mb-2">{displayMatch.time}</div>
                                    <div className="text-gray-300">{displayMatch.date}</div>
                                </>
                            )}
                        </div>

                        {/* Away Team */}
                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center">
                                <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center">
                                    <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
                                </div>
                            </div>
                            {isEditing ? (
                                <div className="flex flex-col items-center space-y-2">
                                    <Label htmlFor="awayTeam" className="text-gray-300 text-sm">Away Team</Label>
                                    <Input
                                        id="awayTeam"
                                        value={editedMatch.awayTeam}
                                        onChange={(e) => handleInputChange('awayTeam', e.target.value)}
                                        className="bg-gray-700 border-gray-600 text-white text-center w-48"
                                    />
                                </div>
                            ) : (
                                <h3 className="text-xl font-semibold text-center">{displayMatch.awayTeam}</h3>
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
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            <div className="text-lg font-medium mb-2">No tips yet</div>
                            <div className="text-sm">Click "Add Tip" to create the first tip for this match</div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {tips.map((tip) => (
                                <Card key={tip.id} className="bg-gray-800 border-gray-700">
                                    <CardContent className="p-4">
                                        {editingTipId === tip.id ? (
                                            // Edit mode for this tip
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-sm font-medium text-white">Edit Tip</span>
                                                    <div className="flex space-x-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={handleSaveTip}
                                                            className="text-green-400 hover:text-green-300 h-6 w-6 p-0"
                                                        >
                                                            <Save className="h-3 w-3" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={handleCancelTipEdit}
                                                            className="text-red-400 hover:text-red-300 h-6 w-6 p-0"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <div>
                                                        <Label className="text-gray-300 text-xs">Tip Type</Label>
                                                        <Select
                                                            value={editedTip?.tipType || ''}
                                                            onValueChange={(value) => handleTipInputChange('tipType', value)}
                                                        >
                                                            <SelectTrigger className="bg-gray-700 border-gray-600 text-white text-sm">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="1">1</SelectItem>
                                                                <SelectItem value="X">X</SelectItem>
                                                                <SelectItem value="2">2</SelectItem>
                                                                <SelectItem value="1X">1X</SelectItem>
                                                                <SelectItem value="12">12</SelectItem>
                                                                <SelectItem value="X2">X2</SelectItem>
                                                                <SelectItem value="Over 1.5">Over 1.5</SelectItem>
                                                                <SelectItem value="Under 1.5">Under 1.5</SelectItem>
                                                                <SelectItem value="Over 2.5">Over 2.5</SelectItem>
                                                                <SelectItem value="Under 2.5">Under 2.5</SelectItem>
                                                                <SelectItem value="GG">GG</SelectItem>
                                                                <SelectItem value="NG">NG</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div>
                                                        <Label className="text-gray-300 text-xs">Prediction</Label>
                                                        <Select
                                                            value={editedTip?.prediction || ''}
                                                            onValueChange={(value) => handleTipInputChange('prediction', value)}
                                                        >
                                                            <SelectTrigger className="bg-gray-700 border-gray-600 text-white text-sm">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="Home Win">Home Win</SelectItem>
                                                                <SelectItem value="Draw">Draw</SelectItem>
                                                                <SelectItem value="Away Win">Away Win</SelectItem>
                                                                <SelectItem value="Home Win or Draw">Home Win or Draw</SelectItem>
                                                                <SelectItem value="Home Win or Away Win">Home Win or Away Win</SelectItem>
                                                                <SelectItem value="Draw or Away Win">Draw or Away Win</SelectItem>
                                                                <SelectItem value="Over Goals">Over Goals</SelectItem>
                                                                <SelectItem value="Under Goals">Under Goals</SelectItem>
                                                                <SelectItem value="Both Teams Score">Both Teams Score</SelectItem>
                                                                <SelectItem value="Clean Sheet">Clean Sheet</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div>
                                                        <Label className="text-gray-300 text-xs">Risk Level</Label>
                                                        <Select
                                                            value={editedTip?.riskLevel || ''}
                                                            onValueChange={(value) => handleTipInputChange('riskLevel', value)}
                                                        >
                                                            <SelectTrigger className="bg-gray-700 border-gray-600 text-white text-sm">
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
                                                        <Label className="text-gray-300 text-xs">Winning Status</Label>
                                                        <Select
                                                            value={editedTip?.winningStatus || 'pending'}
                                                            onValueChange={(value) => handleTipInputChange('winningStatus', value)}
                                                        >
                                                            <SelectTrigger className="bg-gray-700 border-gray-600 text-white text-sm">
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
                                                        <Label className="text-gray-300 text-xs">Mark as Free</Label>
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
                                                    <div className="text-2xl font-bold text-white mb-1">{tip.tipType}</div>
                                                    <div className="text-sm text-gray-400">Tip Type</div>
                                                    <div className="text-sm text-gray-300">{tip.prediction || tip.subType}</div>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-gray-400">Risk Level</span>
                                                        <Badge className={`text-xs px-2 py-1 ${
                                                            tip.riskLevel === 'low' ? 'bg-green-600 text-white' :
                                                                tip.riskLevel === 'mid' ? 'bg-yellow-600 text-white' :
                                                                    tip.riskLevel === 'high' ? 'bg-red-600 text-white' :
                                                                        'bg-gray-600 text-white'
                                                        }`}>
                                                            {tip.riskLevel}
                                                        </Badge>
                                                    </div>

                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-gray-400">Free</span>
                                                        <span className="text-sm text-gray-300">{tip.free ? 'Yes' : 'No'}</span>
                                                    </div>
                                                </div>

                                                <div className="flex space-x-2 mt-4">
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
