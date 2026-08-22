import type {
  VisitorEventRecord,
  VisitorSessionRecord,
} from "@/lib/visitor-tracking/types";

const ADMIN_VISITOR_API =
  "/api/admin/live-chat/visitor";

export interface AdminVisitorData {
  session: VisitorSessionRecord;
  events: VisitorEventRecord[];
}

type AdminVisitorApiResponse = {
  success: boolean;
  data?: AdminVisitorData;
  error?: string;
};

export async function getAdminVisitorData(
  sessionId: string,
): Promise<AdminVisitorData> {
  const params = new URLSearchParams({
    sessionId,
  });

  const response = await fetch(
    `${ADMIN_VISITOR_API}?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const result: AdminVisitorApiResponse =
    await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.error ??
        "Failed to load visitor information",
    );
  }

  if (!result.data) {
    throw new Error(
      "Visitor information was not returned",
    );
  }

  return result.data;
}