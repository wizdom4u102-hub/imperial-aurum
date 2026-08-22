import {
  createClient,
} from "@/lib/supabase/server";


type TradingBotEmailType =
  | "approved"
  | "rejected"
  | "expired";


interface SendTradingBotEmailInput {

  userId: string;

  type: TradingBotEmailType;

  botName?: string;

  amount?: number;

}



export async function sendTradingBotEmail(
  input: SendTradingBotEmailInput
) {

  const supabase =
    await createClient();



  const {
    data: profile,
    error,
  } =
    await supabase
      .from("profiles")
      .select(
        "email, name"
      )
      .eq(
        "id",
        input.userId
      )
      .single();



  if (
    error ||
    !profile?.email
  ) {

    throw new Error(
      "User email not found"
    );

  }



  let subject = "";

  let message = "";



  if (
    input.type === "approved"
  ) {

    subject =
      "Trading Bot Deposit Approved";


    message =
      `
Hello ${profile.name ?? "User"},

Your trading bot deposit has been approved.

Bot:
${input.botName ?? "-"}

Investment:
$${input.amount?.toLocaleString() ?? "0"}

Your trading bot is now pending activation.

Thank you.
Imperial Aurum Mining
`;

  }



  if (
    input.type === "rejected"
  ) {

    subject =
      "Trading Bot Deposit Rejected";


    message =
      `
Hello ${profile.name ?? "User"},

Your trading bot deposit request has been rejected.

If you believe this was a mistake, please contact support.

Imperial Aurum Mining
`;

  }



  if (
    input.type === "expired"
  ) {

    subject =
      "Trading Bot Deposit Expired";


    message =
      `
Hello ${profile.name ?? "User"},

Your trading bot deposit request has expired.

Please submit a new request if you want to continue.

Imperial Aurum Mining
`;

  }



  /*
    Connect your existing email provider here.

    Example:
    Resend
    SMTP
    Supabase Edge Function
    Hostinger Email

    For now we store the notification event.
  */



  await supabase
    .from("notifications")
    .insert({

      user_id:
        input.userId,

      title:
        subject,

      message,

      type:
        "email",

      is_read:
        false,

    });



  return {
    success:true,
  };

}