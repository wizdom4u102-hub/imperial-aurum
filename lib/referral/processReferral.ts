import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/sendEmail";
import {
  referralCommissionEmail,
} from "@/lib/email/templates";

const COMMISSION_LEVELS = [
  { level: 1, percent: 10 },
  { level: 2, percent: 5 },
  { level: 3, percent: 3 },
  { level: 4, percent: 3 },

  { level: 5, percent: 2 },
  { level: 6, percent: 2 },
  { level: 7, percent: 2 },
  { level: 8, percent: 2 },
  { level: 9, percent: 2 },
  { level: 10, percent: 2 },
  { level: 11, percent: 2 },
  { level: 12, percent: 2 },
  { level: 13, percent: 2 },
  { level: 14, percent: 2 },
  { level: 15, percent: 2 },
  { level: 16, percent: 2 },
  { level: 17, percent: 2 },
  { level: 18, percent: 2 },
  { level: 19, percent: 2 },
  { level: 20, percent: 2 },
];

export async function processReferral({
  userId,
  depositId,
  amount,
}: {
  userId: string;
  depositId: string;
  amount: number;
}) {
  try {
    // ==============================
    // GET USER'S DIRECT REFERRER
    // ==============================

    const { data: user, error: userError } =
      await supabaseAdmin
        .from("profiles")
        .select("referrer_id")
        .eq("id", userId)
        .single();

    if (userError) {
      console.error(
        "Referral user lookup error:",
        userError
      );
      return;
    }

    if (!user?.referrer_id) {
      return;
    }

    let currentReferrer =
      user.referrer_id;

    // ==============================
    // LOOP THROUGH 20 LEVELS
    // ==============================

    for (const rule of COMMISSION_LEVELS) {

      if (!currentReferrer) {
        break;
      }

      const commission =
        Number(
          (
            (amount * rule.percent) /
            100
          ).toFixed(2)
        );

      // Prevent duplicate payout
      const {
        data: existing,
        error: existingError,
      } = await supabaseAdmin
        .from("referral_earnings")
        .select("id")
        .eq(
          "referrer_id",
          currentReferrer
        )
        .eq(
          "source_deposit_id",
          depositId
        )
        .eq(
          "level",
          rule.level
        )
        .maybeSingle();

      if (existingError) {
        console.error(
          "Duplicate check error:",
          existingError
        );
        break;
      }

      if (existing) {

        // Continue climbing the tree
        const {
          data: nextUser,
        } = await supabaseAdmin
          .from("profiles")
          .select("referrer_id")
          .eq(
            "id",
            currentReferrer
          )
          .single();

        currentReferrer =
          nextUser?.referrer_id || null;

        continue;
      }

      // Get referrer email
      const {
        data: referrer,
      } = await supabaseAdmin
        .from("profiles")
        .select("email")
        .eq(
          "id",
          currentReferrer
        )
        .single();
              // ==============================
      // CREDIT COMMISSION
      // ==============================

      const { error: creditError } =
        await supabaseAdmin.rpc(
          "increment_cash",
          {
            user_id: currentReferrer,
            amount: commission,
          }
        );

      if (creditError) {
        console.error(
          "Commission credit error:",
          creditError
        );

        // Don't continue if credit failed.
        break;
      }

      // ==============================
      // LOG REFERRAL EARNING
      // ==============================

      const { error: earningError } =
        await supabaseAdmin
          .from("referral_earnings")
          .insert({
            user_id: userId,
            referrer_id: currentReferrer,
            level: rule.level,
            source_deposit_id: depositId,
            source_amount: amount,
            commission_percent: rule.percent,
            commission_amount: commission,
            status: "completed",
            created_at: new Date().toISOString(),
          });

      if (earningError) {
        console.error(
          "Referral earning insert error:",
          earningError
        );
      }

      // ==============================
      // SEND EMAIL
      // ==============================

      if (referrer?.email) {
        try {
          await sendEmail({
            to: referrer.email,
            subject: `Referral Level ${rule.level} Commission Credited`,
            html: referralCommissionEmail({
              level: rule.level,
              depositAmount: amount,
              commissionPercent: rule.percent,
              commissionAmount: commission,
            }),
          });
        } catch (emailError) {
          console.error(
            "Referral email error:",
            emailError
          );
        }
      }

      // ==============================
      // MOVE TO NEXT UPLINE
      // ==============================

      const {
        data: nextUser,
        error: nextError,
      } = await supabaseAdmin
        .from("profiles")
        .select("referrer_id")
        .eq("id", currentReferrer)
        .single();

      if (nextError) {
        console.error(
          "Next referrer lookup error:",
          nextError
        );
        break;
      }

      currentReferrer =
        nextUser?.referrer_id || null;
    }

    console.log(
      "✅ Referral processing completed."
    );
  } catch (err) {
    console.error(
      "Referral processing failed:",
      err
    );
  }
}