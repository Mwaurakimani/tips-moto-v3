import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Settings, Server, Database, Cpu, HardDrive, Activity } from 'lucide-react';
import { Badge } from './ui/badge';

export function SystemsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">System</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            System administration and monitoring
          </p>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-600">
          <Activity className="h-3 w-3 mr-1" />
          System Online
        </Badge>
      </div>

      {/* Coming Soon Card */}
      <Card>
        <CardHeader className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Settings className="h-8 w-8 text-gray-400" />
          </div>
          <CardTitle className="text-2xl">System Administration</CardTitle>
          <CardDescription className="text-lg mt-2">
            Advanced system controls and monitoring tools are coming soon.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center pb-12">
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            This section will include server monitoring, database management, 
            system logs, performance metrics, and advanced configuration options.
          </p>
        </CardContent>
      </Card>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Server className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900 dark:text-white">Server Status</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Coming Soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Database className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900 dark:text-white">Database</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Coming Soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Cpu className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900 dark:text-white">Performance</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Coming Soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <HardDrive className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900 dark:text-white">Storage</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Coming Soon</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
