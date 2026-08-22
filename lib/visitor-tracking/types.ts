import type { Database } from "@/lib/supabase/database.types";

/* -------------------------------------------------------------------------- */
/*                           Database Record Types                            */
/* -------------------------------------------------------------------------- */

export type VisitorSessionRecord =
  Database["public"]["Tables"]["visitor_sessions"]["Row"];

export type VisitorEventRecord =
  Database["public"]["Tables"]["visitor_events"]["Row"];

export type VisitorSessionInsert =
  Database["public"]["Tables"]["visitor_sessions"]["Insert"];

export type VisitorSessionUpdate =
  Database["public"]["Tables"]["visitor_sessions"]["Update"];

export type VisitorEventInsert =
  Database["public"]["Tables"]["visitor_events"]["Insert"];

export type VisitorEventUpdate =
  Database["public"]["Tables"]["visitor_events"]["Update"];

/* -------------------------------------------------------------------------- */
/*                              Event Metadata                                */
/* -------------------------------------------------------------------------- */

export type VisitorEventMetadata = Record<
  string,
  string | number | boolean | null
>;

/* -------------------------------------------------------------------------- */
/*                              Event Types                                   */
/* -------------------------------------------------------------------------- */

export type VisitorEventType =
  | "LANDING_PAGE_VIEW"
  | "PAGE_VIEW"
  | "PLAN_VIEW"
  | "REGISTRATION_STARTED"
  | "REGISTRATION_COMPLETED"
  | "LOGIN"
  | "REFERRAL_VISIT"
  | "REFERRAL_REGISTRATION"
  | "DEPOSIT_STARTED"
  | "DEPOSIT_SUBMITTED"
  | "DEPOSIT_APPROVED"
  | "WITHDRAWAL_STARTED"
  | "WITHDRAWAL_SUBMITTED"
  | "CHAT_OPENED"
  | "CHAT_MESSAGE_SENT";

/* -------------------------------------------------------------------------- */
/*                            Visitor Session                                 */
/* -------------------------------------------------------------------------- */

export interface VisitorSession {
  id: string;
  sessionId: string;
  userId: string | null;
  firstSeenAt: string;
  lastSeenAt: string;
  currentPage: string | null;
  isOnline: boolean;
  ipAddress: string | null;
  userAgent: string | null;
  deviceType: string | null;
  browser: string | null;
  operatingSystem: string | null;
  referrerUrl: string | null;
  landingPage: string | null;
  referralCode: string | null;
  createdAt: string;
  updatedAt: string;
}

/* -------------------------------------------------------------------------- */
/*                              Visitor Event                                 */
/* -------------------------------------------------------------------------- */

export interface VisitorEvent {
  id: string;
  sessionId: string;
  userId: string | null;
  eventType: VisitorEventType;
  pageUrl: string | null;
  pageTitle: string | null;
  referenceId: string | null;
  referenceType: string | null;
  metadata: VisitorEventMetadata | null;
  createdAt: string;
}

/* -------------------------------------------------------------------------- */
/*                           Session Creation                                 */
/* -------------------------------------------------------------------------- */

export interface CreateVisitorSessionInput {
  sessionId: string;
  currentPage?: string | null;
  landingPage?: string | null;
  referrerUrl?: string | null;
  userAgent?: string | null;
  deviceType?: string | null;
  browser?: string | null;
  operatingSystem?: string | null;
  referralCode?: string | null;
}

/* -------------------------------------------------------------------------- */
/*                           Session Update                                   */
/* -------------------------------------------------------------------------- */

export interface UpdateVisitorSessionInput {
  sessionId: string;
  currentPage?: string | null;
  userId?: string | null;
}

/* -------------------------------------------------------------------------- */
/*                            Event Recording                                 */
/* -------------------------------------------------------------------------- */

export interface RecordVisitorEventInput {
  sessionId: string;
  eventType: VisitorEventType;
  pageUrl?: string | null;
  pageTitle?: string | null;
  referenceId?: string | null;
  referenceType?: string | null;
  metadata?: VisitorEventMetadata | null;
  userId?: string | null;
}

/* -------------------------------------------------------------------------- */
/*                         Visitor Tracking State                             */
/* -------------------------------------------------------------------------- */

export interface VisitorTrackingState {
  sessionId: string | null;
  sessionUuid: string | null;
  userId: string | null;
  currentPage: string | null;
  isInitialized: boolean;
  isOnline: boolean;
}