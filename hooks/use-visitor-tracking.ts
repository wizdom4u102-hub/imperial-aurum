"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import {
  initializeVisitorTracking,
  trackVisitorPage,
} from "@/lib/visitor-tracking/tracker";

import type {
  VisitorTrackingState,
} from "@/lib/visitor-tracking/types";

export function useVisitorTracking(
  userId: string | null = null,
): VisitorTrackingState {
  const pathname = usePathname();

  const [state, setState] =
    useState<VisitorTrackingState>({
      sessionId: null,
      sessionUuid: null,
      userId,
      currentPage: pathname,
      isInitialized: false,
      isOnline: false,
    });

  const sessionIdRef =
    useRef<string | null>(null);

  const initializedRef =
    useRef(false);

  const previousUserIdRef =
    useRef<string | null>(userId);

  const previousPathRef =
    useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function initialize(): Promise<void> {
      if (initializedRef.current) {
        return;
      }

      try {
        const trackingState =
          await initializeVisitorTracking(
            userId,
          );

        if (cancelled) {
          return;
        }

        if (!trackingState.sessionId) {
          throw new Error(
            "Visitor tracking session ID is missing",
          );
        }

        initializedRef.current = true;

        sessionIdRef.current =
          trackingState.sessionId;

        previousUserIdRef.current =
          userId;

        previousPathRef.current =
          pathname;

        setState(
          trackingState,
        );
      } catch {
        if (cancelled) {
          return;
        }

        initializedRef.current =
          false;

        setState(
          (currentState) => ({
            ...currentState,
            isInitialized: false,
            isOnline: false,
          }),
        );
      }
    }

    void initialize();

    return () => {
      cancelled = true;
    };
  }, [pathname, userId]);

  useEffect(() => {
    const sessionId =
      sessionIdRef.current;

    if (
      !sessionId ||
      !initializedRef.current
    ) {
      return;
    }

    if (
      previousUserIdRef.current ===
      userId
    ) {
      return;
    }

    previousUserIdRef.current =
      userId;

    void trackVisitorPage(
      sessionId,
      userId,
    ).catch(() => {
      /*
       * Tracking failures must not
       * interrupt authentication.
       */
    });

    setState(
      (currentState) => ({
        ...currentState,
        userId,
        currentPage: pathname,
        isOnline: true,
      }),
    );
  }, [pathname, userId]);

  useEffect(() => {
    const sessionId =
      sessionIdRef.current;

    if (
      !sessionId ||
      !initializedRef.current
    ) {
      return;
    }

    if (
      previousPathRef.current ===
      pathname
    ) {
      return;
    }

    previousPathRef.current =
      pathname;

    void trackVisitorPage(
      sessionId,
      userId,
    ).catch(() => {
      /*
       * Tracking failures must not
       * interrupt navigation.
       */
    });

    setState(
      (currentState) => ({
        ...currentState,
        userId,
        currentPage: pathname,
        isOnline: true,
      }),
    );
  }, [pathname, userId]);

  useEffect(() => {
    const sessionId =
      sessionIdRef.current;

    if (
      !sessionId ||
      !initializedRef.current
    ) {
      return;
    }

    const handleVisibilityChange =
      (): void => {
        if (
          document.visibilityState !==
          "visible"
        ) {
          return;
        }

        void trackVisitorPage(
          sessionId,
          userId,
        ).catch(() => {
          /*
           * Tracking failures must
           * not interrupt the
           * visitor experience.
           */
        });

        setState(
          (currentState) => ({
            ...currentState,
            userId,
            currentPage: pathname,
            isOnline: true,
          }),
        );
      };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
    };
  }, [pathname, userId]);

  return state;
}