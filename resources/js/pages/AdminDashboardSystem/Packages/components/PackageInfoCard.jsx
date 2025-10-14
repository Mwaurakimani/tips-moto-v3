import { Badge } from '@/pages/tips-moto/components/ui/badge';
import { Button } from '@/pages/tips-moto/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/tips-moto/components/ui/card';
import { Input } from '@/pages/tips-moto/components/ui/input';
import { Label } from '@/pages/tips-moto/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/pages/tips-moto/components/ui/select';
import { Calendar, Clock, DollarSign, Edit, Info, Save, Target, X } from 'lucide-react';
import { usePackageEdit } from '../hooks';
import { getStatusBadgeProps, getDescriptionBadgeProps, formatCurrency, formatDate } from '../utils';
import { toast } from 'sonner';
import DebugJson from '@/components/ui/JsonDebug.js';

export function PackageInfoCard({ subscription, onUpdateSubscription }) {
    const {
        isEditing,
        editedPackage,
        startEditing,
        cancelEditing,
        saveChanges,
        updateField,
        updateNestedField,
    } = usePackageEdit(subscription);

    const handleSave = () => {
        const updatedPackage = saveChanges();
        onUpdateSubscription(updatedPackage);
        toast.success('Package Updated', {
            description: 'Package information has been successfully updated.',
        });
    };

    const displaySubscription = isEditing ? editedPackage : subscription;
    const statusBadge = getStatusBadgeProps(displaySubscription.is_active);
    const descriptionBadge = getDescriptionBadgeProps(displaySubscription.features?.category);

    return (
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
                                    onClick={cancelEditing}
                                    className="text-red-600 hover:text-red-700"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={startEditing}
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
                    <section className={'grid grid-cols-1 gap-4 md:grid-cols-2'}>
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm text-gray-600 dark:text-gray-400">
                                Package Name
                            </Label>
                            <Input
                                id="name"
                                value={editedPackage.name}
                                onChange={(e) => updateField('name', e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm text-gray-600 dark:text-gray-400">
                                For Date
                            </Label>
                            <DebugJson data={editedPackage.features}></DebugJson>
                            <Input
                                id="for"
                                type="date"
                                value={editedPackage.features?.for || ''}
                                onChange={(e) => {
                                    updateField('features', {
                                        ...editedPackage.features,
                                        for: e.target.value
                                    });
                                }}
                                className="w-full"
                            />
                        </div>
                    </section>

                ) : (
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                            <Info className="h-4 w-4" />
                            <span>Package Name</span>
                        </div>
                        <p className="font-medium text-black dark:text-white">{displaySubscription.name}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="h-4 w-4" />
                            <span>Created Date</span>
                        </div>
                        <p className="font-medium text-black dark:text-white">
                            {formatDate(subscription.created_at)}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                            <Target className="h-4 w-4" />
                            <span>Package Type</span>
                        </div>
                        {isEditing ? (
                            <Select
                                value={editedPackage.features?.category}
                                onValueChange={(value) => updateNestedField('features', 'category', value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="jackpot">Jackpot</SelectItem>
                                    <SelectItem value="match">Match</SelectItem>
                                    <SelectItem value="premium">Premium</SelectItem>
                                    <SelectItem value="vip">VIP</SelectItem>
                                    <SelectItem value="standard">Standard</SelectItem>
                                </SelectContent>
                            </Select>
                        ) : (
                            <Badge className={descriptionBadge.className}>
                                {descriptionBadge.label}
                            </Badge>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                            <Clock className="h-4 w-4" />
                            <span>Frequency</span>
                        </div>
                        {isEditing ? (
                            <Select
                                value={editedPackage.interval}
                                onValueChange={(value) => updateField('interval', value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="day">Daily</SelectItem>
                                    <SelectItem value="week">Weekly</SelectItem>
                                </SelectContent>
                            </Select>
                        ) : (
                            <Badge variant="outline">{displaySubscription.interval}</Badge>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                            <DollarSign className="h-4 w-4" />
                            <span>Price</span>
                        </div>
                        {isEditing ? (
                            <Input
                                type="number"
                                value={editedPackage.price}
                                onChange={(e) => updateField('price', parseFloat(e.target.value) || 0)}
                                className="w-full"
                                min="1"
                                step="0.01"
                            />
                        ) : (
                            <p className="text-lg font-medium text-green-600">
                                {formatCurrency(displaySubscription.price)}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                            <Target className="h-4 w-4" />
                            <span>Tips Count</span>
                        </div>
                        {isEditing ? (
                            <Input
                                type="number"
                                value={editedPackage.features?.tips}
                                onChange={(e) => updateNestedField('features', 'tips', parseInt(e.target.value) || 0)}
                                className="w-full"
                                min="1"
                            />
                        ) : (
                            <p className="font-medium text-black dark:text-white">
                                {displaySubscription.features?.tips}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                            <span>Status</span>
                        </div>
                        {isEditing ? (
                            <Select
                                value={editedPackage.is_active ? 'Active' : 'Inactive'}
                                onValueChange={(value) => updateField('is_active', value === 'Active')}
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
                            <Badge className={statusBadge.className}>
                                {statusBadge.label}
                            </Badge>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
