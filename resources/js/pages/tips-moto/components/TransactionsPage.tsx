import { useState } from 'react';
import { Search, Calendar, Filter, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { TransactionDetailView } from './TransactionDetailView';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';


// Generate realistic transaction data for testing
const generateTransactionData = () => {
  const kenyanNames = [
    'Peter Kamau', 'Grace Wanjiku', 'John Mwangi', 'Sarah Njeri', 'David Kiprotich', 'Mary Akinyi',
    'James Wekesa', 'Catherine Wanjiru', 'Michael Kariuki', 'Faith Chebet', 'Samuel Ochieng',
    'Esther Wambui', 'Daniel Kipkoech', 'Rose Nafula', 'Joseph Mutua', 'Jane Muthoni',
    'Francis Otieno', 'Mercy Waithera', 'Robert Kosgei', 'Lydia Nyambura', 'Stephen Macharia',
    'Rebecca Kemunto', 'Patrick Wafula', 'Agnes Wairimu', 'Moses Rotich', 'Pauline Adhiambo',
    'Anthony Mungai', 'Beatrice Wanjala', 'Emmanuel Kigen', 'Priscilla Moraa', 'Vincent Njuguna',
    'Josephine Akoth', 'Geoffrey Leting', 'Eunice Waweru', 'Collins Mutinda', 'Winnie Cherono',
    'Kenneth Karanja', 'Doris Anyango', 'Martin Cheruiyot', 'Gladys Gathoni', 'Simon Mbugua',
    'Hellen Kerubo', 'Harrison Kibet', 'Joyce Wangui', 'Isaac Ondiek', 'Stella Wawira',
    'Brian Kiplagat', 'Millicent Auma', 'Felix Kamande', 'Violet Jeptoo', 'Kevin Mutiso',
    'Lillian Waweru', 'Edwin Kipchoge', 'Hannah Njoki', 'Oscar Ouma', 'Tabitha Chepkemoi',
    'Alex Maina', 'Gladys Mwende', 'Eric Bett', 'Caroline Wanjiru', 'Lawrence Njoroge',
    'Purity Wambui', 'Dennis Kiprotich', 'Rhoda Wanyonyi', 'George Kipruto', 'Alice Wanjiku',
    'Thomas Kimani', 'Edith Chelagat', 'Philip Okoth', 'Janet Wangari', 'Bernard Koech',
    'Susan Njambi', 'Nicholas Mutua', 'Zipporah Kemei', 'Jackson Ngungu', 'Bridget Wanjala',
    'Andrew Rutto', 'Lilian Wanjiru', 'Julius Wanyama', 'Christine Adhiambo', 'Timothy Kiptoo',
    'Margaret Wambui', 'Richard Oduya', 'Nancy Chebet', 'Paul Kiprotich', 'Dorcas Wanjiku',
    'Wilson Tanui', 'Evelyn Njeri', 'Christopher Otieno', 'Peris Wangeci', 'Abraham Kipkorir',
    'Florence Wairimu', 'Joshua Kiprop', 'Lydia Wanjiku', 'Elijah Muturi', 'Ruth Chepkemoi',
    'Benjamin Kosgei', 'Rosemary Wanjiru', 'Caleb Kiptui', 'Sharon Kemunto', 'Isaac Cheruiyot',
    'Diana Waweru', 'Moses Kiplagat', 'Eunice Wanjala', 'Daniel Rotich', 'Consolata Wambui',
    'Evans Kiprotich', 'Naomi Adhiambo', 'Mark Kipkoech', 'Beryl Wanjiru', 'Lucas Mutua',
    'Vivian Njeri', 'Samson Kigen', 'Irene Wangui', 'Elias Kiprop', 'Miriam Chebet',
    'Allan Mwangi', 'Charity Wanjiku', 'Norman Kibet', 'Salome Wairimu', 'Kelvin Ochieng',
    'Phyllis Waweru', 'Cornelius Rutto', 'Edna Njambi', 'Dickson Koech', 'Violet Wanjala'
  ];

  const packages = [
    'Mozzart daily jackpot', 'Mozzart weekly jackpot', 'Odi bets weekly jackpot',
    'Double Chances Daily', 'Double Chances Weekly', 'Full Time Scores Daily',
    'Full Time Scores Weekly', 'Goal-No Goal Daily', 'Goal-No Goal Weekly',
    'Premium VIP Daily', 'Premium VIP Weekly', 'Over 2.5 Goals Specialist',
    'Both Teams Score', 'Weekend Special', 'Champions League Tips',
    'Over/Under Market Daily', 'Market Daily Premium', 'Full Time Weekly',
    'Goals Market Daily', 'Correct Score Daily', 'Handicap Betting Weekly',
    'Live Betting Tips', 'Multi-Bet Combo', 'Sure Banker Tips'
  ];

  const packagePrices = {
    'Mozzart daily jackpot': 500,
    'Mozzart weekly jackpot': 3000,
    'Odi bets weekly jackpot': 2000,
    'Double Chances Daily': 300,
    'Double Chances Weekly': 1500,
    'Full Time Scores Daily': 400,
    'Full Time Scores Weekly': 2000,
    'Goal-No Goal Daily': 250,
    'Goal-No Goal Weekly': 1200,
    'Premium VIP Daily': 1000,
    'Premium VIP Weekly': 5000,
    'Over 2.5 Goals Specialist': 350,
    'Both Teams Score': 450,
    'Weekend Special': 2500,
    'Champions League Tips': 800,
    'Over/Under Market Daily': 300,
    'Market Daily Premium': 750,
    'Full Time Weekly': 1200,
    'Goals Market Daily': 450,
    'Correct Score Daily': 600,
    'Handicap Betting Weekly': 1800,
    'Live Betting Tips': 400,
    'Multi-Bet Combo': 350,
    'Sure Banker Tips': 500
  };

  const statuses = ['successful', 'failed', 'pending'];
  const statusWeights = [0.7, 0.25, 0.05]; // 70% successful, 25% failed, 5% pending

  // Generate dates for the last 30 days
  const generateDates = () => {
    const dates = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      dates.push(`${month}/${day}/${year}`);
    }
    return dates;
  };

  const dates = generateDates();

  const generateRandomReference = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const generateRandomTime = () => {
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  const generateRandomEmail = (name) => {
    const firstName = name.split(' ')[0].toLowerCase();
    const lastName = name.split(' ')[1].toLowerCase();
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'protonmail.com'];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const numbers = Math.floor(Math.random() * 999);
    return `${firstName}.${lastName}${numbers}@${domain}`;
  };

  const getWeightedRandomStatus = () => {
    const rand = Math.random();
    let cumulativeWeight = 0;
    
    for (let i = 0; i < statuses.length; i++) {
      cumulativeWeight += statusWeights[i];
      if (rand <= cumulativeWeight) {
        return statuses[i];
      }
    }
    return statuses[0];
  };

  const transactions = [];
  
  // Generate 180 transactions
  for (let i = 1; i <= 180; i++) {
    const name = kenyanNames[Math.floor(Math.random() * kenyanNames.length)];
    const packageName = packages[Math.floor(Math.random() * packages.length)];
    const basePrice = packagePrices[packageName];
    // Add some price variation (±20%)
    const priceVariation = (Math.random() - 0.5) * 0.4;
    const finalPrice = Math.round(basePrice * (1 + priceVariation));
    
    transactions.push({
      id: String(1200 - i), // Descending ID order
      user: name,
      email: generateRandomEmail(name),
      package: packageName,
      amount: finalPrice,
      date: dates[Math.floor(Math.random() * dates.length)],
      time: generateRandomTime(),
      status: getWeightedRandomStatus(),
      reference: generateRandomReference()
    });
  }

  // Sort by ID (descending) to show newest first
  return transactions.sort((a, b) => parseInt(b.id) - parseInt(a.id));
};

// Generate the transaction data
const transactionData = generateTransactionData();

export function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const itemsPerPage = 10;

  // Filter transactions based on search and status
  const filteredTransactions = transactionData.filter(transaction => {
    const matchesSearch = 
      transaction.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.package.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

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

  // Calculate daily stats (today's transactions)
  const today = new Date();
  const todayString = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;
  const todaysTransactions = transactionData.filter(t => t.date === todayString);
  const dailyCount = todaysTransactions.length;
  const dailyValue = todaysTransactions.reduce((sum, t) => sum + t.amount, 0);
  const failedTransactionsToday = todaysTransactions.filter(t => t.status === 'failed');
  const failedCountToday = failedTransactionsToday.length;
  const failedValueToday = failedTransactionsToday.reduce((sum, t) => sum + t.amount, 0);

  // Calculate weekly stats (last 7 days)
  const getDateDaysAgo = (days) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const last7Days = [];
  for (let i = 0; i < 7; i++) {
    last7Days.push(getDateDaysAgo(i));
  }

  const thisWeekTransactions = transactionData.filter(t => last7Days.includes(t.date));
  const weeklyCount = thisWeekTransactions.length;
  const weeklyValue = thisWeekTransactions.reduce((sum, t) => sum + t.amount, 0);

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'successful':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const handleExport = () => {
    // CSV Headers
    const headers = ['ID', 'User Name', 'Email', 'Package', 'Amount (KES)', 'Date', 'Time', 'Status', 'Reference'];
    
    // Convert filtered transactions to CSV format
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(transaction => [
        transaction.id,
        `"${transaction.user}"`, // Wrap in quotes to handle commas
        transaction.email,
        `"${transaction.package}"`,
        transaction.amount.toFixed(2),
        transaction.date,
        transaction.time,
        transaction.status,
        transaction.reference
      ].join(','))
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `tips-moto-transactions-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // If a transaction is selected, show the detail view
  if (selectedTransaction) {
    return (
      <TransactionDetailView 
        transaction={selectedTransaction}
        onBack={() => setSelectedTransaction(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">Transactions</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage all customer transactions</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline" size="icon">
            <Calendar className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleExport}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Transactions</CardTitle>
                <div className="flex items-center space-x-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="successful">Successful</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Package</TableHead>
                      <TableHead>Amount(Ksh)</TableHead>
                      <TableHead>Date/Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Reference</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTransactions.map((transaction) => (
                      <TableRow key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <TableCell className="font-medium">{transaction.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-black dark:text-white">{transaction.user}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{transaction.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{transaction.package}</div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">KES {transaction.amount.toFixed(2)}</span>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="text-sm">{transaction.date}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{transaction.time}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeStyle(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => setSelectedTransaction(transaction)}
                                className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono hover:bg-orange-100 dark:hover:bg-orange-900/20 hover:border-orange-300 dark:hover:border-orange-700 border border-transparent transition-all duration-200 cursor-pointer"
                              >
                                {transaction.reference}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Click to view transaction details
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
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
                      filteredTransactions.length,
                    )}{" "}
                    of {filteredTransactions.length} results
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
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Daily Summary */}
              <div>
                <h3 className="font-semibold text-black dark:text-white mb-3">Daily</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Transactions Count Today</span>
                    <span className="font-semibold text-black dark:text-white">{dailyCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Transactions Value</span>
                    <span className="font-semibold text-black dark:text-white">KES {dailyValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Failed Transactions Count</span>
                    <span className="font-semibold text-black dark:text-white">{failedCountToday}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Failed Transactions Value</span>
                    <span className="font-semibold text-black dark:text-white">KES {failedValueToday.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Weekly Summary */}
              <div>
                <h3 className="font-semibold text-black dark:text-white mb-3">Weekly</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Transactions Count This Week</span>
                    <span className="font-semibold text-black dark:text-white">{weeklyCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Transactions Value</span>
                    <span className="font-semibold text-black dark:text-white">KES {weeklyValue.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
