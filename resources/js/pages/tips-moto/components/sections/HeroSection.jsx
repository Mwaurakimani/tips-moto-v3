import { usePage,Link } from '@inertiajs/react';
import { ArrowRight, Star } from 'lucide-react';
import { heroFeatures, heroStats } from '../constants/homepage-data';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

export function HeroSection({ todaysFreeTips }) {
    const { user } = usePage().props.auth;

    return (
        <section id="home" className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 py-12 lg:py-20">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20"></div>
                <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-tr from-orange-500/10 to-red-500/10"></div>
            </div>

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                    {/* Left side - Content */}
                    <div className="space-y-8">
                        {/* Stats row */}
                        <div className="flex flex-wrap gap-6">
                            {heroStats.map((stat, index) => {
                                const Icon = stat.icon;
                                return (
                                    <div
                                        key={index}
                                        className="flex items-center space-x-3 rounded-2xl border border-gray-700 bg-gray-800/80 px-4 py-3 shadow-sm backdrop-blur-sm"
                                    >
                                        <div className="rounded-xl bg-orange-500/20 p-2 text-orange-500">
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
                            <h1 className="text-5xl leading-tight font-bold text-white lg:text-7xl">
                                Win More with{' '}
                                <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Expert Tips</span>
                            </h1>
                            <p className="max-w-xl text-xl leading-relaxed text-gray-300">
                                Join thousands of successful bettors who trust our expert analysis and data-driven predictions. Start winning
                                consistently today.
                            </p>
                        </div>

                        {/* CTA buttons */}
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <Button
                                className="transform rounded-2xl  bg-orange-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-orange-600 hover:shadow-xl"
                                size="lg"
                            >
                                <Link href={route('register')}
                                      className="flex items-center"
                                >
                                    Start Free Trial
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>

                            <Button
                                className="rounded-2xl border-2 border-gray-600 bg-gray-700 px-8 py-4 text-lg text-white transition-all duration-300 hover:border-gray-500 hover:bg-gray-800 hover:text-white"
                                size="lg"
                                variant="outline"
                            >
                            <Link href={route('dashboard.my-tips')}
                                className="flex items-center"
                            >
                                View Today's Tips
                            </Link>
                            </Button>
                        </div>

                        {/* Trust indicators */}
                        <div className="flex items-center space-x-6 pt-4">
                            <div className="flex items-center space-x-2">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map((i) => (
                                        <Avatar key={i} className="h-8 w-8 border-2 border-gray-800">
                                            <AvatarFallback className="bg-orange-500 text-xs text-white">
                                                {String.fromCharCode(65 + i)}
                                            </AvatarFallback>
                                        </Avatar>
                                    ))}
                                </div>
                                <span className="text-sm text-gray-400">5,000+ happy members</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                                ))}
                                <span className="ml-2 text-sm text-gray-400">4.9/5 rating</span>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Visual content */}
                    <div className="relative">
                        {/* Main visual container */}
                        <div className="relative">
                            {/* Background card */}
                            <div className="rounded-3xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black p-8 shadow-2xl">
                                {/* Mock betting interface */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between text-white">
                                        <h3 className="text-xl font-bold">Today's Free Tips</h3>
                                        <Badge className="bg-green-500 text-white">Live</Badge>
                                    </div>

                                    <div className="space-y-4">
                                        {todaysFreeTips.slice(0, 3).map((tip, index) => (
                                            <div key={index} className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                                                <div className="mb-2 flex items-start justify-between">
                                                    <div>
                                                        <p className="font-semibold text-white">
                                                            {tip.match.home_team} vs {tip.match.away_team}
                                                        </p>
                                                        <p className="text-sm text-gray-300">
                                                            {tip.match.league} • {tip.match.kickoff_at}
                                                        </p>
                                                    </div>
                                                    <Badge className="bg-green-500 text-white">Free</Badge>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    {user ? (
                                                        <span className="font-bold text-orange-400">{tip.pick_label}</span>
                                                    ) : (
                                                            <Link href={route('login')}  className={'rounded bg-orange-400 px-3 py-2 text-white'}>Log In to view</Link>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {todaysFreeTips.length === 0 && (
                                        <div className="py-6 text-center">
                                            <p className="mb-2 text-gray-400">No free tips available today</p>
                                            <p className="text-sm text-gray-500">Check our premium packages for expert predictions</p>
                                        </div>
                                    )}

                                    {todaysFreeTips.length > 0 && todaysFreeTips.length < 3 && (
                                        <div className="py-2 text-center">
                                            <p className="text-xs text-gray-500">{todaysFreeTips.length} of 3 free tips available today</p>
                                        </div>
                                    )}

                                    {/* Last updated indicator */}
                                    {todaysFreeTips.length > 0 && (
                                        <div className="border-t border-white/10 pt-2 text-center">
                                            <p className="text-xs text-gray-500">
                                                Updated:{' '}
                                                {new Date().toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: true,
                                                })}
                                            </p>
                                        </div>
                                    )}

                                    <Button
                                        // onClick={onViewTips}
                                        className="w-full rounded-2xl bg-orange-500 py-3 text-white hover:bg-orange-600"
                                    >
                                        {todaysFreeTips.length > 0 ? 'View Premium Tips' : 'View Premium Tips'}
                                    </Button>
                                </div>
                            </div>

                            {/* Floating feature cards */}
                            <div className="absolute top-8 -right-4 space-y-4">
                                {heroFeatures.map((feature, index) => {
                                    const Icon = feature.icon;
                                    return (
                                        <Card
                                            key={index}
                                            className="w-64 rotate-2 transform border border-gray-700 bg-gray-800/95 shadow-xl backdrop-blur-sm transition-transform duration-300 hover:rotate-0"
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex items-start space-x-3">
                                                    <div className="flex-shrink-0 rounded-xl bg-orange-500/20 p-2">
                                                        <Icon className="h-6 w-6 text-orange-500" />
                                                    </div>
                                                    <div>
                                                        <h4 className="mb-1 font-semibold text-white">{feature.title}</h4>
                                                        <p className="text-sm text-gray-400">{feature.description}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>

                            {/* Success indicator */}
                            <div className="absolute bottom-12 -left-6">
                                <Card className="border-0 bg-green-500 text-white shadow-xl">
                                    <CardContent className="p-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="rounded-xl bg-white/20 p-2">
                                                <ArrowRight className="h-6 w-6 rotate-[-45deg]" />
                                            </div>
                                            <div>
                                                <p className="text-lg font-bold">+187%</p>
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
