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
  const resolvedKeyRef = useRef<string | null>(null);
  // Track the overall timeout that covers actor-wait + admin-check
  const overallTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const principalKey = identity?.getPrincipal().toString() ?? null;
  const checkKey = principalKey ? `${principalKey}:${retryCount}` : null;

  useEffect(() => {
    // Still initializing identity — keep loading, but start overall timeout
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
      // Clear any pending overall timeout
      if (overallTimeoutRef.current) {
        clearTimeout(overallTimeoutRef.current);
        overallTimeoutRef.current = null;
      }
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

    // Start the overall timeout as soon as we know the user is authenticated.
    // This covers both the actor-wait phase and the actual admin-check phase.
    if (overallTimeoutRef.current) {
      clearTimeout(overallTimeoutRef.current);
    }
    overallTimeoutRef.current = setTimeout(() => {
      if (mountedRef.current && resolvedKeyRef.current !== checkKey) {
        setTimedOut(true);
        setIsLoading(false);
      }
    }, timeoutMs);

    // Actor not ready yet — keep loading, wait for actor
    if (actorFetching || !actor) {
      // The overall timeout above will fire if actor never becomes ready
      return;
    }

    // Actor is ready — perform the admin check
    let cancelled = false;

    actor
      .isCallerAdmin()
      .then((result) => {
        if (!cancelled && mountedRef.current) {
          // Clear the overall timeout since we got a result
          if (overallTimeoutRef.current) {
            clearTimeout(overallTimeoutRef.current);
            overallTimeoutRef.current = null;
          }
          setIsAdmin(result);
          setIsLoading(false);
          setTimedOut(false);
          resolvedKeyRef.current = checkKey;
        }
      })
      .catch((err) => {
        if (!cancelled && mountedRef.current) {
          // Clear the overall timeout since we got a result (error)
          if (overallTimeoutRef.current) {
            clearTimeout(overallTimeoutRef.current);
            overallTimeoutRef.current = null;
          }
          setError(err instanceof Error ? err : new Error(String(err)));
          setIsAdmin(false);
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
      // Do NOT clear overallTimeoutRef here — it should persist across
      // re-renders caused by actor/actorFetching changes so the timeout
      // covers the entire wait period from authentication to resolution.
    };
  }, [actor, actorFetching, identity, isInitializing, principalKey, checkKey, timeoutMs]);

  // Cleanup overall timeout on unmount
  useEffect(() => {
    return () => {
      if (overallTimeoutRef.current) {
        clearTimeout(overallTimeoutRef.current);
      }
    };
  }, []);

  const retry = useCallback(() => {
    // Clear any pending timeout before retry
    if (overallTimeoutRef.current) {
      clearTimeout(overallTimeoutRef.current);
      overallTimeoutRef.current = null;
    }
    resolvedKeyRef.current = null;
    setTimedOut(false);
    setError(null);
    setIsAdmin(false);
    setIsLoading(true);
    setRetryCount((c) => c + 1);
  }, []);

  return { isAdmin, isLoading, timedOut, error, retry };
}
