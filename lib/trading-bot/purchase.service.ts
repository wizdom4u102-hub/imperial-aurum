import {
  createBotDeposit,
} from "./purchase.repository";


import type {
  CreateBotPurchaseInput,
  PurchaseServiceResult,
} from "./purchase.types";



export async function createPurchase(
  input: CreateBotPurchaseInput
): Promise<PurchaseServiceResult> {


  try {


    const deposit =
      await createBotDeposit(
        input
      );



    return {

      data: {

        deposit,

      },

      error:null,

    };



  } catch(error) {


    return {

      data:null,

      error:

        error instanceof Error

          ? error.message

          : "Purchase failed",

    };


  }

}