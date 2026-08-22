import {
  approveBotDeposit,
} from "./admin-approval.repository";


import type {
  ApproveBotDepositInput,
  AdminApprovalResult,
} from "./admin-approval.types";



export async function approveTradingBotDeposit(
  input: ApproveBotDepositInput
): Promise<AdminApprovalResult> {


  try {


    const result =
      await approveBotDeposit(
        input
      );



    return {

      data:
        result,

      error:
        null,

    };



  } catch(error) {


    return {

      data:
        null,

      error:

        error instanceof Error

          ? error.message

          : "Approval failed",

    };

  }

}