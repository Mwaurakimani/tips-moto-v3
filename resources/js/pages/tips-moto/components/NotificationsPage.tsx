import { useState } from 'react';
import { Bell, Search, Trash2, Eye, EyeOff, CheckCircle, AlertTriangle, Info, Users, DollarSign, X, MoreHorizontal, Archive, Star, Clock, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info' | 'transaction' | 'security' | 'system' | 'finance';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  isStarred?: boolean;
  isArchived?: boolean;
}

// Admin-focused notification data - relevant for platform management
const generateExtendedNotifications = (): Notification[] => {
  const notifications: Notification[] = [
    // Recent critical admin notifications
    {
      id: '1',
      type: 'error',
      title: 'System Alert',
      message: 'Database backup failed - manual intervention required',
      timestamp: '5 minutes ago',
      isRead: false,
      priority: 'high',
      category: 'System',
      isStarred: true
    },
    {
      id: '2',
      type: 'warning',
      title: 'Security Alert',
      message: 'Multiple failed admin login attempts from IP 41.80.112.45',
      timestamp: '15 minutes ago',
      isRead: false,
      priority: 'high',
      category: 'Security',
      isStarred: true
    },
    {
      id: '3',
      type: 'error',
      title: 'Payment Gateway Issue',
      message: 'M-Pesa API connection timeout - 12 transactions affected',
      timestamp: '32 minutes ago',
      isRead: false,
      priority: 'high',
      category: 'Finance'
    },
    {
      id: '4',
      type: 'warning',
      title: 'Server Performance',
      message: 'High CPU usage detected (85%) - consider scaling resources',
      timestamp: '45 minutes ago',
      isRead: false,
      priority: 'medium',
      category: 'System'
    },
    {
      id: '5',
      type: 'transaction',
      title: 'Large Transaction Alert',
      message: 'Transaction over KES 20,000 requires manual review',
      timestamp: '1 hour ago',
      isRead: false,
      priority: 'medium',
      category: 'Finance'
    },
    {
      id: '6',
      type: 'warning',
      title: 'Unusual Activity',
      message: 'Suspicious betting pattern detected from user #4521',
      timestamp: '1 hour ago',
      isRead: true,
      priority: 'medium',
      category: 'Security'
    },
    {
      id: '7',
      type: 'info',
      title: 'Revenue Milestone',
      message: 'Monthly revenue target achieved: KES 2.8M (112% of target)',
      timestamp: '2 hours ago',
      isRead: true,
      priority: 'low',
      category: 'Analytics',
      isStarred: true
    },
    {
      id: '8',
      type: 'success',
      title: 'Model Performance',
      message: 'Tips accuracy improved to 71.2% this week (+3.1%)',
      timestamp: '3 hours ago',
      isRead: true,
      priority: 'medium',
      category: 'Analytics'
    },

    // Yesterday's notifications
    {
      id: '9',
      type: 'warning',
      title: 'Refund Request',
      message: 'Multiple refund requests pending manual approval (8 requests)',
      timestamp: 'Yesterday 11:30 PM',
      isRead: true,
      priority: 'medium',
      category: 'Finance'
    },
    {
      id: '10',
      type: 'error',
      title: 'Customer Support Issue',
      message: 'Escalated ticket #CS-4521 - user unable to withdraw funds',
      timestamp: 'Yesterday 9:15 PM',
      isRead: true,
      priority: 'high',
      category: 'Support'
    },
    {
      id: '11',
      type: 'info',
      title: 'Daily Report',
      message: 'Daily analytics report generated - 1,847 active users',
      timestamp: 'Yesterday 6:00 PM',
      isRead: true,
      priority: 'low',
      category: 'Analytics'
    },
    {
      id: '12',
      type: 'warning',
      title: 'Account Verification',
      message: 'KYC verification queue has 45 pending applications',
      timestamp: 'Yesterday 3:45 PM',
      isRead: true,
      priority: 'medium',
      category: 'Compliance'
    },
    {
      id: '13',
      type: 'success',
      title: 'System Update',
      message: 'Security patches applied successfully - system restart required',
      timestamp: 'Yesterday 1:20 PM',
      isRead: true,
      priority: 'medium',
      category: 'System'
    },
    {
      id: '14',
      type: 'info',
      title: 'Marketing Campaign',
      message: 'July promotion campaign ended - 156 new subscriptions',
      timestamp: 'Yesterday 10:00 AM',
      isRead: true,
      priority: 'low',
      category: 'Marketing'
    },

    // Older notifications
    {
      id: '15',
      type: 'success',
      title: 'System Maintenance',
      message: 'Scheduled maintenance completed - all services restored',
      timestamp: '2 days ago',
      isRead: true,
      priority: 'low',
      category: 'System',
      isArchived: true
    },
    {
      id: '16',
      type: 'warning',
      title: 'Compliance Alert',
      message: 'Monthly compliance report due in 3 days',
      timestamp: '3 days ago',
      isRead: true,
      priority: 'medium',
      category: 'Compliance',
      isArchived: true
    },
    {
      id: '17',
      type: 'info',
      title: 'API Integration',
      message: 'Third-party odds provider API updated to latest version',
      timestamp: '4 days ago',
      isRead: true,
      priority: 'low',
      category: 'System',
      isArchived: true
    },
    {
      id: '18',
      type: 'error',
      title: 'Data Backup Issue',
      message: 'Weekly backup verification failed - data integrity check needed',
      timestamp: '5 days ago',
      isRead: true,
      priority: 'high',
      category: 'System',
      isArchived: true
    }
  ];

  return notifications;
};

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(generateExtendedNotifications);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  // Filter notifications based on search and filters
  const filteredNotifications = notifications.filter(notification => {
    // Tab filtering
    if (activeTab === 'unread' && notification.isRead) return false;
    if (activeTab === 'starred' && !notification.isStarred) return false;
    if (activeTab === 'archived' && !notification.isArchived) return false;
    if (activeTab === 'all' && notification.isArchived) return false;

    // Search filtering
    if (searchTerm && !notification.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !notification.message.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Type filtering
    if (selectedType !== 'all' && notification.type !== selectedType) return false;

    // Priority filtering
    if (selectedPriority !== 'all' && notification.priority !== selectedPriority) return false;

    // Category filtering
    if (selectedCategory !== 'all' && notification.category !== selectedCategory) return false;

    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead && !n.isArchived).length;
  const starredCount = notifications.filter(n => n.isStarred && !n.isArchived).length;
  const archivedCount = notifications.filter(n => n.isArchived).length;

  // Get unique categories for filter
  const categories = [...new Set(notifications.map(n => n.category))];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    } else {
      setSelectedNotifications([]);
    }
  };

  const handleSelectNotification = (notificationId: string, checked: boolean) => {
    if (checked) {
      setSelectedNotifications(prev => [...prev, notificationId]);
    } else {
      setSelectedNotifications(prev => prev.filter(id => id !== notificationId));
    }
  };

  const markAsRead = (notificationIds: string[]) => {
    setNotifications(prev =>
      prev.map(notification =>
        notificationIds.includes(notification.id)
          ? { ...notification, isRead: true }
          : notification
      )
    );
    setSelectedNotifications([]);
  };

  const markAsUnread = (notificationIds: string[]) => {
    setNotifications(prev =>
      prev.map(notification =>
        notificationIds.includes(notification.id)
          ? { ...notification, isRead: false }
          : notification
      )
    );
    setSelectedNotifications([]);
  };

  const toggleStar = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isStarred: !notification.isStarred }
          : notification
      )
    );
  };

  const archiveNotifications = (notificationIds: string[]) => {
    setNotifications(prev =>
      prev.map(notification =>
        notificationIds.includes(notification.id)
          ? { ...notification, isArchived: true }
          : notification
      )
    );
    setSelectedNotifications([]);
  };

  const deleteNotifications = (notificationIds: string[]) => {
    setNotifications(prev =>
      prev.filter(notification => !notificationIds.includes(notification.id))
    );
    setSelectedNotifications([]);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <X className="h-5 w-5 text-red-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'transaction':
        return <DollarSign className="h-5 w-5 text-orange-500" />;
      case 'security':
        return <Shield className="h-5 w-5 text-red-500" />;
      case 'system':
        return <Users className="h-5 w-5 text-purple-500" />;
      case 'finance':
        return <DollarSign className="h-5 w-5 text-green-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityBadge = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Low</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">Notifications</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage all your notifications and alerts
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="transaction">Transaction</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedPriority} onValueChange={setSelectedPriority}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedNotifications.length > 0 && (
        <Card className="bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
                  {selectedNotifications.length} notification{selectedNotifications.length > 1 ? 's' : ''} selected
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => markAsRead(selectedNotifications)}
                  className="bg-white dark:bg-gray-800"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Mark as Read
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => markAsUnread(selectedNotifications)}
                  className="bg-white dark:bg-gray-800"
                >
                  <EyeOff className="h-4 w-4 mr-2" />
                  Mark as Unread
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => archiveNotifications(selectedNotifications)}
                  className="bg-white dark:bg-gray-800"
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteNotifications(selectedNotifications)}
                  className="bg-white dark:bg-gray-800 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs and Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="relative">
            All Notifications
            {notifications.filter(n => !n.isArchived).length > 0 && (
              <Badge className="ml-2 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                {notifications.filter(n => !n.isArchived).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="unread" className="relative">
            Unread
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="starred" className="relative">
            Starred
            {starredCount > 0 && (
              <Badge className="ml-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                {starredCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="archived" className="relative">
            Archived
            {archivedCount > 0 && (
              <Badge className="ml-2 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                {archivedCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>
                    {activeTab === 'all' && 'All Notifications'}
                    {activeTab === 'unread' && 'Unread Notifications'}
                    {activeTab === 'starred' && 'Starred Notifications'}
                    {activeTab === 'archived' && 'Archived Notifications'}
                  </span>
                </CardTitle>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="text-sm text-gray-500">Select All</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-3">
                  {filteredNotifications.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No notifications found</h3>
                      <p className="text-sm">
                        {activeTab === 'unread' && 'You\'re all caught up! No unread notifications.'}
                        {activeTab === 'starred' && 'No starred notifications yet.'}
                        {activeTab === 'archived' && 'No archived notifications.'}
                        {activeTab === 'all' && 'No notifications match your current filters.'}
                      </p>
                    </div>
                  ) : (
                    filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`
                          group flex items-start space-x-4 p-4 rounded-lg border transition-all duration-200
                          ${notification.isRead
                            ? 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'
                            : 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800'
                          }
                          hover:shadow-md
                        `}
                      >
                        <Checkbox
                          checked={selectedNotifications.includes(notification.id)}
                          onCheckedChange={(checked) => handleSelectNotification(notification.id, checked as boolean)}
                        />

                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className={`font-medium ${
                                  notification.isRead
                                    ? 'text-gray-900 dark:text-gray-100'
                                    : 'text-gray-900 dark:text-white'
                                }`}>
                                  {notification.title}
                                  {!notification.isRead && (
                                    <span className="ml-2 w-2 h-2 bg-orange-500 rounded-full inline-block"></span>
                                  )}
                                </h4>
                                {getPriorityBadge(notification.priority)}
                                <Badge variant="outline" className="text-xs">
                                  {notification.category}
                                </Badge>
                              </div>
                              <p className={`text-sm mb-2 ${
                                notification.isRead
                                  ? 'text-gray-600 dark:text-gray-400'
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}>
                                {notification.message}
                              </p>
                              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-500">
                                <Clock className="h-3 w-3" />
                                <span>{notification.timestamp}</span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleStar(notification.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Star className={`h-4 w-4 ${
                                  notification.isStarred
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-400'
                                }`} />
                              </Button>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => markAsRead([notification.id])}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    Mark as read
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => markAsUnread([notification.id])}>
                                    <EyeOff className="h-4 w-4 mr-2" />
                                    Mark as unread
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => archiveNotifications([notification.id])}>
                                    <Archive className="h-4 w-4 mr-2" />
                                    Archive
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => deleteNotifications([notification.id])}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
