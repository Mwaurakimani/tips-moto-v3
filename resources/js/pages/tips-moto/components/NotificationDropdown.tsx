import { useState } from 'react';
import { Bell, Eye, X, Check, AlertTriangle, Info, TrendingUp, Users, Calendar, DollarSign, CheckCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info' | 'transaction' | 'user' | 'match' | 'tip';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
}

// Generate mock notifications relevant to the betting tips platform
const generateNotifications = (): Notification[] => {
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'success',
      title: 'New Subscription',
      message: 'Peter Kamau subscribed to Premium VIP Weekly package (KES 5,000)',
      timestamp: '2 minutes ago',
      isRead: false,
      priority: 'high'
    },
    {
      id: '2',
      type: 'warning',
      title: 'High Risk Tip Alert',
      message: 'Arsenal vs Chelsea tip marked as high risk - review recommended',
      timestamp: '15 minutes ago',
      isRead: false,
      priority: 'medium'
    },
    {
      id: '3',
      type: 'transaction',
      title: 'Payment Failed',
      message: 'Transaction #1195 for Grace Wanjiku failed - M-Pesa timeout',
      timestamp: '32 minutes ago',
      isRead: false,
      priority: 'high'
    },
    {
      id: '4',
      type: 'info',
      title: 'Match Update',
      message: 'Real Madrid vs Barcelona match status changed to live',
      timestamp: '1 hour ago',
      isRead: true,
      priority: 'low'
    },
    {
      id: '5',
      type: 'user',
      title: 'New User Registration',
      message: '5 new users registered in the last hour',
      timestamp: '1 hour ago',
      isRead: true,
      priority: 'medium'
    },
    {
      id: '6',
      type: 'tip',
      title: 'Tip Won',
      message: 'Manchester United vs Liverpool tip won - 89% success rate maintained',
      timestamp: '2 hours ago',
      isRead: true,
      priority: 'low'
    },
    {
      id: '7',
      type: 'error',
      title: 'System Alert',
      message: 'Database backup completed with 1 warning - check logs',
      timestamp: '3 hours ago',
      isRead: true,
      priority: 'medium'
    },
    {
      id: '8',
      type: 'transaction',
      title: 'Revenue Milestone',
      message: 'Daily revenue target achieved: KES 150,000 (105% of target)',
      timestamp: '4 hours ago',
      isRead: true,
      priority: 'low'
    }
  ];

  return notifications;
};

interface NotificationDropdownProps {
  onPageChange?: (page: string) => void;
}

export function NotificationDropdown({ onPageChange }: NotificationDropdownProps = {}) {
  const [notifications, setNotifications] = useState<Notification[]>(generateNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const clearNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <X className="h-4 w-4 text-red-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'transaction':
        return <DollarSign className="h-4 w-4 text-orange-500" />;
      case 'user':
        return <Users className="h-4 w-4 text-purple-500" />;
      case 'match':
        return <Calendar className="h-4 w-4 text-indigo-500" />;
      case 'tip':
        return <TrendingUp className="h-4 w-4 text-emerald-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-500';
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="notification-badge absolute -top-1 -right-1 h-4 w-4 bg-orange-500 rounded-full text-xs text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="notification-dropdown w-96 p-0 shadow-xl border-0 bg-white dark:bg-gray-900"
        align="end"
        sideOffset={8}
      >
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs h-7 px-2 bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 border-orange-200 dark:border-orange-800"
                  >
                    <CheckCheck className="h-3 w-3 mr-1" />
                    Mark all read
                  </Button>
                )}
                <Badge
                  variant="secondary"
                  className="px-2 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                >
                  {unreadCount} new
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              <div className="space-y-1 p-4 pt-2">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No notifications</p>
                    <p className="text-xs mt-1">You're all caught up!</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`
                        notification-item group relative p-3 rounded-lg border-l-4 transition-all duration-200 cursor-pointer
                        ${getPriorityColor(notification.priority)}
                        ${
                          notification.isRead
                            ? 'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800'
                            : 'notification-unread bg-orange-50 dark:bg-orange-950/20 hover:bg-orange-100 dark:hover:bg-orange-950/30 shadow-sm'
                        }
                      `}
                      onClick={() => !notification.isRead && markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium ${
                              notification.isRead
                                ? 'text-gray-900 dark:text-gray-100'
                                : 'text-gray-900 dark:text-white'
                            }`}>
                              {notification.title}
                              {!notification.isRead && (
                                <span className="ml-2 w-2 h-2 bg-orange-500 rounded-full inline-block animate-pulse"></span>
                              )}
                            </p>
                            <div className="notification-actions flex items-center space-x-1">
                              {!notification.isRead && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(notification.id);
                                  }}
                                  className="h-6 w-6 p-0 hover:bg-orange-200 dark:hover:bg-orange-900/50"
                                  title="Mark as read"
                                >
                                  <Eye className="h-3 w-3 text-orange-600 dark:text-orange-400" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  clearNotification(notification.id);
                                }}
                                className="h-6 w-6 p-0 hover:bg-red-200 dark:hover:bg-red-900/50"
                                title="Clear notification"
                              >
                                <X className="h-3 w-3 text-red-500 dark:text-red-400" />
                              </Button>
                            </div>
                          </div>
                          <p className={`text-sm mt-1 leading-relaxed ${
                            notification.isRead
                              ? 'text-gray-600 dark:text-gray-400'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 flex items-center">
                            <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                            {notification.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            {notifications.length > 0 && (
              <>
                <Separator />
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
                  <Button
                    variant="outline"
                    className="w-full text-sm hover:bg-orange-50 hover:border-orange-200 dark:hover:bg-orange-950/20 dark:hover:border-orange-800"
                    onClick={() => {
                      setIsOpen(false);
                      if (onPageChange) {
                        onPageChange('notifications');
                      }
                    }}
                  >
                    View All Notifications
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
