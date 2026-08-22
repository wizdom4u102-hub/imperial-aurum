export type BotStatus = 'active' | 'pending' | 'paused' | 'expired' | 'completed' | 'failed';

export type RiskLevel = 'low' | 'medium' | 'high';

export type BotStrategy = string; // Strategy names can be defined as needed

export interface TradingBot {
  id: string;
  name: string;
  description: string;
  status: BotStatus;
  riskLevel: RiskLevel;
  strategy: BotStrategy;
  expectedROI: number;
  averageDailyROI: number;
  minimumDeposit: number;
  maximumDeposit: number;
  activationPeriod: string;
  supportedAssets: string;
  totalTrades: number;
  winRate: number;
  lossRate: number;
  profitFactor: number;
  maximumDrawdown: number;
  features: string[];
  requirements: string[];
  disclaimer: string;
}
