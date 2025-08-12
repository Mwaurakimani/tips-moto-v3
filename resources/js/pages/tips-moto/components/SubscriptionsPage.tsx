import { useState } from 'react';
import { Search, Filter, Download, Plus, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { PackageDetailView } from './PackageDetailView';
import { AddPackageDialog } from './AddPackageDialog';

// Define subscription interface
interface Subscription {
  id: number;
  name: string;
  date: string;
  description: string;
  tips: number;
  status: string;
  price: number;
  duration: string;
  tipsData?: any[]; // Array of actual betting tips for this package
}

interface SubscriptionsPageProps {
  availableTips?: any[];
}

// Helper function to generate package-specific tips
const generatePackageTips = (packageType: string, packageName: string, tipCount: number) => {
  const winningStatuses = ['pending', 'won', 'lost', 'void'];
  const winningStatusWeights = [0.2, 0.6, 0.15, 0.05]; // 60% won, 20% pending, 15% lost, 5% void
  
  const getWeightedRandomStatus = () => {
    const rand = Math.random();
    let cumulativeWeight = 0;
    
    for (let i = 0; i < winningStatuses.length; i++) {
      cumulativeWeight += winningStatusWeights[i];
      if (rand <= cumulativeWeight) {
        return winningStatuses[i];
      }
    }
    return winningStatuses[0];
  };

  const tips = [];
  
  // Define package-specific tip types
  let availableTips: any[] = [];
  
  switch (packageType) {
    case 'fulltime':
      availableTips = [
        { type: '1', subType: 'Home Win', value: '1', riskLevel: 'mid', prediction: 'Home Win' },
        { type: 'X', subType: 'Draw', value: 'X', riskLevel: 'high', prediction: 'Draw' },
        { type: '2', subType: 'Away Win', value: '2', riskLevel: 'mid', prediction: 'Away Win' },
        { type: '1X', subType: 'Home or Draw', value: '1X', riskLevel: 'low', prediction: 'Home Win or Draw' },
        { type: '12', subType: 'Home or Away', value: '12', riskLevel: 'low', prediction: 'Home Win or Away Win' },
        { type: 'X2', subType: 'Draw or Away', value: 'X2', riskLevel: 'low', prediction: 'Draw or Away Win' }
      ];
      break;
      
    case 'overunder':
      availableTips = [
        { type: 'Over 0.5', subType: 'Goals', value: 'Over 0.5', riskLevel: 'low', prediction: 'Over 0.5 Goals' },
        { type: 'Over 1.5', subType: 'Goals', value: 'Over 1.5', riskLevel: 'low', prediction: 'Over 1.5 Goals' },
        { type: 'Under 1.5', subType: 'Goals', value: 'Under 1.5', riskLevel: 'high', prediction: 'Under 1.5 Goals' },
        { type: 'Over 2.5', subType: 'Goals', value: 'Over 2.5', riskLevel: 'mid', prediction: 'Over 2.5 Goals' },
        { type: 'Under 2.5', subType: 'Goals', value: 'Under 2.5', riskLevel: 'mid', prediction: 'Under 2.5 Goals' },
        { type: 'Over 3.5', subType: 'Goals', value: 'Over 3.5', riskLevel: 'high', prediction: 'Over 3.5 Goals' },
        { type: 'Under 3.5', subType: 'Goals', value: 'Under 3.5', riskLevel: 'low', prediction: 'Under 3.5 Goals' }
      ];
      break;
      
    case 'jackpot':
      // Jackpots use a mix of all tip types since they cover multiple fixtures
      availableTips = [
        { type: '1', subType: 'Home Win', value: '1', riskLevel: 'mid', prediction: 'Home Win' },
        { type: 'X', subType: 'Draw', value: 'X', riskLevel: 'high', prediction: 'Draw' },
        { type: '2', subType: 'Away Win', value: '2', riskLevel: 'mid', prediction: 'Away Win' },
        { type: '1X', subType: 'Home or Draw', value: '1X', riskLevel: 'low', prediction: 'Home Win or Draw' },
        { type: '12', subType: 'Home or Away', value: '12', riskLevel: 'low', prediction: 'Home Win or Away Win' },
        { type: 'X2', subType: 'Draw or Away', value: 'X2', riskLevel: 'low', prediction: 'Draw or Away Win' }
      ];
      break;
      
    case 'specialized':
      availableTips = [
        { type: 'GG', subType: 'Both Teams Score', value: 'GG', riskLevel: 'mid', prediction: 'Both Teams Score' },
        { type: 'NG', subType: 'Clean Sheet', value: 'NG', riskLevel: 'mid', prediction: 'Clean Sheet' },
        { type: 'Over 2.5', subType: 'Goals', value: 'Over 2.5', riskLevel: 'mid', prediction: 'Over 2.5 Goals' },
        { type: '1X', subType: 'Home or Draw', value: '1X', riskLevel: 'low', prediction: 'Home Win or Draw' },
        { type: '12', subType: 'Home or Away', value: '12', riskLevel: 'low', prediction: 'Home Win or Away Win' },
        { type: 'X2', subType: 'Draw or Away', value: 'X2', riskLevel: 'low', prediction: 'Draw or Away Win' }
      ];
      break;
      
    case 'premium':
      availableTips = [
        { type: 'Correct Score', subType: '2-1', value: '2-1', riskLevel: 'high', prediction: 'Correct Score 2-1' },
        { type: 'Correct Score', subType: '1-0', value: '1-0', riskLevel: 'high', prediction: 'Correct Score 1-0' },
        { type: 'Correct Score', subType: '2-0', value: '2-0', riskLevel: 'high', prediction: 'Correct Score 2-0' },
        { type: 'HT/FT', subType: '1/1', value: '1/1', riskLevel: 'high', prediction: 'Half-Time/Full-Time 1/1' },
        { type: 'HT/FT', subType: '1/X', value: '1/X', riskLevel: 'high', prediction: 'Half-Time/Full-Time 1/X' },
        { type: 'HT/FT', subType: 'X/1', value: 'X/1', riskLevel: 'high', prediction: 'Half-Time/Full-Time X/1' }
      ];
      break;
      
    default:
      availableTips = [
        { type: '1', subType: 'Home Win', value: '1', riskLevel: 'mid', prediction: 'Home Win' },
        { type: 'Over 2.5', subType: 'Goals', value: 'Over 2.5', riskLevel: 'mid', prediction: 'Over 2.5 Goals' },
        { type: 'GG', subType: 'Both Teams Score', value: 'GG', riskLevel: 'mid', prediction: 'Both Teams Score' }
      ];
  }

  // Sample match fixtures for realistic tips
  const sampleMatches = [
    { home: 'Manchester United', away: 'Liverpool', league: 'English Premier League' },
    { home: 'Real Madrid', away: 'Barcelona', league: 'Spanish La Liga' },
    { home: 'Bayern Munich', away: 'Borussia Dortmund', league: 'German Bundesliga' },
    { home: 'Juventus', away: 'Inter Milan', league: 'Italian Serie A' },
    { home: 'Paris Saint-Germain', away: 'Marseille', league: 'French Ligue 1' },
    { home: 'Arsenal', away: 'Chelsea', league: 'English Premier League' },
    { home: 'Atletico Madrid', away: 'Sevilla', league: 'Spanish La Liga' },
    { home: 'AC Milan', away: 'Napoli', league: 'Italian Serie A' },
    { home: 'Manchester City', away: 'Tottenham', league: 'English Premier League' },
    { home: 'RB Leipzig', away: 'Bayer Leverkusen', league: 'German Bundesliga' },
    { home: 'Valencia', away: 'Villarreal', league: 'Spanish La Liga' },
    { home: 'AS Roma', away: 'Lazio', league: 'Italian Serie A' },
    { home: 'Monaco', away: 'Lyon', league: 'French Ligue 1' },
    { home: 'Ajax', away: 'PSV Eindhoven', league: 'Dutch Eredivisie' },
    { home: 'Benfica', away: 'Porto', league: 'Portuguese Primeira Liga' },
    { home: 'Flamengo', away: 'Palmeiras', league: 'Brazilian Serie A' },
    { home: 'Boca Juniors', away: 'River Plate', league: 'Argentine Primera División' },
    { home: 'LA Galaxy', away: 'LAFC', league: 'MLS' }
  ];

  // Generate actual tips
  for (let i = 0; i < tipCount; i++) {
    const match = sampleMatches[i % sampleMatches.length];
    const tipTemplate = availableTips[i % availableTips.length];
    
    // Generate realistic odds based on risk level
    const getOddsForRisk = (riskLevel: string) => {
      switch (riskLevel) {
        case 'low': return (1.15 + Math.random() * 0.65).toFixed(2); // 1.15 - 1.80
        case 'mid': return (1.75 + Math.random() * 1.25).toFixed(2); // 1.75 - 3.00
        case 'high': return (2.8 + Math.random() * 4.2).toFixed(2); // 2.80 - 7.00
        default: return '2.10';
      }
    };

    tips.push({
      id: Date.now() + Math.random() * 1000 + i,
      match: `${match.home} vs ${match.away}`,
      league: match.league,
      homeTeam: match.home,
      awayTeam: match.away,
      tipType: tipTemplate.type,
      subType: tipTemplate.subType,
      value: tipTemplate.value,
      prediction: tipTemplate.prediction,
      odds: getOddsForRisk(tipTemplate.riskLevel),
      riskLevel: tipTemplate.riskLevel,
      winningStatus: getWeightedRandomStatus(),
      analysisReason: generateAnalysisReason(tipTemplate.type, match),
      confidence: getConfidenceLevel(tipTemplate.riskLevel),
      expectedReturn: calculateExpectedReturn(parseFloat(getOddsForRisk(tipTemplate.riskLevel))),
      time: getRandomMatchTime(),
      date: getRandomMatchDate(),
      free: false // All package tips are premium
    });
  }

  return tips;
};

// Helper function to generate analysis reasoning
const generateAnalysisReason = (tipType: string, match: any) => {
  const reasons = {
    '1': [`${match.home} has strong home record`, `Recent form favors ${match.home}`, `${match.home} dominates head-to-head`],
    '2': [`${match.away} excellent away form`, `Key players back for ${match.away}`, `${match.away} needs the points`],
    'X': ['Evenly matched teams', 'Both teams cautious approach', 'Historical draws in this fixture'],
    'Over 2.5': ['Both teams score freely', 'Weak defenses on display', 'Open attacking gameplay expected'],
    'Under 2.5': ['Strong defensive records', 'Tactical battle expected', 'Low-scoring recent meetings'],
    'GG': ['Both teams have scoring threats', 'Defensive vulnerabilities', 'Previous meetings high-scoring'],
    'NG': ['Strong defensive form', 'One team lacks firepower', 'Clean sheet specialists'],
    '1X': ['Home advantage with safety net', 'Avoiding away defeat crucial', 'Conservative approach expected'],
    '12': ['Clear favorite vs underdog', 'Draw unlikely scenario', 'One team must win'],
    'X2': ['Away team in good form', 'Home team struggles', 'Visitor with point to prove']
  };
  
  const tipReasons = reasons[tipType as keyof typeof reasons] || ['Professional analysis suggests this outcome'];
  return tipReasons[Math.floor(Math.random() * tipReasons.length)];
};

// Helper function to get confidence level
const getConfidenceLevel = (riskLevel: string) => {
  switch (riskLevel) {
    case 'low': return Math.floor(Math.random() * 10) + 85; // 85-95%
    case 'mid': return Math.floor(Math.random() * 15) + 70; // 70-85%
    case 'high': return Math.floor(Math.random() * 15) + 55; // 55-70%
    default: return 75;
  }
};

// Helper function to calculate expected return
const calculateExpectedReturn = (odds: number) => {
  return `${((odds - 1) * 100).toFixed(0)}%`;
};

// Helper function to get random match time
const getRandomMatchTime = () => {
  const times = [
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
    '6:00 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM'
  ];
  return times[Math.floor(Math.random() * times.length)];
};

// Helper function to get random match date (next 7 days)
const getRandomMatchDate = () => {
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + Math.floor(Math.random() * 7) + 1);
  
  return futureDate.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  });
};

// Generate subscription packages data - Real packages currently being sold
const generateSubscriptions = (): Subscription[] => {
  const currentDate = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
  
  const packages = [
    // Full-Time Scores Packages
    {
      id: 1435,
      name: 'Full-Time Scores Daily',
      date: currentDate,
      description: 'match',
      tips: 15,
      status: 'Active',
      price: 99,
      duration: 'Daily',
      tipsData: generatePackageTips('fulltime', 'Full-Time Scores Daily', 15)
    },
    {
      id: 1436,
      name: 'Full-Time Scores Weekly',
      date: currentDate,
      description: 'match',
      tips: 17, // 17 tips per day
      status: 'Active',
      price: 599,
      duration: 'Weekly',
      tipsData: generatePackageTips('fulltime', 'Full-Time Scores Weekly', 17)
    },
    
    // Over & Under Markets Packages
    {
      id: 1437,
      name: 'Over & Under Markets Daily',
      date: currentDate,
      description: 'match',
      tips: 5,
      status: 'Active',
      price: 29,
      duration: 'Daily',
      tipsData: generatePackageTips('overunder', 'Over & Under Markets Daily', 5)
    },
    {
      id: 1438,
      name: 'Over & Under Markets Weekly',
      date: currentDate,
      description: 'match',
      tips: 7, // 7 tips per day
      status: 'Active',
      price: 199,
      duration: 'Weekly',
      tipsData: generatePackageTips('overunder', 'Over & Under Markets Weekly', 7)
    },
    
    // Jackpot Tips Packages
    {
      id: 1439,
      name: 'Mega Jackpot Prediction',
      date: currentDate,
      description: 'jackpot',
      tips: 15, // Typically 15-20 fixtures for jackpots
      status: 'Active',
      price: 49,
      duration: 'Weekly',
      tipsData: generatePackageTips('jackpot', 'Mega Jackpot Prediction', 15)
    },
    {
      id: 1440,
      name: 'Daily Jackpot Premium',
      date: currentDate,
      description: 'jackpot',
      tips: 13, // Daily jackpot fixture count
      status: 'Active',
      price: 39,
      duration: 'Daily',
      tipsData: generatePackageTips('jackpot', 'Daily Jackpot Premium', 13)
    },
    {
      id: 1441,
      name: 'Mid-Week Jackpot',
      date: currentDate,
      description: 'jackpot',
      tips: 16, // Mid-week jackpot fixture count
      status: 'Active',
      price: 49,
      duration: 'Weekly',
      tipsData: generatePackageTips('jackpot', 'Mid-Week Jackpot', 16)
    },
    {
      id: 1442,
      name: 'Weekly Jackpot Premium',
      date: currentDate,
      description: 'jackpot',
      tips: 17, // Weekly jackpot fixture count
      status: 'Active',
      price: 29,
      duration: 'Weekly',
      tipsData: generatePackageTips('jackpot', 'Weekly Jackpot Premium', 17)
    },
    
    // Additional specialized packages (keeping some variety)
    {
      id: 1443,
      name: 'Both Teams Score Daily',
      date: currentDate,
      description: 'match',
      tips: 8,
      status: 'Active',
      price: 39,
      duration: 'Daily',
      tipsData: generatePackageTips('specialized', 'Both Teams Score Daily', 8)
    },
    {
      id: 1444,
      name: 'Goal Goal/No Goal Weekly',
      date: currentDate,
      description: 'match',
      tips: 10,
      status: 'Active',
      price: 149,
      duration: 'Weekly',
      tipsData: generatePackageTips('specialized', 'Goal Goal/No Goal Weekly', 10)
    },
    {
      id: 1445,
      name: 'Double Chance Daily',
      date: currentDate,
      description: 'match',
      tips: 12,
      status: 'Active',
      price: 69,
      duration: 'Daily',
      tipsData: generatePackageTips('specialized', 'Double Chance Daily', 12)
    },
    {
      id: 1446,
      name: 'Correct Score Weekly',
      date: currentDate,
      description: 'premium',
      tips: 8,
      status: 'Active',
      price: 299,
      duration: 'Weekly',
      tipsData: generatePackageTips('premium', 'Correct Score Weekly', 8)
    },
    {
      id: 1447,
      name: 'Weekend Accumulator',
      date: currentDate,
      description: 'premium',
      tips: 15,
      status: 'Active',
      price: 199,
      duration: 'Weekly',
      tipsData: generatePackageTips('premium', 'Weekend Accumulator', 15)
    },
    {
      id: 1448,
      name: 'Champions League Special',
      date: currentDate,
      description: 'premium',
      tips: 8,
      status: 'Active',
      price: 99,
      duration: 'Weekly',
      tipsData: generatePackageTips('premium', 'Champions League Special', 8)
    },
    {
      id: 1449,
      name: 'Premier League Focus',
      date: currentDate,
      description: 'premium',
      tips: 10,
      status: 'Active',
      price: 149,
      duration: 'Weekly',
      tipsData: generatePackageTips('premium', 'Premier League Focus', 10)
    }
  ];

  return packages;
};

export function SubscriptionsPage({ availableTips = [] }: SubscriptionsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [descriptionFilter, setDescriptionFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(generateSubscriptions());
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [showAddPackageDialog, setShowAddPackageDialog] = useState(false);
  const itemsPerPage = 10;

  // Filter subscriptions based on search and filters
  const filteredSubscriptions = subscriptions.filter(subscription => {
    const matchesSearch = subscription.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subscription.id.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || subscription.status.toLowerCase() === statusFilter;
    const matchesDescription = descriptionFilter === 'all' || subscription.description === descriptionFilter;
    
    return matchesSearch && matchesStatus && matchesDescription;
  });

  // Pagination
  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSubscriptions = filteredSubscriptions.slice(startIndex, endIndex);

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisible = 10;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 5) {
        for (let i = 1; i <= 8; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 4) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 7; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const getStatusBadge = (status: string) => {
    return status === 'Active' 
      ? <Badge className="bg-green-600 text-white">Active</Badge>
      : <Badge variant="secondary">Inactive</Badge>;
  };

  const getDescriptionBadge = (description: string) => {
    switch (description) {
      case 'jackpot':
        return <Badge className="bg-purple-600 text-white">Jackpot</Badge>;
      case 'match':
        return <Badge className="bg-blue-600 text-white">Match</Badge>;
      case 'premium':
        return <Badge className="bg-yellow-600 text-white">Premium</Badge>;
      default:
        return <Badge variant="secondary">{description}</Badge>;
    }
  };

  const handleExport = () => {
    // CSV Headers
    const headers = ['ID', 'Name', 'Date', 'Description', 'Tips Count', 'Price (KES)', 'Duration', 'Status'];
    
    // Convert filtered subscriptions to CSV format
    const csvContent = [
      headers.join(','),
      ...filteredSubscriptions.map(subscription => [
        subscription.id,
        `"${subscription.name}"`, // Wrap in quotes to handle commas
        subscription.date,
        subscription.description,
        subscription.tips,
        subscription.price,
        subscription.duration,
        subscription.status
      ].join(','))
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `tips-moto-subscriptions-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpdateSubscription = (updatedSubscription: Subscription) => {
    setSubscriptions(prev => prev.map(sub => 
      sub.id === updatedSubscription.id ? updatedSubscription : sub
    ));
  };

  const handleDeleteSubscription = (subscriptionId: number) => {
    setSubscriptions(prev => prev.filter(sub => sub.id !== subscriptionId));
  };

  const handleViewPackage = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
  };

  const handleBackToPackages = () => {
    setSelectedSubscription(null);
  };

  const handleAddPackage = (packageData: Omit<Subscription, 'id'>) => {
    // Generate a new ID (find the highest existing ID and add 1)
    const maxId = Math.max(...subscriptions.map(s => s.id), 1434);
    const newId = maxId + 1;

    const newPackage = {
      id: newId,
      ...packageData
    };

    setSubscriptions(prev => [newPackage, ...prev]);
    setShowAddPackageDialog(false);
  };

  const handleShowAddPackage = () => {
    setShowAddPackageDialog(true);
  };

  const handleCloseAddPackage = () => {
    setShowAddPackageDialog(false);
  };

  // If a subscription is selected, show the detail view
  if (selectedSubscription) {
    return (
      <PackageDetailView
        subscription={selectedSubscription}
        onBack={handleBackToPackages}
        onUpdateSubscription={handleUpdateSubscription}
        onDeleteSubscription={handleDeleteSubscription}
        availableTips={availableTips}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">All Selections</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your subscription packages and pricing
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleExport} className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Button 
            onClick={handleShowAddPackage}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Package</span>
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Subscription Packages ({filteredSubscriptions.length})</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Controls */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search packages..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={descriptionFilter} onValueChange={(value) => {
              setDescriptionFilter(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="jackpot">Jackpot</SelectItem>
                <SelectItem value="match">Match</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Subscriptions Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-left">ID</TableHead>
                  <TableHead className="text-left">Name</TableHead>
                  <TableHead className="text-left">For</TableHead>
                  <TableHead className="text-left">Description</TableHead>
                  <TableHead className="text-left">Tips</TableHead>
                  <TableHead className="text-left">Price</TableHead>
                  <TableHead className="text-left">Duration</TableHead>
                  <TableHead className="text-left">Status</TableHead>
                  <TableHead className="text-right">View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentSubscriptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12 text-gray-500 dark:text-gray-400">
                      No subscription packages found
                    </TableCell>
                  </TableRow>
                ) : (
                  currentSubscriptions.map((subscription) => (
                    <TableRow key={subscription.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <TableCell className="font-medium">{subscription.id}</TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {subscription.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {subscription.date}
                      </TableCell>
                      <TableCell>
                        {getDescriptionBadge(subscription.description)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {subscription.tips}
                      </TableCell>
                      <TableCell className="font-medium text-green-600">
                        KES {subscription.price.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{subscription.duration}</Badge>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(subscription.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewPackage(subscription)}
                          className="flex items-center space-x-2"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {startIndex + 1} to{" "}
                {Math.min(
                  startIndex + itemsPerPage,
                  filteredSubscriptions.length,
                )}{" "}
                of {filteredSubscriptions.length} results
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage(Math.max(1, currentPage - 1))
                  }
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {generatePageNumbers().map((page, index) => (
                  page === '...' ? (
                    <span key={index} className="px-2 text-gray-400">...</span>
                  ) : (
                    <Button
                      key={index}
                      variant={
                        currentPage === page
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => setCurrentPage(page as number)}
                      className={`h-8 w-8 p-0 ${currentPage === page ? "bg-orange-500 hover:bg-orange-600" : ""}`}
                    >
                      {page}
                    </Button>
                  )
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Package Dialog */}
      <AddPackageDialog
        open={showAddPackageDialog}
        onClose={handleCloseAddPackage}
        onAddPackage={handleAddPackage}
      />
    </div>
  );
}
