import HomeLayout from '@/layouts/HomeLayout/HomeLayout.jsx';
import { UserHeader } from '@/pages/tips-moto/components/UserHeader.jsx';
import { features, stats, testimonials } from '@/pages/tips-moto/components/constants/homepage-data.js';
import { HeroSection } from '@/pages/tips-moto/components/sections/HeroSection.jsx';
import { Button } from '@/pages/tips-moto/components/ui/button.js';
import { Card, CardContent } from '@/pages/tips-moto/components/ui/card.js';
import { Label } from '@/pages/tips-moto/components/ui/label.js';
import { Slider } from '@/pages/tips-moto/components/ui/slider.js';
import { Head, usePage } from '@inertiajs/react';
import { ArrowRight, Award, BarChart3, Calculator, DollarSign, Shield, Star, Target, TrendingUp as TrendingUpIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { fetchAndProcessTodaysFreeTips, getYesterdaysWinningTips } from '@/pages/tips-moto/components/utils/homepage-utils.js';
import { FeaturesVisualContent } from '@/pages/tips-moto/components/sections/FeaturesVisualContent.js';
import { Avatar, AvatarFallback } from '@/pages/tips-moto/components/ui/avatar.js';
import { UserFooter } from '@/pages/tips-moto/components/UserFooter.js';
import { Link } from '@inertiajs/react';

export default function Welcome() {
    console.clear();
    const { todaysFreeTips } = usePage().props;

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState('home');
    const [activeFeature, setActiveFeature] = useState(0);
    const featuresRef = useRef(null);

    // Calculator state
    const [betAmount, setBetAmount] = useState([500]); // KES
    const [tipsPerWeek, setTipsPerWeek] = useState([10]);
    const [timeFrame, setTimeFrame] = useState([12]); // months

    const yesterdaysWinningTips = getYesterdaysWinningTips([]);

    // Calculate profit projection
    const calculateProfit = () => {
        const avgSuccessRate = 0.90; // 90% success rate
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

    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-black">
                {/* Header */}
                <UserHeader currentPage="home" />

                {/*Hero Section*/}
                <HeroSection todaysFreeTips={todaysFreeTips} />

                {/* Stats Section */}
                <section className="bg-gray-900 py-16 text-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
                            {stats.map((stat, index) => (
                                <div key={index}>
                                    <div className="mb-2 text-3xl font-bold text-orange-500 md:text-4xl">{stat.value}</div>
                                    <div className="text-gray-300">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Profit Calculator Section */}
                <section className="bg-black py-20 text-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-16 text-center">
                            <div className="mb-6 inline-flex items-center space-x-2 rounded-full bg-orange-500/10 px-4 py-2 backdrop-blur-sm">
                                <Calculator className="h-4 w-4 text-orange-400" />
                                <span className="font-medium text-orange-400">Profit Calculator</span>
                            </div>
                            <h2 className="mb-6 text-4xl font-bold lg:text-5xl">
                                <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                                    See Your Potential Earnings
                                </span>
                            </h2>
                            <p className="mx-auto mb-8 max-w-3xl text-xl text-gray-400">
                                Calculate how much you could earn using our expert tips consistently. Based on our proven 90% accuracy rate.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
                            {/* Calculator Controls */}
                            <div className="space-y-8">
                                <div className="rounded-3xl border border-gray-700/50 bg-gray-900/50 p-8 backdrop-blur-sm">
                                    <h3 className="mb-8 text-2xl font-bold text-white">Customize Your Parameters</h3>

                                    {/* Bet Amount Slider */}
                                    <div className="mb-8 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-gray-300">Bet Amount per Tip</Label>
                                            <span className="font-bold text-orange-400">KES {betAmount[0].toLocaleString()}</span>
                                        </div>
                                        <Slider value={betAmount} onValueChange={setBetAmount} max={5000} min={50} step={50} className="w-full" />
                                        <div className="flex justify-between text-sm text-gray-500">
                                            <span>KES 50</span>
                                            <span>KES 5,000</span>
                                        </div>
                                    </div>

                                    {/* Tips Per Week Slider */}
                                    <div className="mb-8 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-gray-300">Tips Per Week</Label>
                                            <span className="font-bold text-orange-400">{tipsPerWeek[0]} tips</span>
                                        </div>
                                        <Slider value={tipsPerWeek} onValueChange={setTipsPerWeek} max={50} min={5} step={1} className="w-full" />
                                        <div className="flex justify-between text-sm text-gray-500">
                                            <span>5 tips</span>
                                            <span>50 tips</span>
                                        </div>
                                    </div>

                                    {/* Time Frame Slider */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-gray-300">Time Frame</Label>
                                            <span className="font-bold text-orange-400">{timeFrame[0]} months</span>
                                        </div>
                                        <Slider value={timeFrame} onValueChange={setTimeFrame} max={24} min={1} step={1} className="w-full" />
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
                                <Card className="border-orange-500/30 bg-gradient-to-r from-orange-500/20 via-red-500/20 to-orange-600/20 backdrop-blur-sm">
                                    <CardContent className="p-8 text-center">
                                        <div className="mb-6">
                                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500">
                                                <TrendingUpIcon className="h-8 w-8 text-white" />
                                            </div>
                                            <h3 className="mb-2 text-2xl font-bold text-white">Projected Net Profit</h3>
                                            <div className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-5xl font-bold text-transparent">
                                                KES {calculations.netProfit > 0 ? '+' : ''}
                                                {calculations.netProfit.toLocaleString()}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-center">
                                            <div className="rounded-xl bg-black/30 p-4">
                                                <div className="text-xl font-bold text-green-400">{calculations.roi}%</div>
                                                <div className="text-sm text-gray-400">ROI</div>
                                            </div>
                                            <div className="rounded-xl bg-black/30 p-4">
                                                <div className="text-xl font-bold text-white">{calculations.successfulTips}</div>
                                                <div className="text-sm text-gray-400">Winning Tips</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Detailed Breakdown */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <Card className="border-gray-700/50 bg-gray-900/50">
                                        <CardContent className="p-6">
                                            <div className="mb-3 flex items-center space-x-2">
                                                <DollarSign className="h-5 w-5 text-green-400" />
                                                <h4 className="font-semibold text-white">Total Winnings</h4>
                                            </div>
                                            <div className="text-2xl font-bold text-green-400">KES {calculations.totalWinnings.toLocaleString()}</div>
                                            <p className="mt-1 text-sm text-gray-400">From {calculations.successfulTips} successful tips</p>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-gray-700/50 bg-gray-900/50">
                                        <CardContent className="p-6">
                                            <div className="mb-3 flex items-center space-x-2">
                                                <Target className="h-5 w-5 text-orange-400" />
                                                <h4 className="font-semibold text-white">Success Rate</h4>
                                            </div>
                                            <div className="text-2xl font-bold text-orange-400">90%</div>
                                            <p className="mt-1 text-sm text-gray-400">Our proven accuracy rate</p>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-gray-700/50 bg-gray-900/50">
                                        <CardContent className="p-6">
                                            <div className="mb-3 flex items-center space-x-2">
                                                <BarChart3 className="h-5 w-5 text-blue-400" />
                                                <h4 className="font-semibold text-white">Total Investment</h4>
                                            </div>
                                            <div className="text-2xl font-bold text-white">KES {calculations.totalInvestment.toLocaleString()}</div>
                                            <p className="mt-1 text-sm text-gray-400">Across {calculations.totalTips} tips</p>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-gray-700/50 bg-gray-900/50">
                                        <CardContent className="p-6">
                                            <div className="mb-3 flex items-center space-x-2">
                                                <Award className="h-5 w-5 text-purple-400" />
                                                <h4 className="font-semibold text-white">Profit Margin</h4>
                                            </div>
                                            <div className="text-2xl font-bold text-purple-400">
                                                {Math.round((calculations.netProfit / calculations.totalInvestment) * 100)}%
                                            </div>
                                            <p className="mt-1 text-sm text-gray-400">Return on investment</p>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Disclaimer */}
                                <div className="rounded-xl border border-gray-700/50 bg-gray-900/30 p-6">
                                    <div className="flex items-start space-x-3">
                                        <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-400" />
                                        <div className="text-sm text-gray-400">
                                            <p className="mb-2 font-medium text-white">Important Disclaimer</p>
                                            <p>
                                                These calculations are projections based on historical performance and are not guaranteed. Past
                                                performance does not guarantee future results. Please bet responsibly and only with money you can
                                                afford to lose.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <Button
                                    size="lg"
                                    className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-red-500 py-4 text-lg font-bold text-white shadow-lg shadow-orange-500/25 hover:from-orange-600 hover:to-red-600"
                                >
                                    <Link className={"flex items-center justify-center"} href={route('register')}>
                                        Start Earning With Our Tips
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
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
                    style={{ '--features-count': features.length }}
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
                {/*{yesterdaysWinningTips.length > 0 && (*/}
                {/*  <section className="py-16 bg-gray-900">*/}
                {/*    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">*/}
                {/*      <div className="text-center mb-12">*/}
                {/*        <h2 className="text-3xl font-bold text-white mb-4">Yesterday's Winners</h2>*/}
                {/*        <p className="text-gray-400">See the winning tips from yesterday's matches</p>*/}
                {/*      </div>*/}

                {/*      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">*/}
                {/*        {yesterdaysWinningTips.slice(0, 8).map((tip, index) => (*/}
                {/*          <Card key={index} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">*/}
                {/*            <CardContent className="p-4">*/}
                {/*              <div className="flex items-center space-x-2 mb-2">*/}
                {/*                <CheckCircle className="h-4 w-4 text-green-500" />*/}
                {/*                <Badge className="bg-green-500 text-white text-xs">WON</Badge>*/}
                {/*              </div>*/}
                {/*              <h4 className="text-white font-semibold text-sm mb-1">{tip.match}</h4>*/}
                {/*              <p className="text-gray-400 text-xs mb-2">{tip.league}</p>*/}
                {/*              <div className="flex justify-between items-center">*/}
                {/*                <span className="text-orange-400 font-medium text-sm">{tip.tip}</span>*/}
                {/*                <span className="text-white font-bold">{tip.odds}</span>*/}
                {/*              </div>*/}
                {/*            </CardContent>*/}
                {/*          </Card>*/}
                {/*        ))}*/}
                {/*      </div>*/}
                {/*    </div>*/}
                {/*  </section>*/}
                {/*)}*/}

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
                                className="bg-white text-orange-500 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-2xl"
                            >
                                <Link href={route('register')} className="flex items-center justify-center w-full">
                                    Get Started Now
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-2 border-white text-white hover:bg-white hover:text-orange-500 px-8 py-4 text-lg rounded-2xl"
                            >
                                <Link href={route('about-us')}>
                                    Learn More
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <UserFooter />

            </div>
        </>
    );
}

Welcome.layout = (page) => <HomeLayout>{page}</HomeLayout>;
