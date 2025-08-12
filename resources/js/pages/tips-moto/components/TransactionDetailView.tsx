import { ArrowLeft, User, Package, Clock, Shield, CreditCard, FileText, Printer, Download, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

interface Transaction {
  id: string;
  user: string;
  email: string;
  package: string;
  amount: number;
  date: string;
  time: string;
  status: string;
  reference: string;
}

interface TransactionDetailViewProps {
  transaction: Transaction;
  onBack: () => void;
}

export function TransactionDetailView({ transaction, onBack }: TransactionDetailViewProps) {
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

  // Generate additional mock data for the detail view
  const mockDetails = {
    paymentMethod: 'M-Pesa',
    phoneNumber: '+254' + Math.floor(Math.random() * 900000000 + 100000000),
    transactionId: 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    gateway: 'Safaricom M-Pesa',
    processingTime: '2.3s',
    currency: 'KES',
    exchangeRate: '1.00',
    fees: Math.round(transaction.amount * 0.015), // 1.5% fee
    netAmount: transaction.amount - Math.round(transaction.amount * 0.015),
    ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    userAgent: 'Mozilla/5.0 (Linux; Android 12; SM-G973F) AppleWebKit/537.36',
    location: ['Nairobi, Kenya', 'Mombasa, Kenya', 'Kisumu, Kenya', 'Nakuru, Kenya'][Math.floor(Math.random() * 4)],
    deviceId: 'DEV' + Math.random().toString(36).substr(2, 12).toUpperCase(),
    merchantCode: 'TMOTO001',
    authCode: Math.random().toString(36).substr(2, 8).toUpperCase(),
    receiptNumber: 'RCP' + Math.random().toString(36).substr(2, 10).toUpperCase()
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Mock download functionality
    console.log('Downloading transaction receipt...');
  };

  const handleViewInGateway = () => {
    // Mock external gateway link
    console.log('Opening transaction in payment gateway...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={onBack}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white">Transaction Details</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Complete information for transaction #{transaction.id}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm" onClick={handleViewInGateway}>
            <ExternalLink className="h-4 w-4 mr-2" />
            View in Gateway
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Transaction Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Transaction Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Transaction Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Transaction ID</span>
                    <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono">
                      {transaction.id}
                    </code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Reference</span>
                    <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono">
                      {transaction.reference}
                    </code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">External ID</span>
                    <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono">
                      {mockDetails.transactionId}
                    </code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                    <Badge className={getStatusBadgeStyle(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Amount</span>
                    <span className="font-semibold text-lg text-green-600 dark:text-green-400">
                      KES {transaction.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Fees</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      KES {mockDetails.fees.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Net Amount</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      KES {mockDetails.netAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Processing Time</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {mockDetails.processingTime}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Customer Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Full Name</label>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{transaction.user}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Email Address</label>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{transaction.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Phone Number</label>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{mockDetails.phoneNumber}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Location</label>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{mockDetails.location}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Device ID</label>
                    <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono">
                      {mockDetails.deviceId}
                    </code>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">IP Address</label>
                    <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono">
                      {mockDetails.ipAddress}
                    </code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Package Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Package Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Package Name</label>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{transaction.package}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Package Type</label>
                  <Badge variant="outline" className="ml-2">
                    {transaction.package.includes('daily') ? 'Daily' :
                     transaction.package.includes('weekly') ? 'Weekly' : 'Premium'}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Access Period</label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {transaction.package.includes('daily') ? '24 hours' :
                     transaction.package.includes('weekly') ? '7 days' : '30 days'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Payment Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Payment Method</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{mockDetails.paymentMethod}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Gateway</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{mockDetails.gateway}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Auth Code</span>
                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {mockDetails.authCode}
                </code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Receipt No.</span>
                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {mockDetails.receiptNumber}
                </code>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Transaction Timeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Date</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{transaction.date}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Time</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{transaction.time}</span>
              </div>
              <Separator />
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Initiated</span>
                  <span className="text-gray-900 dark:text-gray-100">{transaction.time}</span>
                </div>
                {transaction.status === 'successful' && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Processed</span>
                      <span className="text-gray-900 dark:text-gray-100">
                        {new Date(new Date().getTime() + 2300).toLocaleTimeString('en-US', {
                          hour12: false,
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Completed</span>
                      <span className="text-green-600 dark:text-green-400">
                        {new Date(new Date().getTime() + 5000).toLocaleTimeString('en-US', {
                          hour12: false,
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </>
                )}
                {transaction.status === 'failed' && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Failed</span>
                    <span className="text-red-600 dark:text-red-400">
                      {new Date(new Date().getTime() + 1500).toLocaleTimeString('en-US', {
                        hour12: false,
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Security Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">Merchant Code</label>
                <code className="block mt-1 text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono">
                  {mockDetails.merchantCode}
                </code>
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">User Agent</label>
                <p className="text-xs text-gray-900 dark:text-gray-100 break-all mt-1">
                  {mockDetails.userAgent}
                </p>
              </div>
              <div className="pt-2">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified Transaction
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
