import { useState } from 'react';
import { Eye, EyeOff, TrendingUp, ArrowRight, Star, Target, Trophy } from 'lucide-react';
import { Button } from '@/pages/tips-moto/components/ui/button.js';
import { Input } from '@/pages/tips-moto/components/ui/input';
import { Label } from '@/pages/tips-moto/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/tips-moto/components/ui/card';
import { Alert, AlertDescription } from '@/pages/tips-moto/components/ui/alert';
import { useForm, Link } from '@inertiajs/react';

export default function UserLoginPage({ onGoToSignUp, onBackToHomepage }) {
    const [showPassword, setShowPassword] = useState(false);

    // Inertia form handling
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        email: '',
        password: '',
        remember: false
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Clear any existing errors
        clearErrors();

        // Post to Laravel's login route
        post(route('login'), {
            onSuccess: () => {
                // Laravel will redirect automatically after successful login
                // Usually to /dashboard or intended URL
                console.log('Login successful - redirecting...');
            },
            onError: (errors) => {
                // Inertia will automatically populate the errors object
                console.log('Login failed:', errors);
            },
            onFinish: () => {
                // Clear password field regardless of success/failure
                reset('password');
            }
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
            </div>

            {/* Login Section */}
            <div className="relative flex items-center justify-center min-h-[calc(100vh-88px)] p-4">
                <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left side */}
                    <div className="space-y-6 text-center lg:text-left">
                        <h1 className="text-4xl font-bold text-white">
                            Welcome Back to{' '}
                            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                                Winning
                            </span>
                        </h1>
                        <p className="text-gray-300 text-lg">
                            Access your personalized dashboard with expert predictions and track your success.
                        </p>
                        <Feature icon={<Target className="h-4 w-4 text-orange-500" />} text="Access premium betting tips" />
                        <Feature icon={<Trophy className="h-4 w-4 text-orange-500" />} text="Track your winning performance" />
                        <Feature icon={<Star className="h-4 w-4 text-orange-500" />} text="Personalized recommendations" />
                    </div>

                    {/* Right side - Login Form */}
                    <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700 shadow-2xl">
                        <CardHeader className="space-y-1 text-center">
                            <CardTitle className="text-2xl text-white">Sign In</CardTitle>
                            <p className="text-gray-400">Welcome back! Please log in.</p>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Email Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-white">Email Address</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500"
                                    />
                                    {errors.email && (
                                        <p className="text-red-400 text-sm">{errors.email}</p>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-white">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Enter your password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
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
                                    {errors.password && (
                                        <p className="text-red-400 text-sm">{errors.password}</p>
                                    )}
                                </div>

                                {/* Remember Me Checkbox */}
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="w-4 h-4 text-orange-500 bg-gray-800 border-gray-600 rounded focus:ring-orange-500 focus:ring-2"
                                    />
                                    <Label htmlFor="remember" className="text-gray-300 text-sm">
                                        Remember me
                                    </Label>
                                </div>

                                {/* General Auth Errors */}
                                {errors.general && (
                                    <Alert className="border-red-500 bg-red-500/10">
                                        <AlertDescription className="text-red-400">{errors.general}</AlertDescription>
                                    </Alert>
                                )}

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg"
                                >
                                    {processing ? 'Signing in...' : (
                                        <>
                                            Sign In
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </form>

                            {/* Footer Links */}
                            <div className="space-y-4 text-center">
                                {/* Forgot Password */}
                                <Link
                                    href={route('password.request')}
                                    className="text-orange-500 hover:text-orange-400 text-sm"
                                >
                                    Forgot your password?
                                </Link>

                                {/* Sign Up Link */}
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
    );
}

function Feature({ icon, text }) {
    return (
        <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                {icon}
            </div>
            <span className="text-gray-300">{text}</span>
        </div>
    );
}
