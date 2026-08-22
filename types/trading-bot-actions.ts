export interface TradingBotAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  callback: () => void;
}

export interface ActivationStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  active: boolean;
}

export interface DepositMethod {
  id: string;
  name: string;
  description: string;
  icon?: React.ReactNode;
  selected: boolean;
}

export type StatusType = 'success' | 'warning' | 'error' | 'info' | 'pending';