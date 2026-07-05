import { supabaseAdmin } from "@/lib/supabase/admin";

export async function processReferral({
  userId,
  depositId,
  amount,
}: {
  userId: string;
  depositId: string;
  amount: number;
}) {
  // GET USER REFERRER
  const { data: user } = await supabaseAdmin
    .from("profiles")
    .select("referrer_id")
    .eq("id", userId)
    .single();

  if (!user?.referrer_id) return;

  const commissionLevels = [
    { level: 1, percent: 10 },
    { level: 2, percent: 5 },
    { level: 3, percent: 3 },
    { level: 4, percent: 3 },
  ];

  let currentReferrer = user.referrer_id;

  for (const rule of commissionLevels) {
    if (!currentReferrer) break;

    const commission = (amount * rule.percent) / 100;

    // lock duplicate payout
    const { data: exists } = await supabaseAdmin
      .from("referral_earnings")
      .select("id")
      .eq("referrer_id", currentReferrer)
      .eq("source_deposit_id", depositId)
      .eq("level", rule.level)
      .maybeSingle();

    if (exists) {
      continue;
    }

    // credit balance
    await supabaseAdmin.rpc("increment_cash", {
      user_id: currentReferrer,
      amount: commission,
    });

    // log earnings
    await supabaseAdmin.from("referral_earnings").insert({
      user_id: userId,
      referrer_id: currentReferrer,
      level: rule.level,
      source_deposit_id: depositId,
      source_amount: amount,
      commission_percent: rule.percent,
      commission_amount: commission,
      status: "completed",
    });

    // move up chain
    const { data: nextUser } = await supabaseAdmin
      .from("profiles")
      .select("referrer_id")
      .eq("id", currentReferrer)
      .single();

    currentReferrer = nextUser?.referrer_id || null;
  }
}