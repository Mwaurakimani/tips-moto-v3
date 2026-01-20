// Components
import { Head, useForm, Link } from '@inertiajs/react';
import { LoaderCircle, ArrowLeft, Mail } from 'lucide-react';

import { Button } from '@/pages/tips-moto/components/ui/button.js';
import { Input } from '@/pages/tips-moto/components/ui/input';
import { Label } from '@/pages/tips-moto/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/tips-moto/components/ui/card';
import { Alert, AlertDescription } from '@/pages/tips-moto/components/ui/alert';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
            <Head title="Forgot password" />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-6">
                <Link as={'button'} href={route('login')}
                    className="flex items-center space-x-2 text-gray-400 hover:text-orange-500 transition-colors text-sm"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to login</span>
                </Link>
            </div>

            {/* Forgot Password Section */}
            <div className="relative flex items-center justify-center min-h-[calc(100vh-88px)] p-4">
                <div className="w-full max-w-md">
                    {/* Info Section */}
                    <div className="mb-8 text-center space-y-3">
                        <div className="flex justify-center mb-4">
                            <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                                <Mail className="h-6 w-6 text-orange-500" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-white">Forgot your password?</h1>
                        <p className="text-gray-400">
                            No problem! Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>

                    {/* Form Card */}
                    <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700 shadow-2xl">
                        <CardHeader className="space-y-1 text-center">
                            <CardTitle className="text-xl text-white">Reset Password</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Success Message */}
                            {status && (
                                <Alert className="border-green-500/30 bg-green-500/10">
                                    <AlertDescription className="text-green-400">
                                        {status} Remember to check your spam folder if you don't receive an email.'
                                    </AlertDescription>
                                </Alert>
                            )}

                            <form onSubmit={submit} className="space-y-4">
                                {/* Email Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-white">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        value={data.email}
                                        autoFocus
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500"
                                    />
                                    {errors.email && (
                                        <p className="text-red-400 text-sm">{errors.email}</p>
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
                                            Sending link...
                                        </>
                                    ) : (
                                        <>
                                            Send Reset Link
                                            <Mail className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </form>

                            {/* Footer Links */}
                            <div className="space-y-3 text-center">
                                <p className="text-gray-400 text-sm">
                                    Remember your password?{' '}
                                    <Link
                                        href={route('login')}
                                        className="text-orange-500 hover:text-orange-400 font-medium transition-colors"
                                    >
                                        Sign in
                                    </Link>
                                </p>
                                <p className="text-gray-400 text-sm">
                                    Don't have an account?{' '}
                                    <Link
                                        href={route('register')}
                                        className="text-orange-500 hover:text-orange-400 font-medium transition-colors"
                                    >
                                        Create one
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
