import {
  LayoutDashboard,
  Users,
  Trophy,
  Lightbulb,
  CreditCard,
  ArrowRightLeft,
  Share2,
  Settings,
  Brain,
  ChevronLeft,
  ChevronRight,
  Bell,
  Headphones
} from 'lucide-react';
import { Button } from './ui/button';

interface SidebarProps {
  collapsed: boolean;
  onToggle: (collapsed: boolean) => void;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Sidebar({ collapsed, onToggle, currentPage, onPageChange }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'accounts', icon: Users, label: 'Accounts' },
    { id: 'matches', icon: Trophy, label: 'Matches' },
    { id: 'tips', icon: Lightbulb, label: 'Tips' },
    { id: 'subscriptions', icon: CreditCard, label: 'Subscriptions' },
    { id: 'transactions', icon: ArrowRightLeft, label: 'Transactions' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'support', icon: Headphones, label: 'Customer Support' },
    { id: 'affiliate', icon: Share2, label: 'Affiliate' },
  ];

  const bottomMenuItems = [
    { id: 'system', icon: Settings, label: 'System' },
    { id: 'model', icon: Brain, label: 'Model' },
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-black text-white border-r border-gray-800 transition-all duration-300 z-50 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className={`flex items-center justify-between border-b border-gray-800 flex-shrink-0 ${
          collapsed ? 'p-2' : 'p-4'
        }`}>
          {!collapsed && (
            <div
              className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity duration-200"
              onClick={() => onPageChange('dashboard')}
              title="Go to Dashboard"
            >
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="font-semibold text-lg">Tips Moto</span>
            </div>
          )}

          {collapsed && (
            <div
              className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mx-auto cursor-pointer hover:opacity-80 transition-opacity duration-200"
              onClick={() => onPageChange('dashboard')}
              title="Go to Dashboard"
            >
              <span className="text-white font-bold text-sm">T</span>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <div className={`flex-shrink-0 ${collapsed ? 'p-2' : 'px-3 py-2'}`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggle(!collapsed)}
            className={`w-full h-10 p-0 text-white border border-gray-700 hover:bg-gray-800 hover:border-gray-600 transition-all duration-200 ${
              collapsed
                ? 'bg-gray-900/50 hover:bg-gray-800'
                : 'bg-gray-900/30 hover:bg-gray-800'
            }`}
          >
            <div className="flex items-center justify-center w-full">
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  <span className="text-sm">Collapse</span>
                </>
              )}
            </div>
          </Button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {/* Dashboard Section */}
          <div className={collapsed ? 'p-2' : 'px-3 py-2'}>
            <div className={`text-xs uppercase tracking-wide text-gray-400 mb-2 ${collapsed ? 'hidden' : 'block'}`}>
              Dashboard
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange('dashboard')}
              className={`w-full h-10 transition-all duration-200 ${
                currentPage === 'dashboard'
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              } ${collapsed ? 'p-0 justify-center' : 'justify-start px-3 text-left'}`}
              title={collapsed ? 'Dashboard' : undefined}
            >
              <LayoutDashboard className={`h-4 w-4 flex-shrink-0 ${collapsed ? '' : 'mr-3'}`} />
              {!collapsed && <span className="truncate">Dashboard</span>}
            </Button>
          </div>

          {/* Manage Section */}
          <div className={collapsed ? 'p-2' : 'px-3 py-2'}>
            <div className={`text-xs uppercase tracking-wide text-gray-400 mb-2 ${collapsed ? 'hidden' : 'block'}`}>
              Manage
            </div>
            <div className="space-y-1">
              {menuItems.slice(1).map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;

                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => onPageChange(item.id)}
                    className={`w-full h-10 transition-all duration-200 ${
                      isActive
                        ? 'bg-orange-500 text-white hover:bg-orange-600'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    } ${collapsed ? 'p-0 justify-center' : 'justify-start px-3 text-left'}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className={`h-4 w-4 flex-shrink-0 ${collapsed ? '' : 'mr-3'}`} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Administration Section */}
          <div className={`border-t border-gray-800 ${collapsed ? 'mt-2 p-2' : 'mt-4 px-3 py-2'}`}>
            <div className={`text-xs uppercase tracking-wide text-gray-400 mb-2 ${collapsed ? 'hidden' : 'block'}`}>
              Administration
            </div>
            <div className="space-y-1">
              {bottomMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;

                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => onPageChange(item.id)}
                    className={`w-full h-10 transition-all duration-200 ${
                      isActive
                        ? 'bg-orange-500 text-white hover:bg-orange-600'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    } ${collapsed ? 'p-0 justify-center' : 'justify-start px-3 text-left'}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className={`h-4 w-4 flex-shrink-0 ${collapsed ? '' : 'mr-3'}`} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Bottom spacing for scrollable area */}
          <div className={collapsed ? 'h-2' : 'h-4'}></div>
        </div>
      </div>
    </div>
  );
}
