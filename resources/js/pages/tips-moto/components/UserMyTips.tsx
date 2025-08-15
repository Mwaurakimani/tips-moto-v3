import axios from 'axios';
import {
    AlertTriangle,
    Calendar,
    CheckCircle,
    Clock,
    Download,
    Eye,
    Package,
    Target,
    Trophy,
    XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function UserMyTips() {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');

    // Mock user's purchased packages
    const userPackages = [
        {
            id: 1436,
            name: 'Full-Time Scores Weekly',
            purchaseDate: '2025-01-01',
            expiryDate: '2025-01-31',
            status: 'active',
            price: 599,
            tipsAccessed: 45,
            totalTips: 120,
            winRate: 89.2
        },
        {
            id: 1447,
            name: 'Weekend Accumulator',
            purchaseDate: '2024-12-15',
            expiryDate: '2025-01-15',
            status: 'expired',
            price: 199,
            tipsAccessed: 24,
            totalTips: 24,
            winRate: 75.0
        }
    ];

    const [mytips, setMyTips] = useState([]);

    useEffect(() => {
        const fetchTips = async () => {
            try {
                const response = await axios.get(route('fetchTipsApi'));
                setMyTips(response.data.data);
            } catch (error) {
                console.error('Error fetching tips:', error);
            }
        };

        fetchTips();
    }, []);

    const userTips = mytips;
    // Filter tips based on selected filters
    const filteredTips = userTips;

    // Calculate statistics
    const totalTips = userTips.length;
    const wonTips = userTips.filter((tip) => tip.winningStatus === 'won').length;
    const lostTips = userTips.filter((tip) => tip.winningStatus === 'lost').length;
    const pendingTips = userTips.filter((tip) => tip.winningStatus === 'pending').length;
    const winRate = totalTips > 0 ? (wonTips / (wonTips + lostTips)) * 100 : 0;

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'won':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'lost':
                return <XCircle className="h-4 w-4 text-red-500" />;
            case 'pending':
                return <Clock className="h-4 w-4 text-yellow-500" />;
            default:
                return <AlertTriangle className="h-4 w-4 text-gray-500" />;
        }
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            won: 'bg-green-500 text-white',
            lost: 'bg-red-500 text-white',
            pending: 'bg-yellow-500 text-white',
            void: 'bg-gray-500 text-white'
        };

        return <Badge
            className={variants[status as keyof typeof variants] || variants.void}>{status.toUpperCase()}</Badge>;
    };

    const getRiskLevelColor = (riskLevel: string) => {
        switch (riskLevel) {
            case 'low':
                return 'text-green-600 bg-green-50 dark:bg-green-900/20';
            case 'mid':
                return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
            case 'high':
                return 'text-red-600 bg-red-50 dark:bg-red-900/20';
            default:
                return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
        }
    };

    function getPredictionText(tip:any) {
        if (!tip || !tip.prediction_type) return "";

        switch (tip.prediction_type) {
            case "1_X_2":
                switch (tip.prediction_value) { // assuming you have a field like prediction_result
                    case -1:
                        return "Home Win";
                    case 0:
                        return "Draw";
                    default:
                        return "Away Win";
                }

            case "1X_X2_12":
                switch (tip.prediction_value) { // assuming you have a field like prediction_result
                    case -1:
                        return "Home Win/Draw ";
                    case 0:
                        return "Away Win/Draw";
                    default:
                        return "Home Win/Away Win";
                }
            case "GG-NG":
                switch (tip.prediction_value) { // assuming you have a field like prediction_result
                    case -1:
                        return "GG";
                    default:
                        return "NG";
                }
            // add more cases if needed
            default:
                return "Unknown";
        }
    }

    return (
        <div className="space-y-6 pb-20 xl:pb-6">
            {/* Stats Overview */}
            {/*<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">*/}
            {/*    <Card>*/}
            {/*        <CardContent className="p-4">*/}
            {/*            <div className="flex items-center space-x-2">*/}
            {/*                <Target className="h-5 w-5 text-blue-500" />*/}
            {/*                <div>*/}
            {/*                    <p className="text-sm text-muted-foreground">Total Tips</p>*/}
            {/*                    <p className="text-2xl font-bold">{totalTips}</p>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </CardContent>*/}
            {/*    </Card>*/}

            {/*    <Card>*/}
            {/*        <CardContent className="p-4">*/}
            {/*            <div className="flex items-center space-x-2">*/}
            {/*                <Trophy className="h-5 w-5 text-green-500" />*/}
            {/*                <div>*/}
            {/*                    <p className="text-sm text-muted-foreground">Win Rate</p>*/}
            {/*                    <p className="text-2xl font-bold text-green-600">{winRate.toFixed(1)}%</p>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </CardContent>*/}
            {/*    </Card>*/}

            {/*    <Card>*/}
            {/*        <CardContent className="p-4">*/}
            {/*            <div className="flex items-center space-x-2">*/}
            {/*                <CheckCircle className="h-5 w-5 text-green-500" />*/}
            {/*                <div>*/}
            {/*                    <p className="text-sm text-muted-foreground">Won Tips</p>*/}
            {/*                    <p className="text-2xl font-bold text-green-600">{wonTips}</p>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </CardContent>*/}
            {/*    </Card>*/}

            {/*    <Card>*/}
            {/*        <CardContent className="p-4">*/}
            {/*            <div className="flex items-center space-x-2">*/}
            {/*                <Clock className="h-5 w-5 text-yellow-500" />*/}
            {/*                <div>*/}
            {/*                    <p className="text-sm text-muted-foreground">Pending</p>*/}
            {/*                    <p className="text-2xl font-bold text-yellow-600">{pendingTips}</p>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </CardContent>*/}
            {/*    </Card>*/}
            {/*</div>*/}

            <Tabs defaultValue="tips" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="tips">My Tips</TabsTrigger>
                    {/*<TabsTrigger value="packages">My Packages</TabsTrigger>*/}
                </TabsList>

                <TabsContent value="tips" className="space-y-4">
                    {/* Filters */}
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                                    <SelectTrigger className="w-full sm:w-[200px]">
                                        <SelectValue placeholder="Filter by type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Tips</SelectItem>
                                        <SelectItem value="free">Free Tips</SelectItem>
                                        <SelectItem value="premium">Premium Tips</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                    <SelectTrigger className="w-full sm:w-[200px]">
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="won">Won</SelectItem>
                                        <SelectItem value="lost">Lost</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Button variant="outline" className="w-full sm:w-auto">
                                    <Download className="mr-2 h-4 w-4" />
                                    Export Tips
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tips List */}
                    <div className="space-y-4">
                        {filteredTips.map((tip) => (
                            <Card key={tip.id} className="transition-shadow hover:shadow-md">
                                <CardContent className="p-4">
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                        <div className="flex-1">
                                            <div className="mb-2 flex items-center space-x-2">
                                                <h3 className="font-semibold">{tip.match.home_team} vs {tip.match.away_team}</h3>
                                                {/*{tip.isFree && (*/}
                                                {/*    <Badge variant="outline" className="border-green-600 text-green-600">*/}
                                                {/*        FREE*/}
                                                {/*    </Badge>*/}
                                                {/*)}*/}
                                            </div>

                                            <div
                                                className="mb-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                                <span className="flex items-center">
                                                    <Calendar className="mr-1 h-3 w-3" />
                                                    {tip.match.kickoff_at}
                                                </span>
                                                <span>{tip.match.league}</span>
                                                <Badge variant="outline"
                                                       className={`${getRiskLevelColor(tip.risk_level)} border-0`}>
                                                    {tip.risk_level.toUpperCase()} RISK
                                                </Badge>
                                            </div>

                                            <div className="flex items-center space-x-4">
                                                <div>
                                                    <p className="text-sm text-muted-foreground">prediction type</p>
                                                    <p className="font-medium">{tip.prediction_type}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Prediction</p>
                                                    <p className="font-medium">{getPredictionText(tip)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Odds</p>
                                                    <p className="font-medium">{tip.odds}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            <div className="text-center">
                                                {/*<p className="text-sm text-muted-foreground">Status</p>*/}
                                                <div className="flex items-center space-x-1">
                                                    {/*{getStatusIcon(tip.winningStatus)}*/}
                                                    {/*{getStatusBadge(tip.winningStatus)}*/}
                                                </div>
                                            </div>

                                            {/*<Button variant="outline" size="sm">*/}
                                            {/*    <Eye className="mr-2 h-4 w-4" />*/}
                                            {/*    View Details*/}
                                            {/*</Button>*/}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {filteredTips.length === 0 && (
                        <Card className="py-12 text-center">
                            <CardContent>
                                <Target className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                                <h3 className="mb-2 text-lg font-semibold">No tips found</h3>
                                <p className="mb-4 text-muted-foreground">
                                    {totalTips === 0 ? 'You haven\'t accessed any tips yet' : 'No tips match your current filters'}
                                </p>
                                <Button>Browse Packages</Button>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="packages" className="space-y-4">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {userPackages.map((pkg) => (
                            <Card key={pkg.id}
                                  className={`${pkg.status === 'active' ? 'ring-2 ring-green-500/30' : ''}`}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg">{pkg.name}</CardTitle>
                                        <Badge
                                            className={pkg.status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}>
                                            {pkg.status.toUpperCase()}
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">Purchased</p>
                                            <p className="font-medium">{new Date(pkg.purchaseDate).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Expires</p>
                                            <p className="font-medium">{new Date(pkg.expiryDate).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Win Rate</p>
                                            <p className="font-medium text-green-600">{pkg.winRate}%</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Price Paid</p>
                                            <p className="font-medium">KES {pkg.price}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="mb-1 flex justify-between text-sm">
                                            <span>Tips Accessed</span>
                                            <span>
                                                {pkg.tipsAccessed}/{pkg.totalTips}
                                            </span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                            <div
                                                className="h-2 rounded-full bg-orange-500 transition-all duration-300"
                                                style={{ width: `${(pkg.tipsAccessed / pkg.totalTips) * 100}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex space-x-2">
                                        <Button variant="outline" size="sm" className="flex-1">
                                            <Eye className="mr-2 h-4 w-4" />
                                            View Tips
                                        </Button>
                                        {pkg.status === 'expired' && (
                                            <Button size="sm" className="flex-1 bg-orange-500 hover:bg-orange-600">
                                                Renew Package
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {userPackages.length === 0 && (
                        <Card className="py-12 text-center">
                            <CardContent>
                                <Package className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                                <h3 className="mb-2 text-lg font-semibold">No packages purchased</h3>
                                <p className="mb-4 text-muted-foreground">Purchase a package to start accessing premium
                                    tips</p>
                                <Button>Browse Packages</Button>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
