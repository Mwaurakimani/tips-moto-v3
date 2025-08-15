import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar, DollarSign, Target, Clock, Info } from 'lucide-react';
import { toast } from 'sonner';

// Define subscription interface
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

interface AddPackageDialogProps {
  open: boolean;
  onClose: () => void;
  onAddPackage: (packageData: Omit<Subscription, 'id'>) => void;
}

export function AddPackageDialog({ open, onClose, onAddPackage }: AddPackageDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tips: '',
    status: 'Active',
    price: '',
    duration: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      tips: '',
      status: 'Active',
      price: '',
      duration: ''
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Package name is required';
    }

    if (!formData.description) {
      newErrors.description = 'Package type is required';
    }

    if (!formData.tips || parseInt(formData.tips) <= 0) {
      newErrors.tips = 'Tips count must be a positive number';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }

    if (!formData.duration) {
      newErrors.duration = 'Frequency is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Get current date in YYYY-MM-DD format
      const currentDate = new Date().toISOString().split('T')[0];

      const packageData = {
        name: formData.name.trim(),
        date: currentDate,
        description: formData.description,
        tips: parseInt(formData.tips),
        status: formData.status,
        price: parseFloat(formData.price),
        duration: formData.duration
      };

      await onAddPackage(packageData);
      toast.success('Package added successfully!', {
        description: `${packageData.name} has been added to your subscription packages.`
      });
      resetForm();
      onClose();
    } catch (error) {
      toast.error('Failed to add package', {
        description: 'Please try again or contact support if the problem persists.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span>Add New Package</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Package Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center space-x-2">
              <Info className="h-4 w-4" />
              <span>Package Name</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter package name (e.g., Premium VIP Daily)"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Package Type */}
          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Package Type</span>
            </Label>
            <Select value={formData.description} onValueChange={(value) => handleInputChange('description', value)}>
              <SelectTrigger className={errors.description ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select package type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jackpot">Jackpot</SelectItem>
                <SelectItem value="match">Match</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Tips Count and Duration Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tips" className="flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span>Tips Count</span>
              </Label>
              <Input
                id="tips"
                type="number"
                value={formData.tips}
                onChange={(e) => handleInputChange('tips', e.target.value)}
                placeholder="Enter number of tips"
                min="1"
                className={errors.tips ? 'border-red-500' : ''}
              />
              {errors.tips && (
                <p className="text-sm text-red-500">{errors.tips}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Frequency</span>
              </Label>
              <Select value={formData.duration} onValueChange={(value) => handleInputChange('duration', value)}>
                <SelectTrigger className={errors.duration ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
              {errors.duration && (
                <p className="text-sm text-red-500">{errors.duration}</p>
              )}
            </div>
          </div>

          {/* Price and Status Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span>Price (KES)</span>
              </Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="Enter price in KES"
                min="1"
                step="0.01"
                className={errors.price ? 'border-red-500' : ''}
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Status</span>
              </Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Package Preview */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-medium mb-2">Package Preview</h4>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <p><strong>Name:</strong> {formData.name || 'Package name'}</p>
              <p><strong>Type:</strong> {formData.description || 'Not selected'}</p>
              <p><strong>Tips:</strong> {formData.tips || '0'} tips {formData.duration ? `per ${formData.duration.toLowerCase()}` : ''}</p>
              <p><strong>Price:</strong> KES {formData.price || '0'}</p>
              <p><strong>Status:</strong> {formData.status}</p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding Package...' : 'Add Package'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
