"use client";

import { useCallback, useEffect, useState } from "react";

import {
  getAdminVisitorData,
} from "@/lib/live-chat/admin-visitor-api-client";

import type {
  VisitorEventRecord,
  VisitorSessionRecord,
} from "@/lib/visitor-tracking/types";

interface AdminVisitorState {
  session: VisitorSessionRecord | null;
  events: VisitorEventRecord[];
  isLoading: boolean;
  error: string | null;
}

export function useAdminVisitor(
  sessionId: string | null,
) {
  const [state, setState] =
    useState<AdminVisitorState>({
      session: null,
      events: [],
      isLoading: false,
      error: null,
    });

  const loadVisitor = useCallback(async (): Promise<void> => {
    if (!sessionId) {
      setState({
        session: null,
        events: [],
        isLoading: false,
        error: null,
      });

      return;
    }

    setState((currentState) => ({
      ...currentState,
      isLoading: true,
      error: null,
    }));

    try {
      const data =
        await getAdminVisitorData(sessionId);

      setState({
        session: data.session,
        events: data.events,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState((currentState) => ({
        ...currentState,
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load visitor information",
      }));
    }
  }, [sessionId]);

  useEffect(() => {
    void loadVisitor();
  }, [loadVisitor]);

  return {
    ...state,
    refreshVisitor: loadVisitor,
  };
}