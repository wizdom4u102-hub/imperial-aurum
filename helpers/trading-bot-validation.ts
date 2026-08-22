export function validateDepositAmount(amount: number | string, minAmount: number): boolean {
  const amountValue = parseFloat(amount as string);
  return !isNaN(amountValue) && amountValue >= minAmount;
}

export function validateRequiredField(value: string | null | undefined): boolean {
  return value != null && value.trim() !== '';
}

export function isValidNumber(value: any): value is number {
  return typeof value === 'number' && !isNaN(value);
}