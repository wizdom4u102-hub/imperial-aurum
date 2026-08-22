import {
  createAdminNotification,
} from "./repository";

export type AdminNotificationType =
  | "deposit"
  | "withdrawal"
  | "trading_bot"
  | "share_plan"
  | "kyc"
  | "support"
  | "investment"
  | "referral"
  | "system";

export interface CreateAdminNotificationInput {
  title: string;

  message: string;

  type: AdminNotificationType;

  event: string;

  priority?: "low" | "normal" | "high" | "critical";

  referenceTable?: string;

  referenceId?: string;

  metadata?: Record<string, unknown>;
}

export async function notifyAdmin(
  input: CreateAdminNotificationInput
) 
{
  return createAdminNotification({
    title: input.title,

    message: input.message,

    type: input.type,

    event: input.event,

    priority: input.priority ?? "normal",

    reference_table:
      input.referenceTable ?? null,

    reference_id:
      input.referenceId ?? null,

    is_read: false,
  });
}