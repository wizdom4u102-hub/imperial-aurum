import { NextResponse } from "next/server";

import {
  getVisitorEvents,
  getVisitorSession,
} from "@/lib/live-chat/visitor-service";

type VisitorResponse = {
  success: boolean;
  data?: {
    session: Awaited<
      ReturnType<typeof getVisitorSession>
    >;
    events: Awaited<
      ReturnType<typeof getVisitorEvents>
    >;
  };
  error?: string;
};

export async function GET(
  request: Request,
): Promise<NextResponse<VisitorResponse>> {
  try {
    const { searchParams } =
      new URL(request.url);

    const sessionId =
      searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          error: "sessionId is required",
        },
        { status: 400 },
      );
    }

    const [session, events] =
      await Promise.all([
        getVisitorSession(sessionId),
        getVisitorEvents(sessionId),
      ]);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "Visitor session not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        session,
        events,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to load visitor information";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 },
    );
  }
}