"use server";

import { redirect } from "next/navigation";
import { createActionClient } from "@/lib/supabase/actions";

/* ================================
   ✅ SIGNUP (with gold_balance + referral)
================================ */
export async function signupAction(formData: FormData) {
  const supabase = await createActionClient();

  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "").trim();
  const referralCode = String(formData.get("referral_code") || "").trim();

  // Validation
  if (!email) {
    return redirect(`/signup?error=${encodeURIComponent("Email is required")}`);
  }
  if (!password || password.length < 6) {
    return redirect(`/signup?error=${encodeURIComponent("Password must be at least 6 characters")}`);
  }

  let referrerId: string | null = null;

  // Resolve referral code
  if (referralCode) {
    const { data: refUser, error: refError } = await supabase
      .from("profiles")
      .select("id")
      .eq("referral_code", referralCode)
      .single();

    if (refError && refError.code !== "PGRST116") {
      console.error("Referral lookup error:", refError);
    }

    if (refUser?.id) {
      referrerId = refUser.id;
    }
  }

  // Create account
  const { data, error: signupError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: referrerId ? { referrer_id: referrerId } : undefined,
    },
  });

  if (signupError || !data?.user) {
    console.error("Signup error:", signupError);
    return redirect(
      `/signup?error=${encodeURIComponent(
        signupError?.message || "Signup failed. Please try again."
      )}`
    );
  }

  const userId = data.user.id;

  // Upsert profile + give 1000 gold_balance
  const { error: profileError } = await supabase
    .from("profiles")
    .upsert(
      {
        id: userId,
        email: email,
        referrer_id: referrerId,
        referred_by: referrerId,
        gold_balance: 1000,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

  if (profileError) {
    console.error("Profile / gold_balance error:", profileError);
  }

  // Credit referrer
  if (referrerId) {
    const { error: referrerError } = await supabase
      .from("profiles")
      .update({
        gold_balance: supabase.rpc("increment_gold_balance", {
          user_id: referrerId,
          amount: 1000,
        }),
      })
      .eq("id", referrerId);

    if (referrerError) {
      console.error("Referrer credit failed:", referrerError);
    }
  }

  return redirect("/dashboard?message=Check your email to confirm your account");
}

/* ================================
   ✅ LOGIN
================================ */
export async function loginAction(formData: FormData) {
  const supabase = await createActionClient();

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();

  console.log("LOGIN ATTEMPT:", email);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log('SET-COOKIE READY:', data?.session?.refresh_token);
  console.log('LOGIN SESSION:', data?.session);
  console.log('LOGIN USER:', data?.user?.id);

  if (error) {
    console.error("LOGIN ERROR:", error.message);
    return redirect(`/login/admin?error=${encodeURIComponent(error.message)}`);
  }

  if (!data?.user) {
    return redirect("/login/admin?error=No user");
  }

  console.log("LOGGED USER:", data.user.id);

  const { data: profile } = await supabase
    .from("profiles")
    .select("role,is_admin")
    .eq("id", data.user.id)
    .maybeSingle();

  console.log("PROFILE:", profile);

  if (profile?.role === "admin" || profile?.is_admin === true) {
    return redirect("/admin");
  }

  return redirect("/dashboard");
}

/* ================================
   ✅ LOGOUT
================================ */
export async function logoutAction() {
  const supabase = await createActionClient();

  await supabase.auth.signOut();

  return redirect("/login");
}