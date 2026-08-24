"use client";

import { useEffect, useState } from "react";
import type {
  AuthChangeEvent,
  Session,
} from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";
import LiveChat from "@/components/live-chat/live-chat";
import { useVisitorTracking } from "@/hooks/use-visitor-tracking";

export default function VisitorTrackingProvider() {
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    async function loadInitialUser(): Promise<void> {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (mounted) {
          setUserId(user?.id ?? null);
        }
      } catch {
        if (mounted) {
          setUserId(null);
        }
      }
    }

    void loadInitialUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (
        _event: AuthChangeEvent,
        session: Session | null,
      ) => {
        if (!mounted) {
          return;
        }

        setUserId(session?.user.id ?? null);
      },
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const visitorTracking = useVisitorTracking(userId);

  return (
    <>
      {visitorTracking.isInitialized ? (
        <LiveChat
          sessionId={visitorTracking.sessionId}
          userId={visitorTracking.userId}
        />
      ) : null}
    </>
  );
}