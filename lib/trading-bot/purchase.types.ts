export interface CreateBotPurchaseInput {
  userId: string;

  botId: string;

  planId: string;

  amount: number;

  paymentMethodId: string;

  reference: string;
}

export interface BotDepositRecord {
  id: string;

  user_id: string;

  bot_id: string | null;

  plan_id: string;

  investment_amount: number;

  payment_method_id: string | null;

  status: string;

  reference: string;

  created_at: string | null;
}

export interface PurchaseResponse {
  deposit: BotDepositRecord;
}

export interface PurchaseServiceResult {
  data: PurchaseResponse | null;

  error: string | null;
}