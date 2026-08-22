import { trackVisitorEvent } from "./tracker";
import type {
  VisitorEventMetadata,
  VisitorEventType,
} from "./types";

export async function trackLandingPageView(
  sessionId: string,
  userId: string | null = null,
): Promise<string> {
  return trackVisitorEvent(
    sessionId,
    "LANDING_PAGE_VIEW",
    {
      userId,
    },
  );
}

export async function trackPageView(
  sessionId: string,
  userId: string | null = null,
): Promise<string> {
  return trackVisitorEvent(
    sessionId,
    "PAGE_VIEW",
    {
      userId,
    },
  );
}

export async function trackPlanView(
  sessionId: string,
  referenceId?: string | null,
  metadata?: VisitorEventMetadata | null,
): Promise<string> {
  return trackVisitorEvent(
    sessionId,
    "PLAN_VIEW",
    {
      referenceId: referenceId ?? null,
      referenceType: "plan",
      metadata: metadata ?? null,
    },
  );
}

export async function trackRegistrationStarted(
  sessionId: string,
): Promise<string> {
  return trackVisitorEvent(
    sessionId,
    "REGISTRATION_STARTED",
  );
}

export async function trackRegistrationCompleted(
  sessionId: string,
  userId: string,
): Promise<string> {
  return trackVisitorEvent(
    sessionId,
    "REGISTRATION_COMPLETED",
    {
      userId,
    },
  );
}

export async function trackLogin(
  sessionId: string,
  userId: string,
): Promise<string> {
  return trackVisitorEvent(
    sessionId,
    "LOGIN",
    {
      userId,
    },
  );
}

export async function trackReferralVisit(
  sessionId: string,
  referralCode?: string | null,
): Promise<string> {
  return trackVisitorEvent(
    sessionId,
    "REFERRAL_VISIT",
    {
      metadata: referralCode
        ? {
            referralCode,
          }
        : null,
    },
  );
}

export async function trackReferralRegistration(
  sessionId: string,
  userId: string,
): Promise<string> {
  return trackVisitorEvent(
    sessionId,
    "REFERRAL_REGISTRATION",
    {
      userId,
    },
  );
}

export async function trackDepositStarted(
  sessionId: string,
  userId: string | null,
  depositId?: string | null,
  depositType: "deposit" | "bot_deposit" = "deposit",
): Promise<string> {
  return trackVisitorEvent(
    sessionId,
    "DEPOSIT_STARTED",
    {
      userId,
      referenceId: depositId ?? null,
      referenceType: depositType,
    },
  );
}

export async function trackDepositSubmitted(
  sessionId: string,
  userId: string | null,
  depositId?: string | null,
  depositType: "deposit" | "bot_deposit" = "deposit",
): Promise<string> {
  return trackVisitorEvent(
    sessionId,
    "DEPOSIT_SUBMITTED",
    {
      userId,
      referenceId: depositId ?? null,
      referenceType: depositType,
    },
  );
}

export async function trackDepositApproved(
  sessionId: string,
  userId: string | null,
  depositId?: string | null,
  depositType: "deposit" | "bot_deposit" = "deposit",
): Promise<string> {
  return trackVisitorEvent(
    sessionId,
    "DEPOSIT_APPROVED",
    {
      userId,
      referenceId: depositId ?? null,
      referenceType: depositType,
    },
  );
}

export async function trackWithdrawalStarted(
  sessionId: string,
  userId: string,
  withdrawalId?: string | null,
): Promise<string> {
  return trackVisitorEvent(
    sessionId,
    "WITHDRAWAL_STARTED",
    {
      userId,
      referenceId: withdrawalId ?? null,
      referenceType: "withdrawal",
    },
  );
}

export async function trackWithdrawalSubmitted(
  sessionId: string,
  userId: string,
  withdrawalId?: string | null,
): Promise<string> {
  return trackVisitorEvent(
    sessionId,
    "WITHDRAWAL_SUBMITTED",
    {
      userId,
      referenceId: withdrawalId ?? null,
      referenceType: "withdrawal",
    },
  );
}

export async function trackChatOpened(
  sessionId: string,
  userId: string | null = null,
  conversationId?: string | null,
): Promise<string> {
  return trackVisitorEvent(
    sessionId,
    "CHAT_OPENED",
    {
      userId,
      referenceId: conversationId ?? null,
      referenceType: "chat_conversation",
    },
  );
}

export async function trackChatMessageSent(
  sessionId: string,
  userId: string | null = null,
  conversationId?: string | null,
): Promise<string> {
  return trackVisitorEvent(
    sessionId,
    "CHAT_MESSAGE_SENT",
    {
      userId,
      referenceId: conversationId ?? null,
      referenceType: "chat_conversation",
    },
  );
}