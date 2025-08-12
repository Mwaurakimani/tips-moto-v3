import { useState } from 'react';
import { 
  Target, 
  Calendar, 
  Trophy, 
  XCircle, 
  Clock, 
  Filter,
  Eye,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Package,
  Star,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface UserMyTipsProps {
  allMatches: any[];
  currentUser: any;
}

export function UserMyTips({ allMatches, currentUser }: UserMyTipsProps) {
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

  // Generate user's accessible tips from matches
  const getUserTips = () => {
    const userTips: any[] = [];
    
    allMatches.forEach(match => {
      match.tipsData?.forEach((tip: any) => {
        // User can access free tips or if they have an active subscription
        const hasAccess = tip.free || currentUser.subscriptionStatus === 'active';
        
        if (hasAccess) {
          userTips.push({
            id: tip.id,
            matchId: match.id,
            match: `${match.homeTeam} vs ${match.awayTeam}`,
            league: match.league,
            date: match.date,
            time: match.time,
            prediction: tip.prediction,
            tipType: tip.tipType,
            riskLevel: tip.riskLevel,
            winningStatus: tip.winningStatus,
            isFree: tip.free,
            odds: Math.random() * 3 + 1.2, // Mock odds
            accessDate: match.date // When user accessed the tip
          });
        }
      });
    });

    return userTips.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const userTips = getUserTips();
  
  // Filter tips based on selected filters
  const filteredTips = userTips.filter(tip => {
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'free' && tip.isFree) ||
      (selectedFilter === 'premium' && !tip.isFree);
    
    const matchesStatus = selectedStatus === 'all' || tip.winningStatus === selectedStatus;
    
    return matchesFilter && matchesStatus;
  });

  // Calculate statistics
  const totalTips = userTips.length;
  const wonTips = userTips.filter(tip => tip.winningStatus === 'won').length;
  const lostTips = userTips.filter(tip => tip.winningStatus === 'lost').length;
  const pendingTips = userTips.filter(tip => tip.winningStatus === 'pending').length;
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
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.void}>
        {status.toUpperCase()}
      </Badge>
    );
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

  return (
    <div className="space-y-6 pb-20 xl:pb-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Tips</p>
                <p className="text-2xl font-bold">{totalTips}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Win Rate</p>
                <p className="text-2xl font-bold text-green-600">{winRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Won Tips</p>
                <p className="text-2xl font-bold text-green-600">{wonTips}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingTips}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tips" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tips">My Tips</TabsTrigger>
          <TabsTrigger value="packages">My Packages</TabsTrigger>
        </TabsList>

        <TabsContent value="tips" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
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
                  <Download className="h-4 w-4 mr-2" />
                  Export Tips
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tips List */}
          <div className="space-y-4">
            {filteredTips.map((tip) => (
              <Card key={`${tip.matchId}-${tip.id}`} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{tip.match}</h3>
                        {tip.isFree && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            FREE
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-2">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {tip.date} at {tip.time}
                        </span>
                        <span>{tip.league}</span>
                        <Badge 
                          variant="outline" 
                          className={`${getRiskLevelColor(tip.riskLevel)} border-0`}
                        >
                          {tip.riskLevel.toUpperCase()} RISK
                        </Badge>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Prediction</p>
                          <p className="font-medium">{tip.prediction}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Odds</p>
                          <p className="font-medium">{tip.odds.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Status</p>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(tip.winningStatus)}
                          {getStatusBadge(tip.winningStatus)}
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTips.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No tips found</h3>
                <p className="text-muted-foreground mb-4">
                  {totalTips === 0 
                    ? "You haven't accessed any tips yet"
                    : "No tips match your current filters"
                  }
                </p>
                <Button>Browse Packages</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="packages" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {userPackages.map((pkg) => (
              <Card key={pkg.id} className={`${pkg.status === 'active' ? 'ring-2 ring-green-500/30' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{pkg.name}</CardTitle>
                    <Badge 
                      className={pkg.status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}
                    >
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
                    <div className="flex justify-between text-sm mb-1">
                      <span>Tips Accessed</span>
                      <span>{pkg.tipsAccessed}/{pkg.totalTips}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(pkg.tipsAccessed / pkg.totalTips) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
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
            <Card className="text-center py-12">
              <CardContent>
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No packages purchased</h3>
                <p className="text-muted-foreground mb-4">
                  Purchase a package to start accessing premium tips
                </p>
                <Button>Browse Packages</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
