import {
  TrendingUp,
  Target,
  DollarSign,
  Trophy,
  Clock,
  Package,
  CheckCircle,
  XCircle,
  Crown,
  Zap,
  Flame,
  BarChart3,
  ArrowUp,
  Play,
  Users,
  Activity,
  Percent,
  Award
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { useState, useEffect } from 'react';

interface UserDashboardOverviewProps {
  currentUser: any;
  allMatches: any[];
}

export function UserDashboardOverview({ currentUser, allMatches }: UserDashboardOverviewProps) {
  const [animatedWinRate, setAnimatedWinRate] = useState(0);
  const [animatedTips, setAnimatedTips] = useState(0);
  const [animatedSpent, setAnimatedSpent] = useState(0);

  // Provide default values for missing user properties
  const userWithDefaults = {
    winRate: 76,
    tipsAccessed: 142,
    totalSpent: 15750,
    subscriptionTier: 'Premium',
    subscriptionStatus: 'active',
    subscriptionExpiry: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days from now
    totalEarnings: 47250,
    profitMargin: 199.4,
    currentStreak: 8,
    bestStreak: 15,
    ...currentUser
  };

  // Animate numbers on mount
  useEffect(() => {
    const animateValue = (start: number, end: number, duration: number, setter: (value: number) => void) => {
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setter(Math.round(start + (end - start) * easeOutQuart));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    };

    // Stagger animations
    setTimeout(() => animateValue(0, userWithDefaults.winRate, 1500, setAnimatedWinRate), 200);
    setTimeout(() => animateValue(0, userWithDefaults.tipsAccessed, 1500, setAnimatedTips), 400);
    setTimeout(() => animateValue(0, userWithDefaults.totalSpent, 1500, setAnimatedSpent), 600);
  }, [userWithDefaults.winRate, userWithDefaults.tipsAccessed, userWithDefaults.totalSpent]);

  // Calculate stats from user data and matches
  const getTodaysFreeTips = () => {
    const todayDateString = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });

    const todayMatches = allMatches.filter(match => match.date === todayDateString);
    const freeTips: any[] = [];

    todayMatches.forEach(match => {
      match.tipsData?.forEach((tip: any) => {
        if (tip.free) {
          freeTips.push({
            match: `${match.homeTeam} vs ${match.awayTeam}`,
            league: match.league,
            time: match.time,
            tip: tip.prediction,
            odds: '1.75',
            confidence: tip.riskLevel === 'low' ? 'High' : tip.riskLevel === 'mid' ? 'Medium' : 'Low'
          });
        }
      });
    });

    return freeTips.slice(0, 3);
  };

  // Mock user activity data
  const recentActivity = [
    {
      type: 'tip_access',
      description: 'Accessed VIP Football Tips',
      time: '2 hours ago',
      status: 'success'
    },
    {
      type: 'package_purchase',
      description: 'Purchased Weekend Accumulator Package',
      time: '1 day ago',
      status: 'success'
    },
    {
      type: 'tip_win',
      description: 'Winning tip: Manchester United vs Liverpool',
      time: '2 days ago',
      status: 'success'
    },
    {
      type: 'tip_loss',
      description: 'Lost tip: Arsenal vs Chelsea',
      time: '3 days ago',
      status: 'failed'
    }
  ];

  const todaysFreeTips = getTodaysFreeTips();

  // Calculate subscription progress
  const subscriptionExpiry = new Date(userWithDefaults.subscriptionExpiry);
  const now = new Date();
  const totalDays = 30; // Assume 30-day subscription
  const daysLeft = Math.max(0, Math.ceil((subscriptionExpiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  const progressPercentage = ((totalDays - daysLeft) / totalDays) * 100;

  // Get current time of day for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8 pb-20 xl:pb-6">
      {/* Hero Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 rounded-3xl p-6 lg:p-8 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold">
                  {getGreeting()}, {userWithDefaults.name?.split(' ')[0] || 'Champion'}! 🏆
                </h1>
                <p className="text-orange-100 lg:text-lg">
                  Ready to turn today's insights into winning bets?
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <Flame className="h-5 w-5 text-yellow-300" />
                  <span className="font-medium">
                    {userWithDefaults.currentStreak || 8} Win Streak
                  </span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <Trophy className="h-5 w-5 text-yellow-300" />
                  <span className="font-medium">
                    {animatedWinRate}% Win Rate
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 lg:mt-0 lg:text-right">
              <div className="space-y-2">
                <p className="text-orange-100 text-sm">This Month's Profit</p>
                <div className="text-3xl lg:text-4xl font-bold">
                  +KES {(userWithDefaults.totalEarnings || 47250).toLocaleString()}
                </div>
                <div className="flex items-center justify-end space-x-1 text-green-300">
                  <ArrowUp className="h-4 w-4" />
                  <span className="text-sm font-medium">+{userWithDefaults.profitMargin || 199.4}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden border-none bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full blur-2xl"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Win Rate</CardTitle>
            <div className="p-2 bg-green-500/20 rounded-full">
              <Trophy className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700 dark:text-green-300">{animatedWinRate}%</div>
            <div className="flex items-center space-x-1 mt-1">
              <ArrowUp className="h-3 w-3 text-green-600" />
              <p className="text-xs text-green-600 font-medium">+2.5% from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-none bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full blur-2xl"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Tips Accessed</CardTitle>
            <div className="p-2 bg-blue-500/20 rounded-full">
              <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">{animatedTips}</div>
            <div className="flex items-center space-x-1 mt-1">
              <ArrowUp className="h-3 w-3 text-blue-600" />
              <p className="text-xs text-blue-600 font-medium">+12 this week</p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-none bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-2xl"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Investment</CardTitle>
            <div className="p-2 bg-orange-500/20 rounded-full">
              <DollarSign className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-700 dark:text-orange-300">KES {animatedSpent.toLocaleString()}</div>
            <p className="text-xs text-orange-600 font-medium mt-1">Total invested</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-none bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/50 dark:to-violet-950/50">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-full blur-2xl"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Subscription</CardTitle>
            <div className="p-2 bg-purple-500/20 rounded-full">
              <Crown className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">{daysLeft} days</div>
            <p className="text-xs text-purple-600 font-medium mt-1">{userWithDefaults.subscriptionTier} remaining</p>
          </CardContent>
        </Card>
      </div>

      {/* Live Betting Opportunities & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Live Opportunities */}
        <Card className="lg:col-span-3 border-none shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <div className="p-2 bg-red-500/20 rounded-full">
                  <Play className="h-5 w-5 text-red-500" />
                </div>
                <span>Live Betting Opportunities</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <Badge className="bg-red-500 text-white">LIVE</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {todaysFreeTips.length > 0 ? (
              <div className="space-y-4">
                {todaysFreeTips.map((tip, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-gray-50 to-orange-50 dark:from-gray-800 dark:to-orange-950/30 rounded-xl border border-orange-200/50 dark:border-orange-800/50 hover:shadow-md transition-all duration-300">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white">{tip.match}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {tip.league}
                          </Badge>
                          <span className="text-xs text-gray-500">• {tip.time}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          tip.confidence === 'High' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          tip.confidence === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {tip.confidence} Confidence
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Prediction:</span>
                        <span className="font-semibold text-orange-600 dark:text-orange-400">{tip.tip}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-lg">{tip.odds}</span>
                        <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3">
                  <Target className="h-4 w-4 mr-2" />
                  View All Premium Tips
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">No Live Tips Available</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Check back soon or browse our premium packages
                </p>
                <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50">
                  Browse Premium Tips
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Analytics */}
        <Card className="lg:col-span-2 border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="p-2 bg-blue-500/20 rounded-full">
                <BarChart3 className="h-5 w-5 text-blue-500" />
              </div>
              <span>Performance Analytics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Subscription Status */}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Crown className="h-5 w-5 text-purple-600" />
                  <span className="font-semibold text-purple-900 dark:text-purple-100">{userWithDefaults.subscriptionTier} Plan</span>
                </div>
                <Badge className={`${
                  userWithDefaults.subscriptionStatus === 'active'
                    ? 'bg-green-500'
                    : 'bg-red-500'
                } text-white`}>
                  {userWithDefaults.subscriptionStatus.toUpperCase()}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-purple-700 dark:text-purple-300">Days Remaining</span>
                  <span className="font-medium text-purple-900 dark:text-purple-100">{daysLeft} days</span>
                </div>
                <Progress value={100 - progressPercentage} className="h-2" />
              </div>

              <div className="flex space-x-2 mt-4">
                <Button size="sm" className="bg-purple-500 hover:bg-purple-600 text-white flex-1">
                  Renew
                </Button>
                <Button size="sm" variant="outline" className="border-purple-500 text-purple-500 flex-1">
                  Upgrade
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500/20 rounded-full">
                    <Award className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">Best Streak</p>
                    <p className="text-xs text-green-600 dark:text-green-400">Personal record</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-green-700 dark:text-green-300">{userWithDefaults.bestStreak || 15}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-500/20 rounded-full">
                    <Percent className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-orange-900 dark:text-orange-100">ROI</p>
                    <p className="text-xs text-orange-600 dark:text-orange-400">Return on investment</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-orange-700 dark:text-orange-300">+{userWithDefaults.profitMargin || 199}%</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500/20 rounded-full">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Rank</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">Among users</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-blue-700 dark:text-blue-300">Top 5%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="p-2 bg-green-500/20 rounded-full">
                <Activity className="h-5 w-5 text-green-500" />
              </div>
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <div className={`p-2 rounded-full ${
                    activity.status === 'success'
                      ? 'bg-green-500/20 text-green-600'
                      : 'bg-red-500/20 text-red-600'
                  }`}>
                    {activity.status === 'success' ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white">{activity.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activity.status === 'success'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {activity.status === 'success' ? 'Success' : 'Failed'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="p-2 bg-purple-500/20 rounded-full">
                <Zap className="h-5 w-5 text-purple-500" />
              </div>
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
              <Package className="h-4 w-4 mr-2" />
              Browse New Packages
            </Button>
            <Button className="w-full justify-start" variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20">
              <Target className="h-4 w-4 mr-2" />
              View Today's Premium Tips
            </Button>
            <Button className="w-full justify-start" variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20">
              <TrendingUp className="h-4 w-4 mr-2" />
              Check Yesterday's Results
            </Button>
            <Button className="w-full justify-start" variant="outline" className="border-purple-500 text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/20">
              <Crown className="h-4 w-4 mr-2" />
              Upgrade Subscription
            </Button>

            {/* Special Kenyan Features */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium">🇰🇪 KENYAN SPECIALS</p>
              <Button className="w-full justify-start text-xs" variant="outline" className="border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20">
                <Trophy className="h-3 w-3 mr-2" />
                KPL Match Tips
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
