import HomeLayout from '@/layouts/HomeLayout/HomeLayout.jsx';
import { UserHeader } from '@/pages/tips-moto/components/UserHeader.jsx';
import { ImageWithFallback } from '@/pages/tips-moto/components/figma/ImageWithFallback.js';
import { Head, router } from '@inertiajs/react';
import { Bike, Car, Circle, CircleDot, Shield, Sword, Target, Timer, Waves, Zap } from 'lucide-react';
import { useState } from 'react';
import { SportPackagesPage } from '@/pages/tips-moto/components/SportPackagesPage.js';
import { UserFooter } from '@/pages/tips-moto/components/UserFooter.js';

export default function Tips() {
    console.clear();
    const [selectedSport, setSelectedSport] = useState(null);
    const [showSportPage, setShowSportPage] = useState(false);

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

    const handleSportSelect = (sportId) => {
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
                onBackToSports={() => router.visit(route('tips'))}
                onBackToHome={() => router.visit(route('home'))}
                onBackToAdmin={() => router.visit(route('home'))}
                onBackToTips={() => router.visit(route('tips'))}
                onSignIn={() => {}}
                onGetStarted={() => {}}
                onNavigateAbout={() => {}}
            />
        );
    }

    return (
        <>
            <Head title="Tips" />
            <div className="min-h-screen bg-black">
                {/* Header */}
                <UserHeader currentPage="tips" />

                {/* Main Content */}
                <main className="relative">
                    <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
                        <div className="mb-16 text-center">
                            <h1 className="mb-8 text-4xl font-bold lg:text-6xl">
                                <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                                    Choose a Sport
                                </span>
                            </h1>

                            <p className="mx-auto mb-12 max-w-2xl text-xl text-gray-400">
                                Select your preferred sport to get premium betting tips and insights from our expert analysts.
                            </p>
                        </div>

                        {/* Sports Grid - Image-Focused Cards with Gloss Effect */}
                        <div className="mx-auto grid max-w-7xl grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
                            {sports.map((sport) => (
                                <button
                                    key={sport.id}
                                    onClick={() => handleSportSelect(sport.id)}
                                    disabled={!sport.available}
                                    className={`group relative aspect-[4/3] overflow-hidden rounded-xl transition-all duration-300 ${
                                        sport.available
                                            ? 'cursor-pointer hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20'
                                            : 'cursor-not-allowed opacity-60'
                                    } ${selectedSport === sport.id ? 'scale-105 ring-2 ring-orange-500' : ''} `}
                                >
                                    {/* Background Image */}
                                    <div className="absolute inset-0">
                                        {sport.image ? (
                                            <ImageWithFallback src={sport.image} alt={sport.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full bg-gradient-to-br from-gray-800 to-gray-900"></div>
                                        )}
                                    </div>

                                    {/* Light Orange Overlay with Blur Effect */}
                                    <div className="absolute inset-0 bg-orange-500/30 backdrop-blur-[2px]"></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                                    {/* Hover enhancement */}
                                    <div
                                        className={`absolute inset-0 bg-orange-500/20 opacity-0 backdrop-blur-[1px] transition-all duration-300 group-hover:opacity-100 ${sport.available ? '' : 'hidden'} `}
                                    ></div>

                                    {/* Content */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                                        {/* Selection indicator */}
                                        {selectedSport === sport.id && (
                                            <div className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 shadow-lg">
                                                <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                                            </div>
                                        )}

                                        {/* Sport Icon - Prominent Display */}
                                        <div className="mb-2 rounded-xl bg-white/20 p-2 shadow-lg backdrop-blur-sm">
                                            <div className="text-white">{sport.icon}</div>
                                        </div>

                                        {/* Sport Name */}
                                        <h3 className="relative z-10 mb-2 text-center text-xs font-semibold text-white drop-shadow-lg">
                                            {sport.name}
                                        </h3>

                                        {/* Status Indicator */}
                                        <div className="flex items-center justify-center">
                                            {sport.available ? (
                                                <div className="flex items-center space-x-1 rounded-full border border-green-400/30 bg-green-500/30 px-1.5 py-0.5 backdrop-blur-sm">
                                                    <div className="h-1 w-1 animate-pulse rounded-full bg-green-400"></div>
                                                    <span className="text-xs font-medium text-green-100">Available</span>
                                                </div>
                                            ) : (
                                                <div className="rounded-full border border-gray-400/30 bg-gray-500/30 px-1.5 py-0.5 backdrop-blur-sm">
                                                    <span className="text-xs font-medium text-gray-200">Coming Soon</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Border highlight on selection */}
                                    {selectedSport === sport.id && <div className="absolute inset-0 rounded-xl border-2 border-orange-500"></div>}
                                </button>
                            ))}
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <UserFooter />
            </div>
        </>
    );
}

Tips.layout = (page) => <HomeLayout>{page}</HomeLayout>;
