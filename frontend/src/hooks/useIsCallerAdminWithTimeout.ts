import { useEffect, useRef, useState, useCallback } from 'react';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';

interface AdminCheckResult {
  isAdmin: boolean;
  isLoading: boolean;
  timedOut: boolean;
  error: Error | null;
  retry: () => void;
}

export function useIsCallerAdminWithTimeout(timeoutMs = 15000): AdminCheckResult {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity, isInitializing } = useInternetIdentity();

  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [timedOut, setTimedOut] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const mountedRef = useRef(true);
  // Track which principal+retry combination we've already resolved
  const resolvedKeyRef = useRef<string | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const principalKey = identity?.getPrincipal().toString() ?? null;
  // Include retryCount so a manual retry forces a new check
  const checkKey = principalKey ? `${principalKey}:${retryCount}` : null;

  useEffect(() => {
    // Still initializing — keep loading
    if (isInitializing) {
      setIsLoading(true);
      return;
    }

    // Not authenticated — resolve immediately as non-admin
    if (!identity || !principalKey) {
      setIsAdmin(false);
      setIsLoading(false);
      setTimedOut(false);
      setError(null);
      resolvedKeyRef.current = null;
      return;
    }

    // Actor not ready yet — keep loading, don't mark as resolved
    if (actorFetching || !actor) {
      setIsLoading(true);
      return;
    }

    // Already successfully resolved for this exact key — skip
    if (resolvedKeyRef.current === checkKey) {
      return;
    }

    // Reset state for fresh check
    setIsAdmin(false);
    setTimedOut(false);
    setError(null);
    setIsLoading(true);

    let cancelled = false;

    const timeoutId = setTimeout(() => {
      if (!cancelled && mountedRef.current) {
        setTimedOut(true);
        setIsLoading(false);
        // Don't mark as resolved on timeout so retry can work
      }
    }, timeoutMs);

    actor
      .isCallerAdmin()
      .then((result) => {
        clearTimeout(timeoutId);
        if (!cancelled && mountedRef.current) {
          setIsAdmin(result);
          setIsLoading(false);
          setTimedOut(false);
          // Mark this key as resolved so we don't re-check unnecessarily
          resolvedKeyRef.current = checkKey;
        }
      })
      .catch((err) => {
        clearTimeout(timeoutId);
        if (!cancelled && mountedRef.current) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setIsAdmin(false);
          setIsLoading(false);
          // Don't mark as resolved on error so retry can work
        }
      });

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      // NOTE: Do NOT reset resolvedKeyRef here — if the check completed before
      // cleanup, we want to keep the result. If it was cancelled mid-flight,
      // resolvedKeyRef was never set, so the next render will re-run the check
      // if dependencies change (e.g., actor becomes available again).
    };
  }, [actor, actorFetching, identity, isInitializing, principalKey, checkKey, timeoutMs]);

  const retry = useCallback(() => {
    resolvedKeyRef.current = null;
    setTimedOut(false);
    setError(null);
    setIsAdmin(false);
    setIsLoading(true);
    setRetryCount((c) => c + 1);
  }, []);

  return { isAdmin, isLoading, timedOut, error, retry };
}
