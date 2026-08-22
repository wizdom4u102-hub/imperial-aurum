import {
  createClient,
} from "@/lib/supabase/server";


import type {
  RejectBotDepositInput,
} from "./admin-rejection.types";



export async function rejectBotDeposit(
  input: RejectBotDepositInput
) {

  const supabase =
    await createClient();



  const {
    data: deposit,
    error: depositError,
  } =
    await supabase
      .from("bot_deposits")
      .select("*")
      .eq(
        "id",
        input.depositId
      )
      .single();



  if (
    depositError ||
    !deposit
  ) {

    throw new Error(
      depositError?.message ??
      "Deposit not found"
    );

  }




  if (
    deposit.status !== "pending_activation"
  ) {

    throw new Error(
      `Deposit already processed. Current status: ${deposit.status}`
    );

  }




  const now =
    new Date()
      .toISOString();




  const {
    error:updateError,
  } =
    await supabase
      .from("bot_deposits")
      .update({

        status:
          "rejected",

        rejection_reason:
          input.reason ??
          "Rejected by administrator",

        rejected_at:
          now,

        reviewed_at:
          now,

        reviewed_by:
          input.adminId,

      })
      .eq(
        "id",
        deposit.id
      );




  if (
    updateError
  ) {

    throw new Error(
      updateError.message
    );

  }





  const {
    error:logError,
  } =
    await supabase
      .from("bot_logs")
      .insert({

        action:
          "BOT_DEPOSIT_REJECTED",

        deposit_id:
          deposit.id,

        log_type:
          "rejection",

        message:
          `Trading bot deposit rejected by administrator.`,

        metadata: {

          investment_amount:
            deposit.investment_amount,

          reason:
            input.reason ??
            "Rejected by administrator",

          reference:
            deposit.reference,

        },

        performed_by:
          input.adminId,

        severity:
          "warning",

        user_id:
          deposit.user_id,

      });




  if (
    logError
  ) {

    throw new Error(
      logError.message
    );

  }





  const {
    error:transactionError,
  } =
    await supabase
      .from("transactions")
      .insert({

        user_id:
          deposit.user_id,

        type:
          "trading_bot_deposit_rejected",

        amount:
          deposit.investment_amount,

        asset_type:
          "cash",

        currency:
          "USD",

        status:
          "rejected",

        description:
          "Trading bot investment deposit rejected",

        reference_id:
          deposit.id,

      });




  if (
    transactionError
  ) {

    throw new Error(
      transactionError.message
    );

  }





  // Email notification hook
  // Will connect to notification service later



  return {

    depositId:
      deposit.id,

  };

}