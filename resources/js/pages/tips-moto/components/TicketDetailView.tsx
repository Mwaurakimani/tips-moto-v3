import { useState } from 'react';
import { 
  ArrowLeft,
  Send,
  Paperclip,
  UserCheck,
  Clock,
  Calendar,
  Tag,
  MessageSquare,
  Eye,
  MoreVertical
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

interface TicketDetailViewProps {
  ticket: any;
  onBack: () => void;
  onStatusChange: (ticketId: string, newStatus: string) => void;
  onSendMessage: (ticketId: string, message: string) => void;
}

export function TicketDetailView({ ticket, onBack, onStatusChange, onSendMessage }: TicketDetailViewProps) {
  const [newMessage, setNewMessage] = useState('');
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [ticketStatus, setTicketStatus] = useState('');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Open':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Open</Badge>;
      case 'In Progress':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">In Progress</Badge>;
      case 'Resolved':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Resolved</Badge>;
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

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    onSendMessage(ticket.id, newMessage);
    setNewMessage('');
  };

  const handleStatusChange = (newStatus: string) => {
    onStatusChange(ticket.id, newStatus);
    setShowStatusDialog(false);
  };

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Tickets</span>
        </Button>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="text-3xl font-bold text-black dark:text-white truncate">
                Ticket {ticket.id}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 truncate">
                {ticket.subject}
              </p>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              {getStatusBadge(ticket.status)}
              {getPriorityBadge(ticket.priority)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Ticket Information Sidebar */}
        <div className="xl:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ticket Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Customer</Label>
                <div className="mt-1">
                  <p className="font-medium">{ticket.customer}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{ticket.email}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</Label>
                <div className="mt-1 flex items-center justify-between">
                  {getStatusBadge(ticket.status)}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowStatusDialog(true)}
                  >
                    Change
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</Label>
                <p className="mt-1">{ticket.category}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Priority</Label>
                <div className="mt-1">{getPriorityBadge(ticket.priority)}</div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Assigned To</Label>
                <div className="mt-1 flex items-center space-x-2">
                  {ticket.assignedTo ? (
                    <>
                      <UserCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span>{ticket.assignedTo}</span>
                    </>
                  ) : (
                    <span className="text-gray-400">Unassigned</span>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</Label>
                <div className="mt-1 flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>{ticket.date} at {ticket.time}</span>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Response Time</Label>
                <div className="mt-1 flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>{ticket.responseTime} hours</span>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Messages</Label>
                <div className="mt-1 flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-gray-400" />
                  <span>{ticket.messages} messages</span>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Tags</Label>
                <div className="mt-1 flex flex-wrap gap-1">
                  {ticket.tags && ticket.tags.length > 0 ? ticket.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  )) : (
                    <span className="text-sm text-gray-400">No tags</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Messages Area */}
        <div className="xl:col-span-3">
          <Card className="h-[700px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Conversation</span>
                <Badge variant="outline" className="ml-2">
                  {ticket.messagesData?.length || 0} messages
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900/50">
                {ticket.messagesData?.map((message: any) => (
                  <div key={message.id} className={`flex ${message.senderType === 'admin' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-lg p-4 ${
                      message.senderType === 'admin' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-medium ${
                          message.senderType === 'admin' ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {message.sender}
                        </span>
                        <span className={`text-xs ${
                          message.senderType === 'admin' ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {message.timestamp.toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="border-t p-6">
                <div className="flex flex-col space-y-3">
                  <div className="flex space-x-3">
                    <div className="flex-1 relative">
                      <Textarea
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="resize-none pr-12 min-h-[100px]"
                        rows={4}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute bottom-3 right-3 h-8 w-8 p-0"
                        type="button"
                      >
                        <Paperclip className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Press Enter to send, Shift+Enter for new line
                    </div>
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="flex items-center space-x-2"
                    >
                      <Send className="h-4 w-4" />
                      <span>Send Message</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Status Change Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Change Ticket Status</DialogTitle>
            <DialogDescription>
              Update the status of ticket {ticket.id}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Current Status</Label>
              <div className="mt-1">{getStatusBadge(ticket.status)}</div>
            </div>
            <div>
              <Label>New Status</Label>
              <Select value={ticketStatus} onValueChange={setTicketStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => handleStatusChange(ticketStatus)}
                disabled={!ticketStatus}
              >
                Update Status
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
