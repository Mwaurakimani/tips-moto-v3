import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Edit } from 'lucide-react';

interface Subscription {
  id: number;
  name: string;
  date: string;
  description: string;
  tips: number;
  status: string;
  price: number;
  duration: string;
}

interface EditSubscriptionDialogProps {
  subscription: Subscription;
  onUpdateSubscription: (updatedSubscription: Subscription) => void;
  open: boolean;
  onClose: () => void;
}

export function EditSubscriptionDialog({ subscription, onUpdateSubscription, open, onClose }: EditSubscriptionDialogProps) {
  const [formData, setFormData] = useState({
    name: subscription.name,
    description: subscription.description,
    tips: subscription.tips,
    price: subscription.price,
    duration: subscription.duration,
    status: subscription.status
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedSubscription = {
      ...subscription,
      ...formData
    };

    onUpdateSubscription(updatedSubscription);
    onClose();
  };

  const handleCancel = () => {
    // Reset form to original values
    setFormData({
      name: subscription.name,
      description: subscription.description,
      tips: subscription.tips,
      price: subscription.price,
      duration: subscription.duration,
      status: subscription.status
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Subscription Package</DialogTitle>
          <DialogDescription>
            Update the details of this subscription package. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Package Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Package Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter package name"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Select
              value={formData.description}
              onValueChange={(value) => handleInputChange('description', value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select description type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jackpot">Jackpot</SelectItem>
                <SelectItem value="match">Match</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Number of Tips */}
          <div className="space-y-2">
            <Label htmlFor="tips">Number of Tips *</Label>
            <Input
              id="tips"
              type="number"
              min="1"
              value={formData.tips}
              onChange={(e) => handleInputChange('tips', parseInt(e.target.value) || 0)}
              placeholder="Enter number of tips"
              required
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Price (KES) *</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
              placeholder="Enter price"
              required
            />
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">Duration *</Label>
            <Select
              value={formData.duration}
              onValueChange={(value) => handleInputChange('duration', value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Daily">Daily</SelectItem>
                <SelectItem value="Weekly">Weekly</SelectItem>
                <SelectItem value="Monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleInputChange('status', value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Update Package
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
