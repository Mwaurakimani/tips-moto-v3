import { useState } from 'react';
import { 
  TrendingUp, 
  Menu,
  X
} from 'lucide-react';
import { Button } from './ui/button';

interface UserHeaderProps {
  currentPage: string;
  onNavigateHome: () => void;
  onNavigateTips: () => void;
  onNavigateAbout: () => void;
  onBackToAdmin?: () => void;
  onSignIn?: () => void;
  onGetStarted?: () => void;
}

export function UserHeader({ 
  currentPage, 
  onNavigateHome, 
  onNavigateTips, 
  onNavigateAbout,
  onBackToAdmin,
  onSignIn,
  onGetStarted
}: UserHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleHomeClick = () => {
    onNavigateHome();
    if (currentPage === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-black/90 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div 
              className="flex items-center space-x-2 cursor-pointer"
              onClick={handleHomeClick}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Tips Moto</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={handleHomeClick}
              className={`transition-colors ${
                currentPage === 'home' ? 'text-orange-500' : 'text-gray-300 hover:text-orange-500'
              }`}
            >
              Home</button>
            <button 
              onClick={onNavigateTips}
              className={`transition-colors ${
                currentPage === 'tips' ? 'text-orange-500' : 'text-gray-300 hover:text-orange-500'
              }`}
            >
              Tips
            </button>
            <button 
              onClick={onNavigateAbout}
              className={`transition-colors ${
                currentPage === 'about' ? 'text-orange-500' : 'text-gray-300 hover:text-orange-500'
              }`}
            >
              About Us
            </button>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onSignIn}
              className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white bg-transparent transition-all duration-300"
            >
              Sign In
            </Button>
            <Button 
              size="sm" 
              onClick={onGetStarted}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Get Started
            </Button>
            {onBackToAdmin && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBackToAdmin}
                className="text-gray-400 hover:text-gray-200"
              >
                Admin
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-black/95 backdrop-blur-md">
          <div className="px-4 py-4 space-y-3">
            <button 
              onClick={() => {
                handleHomeClick();
                setMobileMenuOpen(false);
              }}
              className={`block transition-colors text-left ${
                currentPage === 'home' ? 'text-orange-500' : 'text-gray-300 hover:text-orange-500'
              }`}
            >
              Home</button>
            <button 
              onClick={() => {
                onNavigateTips();
                setMobileMenuOpen(false);
              }}
              className={`block transition-colors text-left ${
                currentPage === 'tips' ? 'text-orange-500' : 'text-gray-300 hover:text-orange-500'
              }`}
            >
              Tips</button>
            <button 
              onClick={() => {
                onNavigateAbout();
                setMobileMenuOpen(false);
              }}
              className={`block transition-colors text-left ${
                currentPage === 'about' ? 'text-orange-500' : 'text-gray-300 hover:text-orange-500'
              }`}
            >
              About Us</button>
            <div className="pt-3 border-t border-gray-800 space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  onSignIn?.();
                  setMobileMenuOpen(false);
                }}
                className="w-full border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white bg-transparent transition-all duration-300"
              >
                Sign In
              </Button>
              <Button 
                size="sm" 
                onClick={() => {
                  onGetStarted?.();
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              >
                Get Started
              </Button>
              {onBackToAdmin && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    onBackToAdmin();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-gray-400"
                >
                  Admin Panel
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
