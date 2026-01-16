import { DeleteConfirmationDialog } from '@/pages/tips-moto/components/DeleteConfirmationDialog';
import { useState } from 'react';
import {
    PackageAnalyticsCard,
    PackageDescriptionCard,
    PackageHeader,
    PackageInfoCard,
    PackageQuickActions,
    PackageRevenueCard,
    PackageTipsCard,
    TipSelectionDialog,
} from './components';
import { usePackageAnalytics } from './hooks';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

export function PackageDetailView({ subscription, onBack, onUpdateSubscription, onDeleteSubscription, availableTips = [] }) {
    const [deletingSubscription, setDeletingSubscription] = useState(null);
    const [showTipSelector, setShowTipSelector] = useState(false);
    const [editedTipsForSelector, setEditedTipsForSelector] = useState([]);
    const [setEditedTipsCallback, setSetEditedTipsCallback] = useState(null);

    // Use custom hook for analytics
    const analytics = usePackageAnalytics(subscription);

    const handleDeleteClick = () => {
        if (window.confirm('Are you sure you want to delete this subscription? This action cannot be undone.')) {
            try {
                router.delete(route('admin.packages.destroy', subscription.id), {
                    onSuccess: () => {
                        toast.success('Subscription deleted successfully');

                        setTimeout(() => {
                            router.visit(route('adminDashboard.subscriptions'));
                        }, 2000);
                    },
                    onError: (error) => {
                        toast.error(error.message || 'Failed to delete subscription');
                    }
                });
            } catch (error) {
                toast.error('An unexpected error occurred');
                console.error(error);
            }
        }
    };

    const handleDeleteSubscription = (subscriptionId) => {
        onDeleteSubscription(subscriptionId);
        setDeletingSubscription(null);
        onBack();
    };

    const handleOpenTipSelector = (editedTips, setEditedTips) => {
        setEditedTipsForSelector(editedTips);
        setSetEditedTipsCallback(() => setEditedTips);
        setShowTipSelector(true);
    };

    const handleCloseTipSelector = () => {
        setShowTipSelector(false);
        setEditedTipsForSelector([]);
        setSetEditedTipsCallback(null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <PackageHeader subscription={subscription} onBack={onBack} />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Main Content Area */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Basic Package Information */}
                    <PackageInfoCard subscription={subscription} onUpdateSubscription={onUpdateSubscription} />

                    {/* Package Description */}
                    <PackageDescriptionCard subscription={subscription} />

                    {/* Package Tips Management */}
                    <PackageTipsCard
                        subscription={subscription}
                        onUpdateSubscription={onUpdateSubscription}
                        availableTips={availableTips}
                        onOpenTipSelector={handleOpenTipSelector}
                    />
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/*    /!* Analytics *!/*/}
                    <PackageAnalyticsCard analytics={analytics} />

                    {/*    /!* Revenue *!/*/}
                    <PackageRevenueCard analytics={analytics} />

                    {/*    /!* Quick Actions *!/*/}
                    <PackageQuickActions onDeleteClick={handleDeleteClick} />

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
            {showTipSelector && setEditedTipsCallback && (
                <TipSelectionDialog
                    availableTips={availableTips}
                    editedTips={editedTipsForSelector}
                    setEditedTips={setEditedTipsCallback}
                    subscriptionId={subscription.id}
                    onClose={handleCloseTipSelector}
                />
            )}
        </div>
    );
}
