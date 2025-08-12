import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Plus } from 'lucide-react';

interface AddTipDialogProps {
  onAddTip: (tipData: {
    tipType: string;
    subType: string;
    value: string;
    prediction: string;
    riskLevel: string;
    winningStatus: string;
    free: boolean;
  }) => void;
}

export function AddTipDialog({ onAddTip }: AddTipDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    tipType: '',
    prediction: '',
    riskLevel: '',
    free: false
  });

  // Predefined tip types with their corresponding predictions
  const tipTypeOptions = [
    { value: '1', label: '1 (Home Win)', prediction: 'Home Win', subType: '1 X 2' },
    { value: 'X', label: 'X (Draw)', prediction: 'Draw', subType: '1 X 2' },
    { value: '2', label: '2 (Away Win)', prediction: 'Away Win', subType: '1 X 2' },
    { value: '1X', label: '1X (Home or Draw)', prediction: 'Home Win or Draw', subType: 'Double Chance' },
    { value: '12', label: '12 (Home or Away)', prediction: 'Home Win or Away Win', subType: 'Double Chance' },
    { value: 'X2', label: 'X2 (Draw or Away)', prediction: 'Draw or Away Win', subType: 'Double Chance' },
    { value: 'Over 1.5', label: 'Over 1.5 Goals', prediction: 'Over 1.5 Goals', subType: 'Goals' },
    { value: 'Under 1.5', label: 'Under 1.5 Goals', prediction: 'Under 1.5 Goals', subType: 'Goals' },
    { value: 'Over 2.5', label: 'Over 2.5 Goals', prediction: 'Over 2.5 Goals', subType: 'Goals' },
    { value: 'Under 2.5', label: 'Under 2.5 Goals', prediction: 'Under 2.5 Goals', subType: 'Goals' },
    { value: 'Over 3.5', label: 'Over 3.5 Goals', prediction: 'Over 3.5 Goals', subType: 'Goals' },
    { value: 'Under 3.5', label: 'Under 3.5 Goals', prediction: 'Under 3.5 Goals', subType: 'Goals' },
    { value: 'GG', label: 'GG (Both Teams Score)', prediction: 'Both Teams Score', subType: 'Both Teams Score' },
    { value: 'NG', label: 'NG (Clean Sheet)', prediction: 'Clean Sheet', subType: 'Both Teams Score' }
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTipTypeChange = (tipType: string) => {
    const selectedOption = tipTypeOptions.find(option => option.value === tipType);
    if (selectedOption) {
      setFormData(prev => ({
        ...prev,
        tipType: tipType,
        prediction: selectedOption.prediction
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.tipType || !formData.riskLevel) {
      return; // Basic validation
    }

    const selectedOption = tipTypeOptions.find(option => option.value === formData.tipType);
    if (!selectedOption) return;

    const tipData = {
      tipType: formData.tipType,
      subType: selectedOption.subType,
      value: formData.tipType,
      prediction: formData.prediction,
      riskLevel: formData.riskLevel,
      winningStatus: 'pending',
      free: formData.free
    };

    onAddTip(tipData);
    
    // Reset form and close dialog
    setFormData({
      tipType: '',
      prediction: '',
      riskLevel: '',
      free: false
    });
    setOpen(false);
  };

  const handleCancel = () => {
    // Reset form and close dialog
    setFormData({
      tipType: '',
      prediction: '',
      riskLevel: '',
      free: false
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Tip
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Tip</DialogTitle>
          <DialogDescription>
            Create a new betting tip for this match. Select the tip type and risk level. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tip Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="tipType">Tip Type *</Label>
            <Select
              value={formData.tipType}
              onValueChange={handleTipTypeChange}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select tip type" />
              </SelectTrigger>
              <SelectContent>
                {tipTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Prediction (Auto-filled based on tip type) */}
          <div className="space-y-2">
            <Label htmlFor="prediction">Prediction</Label>
            <Input
              id="prediction"
              value={formData.prediction}
              onChange={(e) => handleInputChange('prediction', e.target.value)}
              placeholder="Prediction will be auto-filled"
              className="bg-gray-100 dark:bg-gray-800"
            />
          </div>

          {/* Risk Level */}
          <div className="space-y-2">
            <Label htmlFor="riskLevel">Risk Level *</Label>
            <Select
              value={formData.riskLevel}
              onValueChange={(value) => handleInputChange('riskLevel', value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select risk level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Risk</SelectItem>
                <SelectItem value="mid">Mid Risk</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Free/Premium Toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="free">Mark as Free Tip</Label>
            <Switch
              id="free"
              checked={formData.free}
              onCheckedChange={(checked) => handleInputChange('free', checked)}
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!formData.tipType || !formData.riskLevel}
            >
              Add Tip
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
