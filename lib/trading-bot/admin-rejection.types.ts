export interface RejectBotDepositInput {
  depositId: string;

  adminId: string;

  reason?: string;
}


export interface RejectedBotResult {
  depositId: string;
}


export interface AdminRejectionResult {

  data:
    RejectedBotResult | null;

  error:
    string | null;

}