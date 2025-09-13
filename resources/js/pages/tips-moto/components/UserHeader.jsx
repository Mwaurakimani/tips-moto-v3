import { Link, usePage } from '@inertiajs/react';
import { Menu, TrendingUp, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

export function UserHeader({ currentPage }) {
    const { user } = usePage().props.auth;

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const CtaButtons = () => {
        if (user == null) {
            return (
                <div className="hidden items-center space-x-4 md:flex">
                    <Button
                        href={route('home')}
                        variant="outline"
                        size="sm"
                        className="border-orange-500 bg-transparent text-orange-500 transition-all duration-300 hover:bg-orange-500 hover:text-white"
                        // onClick={onSignIn}
                    >
                        <Link href={route('login')} className="">
                            Sign In
                        </Link>
                    </Button>
                    <Button
                        size="sm"
                        className="bg-orange-500 text-white hover:bg-orange-600"
                        // onClick={onGetStarted}
                    >
                        <Link href={route('register')} className="">
                            Get Started
                        </Link>
                    </Button>
                </div>
            );
        } else {
            return (
                <div className="hidden items-center space-x-4 md:flex">
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-orange-500 bg-transparent text-orange-500 transition-all duration-300 hover:bg-orange-500 hover:text-white"
                        // onClick={navigateToDashboard}
                    >
                        <Link href={route('login')} className="">
                            Dashboard
                        </Link>
                    </Button>
                </div>
            );
        }
    };

    const MobileCtaButtons = () => {
        if (user == null) {
            return (
                <div className="space-y-2 border-t border-gray-800 pt-3">
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-orange-500 bg-transparent text-orange-500 transition-all duration-300 hover:bg-orange-500 hover:text-white"
                    >
                        <Link href={route('login')} className="">
                            Sign In
                        </Link>
                    </Button>
                    <Button size="sm" className="w-full bg-orange-500 text-white hover:bg-orange-600">
                        <Link href={route('register')} className="">
                            Get Started
                        </Link>
                    </Button>
                </div>
            );
        } else {
            return (
                <div className="space-y-2 border-t border-gray-800 pt-3">
                    <Button size="sm" className="w-full bg-orange-500 text-white hover:bg-orange-600">
                        <Link href={route('login')} className="">
                            Dashboard
                        </Link>
                    </Button>
                </div>
            );
        }
    };

    const DesktopNavigation = () => {
        return (
            <div className="hidden items-center space-x-8 md:flex">
                <Link
                    href={route('home')}
                    className={`transition-colors ${currentPage === 'home' ? 'text-orange-500' : 'text-gray-300 hover:text-orange-500'}`}
                >
                    Home
                </Link>
                <Link
                    href={route('tips')}
                    // onClick={onNavigateTips}
                    className={`transition-colors ${currentPage === 'tips' ? 'text-orange-500' : 'text-gray-300 hover:text-orange-500'}`}
                >
                    Tips
                </Link>
                <Link
                    href={route('about-us')}
                    // onClick={onNavigateAbout}
                    className={`transition-colors ${currentPage === 'about-us' ? 'text-orange-500' : 'text-gray-300 hover:text-orange-500'}`}
                >
                    About Us
                </Link>
            </div>
        );
    };

    const DesktopLogoDisplay = () => {
        return (
            <div className="flex items-center">
                <div className="flex cursor-pointer items-center space-x-2">
                    <Link href={route('home')} className="text-xl font-bold text-white">
                        <div className="flex h-15 w-15 items-center justify-center rounded-lg">
                            <img src="/storage/system/logo_light.png" alt="" className={'h-full w-full object-contain'} />
                        </div>
                    </Link>
                </div>
            </div>
        );
    };

    const MobileMenuButton = () => {
        return (
            <div className="md:hidden">
                <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-300">
                    {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
            </div>
        );
    };

    const MobileNavigation = () => {
        return (
            <div className="border-t border-gray-800 bg-black/95 backdrop-blur-md md:hidden">
                <div className="space-y-3 px-4 py-4">
                    <Link
                        href={route('home')}
                        className={`block text-left transition-colors ${
                            currentPage === 'home' ? 'text-orange-500' : 'text-gray-300 hover:text-orange-500'
                        }`}
                    >
                        Home
                    </Link>
                    <Link
                        href={route('tips')}
                        className={`block text-left transition-colors ${
                            currentPage === 'tips' ? 'text-orange-500' : 'text-gray-300 hover:text-orange-500'
                        }`}
                    >
                        Tips
                    </Link>
                    <Link
                        href={route('about-us')}
                        className={`block text-left transition-colors ${
                            currentPage === 'about' ? 'text-orange-500' : 'text-gray-300 hover:text-orange-500'
                        }`}
                    >
                        About Us
                    </Link>
                    <MobileCtaButtons></MobileCtaButtons>
                </div>
            </div>
        );
    };

    return (
        <nav className="sticky top-0 z-50 border-b border-gray-800 bg-black/90 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <DesktopLogoDisplay></DesktopLogoDisplay>

                    {/* Desktop Navigation */}
                    <DesktopNavigation></DesktopNavigation>

                    {/* Call to actions */}
                    <CtaButtons></CtaButtons>

                    {/* Mobile menu button */}
                    <MobileMenuButton></MobileMenuButton>
                </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && <MobileNavigation></MobileNavigation>}
        </nav>
    );
}
