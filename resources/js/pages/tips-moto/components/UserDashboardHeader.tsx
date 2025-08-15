import { useState } from 'react';
import {
  User,
  Settings,
  LogOut,
  Bell,
  Moon,
  Sun,
  Crown,
  TrendingUp
} from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { useTheme } from './contexts/ThemeContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface UserDashboardHeaderProps {
  currentUser: any;
  onLogout?: () => void;
  onBackToHomepage: () => void;
}

export function UserDashboardHeader({
  currentUser,
  onLogout,
  onBackToHomepage
}: UserDashboardHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const mockNotifications = [
    {
      id: 1,
      title: 'New Premium Tips Available',
      message: 'Today\'s VIP package is now ready',
      time: '2 min ago',
      unread: true
    },
    {
      id: 2,
      title: 'Yesterday\'s Results',
      message: '8/10 tips won! Great performance',
      time: '1 hour ago',
      unread: true
    },
    {
      id: 3,
      title: 'Subscription Renewal',
      message: 'Your VIP plan renews in 3 days',
      time: '2 hours ago',
      unread: false
    }
  ];

  const unreadCount = mockNotifications.filter(n => n.unread).length;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-orange-500/20 bg-white/95 dark:bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/60">
      <div className="flex h-16 items-center justify-between px-4 w-full">
        {/* Logo */}
        <div className="flex items-center">
          <button
            onClick={onBackToHomepage}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span className="hidden sm:block font-bold text-lg bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Tips Moto
            </span>
          </button>
        </div>

        {/* User Section */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="relative"
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>

          {/* Notifications */}
          {/*<DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>*/}
          {/*  <DropdownMenuTrigger asChild>*/}
          {/*    <Button variant="ghost" size="sm" className="relative">*/}
          {/*      <Bell className="h-4 w-4" />*/}
          {/*      {unreadCount > 0 && (*/}
          {/*        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">*/}
          {/*          <span className="text-xs text-white font-medium">{unreadCount}</span>*/}
          {/*        </div>*/}
          {/*      )}*/}
          {/*    </Button>*/}
          {/*  </DropdownMenuTrigger>*/}
          {/*  <DropdownMenuContent */}
          {/*    align="end" */}
          {/*    className="w-80 notification-dropdown"*/}
          {/*    sideOffset={8}*/}
          {/*  >*/}
          {/*    <div className="p-4 border-b border-gray-200 dark:border-gray-700">*/}
          {/*      <h3 className="font-semibold">Notifications</h3>*/}
          {/*      <p className="text-xs text-gray-500 dark:text-gray-400">*/}
          {/*        {unreadCount} unread notifications*/}
          {/*      </p>*/}
          {/*    </div>*/}
          {/*    */}
          {/*    <div className="max-h-80 overflow-y-auto">*/}
          {/*      {mockNotifications.map((notification) => (*/}
          {/*        <DropdownMenuItem*/}
          {/*          key={notification.id}*/}
          {/*          className={`p-4 cursor-pointer notification-item ${*/}
          {/*            notification.unread ? 'notification-unread bg-orange-50/50 dark:bg-orange-950/20' : ''*/}
          {/*          }`}*/}
          {/*        >*/}
          {/*          <div className="w-full">*/}
          {/*            <div className="flex justify-between items-start mb-1">*/}
          {/*              <p className="font-medium text-sm">{notification.title}</p>*/}
          {/*              <span className="text-xs text-gray-500">{notification.time}</span>*/}
          {/*            </div>*/}
          {/*            <p className="text-xs text-gray-600 dark:text-gray-400">{notification.message}</p>*/}
          {/*          </div>*/}
          {/*        </DropdownMenuItem>*/}
          {/*      ))}*/}
          {/*    </div>*/}
          {/*  </DropdownMenuContent>*/}
          {/*</DropdownMenu>*/}

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                  <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                    {currentUser?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{currentUser?.name || 'User'}</p>
                  <p className="w-[200px] truncate text-xs text-muted-foreground">
                    {currentUser?.email || 'user@example.com'}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />

              <div className="p-2">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge className={`${
                    currentUser?.subscriptionTier === 'VIP'
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                      : 'bg-blue-500 text-white'
                  }`}>
                    {currentUser?.subscriptionTier === 'VIP' && <Crown className="h-3 w-3 mr-1" />}
                    {currentUser?.subscriptionTier || 'Premium'}
                  </Badge>
                  <div className={`w-2 h-2 rounded-full ${
                    currentUser?.subscriptionStatus === 'active' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                </div>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>

              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="cursor-pointer text-red-600 dark:text-red-400"
                onClick={onLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
