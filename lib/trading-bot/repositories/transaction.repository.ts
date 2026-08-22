import { createClient } from "@/lib/supabase/server";

import type {
  TransactionInsert,
} from "../transfer-funds.types";

/* -------------------------------------------------------------------------- */
/*                              Transactions                                  */
/* -------------------------------------------------------------------------- */

export async function createTransaction(
  values: TransactionInsert
): Promise<void> {

  const supabase =
    await createClient();

  const {
    error,
  } = await supabase
    .from("transactions")
    .insert(values);

  if (error) {
    throw error;
  }

}