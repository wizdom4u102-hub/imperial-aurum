"use server";

import { redirect } from "next/navigation";
import { createActionClient } from "@/lib/supabase/actions";

/* ================================
   ✅ SIGNUP
================================ */
export async function signupAction(formData: FormData) {
  const supabase = await createActionClient();

  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const referralCode = String(formData.get("referral_code") || "");

  let referrerId = null;

  if (referralCode) {
    const { data: refUser } = await supabase
      .from("profiles")
      .select("id")
      .eq("referral_code", referralCode)
      .single();

    if (refUser) {
      referrerId = refUser.id;
    }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error || !data.user) {
    return redirect(
      `/signup?error=${encodeURIComponent(
        error?.message || "Signup failed"
      )}`
    );
  }

  await supabase
    .from("profiles")
    .update({
      referrer_id: referrerId,
      referred_by: referrerId,
    })
    .eq("id", data.user.id);

  return redirect("/dashboard?message=Check your email");
}

/* ================================
   ✅ LOGIN (FIXED PROPERLY)
================================ */
export async function loginAction(formData: FormData) {
  const supabase = await createActionClient();

  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  console.log("LOGIN ATTEMPT:", email);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log(
  'SET-COOKIE READY:',
  data?.session?.refresh_token
)
  console.log(
  'LOGIN SESSION:',
  data?.session
)
console.log(
  'LOGIN USER:',
  data?.user?.id
)

  if (error) {
    console.error("LOGIN ERROR:", error.message);
    return redirect(
      `/login/admin?error=${encodeURIComponent(error.message)}`
    );
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