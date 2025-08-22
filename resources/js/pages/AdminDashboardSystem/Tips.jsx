import AdminLayout from '@/layouts/AdminLayout/adminLayout.jsx';
import { usePage } from '@inertiajs/react';

import { Search, Download, ChevronLeft, ChevronRight, Calendar, ToggleLeft, ToggleRight, ExternalLink, CheckCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Badge } from '../tips-moto/components/ui/badge';
import { toast } from 'sonner';
import { Button } from '../tips-moto/components/ui/button.js';
import { Card, CardContent, CardHeader, CardTitle } from '../tips-moto/components/ui/card.js';
import { Input } from '../tips-moto/components/ui/input.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../tips-moto/components/ui/select.js';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../tips-moto/components/ui/table.js';

export default function TipsPage() {
    const { matches, onTipUpdate, onViewHomepage } = usePage().props;

    return (<p>Here</p>)

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [riskFilter, setRiskFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [lastSaveTime, setLastSaveTime] = useState(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const itemsPerPage = 10;

    // Get today's date in the same format as match dates (e.g., "Jul 30 2025")
    const getTodayDateString = () => {
        const today = new Date();
        return today.toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
        });
    };

    // Extract all tips from all matches and combine with match data
    const allTips = useMemo(() => {
        const tips = [];

        matches.forEach((match) => {
            match.tipsData.forEach((tip) => {
                tips.push({
                    ...tip,
                    matchId: match.id,
                    league: match.league,
                    homeTeam: match.homeTeam,
                    awayTeam: match.awayTeam,
                    matchDate: match.date,
                    matchTime: match.time,
                    matchStatus: match.status,
                });
            });
        });

        return tips.sort((a, b) => b.matchId - a.matchId); // Sort by newest matches first
    }, [matches]);

    // Count today's free tips across all matches
    const countTodaysFreeTips = () => {
        const todayDateString = getTodayDateString();
        return allTips.filter((tip) => tip.matchDate === todayDateString && tip.free).length;
    };

    // Handle toggling free status for a tip
    const handleToggleFreeStatus = (tip) => {
        if (!onTipUpdate) return;

        const isToday = tip.matchDate === getTodayDateString();
        if (!isToday) {
            toast.error("Only today's tips can be marked as free");
            return;
        }

        const currentFreeTipsCount = countTodaysFreeTips();

        if (!tip.free) {
            // Trying to make a tip free
            if (currentFreeTipsCount >= 3) {
                toast.error('Daily Free Tip Limit Reached', {
                    description: 'You can only have 3 free tips per day.',
                });
                return;
            }
        }

        // Toggle the free status
        const updatedTip = { ...tip, free: !tip.free };
        onTipUpdate(tip.matchId, tip.id, { free: !tip.free });

        // Update save timestamp and reset unsaved changes
        setLastSaveTime(new Date());
        setHasUnsavedChanges(false);
    };

    // Filter tips based on search term and filters
    const filteredTips = useMemo(() => {
        return allTips.filter((tip) => {
            const matchesSearch =
                searchTerm === '' ||
                tip.league.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tip.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tip.awayTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tip.prediction.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tip.tipType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tip.matchId.toString().includes(searchTerm);

            const matchesStatus = statusFilter === 'all' || tip.winningStatus === statusFilter;
            const matchesRisk = riskFilter === 'all' || tip.riskLevel === riskFilter;

            // Date filter logic
            const matchesDate = dateFilter === 'all' || (dateFilter === 'today' && tip.matchDate === getTodayDateString());

            return matchesSearch && matchesStatus && matchesRisk && matchesDate;
        });
    }, [allTips, searchTerm, statusFilter, riskFilter, dateFilter]);

    // Paginate filtered tips
    const paginatedTips = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredTips.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredTips, currentPage]);

    const totalPages = Math.ceil(filteredTips.length / itemsPerPage);

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

    const getStatusColor = (status) => {
        switch (status) {
            case 'won':
                return 'bg-green-500';
            case 'lost':
                return 'bg-red-500';
            case 'pending':
                return 'bg-yellow-500';
            case 'void':
                return 'bg-gray-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getRiskColor = (risk) => {
        switch (risk) {
            case 'low':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'mid':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'high':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const handleExport = () => {
        // Create CSV content
        const headers = ['ID', 'League', 'Teams', 'Match Date', 'Match Time', 'Tips Type', 'Prediction', 'Risk Level', 'Status'];
        const csvContent = [
            headers.join(','),
            ...filteredTips.map((tip) =>
                [
                    tip.matchId,
                    `"${tip.league}"`,
                    `"${tip.homeTeam} vs ${tip.awayTeam}"`,
                    tip.matchDate,
                    tip.matchTime,
                    tip.tipType,
                    `"${tip.prediction}"`,
                    tip.riskLevel,
                    tip.winningStatus,
                ].join(','),
            ),
        ].join('\n');

        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tips-export.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Tips</h1>
                    {onTipUpdate && (
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Manage free tips for today - Maximum 3 free tips per day</p>
                    )}
                </div>
                <div className="flex items-center space-x-3">
                    <Button
                        variant={dateFilter === 'today' ? 'default' : 'outline'}
                        onClick={() => {
                            setDateFilter(dateFilter === 'today' ? 'all' : 'today');
                            setCurrentPage(1);
                        }}
                        className={dateFilter === 'today' ? 'bg-orange-500 text-white hover:bg-orange-600' : ''}
                    >
                        <Calendar className="mr-2 h-4 w-4" />
                        {dateFilter === 'today' ? 'Show All' : "Today's Tips"}
                    </Button>
                    {onViewHomepage && (
                        <Button
                            onClick={onViewHomepage}
                            variant="outline"
                            className="border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                        >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Homepage
                        </Button>
                    )}
                    <Button onClick={handleExport} className="bg-orange-500 text-white hover:bg-orange-600">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Free Tips Info Card */}
            {onTipUpdate && (
                <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-orange-100 dark:border-orange-800 dark:from-orange-900/20 dark:to-orange-800/20">
                    <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-orange-500">
                                <ToggleRight className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="mb-1 font-semibold text-orange-900 dark:text-orange-100">Free Tips Management</h3>
                                <p className="mb-2 text-sm text-orange-800 dark:text-orange-200">
                                    You can mark up to 3 tips as free per day. Only today's tips can be marked as free and will appear on the public
                                    homepage.
                                    <strong>All changes are automatically saved</strong> and will reflect immediately on the homepage.
                                </p>
                                <div className="flex items-center space-x-4 text-sm">
                                    <span className="text-orange-700 dark:text-orange-300">
                                        Today's Free Tips: <strong>{countTodaysFreeTips()}/3</strong>
                                    </span>
                                    <span className="text-orange-700 dark:text-orange-300">
                                        Use the toggle buttons in the Actions column to manage free status
                                    </span>
                                    {onViewHomepage && (
                                        <span className="text-orange-700 dark:text-orange-300">• Click "View Homepage" to see changes</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4 md:flex-row">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                <Input
                                    placeholder="Search by team, league, prediction, tip type, or match ID..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <Select
                            value={statusFilter}
                            onValueChange={(value) => {
                                setStatusFilter(value);
                                setCurrentPage(1);
                            }}
                        >
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="won">Won</SelectItem>
                                <SelectItem value="lost">Lost</SelectItem>
                                <SelectItem value="void">Void</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={riskFilter}
                            onValueChange={(value) => {
                                setRiskFilter(value);
                                setCurrentPage(1);
                            }}
                        >
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Risk Level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Risk</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="mid">Mid</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Results Summary */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {paginatedTips.length} of {filteredTips.length} tips
                    {dateFilter === 'today' && (
                        <span className="ml-2 rounded bg-orange-100 px-2 py-1 text-xs text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                            Today Only
                        </span>
                    )}
                </p>
                <div className="flex items-center space-x-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Today's Free Tips:
                        <span className="ml-1 rounded bg-green-100 px-2 py-1 text-xs text-green-800 dark:bg-green-900 dark:text-green-200">
                            {countTodaysFreeTips()}/3
                        </span>
                    </p>
                    <div className="flex items-center space-x-1 text-xs text-green-600 dark:text-green-400">
                        <CheckCircle className="h-3 w-3" />
                        <span>
                            {lastSaveTime
                                ? `Last saved: ${lastSaveTime.toLocaleTimeString('en-US', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      second: '2-digit',
                                      hour12: true,
                                  })}`
                                : 'Auto-saved'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Tips Table */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b border-gray-200 dark:border-gray-700">
                                    <TableHead className="text-left">ID</TableHead>
                                    <TableHead className="text-left">League</TableHead>
                                    <TableHead className="text-left">Teams</TableHead>
                                    <TableHead className="text-left">Match Times</TableHead>
                                    <TableHead className="text-left">Tips Type</TableHead>
                                    <TableHead className="text-left">Prediction</TableHead>
                                    <TableHead className="text-left">Risk</TableHead>
                                    <TableHead className="text-left">Status</TableHead>
                                    <TableHead className="text-left">Type</TableHead>
                                    <TableHead className="text-left">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedTips.map((tip, index) => (
                                    <TableRow key={`${tip.matchId}-${tip.id}`} className="border-b border-gray-100 dark:border-gray-800">
                                        <TableCell className="font-medium">{tip.matchId}</TableCell>
                                        <TableCell className="text-sm text-gray-600 dark:text-gray-400">{tip.league}</TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <div className="font-medium">Home: {tip.homeTeam}</div>
                                                <div className="text-gray-600 dark:text-gray-400">Away: {tip.awayTeam}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <div>{tip.matchDate}</div>
                                                <div className="text-gray-600 dark:text-gray-400">{tip.matchTime}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-xs">
                                                {tip.tipType}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm">{tip.prediction}</TableCell>
                                        <TableCell>
                                            <Badge className={`text-xs ${getRiskColor(tip.riskLevel)}`}>{tip.riskLevel.toUpperCase()}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`text-xs text-white ${getStatusColor(tip.winningStatus)}`}>{tip.winningStatus}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={tip.free ? 'default' : 'secondary'} className="text-xs">
                                                {tip.free ? 'Free' : 'Premium'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {tip.matchDate === getTodayDateString() && onTipUpdate ? (
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleToggleFreeStatus(tip)}
                                                        className={`h-8 px-3 ${
                                                            tip.free
                                                                ? 'bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-300 dark:hover:bg-orange-800'
                                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                                                        }`}
                                                        title={tip.free ? 'Click to mark as Premium' : 'Click to mark as Free'}
                                                    >
                                                        {tip.free ? (
                                                            <>
                                                                <ToggleRight className="mr-1 h-3 w-3" />
                                                                Free
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ToggleLeft className="mr-1 h-3 w-3" />
                                                                Premium
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            ) : (
                                                <span className="rounded bg-gray-50 px-2 py-1 text-xs text-gray-400 dark:bg-gray-800">
                                                    {tip.matchDate === getTodayDateString() ? 'Read Only' : 'Past/Future'}
                                                </span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {paginatedTips.length === 0 && (
                        <div className="py-8 text-center">
                            <p className="text-gray-500 dark:text-gray-400">No tips found matching your criteria.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t px-6 py-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTips.length)} of{' '}
                        {filteredTips.length} results
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        {generatePageNumbers().map((page, index) =>
                            page === '...' ? (
                                <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                                    ...
                                </span>
                            ) : (
                                <Button
                                    key={`page-${page}`}
                                    variant={currentPage === page ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setCurrentPage(page)}
                                    className={`h-8 w-8 p-0 ${currentPage === page ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
                                >
                                    {page}
                                </Button>
                            ),
                        )}

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

TipsPage.layout = (page) => <AdminLayout>{page}</AdminLayout>;
