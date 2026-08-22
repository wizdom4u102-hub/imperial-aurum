export function formatCurrency(value: number | null | undefined, currencySymbol: string = '$'): string {
  if (value == null) return currencySymbol + '0.00';
  return `${currencySymbol}${value.toFixed(2)}`;
}

export function formatPercentage(value: number | null | undefined): string {
  if (value == null) return '0%';
  return `${value.toFixed(2)}%`;
}

export function formatNumber(value: number | null | undefined): string {
  if (value == null) return '0';
  return value.toLocaleString();
}

export function formatDate(date: Date | null | undefined): string {
  if (!date) return 'Invalid date';
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}