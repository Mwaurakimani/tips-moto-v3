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
import { Link } from '@inertiajs/react';

interface UserDashboardOverviewProps {
    currentUser: any;
    allMatches: any[];
    todayFreeTipsMessage?: string;
}

export function UserDashboardOverview({ currentUser, allMatches, todayFreeTipsMessage = '' }: UserDashboardOverviewProps) {
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

        if (allMatches && allMatches.length > 0) {
            return allMatches.map(tip => ({
                match: `${tip.match.home_team} vs ${tip.match.away_team}`,
                league: tip.match.league,
                time: tip.match.kickoff_at,
                tip: tip.prediction_value,
                odds: tip.odds || '',
                pick_label:tip.pick_label,
                confidence: tip.confidence || (
                    tip.risk_level === 'low' ? 'High' :
                        tip.risk_level === 'mid' ? 'Medium' : 'Low'
                )
            })).slice(0, 3);
        } else {
            return [];
        }
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


    const QuickActionTab = () => {
        return (
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
                    <Button
                        className="w-full justify-start bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                        <Package className="h-4 w-4 mr-2" />
                        Browse New Packages
                    </Button>
                    <Button variant="outline"
                            className="w-full justify-start border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20">
                        <Target className="h-4 w-4 mr-2" />
                        View Today's Premium Tips
                    </Button>
                    <Button variant="outline"
                            className="w-full justify-start border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Check Yesterday's Results
                    </Button>
                    <Button variant="outline"
                            className="w-full justify-start border-purple-500 text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/20">
                        <Crown className="h-4 w-4 mr-2" />
                        Upgrade Subscription
                    </Button>

                    {/* Special Kenyan Features */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium">🇰🇪 KENYAN SPECIALS</p>
                        <Button variant="outline"
                                className=" w-full justify-start text-xsborder-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20">
                            <Trophy className="h-3 w-3 mr-2" />
                            KPL Match Tips
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    };


    return (
        <div className="space-y-8 pb-20 xl:pb-6">
            {/* Hero Welcome Section */}
            <div
                className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 rounded-3xl p-6 lg:p-8 text-white">
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

                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Stats Cards */}

            {/* Live Betting Opportunities & Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Live Opportunities */}
                <Card className="lg:col-span-2 border-none shadow-lg">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center space-x-2">
                                <div className="p-2 bg-red-500/20 rounded-full">
                                    <Play className="h-5 w-5 text-red-500" />
                                </div>
                                <span>Free Bets</span>
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {todaysFreeTips.length > 0 ? (
                            <div className="space-y-4">
                                {todayFreeTipsMessage === '' ? (
                                    <>
                                        {todaysFreeTips.map((tip, index) => (
                                            <div key={index}
                                                 className="p-4 bg-gradient-to-r from-gray-50 to-orange-50 dark:from-gray-800 dark:to-orange-950/30 rounded-xl border border-orange-200/50 dark:border-orange-800/50 hover:shadow-md transition-all duration-300">
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
                                                        <span
                                                            className="text-sm text-gray-600 dark:text-gray-400">Prediction:</span>
                                                        <span
                                                            className="font-semibold text-orange-600 dark:text-orange-400">{tip.pick_label}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        {/*<span className="font-bold text-lg">{tip.odds}</span>*/}
                                                        {/*<Button size="sm" className="bg-orange-500 hover:bg-orange-600">*/}
                                                        {/*    View Details*/}
                                                        {/*</Button>*/}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <Button
                                            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3">
                                            <Target className="h-4 w-4 mr-2" />
                                            <Link href={route('dashboard.packages')}>
                                                View All Premium Tips
                                            </Link>
                                        </Button>
                                    </>
                                ) : todayFreeTipsMessage === 'Log in to view' ? (
                                    <div className="text-center py-8">
                                        <div
                                            className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Clock className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">View Today's Free Tips</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                            Log in to access today's free betting tips
                                        </p>
                                        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                                            <Link href={route('login')}>
                                                {todayFreeTipsMessage}
                                            </Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div
                                            className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Crown className="h-8 w-8 text-orange-400" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Upgrade to View Tips</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                            {todayFreeTipsMessage}
                                        </p>
                                        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                                            <Link href={route('dashboard.packages')}>
                                                Browse Premium Packages
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div
                                    className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Clock className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">No Live Tips
                                    Available</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                    Check back soon or browse our premium packages
                                </p>
                                <Button variant="outline"
                                        className="border-orange-500 text-orange-500 hover:bg-orange-50">
                                    <Link href={route('dashboard.packages')}>
                                        Browse Premium Tips
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
                {/*<QuickActionTab></QuickActionTab>*/}
            </div>
        </div>
    );
}



