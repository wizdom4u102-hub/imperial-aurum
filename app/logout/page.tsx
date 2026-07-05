import { createActionClient } from "@/lib/supabase/actions";
import { redirect } from "next/navigation";

export default async function LogoutPage() {
  const supabase = await createActionClient();

  await supabase.auth.signOut();

  redirect("/login");
}