import {
  rejectBotDeposit,
} from "./admin-rejection.repository";


import type {
  RejectBotDepositInput,
  AdminRejectionResult,
} from "./admin-rejection.types";



export async function rejectTradingBotDeposit(
  input: RejectBotDepositInput
): Promise<AdminRejectionResult> {


  try {


    const result =
      await rejectBotDeposit(
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

          : "Rejection failed",

    };

  }

}