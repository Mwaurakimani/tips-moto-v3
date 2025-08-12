import { 
  TrendingUp, 
  Menu, 
  X, 
  Phone, 
  Mail, 
  MapPin,
  ArrowRight,
  Instagram,
  Facebook,
  MessageCircle,
  Twitter,
  Send
} from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface UserTipsPageProps {
  onBackToHome: () => void;
  onBackToAdmin: () => void;
}

export function UserTipsPage({ onBackToHome, onBackToAdmin }: UserTipsPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedSport, setSelectedSport] = useState<string | null>(null);

  const sports = [
    {
      id: 'football',
      name: 'Football',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=300&h=200&fit=crop',
      available: true
    },
    {
      id: 'formula-one',
      name: 'Formula One',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
      available: true
    },
    {
      id: 'basketball',
      name: 'Basketball',
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&h=200&fit=crop',
      available: true
    },
    {
      id: 'tennis',
      name: 'Tennis',
      image: 'https://images.unsplash.com/photo-1530915365347-e35b725eb22a?w=300&h=200&fit=crop',
      available: true
    },
    {
      id: 'mma',
      name: 'MMA (UFC)',
      image: 'https://images.unsplash.com/photo-1544717684-82d67456bbf0?w=300&h=200&fit=crop',
      available: true
    },
    {
      id: 'cricket',
      name: 'Cricket',
      image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=300&h=200&fit=crop',
      available: true
    },
    {
      id: 'ice-hockey',
      name: 'Ice Hockey',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
      available: true
    },
    {
      id: 'cycling',
      name: 'Cycling',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
      available: true
    },
    {
      id: 'swimming',
      name: 'Swimming',
      image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=300&h=200&fit=crop',
      available: true
    },
    {
      id: 'coming-soon',
      name: 'Coming Soon',
      image: null,
      available: false
    }
  ];

  const handleSportSelect = (sportId: string) => {
    if (sportId === 'coming-soon') return;
    setSelectedSport(sportId);
    // Add any additional logic for sport selection here
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 sticky top-0 z-50 bg-black/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Tips Moto</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={onBackToHome}
                className="text-gray-300 hover:text-orange-500 transition-colors"
              >
                Home
              </button>
              <span className="text-orange-500 transition-colors">Tips</span>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="outline" size="sm" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white bg-transparent transition-all duration-300">
                Sign In
              </Button>
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                Get Started
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBackToAdmin}
                className="text-gray-400 hover:text-gray-200"
              >
                Admin
              </Button>
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

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800 bg-black">
            <div className="px-4 py-4 space-y-3">
              <button 
                onClick={() => {
                  onBackToHome();
                  setMobileMenuOpen(false);
                }}
                className="block text-gray-300 hover:text-orange-500 transition-colors text-left"
              >
                Home
              </button>
              <span className="block text-orange-500 transition-colors text-left">Tips</span>
              <div className="pt-3 border-t border-gray-800 space-y-2">
                <Button variant="outline" size="sm" className="w-full border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white bg-transparent transition-all duration-300">Sign In</Button>
                <Button size="sm" className="w-full bg-orange-500 hover:bg-orange-600 text-white">Get Started</Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onBackToAdmin}
                  className="w-full text-gray-400"
                >
                  Admin Panel
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                Choose a Sport
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Select your preferred sport to get premium betting tips and insights from our expert analysts.
            </p>
          </div>

          {/* Sports Grid - Image-Focused Cards with Gloss Effect */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {sports.map((sport) => (
              <button
                key={sport.id}
                onClick={() => handleSportSelect(sport.id)}
                disabled={!sport.available}
                className={`
                  group relative aspect-[3/4] rounded-2xl overflow-hidden transition-all duration-300
                  ${sport.available 
                    ? 'hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20 cursor-pointer' 
                    : 'cursor-not-allowed opacity-60'
                  }
                  ${selectedSport === sport.id ? 'ring-2 ring-orange-500 scale-105' : ''}
                `}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  {sport.image ? (
                    <ImageWithFallback
                      src={sport.image}
                      alt={sport.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      <div className="text-4xl opacity-30">🏃</div>
                    </div>
                  )}
                </div>

                {/* Gloss effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-30"></div>
                
                {/* Hover gloss enhancement */}
                <div className={`
                  absolute inset-0 bg-gradient-to-t from-orange-500/40 via-orange-500/10 to-transparent 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300
                  ${sport.available ? '' : 'hidden'}
                `}></div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  {/* Selection indicator */}
                  {selectedSport === sport.id && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                      <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                    </div>
                  )}

                  {/* Sport Name */}
                  <h3 className="text-white font-bold text-sm mb-1 text-center relative z-10 drop-shadow-lg">
                    {sport.name}
                  </h3>
                  
                  {/* Status Indicator */}
                  <div className="flex items-center justify-center">
                    {sport.available ? (
                      <div className="flex items-center space-x-1.5 bg-green-500/20 backdrop-blur-sm rounded-full px-2 py-1">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-400 text-xs font-medium">Available</span>
                      </div>
                    ) : (
                      <div className="bg-gray-500/20 backdrop-blur-sm rounded-full px-2 py-1">
                        <span className="text-gray-400 text-xs font-medium">Coming Soon</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Border highlight on selection */}
                {selectedSport === sport.id && (
                  <div className="absolute inset-0 border-2 border-orange-500 rounded-2xl"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white">
        <div className="pt-12 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
              
              {/* Brand Section - 2 columns */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      Tips Moto
                    </h2>
                    <p className="text-xs text-orange-400 uppercase tracking-wide">Expert Predictions</p>
                  </div>
                </div>
                
                <p className="text-gray-300 leading-relaxed max-w-sm">
                  Transform your betting experience with Kenya's most trusted sports prediction platform. Join thousands who've improved their success rates.
                </p>
                
                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-gray-300">
                    <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <Phone className="h-4 w-4 text-orange-400" />
                    </div>
                    <span className="text-sm">+254 712 345 678</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-300">
                    <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <Mail className="h-4 w-4 text-orange-400" />
                    </div>
                    <span className="text-sm">info@tipsmoto.com</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-300">
                    <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-orange-400" />
                    </div>
                    <span className="text-sm">Nairobi, Kenya</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold border-b border-orange-500/30 pb-2">Platform</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm flex items-center group">
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Home
                  </a></li>
                  <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm flex items-center group">
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Today's Tips
                  </a></li>
                  <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm flex items-center group">
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Premium Packages
                  </a></li>
                  <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm flex items-center group">
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Yesterday's Winners
                  </a></li>
                </ul>
              </div>

              {/* Resources */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold border-b border-orange-500/30 pb-2">Resources</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm flex items-center group">
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Help Center
                  </a></li>
                  <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm flex items-center group">
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Betting Guide
                  </a></li>
                  <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm flex items-center group">
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    FAQ
                  </a></li>
                </ul>
              </div>

              {/* Legal */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold border-b border-orange-500/30 pb-2">Legal</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm flex items-center group">
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Privacy Policy
                  </a></li>
                  <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm flex items-center group">
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Terms of Service
                  </a></li>
                  <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm flex items-center group">
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Responsible Gambling
                  </a></li>
                  <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm flex items-center group">
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Contact Support
                  </a></li>
                </ul>
              </div>
            </div>

            {/* Newsletter Section */}
            <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/60 backdrop-blur-sm rounded-3xl p-6 lg:p-8 border border-gray-700/50 mb-8 relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-full blur-2xl"></div>
              
              <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-8">
                  <h3 className="text-xl font-bold text-white mb-2">Get Daily Free Tips</h3>
                  <p className="text-gray-400 text-sm">Subscribe to receive 3 free expert tips every day + exclusive betting insights.</p>
                </div>
                <div className="lg:col-span-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <input 
                        type="email" 
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors text-sm"
                      />
                    </div>
                    <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-orange-500/25 text-sm whitespace-nowrap">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col lg:flex-row justify-between items-center pt-8 border-t border-gray-800/50">
              <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-8 text-gray-400 text-sm">
                <p>© 2025 Tips Moto. All rights reserved.</p>
                <div className="flex items-center space-x-6">
                  <span className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Live Support 24/7</span>
                  </span>
                  <span>|</span>
                  <span>Designed for Kenya</span>
                </div>
              </div>
              
              {/* Social Links & Stats */}
              <div className="flex items-center space-x-6 mt-4 lg:mt-0">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-orange-400 font-bold text-sm">90%+</div>
                    <div className="text-xs text-gray-500">Accuracy</div>
                  </div>
                  <div className="w-px h-8 bg-gray-700"></div>
                  <div className="text-center">
                    <div className="text-orange-400 font-bold text-sm">5K+</div>
                    <div className="text-xs text-gray-500">Members</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-800/80 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 rounded-lg flex items-center justify-center transition-all duration-300 cursor-pointer group">
                    <Instagram className="h-3 w-3 text-gray-400 group-hover:text-white" />
                  </div>
                  <div className="w-8 h-8 bg-gray-800/80 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 rounded-lg flex items-center justify-center transition-all duration-300 cursor-pointer group">
                    <Facebook className="h-3 w-3 text-gray-400 group-hover:text-white" />
                  </div>
                  <div className="w-8 h-8 bg-gray-800/80 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 rounded-lg flex items-center justify-center transition-all duration-300 cursor-pointer group">
                    <MessageCircle className="h-3 w-3 text-gray-400 group-hover:text-white" />
                  </div>
                  <div className="w-8 h-8 bg-gray-800/80 hover:bg-gradient-to-r hover:from-gray-900 hover:to-black rounded-lg flex items-center justify-center transition-all duration-300 cursor-pointer group">
                    <Twitter className="h-3 w-3 text-gray-400 group-hover:text-white" />
                  </div>
                  <div className="w-8 h-8 bg-gray-800/80 hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 rounded-lg flex items-center justify-center transition-all duration-300 cursor-pointer group">
                    <Send className="h-3 w-3 text-gray-400 group-hover:text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
