import {
  createVisitorSessionId,
  getStoredVisitorSessionId,
  hasCurrentVisit,
  markCurrentVisit,
} from "./session";

import type {
  CreateVisitorSessionInput,
  RecordVisitorEventInput,
  VisitorEventMetadata,
  VisitorEventType,
  VisitorTrackingState,
} from "./types";

const VISITOR_TRACKING_API =
  "/api/visitor-tracking";

type CreateSessionResponse = {
  success: boolean;
  data?: string;
  error?: string;
};

type UpdateSessionResponse = {
  success: boolean;
  data?: boolean;
  error?: string;
};

type RecordEventResponse = {
  success: boolean;
  data?: string;
  error?: string;
};

type RegisterVisitResponse = {
  success: boolean;
  data?: {
    is_new_visit: boolean;
    visit_number: number;
  };
  error?: string;
};

async function requestVisitorTracking<T>(
  body: unknown,
): Promise<T> {
  const response = await fetch(
    VISITOR_TRACKING_API,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  const result: T =
    await response.json();

  if (!response.ok) {
    throw new Error(
      "Visitor tracking request failed",
    );
  }

  return result;
}

function getDeviceType(): string {
  if (
    typeof window ===
    "undefined"
  ) {
    return "unknown";
  }

  const width =
    window.innerWidth;

  if (width < 768) {
    return "mobile";
  }

  if (width < 1024) {
    return "tablet";
  }

  return "desktop";
}

function getReferralCode(): string | null {
  if (
    typeof window ===
    "undefined"
  ) {
    return null;
  }

  const params =
    new URLSearchParams(
      window.location.search,
    );

  return params.get("ref");
}

function getCurrentPage(): string | null {
  if (
    typeof window ===
    "undefined"
  ) {
    return null;
  }

  return window.location.pathname;
}

function getUserAgent(): string | null {
  if (
    typeof navigator ===
    "undefined"
  ) {
    return null;
  }

  return navigator.userAgent;
}

function buildSessionInput(
  sessionId: string,
): CreateVisitorSessionInput {
  return {
    sessionId,
    currentPage:
      getCurrentPage(),
    landingPage:
      getCurrentPage(),
    referrerUrl:
      typeof document !==
      "undefined"
        ? document.referrer ||
          null
        : null,
    userAgent:
      getUserAgent(),
    deviceType:
      getDeviceType(),
    browser: null,
    operatingSystem: null,
    referralCode:
      getReferralCode(),
  };
}

export async function initializeVisitorTracking(
  userId: string | null = null,
): Promise<VisitorTrackingState> {
  const existingSessionId =
    getStoredVisitorSessionId();

  const sessionId =
    existingSessionId ??
    createVisitorSessionId();

  const createResponse =
    await requestVisitorTracking<CreateSessionResponse>(
      {
        action:
          "create-session",
        input:
          buildSessionInput(
            sessionId,
          ),
      },
    );

  if (
    !createResponse.success ||
    !createResponse.data
  ) {
    throw new Error(
      createResponse.error ??
        "Failed to initialize visitor tracking",
    );
  }

  if (userId) {
    const updateResponse =
      await requestVisitorTracking<UpdateSessionResponse>(
        {
          action:
            "update-session",
          input: {
            sessionId,
            currentPage:
              getCurrentPage(),
            userId,
          },
        },
      );

    if (
      !updateResponse.success
    ) {
      throw new Error(
        updateResponse.error ??
          "Failed to associate visitor session with user",
      );
    }
  }

  /*
   * A visit belongs to the current
   * browser tab session.
   *
   * sessionStorage survives refreshes
   * but is cleared when the tab/window
   * is closed.
   *
   * Therefore we only register a visit
   * when this tab has not registered
   * one yet.
   */
  if (!hasCurrentVisit()) {
    try {
      const visitResult =
        await registerVisitorVisit(
          sessionId,
          userId,
        );

      /*
       * Mark the browser tab as having
       * an active visit only after the
       * server successfully processes it.
       */
      markCurrentVisit();

      console.log(
        "VISITOR VISIT RESULT:",
        visitResult,
      );
    } catch (error) {
      /*
       * Visit registration failure must
       * not prevent the visitor tracking
       * system from initializing.
       */
      console.error(
        "Failed to register visitor visit:",
        error,
      );
    }
  }

  return {
    sessionId,
    sessionUuid:
      createResponse.data,
    userId,
    currentPage:
      getCurrentPage(),
    isInitialized: true,
    isOnline: true,
  };
}

export async function registerVisitorVisit(
  sessionId: string,
  userId: string | null = null,
): Promise<{
  isNewVisit: boolean;
  visitNumber: number;
}> {
  const response =
    await requestVisitorTracking<RegisterVisitResponse>(
      {
        action:
          "register-visit",
        input: {
          sessionId,
          pageUrl:
            typeof window !==
            "undefined"
              ? window.location.href
              : null,
          pageTitle:
            typeof document !==
            "undefined"
              ? document.title ||
                null
              : null,
          userId,
        },
      },
    );

  if (
    !response.success ||
    !response.data
  ) {
    throw new Error(
      response.error ??
        "Failed to register visitor visit",
    );
  }

  return {
    isNewVisit:
      response.data
        .is_new_visit,
    visitNumber:
      response.data
        .visit_number,
  };
}

export async function trackVisitorPage(
  sessionId: string,
  userId: string | null = null,
): Promise<void> {
  const currentPage =
    getCurrentPage();

  const updateResponse =
    await requestVisitorTracking<UpdateSessionResponse>(
      {
        action:
          "update-session",
        input: {
          sessionId,
          currentPage,
          userId,
        },
      },
    );

  if (
    !updateResponse.success
  ) {
    throw new Error(
      updateResponse.error ??
        "Failed to update visitor session",
    );
  }

  const eventType: VisitorEventType =
    currentPage === "/"
      ? "LANDING_PAGE_VIEW"
      : "PAGE_VIEW";

  await trackVisitorEvent(
    sessionId,
    eventType,
    {
      userId,
      pageUrl:
        typeof window !==
        "undefined"
          ? window.location.href
          : null,
      pageTitle:
        typeof document !==
        "undefined"
          ? document.title ||
            null
          : null,
    },
  );
}

export async function trackVisitorEvent(
  sessionId: string,
  eventType: VisitorEventType,
  options?: {
    userId?: string | null;
    pageUrl?: string | null;
    pageTitle?: string | null;
    referenceId?: string | null;
    referenceType?: string | null;
    metadata?: VisitorEventMetadata | null;
  },
): Promise<string> {
  const input: RecordVisitorEventInput =
    {
      sessionId,
      eventType,
      userId:
        options?.userId ??
        null,
      pageUrl:
        options?.pageUrl ??
        (typeof window !==
        "undefined"
          ? window.location.href
          : null),
      pageTitle:
        options?.pageTitle ??
        (typeof document !==
        "undefined"
          ? document.title ||
            null
          : null),
      referenceId:
        options?.referenceId ??
        null,
      referenceType:
        options?.referenceType ??
        null,
      metadata:
        options?.metadata ??
        null,
    };

  const response =
    await requestVisitorTracking<RecordEventResponse>(
      {
        action:
          "record-event",
        input,
      },
    );

  if (
    !response.success ||
    !response.data
  ) {
    throw new Error(
      response.error ??
        "Failed to record visitor event",
    );
  }

  return response.data;
}