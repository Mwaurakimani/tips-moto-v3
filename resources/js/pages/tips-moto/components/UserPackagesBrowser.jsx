import DebugJson from '@/components/ui/JsonDebug.js';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { ArrowRight, CheckCircle, Clock, CreditCard, Crown, Package, Star, Target } from 'lucide-react';
import { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';

export function UserPackagesBrowser({ allMatches, currentUser, packages }) {
    const phone = usePage().props.auth.user.phone;
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedDuration, setSelectedDuration] = useState('all');
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState(phone);

    // Package data from admin (matching SportPackagesPage)
    const availablePackages = [
        {
            id: packages.find((packageSelected) => packageSelected.name === 'Full Time Scores Daily')?.id,
            name: 'Full-Time Scores Daily',
            description: 'Professional match outcome predictions',
            price: 99,
            originalPrice: 149,
            duration: 'Daily',
            tips: '15 Tips',
            accuracy: '90%+',
            category: 'match-outcomes',
            features: [
                'Home/Away/Draw predictions',
                'Double chance selections',
                'Professional match analysis',
                'Risk level indicators',
                '24/7 Customer support',
            ],
            popular: false,
            color: 'from-blue-500 to-blue-600',
        },
        {
            id: packages.find((packageSelected) => packageSelected.name === 'Full Time Scores Weekly')?.id,
            name: 'Full-Time Scores Weekly',
            description: 'Complete weekly match predictions',
            price: 599,
            originalPrice: 899,
            duration: 'Weekly',
            tips: '17 Tips/Day',
            accuracy: '90%+',
            category: 'match-outcomes',
            features: [
                'Daily professional predictions',
                'Multiple leagues coverage',
                'Home/Away/Draw analysis',
                'Double chance options',
                'Risk assessment reports',
                'Telegram VIP group access',
                'Priority customer support',
            ],
            popular: true,
            color: 'from-orange-500 to-red-500',
        },
        {
            id: packages.find((packageSelected) => packageSelected.name === 'Goal-No Goal Daily')?.id,
            name: 'Both Teams Score Daily',
            description: 'BTTS specialized predictions',
            price: 39,
            originalPrice: 59,
            duration: 'Daily',
            tips: '8 Tips',
            accuracy: '89%+',
            category: 'btts',
            features: [
                'Both teams to score tips',
                'Goal/No Goal analysis',
                'Team scoring patterns',
                'Defensive analysis',
                'High accuracy selections',
            ],
            popular: false,
            color: 'from-red-500 to-red-600',
        },
        {
            id: packages.find((packageSelected) => packageSelected.name === 'Goal-No Goal Weekly')?.id,
            name: 'Goal Goal/No Goal Weekly',
            description: 'Weekly BTTS comprehensive package',
            price: 149,
            originalPrice: 229,
            duration: 'Weekly',
            tips: '10 Tips/Day',
            accuracy: '91%+',
            category: 'btts',
            features: [
                'Daily BTTS predictions',
                'GG/NG market analysis',
                'Team form assessment',
                'Scoring statistics',
                'Weekly strategy reports',
                'Telegram group access',
            ],
            popular: false,
            color: 'from-pink-500 to-pink-600',
        },
    ];

    // Filter packages based on search and filters
    const filteredPackages = availablePackages.filter((pkg) => {
        const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pkg.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || pkg.category === selectedCategory;
        const matchesDuration = selectedDuration === 'all' || pkg.duration.toLowerCase() === selectedDuration;

        return matchesSearch && matchesCategory && matchesDuration;
    });

    const handlePurchase = (packageData) => {

        axios
            .post(route('package.purchase'), {
                data: {
                    packageData,
                    phoneNumber,
                },
            })
            .then((response) => {
                alert('Accept the transaction to complete the purchase');
                window.location.reload();
            });
    };

    return (
        <div className="space-y-6 pb-20 xl:pb-6">
            {/* Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Browse Packages</h2>
                    <p className="text-muted-foreground">Discover and purchase betting tip packages</p>
                </div>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredPackages.map((pkg) => (
                    <Card
                        key={pkg.id}
                        className={`relative border-none shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${pkg.popular ? 'ring-2 ring-orange-500/30' : ''}`}
                    >
                        {pkg.popular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
                                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1 text-white">
                                    <Crown className="mr-1 h-3 w-3" />
                                    Most Popular
                                </Badge>
                            </div>
                        )}

                        <CardHeader className="pb-4 text-center">
                            <div className={`mx-auto mb-4 h-16 w-16 rounded-2xl bg-gradient-to-r ${pkg.color} flex items-center justify-center`}>
                                <Package className="h-8 w-8 text-white" />
                            </div>

                            <CardTitle className="text-lg">{pkg.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{pkg.description}</p>

                            <div className="mt-4 space-y-2">
                                <div className="flex items-center justify-center space-x-2">
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">KES {pkg.price}</span>
                                    <span className="text-lg text-gray-500 line-through">KES {pkg.originalPrice}</span>
                                </div>

                                <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                                    <span className="flex items-center">
                                        <Clock className="mr-1 h-3 w-3" />
                                        {pkg.duration}
                                    </span>
                                    <span className="flex items-center">
                                        <Target className="mr-1 h-3 w-3" />
                                        {pkg.tips}
                                    </span>
                                    <span className="flex items-center">
                                        <Star className="mr-1 h-3 w-3" />
                                        {pkg.accuracy}
                                    </span>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                {pkg.features.slice(0, 3).map((feature, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
                                        <span className="text-sm">{feature}</span>
                                    </div>
                                ))}
                                {pkg.features.length > 3 && <p className="text-sm text-muted-foreground">+{pkg.features.length - 3} more features</p>}
                            </div>

                            <Dialog open={selectedPackage?.id === pkg.id} onOpenChange={(open) => !open && setSelectedPackage(null)}>
                                <DialogTrigger asChild>
                                    <Button
                                        className={`w-full bg-gradient-to-r ${pkg.color} text-white hover:opacity-90`}
                                        onClick={() => setSelectedPackage(pkg)}
                                    >
                                        View Details
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </DialogTrigger>

                                <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle className="text-xl">{pkg.name}</DialogTitle>
                                        <DialogDescription>
                                            View detailed information about this betting tips package and make a purchase.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="space-y-6">
                                        <div className="text-center">
                                            <div
                                                className={`mx-auto mb-4 h-20 w-20 rounded-2xl bg-gradient-to-r ${pkg.color} flex items-center justify-center`}
                                            >
                                                <Package className="h-10 w-10 text-white" />
                                            </div>
                                            <p className="mb-4 text-muted-foreground">{pkg.description}</p>

                                            <div className="mb-4 flex items-center justify-center space-x-2">
                                                <span className="text-3xl font-bold">KES {pkg.price}</span>
                                                <span className="text-xl text-muted-foreground line-through">KES {pkg.originalPrice}</span>
                                                <Badge className="bg-green-500 text-white">
                                                    {Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)}% OFF
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 text-center">
                                            <div>
                                                <Clock className="mx-auto mb-1 h-5 w-5 text-blue-500" />
                                                <p className="text-sm font-medium">{pkg.duration}</p>
                                                <p className="text-xs text-muted-foreground">Duration</p>
                                            </div>
                                            <div>
                                                <Target className="mx-auto mb-1 h-5 w-5 text-green-500" />
                                                <p className="text-sm font-medium">{pkg.tips}</p>
                                                <p className="text-xs text-muted-foreground">Tips</p>
                                            </div>
                                            <div>
                                                <Star className="mx-auto mb-1 h-5 w-5 text-yellow-500" />
                                                <p className="text-sm font-medium">{pkg.accuracy}</p>
                                                <p className="text-xs text-muted-foreground">Accuracy</p>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="mb-3 font-semibold">What's Included:</h4>
                                            <div className="grid grid-cols-1 gap-2">
                                                {pkg.features.map((feature, index) => (
                                                    <div key={index} className="flex items-center space-x-2">
                                                        <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
                                                        <span className="text-sm">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <Input
                                                placeholder="Enter your Mpesa phone number"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                                className="pl-3"
                                            />
                                        </div>

                                        <div className="flex space-x-3">
                                            <Button variant="outline" className="flex-1" onClick={() => setSelectedPackage(null)}>
                                                Cancel
                                            </Button>
                                            <Button
                                                className={`flex-1 bg-gradient-to-r ${pkg.color} text-white hover:opacity-90`}
                                                onClick={() => handlePurchase(pkg)}
                                            >
                                                <CreditCard className="mr-2 h-4 w-4" />
                                                Purchase Now
                                            </Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredPackages.length === 0 && (
                <Card className="py-12 text-center">
                    <CardContent>
                        <Package className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                        <h3 className="mb-2 text-lg font-semibold">No packages found</h3>
                        <p className="text-muted-foreground">Try adjusting your search or filters</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
