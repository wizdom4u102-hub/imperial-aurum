export interface TradingBotPlanRecord {
  id: string;

  name: string;
  slug: string;

  description: string | null;

  duration_days: number;

  expected_daily_roi: number | null;
  expected_monthly_roi: number | null;

  minimum_investment: number;
  maximum_investment: number;

  features: string[] | null;
  supported_assets: string[] | null;

  badge: string | null;
  color: string | null;
  icon: string | null;

  status: string;

  is_featured: boolean;
  is_popular: boolean;

  display_order: number;

  created_at: string;
  updated_at: string;
}


export interface MarketplacePlansQuery {
  status?: string;
}


export interface MarketplaceRepositoryResult<T> {
  data: T | null;
  error: MarketplaceRepositoryError | null;
}


export interface MarketplaceRepositoryError {
  code: string;
  message: string;
}