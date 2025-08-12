import { useState } from 'react';
import { Eye, EyeOff, TrendingUp, ArrowRight, Star, Target, Trophy } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';

interface UserLoginPageProps {
  onUserLogin: (userData: any) => void;
  onGoToSignUp: () => void;
  onGoToAdminLogin: () => void;
  onBackToHomepage: () => void;
}

export function UserLoginPage({ onUserLogin, onGoToSignUp, onGoToAdminLogin, onBackToHomepage }: UserLoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Demo user credentials with complete data
    const userCredentials = {
      'user@example.com': {
        password: 'user123',
        name: 'John Doe',
        subscriptionStatus: 'active',
        subscriptionTier: 'Premium',
        subscriptionExpiry: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(), // 18 days from now
        joinDate: '2024-12-15',
        avatar: '',
        winRate: 78,
        tipsAccessed: 156,
        totalSpent: 12500
      },
      'demo@tipsmoto.com': {
        password: 'demo123',
        name: 'Demo User',
        subscriptionStatus: 'trial',
        subscriptionTier: 'Trial',
        subscriptionExpiry: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
        joinDate: '2025-01-01',
        avatar: '',
        winRate: 82,
        tipsAccessed: 23,
        totalSpent: 0
      },
      'premium@tipsmoto.com': {
        password: 'premium123',
        name: 'Premium User',
        subscriptionStatus: 'active',
        subscriptionTier: 'VIP',
        subscriptionExpiry: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000).toISOString(), // 27 days from now
        joinDate: '2024-11-01',
        avatar: '',
        winRate: 85,
        tipsAccessed: 284,
        totalSpent: 28750
      }
    };

    // Simulate API call delay
    setTimeout(() => {
      const credential = userCredentials[formData.email as keyof typeof userCredentials];
      
      if (credential && credential.password === formData.password) {
        onUserLogin({
          email: formData.email,
          ...credential
        });
      } else {
        setError('Invalid email or password. Try user@example.com / user123');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    if (error) setError(''); // Clear error when user starts typing
  };

  const handleDemoLogin = () => {
    setFormData({
      email: 'user@example.com',
      password: 'user123'
    });
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
          
          {/* Left Side - Benefits & Features */}
          <div className="space-y-8 text-center lg:text-left order-2 lg:order-1">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                Welcome Back to{' '}
                <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  Winning
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-lg">
                Access your personalized dashboard with expert predictions and track your betting success.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 justify-center lg:justify-start">
                <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <Target className="h-4 w-4 text-orange-500" />
                </div>
                <span className="text-gray-300">Access premium betting tips</span>
              </div>
              
              <div className="flex items-center space-x-3 justify-center lg:justify-start">
                <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <Trophy className="h-4 w-4 text-orange-500" />
                </div>
                <span className="text-gray-300">Track your winning performance</span>
              </div>
              
              <div className="flex items-center space-x-3 justify-center lg:justify-start">
                <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <Star className="h-4 w-4 text-orange-500" />
                </div>
                <span className="text-gray-300">Personalized recommendations</span>
              </div>
            </div>

            {/* Social proof */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center border-2 border-gray-800 text-white text-xs font-bold">
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-300 text-sm italic">
                "Tips Moto has transformed my betting strategy. The predictions are incredibly accurate!"
              </p>
              <p className="text-orange-500 text-sm font-medium mt-2">- Sarah M., Premium Member</p>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="order-1 lg:order-2">
            <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700 shadow-2xl">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl text-white">Sign In</CardTitle>
              <p className="text-gray-400">Welcome back! Please sign in to your account</p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
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
                      placeholder="Enter your password"
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

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-600 bg-gray-800 text-orange-500 focus:ring-orange-500" />
                    <span className="text-sm text-gray-400">Remember me</span>
                  </label>
                  <button type="button" className="text-sm text-orange-500 hover:text-orange-400">
                    Forgot password?
                  </button>
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
                  {isLoading ? 'Signing in...' : (
                    <>
                      Sign In
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="space-y-4">
                <div className="relative">
                  <Separator className="bg-gray-700" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-gray-900 px-3 text-sm text-gray-400">Or try demo</span>
                  </div>
                </div>

                <Button 
                  type="button"
                  variant="outline"
                  onClick={handleDemoLogin}
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  Use Demo Account
                </Button>
              </div>

              {/* Sign Up Link */}
              <div className="text-center pt-4">
                <p className="text-gray-400 text-sm">
                  Don't have an account?{' '}
                  <button
                    onClick={onGoToSignUp}
                    className="text-orange-500 hover:text-orange-400 font-medium"
                  >
                    Sign up for free
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
