import { router } from '@inertiajs/react';
import axios from 'axios';
import { Menu, TrendingUp, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';

export function UserHeader({ currentPage, onNavigateHome, onNavigateTips, onNavigateAbout, onBackToAdmin, onSignIn, onGetStarted }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [authUser, setAuthUser] = useState(null);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);

    const handleHomeClick = () => {
        onNavigateHome();
        if (currentPage === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const navigateToDashboard = () => {
        router.visit(route('dashboard'));
    };

    useEffect(() => {
        const successCallback = (resp) => setAuthUser(resp.data.user);
        const failedCallback = () => setAuthUser(null);
        const finalCallback = () => setIsLoadingAuth(false);

        const fetchAuthUser = async (successCallback, failedCallback, finalCallback) => {
            try {
                const res = await axios.get(route('api_me'));
                successCallback(res);
            } catch (err) {
                failedCallback();
            } finally {
                finalCallback();
            }
        };

        fetchAuthUser(successCallback, failedCallback, finalCallback);
    }, []);

    const CtaButtons = () => {
        if (isLoadingAuth) {
            return (
                <>
                    <div className="hidden items-center space-x-4 md:flex"></div>
                </>
            );
        } else {
            if (authUser == null) {
                return (
                    <div className="hidden items-center space-x-4 md:flex">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onSignIn}
                            className="border-orange-500 bg-transparent text-orange-500 transition-all duration-300 hover:bg-orange-500 hover:text-white"
                        >
                            Sign In
                        </Button>
                        <Button size="sm" onClick={onGetStarted} className="bg-orange-500 text-white hover:bg-orange-600">
                            Get Started
                        </Button>
                        {/*{onBackToAdmin && (*/}
                        {/*    <Button variant="ghost" size="sm" onClick={onBackToAdmin} className="text-gray-400 hover:text-gray-200">*/}
                        {/*        Admin*/}
                        {/*    </Button>*/}
                        {/*)}*/}
                    </div>
                );
            } else {
                return (
                    <div className="hidden items-center space-x-4 md:flex">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={navigateToDashboard}
                            className="border-orange-500 bg-transparent text-orange-500 transition-all duration-300 hover:bg-orange-500 hover:text-white"
                        >
                            Dashboard
                        </Button>
                    </div>
                );
            }
        }
    };

    const MobileCtaButtons = () => {
        if (isLoadingAuth) {
            return <div className="hidden items-center space-x-4 md:flex"></div>;
        } else {
            if (authUser == null) {
                return (
                    <div className="space-y-2 border-t border-gray-800 pt-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                onSignIn?.();
                                setMobileMenuOpen(false);
                            }}
                            className="w-full border-orange-500 bg-transparent text-orange-500 transition-all duration-300 hover:bg-orange-500 hover:text-white"
                        >
                            Sign In
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => {
                                onGetStarted?.();
                                setMobileMenuOpen(false);
                            }}
                            className="w-full bg-orange-500 text-white hover:bg-orange-600"
                        >
                            Get Started
                        </Button>
                        {onBackToAdmin && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    onBackToAdmin();
                                    setMobileMenuOpen(false);
                                }}
                                className="w-full text-gray-400"
                            >
                                Admin Panel
                            </Button>
                        )}
                    </div>
                );
            } else {
                return (
                    <div className="space-y-2 border-t border-gray-800 pt-3">
                        <Button
                            size="sm"
                            onClick={() => {
                                navigateToDashboard()
                            }}
                            className="w-full bg-orange-500 text-white hover:bg-orange-600"
                        >
                            Dashboard
                        </Button>
                    </div>
                );
            }
        }
    };

    return (
        <nav className="sticky top-0 z-50 border-b border-gray-800 bg-black/90 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <div className="flex cursor-pointer items-center space-x-2" onClick={handleHomeClick}>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-red-500">
                                <TrendingUp className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">Tips Moto</span>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center space-x-8 md:flex">
                        <button
                            onClick={handleHomeClick}
                            className={`transition-colors ${currentPage === 'home' ? 'text-orange-500' : 'text-gray-300 hover:text-orange-500'}`}
                        >
                            Home
                        </button>
                        <button
                            onClick={onNavigateTips}
                            className={`transition-colors ${currentPage === 'tips' ? 'text-orange-500' : 'text-gray-300 hover:text-orange-500'}`}
                        >
                            Tips
                        </button>
                        <button
                            onClick={onNavigateAbout}
                            className={`transition-colors ${currentPage === 'about' ? 'text-orange-500' : 'text-gray-300 hover:text-orange-500'}`}
                        >
                            About Us
                        </button>
                    </div>

                    <CtaButtons></CtaButtons>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-300">
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="border-t border-gray-800 bg-black/95 backdrop-blur-md md:hidden">
                    <div className="space-y-3 px-4 py-4">
                        <button
                            onClick={() => {
                                handleHomeClick();
                                setMobileMenuOpen(false);
                            }}
                            className={`block text-left transition-colors ${
                                currentPage === 'home' ? 'text-orange-500' : 'text-gray-300 hover:text-orange-500'
                            }`}
                        >
                            Home
                        </button>
                        <button
                            onClick={() => {
                                onNavigateTips();
                                setMobileMenuOpen(false);
                            }}
                            className={`block text-left transition-colors ${
                                currentPage === 'tips' ? 'text-orange-500' : 'text-gray-300 hover:text-orange-500'
                            }`}
                        >
                            Tips
                        </button>
                        <button
                            onClick={() => {
                                onNavigateAbout();
                                setMobileMenuOpen(false);
                            }}
                            className={`block text-left transition-colors ${
                                currentPage === 'about' ? 'text-orange-500' : 'text-gray-300 hover:text-orange-500'
                            }`}
                        >
                            About Us
                        </button>
                        <MobileCtaButtons></MobileCtaButtons>
                    </div>
                </div>
            )}
        </nav>
    );
}
