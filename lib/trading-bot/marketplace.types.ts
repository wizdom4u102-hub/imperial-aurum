export interface TradingBotPlan {
  id: string;

  name: string;

  slug: string;

  description: string;

  minimum_investment: number;

  maximum_investment: number;

  expected_daily_roi: number;

  expected_monthly_roi: number;

  duration_days: number;

  features: string[];

  supported_assets: string[];

  badge: string | null;

  color: string | null;

  is_featured: boolean;

  is_popular: boolean;

  status: string;
}


export interface MarketplaceResponse {
  bots: TradingBotPlan[];

  total: number;
}


export interface MarketplaceServiceResult {
  data: MarketplaceResponse | null;

  error: string | null;
}