import { useState } from 'react';
import {
    Search,
    Plus,
    Clock,
    AlertCircle,
    CheckCircle2,
    XCircle,
    MessageSquare,
    Download,
    ChevronRight,
    ChevronLeft,
    UserCheck
} from 'lucide-react';
import { TicketDetailView } from './TicketDetailView';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';

// Generate sample messages for tickets
const generateTicketMessages = (ticketId: string, customerName: string, subject: string) => {
    const adminNames = ['John Kamau', 'Sarah Njoki', 'Michael Wambua', 'Grace Mutisya'];
    const messages = [];

    // Initial customer message
    messages.push({
        id: 1,
        sender: customerName,
        senderType: 'customer',
        content: `Hello, I'm experiencing an issue with ${subject.toLowerCase()}. Could you please help me resolve this?`,
        timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000), // Random time in last 24 hours
        read: true
    });

    // Random number of additional messages (1-4)
    const numMessages = Math.floor(Math.random() * 4) + 1;

    for (let i = 0; i < numMessages; i++) {
        const isAdminMessage = Math.random() > 0.4; // 60% chance of admin response
        const adminName = adminNames[Math.floor(Math.random() * adminNames.length)];

        if (isAdminMessage) {
            const adminResponses = [
                'Thank you for contacting Tips Moto support. I\'m looking into this issue for you.',
                'I understand your concern. Let me check your account details and get back to you shortly.',
                'I\'ve reviewed your account and found the issue. Here\'s how we can resolve it:',
                'The issue has been identified and we\'re working on a solution. I\'ll update you once it\'s resolved.',
                'Your issue has been resolved. Please check your account and let me know if you need further assistance.',
                'I apologize for the inconvenience. We\'ve processed a refund/adjustment for your account.'
            ];

            messages.push({
                id: messages.length + 1,
                sender: adminName,
                senderType: 'admin',
                content: adminResponses[Math.floor(Math.random() * adminResponses.length)],
                timestamp: new Date(Date.now() - Math.random() * 12 * 60 * 60 * 1000), // Random time in last 12 hours
                read: true
            });
        } else {
            const customerFollowUps = [
                'Thank you for the quick response. When can I expect this to be resolved?',
                'I tried the solution you suggested but I\'m still having the same issue.',
                'Great! The issue seems to be resolved now. Thank you for your help.',
                'I have some additional questions about this. Could you clarify?',
                'The problem is still persisting. Can you please escalate this?',
                'Perfect! Everything is working fine now. I appreciate your assistance.'
            ];

            messages.push({
                id: messages.length + 1,
                sender: customerName,
                senderType: 'customer',
                content: customerFollowUps[Math.floor(Math.random() * customerFollowUps.length)],
                timestamp: new Date(Date.now() - Math.random() * 6 * 60 * 60 * 1000), // Random time in last 6 hours
                read: Math.random() > 0.3 // 70% read rate
            });
        }
    }

    return messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};

// Generate sample support ticket data
const generateSupportTickets = () => {
    const customers = [
        'Peter Kamau', 'Grace Wanjiku', 'John Mwangi', 'Sarah Njeri', 'David Kiprotich',
        'Mary Akinyi', 'James Wekesa', 'Catherine Wanjiru', 'Michael Kariuki', 'Faith Chebet',
        'Samuel Ochieng', 'Esther Wambui', 'Daniel Kipkoech', 'Rose Nafula', 'Joseph Mutua',
        'Jane Muthoni', 'Francis Otieno', 'Mercy Waithera', 'Robert Kosgei', 'Lydia Nyambura'
    ];

    const subjects = [
        'Unable to access Premium tips',
        'Payment not processed',
        'Account locked after failed login',
        'Subscription not activated',
        'Wrong tips showing in account',
        'M-Pesa payment failed',
        'Password reset not working',
        'Premium package expired early',
        'Unable to receive SMS notifications',
        'Tips not matching purchase',
        'Refund request for wrong prediction',
        'Account balance not updated',
        'Can\'t login with phone number',
        'Jackpot tips not received',
        'Weekly package not working',
        'Double charged for subscription',
        'App crashes when opening tips',
        'Email notifications not working',
        'Unable to cancel subscription',
        'Tips showing different odds'
    ];

    const categories = [
        'Payment Issues',
        'Account Access',
        'Subscription Problems',
        'Technical Issues',
        'Betting Tips',
        'Notifications',
        'Refund Requests',
        'General Inquiry'
    ];

    const priorities = ['Low', 'Medium', 'High', 'Critical'];
    const statuses = ['Open', 'In Progress', 'Resolved', 'Closed'];
    const statusWeights = [0.3, 0.4, 0.2, 0.1]; // 30% open, 40% in progress, 20% resolved, 10% closed

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

    const tickets = [];
    for (let i = 1; i <= 150; i++) {
        const customer = customers[Math.floor(Math.random() * customers.length)];
        const subject = subjects[Math.floor(Math.random() * subjects.length)];
        const category = categories[Math.floor(Math.random() * categories.length)];
        const priority = priorities[Math.floor(Math.random() * priorities.length)];
        const status = getWeightedRandomStatus();

        // Generate random date within last 30 days
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));
        const formattedDate = date.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
        });

        const time = `${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`;

        const ticketId = `TM-${String(2024001 + i).padStart(7, '0')}`;
        const messagesData = generateTicketMessages(ticketId, customer, subject);

        tickets.push({
            id: ticketId,
            customer,
            email: `${customer.toLowerCase().replace(' ', '.')}@gmail.com`,
            subject,
            category,
            priority,
            status,
            date: formattedDate,
            time,
            dateTime: date,
            responseTime: Math.floor(Math.random() * 48) + 1, // 1-48 hours
            messages: messagesData.length,
            messagesData: messagesData,
            assignedTo: status !== 'Open' ? ['John Kamau', 'Sarah Njoki', 'Michael Wambua', 'Grace Mutisya'][Math.floor(Math.random() * 4)] : null,
            lastActivity: messagesData[messagesData.length - 1]?.timestamp || date,
            tags: Math.random() > 0.7 ? ['urgent', 'vip'].slice(0, Math.floor(Math.random() * 2) + 1) : []
        });
    }

    return tickets.sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());
};

// FAQ data
const faqData = [
    {
        id: 1,
        question: 'How do I reset my password?',
        answer: 'You can reset your password by clicking the \'Forgot Password\' link on the login page. Enter your email or phone number and follow the instructions sent to you.',
        category: 'Account Issues',
        helpful: 45,
        notHelpful: 3
    },
    {
        id: 2,
        question: 'How do I make payments via M-Pesa?',
        answer: 'To pay via M-Pesa: 1) Go to M-Pesa menu, 2) Select \'Lipa na M-Pesa\', 3) Choose \'Buy Goods and Services\', 4) Enter Till Number: 123456, 5) Enter the amount, 6) Enter your PIN and confirm.',
        category: 'Payment Issues',
        helpful: 78,
        notHelpful: 5
    },
    {
        id: 3,
        question: 'Why are my tips not showing?',
        answer: 'Tips may not show due to: 1) Inactive subscription, 2) Network connectivity issues, 3) App needs updating. Try refreshing the app or contact support if the issue persists.',
        category: 'Betting Tips',
        helpful: 34,
        notHelpful: 8
    },
    {
        id: 4,
        question: 'How do I cancel my subscription?',
        answer: 'To cancel your subscription: 1) Go to \'My Account\', 2) Select \'Subscriptions\', 3) Find your active subscription, 4) Click \'Cancel\' and confirm. Cancellation takes effect at the end of the current billing period.',
        category: 'Subscription Problems',
        helpful: 56,
        notHelpful: 12
    },
    {
        id: 5,
        question: 'Can I get a refund for wrong predictions?',
        answer: 'Our refund policy covers technical errors only. Betting predictions are based on analysis and probability, not guarantees. Please review our terms and conditions for detailed refund policies.',
        category: 'Refund Requests',
        helpful: 23,
        notHelpful: 34
    }
];

const TICKETS_PER_PAGE = 10;

export function CustomerSupportPage() {
    const [tickets, setTickets] = useState(generateSupportTickets());
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTicket, setSelectedTicket] = useState<any>(null);
    const [showNewTicketDialog, setShowNewTicketDialog] = useState(false);
    const [currentView, setCurrentView] = useState<'list' | 'detail'>('list');

    // Filter tickets
    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch = ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter;
        const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
    });

    // Pagination
    const totalPages = Math.ceil(filteredTickets.length / TICKETS_PER_PAGE);
    const startIndex = (currentPage - 1) * TICKETS_PER_PAGE;
    const paginatedTickets = filteredTickets.slice(startIndex, startIndex + TICKETS_PER_PAGE);

    // Statistics
    const totalTickets = tickets.length;
    const openTickets = tickets.filter(t => t.status === 'Open').length;
    const inProgressTickets = tickets.filter(t => t.status === 'In Progress').length;
    const resolvedTickets = tickets.filter(t => t.status === 'Resolved').length;
    const avgResponseTime = Math.round(tickets.reduce((sum, t) => sum + t.responseTime, 0) / tickets.length);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Open':
                return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Open</Badge>;
            case 'In Progress':
                return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">In
                    Progress</Badge>;
            case 'Resolved':
                return <Badge
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Resolved</Badge>;
            case 'Closed':
                return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">Closed</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'Critical':
                return <Badge className="bg-red-600 text-white">Critical</Badge>;
            case 'High':
                return <Badge className="bg-orange-600 text-white">High</Badge>;
            case 'Medium':
                return <Badge className="bg-yellow-600 text-white">Medium</Badge>;
            case 'Low':
                return <Badge className="bg-green-600 text-white">Low</Badge>;
            default:
                return <Badge variant="secondary">{priority}</Badge>;
        }
    };

    const handleViewTicket = (ticket: any) => {
        setSelectedTicket(ticket);
        setCurrentView('detail');
    };

    const handleBackToList = () => {
        setCurrentView('list');
        setSelectedTicket(null);
    };

    const handleSendMessage = (ticketId: string, message: string) => {
        const updatedMessage = {
            id: selectedTicket?.messagesData.length + 1 || 1,
            sender: 'John Kamau', // Current admin
            senderType: 'admin' as const,
            content: message,
            timestamp: new Date(),
            read: true
        };

        // Update the ticket with new message
        setTickets(prevTickets =>
            prevTickets.map(ticket =>
                ticket.id === ticketId
                    ? {
                        ...ticket,
                        messagesData: [...ticket.messagesData, updatedMessage],
                        messages: ticket.messages + 1,
                        lastActivity: new Date(),
                        status: ticket.status === 'Open' ? 'In Progress' : ticket.status
                    }
                    : ticket
            )
        );

        // Update selected ticket state if it's the current one
        if (selectedTicket?.id === ticketId) {
            setSelectedTicket(prev => ({
                ...prev,
                messagesData: [...prev.messagesData, updatedMessage],
                messages: prev.messages + 1,
                lastActivity: new Date(),
                status: prev.status === 'Open' ? 'In Progress' : prev.status
            }));
        }
    };

    const handleStatusChange = (ticketId: string, newStatus: string) => {
        setTickets(prevTickets =>
            prevTickets.map(ticket =>
                ticket.id === ticketId
                    ? { ...ticket, status: newStatus, lastActivity: new Date() }
                    : ticket
            )
        );

        // Update selected ticket state if it's the current one
        if (selectedTicket?.id === ticketId) {
            setSelectedTicket(prev => ({ ...prev, status: newStatus }));
        }
    };

    const handleExport = () => {
        const headers = ['Ticket ID', 'Customer', 'Email', 'Subject', 'Category', 'Priority', 'Status', 'Date', 'Time', 'Response Time (hrs)', 'Messages', 'Assigned To'];

        const csvContent = [
            headers.join(','),
            ...filteredTickets.map(ticket => [
                ticket.id,
                `"${ticket.customer}"`,
                ticket.email,
                `"${ticket.subject}"`,
                ticket.category,
                ticket.priority,
                ticket.status,
                ticket.date,
                ticket.time,
                ticket.responseTime,
                ticket.messages,
                ticket.assignedTo || 'Unassigned'
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `tips-moto-support-tickets-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Conditional rendering based on current view
    if (currentView === 'detail' && selectedTicket) {
        return (
            <TicketDetailView
                ticket={selectedTicket}
                onBack={handleBackToList}
                onStatusChange={handleStatusChange}
                onSendMessage={handleSendMessage}
            />
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold text-black dark:text-white">Customer Support</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage customer support tickets and FAQs</p>
                </div>

                <div className="flex items-center space-x-3">
                    <Button variant="outline" onClick={handleExport} className="flex items-center space-x-2">
                        <Download className="h-4 w-4" />
                        <span>Export</span>
                    </Button>
                    <Dialog open={showNewTicketDialog} onOpenChange={setShowNewTicketDialog}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2">
                                <Plus className="h-4 w-4" />
                                <span>New Ticket</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Create New Support Ticket</DialogTitle>
                                <DialogDescription>
                                    Create a new support ticket on behalf of a customer. Fill in the details below.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="customer">Customer Name</Label>
                                    <Input id="customer" placeholder="Enter customer name" />
                                </div>
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="customer@example.com" />
                                </div>
                                <div>
                                    <Label htmlFor="subject">Subject</Label>
                                    <Input id="subject" placeholder="Brief description of the issue" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="category">Category</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="payment">Payment Issues</SelectItem>
                                                <SelectItem value="account">Account Access</SelectItem>
                                                <SelectItem value="subscription">Subscription Problems</SelectItem>
                                                <SelectItem value="technical">Technical Issues</SelectItem>
                                                <SelectItem value="tips">Betting Tips</SelectItem>
                                                <SelectItem value="notifications">Notifications</SelectItem>
                                                <SelectItem value="refund">Refund Requests</SelectItem>
                                                <SelectItem value="general">General Inquiry</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="priority">Priority</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select priority" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="low">Low</SelectItem>
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="high">High</SelectItem>
                                                <SelectItem value="critical">Critical</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" placeholder="Detailed description of the issue"
                                              rows={4} />
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <Button variant="outline" onClick={() => setShowNewTicketDialog(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={() => setShowNewTicketDialog(false)}>
                                        Create Ticket
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalTickets}</div>
                        <p className="text-xs text-muted-foreground">All time</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
                        <AlertCircle className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{openTickets}</div>
                        <p className="text-xs text-muted-foreground">Require attention</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{inProgressTickets}</div>
                        <p className="text-xs text-muted-foreground">Being handled</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                        <Clock className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgResponseTime}h</div>
                        <p className="text-xs text-muted-foreground">Average response</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="tickets" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
                    <TabsTrigger value="faq">FAQ Management</TabsTrigger>
                </TabsList>

                <TabsContent value="tickets">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Support Tickets ({filteredTickets.length})</CardTitle>
                                <div className="flex items-center space-x-2">
                                    <div className="relative">
                                        <Search
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <Input
                                            placeholder="Search tickets..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 w-64"
                                        />
                                    </div>
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="w-32">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Status</SelectItem>
                                            <SelectItem value="Open">Open</SelectItem>
                                            <SelectItem value="In Progress">In Progress</SelectItem>
                                            <SelectItem value="Resolved">Resolved</SelectItem>
                                            <SelectItem value="Closed">Closed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                        <SelectTrigger className="w-40">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Categories</SelectItem>
                                            <SelectItem value="Payment Issues">Payment Issues</SelectItem>
                                            <SelectItem value="Account Access">Account Access</SelectItem>
                                            <SelectItem value="Subscription Problems">Subscription Problems</SelectItem>
                                            <SelectItem value="Technical Issues">Technical Issues</SelectItem>
                                            <SelectItem value="Betting Tips">Betting Tips</SelectItem>
                                            <SelectItem value="Notifications">Notifications</SelectItem>
                                            <SelectItem value="Refund Requests">Refund Requests</SelectItem>
                                            <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Ticket ID</TableHead>
                                            <TableHead>Customer</TableHead>
                                            <TableHead>Subject</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Priority</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Response Time</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedTickets.map((ticket) => (
                                            <TableRow
                                                key={ticket.id}
                                                className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                            >
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => handleViewTicket(ticket)}
                                                            className="text-primary hover:text-primary/80 hover:underline transition-colors cursor-pointer"
                                                        >
                                                            {ticket.id}
                                                        </button>
                                                        {ticket.tags.length > 0 && (
                                                            <div className="flex space-x-1">
                                                                {ticket.tags.map(tag => (
                                                                    <Badge key={tag} variant="secondary"
                                                                           className="text-xs">
                                                                        {tag}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">{ticket.customer}</div>
                                                        <div
                                                            className="text-sm text-gray-500 dark:text-gray-400">{ticket.email}</div>
                                                        {ticket.assignedTo && (
                                                            <div
                                                                className="text-xs text-blue-600 dark:text-blue-400 flex items-center mt-1">
                                                                <UserCheck className="h-3 w-3 mr-1" />
                                                                {ticket.assignedTo}
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="max-w-xs">
                                                    <div>
                                                        <div className="font-medium truncate">{ticket.subject}</div>
                                                        <div
                                                            className="text-sm text-gray-500 dark:text-gray-400">{ticket.category}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{ticket.category}</Badge>
                                                </TableCell>
                                                <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                                                <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="text-sm">{ticket.date}</div>
                                                        <div
                                                            className="text-xs text-gray-500 dark:text-gray-400">{ticket.time}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="text-sm">{ticket.responseTime}h</div>
                                                        <div
                                                            className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                                            <MessageSquare className="h-3 w-3 mr-1" />
                                                            {ticket.messages}
                                                        </div>
                                                    </div>
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
                                        Showing {startIndex + 1} to {Math.min(startIndex + TICKETS_PER_PAGE, filteredTickets.length)} of {filteredTickets.length} results
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
                                        <span className="text-sm font-medium">
                      {currentPage} of {totalPages}
                    </span>
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
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="faq">
                    <Card>
                        <CardHeader>
                            <CardTitle>Frequently Asked Questions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {faqData.map((faq) => (
                                    <Card key={faq.id} className="border-l-4 border-l-orange-500">
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-lg">{faq.question}</CardTitle>
                                                <Badge variant="outline">{faq.category}</Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-gray-600 dark:text-gray-400 mb-4">{faq.answer}</p>
                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                <div className="flex items-center space-x-1">
                                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                    <span>{faq.helpful} helpful</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <XCircle className="h-4 w-4 text-red-500" />
                                                    <span>{faq.notHelpful} not helpful</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
