import {
    ArrowLeft,
    ArrowRight,
    Crown,
    Zap,
    CheckCircle,
    Star,
    Clock,
    Target,
    Shield,
    Send, MessageCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { UserHeader } from './UserHeader';
import { UserFooter } from './UserFooter';
import { router } from '@inertiajs/react';

interface SportPackagesPageProps {
  sportId: string;
  sportName: string;
  onBackToSports: () => void;
  onBackToHome: () => void;
  onBackToAdmin?: () => void;
  onBackToTips: () => void;
  onSignIn?: () => void;
  onGetStarted?: () => void;
  onNavigateAbout?: () => void;
}

export function SportPackagesPage({ sportId, sportName, onBackToSports, onBackToHome, onBackToAdmin, onBackToTips, onSignIn, onGetStarted, onNavigateAbout }: SportPackagesPageProps) {

  // Ensure page starts at top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Football packages data (from admin subscriptions page)
  const footballPackages = [
    {
      id: 1435,
      name: 'Full-Time Scores Daily',
      description: 'Professional match outcome predictions',
      price: 'KES 99',
      originalPrice: 'KES 149',
      duration: 'Daily',
      tips: '15 Tips',
      accuracy: '90%+',
      features: [
        'Home/Away/Draw predictions',
        'Double chance selections',
        'Professional match analysis',
        'Risk level indicators',
        '24/7 Customer support'
      ],
      popular: false,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 1436,
      name: 'Full-Time Scores Weekly',
      description: 'Complete weekly match predictions',
      price: 'KES 599',
      originalPrice: 'KES 899',
      duration: 'Weekly',
      tips: '17 Tips/Day',
      accuracy: '90%+',
      features: [
        'Daily professional predictions',
        'Multiple leagues coverage',
        'Home/Away/Draw analysis',
        'Double chance options',
        'Risk assessment reports',
        'Telegram VIP group access',
        'Priority customer support'
      ],
      popular: true,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 1437,
      name: 'Over & Under Markets Daily',
      description: 'Goal-based market predictions',
      price: 'KES 29',
      originalPrice: 'KES 49',
      duration: 'Daily',
      tips: '5 Tips',
      accuracy: '86%+',
      features: [
        'Over/Under 1.5 goals',
        'Over/Under 2.5 goals',
        'Over/Under 3.5 goals',
        'Goal market analysis',
        'Low risk selections'
      ],
      popular: false,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 1438,
      name: 'Over & Under Markets Weekly',
      description: 'Weekly goal market coverage',
      price: 'KES 199',
      originalPrice: 'KES 299',
      duration: 'Weekly',
      tips: '7 Tips/Day',
      accuracy: '90%+',
      features: [
        'Daily goal predictions',
        'Multiple over/under markets',
        'Statistical analysis',
        'Form-based selections',
        'WhatsApp support',
        'Weekly performance reports'
      ],
      popular: false,
      color: 'from-teal-500 to-teal-600'
    },
    {
      id: 1439,
      name: 'Mega Jackpot Prediction',
      description: 'Multi-fixture jackpot tips',
      price: 'KES 49',
      originalPrice: 'KES 79',
      duration: 'Weekly',
      tips: '15 Fixtures',
      accuracy: '85%+',
      features: [
        '15-fixture jackpot tips',
        'Multiple outcome analysis',
        'Risk-balanced selections',
        'Jackpot-specific strategy',
        'Historical performance data'
      ],
      popular: false,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 1440,
      name: 'Daily Jackpot Premium',
      description: 'Daily multi-bet jackpot tips',
      price: 'KES 39',
      originalPrice: 'KES 59',
      duration: 'Daily',
      tips: '13 Fixtures',
      accuracy: '87%+',
      features: [
        '13-fixture daily jackpot',
        'Professional analysis',
        'Multi-bet strategy',
        'Fixture-specific tips',
        'Daily performance tracking'
      ],
      popular: false,
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      id: 1443,
      name: 'Both Teams Score Daily',
      description: 'BTTS specialized predictions',
      price: 'KES 39',
      originalPrice: 'KES 59',
      duration: 'Daily',
      tips: '8 Tips',
      accuracy: '89%+',
      features: [
        'Both teams to score tips',
        'Goal/No Goal analysis',
        'Team scoring patterns',
        'Defensive analysis',
        'High accuracy selections'
      ],
      popular: false,
      color: 'from-red-500 to-red-600'
    },
    {
      id: 1444,
      name: 'Goal Goal/No Goal Weekly',
      description: 'Weekly BTTS comprehensive package',
      price: 'KES 149',
      originalPrice: 'KES 229',
      duration: 'Weekly',
      tips: '10 Tips/Day',
      accuracy: '91%+',
      features: [
        'Daily BTTS predictions',
        'GG/NG market analysis',
        'Team form assessment',
        'Scoring statistics',
        'Weekly strategy reports',
        'Telegram group access'
      ],
      popular: false,
      color: 'from-pink-500 to-pink-600'
    },
    {
      id: 1447,
      name: 'Weekend Accumulator',
      description: 'High-value weekend acca tips',
      price: 'KES 199',
      originalPrice: 'KES 299',
      duration: 'Weekly',
      tips: '15 Tips',
      accuracy: '84%+',
      features: [
        'Weekend accumulator bets',
        'High-value selections',
        'Multi-league coverage',
        'Accumulator strategy',
        'Risk management advice',
        'Premium analysis reports'
      ],
      popular: true,
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const renderFootballPackages = () => (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 bg-orange-500/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
          <Target className="h-4 w-4 text-orange-400" />
          <span className="text-orange-400 font-medium">Football Betting Packages</span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold mb-6">
          <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
            Choose Your Winning Plan
          </span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
          Get access to our expert football predictions and start winning with Kenya's most trusted betting tips platform.
        </p>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">90%+</div>
            <div className="text-sm text-gray-400">Average Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">{footballPackages.length}</div>
            <div className="text-sm text-gray-400">Package Options</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">24/7</div>
            <div className="text-sm text-gray-400">Support Available</div>
          </div>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {footballPackages.map((pkg) => (
          <Card key={pkg.id} className={`relative border-2 hover:border-orange-500/50 transition-all duration-300 hover:scale-105 bg-gray-900/50 backdrop-blur-sm ${pkg.popular ? 'border-orange-500/30' : 'border-gray-700/50'}`}>
            {pkg.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full">
                  <Crown className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pb-4">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${pkg.color} flex items-center justify-center`}>
                <Shield className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl text-white">{pkg.name}</CardTitle>
              <CardDescription className="text-gray-400">{pkg.description}</CardDescription>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-3xl font-bold text-white">{pkg.price}</span>
                  <span className="text-lg text-gray-500 line-through">{pkg.originalPrice}</span>
                </div>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {pkg.duration}
                  </span>
                  <span className="flex items-center">
                    <Zap className="h-3 w-3 mr-1" />
                    {pkg.tips}
                  </span>
                  <span className="flex items-center">
                    <Star className="h-3 w-3 mr-1" />
                    {pkg.accuracy}
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-3">
                {pkg.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <Button onClick={() => router.get(route('dashboard.packages'))} className={`w-full bg-gradient-to-r ${pkg.color} hover:opacity-90 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg`}>
                Select {pkg.name}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>


            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Info */}
      <div className="text-center bg-gradient-to-r from-gray-900/80 to-gray-800/60 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50">
        <h3 className="text-xl font-bold text-white mb-4">Why Choose Tips Moto Football?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto">
              <Target className="h-6 w-6 text-orange-400" />
            </div>
            <h4 className="font-semibold text-white">Diverse Package Options</h4>
            <p className="text-gray-400">From daily tips to weekly jackpots, we offer specialized packages for every betting strategy and budget.</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto">
              <Shield className="h-6 w-6 text-orange-400" />
            </div>
            <h4 className="font-semibold text-white">Proven Track Record</h4>
            <p className="text-gray-400">90%+ accuracy rate across all our packages with thousands of satisfied customers and documented winning streaks.</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto">
              <MessageCircle className="h-6 w-6 text-orange-400" />
            </div>
            <h4 className="font-semibold text-white">Expert Analysis</h4>
            <p className="text-gray-400">Professional analysts specializing in different markets - from match outcomes to goal predictions and jackpots.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderComingSoon = () => (
    <div className="text-center space-y-8">
      <div className="space-y-6">
        <div className="w-24 h-24 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full flex items-center justify-center mx-auto">
          <Clock className="h-12 w-12 text-gray-300" />
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold">
          <span className="bg-gradient-to-r from-gray-400 to-gray-500 bg-clip-text text-transparent">
            {sportName} Tips Coming Soon
          </span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          We're working hard to bring you expert {sportName.toLowerCase()} predictions and betting tips. Stay tuned for updates!
        </p>
      </div>

      <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/60 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50 max-w-2xl mx-auto">
        <h3 className="text-xl font-bold text-white mb-4">Be the First to Know</h3>
        <p className="text-gray-400 mb-6">
          Subscribe to get notified when {sportName.toLowerCase()} betting packages become available. We'll send you exclusive early access offers!
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Enter your email address"
            className="flex-1 px-4 py-3 bg-black/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
          />
          <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300">
            Notify Me
            <Send className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      <div className="text-center">
        <p className="text-gray-400 mb-4">In the meantime, check out our football betting packages!</p>
        <Button
          onClick={onBackToSports}
          variant="outline"
          className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
        >
          Browse Football Tips
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <UserHeader
        currentPage="tips"
        onNavigateHome={() => {
          onBackToHome();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateTips={onBackToTips}
        onNavigateAbout={onNavigateAbout || (() => {})}
        onBackToAdmin={onBackToAdmin}
        onSignIn={onSignIn}
        onGetStarted={onGetStarted}
      />

      {/* Main Content */}
      <main className="relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          {/* Back Button */}
          <div className="mb-8">
            <Button
              onClick={onBackToSports}
              variant="ghost"
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sports
            </Button>
          </div>

          {/* Content */}
          {sportId === 'football' ? renderFootballPackages() : renderComingSoon()}
        </div>
      </main>

      {/* Footer */}
      <UserFooter
        onNavigateHome={() => {
          onBackToHome();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateTips={onBackToTips}
      />
    </div>
  );
}
