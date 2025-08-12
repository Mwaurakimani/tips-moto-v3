import { ArrowRight, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { heroStats, heroFeatures } from '../constants/homepage-data';

interface HeroSectionProps {
  featuredTips: any[];
  todaysFreeTips: any[];
  onSignIn: () => void;
  onGetStarted: () => void;
  onViewTips: () => void;
}

export function HeroSection({ featuredTips, todaysFreeTips, onSignIn, onGetStarted, onViewTips }: HeroSectionProps) {
  return (
    <section id="home" className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 py-12 lg:py-20 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-tr from-orange-500/10 to-red-500/10"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left side - Content */}
          <div className="space-y-8">
            {/* Stats row */}
            <div className="flex flex-wrap gap-6">
              {heroStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="flex items-center space-x-3 bg-gray-800/80 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-sm border border-gray-700">
                    <div className="p-2 bg-orange-500/20 rounded-xl text-orange-500">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Main heading */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                Win More with{' '}
                <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  Expert Tips
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-xl leading-relaxed">
                Join thousands of successful bettors who trust our expert analysis and data-driven predictions.
                Start winning consistently today.
              </p>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={onGetStarted}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={onViewTips}
                className="border-2 border-gray-600 bg-gray-700 text-white hover:bg-gray-800 hover:text-white hover:border-gray-500 transition-all duration-300 px-8 py-4 text-lg rounded-2xl"
              >
                View Today's Tips
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center space-x-6 pt-4">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Avatar key={i} className="w-8 h-8 border-2 border-gray-800">
                      <AvatarFallback className="bg-orange-500 text-white text-xs">
                        {String.fromCharCode(65 + i)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <span className="text-sm text-gray-400">5,000+ happy members</span>
              </div>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
                <span className="text-sm text-gray-400 ml-2">4.9/5 rating</span>
              </div>
            </div>
          </div>

          {/* Right side - Visual content */}
          <div className="relative">
            {/* Main visual container */}
            <div className="relative">
              {/* Background card */}
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 shadow-2xl border border-gray-800">
                {/* Mock betting interface */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between text-white">
                    <h3 className="text-xl font-bold">Today's Free Tips</h3>
                    <Badge className="bg-green-500 text-white">Live</Badge>
                  </div>

                  <div className="space-y-4">
                    {featuredTips.slice(0, 3).map((tip, index) => (
                      <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-white font-semibold">{tip.match}</p>
                            <p className="text-gray-300 text-sm">{tip.league} • {tip.time}</p>
                          </div>
                          <Badge className="bg-green-500 text-white">
                            Free
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-orange-400 font-bold">{tip.tip}</span>
                          <span className="text-white font-bold">{tip.odds}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {todaysFreeTips.length === 0 && (
                    <div className="text-center py-6">
                      <p className="text-gray-400 mb-2">No free tips available today</p>
                      <p className="text-sm text-gray-500">Check our premium packages for expert predictions</p>
                    </div>
                  )}

                  {todaysFreeTips.length > 0 && todaysFreeTips.length < 3 && (
                    <div className="text-center py-2">
                      <p className="text-xs text-gray-500">
                        {todaysFreeTips.length} of 3 free tips available today
                      </p>
                    </div>
                  )}

                  {/* Last updated indicator */}
                  {todaysFreeTips.length > 0 && (
                    <div className="text-center pt-2 border-t border-white/10">
                      <p className="text-xs text-gray-500">
                        Updated: {new Date().toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={onViewTips}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-2xl py-3"
                  >
                    {todaysFreeTips.length > 0 ? 'View Premium Tips' : 'View Premium Tips'}
                  </Button>
                </div>
              </div>

              {/* Floating feature cards */}
              <div className="absolute -right-4 top-8 space-y-4">
                {heroFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <Card key={index} className="w-64 bg-gray-800/95 backdrop-blur-sm shadow-xl border border-gray-700 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-orange-500/20 rounded-xl flex-shrink-0">
                            <Icon className="h-6 w-6 text-orange-500" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                            <p className="text-sm text-gray-400">{feature.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Success indicator */}
              <div className="absolute -left-6 bottom-12">
                <Card className="bg-green-500 text-white border-0 shadow-xl">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white/20 rounded-xl">
                        <ArrowRight className="h-6 w-6 rotate-[-45deg]" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">+187%</p>
                        <p className="text-sm opacity-90">Avg. Monthly ROI</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
