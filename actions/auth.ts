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

  // Create profile
const { error: profileError } = await supabase
  .from("profiles")
  .upsert(
    {
      id: userId,
      email,
      referrer_id: referrerId,
      referred_by: referrerId,
      gold_balance: 1000,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

if (profileError) {
  console.error(profileError);
}

// Create balances row
const { error: balanceError } = await supabase
  .from("balances")
  .upsert(
    {
      user_id: userId,
      cash: 0,
      gold: 1000,
      shares: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "user_id",
    }
  );

if (balanceError) {
  console.error("Balance creation error:", balanceError);
}

  // Credit referrer
 if (referrerId) {
  const { error } = await supabase.rpc("increment_gold_balance", {
    user_id: referrerId,
    amount: 1000,
  });

  if (error) {
    console.error("Referrer reward error:", error);
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

/* ================================
   ✅ CHANGE PASSWORD
================================ */
export async function changePasswordAction(formData: FormData) {
  const supabase = await createActionClient();

  const currentPassword = String(
    formData.get("current_password") || ""
  ).trim();

  const newPassword = String(
    formData.get("new_password") || ""
  ).trim();

  const confirmPassword = String(
    formData.get("confirm_password") || ""
  ).trim();

  // Used by both user and admin pages
  const redirectBase = String(
    formData.get("redirect_base") || "user"
  );

  const changePasswordPage =
    redirectBase === "admin"
      ? "/admin/change-password"
      : "/change-password";

  const successPage =
    redirectBase === "admin"
      ? "/admin/dashboard"
      : "/dashboard";

  if (!currentPassword || !newPassword || !confirmPassword) {
    return redirect(
      `${changePasswordPage}?error=${encodeURIComponent(
        "All fields are required"
      )}`
    );
  }

  if (newPassword.length < 6) {
    return redirect(
      `${changePasswordPage}?error=${encodeURIComponent(
        "New password must be at least 6 characters"
      )}`
    );
  }

  if (newPassword !== confirmPassword) {
    return redirect(
      `${changePasswordPage}?error=${encodeURIComponent(
        "New passwords do not match"
      )}`
    );
  }

  // Get currently logged-in user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user?.email) {
    return redirect(
      `/login?error=${encodeURIComponent(
        "Your session has expired. Please log in again."
      )}`
    );
  }

  // Verify current password
  const { error: signInError } =
    await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

  if (signInError) {
    return redirect(
      `${changePasswordPage}?error=${encodeURIComponent(
        "Current password is incorrect"
      )}`
    );
  }

  // Update password
  const { error: updateError } =
    await supabase.auth.updateUser({
      password: newPassword,
    });

  if (updateError) {
    console.error("Change password error:", updateError);

    return redirect(
      `${changePasswordPage}?error=${encodeURIComponent(
        updateError.message
      )}`
    );
  }

  // Optional: Sign out all other devices
  await supabase.auth.signOut({
    scope: "others",
  });

  return redirect(
    `${successPage}?message=${encodeURIComponent(
      "Password changed successfully."
    )}`
  );
}

/* ================================
   ✅ FORGOT PASSWORD
================================ */
export async function forgotPasswordAction(formData: FormData) {
  const supabase = await createActionClient();

  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();

  if (!email) {
    return redirect(
      `/forgot-password?error=${encodeURIComponent(
        "Email is required."
      )}`
    );
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  const { error } = await supabase.auth.resetPasswordForEmail(
    email,
    {
      redirectTo: `${origin}/auth/callback?next=/reset-password`,
    }
  );

  if (error) {
    console.error("Forgot password error:", error);

    return redirect(
      `/forgot-password?error=${encodeURIComponent(
        error.message
      )}`
    );
  }

  return redirect(
    `/forgot-password?message=${encodeURIComponent(
      "If an account with that email exists, a password reset link has been sent."
    )}`
  );
}

/* ================================
   ✅ RESET PASSWORD
================================ */
export async function resetPasswordAction(formData: FormData) {
  const supabase = await createActionClient();

  const newPassword = String(
    formData.get("new_password") || ""
  ).trim();

  const confirmPassword = String(
    formData.get("confirm_password") || ""
  ).trim();

  if (!newPassword || !confirmPassword) {
    return redirect(
      `/reset-password?error=${encodeURIComponent(
        "Both password fields are required."
      )}`
    );
  }

  if (newPassword.length < 6) {
    return redirect(
      `/reset-password?error=${encodeURIComponent(
        "Password must be at least 6 characters."
      )}`
    );
  }

  if (newPassword !== confirmPassword) {
    return redirect(
      `/reset-password?error=${encodeURIComponent(
        "Passwords do not match."
      )}`
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    console.error("Reset password error:", error);

    return redirect(
      `/reset-password?error=${encodeURIComponent(
        error.message
      )}`
    );
  }

  // Optional: sign out other sessions
  await supabase.auth.signOut({
    scope: "others",
  });

  return redirect(
    `/login?message=${encodeURIComponent(
      "Your password has been reset successfully. Please sign in."
    )}`
  );
}