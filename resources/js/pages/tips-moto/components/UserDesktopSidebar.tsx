import {
  Home,
  Package,
  Target,
  User,
  TrendingUp,
  Crown
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface UserDesktopSidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  currentUser: any;
  isOpen: boolean;
}

export function UserDesktopSidebar({ currentPage, onPageChange, currentUser, isOpen }: UserDesktopSidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'packages', label: 'Packages', icon: Package },
    { id: 'my-tips', label: 'My Tips', icon: Target },
    { id: 'account', label: 'Account', icon: User },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-black border-r border-orange-500/20 hidden xl:block">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center space-x-3 p-6 border-b border-orange-500/20">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            Tips Moto
          </span>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-orange-500/20">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
              <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                {currentUser?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 dark:text-white truncate">
                {currentUser?.name || 'User'}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={`text-xs ${
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
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => onPageChange(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:text-orange-500 dark:hover:text-orange-400'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
      </div>
    </aside>
  );
}
