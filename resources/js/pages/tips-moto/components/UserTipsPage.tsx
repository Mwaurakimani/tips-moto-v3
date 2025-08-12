import { 
  CircleDot,
  Car,
  Target,
  Circle,
  Sword,
  Zap,
  Shield,
  Bike,
  Waves,
  Timer
} from 'lucide-react';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SportPackagesPage } from './SportPackagesPage';
import { UserHeader } from './UserHeader';
import { UserFooter } from './UserFooter';

interface UserTipsPageProps {
  onBackToHome: () => void;
  onBackToAdmin?: () => void;
  onNavigateAbout?: () => void;
  onSignIn?: () => void;
  onGetStarted?: () => void;
}

export function UserTipsPage({ onBackToHome, onBackToAdmin, onNavigateAbout, onSignIn, onGetStarted }: UserTipsPageProps) {
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [showSportPage, setShowSportPage] = useState(false);

  // Ensure page starts at top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sports = [
    {
      id: 'football',
      name: 'Football',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=300&h=200&fit=crop',
      available: true,
      icon: <CircleDot className="h-6 w-6" />
    },
    {
      id: 'formula-one',
      name: 'Formula One',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
      available: true,
      icon: <Car className="h-6 w-6" />
    },
    {
      id: 'basketball',
      name: 'Basketball',
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&h=200&fit=crop',
      available: true,
      icon: <Target className="h-6 w-6" />
    },
    {
      id: 'tennis',
      name: 'Tennis',
      image: 'https://images.unsplash.com/photo-1530915365347-e35b725eb22a?w=300&h=200&fit=crop',
      available: true,
      icon: <Circle className="h-6 w-6" />
    },
    {
      id: 'mma',
      name: 'MMA (UFC)',
      image: 'https://images.unsplash.com/photo-1544717684-82d67456bbf0?w=300&h=200&fit=crop',
      available: true,
      icon: <Sword className="h-6 w-6" />
    },
    {
      id: 'cricket',
      name: 'Cricket',
      image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=300&h=200&fit=crop',
      available: true,
      icon: <Zap className="h-6 w-6" />
    },
    {
      id: 'ice-hockey',
      name: 'Ice Hockey',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
      available: true,
      icon: <Shield className="h-6 w-6" />
    },
    {
      id: 'cycling',
      name: 'Cycling',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
      available: true,
      icon: <Bike className="h-6 w-6" />
    },
    {
      id: 'swimming',
      name: 'Swimming',
      image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=300&h=200&fit=crop',
      available: true,
      icon: <Waves className="h-6 w-6" />
    },
    {
      id: 'coming-soon',
      name: 'Coming Soon',
      image: null,
      available: false,
      icon: <Timer className="h-6 w-6" />
    }
  ];

  const handleSportSelect = (sportId: string) => {
    if (sportId === 'coming-soon') return;
    setSelectedSport(sportId);
    setShowSportPage(true);
  };

  const handleBackToSports = () => {
    setShowSportPage(false);
    setSelectedSport(null);
    window.scrollTo(0, 0);
  };

  // Show sport packages page if a sport is selected
  if (showSportPage && selectedSport) {
    const sport = sports.find(s => s.id === selectedSport);
    return (
      <SportPackagesPage
        sportId={selectedSport}
        sportName={sport?.name || ''}
        onBackToSports={handleBackToSports}
        onBackToHome={onBackToHome}
        onBackToAdmin={onBackToAdmin}
        onBackToTips={handleBackToSports}
        onSignIn={onSignIn}
        onGetStarted={onGetStarted}
        onNavigateAbout={onNavigateAbout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <UserHeader 
        currentPage="tips"
        onNavigateHome={onBackToHome}
        onNavigateTips={() => {}}
        onNavigateAbout={onNavigateAbout || (() => {})}
        onBackToAdmin={onBackToAdmin}
        onSignIn={onSignIn}
        onGetStarted={onGetStarted}
      />

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
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 max-w-7xl mx-auto">
            {sports.map((sport) => (
              <button
                key={sport.id}
                onClick={() => handleSportSelect(sport.id)}
                disabled={!sport.available}
                className={`
                  group relative aspect-[4/3] rounded-xl overflow-hidden transition-all duration-300
                  ${sport.available 
                    ? 'hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20 cursor-pointer' 
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
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900"></div>
                  )}
                </div>

                {/* Light Orange Overlay with Blur Effect */}
                <div className="absolute inset-0 bg-orange-500/30 backdrop-blur-[2px]"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                
                {/* Hover enhancement */}
                <div className={`
                  absolute inset-0 bg-orange-500/20 backdrop-blur-[1px]
                  opacity-0 group-hover:opacity-100 transition-all duration-300
                  ${sport.available ? '' : 'hidden'}
                `}></div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                  {/* Selection indicator */}
                  {selectedSport === sport.id && (
                    <div className="absolute top-2 right-2 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                  )}

                  {/* Sport Icon - Prominent Display */}
                  <div className="mb-2 p-2 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg">
                    <div className="text-white">
                      {sport.icon}
                    </div>
                  </div>

                  {/* Sport Name */}
                  <h3 className="text-white font-semibold text-xs mb-2 text-center relative z-10 drop-shadow-lg">
                    {sport.name}
                  </h3>
                  
                  {/* Status Indicator */}
                  <div className="flex items-center justify-center">
                    {sport.available ? (
                      <div className="flex items-center space-x-1 bg-green-500/30 backdrop-blur-sm rounded-full px-1.5 py-0.5 border border-green-400/30">
                        <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-100 text-xs font-medium">Available</span>
                      </div>
                    ) : (
                      <div className="bg-gray-500/30 backdrop-blur-sm rounded-full px-1.5 py-0.5 border border-gray-400/30">
                        <span className="text-gray-200 text-xs font-medium">Coming Soon</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Border highlight on selection */}
                {selectedSport === sport.id && (
                  <div className="absolute inset-0 border-2 border-orange-500 rounded-xl"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <UserFooter 
        onNavigateHome={onBackToHome}
        onNavigateTips={() => {}}
      />
    </div>
  );
}
