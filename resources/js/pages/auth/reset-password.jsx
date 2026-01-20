import { Head, useForm, Link } from '@inertiajs/react';
import { LoaderCircle, ArrowLeft, Eye, EyeOff, Lock } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/pages/tips-moto/components/ui/button.js';
import { Input } from '@/pages/tips-moto/components/ui/input';
import { Label } from '@/pages/tips-moto/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/tips-moto/components/ui/card';
import { Alert, AlertDescription } from '@/pages/tips-moto/components/ui/alert';

export default function ResetPassword({ token, email }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
            <Head title="Reset password" />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-6">
                <Link as={'button'} href={route('login')}
                    className="flex items-center space-x-2 text-gray-400 hover:text-orange-500 transition-colors text-sm"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to login</span>
                </Link>
            </div>

            {/* Reset Password Section */}
            <div className="relative flex items-center justify-center min-h-[calc(100vh-88px)] p-4">
                <div className="w-full max-w-md">
                    {/* Info Section */}
                    <div className="mb-8 text-center space-y-3">
                        <div className="flex justify-center mb-4">
                            <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                                <Lock className="h-6 w-6 text-orange-500" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-white">Create New Password</h1>
                        <p className="text-gray-400">
                            Please enter your new password below to regain access to your account.
                        </p>
                    </div>

                    {/* Form Card */}
                    <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700 shadow-2xl">
                        <CardHeader className="space-y-1 text-center">
                            <CardTitle className="text-xl text-white">Set New Password</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <form onSubmit={submit} className="space-y-4">
                                {/* Email Field (Read-only) */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-white">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        value={data.email}
                                        readOnly
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="bg-gray-800 border-gray-600 text-gray-400 placeholder-gray-500 cursor-not-allowed"
                                    />
                                    {errors.email && (
                                        <p className="text-red-400 text-sm">{errors.email}</p>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-white">New Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            autoComplete="new-password"
                                            value={data.password}
                                            autoFocus
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="Create a strong password"
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

                                {/* Confirm Password Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation" className="text-white">Confirm Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            autoComplete="new-password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            placeholder="Confirm your password"
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
                                    {errors.password_confirmation && (
                                        <p className="text-red-400 text-sm">{errors.password_confirmation}</p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg mt-6"
                                >
                                    {processing ? (
                                        <>
                                            <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                                            Resetting Password...
                                        </>
                                    ) : (
                                        <>
                                            Reset Password
                                            <Lock className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </form>

                            {/* Footer Links */}
                            <div className="text-center">
                                <p className="text-gray-400 text-sm">
                                    Remember your password?{' '}
                                    <Link
                                        href={route('login')}
                                        className="text-orange-500 hover:text-orange-400 font-medium transition-colors"
                                    >
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
