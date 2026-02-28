import { useEffect, useRef, useState, useCallback } from 'react';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';

interface AdminCheckResult {
  isAdmin: boolean;
  isLoading: boolean;
  timedOut: boolean;
  error: Error | null;
  retry: () => void;
  actorWaiting: boolean;
}

type Phase = 'idle' | 'waiting-actor' | 'checking-admin' | 'done' | 'timed-out' | 'error';

export function useIsCallerAdminWithTimeout(timeoutMs = 45000): AdminCheckResult {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity, isInitializing } = useInternetIdentity();

  const [phase, setPhase] = useState<Phase>('idle');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const mountedRef = useRef(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Track which (principalKey, retryCount) pair we've already started or resolved
  const startedRef = useRef<string | null>(null);
  const resolvedRef = useRef<string | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  const principalKey = identity?.getPrincipal().toString() ?? null;
  // Only treat as authenticated if principal is not anonymous
  const isAnonymous = identity ? identity.getPrincipal().isAnonymous() : true;
  const isAuthenticated = !!identity && !isAnonymous;

  const runKey = isAuthenticated && principalKey ? `${principalKey}:${retryCount}` : null;

  const clearTimeout_ = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    // Still initializing identity — wait silently
    if (isInitializing) {
      setPhase('idle');
      return;
    }

    // Not authenticated — resolve immediately as non-admin
    if (!isAuthenticated || !principalKey || !runKey) {
      clearTimeout_();
      startedRef.current = null;
      resolvedRef.current = null;
      setIsAdmin(false);
      setError(null);
      setPhase('done');
      return;
    }

    // runKey changed (new login or retry) — reset everything
    if (startedRef.current !== null && startedRef.current !== runKey) {
      clearTimeout_();
      startedRef.current = null;
      resolvedRef.current = null;
      setIsAdmin(false);
      setError(null);
      setPhase('idle');
      // Don't return — fall through to start the new check
    }

    // Already resolved for this exact key — nothing to do
    if (resolvedRef.current === runKey) {
      return;
    }

    // Already started for this key — don't re-trigger
    if (startedRef.current === runKey) {
      return;
    }

    // Actor is still being fetched — show waiting state and arm timeout once
    if (actorFetching || !actor) {
      setPhase('waiting-actor');

      // Arm the overall timeout only if not already armed
      if (!timeoutRef.current) {
        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null;
          if (mountedRef.current && resolvedRef.current !== runKey) {
            setPhase('timed-out');
          }
        }, timeoutMs);
      }
      return;
    }

    // Actor is ready — start the admin check
    startedRef.current = runKey;
    setPhase('checking-admin');
    setError(null);

    // Arm timeout if not already armed
    if (!timeoutRef.current) {
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        if (mountedRef.current && resolvedRef.current !== runKey) {
          setPhase('timed-out');
        }
      }, timeoutMs);
    }

    let cancelled = false;
    const capturedRunKey = runKey;
    const capturedActor = actor;

    capturedActor
      .isCallerAdmin()
      .then((result) => {
        if (cancelled || !mountedRef.current) return;
        clearTimeout_();
        resolvedRef.current = capturedRunKey;
        setIsAdmin(result);
        setError(null);
        setPhase('done');
      })
      .catch((err) => {
        if (cancelled || !mountedRef.current) return;
        clearTimeout_();
        // Don't mark as resolved so retry can work
        setError(err instanceof Error ? err : new Error(String(err)));
        setIsAdmin(false);
        setPhase('error');
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actor, actorFetching, isAuthenticated, isInitializing, principalKey, runKey, timeoutMs]);

  const retry = useCallback(() => {
    clearTimeout_();
    startedRef.current = null;
    resolvedRef.current = null;
    setIsAdmin(false);
    setError(null);
    setPhase('idle');
    setRetryCount((c) => c + 1);
  }, [clearTimeout_]);

  const isLoading = phase === 'idle' || phase === 'waiting-actor' || phase === 'checking-admin';
  const timedOut = phase === 'timed-out';
  const actorWaiting = phase === 'waiting-actor';

  return { isAdmin, isLoading, timedOut, error, retry, actorWaiting };
}
