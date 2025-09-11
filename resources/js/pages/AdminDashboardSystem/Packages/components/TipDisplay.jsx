import { Badge } from '@/pages/tips-moto/components/ui/badge';

export function TipDisplay({ tip, index }) {
    return (
        <>
            <div className="mb-3 flex items-start justify-between">
                <div className="flex-1">
                    <h5 className="font-medium text-black dark:text-white">{tip.match}</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{tip.league}</p>
                </div>
            </div>

            <div className="mb-3 grid grid-cols-2 gap-4">
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Prediction</p>
                    <p className="font-medium text-orange-600">{tip.prediction}</p>
                </div>
            </div>

            <div className="mb-3 grid grid-cols-2 gap-4">
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Risk Level</p>
                    <Badge
                        variant="outline"
                        className={
                            tip.riskLevel === 'low'
                                ? 'border-green-500 text-green-600'
                                : tip.riskLevel === 'mid'
                                  ? 'border-yellow-500 text-yellow-600'
                                  : 'border-red-500 text-red-600'
                        }
                    >
                        {tip.riskLevel ? tip.riskLevel.charAt(0).toUpperCase() + tip.riskLevel.slice(1) : 'Mid'}
                    </Badge>
                </div>
            </div>

            <div className="mt-3 border-t border-gray-200 pt-3 dark:border-gray-700">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Match Time: {tip.time}</span>
                </div>
            </div>
        </>
    );
}
