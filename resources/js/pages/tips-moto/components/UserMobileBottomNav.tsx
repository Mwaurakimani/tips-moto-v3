import { 
  Home, 
  Package, 
  Target, 
  User 
} from 'lucide-react';

interface UserMobileBottomNavProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function UserMobileBottomNav({ currentPage, onPageChange }: UserMobileBottomNavProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'packages', label: 'Packages', icon: Package },
    { id: 'my-tips', label: 'My Tips', icon: Target },
    { id: 'account', label: 'Account', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 xl:hidden">
      <div className="bg-white dark:bg-black border-t border-orange-500/20 backdrop-blur-lg">
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/20'
                }`}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
