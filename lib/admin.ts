// lib/admin.ts
import { redirect } from "next/navigation";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

export async function requireAdminPage() {
  const supabase = await createServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login/admin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    redirect("/login/admin");
  }

  return { user, supabase };
}

export async function requireAdminApi() {
  const serverSupabase = await createServerClient();

  // 1. Verify user authentication
  const {
    data: { user },
    error,
  } = await serverSupabase.auth.getUser();

  if (error || !user) {
    return {
      ok: false,
      status: 401,
      error: "Unauthorized",
    };
  }

  // 2. Check admin status in profiles table
  const { data: profile } = await serverSupabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    return {
      ok: false,
      status: 403,
      error: "Forbidden",
    };
  }

  // 3. Create Service Role client to bypass RLS for admin DB queries
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL env variable.");
    return {
      ok: false,
      status: 500,
      error: "Server configuration error: Service role key missing",
    };
  }

  const adminSupabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return {
    ok: true,
    user,
    supabase: adminSupabase,
  };
}