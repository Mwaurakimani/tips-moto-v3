import { useState } from 'react';
import { Calendar, Clock, Shield, Activity, Mail, Phone, Building, Users, CheckCircle, TrendingUp, BarChart3, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface ProfilePageProps {
  currentAdmin: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    avatar: string;
    joinDate: string;
    lastLogin: string;
  };
  onPageChange: (page: string) => void;
}

export function ProfilePage({ currentAdmin }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for demonstration - in real app, this would come from API
  const profileStats = {
    totalLogins: 1247,
    lastLoginStreak: 23,
    accountAge: 357, // days
    totalActions: 5420,
    averageSessionDuration: '2h 34m',
    privilegeLevel: 'Super Admin',
    departmentTeam: 'Operations',
    directReports: 8,
    projectsOverseen: 12,
    systemPermissions: ['Full Access', 'User Management', 'Financial Data', 'System Configuration']
  };

  const recentActivity = [
    {
      id: 1,
      action: 'Updated match settings',
      target: 'Manchester United vs Liverpool',
      timestamp: '2 hours ago',
      type: 'update',
      icon: Settings
    },
    {
      id: 2,
      action: 'Approved new user registration',
      target: 'user@example.com',
      timestamp: '4 hours ago',
      type: 'approval',
      icon: CheckCircle
    },
    {
      id: 3,
      action: 'Generated monthly report',
      target: 'Financial Summary Q4',
      timestamp: '1 day ago',
      type: 'report',
      icon: BarChart3
    },
    {
      id: 4,
      action: 'Modified subscription package',
      target: 'Premium Betting Tips',
      timestamp: '2 days ago',
      type: 'update',
      icon: Settings
    },
    {
      id: 5,
      action: 'System maintenance completed',
      target: 'Database optimization',
      timestamp: '3 days ago',
      type: 'maintenance',
      icon: Activity
    }
  ];

  const achievements = [
    {
      title: 'Perfect Attendance',
      description: 'Logged in every day this month',
      icon: Calendar,
      color: 'bg-green-500',
      earned: true
    },
    {
      title: 'Security Champion',
      description: 'Maintained 100% security compliance',
      icon: Shield,
      color: 'bg-blue-500',
      earned: true
    },
    {
      title: 'Efficiency Expert',
      description: 'Processed 500+ transactions this week',
      icon: TrendingUp,
      color: 'bg-orange-500',
      earned: true
    },
    {
      title: 'Team Leader',
      description: 'Mentored 5+ junior administrators',
      icon: Users,
      color: 'bg-purple-500',
      earned: false
    }
  ];

  const formatAccountAge = (days: number) => {
    if (days < 30) return `${days} days`;
    if (days < 365) return `${Math.floor(days / 30)} months`;
    return `${Math.floor(days / 365)} years`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'update': return Settings;
      case 'approval': return CheckCircle;
      case 'report': return BarChart3;
      case 'maintenance': return Activity;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'update': return 'text-blue-600 dark:text-blue-400';
      case 'approval': return 'text-green-600 dark:text-green-400';
      case 'report': return 'text-orange-600 dark:text-orange-400';
      case 'maintenance': return 'text-purple-600 dark:text-purple-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={currentAdmin.avatar} alt={`${currentAdmin.firstName} ${currentAdmin.lastName}`} />
                  <AvatarFallback className="bg-orange-500 text-white text-2xl">
                    {currentAdmin.firstName[0]}{currentAdmin.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full flex items-center justify-center">
                  <div className="h-2 w-2 bg-white rounded-full"></div>
                </div>
              </div>

              <div className="space-y-2 flex-1">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {currentAdmin.firstName} {currentAdmin.lastName}
                  </h1>
                  <div className="flex items-center space-x-3 mt-1">
                    <Badge variant="default" className="bg-orange-500 hover:bg-orange-600">
                      <Shield className="h-3 w-3 mr-1" />
                      {currentAdmin.role}
                    </Badge>
                    <Badge variant="secondary">
                      <Building className="h-3 w-3 mr-1" />
                      {profileStats.departmentTeam}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>{currentAdmin.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>{currentAdmin.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {currentAdmin.joinDate}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Last active: {currentAdmin.lastLogin}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
              <Shield className="h-4 w-4" />
              <span>Profile information is managed through Account Settings</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Logins</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profileStats.totalLogins.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {profileStats.lastLoginStreak} day streak
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Account Age</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatAccountAge(profileStats.accountAge)}</div>
                <p className="text-xs text-muted-foreground">
                  {profileStats.accountAge} days total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Actions</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profileStats.totalActions.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Avg session: {profileStats.averageSessionDuration}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Team Management</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profileStats.directReports}</div>
                <p className="text-xs text-muted-foreground">
                  Direct reports
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Your contribution to Tips Moto operations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Task Completion Rate</span>
                    <span className="text-sm text-muted-foreground">94%</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Response Time</span>
                    <span className="text-sm text-muted-foreground">87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Security Compliance</span>
                    <span className="text-sm text-muted-foreground">100%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Access</CardTitle>
                <CardDescription>Your current privileges and access levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Privilege Level</span>
                    <Badge variant="default" className="bg-red-500 hover:bg-red-600">
                      {profileStats.privilegeLevel}
                    </Badge>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <span className="text-sm font-medium">Active Permissions</span>
                    <div className="flex flex-wrap gap-2">
                      {profileStats.systemPermissions.map((permission, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Projects Overseen</span>
                    <span className="text-sm text-muted-foreground">{profileStats.projectsOverseen}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions and system interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const IconComponent = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-start space-x-4">
                      <div className={`p-2 rounded-full ${getActivityColor(activity.type)} bg-opacity-10`}>
                        <IconComponent className={`h-4 w-4 ${getActivityColor(activity.type)}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.action}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {activity.target}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {activity.timestamp}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <Card key={index} className={`${achievement.earned ? 'border-orange-200 dark:border-orange-800' : 'opacity-50'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-full ${achievement.color} ${achievement.earned ? '' : 'grayscale'}`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {achievement.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {achievement.description}
                        </p>
                        <Badge
                          variant={achievement.earned ? "default" : "secondary"}
                          className={`mt-2 ${achievement.earned ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
                        >
                          {achievement.earned ? 'Earned' : 'In Progress'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Permissions</CardTitle>
              <CardDescription>Detailed breakdown of your access rights and capabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Administrative Access</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      'User Management',
                      'Financial Data',
                      'System Configuration',
                      'Audit Logs',
                      'Backup & Restore',
                      'API Management'
                    ].map((permission) => (
                      <div key={permission} className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{permission}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Content Management</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      'Match Management',
                      'Tips Approval',
                      'Package Creation',
                      'Content Moderation',
                      'Notification Broadcasting',
                      'Report Generation'
                    ].map((permission) => (
                      <div key={permission} className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{permission}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Security & Compliance</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      'Security Settings',
                      'Compliance Monitoring',
                      'Data Protection',
                      'Access Control',
                      'Risk Management',
                      'Incident Response'
                    ].map((permission) => (
                      <div key={permission} className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{permission}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
