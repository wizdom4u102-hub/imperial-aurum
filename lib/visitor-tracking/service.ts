import { createClient } from "@/lib/supabase/server";

import type {
  CreateVisitorSessionInput,
  RecordVisitorEventInput,
  UpdateVisitorSessionInput,
} from "./types";

export type RegisterVisitorVisitInput = {
  sessionId: string;
  pageUrl: string | null;
  pageTitle: string | null;
  userId: string | null;
};

export type RegisterVisitorVisitResult = {
  is_new_visit: boolean;
  visit_number: number;
};

export async function createVisitorSession(
  input: CreateVisitorSessionInput,
): Promise<string> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "create_visitor_session",
    {
      p_session_id: input.sessionId,
      p_current_page:
        input.currentPage ?? undefined,
      p_landing_page:
        input.landingPage ?? undefined,
      p_referrer_url:
        input.referrerUrl ?? undefined,
      p_user_agent:
        input.userAgent ?? undefined,
      p_device_type:
        input.deviceType ?? undefined,
      p_browser:
        input.browser ?? undefined,
      p_operating_system:
        input.operatingSystem ?? undefined,
      p_referral_code:
        input.referralCode ?? undefined,
    },
  );

  if (error) {
    throw new Error(
      `Failed to create visitor session: ${error.message}`,
    );
  }

  if (!data) {
    throw new Error(
      "Visitor session was not created",
    );
  }

  return data;
}

export async function registerVisitorVisit(
  input: RegisterVisitorVisitInput,
): Promise<RegisterVisitorVisitResult> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "register_visitor_visit",
    {
      p_session_id: input.sessionId,
      p_page_url:
        input.pageUrl ?? undefined,
      p_page_title:
        input.pageTitle ?? undefined,
      p_user_id:
        input.userId ?? undefined,
    },
  );

  console.log(
  "REGISTER VISIT RPC RESULT:",
  data,
);

  if (error) {
    throw new Error(
      `Failed to register visitor visit: ${error.message}`,
    );
  }

  if (!data) {
    throw new Error(
      "Visitor visit was not registered",
    );
  }

  return data as RegisterVisitorVisitResult;
}

export async function updateVisitorSession(
  input: UpdateVisitorSessionInput,
): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "update_visitor_session",
    {
      p_session_id: input.sessionId,
      p_current_page:
        input.currentPage ?? undefined,
      p_user_id:
        input.userId ?? undefined,
    },
  );

  if (error) {
    throw new Error(
      `Failed to update visitor session: ${error.message}`,
    );
  }

  return data;
}

export async function recordVisitorEvent(
  input: RecordVisitorEventInput,
): Promise<string> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "record_visitor_event",
    {
      p_session_id: input.sessionId,
      p_event_type: input.eventType,
      p_page_url:
        input.pageUrl ?? undefined,
      p_page_title:
        input.pageTitle ?? undefined,
      p_reference_id:
        input.referenceId ?? undefined,
      p_reference_type:
        input.referenceType ?? undefined,
      p_metadata:
        input.metadata ?? undefined,
      p_user_id:
        input.userId ?? undefined,
    },
  );

  if (error) {
    throw new Error(
      `Failed to record visitor event: ${error.message}`,
    );
  }

  if (!data) {
    throw new Error(
      "Visitor event was not created",
    );
  }

  return data;
}