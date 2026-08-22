export interface ApproveBotDepositInput {
  depositId: string;

  adminId: string;
}


export interface ApprovedBotResult {

  depositId: string;

  userBotId: string;

}


export interface AdminApprovalResult {

  data:
    ApprovedBotResult | null;

  error:
    string | null;

}