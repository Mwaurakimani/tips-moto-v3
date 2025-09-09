import { ArrowRight, Check, Eye, EyeOff, Gift, Star, TrendingUp, Zap } from 'lucide-react';
import { useState } from 'react';
import { Alert, AlertDescription } from '@/pages/tips-moto/components/ui/alert';
import { Button } from '@/pages/tips-moto/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/tips-moto/components/ui/card';
import { Checkbox } from '@/pages/tips-moto/components/ui/checkbox';
import { Input } from '@/pages/tips-moto/components/ui/input';
import { Label } from '@/pages/tips-moto/components/ui/label';
import { useForm, Link } from '@inertiajs/react';

export default function UserSignUpPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [localErrors, setLocalErrors] = useState({});

    // Inertia form handling
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        terms_accepted: false,
        newsletter_subscription: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Clear previous errors
        clearErrors();
        setLocalErrors({});

        // Client-side validation
        const newErrors = {};

        if (!data.first_name.trim()) {
            newErrors.first_name = 'First name is required';
        }

        if (!data.last_name.trim()) {
            newErrors.last_name = 'Last name is required';
        }

        if (!data.email.trim()) {
            newErrors.email = 'Email is required';
        }

        if (!data.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        }

        if (data.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (data.password !== data.password_confirmation) {
            newErrors.password_confirmation = 'Passwords do not match';
        }

        if (!data.terms_accepted) {
            newErrors.terms_accepted = 'You must accept the terms and conditions';
        }

        // If there are validation errors, show them and return
        if (Object.keys(newErrors).length > 0) {
            setLocalErrors(newErrors);
            return;
        }

        console.log('Submitting registration with data:', data);

        // Post to Laravel's register route
        post(route('register'), {
            onSuccess: (page) => {
                console.log('Registration successful:', page);
                // Laravel will redirect automatically after successful registration
            },
            onError: (errors) => {
                console.log('Registration failed with errors:', errors);
                // Inertia will automatically populate the errors object
            },
            onFinish: () => {
                console.log('Registration request finished');
                // Clear password fields regardless of success/failure
                reset('password', 'password_confirmation');
            }
        });
    };

    const handleInputChange = (field, value) => {
        setData(field, value);

        // Clear specific field error when user starts typing
        if (errors[field]) {
            clearErrors(field);
        }
        if (localErrors[field]) {
            setLocalErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    // Combine server errors and local errors
    const getAllErrors = () => {
        return { ...localErrors, ...errors };
    };

    const allErrors = getAllErrors();

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-6">
                <Link href={route('home')} className="flex items-center space-x-3 text-white transition-colors hover:text-orange-500">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-red-500">
                        <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold">Tips Moto</span>
                </Link>
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
                                    {/* Name Fields */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="first_name" className="text-white">
                                                First Name
                                            </Label>
                                            <Input
                                                id="first_name"
                                                name="first_name"
                                                type="text"
                                                placeholder="John"
                                                value={data.first_name}
                                                onChange={(e) => handleInputChange('first_name', e.target.value)}
                                                required
                                                className="border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500"
                                            />
                                            {allErrors.first_name && (
                                                <p className="text-red-400 text-sm">{allErrors.first_name}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="last_name" className="text-white">
                                                Last Name
                                            </Label>
                                            <Input
                                                id="last_name"
                                                name="last_name"
                                                type="text"
                                                placeholder="Doe"
                                                value={data.last_name}
                                                onChange={(e) => handleInputChange('last_name', e.target.value)}
                                                required
                                                className="border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500"
                                            />
                                            {allErrors.last_name && (
                                                <p className="text-red-400 text-sm">{allErrors.last_name}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Email Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-white">
                                            Email Address
                                        </Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="john@example.com"
                                            value={data.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            required
                                            className="border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500"
                                        />
                                        {allErrors.email && (
                                            <p className="text-red-400 text-sm">{allErrors.email}</p>
                                        )}
                                    </div>

                                    {/* Phone Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-white">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            placeholder="+254712345678"
                                            value={data.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            required
                                            className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500"
                                        />
                                        {allErrors.phone && (
                                            <p className="text-red-400 text-sm">{allErrors.phone}</p>
                                        )}
                                    </div>

                                    {/* Password Fields */}
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
                                                value={data.password}
                                                onChange={(e) => handleInputChange('password', e.target.value)}
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
                                        {allErrors.password && (
                                            <p className="text-red-400 text-sm">{allErrors.password}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation" className="text-white">
                                            Confirm Password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="password_confirmation"
                                                name="password_confirmation"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                placeholder="Confirm your password"
                                                value={data.password_confirmation}
                                                onChange={(e) => handleInputChange('password_confirmation', e.target.value)}
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
                                        {allErrors.password_confirmation && (
                                            <p className="text-red-400 text-sm">{allErrors.password_confirmation}</p>
                                        )}
                                    </div>

                                    {/* Checkboxes */}
                                    <div className="space-y-3">
                                        <div className="flex items-start space-x-2">
                                            <Checkbox
                                                id="terms_accepted"
                                                name="terms_accepted"
                                                checked={data.terms_accepted}
                                                onCheckedChange={(checked) => handleInputChange('terms_accepted', checked)}
                                                className="border-gray-600 data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500 mt-1"
                                            />
                                            <div className="flex-1">
                                                <Label htmlFor="terms_accepted" className="text-sm text-gray-400">
                                                    I agree to the{' '}
                                                    <Link href="/terms" className="cursor-pointer text-orange-500 hover:text-orange-400">Terms of Service</Link> and{' '}
                                                    <Link href="/privacy" className="cursor-pointer text-orange-500 hover:text-orange-400">Privacy Policy</Link>
                                                </Label>
                                                {allErrors.terms_accepted && (
                                                    <p className="text-red-400 text-sm mt-1">{allErrors.terms_accepted}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="newsletter_subscription"
                                                name="newsletter_subscription"
                                                checked={data.newsletter_subscription}
                                                onCheckedChange={(checked) => handleInputChange('newsletter_subscription', checked)}
                                                className="border-gray-600 data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500"
                                            />
                                            <Label htmlFor="newsletter_subscription" className="text-sm text-gray-400">
                                                Send me betting tips and updates via email
                                            </Label>
                                        </div>
                                    </div>

                                    {/* Debug Information - Remove in production */}
                                    {process.env.NODE_ENV === 'development' && (
                                        <div className="text-xs text-gray-500 p-2 bg-gray-800 rounded">
                                            <p>Debug: Processing = {processing ? 'true' : 'false'}</p>
                                            <p>Route: {typeof route !== 'undefined' ? route('register') : 'route() not available'}</p>
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full transform rounded-lg bg-orange-500 py-2.5 text-white transition-all duration-300 hover:scale-105 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? (
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
                                        <Link href={route('login')} className="font-medium text-orange-500 hover:text-orange-400">
                                            Sign in here
                                        </Link>
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
