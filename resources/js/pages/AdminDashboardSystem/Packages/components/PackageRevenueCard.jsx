import { Card, CardContent, CardHeader, CardTitle } from '@/pages/tips-moto/components/ui/card';
import { DollarSign } from 'lucide-react';

export function PackageRevenueCard({ analytics }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5" />
                    <span>Revenue</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Weekly Revenue</span>
                        <span className="font-semibold text-green-600">
                            KES {analytics.weeklyRevenue.toLocaleString()}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</span>
                        <span className="font-semibold text-green-600">
                            KES {analytics.totalRevenue.toLocaleString()}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Revenue per User</span>
                        <span className="font-semibold text-green-600">
                            KES {Math.round(analytics.totalRevenue / analytics.totalSubscribers).toLocaleString()}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
