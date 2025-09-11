import { Button } from '@/pages/tips-moto/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function PackageHeader({ subscription, onBack }) {
    const getDescriptionBadge = (description) => {
        const badges = {
            jackpot: { className: 'bg-purple-600 text-white', label: 'Jackpot' },
            match: { className: 'bg-blue-600 text-white', label: 'Match' },
            premium: { className: 'bg-yellow-600 text-white', label: 'Premium' },
        };
        
        const badge = badges[description] || { className: 'bg-gray-500 text-white', label: description };
        
        return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}>
                {badge.label}
            </span>
        );
    };

    return (
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
                        {subscription.name}
                    </h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                        Package #{subscription.id} • {getDescriptionBadge(subscription.description)}
                    </p>
                </div>
            </div>
        </div>
    );
}
