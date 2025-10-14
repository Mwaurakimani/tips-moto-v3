import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar, DollarSign, Target, Clock, Info } from 'lucide-react';
import { toast } from 'sonner';
import { router, useForm } from '@inertiajs/react';

export function AddPackageDialog({ open, onClose, onAddPackage }) {
    const [errors, setErrors] = useState({});

    // Inertia form for Laravel integration
    const { data, setData, post, processing, errors: inertiaErrors, reset } = useForm({
        name: '',
        description: 'match',
        tips_count: 10,
        interval: 'day',
        price: 10,
        status: 'active',
        currency: 'KES',
        features: {}
    });

    const resetForm = () => {
        setErrors({});
        reset();
    };

    const validateForm = () => {
        const newErrors = {};

        if (!data.name.trim()) {
            newErrors.name = 'Package name is required';
        }

        if (!data.description) {
            newErrors.description = 'Package type is required';
        }

        if (!data.tips_count || parseInt(data.tips_count) <= 0) {
            newErrors.tips_count = 'Tips count must be a positive number';
        }

        if (!data.price || parseFloat(data.price) <= 0) {
            newErrors.price = 'Price must be a positive number';
        }

        if (!data.interval) {
            newErrors.interval = 'Frequency is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Build the complete package data with features
        const submissionData = {
            name: data.name.trim(),
            description: data.description,
            tips_count: parseInt(data.tips_count),
            price: parseFloat(data.price),
            interval: data.interval.toLowerCase(),
            currency: 'KES',
            status: data.status,
            features: {
                category: data.description,
                tips: parseInt(data.tips_count),
                for: null,
                period_days: data.interval === 'day' ? 1 : data.interval === 'week' ? 7 : 30,
                label: data.name.trim(),
                tax: parseFloat((data.price * 0.01).toFixed(2)),
                package_type: data.description,
                access_level: data.description === 'premium' ? 'premium' : 'standard',
                tips_list: []
            }
        };

        console.log(submissionData);

        // Submit to Laravel
        router.post(route('admin.packages.store'),submissionData, {
            onSuccess: (page) => {
                toast.success('Package added successfully!', {
                    description: `${data.name} has been added to your subscription packages.`
                });

                // Call parent callback if provided
                if (onAddPackage) {
                    onAddPackage({
                        ...data,
                        id: page.props?.package?.id || Date.now(),
                        date: new Date().toISOString().split('T')[0]
                    });
                }

                resetForm();
                onClose();
            },
            onError: (errors) => {
                console.error('Package creation failed:', errors);

                // Show specific error message
                const errorMessage = errors.message || 'Failed to add package';
                toast.error('Failed to add package', {
                    description: errorMessage
                });

                // Set local errors for form validation
                if (errors.name) setErrors(prev => ({ ...prev, name: errors.name[0] }));
                if (errors.price) setErrors(prev => ({ ...prev, price: errors.price[0] }));
                if (errors.tips_count) setErrors(prev => ({ ...prev, tips_count: errors.tips_count[0] }));
            }
        });
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleInputChange = (field, value) => {
        setData(field, value);

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
                            value={data.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Enter package name (e.g., Premium VIP Daily)"
                            className={errors.name || inertiaErrors.name ? 'border-red-500' : ''}
                        />
                        {(errors.name || inertiaErrors.name) && (
                            <p className="text-sm text-red-500">{errors.name || inertiaErrors.name}</p>
                        )}
                    </div>

                    {/* Package Type */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="flex items-center space-x-2">
                            <Target className="h-4 w-4" />
                            <span>Package Type</span>
                        </Label>
                        <Select value={data.description} onValueChange={(value) => handleInputChange('description', value)}>
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
                            <Label htmlFor="tips_count" className="flex items-center space-x-2">
                                <Target className="h-4 w-4" />
                                <span>Tips Count</span>
                            </Label>
                            <Input
                                id="tips_count"
                                type="number"
                                value={data.tips_count}
                                onChange={(e) => handleInputChange('tips_count', e.target.value)}
                                placeholder="Enter number of tips"
                                min="1"
                                className={errors.tips_count || inertiaErrors.tips_count ? 'border-red-500' : ''}
                            />
                            {(errors.tips_count || inertiaErrors.tips_count) && (
                                <p className="text-sm text-red-500">{errors.tips_count || inertiaErrors.tips_count}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="interval" className="flex items-center space-x-2">
                                <Clock className="h-4 w-4" />
                                <span>Frequency</span>
                            </Label>
                            <Select value={data.interval} onValueChange={(value) => handleInputChange('interval', value)}>
                                <SelectTrigger className={errors.interval ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="day">Daily</SelectItem>
                                    <SelectItem value="week">Weekly</SelectItem>
                                    <SelectItem value="month">Monthly</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.interval && (
                                <p className="text-sm text-red-500">{errors.interval}</p>
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
                                value={data.price}
                                onChange={(e) => handleInputChange('price', e.target.value)}
                                placeholder="Enter price in KES"
                                min="1"
                                step="0.01"
                                className={errors.price || inertiaErrors.price ? 'border-red-500' : ''}
                            />
                            {(errors.price || inertiaErrors.price) && (
                                <p className="text-sm text-red-500">{errors.price || inertiaErrors.price}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status" className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4" />
                                <span>Status</span>
                            </Label>
                            <Select value={data.status} onValueChange={(value) => handleInputChange('status', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Package Preview */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h4 className="font-medium mb-2">Package Preview</h4>
                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                            <p><strong>Name:</strong> {data.name || 'Package name'}</p>
                            <p><strong>Type:</strong> {data.description || 'Not selected'}</p>
                            <p><strong>Tips:</strong> {data.tips_count || '0'} tips {data.interval ? `per ${data.interval.toLowerCase()}` : ''}</p>
                            <p><strong>Price:</strong> KES {data.price || '0'}</p>
                            <p><strong>Status:</strong> {data.status}</p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700"
                            disabled={processing}
                        >
                            {processing ? 'Adding Package...' : 'Add Package'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
