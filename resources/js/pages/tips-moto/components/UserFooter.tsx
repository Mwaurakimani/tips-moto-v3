import { 
  TrendingUp, 
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Instagram,
  Facebook,
  MessageCircle,
  Twitter,
  Send
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface UserFooterProps {
  onNavigateHome?: () => void;
  onNavigateTips?: () => void;
}

export function UserFooter({ onNavigateHome, onNavigateTips }: UserFooterProps) {
  return (
    <footer className="bg-black text-white">
      <div className="pt-12 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
            
            {/* Brand Section - 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Tips Moto
                  </h2>
                  <p className="text-xs text-orange-400 uppercase tracking-wide">Expert Predictions</p>
                </div>
              </div>
              
              <p className="text-gray-300 leading-relaxed max-w-sm">
                Transform your betting experience with Kenya's most trusted sports prediction platform. Join thousands who've improved their success rates.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-300">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <Phone className="h-4 w-4 text-orange-400" />
                  </div>
                  <span className="text-sm">+254 712 345 678</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <Mail className="h-4 w-4 text-orange-400" />
                  </div>
                  <span className="text-sm">info@tipsmoto.com</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-orange-400" />
                  </div>
                  <span className="text-sm">Nairobi, Kenya</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold border-b border-orange-500/30 pb-2">Platform</h3>
              <ul className="space-y-3">
                <li>
                  {onNavigateHome ? (
                    <button 
                      onClick={onNavigateHome}
                      className="text-gray-400 hover:text-orange-400 transition-colors text-sm flex items-center group"
                    >
                      <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      Home
                    </button>
                  ) : (
                    <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm flex items-center group">
                      <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      Home
                    </a>
                  )}
                </li>
                <li>
                  {onNavigateTips ? (
                    <button 
                      onClick={onNavigateTips}
                      className="text-gray-400 hover:text-orange-400 transition-colors text-sm flex items-center group"
                    >
                      <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      Today's Tips
                    </button>
                  ) : (
                    <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm flex items-center group">
                      <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      Today's Tips
                    </a>
                  )}
                </li>
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm flex items-center group">
                  <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Premium Packages
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm flex items-center group">
                  <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Yesterday's Winners
                </a></li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold border-b border-orange-500/30 pb-2">Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm flex items-center group">
                  <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Help Center
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm flex items-center group">
                  <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Betting Guide
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm flex items-center group">
                  <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  FAQ
                </a></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold border-b border-orange-500/30 pb-2">Legal</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm flex items-center group">
                  <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Privacy Policy
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm flex items-center group">
                  <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Terms of Service
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm flex items-center group">
                  <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Responsible Gambling
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm flex items-center group">
                  <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Contact Support
                </a></li>
              </ul>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/60 backdrop-blur-sm rounded-3xl p-6 lg:p-8 border border-gray-700/50 mb-8 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-full blur-2xl"></div>
            
            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8">
                <h3 className="text-xl font-bold text-white mb-2">Get Daily Free Tips</h3>
                <p className="text-gray-400 text-sm">Subscribe to receive 3 free expert tips every day + exclusive betting insights.</p>
              </div>
              <div className="lg:col-span-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <input 
                      type="email" 
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors text-sm"
                    />
                  </div>
                  <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-orange-500/25 text-sm whitespace-nowrap">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col lg:flex-row justify-between items-center pt-8 border-t border-gray-800/50">
            <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-8 text-gray-400 text-sm">
              <p>© 2025 Tips Moto. All rights reserved.</p>
              <div className="flex items-center space-x-6">
                <span className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live Support 24/7</span>
                </span>
                <span>|</span>
                <span>Designed for Kenya</span>
              </div>
            </div>
            
            {/* Social Links & Stats */}
            <div className="flex items-center space-x-6 mt-4 lg:mt-0">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-orange-400 font-bold text-sm">90%+</div>
                  <div className="text-xs text-gray-500">Accuracy</div>
                </div>
                <div className="w-px h-8 bg-gray-700"></div>
                <div className="text-center">
                  <div className="text-orange-400 font-bold text-sm">5K+</div>
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
                          className="w-8 h-8 bg-gray-800/80 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 rounded-lg flex items-center justify-center transition-all duration-300 cursor-pointer group"
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
                          className="w-8 h-8 bg-gray-800/80 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 rounded-lg flex items-center justify-center transition-all duration-300 cursor-pointer group"
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
                          className="w-8 h-8 bg-gray-800/80 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 rounded-lg flex items-center justify-center transition-all duration-300 cursor-pointer group"
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
                          className="w-8 h-8 bg-gray-800/80 hover:bg-gradient-to-r hover:from-gray-900 hover:to-black rounded-lg flex items-center justify-center transition-all duration-300 cursor-pointer group"
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
                          className="w-8 h-8 bg-gray-800/80 hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 rounded-lg flex items-center justify-center transition-all duration-300 cursor-pointer group"
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
