import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import CopyReferralButton from "@/components/referrals/copy-referral-button";

interface ReferralEarning {
  id: string;
  referrer_id: string;
  user_id: string;
  level: number;
  source_amount: number | string | null;
  commission_percent: number | string | null;
  commission_amount: number | string | null;
  status: string | null;
  created_at: string;
}

interface SignupReferralTransaction {
  id: string;
  user_id: string;
  type: string;
  amount: number | string | null;
  description: string | null;
  status: string | null;
  created_at: string | null;
  asset_type: string | null;
  reference_id: string | null;
  currency: string | null;
}

export default async function ReferralsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // ==========================================
  // GET USER PROFILE
  // ==========================================

  const { data: profile, error: profileError } =
    await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();

  if (profileError) {
    console.error("Referral profile error:", profileError);
  }

  const referralLink = profile?.username
    ? `${process.env.NEXT_PUBLIC_APP_URL}/signup?ref=${profile.username}`
    : "";

  // ==========================================
  // GET USERS WHO SIGNED UP THROUGH REFERRAL
  // ==========================================

  const { data: referredUsers, error: referredUsersError } =
    await supabase
      .from("profiles")
      .select("id")
      .eq("referrer_id", user.id);

  if (referredUsersError) {
    console.error(
      "Referred users lookup error:",
      referredUsersError
    );
  }

  const totalReferrals = referredUsers?.length ?? 0;

  // ==========================================
  // GET DEPOSIT REFERRAL COMMISSIONS
  // ==========================================

  const {
    data: earnings,
    error: earningsError,
  } = await supabase
    .from("referral_earnings")
    .select(
      "id,referrer_id,user_id,level,source_amount,commission_percent,commission_amount,status,created_at"
    )
    .eq("referrer_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  if (earningsError) {
    console.error(
      "Referral earnings error:",
      earningsError
    );
  }

  const referralEarnings: ReferralEarning[] =
    (earnings ?? []) as ReferralEarning[];

  // ==========================================
  // CALCULATE TOTAL CASH COMMISSION
  // ==========================================

  const totalCommission =
    referralEarnings.reduce(
      (sum, item) =>
        sum + Number(item.commission_amount ?? 0),
      0
    );

  // ==========================================
  // GET SIGNUP REFERRAL GOLD REWARDS
  // ==========================================

  const {
    data: signupRewards,
    error: signupRewardsError,
  } = await supabase
    .from("transactions")
    .select(
      "id,user_id,type,amount,description,status,created_at,asset_type,reference_id,currency"
    )
    .eq("user_id", user.id)
    .eq("type", "referral_bonus")
    .order("created_at", {
      ascending: false,
    });

  if (signupRewardsError) {
    console.error(
      "Signup referral rewards error:",
      signupRewardsError
    );
  }

  const signupReferralRewards: SignupReferralTransaction[] =
    (signupRewards ?? []) as SignupReferralTransaction[];

  const totalSignupGold =
    signupReferralRewards.reduce(
      (sum, item) =>
        sum + Number(item.amount ?? 0),
      0
    );

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            Referral Earnings
          </h1>

          <Link
            href="/dashboard"
            className="text-yellow-400 hover:underline"
          >
            ← Dashboard
          </Link>
        </div>

        {/* REFERRAL LINK */}

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8">
          <h2 className="text-xl font-bold text-yellow-400 mb-4">
            Your Referral Link
          </h2>

          <div className="bg-zinc-800 rounded-xl p-4 break-all text-sm">
            {referralLink}
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <CopyReferralButton referralLink={referralLink} />

            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `Join Imperial Aurum Mining using my referral link:\n\n${referralLink}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-500 px-5 py-3 rounded-xl text-center font-bold"
            >
              Share on WhatsApp
            </a>
          </div>
        </div>

        {/* SUMMARY */}

        <div className="grid md:grid-cols-4 gap-6 mb-8">

          {/* TOTAL REFERRALS */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <p className="text-zinc-400 text-sm">
              Total Referrals
            </p>

            <p className="text-4xl font-bold text-cyan-400 mt-2">
              {totalReferrals}
            </p>
          </div>

          {/* TOTAL COMMISSION */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <p className="text-zinc-400 text-sm">
              Total Commission
            </p>

            <p className="text-4xl font-bold text-emerald-400 mt-2">
              ${totalCommission.toFixed(2)}
            </p>
          </div>

          {/* SIGNUP GOLD */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <p className="text-zinc-400 text-sm">
              Signup Gold Rewards
            </p>

            <p className="text-4xl font-bold text-yellow-400 mt-2">
              {totalSignupGold.toLocaleString()}
            </p>

            <p className="text-xs text-zinc-500 mt-2">
              Gold
            </p>
          </div>

          {/* REFERRAL RECORDS */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <p className="text-zinc-400 text-sm">
              Referral Records
            </p>

            <p className="text-4xl font-bold text-yellow-400 mt-2">
              {referralEarnings.length}
            </p>
          </div>

        </div>

        {/* SIGNUP GOLD REWARDS */}

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden mb-8">

          <div className="p-6 border-b border-zinc-800">
            <h2 className="text-xl font-bold text-yellow-400">
              Signup Referral Rewards
            </h2>

            <p className="text-sm text-zinc-500 mt-1">
              Gold earned when users sign up using your referral link.
            </p>
          </div>

          {signupReferralRewards.length === 0 ? (
            <div className="p-10 text-zinc-500">
              No signup referral rewards yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">

                <thead className="bg-zinc-800">
                  <tr>
                    <th className="p-5 text-left">
                      Date
                    </th>

                    <th className="p-5 text-left">
                      Reward
                    </th>

                    <th className="p-5 text-left">
                      Type
                    </th>

                    <th className="p-5 text-left">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {signupReferralRewards.map(
                    (item) => (
                      <tr
                        key={item.id}
                        className="border-t border-zinc-800"
                      >
                        <td className="p-5 text-zinc-400">
                          {item.created_at
                            ? new Date(
                                item.created_at
                              ).toLocaleString()
                            : "-"}
                        </td>

                        <td className="p-5 text-yellow-400 font-bold">
                          +{Number(
                            item.amount ?? 0
                          ).toLocaleString()} Gold
                        </td>

                        <td className="p-5">
                          Signup Referral
                        </td>

                        <td className="p-5">
                          <span className="px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                            {item.status || "completed"}
                          </span>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>

              </table>
            </div>
          )}

        </div>

        {/* DEPOSIT COMMISSION TABLE */}

        {!referralEarnings ||
        referralEarnings.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 text-zinc-500">
            No referral commissions earned yet.
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">

            <div className="p-6 border-b border-zinc-800">
              <h2 className="text-xl font-bold text-emerald-400">
                Deposit Referral Commissions
              </h2>

              <p className="text-sm text-zinc-500 mt-1">
                Commissions earned from deposits made by your referrals.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">

                <thead className="bg-zinc-800">
                  <tr>

                    <th className="p-5 text-left">
                      Date
                    </th>

                    <th className="p-5 text-left">
                      Level
                    </th>

                    <th className="p-5 text-left">
                      Deposit
                    </th>

                    <th className="p-5 text-left">
                      %
                    </th>

                    <th className="p-5 text-left">
                      Commission
                    </th>

                    <th className="p-5 text-left">
                      Status
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {referralEarnings.map(
                    (item) => (
                      <tr
                        key={item.id}
                        className="border-t border-zinc-800"
                      >

                        <td className="p-5 text-zinc-400">
                          {new Date(
                            item.created_at
                          ).toLocaleString()}
                        </td>

                        <td className="p-5 text-cyan-400 font-bold">
                          Level {item.level}
                        </td>

                        <td className="p-5">
                          $
                          {Number(
                            item.source_amount ?? 0
                          ).toFixed(2)}
                        </td>

                        <td className="p-5 text-yellow-400 font-bold">
                          {Number(
                            item.commission_percent ?? 0
                          )}
                          %
                        </td>

                        <td className="p-5 text-emerald-400 font-bold">
                          $
                          {Number(
                            item.commission_amount ?? 0
                          ).toFixed(2)}
                        </td>

                        <td className="p-5">
                          <span className="px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                            {item.status || "paid"}
                          </span>
                        </td>

                      </tr>
                    )
                  )}
                </tbody>

              </table>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}