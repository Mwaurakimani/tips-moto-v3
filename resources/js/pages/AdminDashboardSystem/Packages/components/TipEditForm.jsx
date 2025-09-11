import { Button } from '@/pages/tips-moto/components/ui/button';
import { Input } from '@/pages/tips-moto/components/ui/input';
import { Label } from '@/pages/tips-moto/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/pages/tips-moto/components/ui/select';
import { ChevronDown, ChevronUp, Copy, Trash2 } from 'lucide-react';

export function TipEditForm({ tip, index, onTipChange, onMoveTip, onDuplicateTip, onRemoveTip, isFirst, isLast }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h5 className="font-medium text-black dark:text-white">Tip #{index + 1}</h5>
                <div className="flex items-center space-x-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onMoveTip(index, 'up')}
                        disabled={isFirst}
                        className="h-6 w-6 p-0"
                    >
                        <ChevronUp className="h-3 w-3" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onMoveTip(index, 'down')}
                        disabled={isLast}
                        className="h-6 w-6 p-0"
                    >
                        <ChevronDown className="h-3 w-3" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDuplicateTip(index)}
                        className="h-6 w-6 p-0 text-blue-600"
                    >
                        <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveTip(index)}
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
                        onChange={(e) => onTipChange(index, 'homeTeam', e.target.value)}
                        className="h-8 text-sm"
                    />
                </div>
                <div className="space-y-1">
                    <Label className="text-xs">Away Team</Label>
                    <Input
                        value={tip.awayTeam || ''}
                        onChange={(e) => onTipChange(index, 'awayTeam', e.target.value)}
                        className="h-8 text-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                    <Label className="text-xs">League</Label>
                    <Input
                        value={tip.league || ''}
                        onChange={(e) => onTipChange(index, 'league', e.target.value)}
                        className="h-8 text-sm"
                    />
                </div>
                <div className="space-y-1">
                    <Label className="text-xs">Match Time</Label>
                    <Input
                        value={tip.time || ''}
                        type="time"
                        onChange={(e) => onTipChange(index, 'time', e.target.value)}
                        className="h-8 text-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                    <Label className="text-xs">Prediction</Label>
                    <Select
                        value={tip.prediction || ''}
                        onValueChange={(value) => onTipChange(index, 'prediction', value)}
                    >
                        <SelectTrigger className="h-8 text-sm">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Home Win">Home Win</SelectItem>
                            <SelectItem value="Draw">Draw</SelectItem>
                            <SelectItem value="Away Win">Away Win</SelectItem>
                            <SelectItem value="Home Win or Draw">Home Win or Draw</SelectItem>
                            <SelectItem value="Home Win or Away Win">Home Win or Away Win</SelectItem>
                            <SelectItem value="Draw or Away Win">Draw or Away Win</SelectItem>
                            <SelectItem value="Over 1.5 Goals">Over 1.5 Goals</SelectItem>
                            <SelectItem value="Over 2.5 Goals">Over 2.5 Goals</SelectItem>
                            <SelectItem value="Under 2.5 Goals">Under 2.5 Goals</SelectItem>
                            <SelectItem value="Both Teams Score">Both Teams Score</SelectItem>
                            <SelectItem value="Clean Sheet">Clean Sheet</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                    <Label className="text-xs">Risk Level</Label>
                    <Select
                        value={tip.riskLevel || ''}
                        onValueChange={(value) => onTipChange(index, 'riskLevel', value)}
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
                        onValueChange={(value) => onTipChange(index, 'winningStatus', value)}
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
            </div>
        </div>
    );
}
