import { useState, useEffect, useRef } from 'react';
import { UserTipsPage } from './UserTipsPage';
import { UserAboutPage } from './UserAboutPage';
import { UserHeader } from './UserHeader';
import { UserFooter } from './UserFooter';
import { HeroSection } from './sections/HeroSection';
import { FeaturesVisualContent } from './sections/FeaturesVisualContent';
import { stats, features, testimonials } from './constants/homepage-data';
import { fetchAndProcessTodaysFreeTips, getYesterdaysWinningTips } from './utils/homepage-utils';

// Import remaining icons and components for other sections
import {
  TrendingUp,
  Shield,
  Users,
  Trophy,
  Star,
  ArrowRight,
  Target,
  BarChart3,
  Clock,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Zap,
  Award,
  Calendar,
  Instagram,
  Facebook,
  MessageCircle,
  Twitter,
  Send,
  Crown,
  Calculator,
  DollarSign,
  Percent,
  TrendingUp as TrendingUpIcon
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Slider } from './ui/slider';
import { Label } from './ui/label';

interface UserHomepageProps {
  onBackToAdmin: () => void;
  allMatches?: any[];
  onUserSignIn?: () => void;
  onUserGetStarted?: () => void;
}

export function UserHomepage({ onBackToAdmin, allMatches = [], onUserSignIn, onUserGetStarted }: UserHomepageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [activeFeature, setActiveFeature] = useState(0);
  const featuresRef = useRef<HTMLDivElement>(null);

  // Calculator state
  const [betAmount, setBetAmount] = useState([500]); // KES
  const [tipsPerWeek, setTipsPerWeek] = useState([10]);
  const [timeFrame, setTimeFrame] = useState([12]); // months
  const [freeTips, setFreeTips] = useState<[]>([]);

  const yesterdaysWinningTips = getYesterdaysWinningTips(allMatches);

  useEffect(() => {
    let on = true; // cleanup guard
    (async () => {
      try {
        const fetched = await fetchAndProcessTodaysFreeTips();
        if (on) setFreeTips(fetched);       // ✅ set with fetched result
      } catch (err) {
        console.error('Failed to load free tips', err);
        if (on) setFreeTips([]);            // fallback
      }
    })();
    return () => { on = false; };
  }, []);
  // Calculate profit projection
  const calculateProfit = () => {
    const avgSuccessRate = 0.88; // 88% success rate
    const avgOdds = 1.75; // Average odds
    const totalTips = tipsPerWeek[0] * 4.33 * timeFrame[0]; // Tips per week * weeks per month * months
    const successfulTips = Math.floor(totalTips * avgSuccessRate);
    const failedTips = totalTips - successfulTips;

    const totalWinnings = successfulTips * betAmount[0] * (avgOdds - 1);
    const totalLosses = failedTips * betAmount[0];
    const netProfit = totalWinnings - totalLosses;
    const totalInvestment = totalTips * betAmount[0];
    const roi = ((netProfit / totalInvestment) * 100);

    return {
      totalTips,
      successfulTips,
      totalWinnings: Math.round(totalWinnings),
      totalLosses: Math.round(totalLosses),
      netProfit: Math.round(netProfit),
      totalInvestment: Math.round(totalInvestment),
      roi: Math.round(roi * 10) / 10 // Round to 1 decimal
    };
  };

  const calculations = calculateProfit();

  // Handle sign in button click
  const handleSignIn = () => {
    if (onUserSignIn) {
      onUserSignIn();
    }
  };

  // Handle get started button click
  const handleGetStarted = () => {
    if (onUserGetStarted) {
      onUserGetStarted();
    }
  };

  // Handle view tips button click
  const handleViewTips = () => {
    // Navigate to the tips page within homepage
    setCurrentPage('blank');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Ensure page starts at top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Scroll detection for features section
  useEffect(() => {
    const handleScroll = () => {
      if (!featuresRef.current || typeof window === 'undefined') return;

      const section = featuresRef.current;
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const scrollY = window.scrollY + window.innerHeight / 2;

      const featureHeight = sectionHeight / features.length;
      const activeIndex = Math.floor((scrollY - sectionTop) / featureHeight);
      const boundedIndex = Math.max(0, Math.min(features.length - 1, activeIndex));

      if (boundedIndex !== activeFeature) {
        setActiveFeature(boundedIndex);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [activeFeature, features.length]);

  // Show tips page if selected
  if (currentPage === 'blank') {
    return <UserTipsPage
      onBackToHome={() => {
        setCurrentPage('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      onBackToAdmin={onBackToAdmin}
      onNavigateAbout={() => setCurrentPage('about')}
      onSignIn={handleSignIn}
      onGetStarted={handleGetStarted}
    />;
  }

  // Show about page if selected
  if (currentPage === 'about') {
    return (
      <UserAboutPage
        onBackToHome={() => {
          setCurrentPage('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateToTips={() => {
          setCurrentPage('blank');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onBackToAdmin={onBackToAdmin}
        onSignIn={handleSignIn}
        onGetStarted={handleGetStarted}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <UserHeader
        currentPage="home"
        onNavigateHome={() => {
          setCurrentPage('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateTips={() => setCurrentPage('blank')}
        onNavigateAbout={() => setCurrentPage('about')}
        onBackToAdmin={onBackToAdmin}
        onSignIn={handleSignIn}
        onGetStarted={handleGetStarted}
      />

       {/*Hero Section*/}
      <HeroSection
        featuredTips={freeTips}
        todaysFreeTips={freeTips}
        onSignIn={handleSignIn}
        onGetStarted={handleGetStarted}
        onViewTips={handleViewTips}
      />

      {/* Stats Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Profit Calculator Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-orange-500/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Calculator className="h-4 w-4 text-orange-400" />
              <span className="text-orange-400 font-medium">Profit Calculator</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                See Your Potential Earnings
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Calculate how much you could earn using our expert tips consistently. Based on our proven 88% accuracy rate.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Calculator Controls */}
            <div className="space-y-8">
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50">
                <h3 className="text-2xl font-bold text-white mb-8">Customize Your Parameters</h3>

                {/* Bet Amount Slider */}
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center">
                    <Label className="text-gray-300">Bet Amount per Tip</Label>
                    <span className="text-orange-400 font-bold">KES {betAmount[0].toLocaleString()}</span>
                  </div>
                  <Slider
                    value={betAmount}
                    onValueChange={setBetAmount}
                    max={5000}
                    min={50}
                    step={50}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>KES 50</span>
                    <span>KES 5,000</span>
                  </div>
                </div>

                {/* Tips Per Week Slider */}
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center">
                    <Label className="text-gray-300">Tips Per Week</Label>
                    <span className="text-orange-400 font-bold">{tipsPerWeek[0]} tips</span>
                  </div>
                  <Slider
                    value={tipsPerWeek}
                    onValueChange={setTipsPerWeek}
                    max={50}
                    min={5}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>5 tips</span>
                    <span>50 tips</span>
                  </div>
                </div>

                {/* Time Frame Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-gray-300">Time Frame</Label>
                    <span className="text-orange-400 font-bold">{timeFrame[0]} months</span>
                  </div>
                  <Slider
                    value={timeFrame}
                    onValueChange={setTimeFrame}
                    max={24}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>1 month</span>
                    <span>24 months</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Display */}
            <div className="space-y-6">
              {/* Main Result Card */}
              <Card className="bg-gradient-to-r from-orange-500/20 via-red-500/20 to-orange-600/20 border-orange-500/30 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUpIcon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Projected Net Profit</h3>
                    <div className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                      KES {calculations.netProfit > 0 ? '+' : ''}{calculations.netProfit.toLocaleString()}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-black/30 rounded-xl p-4">
                      <div className="text-green-400 font-bold text-xl">{calculations.roi}%</div>
                      <div className="text-gray-400 text-sm">ROI</div>
                    </div>
                    <div className="bg-black/30 rounded-xl p-4">
                      <div className="text-white font-bold text-xl">{calculations.successfulTips}</div>
                      <div className="text-gray-400 text-sm">Winning Tips</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="bg-gray-900/50 border-gray-700/50">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <DollarSign className="h-5 w-5 text-green-400" />
                      <h4 className="font-semibold text-white">Total Winnings</h4>
                    </div>
                    <div className="text-2xl font-bold text-green-400">
                      KES {calculations.totalWinnings.toLocaleString()}
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      From {calculations.successfulTips} successful tips
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/50 border-gray-700/50">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <Target className="h-5 w-5 text-orange-400" />
                      <h4 className="font-semibold text-white">Success Rate</h4>
                    </div>
                    <div className="text-2xl font-bold text-orange-400">88%</div>
                    <p className="text-sm text-gray-400 mt-1">
                      Our proven accuracy rate
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/50 border-gray-700/50">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <BarChart3 className="h-5 w-5 text-blue-400" />
                      <h4 className="font-semibold text-white">Total Investment</h4>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      KES {calculations.totalInvestment.toLocaleString()}
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      Across {calculations.totalTips} tips
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/50 border-gray-700/50">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <Award className="h-5 w-5 text-purple-400" />
                      <h4 className="font-semibold text-white">Profit Margin</h4>
                    </div>
                    <div className="text-2xl font-bold text-purple-400">
                      {Math.round((calculations.netProfit / calculations.totalInvestment) * 100)}%
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      Return on investment
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Disclaimer */}
              <div className="bg-gray-900/30 border border-gray-700/50 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-400">
                    <p className="font-medium text-white mb-2">Important Disclaimer</p>
                    <p>
                      These calculations are projections based on historical performance and are not guaranteed.
                      Past performance does not guarantee future results. Please bet responsibly and only with money you can afford to lose.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 text-lg rounded-xl shadow-lg shadow-orange-500/25"
              >
                Start Earning With Our Tips
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        ref={featuresRef}
        className="bg-black features-section"
        style={{
          '--features-count': features.length
        } as React.CSSProperties}
      >
        <div className="sticky top-0 h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

              {/* Left Side - Text Content */}
              <div className="space-y-6 lg:space-y-8">
                <div className="mb-8 lg:mb-12">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 lg:mb-6">
                    Why <span className="text-orange-500">Punters</span> Choose Us
                  </h2>
                  <p className="text-lg lg:text-xl text-gray-500">
                    {activeFeature + 1} of {features.length}
                  </p>
                </div>

                <div className="space-y-4 lg:space-y-6">
                  <div
                    key={activeFeature}
                    className="transition-all duration-700 ease-out"
                    style={{
                      opacity: 1,
                      transform: 'translateY(0px)'
                    }}
                  >
                    <div className="flex items-center space-x-3 lg:space-x-4 mb-4 lg:mb-6">
                      <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-orange-500 via-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                        {(() => {
                          const IconComponent = features[activeFeature].icon;
                          return IconComponent ? <IconComponent className="h-8 w-8 text-white" /> : null;
                        })()}
                      </div>
                      <div className="w-16 lg:w-20 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                    </div>

                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">
                      {features[activeFeature].title}
                    </h3>

                    <p className="text-base lg:text-xl text-gray-400 leading-relaxed max-w-lg">
                      {features[activeFeature].description}
                    </p>
                  </div>
                </div>

                {/* Progress Indicators */}
                <div className="flex space-x-3 pt-6 lg:pt-8">
                  {features.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 rounded-full transition-all duration-500 ${
                        index === activeFeature
                          ? 'w-12 bg-gradient-to-r from-orange-500 to-red-500 shadow-sm shadow-orange-500/50'
                          : 'w-8 bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Right Side - Enhanced Visual Content */}
              <div className="relative">
                <FeaturesVisualContent
                  activeFeature={activeFeature}
                  features={features}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Yesterday's Winners Section */}
      {yesterdaysWinningTips.length > 0 && (
        <section className="py-16 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Yesterday's Winners</h2>
              <p className="text-gray-400">See the winning tips from yesterday's matches</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {yesterdaysWinningTips.slice(0, 8).map((tip, index) => (
                <Card key={index} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <Badge className="bg-green-500 text-white text-xs">WON</Badge>
                    </div>
                    <h4 className="text-white font-semibold text-sm mb-1">{tip.match}</h4>
                    <p className="text-gray-400 text-xs mb-2">{tip.league}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-orange-400 font-medium text-sm">{tip.tip}</span>
                      <span className="text-white font-bold">{tip.odds}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">What Our Members Say</h2>
            <p className="text-gray-400">Join thousands of satisfied bettors</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4 italic">"{testimonial.comment}"</p>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-orange-500 text-white">
                        {testimonial.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-white font-semibold">{testimonial.name}</p>
                      <p className="text-gray-400 text-sm">{testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Winning?</h2>
          <p className="text-xl text-orange-100 mb-8">
            Join over 5,000 successful bettors and start your winning journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="bg-white text-orange-500 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-2xl"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setCurrentPage('about')}
              className="border-2 border-white text-white hover:bg-white hover:text-orange-500 px-8 py-4 text-lg rounded-2xl"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <UserFooter
        onNavigateHome={() => {
          setCurrentPage('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateTips={() => setCurrentPage('blank')}
      />
    </div>
  );
}
