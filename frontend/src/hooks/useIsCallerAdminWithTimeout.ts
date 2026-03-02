import { useEffect, useRef, useState } from 'react';
import { useInternetIdentity } from './useInternetIdentity';
import { useActor } from './useActor';

export type AdminPhase =
  | 'initializing'
  | 'waiting-for-actor'
  | 'checking'
  | 'confirmed'
  | 'denied'
  | 'error'
  | 'timeout';

export interface AdminCheckResult {
  phase: AdminPhase;
  isAdmin: boolean;
  retry: () => void;
}

const DEFAULT_TIMEOUT_MS = 15000;

export function useIsCallerAdminWithTimeout(timeoutMs: number = DEFAULT_TIMEOUT_MS): AdminCheckResult {
  const { identity, isInitializing } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const [phase, setPhase] = useState<AdminPhase>('initializing');
  const [retryCount, setRetryCount] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const checkedRef = useRef(false);

  const retry = () => {
    checkedRef.current = false;
    setRetryCount(c => c + 1);
    setPhase('initializing');
  };

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    checkedRef.current = false;

    // Still initializing identity
    if (isInitializing) {
      setPhase('initializing');
      return;
    }

    // Not logged in — deny immediately
    if (!identity) {
      setPhase('denied');
      return;
    }

    // Actor not ready yet — wait for it
    if (actorFetching || !actor) {
      setPhase('waiting-for-actor');

      timeoutRef.current = setTimeout(() => {
        if (!checkedRef.current) {
          setPhase('timeout');
        }
      }, timeoutMs);
      return;
    }

    // Actor is ready — perform backend check
    setPhase('checking');

    const performCheck = async () => {
      try {
        // Use checkIsAdmin() which is a query call (faster, no consensus needed)
        const result = await actor.checkIsAdmin();
        checkedRef.current = true;
        setPhase(result ? 'confirmed' : 'denied');
      } catch (err: unknown) {
        checkedRef.current = true;
        console.error('[AdminCheck] checkIsAdmin() error:', err);
        setPhase('error');
      }
    };

    // Set timeout for backend check
    timeoutRef.current = setTimeout(() => {
      if (!checkedRef.current) {
        setPhase('timeout');
      }
    }, timeoutMs);

    performCheck();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [identity, isInitializing, actor, actorFetching, retryCount, timeoutMs]);

  const isAdmin = phase === 'confirmed';

  return { phase, isAdmin, retry };
}
