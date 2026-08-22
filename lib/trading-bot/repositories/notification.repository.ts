import { createClient } from "@/lib/supabase/server";

import type {
  NotificationInsert,
} from "../transfer-funds.types";

/* -------------------------------------------------------------------------- */
/*                              Notifications                                 */
/* -------------------------------------------------------------------------- */

export async function createUserNotification(
  values: NotificationInsert
): Promise<void> {

  const supabase =
    await createClient();

  const {
    error,
  } = await supabase
    .from("user_notifications")
    .insert(values);

  if (error) {
    throw error;
  }

}