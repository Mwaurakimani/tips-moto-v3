import { AlertTriangle, Calendar, CheckCircle, Clock, Download, Eye, Package, Target, Trophy, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";

async function fetchUserPackages(email, config = {}) {
    const { data } = await axios.get("/api/user-packages", {
        params: { email },
        ...config,
    });
    return data?.data ?? [];
}

// Helper functions
const fmtDate = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
};

const fmtOdds = (o) => (typeof o === 'number' ? o.toFixed(2) : '—');

const pct = (num, den) => {
    const n = Number(num ?? 0);
    const d = Number(den ?? 0);
    if (d <= 0) return 0;
    const p = (n / d) * 100;
    return Math.max(0, Math.min(100, p));
};

export function UserMyTips({ currentUserEmail, userTips, allMatches }) {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(null);
    const [userPackages, setUserPackages] = useState([]);
    const [showTipsModal, setShowTipsModal] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [mytips, setMyTips] = useState([]);

    useEffect(() => {
        if (!currentUserEmail) return;

        let ignore = false;
        const controller = new AbortController();

        (async () => {
            try {
                setLoading(true);
                const res = await fetchUserPackages(currentUserEmail, {
                    signal: controller.signal,
                });

                if (!ignore) setUserPackages(res);
            } catch (e) {
                if (!ignore && e?.name !== "AbortError")
                    setErr(e?.message ?? "Failed to load packages");
            } finally {
                if (!ignore) setLoading(false);
            }
        })();

        return () => {
            ignore = true;
            controller.abort();
        };
    }, [currentUserEmail]);

    useEffect(() => {
        const fetchTips = async () => {
            try {
                const response = await axios.get(route('fetchTipsApi', {
                    limit: 50
                }));
                setMyTips(response.data.data);
            } catch (error) {
                console.error('Error fetching tips:', error);
            }
        };

        fetchTips();
    }, []);

    // Use the props or fallback to state
    const displayTips = userTips && userTips.length > 0 ? userTips : mytips;

    // Filter tips based on selected filters
    const filteredTips = displayTips.filter(tip => {
        if (selectedFilter !== 'all') {
            if (selectedFilter === 'free' && !tip.is_free) return false;
            if (selectedFilter === 'premium' && tip.is_free) return false;
        }

        if (selectedStatus !== 'all') {
            if (selectedStatus !== tip.result) return false;
        }

        return true;
    });

    // Calculate statistics
    const totalTips = displayTips.length;
    const wonTips = displayTips.filter((tip) => tip.result === 'won').length;
    const lostTips = displayTips.filter((tip) => tip.result === 'lost').length;
    const pendingTips = displayTips.filter((tip) => tip.result === 'pending').length;
    const winRate = totalTips > 0 ? (wonTips / (wonTips + lostTips)) * 100 : 0;

    const getStatusIcon = (status) => {
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

    const getStatusBadge = (status) => {
        const variants = {
            won: 'bg-green-500 text-white',
            lost: 'bg-red-500 text-white',
            pending: 'bg-yellow-500 text-white',
            void: 'bg-gray-500 text-white',
        };

        return <Badge className={variants[status] || variants.void}>{status?.toUpperCase()}</Badge>;
    };

    const getRiskLevelColor = (riskLevel) => {
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

    function getPredictionText(tip) {
        if (!tip || !tip.prediction_type) return '';

        switch (tip.prediction_type) {
            case '1_X_2':
                switch (tip.prediction_value) {
                    case 1:
                        return 'Home Win';
                    case 0:
                        return 'Draw';
                    default:
                        return 'Away Win';
                }

            case '1X_X2_12':
                switch (tip.prediction_value) {
                    case 1:
                        return 'Home Win/Draw ';
                    case 0:
                        return 'Away Win/Draw';
                    default:
                        return 'Home Win/Away Win';
                }
            case 'GG-NG':
                switch (tip.prediction_value) {
                    case -1:
                        return 'GG';
                    default:
                        return 'NG';
                }
            default:
                return 'Unknown';
        }
    }

    return (
        <div className="space-y-6 pb-20 xl:pb-6">
            <Tabs defaultValue="tips" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="tips">My Tips</TabsTrigger>
                    <TabsTrigger value="packages">My Packages</TabsTrigger>
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
                                                <h3 className="font-semibold">
                                                    {tip.match?.home_team || 'Home Team'} vs {tip.match?.away_team || 'Away Team'}
                                                </h3>
                                                {/*{tip.is_free && (*/}
                                                {/*    <Badge variant="outline" className="border-green-600 text-green-600">*/}
                                                {/*        FREE*/}
                                                {/*    </Badge>*/}
                                                {/*)}*/}
                                            </div>

                                            <div className="mb-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                                <span className="flex items-center">
                                                    <Calendar className="mr-1 h-3 w-3" />
                                                    {tip.match?.kickoff_at || 'TBD'}
                                                </span>
                                                <span>{tip.match?.league?.name || 'League'}</span>
                                                {tip.risk_level && (
                                                    <Badge variant="outline" className={`${getRiskLevelColor(tip.risk_level)} border-0`}>
                                                        {tip.risk_level.toUpperCase()} RISK
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="flex items-center space-x-4">
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Prediction Type</p>
                                                    <p className="font-medium">{tip.prediction_type || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Prediction</p>
                                                    <p className="font-medium">{getPredictionText(tip)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Odds</p>
                                                    <p className="font-medium">{tip.odds || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            <Button variant="outline" size="sm">
                                                <Eye className="mr-2 h-4 w-4" />
                                                View Details
                                            </Button>
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
                                    {totalTips === 0 ? "You haven't accessed any tips yet" : 'No tips match your current filters'}
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="packages" className="space-y-4">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {userPackages.map((pkg) => (
                            <Card key={pkg.id} className={pkg.status === "active" ? "ring-2 ring-green-500/30" : ""}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg">{pkg.name}</CardTitle>
                                        <Badge className={pkg.status === "active" ? "bg-green-500 text-white" : "bg-gray-500 text-white"}>
                                            {pkg.status.toUpperCase()}
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">Purchased</p>
                                            <p className="font-medium">{fmtDate(pkg.purchaseDate)}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Expires</p>
                                            <p className="font-medium">{fmtDate(pkg.expiryDate)}</p>
                                        </div>

                                        {typeof parseInt(pkg.price) === "number" && (
                                            <div>
                                                <p className="text-muted-foreground">Price Paid</p>
                                                <p className="font-medium">KES {pkg.price}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => {
                                                setSelectedPackage(pkg);
                                                setShowTipsModal(true);
                                            }}
                                        >
                                            <Eye className="mr-2 h-4 w-4" />
                                            View Tips
                                        </Button>
                                        {pkg.status === "expired" && (
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
                                <p className="mb-4 text-muted-foreground">Purchase a package to start accessing premium tips</p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>

            <Dialog open={showTipsModal} onOpenChange={setShowTipsModal}>
                <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <DialogTitle>{selectedPackage?.name ?? "Package Tips"}</DialogTitle>
                                <DialogDescription>
                                    {selectedPackage?.status?.toUpperCase()} •
                                    {" "}Purchased: {fmtDate(selectedPackage?.purchaseDate)} •
                                    {" "}Expires: {fmtDate(selectedPackage?.expiryDate)}
                                </DialogDescription>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setShowTipsModal(false)}>Close</Button>
                        </div>
                    </DialogHeader>

                    <div className="flex-1 overflow-auto space-y-4">
                        {(selectedPackage?.tipsData ?? []).length === 0 ? (
                            <Card className="py-12 text-center">
                                <CardContent>
                                    <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">No tips in this package</h3>
                                    <p className="text-muted-foreground">This package has no tips listed yet.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-3">
                                {(selectedPackage?.tipsData ?? []).map((tip) => (
                                    <Card key={tip.id} className="hover:shadow-sm transition-shadow">
                                        <CardContent className="p-4">
                                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-semibold">{tip.match}</h3>
                                                        {tip.isFree && (
                                                            <Badge variant="outline" className="text-green-600 border-green-600">FREE</Badge>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-4 mb-2">
                                                        {tip.time && (
                                                            <span className="flex items-center">
                                                                <Calendar className="h-3 w-3 mr-1" />
                                                                {tip.time}
                                                            </span>
                                                        )}
                                                        {tip.league && <span>{tip.league}</span>}
                                                        {tip.riskLevel && (
                                                            <Badge variant="outline" className={`${getRiskLevelColor(tip.riskLevel)} border-0`}>
                                                                {tip.riskLevel.toUpperCase()} RISK
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-6">
                                                        <div>
                                                            <p className="text-xs text-muted-foreground">Prediction</p>
                                                            <p className="font-medium">{tip.prediction}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-muted-foreground">Odds</p>
                                                            <p className="font-medium">{fmtOdds(tip.odds)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <Button variant="outline" size="sm">View Details</Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
