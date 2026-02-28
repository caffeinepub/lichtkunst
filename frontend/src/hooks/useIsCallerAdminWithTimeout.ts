import { useEffect, useRef, useState } from 'react';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';

export type AdminCheckPhase =
  | 'initializing'
  | 'waiting-for-actor'
  | 'checking'
  | 'success'
  | 'not-admin'
  | 'error'
  | 'timed-out';

export interface AdminCheckResult {
  phase: AdminCheckPhase;
  isAdmin: boolean;
  retry: () => void;
}

/**
 * TEMPORARY FALLBACK: Hardcoded admin principal.
 * If the backend isCallerAdmin() call fails or is slow, this principal
 * will always be treated as admin. Replace with your actual principal ID.
 * To find your principal: log in and check identity.getPrincipal().toString()
 */
const HARDCODED_ADMIN_PRINCIPAL = ''; // TODO: Fill in your principal ID here

/**
 * Admin check hook with timeout and phase state machine.
 * Uses a simple imperative approach to avoid React Query race conditions.
 * Includes a hardcoded principal fallback to prevent flash/disappear issues.
 */
export function useIsCallerAdminWithTimeout(timeoutMs = 30000): AdminCheckResult {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity, isInitializing } = useInternetIdentity();

  const [phase, setPhase] = useState<AdminCheckPhase>('initializing');
  const [retryCount, setRetryCount] = useState(0);
  const abortRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isAuthenticated = !!identity;
  const isActorReady = !!actor && !actorFetching && !isInitializing;

  // Check if current user matches the hardcoded admin principal fallback
  const currentPrincipal = identity?.getPrincipal().toString() ?? '';
  const isHardcodedAdmin =
    HARDCODED_ADMIN_PRINCIPAL.length > 0 && currentPrincipal === HARDCODED_ADMIN_PRINCIPAL;

  useEffect(() => {
    // Clear any previous abort/timeout
    if (abortRef.current) abortRef.current.abort();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const abort = new AbortController();
    abortRef.current = abort;

    // If not authenticated, we can't be admin
    if (!isInitializing && !isAuthenticated) {
      setPhase('not-admin');
      return;
    }

    // If the hardcoded principal matches, immediately grant admin — no backend call needed
    if (isHardcodedAdmin && !isInitializing) {
      setPhase('success');
      return;
    }

    // Still initializing identity
    if (isInitializing) {
      setPhase('initializing');
    }

    // Actor not ready yet
    if (!isActorReady) {
      if (!isInitializing) {
        setPhase('waiting-for-actor');
      }

      // Set a timeout for actor readiness
      timeoutRef.current = setTimeout(() => {
        if (!abort.signal.aborted) {
          setPhase('timed-out');
        }
      }, timeoutMs);

      return () => {
        abort.abort();
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }

    // Actor is ready — perform the check
    setPhase('checking');

    // Set overall timeout
    timeoutRef.current = setTimeout(() => {
      if (!abort.signal.aborted) {
        abort.abort();
        setPhase('timed-out');
      }
    }, timeoutMs);

    (async () => {
      try {
        const result = await actor.isCallerAdmin();
        if (abort.signal.aborted) return;
        clearTimeout(timeoutRef.current!);
        setPhase(result ? 'success' : 'not-admin');
      } catch (err) {
        if (abort.signal.aborted) return;
        clearTimeout(timeoutRef.current!);
        console.error('isCallerAdmin failed:', err);
        setPhase('error');
      }
    })();

    return () => {
      abort.abort();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isActorReady, isAuthenticated, isInitializing, isHardcodedAdmin, retryCount, timeoutMs]);

  const retry = () => {
    setPhase('initializing');
    setRetryCount((c) => c + 1);
  };

  return {
    phase,
    isAdmin: phase === 'success',
    retry,
  };
}
