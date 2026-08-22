import { createClient } from "@/lib/supabase/server";

/* -------------------------------------------------------------------------- */
/*                              User Profile                                  */
/* -------------------------------------------------------------------------- */

export async function getUserProfile(
  userId: string
): Promise<{
  email: string | null;
  name: string | null;
} | null> {

  const supabase =
    await createClient();

  const {
    data,
    error,
  } = await supabase
    .from("profiles")
    .select("email, name")
    .eq("id", userId)
    .single();

  if (error) {
    throw error;
  }

  return data;

}