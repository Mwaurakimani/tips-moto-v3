import { Card, CardContent, CardHeader, CardTitle } from '@/pages/tips-moto/components/ui/card';
import { Users } from 'lucide-react';

export function PackageAnalyticsCard({ analytics }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Analytics</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Total Subscribers</span>
                        <span className="font-semibold text-black dark:text-white">{analytics.totalSubscribers || '-'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Active Subscribers</span>
                        <span className="font-semibold text-green-600">{analytics.activeSubscribers || '-'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Success Rate</span>
                        <span className="font-semibold text-blue-600">{analytics.successRate || '-'}%</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Average Rating</span>
                        <span className="font-semibold text-yellow-600">{analytics.averageRating|| '-'}/5.0</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
