const VISITOR_SESSION_STORAGE_KEY =
  "imperial_aurum_visitor_session";

const VISITOR_VISIT_SESSION_KEY =
  "imperial_aurum_current_visit";

export function getStoredVisitorSessionId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(
    VISITOR_SESSION_STORAGE_KEY,
  );
}

export function createVisitorSessionId(): string {
  const existingSessionId =
    getStoredVisitorSessionId();

  if (existingSessionId) {
    return existingSessionId;
  }

  const sessionId =
    crypto.randomUUID();

  window.localStorage.setItem(
    VISITOR_SESSION_STORAGE_KEY,
    sessionId,
  );

  return sessionId;
}

/* -------------------------------------------------------------------------- */
/*                         Visit Session                                     */
/* -------------------------------------------------------------------------- */

export function hasCurrentVisit(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    window.sessionStorage.getItem(
      VISITOR_VISIT_SESSION_KEY,
    ) === "active"
  );
}

export function markCurrentVisit(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(
    VISITOR_VISIT_SESSION_KEY,
    "active",
  );
}

export function clearCurrentVisit(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(
    VISITOR_VISIT_SESSION_KEY,
  );
}

/* -------------------------------------------------------------------------- */
/*                         Visitor Session                                   */
/* -------------------------------------------------------------------------- */

export function clearVisitorSessionId(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(
    VISITOR_SESSION_STORAGE_KEY,
  );

  window.sessionStorage.removeItem(
    VISITOR_VISIT_SESSION_KEY,
  );
}