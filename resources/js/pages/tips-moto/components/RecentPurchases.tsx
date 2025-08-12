import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';

const recentPurchases = [
  {
    id: 1,
    name: 'Sammy mk',
    email: 'sammykamwara@gmail.com',
    type: 'Full Time',
    amount: 'KES 100.00',
    status: 'successful',
    time: '2 hours ago'
  },
  {
    id: 2,
    name: 'jairus',
    email: 'jairusmorangai18@gmail.com',
    type: 'Over/Under',
    amount: 'KES 50.00',
    status: 'failed',
    time: '4 hours ago'
  },
  {
    id: 3,
    name: 'Mary Johnson',
    email: 'mary.johnson@email.com',
    type: 'Market Daily',
    amount: 'KES 75.00',
    status: 'successful',
    time: '6 hours ago'
  },
  {
    id: 4,
    name: 'David Wilson',
    email: 'david.wilson@email.com',
    type: 'Full Time',
    amount: 'KES 120.00',
    status: 'failed',
    time: '8 hours ago'
  }
];

interface RecentPurchasesProps {
  onPageChange?: (page: string) => void;
}

export function RecentPurchases({ onPageChange }: RecentPurchasesProps) {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Recent Purchases</CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">Latest customer transactions</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentPurchases.map((purchase) => (
          <div key={purchase.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                  {purchase.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="font-medium text-black dark:text-white truncate">
                    {purchase.name}
                  </p>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${
                      purchase.status === 'successful' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      purchase.status === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}
                  >
                    {purchase.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {purchase.email}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {purchase.type} • {purchase.time}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-black dark:text-white">
                {purchase.amount}
              </p>
            </div>
          </div>
        ))}
        
        <div className="pt-2">
          <button 
            onClick={() => onPageChange?.('transactions')}
            className="w-full text-center text-sm text-orange-500 hover:text-white hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 transition-all duration-200 py-2.5 px-4 rounded-lg border border-orange-200 dark:border-orange-800 hover:border-orange-500 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-500 active:scale-98"
          >
            View all transactions →
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
