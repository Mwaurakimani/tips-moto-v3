import { ArrowRight, Check, Eye, EyeOff, Gift, Star, TrendingUp, Zap } from 'lucide-react';
import { useState } from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Label } from './ui/label';
import axios from 'axios';

// Make sure Axios sends cookies with every request
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

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
        phone: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false,
        subscribeNewsletter: true,
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

        if (!/^(?:\+254|0)[17]\d{8}$/.test(formData.phone.trim())) {
            setError('Please enter a valid phone number');
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

        try {
            // 1️⃣ Get CSRF cookie from Sanctum
            await axios.get('/sanctum/csrf-cookie');

            // 2️⃣ Call Laravel register API
            const response = await axios.post('/register', {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                email: formData.email,
                password: formData.password,
                password_confirmation: formData.confirmPassword,
            });

            // 3️⃣ Laravel returns parsed JSON automatically
            const data = response.data;

            // 4️⃣ Laravel's register route logs user in automatically
            onUserLogin(data.user);
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        if (error) setError(''); // Clear error when user starts typing
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-6">
                <button onClick={onBackToHomepage} className="flex items-center space-x-3 text-white transition-colors hover:text-orange-500">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-red-500">
                        <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold">Tips Moto</span>
                </button>

                {/*<button onClick={onGoToAdminLogin} className="text-sm text-gray-400 hover:text-gray-300">*/}
                {/*    Admin Access*/}
                {/*</button>*/}
            </div>

            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-orange-500/10 to-red-500/10 blur-3xl"></div>
                <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-gradient-to-tr from-orange-500/10 to-red-500/10 blur-3xl"></div>
            </div>

            <div className="relative flex min-h-[calc(100vh-88px)] items-center justify-center p-4">
                <div className="grid w-full max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
                    {/* Left Side - Welcome & Benefits */}
                    <div className="order-2 space-y-8 text-center lg:order-1 lg:text-left">
                        <div className="space-y-4">
                            <h1 className="text-4xl leading-tight font-bold text-white lg:text-5xl">
                                Start Your{' '}
                                <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Winning Journey</span>
                            </h1>
                            <p className="max-w-lg text-xl text-gray-300">
                                Join thousands of successful bettors and get access to expert predictions with your free trial.
                            </p>
                        </div>

                        {/* Free Trial Features */}
                        <div className="rounded-2xl border border-orange-500/20 bg-gradient-to-r from-orange-500/10 to-red-500/10 p-6">
                            <div className="mb-4 flex items-center space-x-2">
                                <Gift className="h-5 w-5 text-orange-500" />
                                <span className="font-semibold text-orange-500">Free 7-Day Trial</span>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <Check className="h-4 w-4 flex-shrink-0 text-green-500" />
                                    <span className="text-gray-300">Access to all premium tips</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Check className="h-4 w-4 flex-shrink-0 text-green-500" />
                                    <span className="text-gray-300">Performance tracking dashboard</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Check className="h-4 w-4 flex-shrink-0 text-green-500" />
                                    <span className="text-gray-300">Expert analysis and insights</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Check className="h-4 w-4 flex-shrink-0 text-green-500" />
                                    <span className="text-gray-300">Cancel anytime, no commitment</span>
                                </div>
                            </div>
                        </div>

                        {/* Success Stats */}
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-4 backdrop-blur-sm">
                                <div className="mb-1 text-2xl font-bold text-white">89%</div>
                                <div className="text-sm text-gray-400">Success Rate</div>
                            </div>
                            <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-4 backdrop-blur-sm">
                                <div className="mb-1 text-2xl font-bold text-white">5K+</div>
                                <div className="text-sm text-gray-400">Happy Users</div>
                            </div>
                            <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-4 backdrop-blur-sm">
                                <div className="mb-1 text-2xl font-bold text-white">24/7</div>
                                <div className="text-sm text-gray-400">Support</div>
                            </div>
                        </div>

                        {/* Testimonial */}
                        <div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm">
                            <div className="mb-3 flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                                ))}
                            </div>
                            <p className="mb-3 text-sm text-gray-300 italic">
                                "I've been using Tips Moto for 6 months and my betting success has improved dramatically. The free trial convinced me
                                immediately!"
                            </p>
                            <p className="text-sm font-medium text-orange-500">- Michael K., Premium Member</p>
                        </div>
                    </div>

                    {/* Right Side - Sign Up Form */}
                    <div className="order-1 lg:order-2">
                        <Card className="border-gray-700 bg-gray-900/80 shadow-2xl backdrop-blur-sm">
                            <CardHeader className="space-y-1 text-center">
                                <CardTitle className="text-2xl text-white">Create Account</CardTitle>
                                <p className="text-gray-400">Start your free trial today</p>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName" className="text-white">
                                                First Name
                                            </Label>
                                            <Input
                                                id="firstName"
                                                name="firstName"
                                                type="text"
                                                placeholder="John"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                required
                                                className="border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName" className="text-white">
                                                Last Name
                                            </Label>
                                            <Input
                                                id="lastName"
                                                name="lastName"
                                                type="text"
                                                placeholder="Doe"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                required
                                                className="border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-white">
                                            Email Address
                                        </Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-white">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            placeholder="+254712345678"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                            className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-white">
                                            Password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                name="password"
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Create a strong password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                required
                                                className="border-gray-600 bg-gray-800 pr-10 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-gray-300"
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword" className="text-white">
                                            Confirm Password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                placeholder="Confirm your password"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                required
                                                className="border-gray-600 bg-gray-800 pr-10 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-gray-300"
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
                                                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, acceptTerms: checked as boolean }))}
                                                className="border-gray-600 data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500"
                                            />
                                            <Label htmlFor="acceptTerms" className="text-sm text-gray-400">
                                                I agree to the{' '}
                                                <span className="cursor-pointer text-orange-500 hover:text-orange-400">Terms of Service</span> and{' '}
                                                <span className="cursor-pointer text-orange-500 hover:text-orange-400">Privacy Policy</span>
                                            </Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="subscribeNewsletter"
                                                name="subscribeNewsletter"
                                                checked={formData.subscribeNewsletter}
                                                onCheckedChange={(checked) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        subscribeNewsletter: checked as boolean,
                                                    }))
                                                }
                                                className="border-gray-600 data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500"
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
                                        className="w-full transform rounded-lg bg-orange-500 py-2.5 text-white transition-all duration-300 hover:scale-105 hover:bg-orange-600"
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
                                    <p className="text-sm text-gray-400">
                                        Already have an account?{' '}
                                        <button onClick={onGoToLogin} className="font-medium text-orange-500 hover:text-orange-400">
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
