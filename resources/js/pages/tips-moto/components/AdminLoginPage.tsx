import { useState } from 'react';
import { Eye, EyeOff, TrendingUp, Shield, Users, BarChart } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';

interface AdminLoginPageProps {
  onAdminLogin: (adminData: any) => void;
  onGoToUserLogin: () => void;
  onBackToHomepage: () => void;
}

export function AdminLoginPage({ onAdminLogin, onGoToUserLogin, onBackToHomepage }: AdminLoginPageProps) {
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

    // Demo credentials for different admin roles
    const adminCredentials = {
      'john.kamau@tipsmoto.com': {
        password: 'admin123',
        role: 'Super Admin',
        firstName: 'John',
        lastName: 'Kamau',
        phone: '+254 712 345 678',
        avatar: '',
        joinDate: 'Jan 2024',
        lastLogin: new Date().toLocaleString()
      },
      'admin@tipsmoto.com': {
        password: 'admin123',
        role: 'Admin',
        firstName: 'Admin',
        lastName: 'User',
        phone: '+254 700 123 456',
        avatar: '',
        joinDate: 'Mar 2024',
        lastLogin: new Date().toLocaleString()
      }
    };

    // Simulate API call delay
    setTimeout(() => {
      const credential = adminCredentials[formData.email as keyof typeof adminCredentials];

      if (credential && credential.password === formData.password) {
        onAdminLogin({
          email: formData.email,
          ...credential
        });
      } else {
        setError('Invalid email or password. Try john.kamau@tipsmoto.com / admin123');
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
      email: 'john.kamau@tipsmoto.com',
      password: 'admin123'
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
          <div className="w-8 h-8 bg-gradient-to-r   rounded-lg flex items-center justify-center">
              <div className="flex h-15 w-15 items-center justify-center rounded-lg">
                  <img src="/storage/system/logo_light.png" alt="" className={'h-full w-full object-contain'} />
              </div>
          </div>
          <span className="text-xl font-bold">Tips Moto</span>
        </button>

        <button
          onClick={onGoToUserLogin}
          className="text-gray-400 hover:text-gray-300 text-sm"
        >
          User Login
        </button>
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-orange-500/10 to-red-500/10 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-tr from-orange-500/10 to-red-500/10 blur-3xl"></div>
      </div>

      <div className="relative flex items-center justify-center min-h-[calc(100vh-88px)] p-4">

        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

        {/* Left Side - Branding & Features */}
        <div className="space-y-8 text-center lg:text-left">
          {/* Logo */}
          <div className="flex items-center justify-center lg:justify-start space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r   rounded-xl flex items-center justify-center">
                <div className="flex h-15 w-15 items-center justify-center rounded-lg">
                    <img src="/storage/system/logo_light.png" alt="" className={'h-full w-full object-contain'} />
                </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Tips Moto</h1>
              <p className="text-orange-400 text-sm">Admin Dashboard</p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-white font-semibold mb-2">User Management</h3>
              <p className="text-gray-400 text-sm">Manage accounts, subscriptions, and user analytics</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                <BarChart className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-white font-semibold mb-2">Analytics</h3>
              <p className="text-gray-400 text-sm">Track performance, revenue, and user engagement</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-white font-semibold mb-2">Tips Management</h3>
              <p className="text-gray-400 text-sm">Create, manage, and analyze betting tips</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-white font-semibold mb-2">Security</h3>
              <p className="text-gray-400 text-sm">Role-based access and system monitoring</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center lg:justify-start space-x-8 text-center">
            <div>
              <div className="text-2xl font-bold text-white">5,000+</div>
              <div className="text-gray-400 text-sm">Active Users</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">89%</div>
              <div className="text-gray-400 text-sm">Success Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-gray-400 text-sm">Support</div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700 shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl text-white">Admin Login</CardTitle>
            <p className="text-gray-400">Access your admin dashboard</p>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your admin email"
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

              {error && (
                <Alert className="border-red-500 bg-red-500/10">
                  <AlertDescription className="text-red-400">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg transition-colors"
              >
                {isLoading ? 'Signing in...' : 'Sign In to Dashboard'}
              </Button>
            </form>

            {/* Demo Login */}
            <div className="text-center space-y-3">
              <div className="text-sm text-gray-500">Demo Access</div>
              <Button
                type="button"
                variant="outline"
                onClick={handleDemoLogin}
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                Use Demo Credentials
              </Button>
            </div>

            {/* Switch to User Login */}
            <div className="text-center pt-4 border-t border-gray-700">
              <p className="text-gray-400 text-sm">
                Looking for user access?{' '}
                <button
                  onClick={onGoToUserLogin}
                  className="text-orange-500 hover:text-orange-400 font-medium"
                >
                  User Login
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}
