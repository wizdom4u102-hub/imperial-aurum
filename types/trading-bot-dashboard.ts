export interface DashboardStatistic {
  id: string; 
  title: string;
  value: number | string;
  description: string;
  icon?: React.ReactNode;
}

export interface ProfitSummaryItem {
  id: string;
  title: string;
  value: number | string;
  description: string;
  trend?: number;
}

export interface PortfolioAllocationItem {
  id: string;
  botName: string;
  percentage: number;
  amount: number;
  status: string;
}

export interface PerformanceChartPoint {
  date: string;
  value: number;
}

export interface ROIChartPoint {
  date: string;
  percentage: number;
}

export interface TimelineItem {
  id: string;
  status: string;
  title: string;
  description: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}