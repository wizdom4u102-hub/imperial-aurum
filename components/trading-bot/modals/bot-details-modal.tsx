import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import BotInformationList from './bot-information-list';
import BotPerformanceMetrics from './bot-performance-metrics';
import { Button } from '@/components/ui/button';

interface BotProps {
    name: string;
    description: string;
    status: string;
    riskLevel: string;
    strategy: string;
    expectedROI: number;
    minimumDeposit: number;
    maximumDeposit: number;
}

interface BotDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bot: BotProps;
}
const BotDetailsModal: React.FC<BotDetailsModalProps> = ({ open, onOpenChange, bot }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-2">{bot.name}</h2>
        <div className="flex space-x-2 mb-4">
          <span className="inline-block bg-green-500 text-white rounded-full px-2 py-1 text-xs">{bot.status}</span>
          <span className="inline-block bg-blue-500 text-white rounded-full px-2 py-1 text-xs">{bot.riskLevel}</span>
          <span className="inline-block bg-yellow-500 text-white rounded-full px-2 py-1 text-xs">{bot.strategy}</span>
        </div>
        <p className="text-gray-600 mb-4">{bot.description}</p>

        <h3 className="text-lg font-semibold mb-2">Performance Metrics</h3>
        <BotPerformanceMetrics metrics={[
          { title: 'Win Rate', value: `${bot.expectedROI}%` },
          // Add more metrics if necessary
        ]} />

        <h3 className="text-lg font-semibold mb-2">Bot Information</h3>
        <BotInformationList information={[
          { label: 'Minimum Deposit', value: `$${bot.minimumDeposit}` },
          { label: 'Maximum Deposit', value: `$${bot.maximumDeposit}` },
          // Add more information if necessary
        ]} />

        <div className="flex justify-end mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </div>
    </Dialog>
  );
};

export default BotDetailsModal;