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

const HARDCODED_ADMIN_PRINCIPAL = 'uorkh-nazas-r5n3p-kj44w-gwm4i-liaj3-jqjll-ws44w-7dlve-3mshw-sae';
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

    if (isInitializing) {
      setPhase('initializing');
      return;
    }

    if (!identity) {
      setPhase('denied');
      return;
    }

    const callerPrincipal = identity.getPrincipal().toString();
    const normalizedCaller = callerPrincipal.trim().toLowerCase();
    const normalizedHardcoded = HARDCODED_ADMIN_PRINCIPAL.trim().toLowerCase();

    console.log('[AdminCheck] Caller principal:', callerPrincipal);
    console.log('[AdminCheck] Hardcoded admin principal:', HARDCODED_ADMIN_PRINCIPAL);
    console.log('[AdminCheck] Normalized caller:', normalizedCaller);
    console.log('[AdminCheck] Normalized hardcoded:', normalizedHardcoded);
    console.log('[AdminCheck] Principals match (hardcoded check):', normalizedCaller === normalizedHardcoded);

    // Immediate hardcoded admin check — no backend call needed
    if (normalizedCaller === normalizedHardcoded) {
      console.log('[AdminCheck] ✅ Hardcoded admin match — granting admin access immediately');
      setPhase('confirmed');
      return;
    }

    // Not the hardcoded admin — proceed with backend check
    if (actorFetching || !actor) {
      setPhase('waiting-for-actor');

      // Start timeout while waiting for actor
      timeoutRef.current = setTimeout(() => {
        if (!checkedRef.current) {
          console.warn('[AdminCheck] ⏱ Timeout waiting for actor');
          setPhase('timeout');
        }
      }, timeoutMs);
      return;
    }

    // Actor is ready — perform backend check
    setPhase('checking');

    const performCheck = async () => {
      try {
        console.log('[AdminCheck] Calling backend isCallerAdmin()...');
        const result = await actor.isCallerAdmin();
        checkedRef.current = true;
        console.log('[AdminCheck] Backend isCallerAdmin() result:', result);
        console.log('[AdminCheck] Final admin status:', result);
        setPhase(result ? 'confirmed' : 'denied');
      } catch (err) {
        checkedRef.current = true;
        console.error('[AdminCheck] Backend isCallerAdmin() error:', err);
        setPhase('error');
      }
    };

    // Set timeout for backend check
    timeoutRef.current = setTimeout(() => {
      if (!checkedRef.current) {
        console.warn('[AdminCheck] ⏱ Timeout during backend isCallerAdmin() check');
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
