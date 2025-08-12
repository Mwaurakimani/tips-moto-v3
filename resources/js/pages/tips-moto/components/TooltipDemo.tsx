import { 
  Tooltip, 
  TooltipTrigger, 
  TooltipContent, 
  TooltipSuccess,
  TooltipWarning,
  TooltipError,
  TooltipInfo,
  TooltipPremium 
} from './ui/tooltip';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Info, AlertTriangle, CheckCircle, XCircle, Crown, HelpCircle } from 'lucide-react';

export function TooltipDemo() {
  return (
    <div className="space-y-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Custom Tooltip Examples
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Hover over the elements below to see the custom tooltip designs.
        </p>
      </div>

      {/* Basic Tooltip */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 dark:text-white">Basic Tooltip</h4>
        <div className="flex items-center space-x-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-2">
                <HelpCircle className="h-4 w-4" />
                <span>Hover for info</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <div>
                <div className="tooltip-title">Tips Moto Platform</div>
                <div className="tooltip-description">
                  Professional sports betting tips management system for the Kenyan market.
                </div>
              </div>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-help">
                <Badge variant="outline">
                  Premium Feature
                </Badge>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              This feature requires a premium subscription to access advanced analytics.
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Success Tooltip */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 dark:text-white">Success Tooltip</h4>
        <div className="flex items-center space-x-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Winning Tip</span>
              </Button>
            </TooltipTrigger>
            <TooltipSuccess>
              <div>
                <div className="tooltip-title">Tip Status: Won</div>
                <div className="tooltip-description">
                  This tip was successful with a 85% confidence rate.
                </div>
              </div>
            </TooltipSuccess>
          </Tooltip>
        </div>
      </div>

      {/* Warning Tooltip */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 dark:text-white">Warning Tooltip</h4>
        <div className="flex items-center space-x-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" className="border-yellow-500 text-yellow-600 flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4" />
                <span>High Risk</span>
              </Button>
            </TooltipTrigger>
            <TooltipWarning side="right">
              <div>
                <div className="tooltip-title">High Risk Tip</div>
                <div className="tooltip-description">
                  This tip has a higher risk level. Bet responsibly.
                </div>
              </div>
            </TooltipWarning>
          </Tooltip>
        </div>
      </div>

      {/* Error Tooltip */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 dark:text-white">Error Tooltip</h4>
        <div className="flex items-center space-x-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="destructive" className="flex items-center space-x-2">
                <XCircle className="h-4 w-4" />
                <span>Failed Tip</span>
              </Button>
            </TooltipTrigger>
            <TooltipError side="left">
              <div>
                <div className="tooltip-title">Tip Status: Lost</div>
                <div className="tooltip-description">
                  This tip did not win. Review the analysis for improvements.
                </div>
              </div>
            </TooltipError>
          </Tooltip>
        </div>
      </div>

      {/* Info Tooltip */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 dark:text-white">Info Tooltip</h4>
        <div className="flex items-center space-x-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" className="border-blue-500 text-blue-600 flex items-center space-x-2">
                <Info className="h-4 w-4" />
                <span>Match Info</span>
              </Button>
            </TooltipTrigger>
            <TooltipInfo>
              <div>
                <div className="tooltip-title">Match Analytics</div>
                <div className="tooltip-description">
                  View detailed statistics and historical performance data.
                </div>
              </div>
            </TooltipInfo>
          </Tooltip>
        </div>
      </div>

      {/* Premium Tooltip */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 dark:text-white">Premium Tooltip</h4>
        <div className="flex items-center space-x-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 flex items-center space-x-2">
                <Crown className="h-4 w-4" />
                <span>VIP Package</span>
              </Button>
            </TooltipTrigger>
            <TooltipPremium>
              <div>
                <div className="tooltip-title">Premium VIP Access</div>
                <div className="tooltip-description">
                  Exclusive tips with 90%+ success rate and priority support.
                </div>
              </div>
            </TooltipPremium>
          </Tooltip>
        </div>
      </div>

      {/* Multiple Positions */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 dark:text-white">Different Positions</h4>
        <div className="grid grid-cols-2 gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">Top</Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              Tooltip positioned at the top
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">Bottom</Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              Tooltip positioned at the bottom
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">Left</Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              Tooltip positioned to the left
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">Right</Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Tooltip positioned to the right
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Badge Examples */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 dark:text-white">Badge Tooltips</h4>
        <div className="flex flex-wrap gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-help">
                <Badge className="bg-green-600 text-white">
                  Low Risk
                </Badge>
              </div>
            </TooltipTrigger>
            <TooltipSuccess>
              Low risk tips have a high probability of success
            </TooltipSuccess>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-help">
                <Badge className="bg-yellow-600 text-white">
                  Medium Risk
                </Badge>
              </div>
            </TooltipTrigger>
            <TooltipWarning>
              Medium risk tips offer balanced reward potential
            </TooltipWarning>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-help">
                <Badge className="bg-red-600 text-white">
                  High Risk
                </Badge>
              </div>
            </TooltipTrigger>
            <TooltipError>
              High risk tips have higher rewards but lower success rates
            </TooltipError>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-help">
                <Badge className="bg-gradient-to-r from-orange-600 to-orange-500 text-white">
                  Premium
                </Badge>
              </div>
            </TooltipTrigger>
            <TooltipPremium>
              Premium tips are only available to VIP subscribers
            </TooltipPremium>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
