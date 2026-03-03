import { useState, useEffect, useCallback, useRef } from "react";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export type AdminCheckPhase =
  | "initializing"
  | "waiting-for-actor"
  | "checking"
  | "confirmed"
  | "denied"
  | "timeout"
  | "error";

export interface UseIsCallerAdminWithTimeoutResult {
  phase: AdminCheckPhase;
  isAdmin: boolean;
  retry: () => void;
  errorMessage?: string;
}

export function useIsCallerAdminWithTimeout(): UseIsCallerAdminWithTimeoutResult {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity, isInitializing } = useInternetIdentity();

  const [phase, setPhase] = useState<AdminCheckPhase>("initializing");
  const [isAdmin, setIsAdmin] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [retryCount, setRetryCount] = useState(0);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const checkDoneRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const retry = useCallback(() => {
    clearTimer();
    checkDoneRef.current = false;
    setPhase("initializing");
    setIsAdmin(false);
    setErrorMessage(undefined);
    setRetryCount((c) => c + 1);
  }, [clearTimer]);

  useEffect(() => {
    // Still initializing identity
    if (isInitializing) {
      setPhase("initializing");
      return;
    }

    // Not authenticated — no admin check needed
    if (!identity) {
      setPhase("denied");
      setIsAdmin(false);
      return;
    }

    // Actor not ready yet
    if (actorFetching || !actor) {
      setPhase("waiting-for-actor");
      return;
    }

    // Already completed this check
    if (checkDoneRef.current) return;

    // Start the admin check
    checkDoneRef.current = true;
    setPhase("checking");

    // Set a 30-second timeout for production network conditions
    timeoutRef.current = setTimeout(() => {
      if (phase !== "confirmed" && phase !== "denied" && phase !== "error") {
        setPhase("timeout");
        setErrorMessage("Admin-Prüfung hat zu lange gedauert. Bitte erneut versuchen.");
      }
    }, 30_000);

    async function checkAdmin() {
      try {
        // Try checkIsAdmin (query call) first
        let result = false;
        try {
          result = await actor!.checkIsAdmin();
        } catch (queryErr) {
          // Fallback to isCallerAdmin (update call)
          try {
            result = await actor!.isCallerAdmin();
          } catch (updateErr) {
            throw updateErr;
          }
        }

        clearTimer();
        setIsAdmin(result);
        setPhase(result ? "confirmed" : "denied");
      } catch (err: any) {
        clearTimer();
        const msg = err?.message ?? String(err);
        setErrorMessage(msg);
        setPhase("error");
        setIsAdmin(false);
      }
    }

    checkAdmin();

    return () => {
      clearTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actor, actorFetching, identity, isInitializing, retryCount]);

  return { phase, isAdmin, retry, errorMessage };
}
