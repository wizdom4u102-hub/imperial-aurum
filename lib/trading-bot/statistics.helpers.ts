export const calculateWinRate = (winningTrades: number, totalTrades: number): number => {
  if (totalTrades === 0) return 0;
  return (winningTrades / totalTrades) * 100;
};

export const calculateTradeCount = (trades: unknown[]): number => {
  return trades.length;
};

export const calculateAverage = (values: number[]): number => {
  if (values.length === 0) return 0;
  const total = values.reduce((sum, value) => sum + value, 0);
  return total / values.length;
};

export const calculatePercentage = (part: number, total: number): number => {
  if (total === 0) return 0;
  return (part / total) * 100;
};

export const formatStatisticsValue = (value: number | null): string => {
  return value != null ? value.toFixed(2) : 'N/A';
};