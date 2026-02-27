import { useState, useEffect, useRef } from 'react';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';

const TIMEOUT_MS = 5_000;

export interface AdminCheckResult {
  isAdmin: boolean;
  isLoading: boolean;
  error: Error | null;
  timedOut: boolean;
}

/**
 * Wrapper hook that checks admin status with a hard timeout.
 * - If not authenticated: immediately returns isAdmin=false, isLoading=false.
 * - If authenticated: races the actor call against a 5-second timeout.
 * - On timeout: returns isAdmin=false, isLoading=false, timedOut=true.
 */
export function useIsCallerAdminWithTimeout(): AdminCheckResult {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity, isInitializing } = useInternetIdentity();

  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [timedOut, setTimedOut] = useState(false);

  const checkedRef = useRef(false);
  const identityKey = identity?.getPrincipal().toString() ?? null;

  useEffect(() => {
    // Reset state when identity changes
    checkedRef.current = false;
    setIsAdmin(false);
    setIsLoading(true);
    setError(null);
    setTimedOut(false);
  }, [identityKey]);

  useEffect(() => {
    // Still initializing identity from storage — wait
    if (isInitializing) {
      setIsLoading(true);
      return;
    }

    // Not authenticated — resolve immediately
    if (!identity) {
      setIsAdmin(false);
      setIsLoading(false);
      setError(null);
      return;
    }

    // Authenticated but actor not ready yet — wait (with timeout below)
    if (actorFetching || !actor) {
      setIsLoading(true);
      // Fall through to timeout logic
    }

    if (checkedRef.current) return;

    // Set up timeout
    const timeoutId = setTimeout(() => {
      if (!checkedRef.current) {
        checkedRef.current = true;
        setTimedOut(true);
        setIsAdmin(false);
        setIsLoading(false);
      }
    }, TIMEOUT_MS);

    // If actor is ready, perform the check
    if (actor && !actorFetching) {
      checkedRef.current = true;
      clearTimeout(timeoutId);

      actor
        .isCallerAdmin()
        .then((result) => {
          setIsAdmin(result);
          setIsLoading(false);
          setError(null);
        })
        .catch((err: unknown) => {
          setIsAdmin(false);
          setIsLoading(false);
          setError(err instanceof Error ? err : new Error('Admin-Prüfung fehlgeschlagen'));
        });
    }

    return () => clearTimeout(timeoutId);
  }, [isInitializing, identity, actor, actorFetching, identityKey]);

  return { isAdmin, isLoading, error, timedOut };
}
