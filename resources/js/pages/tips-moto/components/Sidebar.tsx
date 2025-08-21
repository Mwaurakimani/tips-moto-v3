import {
    ArrowRightLeft,
    Bell,
    Brain,
    ChevronLeft,
    ChevronRight,
    CreditCard,
    Headphones,
    LayoutDashboard,
    Lightbulb,
    Settings,
    Share2,
    Trophy,
    Users,
} from 'lucide-react';
import { Button } from './ui/button';
import { Link, usePage } from '@inertiajs/react';

interface SidebarProps {
    collapsed: boolean;
    onToggle: (collapsed: boolean) => void;
    currentPage: string; // still useful to highlight the active item
}

export function Sidebar({ collapsed, onToggle, currentPage }: SidebarProps) {
    const { url } = usePage();
    const path = new URL(url, window.location.origin).pathname;

    const menuItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', href: '/adminDashboard' },
        { id: 'accounts', icon: Users, label: 'Accounts', href: route('adminDashboard.accounts') },
        { id: 'matches', icon: Trophy, label: 'Matches', href: route('adminDashboard.matches') },
        { id: 'tips', icon: Lightbulb, label: 'Tips', href: route('adminDashboard.tips') },
        { id: 'subscriptions', icon: CreditCard, label: 'Subscriptions', href: route('adminDashboard.subscriptions') },
        { id: 'transactions', icon: ArrowRightLeft, label: 'Transactions', href: route('adminDashboard.transactions') },
        // { id: 'notifications', icon: Bell, label: 'Notifications', href: '/adminDashboard/notifications' },
        // { id: 'support', icon: Headphones, label: 'Customer Support', href: '/adminDashboard/support' },
        // { id: 'affiliate', icon: Share2, label: 'Affiliate', href: '/adminDashboard/affiliate' },
    ];

    const bottomMenuItems:[] = [
        // { id: 'system', icon: Settings, label: 'System', href: '/adminDashboard/system' },
        // { id: 'model', icon: Brain, label: 'Model', href: '/adminDashboard/model' },
    ];

    return (
        <div
            className={`fixed top-0 left-0 z-50 h-full border-r border-gray-800 bg-black text-white transition-all duration-300 ${
                collapsed ? 'w-16' : 'w-64'
            }`}
        >
            <div className="flex h-full flex-col">
                {/* Header */}
                <div className={`flex flex-shrink-0 items-center justify-between border-b border-gray-800 ${collapsed ? 'p-2' : 'p-4'}`}>
                    <Link
                        href="/adminDashboard"
                        className="flex cursor-pointer items-center space-x-2 transition-opacity duration-200 hover:opacity-80"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500">
                            <span className="text-sm font-bold text-white">T</span>
                        </div>
                        {!collapsed && <span className="text-lg font-semibold">Tips Moto</span>}
                    </Link>
                </div>

                {/* Toggle Button */}
                <div className={`flex-shrink-0 ${collapsed ? 'p-2' : 'px-3 py-2'}`}>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onToggle(!collapsed)}
                        className={`h-10 w-full border border-gray-700 p-0 text-white transition-all duration-200 hover:border-gray-600 hover:bg-gray-800 ${
                            collapsed ? 'bg-gray-900/50 hover:bg-gray-800' : 'bg-gray-900/30 hover:bg-gray-800'
                        }`}
                    >
                        <div className="flex w-full items-center justify-center">
                            {collapsed ? (
                                <ChevronRight className="h-4 w-4" />
                            ) : (
                                <>
                                    <ChevronLeft className="mr-2 h-4 w-4" />
                                    <span className="text-sm">Collapse</span>
                                </>
                            )}
                        </div>
                    </Button>
                </div>


                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-x-hidden overflow-y-auto">
                    {/* Dashboard Section */}
                    <div className={collapsed ? 'p-2' : 'px-3 py-2'}>
                        <div className={`mb-2 text-xs tracking-wide text-gray-400 uppercase ${collapsed ? 'hidden' : 'block'}`}>Dashboard</div>
                        {menuItems.slice(0, 1).map((item) => {
                            const Icon = item.icon;
                            const isActive = item.id === 'dashboard' ? url === item.href : url.startsWith(item.href);


                            return (
                                <Link key={item.id} href={item.href}>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={`h-10 w-full transition-all duration-200 ${
                                            isActive
                                                ? 'bg-orange-500 text-white hover:bg-orange-600'
                                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                        } ${collapsed ? 'justify-center p-0' : 'justify-start px-3 text-left'}`}
                                        title={collapsed ? item.label : undefined}
                                    >
                                        <Icon className={`h-4 w-4 flex-shrink-0 ${collapsed ? '' : 'mr-3'}`} />
                                        {!collapsed && <span className="truncate">{item.label}</span>}
                                    </Button>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Manage Section */}
                    <div className={collapsed ? 'p-2' : 'px-3 py-2'}>
                        <div className={`mb-2 text-xs tracking-wide text-gray-400 uppercase ${collapsed ? 'hidden' : 'block'}`}>Manage</div>
                        <div className="space-y-1">
                            {menuItems.slice(1).map((item) => {
                                const Icon = item.icon;
                                const isActive = path === new URL(item.href, window.location.origin).pathname;

                                return (
                                    <Link key={item.id} href={item.href}>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={`h-10 w-full transition-all duration-200 ${
                                                isActive
                                                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                            } ${collapsed ? 'justify-center p-0' : 'justify-start px-3 text-left'}`}
                                            title={collapsed ? item.label : undefined}
                                        >
                                            <Icon className={`h-4 w-4 flex-shrink-0 ${collapsed ? '' : 'mr-3'}`} />
                                            {!collapsed && <span className="truncate">{item.label}</span>}
                                        </Button>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Administration Section */}
                    <div className={`border-t border-gray-800 ${collapsed ? 'mt-2 p-2' : 'mt-4 px-3 py-2'}`}>
                        <div className={`mb-2 text-xs tracking-wide text-gray-400 uppercase ${collapsed ? 'hidden' : 'block'}`}>Administration</div>
                        <div className="space-y-1">
                            {bottomMenuItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = currentPage === item.id;

                                return (
                                    <Link key={item.id} href={item.href}>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={`h-10 w-full transition-all duration-200 ${
                                                isActive
                                                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                            } ${collapsed ? 'justify-center p-0' : 'justify-start px-3 text-left'}`}
                                            title={collapsed ? item.label : undefined}
                                        >
                                            <Icon className={`h-4 w-4 flex-shrink-0 ${collapsed ? '' : 'mr-3'}`} />
                                            {!collapsed && <span className="truncate">{item.label}</span>}
                                        </Button>
                                    </Link>
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
