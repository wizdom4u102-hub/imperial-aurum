import { TradingBotError } from './errors';

export const BOT_ALREADY_EXISTS = 'BOT_ALREADY_EXISTS';
export const BOT_NOT_ACTIVE = 'BOT_NOT_ACTIVE';
export const BOT_NOT_ELIGIBLE = 'BOT_NOT_ELIGIBLE';
export const INVALID_OPERATION = 'INVALID_OPERATION';
export const INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE';
export const INVALID_STATUS = 'INVALID_STATUS';
export const SERVICE_VALIDATION_FAILED = 'SERVICE_VALIDATION_FAILED';

export function createBusinessError(code: string, message: string): TradingBotError {
  return new TradingBotError(code, message);
}