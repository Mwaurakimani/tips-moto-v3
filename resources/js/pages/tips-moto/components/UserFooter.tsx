import { ArrowRight, Facebook, Instagram, Mail, MapPin, MessageCircle, Phone, Send, TrendingUp, Twitter } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Link } from '@inertiajs/react';

export function UserFooter() {
    return (
        <footer className="bg-black text-white">
            <div className="pt-12 pb-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Main Footer Content */}
                    <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-12">
                        {/* Brand Section - 2 columns */}
                        <div className="space-y-6 lg:col-span-2">
                            <div className="flex items-center space-x-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 shadow-lg shadow-orange-500/25">
                                    <TrendingUp className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-2xl font-bold text-transparent">
                                        Tips Moto
                                    </h2>
                                    <p className="text-xs tracking-wide text-orange-400 uppercase">Expert Predictions</p>
                                </div>
                            </div>

                            <p className="max-w-sm leading-relaxed text-gray-300">
                                Transform your betting experience with Kenya's most trusted sports prediction platform. Join thousands who've improved
                                their success rates.
                            </p>

                            {/* Contact Info */}
                            {/*<div className="space-y-3">*/}
                            {/*    <div className="flex items-center space-x-3 text-gray-300">*/}
                            {/*        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/20">*/}
                            {/*            <Phone className="h-4 w-4 text-orange-400" />*/}
                            {/*        </div>*/}
                            {/*        <span className="text-sm">+254 712 345 678</span>*/}
                            {/*    </div>*/}
                            {/*    <div className="flex items-center space-x-3 text-gray-300">*/}
                            {/*        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/20">*/}
                            {/*            <Mail className="h-4 w-4 text-orange-400" />*/}
                            {/*        </div>*/}
                            {/*        <span className="text-sm">info@tipsmoto.com</span>*/}
                            {/*    </div>*/}
                            {/*    <div className="flex items-center space-x-3 text-gray-300">*/}
                            {/*        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/20">*/}
                            {/*            <MapPin className="h-4 w-4 text-orange-400" />*/}
                            {/*        </div>*/}
                            {/*        <span className="text-sm">Nairobi, Kenya</span>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                        </div>

                        {/* Quick Links */}
                        <div className="space-y-4">
                            <h3 className="border-b border-orange-500/30 pb-2 font-semibold text-white">Platform</h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link href={route('home')} className="group flex items-center text-sm text-gray-400 transition-colors hover:text-orange-400">
                                        <ArrowRight className="mr-2 h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route('tips')} className="group flex items-center text-sm text-gray-400 transition-colors hover:text-orange-400">
                                        <ArrowRight className="mr-2 h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                                        Today's Tips
                                    </Link>
                                </li>
                                <li>
                                    <a href="#" className="group flex items-center text-sm text-gray-400 transition-colors hover:text-orange-400">
                                        <ArrowRight className="mr-2 h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                                        Premium Packages
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="group flex items-center text-sm text-gray-400 transition-colors hover:text-orange-400">
                                        <ArrowRight className="mr-2 h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                                        Yesterday's Winners
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Resources */}
                        <div className="space-y-4">
                            <h3 className="border-b border-orange-500/30 pb-2 font-semibold text-white">Resources</h3>
                            <ul className="space-y-3">
                                <li>
                                    <a href="#" className="group flex items-center text-sm text-gray-400 transition-colors hover:text-orange-400">
                                        <ArrowRight className="mr-2 h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                                        Help Center
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="group flex items-center text-sm text-gray-400 transition-colors hover:text-orange-400">
                                        <ArrowRight className="mr-2 h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                                        Betting Guide
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="group flex items-center text-sm text-gray-400 transition-colors hover:text-orange-400">
                                        <ArrowRight className="mr-2 h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                                        FAQ
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div className="space-y-4">
                            <h3 className="border-b border-orange-500/30 pb-2 font-semibold text-white">Legal</h3>
                            <ul className="space-y-3">
                                <li>
                                    <a href="#" className="group flex items-center text-sm text-gray-400 transition-colors hover:text-orange-400">
                                        <ArrowRight className="mr-2 h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="group flex items-center text-sm text-gray-400 transition-colors hover:text-orange-400">
                                        <ArrowRight className="mr-2 h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                                        Terms of Service
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="group flex items-center text-sm text-gray-400 transition-colors hover:text-orange-400">
                                        <ArrowRight className="mr-2 h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                                        Responsible Gambling
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="group flex items-center text-sm text-gray-400 transition-colors hover:text-orange-400">
                                        <ArrowRight className="mr-2 h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                                        Contact Support
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Newsletter Section */}
                    <div className="relative mb-8 overflow-hidden rounded-3xl border border-gray-700/50 bg-gradient-to-r from-gray-900/80 to-gray-800/60 p-6 backdrop-blur-sm lg:p-8">
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-gradient-to-br from-orange-500/10 to-red-500/10 blur-2xl"></div>

                        <div className="relative grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
                            <div className="lg:col-span-8">
                                <h3 className="mb-2 text-xl font-bold text-white">Get Daily Free Tips</h3>
                                <p className="text-sm text-gray-400">
                                    Subscribe to receive 3 free expert tips every day + exclusive betting insights.
                                </p>
                            </div>
                            <div className="lg:col-span-4">
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <div className="flex-1">
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            className="w-full rounded-xl border border-gray-600 bg-black/50 px-4 py-3 text-sm text-white placeholder-gray-500 transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                                        />
                                    </div>
                                    <button className="transform rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 text-sm font-semibold whitespace-nowrap text-white shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-105 hover:from-orange-600 hover:to-red-600">
                                        Subscribe
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="flex flex-col items-center justify-between border-t border-gray-800/50 pt-8 lg:flex-row">
                        <div className="flex flex-col items-center space-y-4 text-sm text-gray-400 lg:flex-row lg:space-y-0 lg:space-x-8">
                            <p>© 2025 Tips Moto. All rights reserved.</p>
                            <div className="flex items-center space-x-6">
                                <span className="flex items-center space-x-2">
                                    <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
                                    <span>Live Support 24/7</span>
                                </span>
                                <span>|</span>
                                <span>Designed for Kenya</span>
                            </div>
                        </div>

                        {/* Social Links & Stats */}
                        <div className="mt-4 flex items-center space-x-6 lg:mt-0">
                            <div className="flex items-center space-x-4">
                                <div className="text-center">
                                    <div className="text-sm font-bold text-orange-400">90%+</div>
                                    <div className="text-xs text-gray-500">Accuracy</div>
                                </div>
                                <div className="h-8 w-px bg-gray-700"></div>
                                <div className="text-center">
                                    <div className="text-sm font-bold text-orange-400">5K+</div>
                                    <div className="text-xs text-gray-500">Members</div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <TooltipProvider>
                                    <div className="flex items-center space-x-3">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <a
                                                    href="https://www.instagram.com/tipsmoto_"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-gray-800/80 transition-all duration-300 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500"
                                                >
                                                    <Instagram className="h-3 w-3 text-gray-400 group-hover:text-white" />
                                                </a>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Instagram</p>
                                            </TooltipContent>
                                        </Tooltip>

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <a
                                                    href="https://www.facebook.com/share/QfMjoSwFR8CxewGT/"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-gray-800/80 transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700"
                                                >
                                                    <Facebook className="h-3 w-3 text-gray-400 group-hover:text-white" />
                                                </a>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Facebook</p>
                                            </TooltipContent>
                                        </Tooltip>

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <a
                                                    href="https://whatsapp.com/channel/0029VagdQJFBfxo8DiYaBI06"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-gray-800/80 transition-all duration-300 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600"
                                                >
                                                    <MessageCircle className="h-3 w-3 text-gray-400 group-hover:text-white" />
                                                </a>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>WhatsApp</p>
                                            </TooltipContent>
                                        </Tooltip>

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <a
                                                    href="https://x.com/TipsMoto_"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-gray-800/80 transition-all duration-300 hover:bg-gradient-to-r hover:from-gray-900 hover:to-black"
                                                >
                                                    <Twitter className="h-3 w-3 text-gray-400 group-hover:text-white" />
                                                </a>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>X (Twitter)</p>
                                            </TooltipContent>
                                        </Tooltip>

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <a
                                                    href="https://t.me/tipsmoto254"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-gray-800/80 transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500"
                                                >
                                                    <Send className="h-3 w-3 text-gray-400 group-hover:text-white" />
                                                </a>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Telegram</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </TooltipProvider>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
