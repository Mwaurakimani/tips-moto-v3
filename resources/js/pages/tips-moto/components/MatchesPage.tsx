import { useState, useMemo } from 'react';
import { Search, Filter, Download, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { AddMatchDialog } from './AddMatchDialog';
import { MatchDetailView } from '@/pages/AdminDashboardSystem/Matches/MatchDetailView';

const MATCHES_PER_PAGE = 10;

interface MatchesPageProps {
  matches: any[];
  onAddMatch: (matchData: {
    league: string;
    homeTeam: string;
    awayTeam: string;
    date: string;
    time: string;
    status: string;
  }) => void;
  onMatchSave: (matchId: number, updatedFields: Partial<{
    league: string;
    homeTeam: string;
    awayTeam: string;
    date: string;
    time: string;
  }>) => void;
  onTipsUpdate: (matchId: number, newTips: any[]) => void;
}

export function MatchesPage({ matches, onAddMatch, onMatchSave, onTipsUpdate }: MatchesPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);

  const filteredMatches = useMemo(() => {
    return matches.filter(match => {
      const matchesSearch = match.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           match.awayTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           match.id.toString().includes(searchTerm);
      const matchesStatus = selectedStatus === 'All' || match.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [matches, searchTerm, selectedStatus]);

  const totalPages = Math.ceil(filteredMatches.length / MATCHES_PER_PAGE);
  const startIndex = (currentPage - 1) * MATCHES_PER_PAGE;
  const paginatedMatches = filteredMatches.slice(startIndex, startIndex + MATCHES_PER_PAGE);

  // Reset to page 1 when filters change
  const handleFilterChange = (newStatus: string) => {
    setSelectedStatus(newStatus);
    setCurrentPage(1);
    setFilterOpen(false);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleViewMatch = (matchId: number) => {
    const match = matches.find(m => m.id === matchId);
    if (match) {
      setSelectedMatch(match);
    }
  };

  const handleBackToMatches = () => {
    setSelectedMatch(null);
  };

  const handleExport = () => {
    // CSV Headers
    const headers = ['ID', 'League', 'Home Team', 'Away Team', 'Date', 'Time', 'Tips Count', 'Status'];

    // Convert filtered matches to CSV format
    const csvContent = [
      headers.join(','),
      ...filteredMatches.map(match => [
        match.id,
        `"${match.league}"`, // Wrap in quotes to handle commas
        `"${match.homeTeam}"`,
        `"${match.awayTeam}"`,
        match.date,
        match.time,
        match.tips,
        match.status
      ].join(','))
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `tips-moto-matches-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle adding a new match - pass through to parent
  const handleAddMatch = (newMatchData: {
    league: string;
    homeTeam: string;
    awayTeam: string;
    date: string;
    time: string;
    status: string;
  }) => {
    onAddMatch(newMatchData);
    // Reset to first page to potentially show the new match
    setCurrentPage(1);
  };

  // Handle match updates from the detail view - pass through to parent
  const handleMatchSave = (matchId: number, updatedFields: Partial<{
    league: string;
    homeTeam: string;
    awayTeam: string;
    date: string;
    time: string;
  }>) => {
    onMatchSave(matchId, updatedFields);

    // Also update the selected match if it's currently being viewed
    if (selectedMatch && selectedMatch.id === matchId) {
      setSelectedMatch(prev => ({ ...prev, ...updatedFields }));
    }
  };

  // Handle tips updates from the detail view - pass through to parent
  const handleTipsUpdate = (matchId: number, newTips: any[]) => {
    onTipsUpdate(matchId, newTips);

    // Also update the selected match if it's currently being viewed
    if (selectedMatch && selectedMatch.id === matchId) {
      setSelectedMatch(prev => ({ ...prev, tips: newTips.length, tipsData: newTips }));
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'live':
        return 'bg-green-500 text-white';
      case 'completed':
        return 'bg-blue-500 text-white';
      case 'cancelled':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

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

  // If a match is selected, show the match detail view
  if (selectedMatch) {
    return (
      <MatchDetailView
        match={selectedMatch}
        onBack={handleBackToMatches}
        onSave={handleMatchSave}
        // onTipsUpdate={handleTipsUpdate || }
      />
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header with Add Match and Search */}
      <div className="flex items-center justify-between gap-4">
        <AddMatchDialog onAddMatch={handleAddMatch} />

        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Matches Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Matches</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilterOpen(!filterOpen)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                {filterOpen && (
                  <div className="absolute top-full right-0 mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20">
                    <div className="p-1">
                      {['All', 'pending', 'live', 'completed', 'cancelled'].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleFilterChange(status)}
                          className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 capitalize ${
                            selectedStatus === status ? 'bg-orange-500 text-white' : ''
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800/50 border-b">
                <TableHead className="px-4 py-3 text-center">ID</TableHead>
                <TableHead className="px-4 py-3 text-center">League</TableHead>
                <TableHead className="px-4 py-3 text-center">Teams</TableHead>
                <TableHead className="px-4 py-3 text-center">Match Times</TableHead>
                <TableHead className="px-4 py-3 text-center">No. Tips</TableHead>
                <TableHead className="px-4 py-3 text-center">Status</TableHead>
                <TableHead className="px-4 py-3 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedMatches.map((match) => (
                <TableRow
                  key={match.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b last:border-b-0"
                >
                  <TableCell className="px-4 py-3 text-center text-blue-400">
                    {match.id}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    {match.league}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <div className="space-y-1">
                      <div className="text-sm">
                        <span className="text-gray-900 dark:text-white">Home : </span>
                        <span className="text-blue-400">{match.homeTeam}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-900 dark:text-white">Away : </span>
                        <span className="text-blue-400">{match.awayTeam}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {match.date}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {match.time}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <span className="text-gray-900 dark:text-white">{match.tips}</span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <Badge className={`${getStatusBadgeColor(match.status)} text-xs px-2 py-1`}>
                      {match.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewMatch(match.id)}
                      className="h-8 px-3 text-xs"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {startIndex + 1} to{" "}
                {Math.min(
                  startIndex + MATCHES_PER_PAGE,
                  filteredMatches.length,
                )}{" "}
                of {filteredMatches.length} results
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

                {generatePageNumbers().map((page, index) => (
                  page === '...' ? (
                    <span key={index} className="px-2 text-gray-400">...</span>
                  ) : (
                    <Button
                      key={index}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page as number)}
                      className={`h-8 w-8 p-0 ${currentPage === page ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
                    >
                      {page}
                    </Button>
                  )
                ))}

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

          {filteredMatches.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <div className="text-lg font-medium mb-2">No matches found</div>
              <div className="text-sm">Try adjusting your search or filter criteria</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Click outside to close dropdowns */}
      {filterOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setFilterOpen(false)}
        />
      )}
    </div>
  );
}
