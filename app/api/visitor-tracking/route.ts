import { NextResponse } from "next/server";

import {
  createVisitorSession,
  recordVisitorEvent,
  registerVisitorVisit,
  updateVisitorSession,
} from "@/lib/visitor-tracking/service";

import {
  notifyAdminOfNewVisitor,
} from "@/lib/live-chat/push-notifications";

import type {
  CreateVisitorSessionInput,
  RecordVisitorEventInput,
  UpdateVisitorSessionInput,
} from "@/lib/visitor-tracking/types";

type RegisterVisitorVisitInput = {
  sessionId: string;
  pageUrl: string | null;
  pageTitle: string | null;
  userId: string | null;
};

type VisitorTrackingRequest =
  | {
      action: "create-session";
      input: CreateVisitorSessionInput;
    }
  | {
      action: "update-session";
      input: UpdateVisitorSessionInput;
    }
  | {
      action: "record-event";
      input: RecordVisitorEventInput;
    }
  | {
      action: "register-visit";
      input: RegisterVisitorVisitInput;
    };

export async function POST(
  request: Request,
) {
  try {
    const body: VisitorTrackingRequest =
      await request.json();

    switch (body.action) {
      case "create-session": {
        const sessionUuid =
          await createVisitorSession(
            body.input,
          );

        return NextResponse.json({
          success: true,
          data: sessionUuid,
        });
      }

      case "register-visit": {
        const visitResult =
          await registerVisitorVisit(
            body.input,
          );

        if (
          visitResult.is_new_visit
        ) {
          await notifyAdminOfNewVisitor(
            body.input.sessionId,
            visitResult.visit_number,
          );
        }

        return NextResponse.json({
          success: true,
          data: visitResult,
        });
      }

      case "update-session": {
        const updated =
          await updateVisitorSession(
            body.input,
          );

        return NextResponse.json({
          success: true,
          data: updated,
        });
      }

      case "record-event": {
        const eventId =
          await recordVisitorEvent(
            body.input,
          );

        return NextResponse.json({
          success: true,
          data: eventId,
        });
      }

      default:
        return NextResponse.json(
          {
            success: false,
            error:
              "Unsupported visitor tracking action",
          },
          { status: 400 },
        );
    }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Visitor tracking request failed";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 },
    );
  }
}