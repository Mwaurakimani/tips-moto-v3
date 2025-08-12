import { 
  TrendingUp, 
  BarChart3, 
  Target, 
  Clock, 
  Trophy,
  Users,
  CheckCircle,
  Star,
  MessageCircle,
  Phone,
  Calendar
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';

interface FeaturesVisualContentProps {
  activeFeature: number;
  features: any[];
}

export function FeaturesVisualContent({ activeFeature, features }: FeaturesVisualContentProps) {
  // State for animated chart data (Data Insights feature)
  const [chartBars, setChartBars] = useState([0, 0, 0, 0, 0, 0, 0]);
  const chartTargets = [65, 72, 78, 85, 90, 88, 92];

  // Animate chart when Data Insights becomes active
  useEffect(() => {
    if (activeFeature === 1) { // Data-Driven Insights is index 1
      // Reset and animate bars with staggered timing
      setChartBars([0, 0, 0, 0, 0, 0, 0]);
      
      chartTargets.forEach((height, index) => {
        setTimeout(() => {
          setChartBars(prev => {
            const newBars = [...prev];
            newBars[index] = height;
            return newBars;
          });
        }, index * 200 + 300); // Start after 300ms, then 200ms between bars
      });
    } else {
      setChartBars([0, 0, 0, 0, 0, 0, 0]);
    }
  }, [activeFeature]);

  // Different visual content for each feature
  const renderFeatureContent = (index: number) => {
    switch (index) {
      case 0: // Expert Analysis
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-white font-semibold text-lg">Expert Analysis</h4>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs">Live Analytics</Badge>
              </div>
            </div>
            
            {/* Analytics Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 border border-gray-600/50">
                <div className="text-3xl font-bold text-orange-500">92%</div>
                <div className="text-sm text-gray-300">Accuracy</div>
                <div className="w-full bg-gray-700/50 rounded-full h-1.5 mt-2">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-yellow-400 h-1.5 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: '92%' }}
                  ></div>
                </div>
              </div>
              <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 border border-gray-600/50">
                <div className="text-3xl font-bold text-blue-400">2.3x</div>
                <div className="text-sm text-gray-300">Avg Returns</div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-500">+15%</span>
                </div>
              </div>
            </div>

            {/* Live Analysis Feed */}
            <div className="space-y-3">
              {[
                { team: 'Real Madrid vs Barcelona', confidence: '98%', time: '2m' },
                { team: 'Liverpool vs Arsenal', confidence: '87%', time: '5m' },
                { team: 'Bayern vs Dortmund', confidence: '91%', time: '8m' }
              ].map((tip, i) => (
                <div key={i} className="bg-black/30 backdrop-blur-sm rounded-xl p-3 border border-gray-600/30 hover:border-orange-500/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-white text-sm font-medium">{tip.team}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-orange-400 text-sm font-semibold">{tip.confidence}</span>
                      <span className="text-xs text-gray-400">{tip.time} ago</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 1: // Data-Driven Insights
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-white font-semibold text-lg">Data Insights</h4>
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
                <BarChart3 className="h-3 w-3 mr-1" />
                Live Data
              </Badge>
            </div>

            {/* Animated Chart Visualization */}
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 border border-gray-600/50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-300 text-sm">Win Rate Trends</span>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 text-sm">↑ 12%</span>
                </div>
              </div>
              
              {/* Animated Chart Bars */}
              <div className="flex items-end space-x-2 h-24 mb-3">
                {chartBars.map((height, i) => (
                  <div key={i} className="flex-1 relative group cursor-pointer">
                    <div 
                      className="w-full bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-sm transition-all duration-700 ease-out hover:from-orange-400 hover:to-yellow-400 hover:scale-105"
                      style={{ 
                        height: `${height}%`,
                        transformOrigin: 'bottom'
                      }}
                    >
                      {/* Subtle glow effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20 rounded-t-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    
                    {/* Animated tooltip */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                      <div className="bg-black/90 text-orange-400 text-xs font-semibold px-2 py-1 rounded border border-orange-500/30 whitespace-nowrap">
                        {chartTargets[i]}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between text-xs text-gray-500">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>

            {/* Data Points */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Leagues', value: '25+', color: 'text-blue-400' },
                { label: 'Variables', value: '150+', color: 'text-purple-400' },
                { label: 'Models', value: '12', color: 'text-green-400' }
              ].map((stat, i) => (
                <div key={i} className="text-center bg-black/20 rounded-lg p-3 border border-gray-700/50">
                  <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 2: // Proven Track Record
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-white font-semibold text-lg">Track Record</h4>
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs">
                <Trophy className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            </div>

            {/* Achievement Stats */}
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-5 border border-gray-600/50">
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-green-400 mb-1">5,000+</div>
                <div className="text-sm text-gray-300">Satisfied Members</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">127</div>
                  <div className="text-xs text-gray-400">Winning Streaks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">89%</div>
                  <div className="text-xs text-gray-400">Member Retention</div>
                </div>
              </div>
            </div>

            {/* Recent Wins */}
            <div className="space-y-2">
              <div className="text-sm text-gray-300 mb-3">Recent Success Stories</div>
              {[
                { name: 'John K.', amount: '+KES 15,400', time: '2h ago' },
                { name: 'Grace W.', amount: '+KES 8,250', time: '5h ago' },
                { name: 'Michael O.', amount: '+KES 22,100', time: '1d ago' }
              ].map((win, i) => (
                <div key={i} className="flex items-center justify-between bg-black/20 rounded-lg p-3 border border-gray-700/50">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-green-500 text-white text-xs">
                        {win.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-white text-sm">{win.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-semibold text-sm">{win.amount}</div>
                    <div className="text-xs text-gray-500">{win.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 3: // Real-Time Updates
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-white font-semibold text-lg">Real-Time Updates</h4>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <Badge className="bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs">Live Now</Badge>
              </div>
            </div>

            {/* Live Match Updates */}
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-xl p-4 border border-red-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">LIVE MATCH</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3 text-red-400" />
                    <span className="text-red-400 text-sm">67'</span>
                  </div>
                </div>
                <div className="text-sm text-gray-300 mb-3">Manchester City vs Liverpool</div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-400">Updated prediction</div>
                  <Badge className="bg-orange-500 text-white">Over 2.5 Goals</Badge>
                </div>
              </div>

              {/* Notification Feed */}
              <div className="space-y-2">
                {[
                  { type: 'tip', message: 'New VIP tip available', time: 'Just now', icon: Target },
                  { type: 'result', message: 'Arsenal vs Chelsea - Won!', time: '3m ago', icon: CheckCircle },
                  { type: 'update', message: 'Odds changed for El Clasico', time: '8m ago', icon: TrendingUp }
                ].map((notification, i) => (
                  <div key={i} className="flex items-start space-x-3 bg-black/20 rounded-lg p-3 border border-gray-700/50">
                    <div className={`p-1 rounded-full ${
                      notification.type === 'tip' ? 'bg-orange-500/20 text-orange-400' :
                      notification.type === 'result' ? 'bg-green-500/20 text-green-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      <notification.icon className="h-3 w-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm">{notification.message}</div>
                      <div className="text-xs text-gray-500">{notification.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Update Frequency */}
            <div className="bg-black/40 rounded-lg p-4 border border-gray-600/50">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">Every 30s</div>
                <div className="text-sm text-gray-300">Update Frequency</div>
              </div>
            </div>
          </div>
        );

      case 4: // High Accuracy Rate
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-white font-semibold text-lg">Accuracy Metrics</h4>
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white text-xs">
                <Star className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            </div>

            {/* Accuracy Circle */}
            <div className="relative flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="rgba(55, 65, 81, 0.3)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${90 * 3.14159} ${100 * 3.14159}`}
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ff6b35" />
                      <stop offset="100%" stopColor="#fbbf24" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-500">90%+</div>
                    <div className="text-xs text-gray-400">Accuracy</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Breakdown */}
            <div className="space-y-3">
              {[
                { league: 'Premier League', accuracy: '94%', color: 'bg-green-500' },
                { league: 'La Liga', accuracy: '91%', color: 'bg-blue-500' },
                { league: 'Bundesliga', accuracy: '88%', color: 'bg-yellow-500' },
                { league: 'Serie A', accuracy: '89%', color: 'bg-purple-500' }
              ].map((league, i) => (
                <div key={i} className="flex items-center justify-between bg-black/20 rounded-lg p-3 border border-gray-700/50">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${league.color}`}></div>
                    <span className="text-white text-sm">{league.league}</span>
                  </div>
                  <div className="text-orange-400 font-semibold">{league.accuracy}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 5: // 24/7 Support
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-white font-semibold text-lg">24/7 Support</h4>
              <Badge className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs">
                <Users className="h-3 w-3 mr-1" />
                Online Now
              </Badge>
            </div>

            {/* Support Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/40 rounded-lg p-4 border border-gray-600/50 text-center">
                <div className="text-2xl font-bold text-green-400">&lt; 2min</div>
                <div className="text-sm text-gray-300">Response Time</div>
              </div>
              <div className="bg-black/40 rounded-lg p-4 border border-gray-600/50 text-center">
                <div className="text-2xl font-bold text-blue-400">98%</div>
                <div className="text-sm text-gray-300">Satisfaction</div>
              </div>
            </div>

            {/* Support Channels */}
            <div className="space-y-3">
              <div className="text-sm text-gray-300 mb-2">Available Support Channels</div>
              {[
                { channel: 'Live Chat', status: 'online', icon: MessageCircle, agents: '5 agents' },
                { channel: 'WhatsApp', status: 'online', icon: Phone, agents: '24/7' },
                { channel: 'Email Support', status: 'online', icon: Calendar, agents: '&lt; 1hr response' }
              ].map((support, i) => (
                <div key={i} className="flex items-center justify-between bg-black/20 rounded-lg p-3 border border-gray-700/50">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <support.icon className="h-4 w-4 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">{support.channel}</div>
                      <div className="text-xs text-gray-500">{support.agents}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-400 text-xs">Online</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Action */}
            <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white">
              <MessageCircle className="h-4 w-4 mr-2" />
              Start Chat Now
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative w-full h-80 sm:h-96 lg:h-[500px]">
      {features.map((_, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-700 ease-out ${
            index === activeFeature 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl p-6 lg:p-8 border border-gray-700 shadow-2xl shadow-black/50 relative overflow-hidden">
            {/* Background glow effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-3xl"></div>
            
            <div className="relative h-full overflow-y-auto">
              {renderFeatureContent(index)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
