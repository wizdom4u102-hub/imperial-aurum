import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import ActivationStepIndicator from './activation-step-indicator';
import ActivationSummaryCard from './activation-summary-card';
import { Button } from '@/components/ui/button';
import useTradingBotDeposit from '@/hooks/use-trading-bot-deposit';
import { validateActivationRequest, } from '@/lib/trading-bot/validators';

interface BotProps {
  id: string;
  name: string;
  description: string;
  riskLevel: string;
  strategy: string;
  expectedROI: number;
  minimumDeposit: number;
  maximumDeposit: number;
}

interface BotActivationWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bot: BotProps;
  onActivate: () => void;
}

const BotActivationWizard: React.FC<BotActivationWizardProps> = ({ open, onOpenChange, bot, onActivate }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [activationAmount, setActivationAmount] = useState<number | ''>('');

  const handleSubmit = async () => {
    const validation =  validateActivationRequest({ botId: bot.id,  amount: Number(activationAmount) });
    if (!validation.valid) {
      // Handle validation error
      return;
    }
    // Call the API, assuming `onActivate` handles this correctly
    onActivate(); // Example activation callback
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="p-6">
        <ActivationStepIndicator currentStep={currentStep} totalSteps={3} steps={['Review Bot', 'Choose Amount', 'Confirm Activation']} />
        {currentStep === 0 && (
          <div>
            <h2 className="text-lg font-bold">Review Bot</h2>
            <p>{bot.description}</p>
            <Button onClick={() => setCurrentStep(1)} className="mt-4">Continue</Button>
          </div>
        )}
        {currentStep === 1 && (
          <div>
            <h2 className="text-lg font-bold">Choose Amount</h2>
            <input
              type="number"
              value={activationAmount}
              onChange={(e) => setActivationAmount(Number(e.target.value))}
              placeholder="Amount"
              className="w-full border rounded p-2 mb-4"
            />
            <Button onClick={handleSubmit} className="mt-4">Continue</Button>
            <Button onClick={() => setCurrentStep(0)} className="mt-4">Back</Button>
          </div>
        )}
        {currentStep === 2 && (
          <div>
            <h2 className="text-lg font-bold">Confirm Activation</h2>
            <ActivationSummaryCard
              botName={bot.name}
              strategy={bot.strategy}
              expectedROI={bot.expectedROI}
              activationAmount={Number(activationAmount)}
            />
            <Button onClick={handleSubmit} className="mt-4">Confirm Activation</Button>
            <Button onClick={() => setCurrentStep(1)} className="mt-4">Back</Button>
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default BotActivationWizard;