import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ReferralRecord {
  id: string;
  referred_id: string | null;
  level: number | null;
  created_at: string | null;
}

interface ReferredUserProfile {
  id: string;
  username: string | null;
  email: string | null;
  name: string | null;
}

export default async function AdminReferralsPage({
  params,
}: {
  params: Promise<{ Id: string }>;
}) {
  const { Id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, email, name")
    .eq("id", Id)
    .single();

  const {
    data: referrals,
    error: referralsError,
  } = await supabase
    .from("referrals")
    .select("id, referred_id, level, created_at")
    .eq("referrer_id", Id)
    .order("created_at", {
      ascending: false,
    });

  if (referralsError) {
    console.error(
      "Admin referrals error:",
      referralsError
    );
  }

  const referralRecords: ReferralRecord[] =
    referrals ?? [];

 const referredUserIds = [
  ...new Set(
    referralRecords
      .map(
        (referral) =>
          referral.referred_id
      )
      .filter(
        (
          referredId
        ): referredId is string =>
          referredId !== null
      )
  ),
];

  let referredProfiles: ReferredUserProfile[] =
    [];

  if (referredUserIds.length > 0) {
    const {
      data: profiles,
      error: profilesError,
    } = await supabase
      .from("profiles")
      .select(
        "id, username, email, name"
      )
      .in(
        "id",
        referredUserIds
      );

    if (profilesError) {
      console.error(
        "Referred profiles error:",
        profilesError
      );
    }

    referredProfiles =
      profiles ?? [];
  }

  const profileMap =
    new Map<
      string,
      ReferredUserProfile
    >(
      referredProfiles.map(
        (referredProfile) => [
          referredProfile.id,
          referredProfile,
        ]
      )
    );

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold">
            Referral Network
          </h1>

          <div className="mt-2 text-zinc-400">
            <p>
              {profile?.name ||
                profile?.username ||
                "User"}
            </p>

            {profile?.email && (
              <p className="text-sm">
                {profile.email}
              </p>
            )}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[650px]">

              <thead className="bg-zinc-800">
                <tr>

                  <th className="p-5 text-left">
                    Referred User
                  </th>

                  <th className="p-5 text-left">
                    Email
                  </th>

                  <th className="p-5 text-left">
                    Level
                  </th>

                  <th className="p-5 text-left">
                    Date
                  </th>

                </tr>
              </thead>

              <tbody>

                {referralRecords.length > 0 ? (
                  referralRecords.map(
                    (referral) => {
                      const referredProfile =
                        referral.referred_id
                        ? profileMap.get(
                         referral.referred_id
                         )
                         : undefined;

                      return (
                        <tr
                          key={referral.id}
                          className="border-t border-zinc-800"
                        >

                          <td className="p-5">
                            <div className="font-medium text-white">
                              {referredProfile?.username ||
                                referredProfile?.name ||
                                "Unknown user"}
                            </div>
                          </td>

                          <td className="p-5 text-zinc-400">
                            {referredProfile?.email ||
                              "—"}
                          </td>

                          <td className="p-5 text-cyan-400 font-semibold">
                            {referral.level ??
                              "—"}
                          </td>

                          <td className="p-5 text-zinc-400">
                            {referral.created_at
                              ? new Date(
                                  referral.created_at
                                ).toLocaleString()
                              : "—"}
                          </td>

                        </tr>
                      );
                    }
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-10 text-center text-zinc-500"
                    >
                      No referrals found
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </div>
  );
}