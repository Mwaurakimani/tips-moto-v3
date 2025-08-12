import { useState } from 'react';
import { Eye, EyeOff, TrendingUp, ArrowRight, Check, Gift, Star, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';

interface UserSignUpPageProps {
  onUserLogin: (userData: any) => void;
  onGoToLogin: () => void;
  onGoToAdminLogin: () => void;
  onBackToHomepage: () => void;
}

export function UserSignUpPage({ onUserLogin, onGoToLogin, onGoToAdminLogin, onBackToHomepage }: UserSignUpPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    subscribeNewsletter: true
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('Please enter your full name');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.acceptTerms) {
      setError('Please accept the terms and conditions');
      return;
    }

    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      // Create new user account and log them in
      const newUser = {
        email: formData.email,
        name: `${formData.firstName} ${formData.lastName}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        subscriptionStatus: 'trial', // New users get trial access
        subscriptionTier: 'Trial',
        subscriptionExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        joinDate: new Date().toISOString().split('T')[0],
        avatar: '',
        isNewUser: true,
        winRate: 0, // New users start with no stats
        tipsAccessed: 0,
        totalSpent: 0
      };

      onUserLogin(newUser);
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError(''); // Clear error when user starts typing
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6">
        <button
          onClick={onBackToHomepage}
          className="flex items-center space-x-3 text-white hover:text-orange-500 transition-colors"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">Tips Moto</span>
        </button>
        
        <button
          onClick={onGoToAdminLogin}
          className="text-gray-400 hover:text-gray-300 text-sm"
        >
          Admin Access
        </button>
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-orange-500/10 to-red-500/10 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-tr from-orange-500/10 to-red-500/10 blur-3xl"></div>
      </div>

      <div className="relative flex items-center justify-center min-h-[calc(100vh-88px)] p-4">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Welcome & Benefits */}
          <div className="space-y-8 text-center lg:text-left order-2 lg:order-1">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                Start Your{' '}
                <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  Winning Journey
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-lg">
                Join thousands of successful bettors and get access to expert predictions with your free trial.
              </p>
            </div>

            {/* Free Trial Features */}
            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl p-6 border border-orange-500/20">
              <div className="flex items-center space-x-2 mb-4">
                <Gift className="h-5 w-5 text-orange-500" />
                <span className="text-orange-500 font-semibold">Free 7-Day Trial</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-gray-300">Access to all premium tips</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-gray-300">Performance tracking dashboard</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-gray-300">Expert analysis and insights</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-gray-300">Cancel anytime, no commitment</span>
                </div>
              </div>
            </div>

            {/* Success Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                <div className="text-2xl font-bold text-white mb-1">89%</div>
                <div className="text-gray-400 text-sm">Success Rate</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                <div className="text-2xl font-bold text-white mb-1">5K+</div>
                <div className="text-gray-400 text-sm">Happy Users</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                <div className="text-2xl font-bold text-white mb-1">24/7</div>
                <div className="text-gray-400 text-sm">Support</div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center space-x-1 mb-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 text-sm italic mb-3">
                "I've been using Tips Moto for 6 months and my betting success has improved dramatically. The free trial convinced me immediately!"
              </p>
              <p className="text-orange-500 text-sm font-medium">- Michael K., Premium Member</p>
            </div>
          </div>

          {/* Right Side - Sign Up Form */}
          <div className="order-1 lg:order-2">
            <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700 shadow-2xl">
              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl text-white">Create Account</CardTitle>
                <p className="text-gray-400">Start your free trial today</p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-white">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-white">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="acceptTerms"
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, acceptTerms: checked as boolean }))
                        }
                        className="border-gray-600 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                      />
                      <Label htmlFor="acceptTerms" className="text-sm text-gray-400">
                        I agree to the{' '}
                        <span className="text-orange-500 hover:text-orange-400 cursor-pointer">Terms of Service</span>
                        {' '}and{' '}
                        <span className="text-orange-500 hover:text-orange-400 cursor-pointer">Privacy Policy</span>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="subscribeNewsletter"
                        name="subscribeNewsletter"
                        checked={formData.subscribeNewsletter}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, subscribeNewsletter: checked as boolean }))
                        }
                        className="border-gray-600 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                      />
                      <Label htmlFor="subscribeNewsletter" className="text-sm text-gray-400">
                        Send me betting tips and updates via email
                      </Label>
                    </div>
                  </div>

                  {error && (
                    <Alert className="border-red-500 bg-red-500/10">
                      <AlertDescription className="text-red-400">{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    {isLoading ? (
                      <>
                        <Zap className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Start Free Trial
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Sign In Link */}
                <div className="text-center">
                  <p className="text-gray-400 text-sm">
                    Already have an account?{' '}
                    <button
                      onClick={onGoToLogin}
                      className="text-orange-500 hover:text-orange-400 font-medium"
                    >
                      Sign in here
                    </button>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
