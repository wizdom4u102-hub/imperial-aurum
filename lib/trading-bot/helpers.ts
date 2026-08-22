export function formatProfit(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

export function isValidDeposit(amount: number, min: number, max?: number): boolean {
  return amount >= min && (max === undefined || amount <= max);
}