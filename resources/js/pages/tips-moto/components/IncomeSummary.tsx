import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const baseChartData = [
  { name: 'Mon', successful: 4000, failed: 2400 },
  { name: 'Tue', successful: 3000, failed: 1398 },
  { name: 'Wed', successful: 2000, failed: 9800 },
  { name: 'Thu', successful: 2780, failed: 3908 },
  { name: 'Fri', successful: 1890, failed: 4800 },
  { name: 'Sat', successful: 2390, failed: 3800 },
  { name: 'Sun', successful: 3490, failed: 4300 },
];

// Sample data for different time periods
const dailyData = baseChartData;
const weeklyData = [
  { name: 'Jul 1-7', successful: 21660, failed: 25306 },
  { name: 'Jul 8-14', successful: 19200, failed: 28100 },
  { name: 'Jul 15-21', successful: 23400, failed: 31200 },
  { name: 'Jul 22-28', successful: 18900, failed: 26800 },
  { name: 'Jul 29-31', successful: 12500, failed: 15200 },
];
const monthlyData = [
  { name: 'Jan', successful: 84000, failed: 102000 },
  { name: 'Feb', successful: 76000, failed: 95000 },
  { name: 'Mar', successful: 92000, failed: 108000 },
  { name: 'Apr', successful: 88000, failed: 101000 },
  { name: 'May', successful: 95000, failed: 89000 },
  { name: 'Jun', successful: 102000, failed: 94000 },
  { name: 'Jul', successful: 118000, failed: 87000 },
  { name: 'Aug', successful: 125000, failed: 82000 },
  { name: 'Sep', successful: 110000, failed: 91000 },
  { name: 'Oct', successful: 98000, failed: 98000 },
  { name: 'Nov', successful: 86000, failed: 104000 },
  { name: 'Dec', successful: 132000, failed: 78000 }
];

// Custom tooltip component with enhanced styling
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl p-4 min-w-[200px] backdrop-blur-sm">
        <p className="font-semibold text-gray-900 dark:text-white mb-3 text-center border-b border-gray-100 dark:border-gray-700 pb-2">
          {`${label}`}
        </p>
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full shadow-sm" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                  {entry.name}
                </span>
              </div>
              <span className="font-bold text-gray-900 dark:text-white ml-4">
                KES {entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total:</span>
            <span className="font-bold text-gray-900 dark:text-white">
              KES {payload.reduce((sum: number, entry: any) => sum + entry.value, 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function IncomeSummary() {
  const [transactionFilter, setTransactionFilter] = useState('transactions');
  const [periodFilter, setPeriodFilter] = useState('daily');

  // Get the base data based on period filter
  const getBaseData = () => {
    switch (periodFilter) {
      case 'daily':
        return dailyData;
      case 'weekly':
        return weeklyData;
      case 'monthly':
        return monthlyData;
      default:
        return weeklyData;
    }
  };

  // Filter and process chart data based on selected filters
  const chartData = useMemo(() => {
    const baseData = getBaseData();
    
    if (transactionFilter === 'transactions') {
      return baseData; // Show both successful and failed
    } else if (transactionFilter === 'successful') {
      return baseData.map(item => ({
        ...item,
        value: item.successful // Map successful to value for line chart
      }));
    } else if (transactionFilter === 'failed') {
      return baseData.map(item => ({
        ...item,
        value: item.failed // Map failed to value for line chart
      }));
    }
    
    return baseData;
  }, [transactionFilter, periodFilter]);

  // Determine if we should show line chart (single data series) or bar chart (multiple series)
  const showLineChart = transactionFilter !== 'transactions';

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Income Summary</CardTitle>
        <div className="flex items-center space-x-2">
          <Select value={transactionFilter} onValueChange={setTransactionFilter}>
            <SelectTrigger className="w-32 px-3 py-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="transactions">Transactions</SelectItem>
              <SelectItem value="successful">Successful</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-28 px-3 py-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {showLineChart ? (
              <LineChart 
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="hsl(var(--border))" 
                  opacity={0.3}
                  vertical={false}
                />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  dx={-10}
                />
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={{ 
                    stroke: transactionFilter === 'successful' ? '#ff6b35' : '#1a1a1a',
                    strokeWidth: 2,
                    strokeDasharray: '5 5'
                  }}
                />
                <Line 
                  type="monotone"
                  dataKey="value" 
                  stroke={transactionFilter === 'successful' ? '#ff6b35' : '#1a1a1a'}
                  strokeWidth={3}
                  dot={{ 
                    fill: transactionFilter === 'successful' ? '#ff6b35' : '#1a1a1a',
                    strokeWidth: 2,
                    r: 5
                  }}
                  activeDot={{ 
                    r: 7, 
                    fill: transactionFilter === 'successful' ? '#ff6b35' : '#1a1a1a',
                    stroke: '#fff',
                    strokeWidth: 2
                  }}
                  name={transactionFilter === 'successful' ? 'Successful KES' : 'Failed KES'}
                />
              </LineChart>
            ) : (
              <BarChart 
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                barCategoryGap="20%"
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="hsl(var(--border))" 
                  opacity={0.3}
                  vertical={false}
                />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  dx={-10}
                />
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={{ 
                    fill: 'hsl(var(--accent))', 
                    opacity: 0.1,
                    radius: 4
                  }}
                />
                <Bar 
                  dataKey="successful" 
                  fill="#ff6b35" 
                  name="Successful KES"
                  radius={[4, 4, 0, 0]}
                  strokeWidth={0}
                />
                <Bar 
                  dataKey="failed" 
                  fill="#1a1a1a" 
                  name="Failed KES"
                  radius={[4, 4, 0, 0]}
                  strokeWidth={0}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
        
        <div className="flex items-center justify-center space-x-8 mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          {transactionFilter === 'transactions' ? (
            <>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-orange-500 rounded-full shadow-sm border-2 border-white dark:border-gray-800"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Successful KES</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gray-800 dark:bg-gray-200 rounded-full shadow-sm border-2 border-white dark:border-gray-800"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Failed KES</span>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <div 
                className={`w-4 h-4 rounded-full shadow-sm border-2 border-white dark:border-gray-800 ${
                  transactionFilter === 'successful' ? 'bg-orange-500' : 'bg-gray-800 dark:bg-gray-200'
                }`}
              ></div>
              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                {transactionFilter === 'successful' ? 'Successful KES' : 'Failed KES'}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
