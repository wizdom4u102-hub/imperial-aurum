export const calculatePercentage = (partial: number, total: number): number => {
  if (total === 0) return 0;
  return (partial / total) * 100;
};

export const calculateAverageProfit = (profits: number[]): number => {
  if (profits.length === 0) return 0;
  const total = profits.reduce((sum, profit) => sum + profit, 0);
  return total / profits.length;
};

export const calculateROI = (currentValue: number, investment: number): number => {
  if (investment === 0) return 0;
  return calculatePercentage(currentValue - investment, investment);
};

export const calculateProfitDifference = (newValue: number, oldValue: number): number => {
  return newValue - oldValue;
};

export const normalizeProfitValue = (profit: number | null | undefined): number => {
  return profit != null ? profit : 0;
};