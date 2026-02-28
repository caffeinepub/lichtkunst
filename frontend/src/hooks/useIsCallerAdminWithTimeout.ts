import { useEffect, useRef, useState, useCallback } from 'react';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useActorReady } from './useActorReady';

interface AdminCheckResult {
  isAdmin: boolean;
  isLoading: boolean;
  timedOut: boolean;
  error: Error | null;
  retry: () => void;
  actorWaiting: boolean;
  phase: Phase;
}

type Phase = 'idle' | 'waiting-actor' | 'checking-admin' | 'done' | 'timed-out' | 'error';

export function useIsCallerAdminWithTimeout(timeoutMs = 60000): AdminCheckResult {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity, isInitializing } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { isActorReady, actorError } = useActorReady();

  const [phase, setPhase] = useState<Phase>('idle');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const mountedRef = useRef(true);
  const phaseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Track which (principalKey, retryCount) pair we've already started or resolved
  const startedRef = useRef<string | null>(null);
  const resolvedRef = useRef<string | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (phaseTimeoutRef.current) {
        clearTimeout(phaseTimeoutRef.current);
        phaseTimeoutRef.current = null;
      }
      if (maxTimeoutRef.current) {
        clearTimeout(maxTimeoutRef.current);
        maxTimeoutRef.current = null;
      }
    };
  }, []);

  const principalKey = identity?.getPrincipal().toString() ?? undefined;
  // Only treat as authenticated if principal is not anonymous
  const isAnonymous = identity ? identity.getPrincipal().isAnonymous() : true;
  const isAuthenticated = !!identity && !isAnonymous;

  const runKey = isAuthenticated && principalKey ? `${principalKey}:${retryCount}` : null;

  // Check that the actor query for the current identity is in a 'success' state.
  const actorQueryState = queryClient.getQueryState(['actor', principalKey]);
  const actorMatchesIdentity =
    isActorReady || (actorQueryState?.status === 'success' && !!actor && !actorFetching);

  const clearAllTimeouts = useCallback(() => {
    if (phaseTimeoutRef.current) {
      clearTimeout(phaseTimeoutRef.current);
      phaseTimeoutRef.current = null;
    }
    if (maxTimeoutRef.current) {
      clearTimeout(maxTimeoutRef.current);
      maxTimeoutRef.current = null;
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
      clearAllTimeouts();
      startedRef.current = null;
      resolvedRef.current = null;
      setIsAdmin(false);
      setError(null);
      setPhase('done');
      return;
    }

    // runKey changed (new login or retry) — reset everything
    if (startedRef.current !== null && startedRef.current !== runKey) {
      clearAllTimeouts();
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
      // But check if actor error arrived after we started waiting
      if (actorError && phase === 'waiting-actor') {
        clearAllTimeouts();
        setError(actorError);
        setPhase('error');
      }
      return;
    }

    // Actor connection failed — transition to error immediately
    if (actorError) {
      clearAllTimeouts();
      startedRef.current = runKey;
      resolvedRef.current = runKey;
      setError(actorError);
      setIsAdmin(false);
      setPhase('error');
      return;
    }

    // Actor is still being fetched, not yet available, or doesn't match current identity yet.
    if (actorFetching || !actor || !actorMatchesIdentity) {
      setPhase('waiting-actor');

      // Arm the overall timeout only if not already armed
      if (!phaseTimeoutRef.current && !maxTimeoutRef.current) {
        phaseTimeoutRef.current = setTimeout(() => {
          phaseTimeoutRef.current = null;
          if (mountedRef.current && resolvedRef.current !== runKey) {
            setPhase('timed-out');
          }
        }, timeoutMs);
      }
      return;
    }

    // Actor is ready and matches current identity — start the admin check
    startedRef.current = runKey;
    setPhase('checking-admin');
    setError(null);

    // Arm timeout if not already armed
    if (!phaseTimeoutRef.current && !maxTimeoutRef.current) {
      phaseTimeoutRef.current = setTimeout(() => {
        phaseTimeoutRef.current = null;
        if (mountedRef.current && resolvedRef.current !== runKey) {
          setPhase('timed-out');
        }
      }, timeoutMs);
    }

    // Hard maximum guard: force timed-out after 2x timeoutMs regardless of phase
    if (!maxTimeoutRef.current) {
      maxTimeoutRef.current = setTimeout(() => {
        maxTimeoutRef.current = null;
        if (mountedRef.current && resolvedRef.current !== runKey) {
          setPhase('timed-out');
        }
      }, timeoutMs * 2);
    }

    let cancelled = false;
    const capturedRunKey = runKey;
    const capturedActor = actor;

    capturedActor
      .isCallerAdmin()
      .then((result) => {
        if (cancelled || !mountedRef.current) return;
        clearAllTimeouts();
        resolvedRef.current = capturedRunKey;
        setIsAdmin(result);
        setError(null);
        setPhase('done');
      })
      .catch((err) => {
        if (cancelled || !mountedRef.current) return;
        clearAllTimeouts();
        // Don't mark as resolved so retry can work
        setError(err instanceof Error ? err : new Error(String(err)));
        setIsAdmin(false);
        setPhase('error');
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actor, actorFetching, actorMatchesIdentity, actorError, isActorReady, isAuthenticated, isInitializing, principalKey, runKey, timeoutMs]);

  const retry = useCallback(() => {
    clearAllTimeouts();
    startedRef.current = null;
    resolvedRef.current = null;
    setIsAdmin(false);
    setError(null);
    setPhase('idle');
    setRetryCount((c) => c + 1);
  }, [clearAllTimeouts]);

  const isLoading = phase === 'idle' || phase === 'waiting-actor' || phase === 'checking-admin';
  const timedOut = phase === 'timed-out';
  const actorWaiting = phase === 'waiting-actor';

  return { isAdmin, isLoading, timedOut, error, retry, actorWaiting, phase };
}
