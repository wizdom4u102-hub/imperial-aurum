export class TradingBotError extends Error {
  public readonly code: string;

  constructor(code: string, message?: string) {
    super(message);
    this.code = code;
    this.name = 'TradingBotError';
  }
}

export const ERROR_CODES = {
  INVALID_REQUEST: 'INVALID_REQUEST',
  INVALID_AMOUNT: 'INVALID_AMOUNT',
  BOT_NOT_FOUND: 'BOT_NOT_FOUND',
  BOT_ALREADY_ACTIVE: 'BOT_ALREADY_ACTIVE',
  INSUFFICIENT_DATA: 'INSUFFICIENT_DATA',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  DATABASE_ERROR: 'DATABASE_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
};