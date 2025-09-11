import { Card, CardContent, CardHeader, CardTitle } from '@/pages/tips-moto/components/ui/card';

export function PackageDescriptionCard({ subscription }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Package Description</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <p className="leading-relaxed text-gray-600 dark:text-gray-400">
                        This {subscription.features?.category} package provides {subscription.features?.tips} carefully
                        selected tips. Our expert analysts use advanced statistical models and insider knowledge to deliver high-quality
                        predictions that maximize your winning potential.
                    </p>

                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                        <h4 className="mb-2 font-medium text-black dark:text-white">Key Features:</h4>
                        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                            <li>• Detailed analysis and reasoning for each tip</li>
                            <li>• Real-time notifications when new tips are available</li>
                            <li>• Historical performance tracking</li>
                            <li>• 24/7 customer support</li>
                        </ul>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
