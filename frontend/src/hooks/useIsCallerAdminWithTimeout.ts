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

    console.group('[useIsCallerAdminWithTimeout] Admin check started (retryCount=' + retryCount + ')');
    console.log('isInitializing:', isInitializing);
    console.log('identity:', identity ? identity.getPrincipal().toText() : null);
    console.log('actor ready:', !!actor);
    console.log('actorFetching:', actorFetching);
    console.log('hardcoded admin principal:', HARDCODED_ADMIN_PRINCIPAL);
    console.groupEnd();

    if (isInitializing) {
      console.log('[useIsCallerAdminWithTimeout] Phase → initializing (identity still loading)');
      setPhase('initializing');
      return;
    }

    if (!identity) {
      console.log('[useIsCallerAdminWithTimeout] Phase → denied (no identity / not logged in)');
      setPhase('denied');
      return;
    }

    const callerPrincipal = identity.getPrincipal().toText();
    const normalizedCaller = callerPrincipal.trim().toLowerCase();
    const normalizedHardcoded = HARDCODED_ADMIN_PRINCIPAL.trim().toLowerCase();

    console.group('[useIsCallerAdminWithTimeout] Principal comparison');
    console.log('Caller principal (raw):', callerPrincipal);
    console.log('Hardcoded admin principal (raw):', HARDCODED_ADMIN_PRINCIPAL);
    console.log('Caller principal (normalized):', normalizedCaller);
    console.log('Hardcoded admin principal (normalized):', normalizedHardcoded);
    console.log('Principals match (hardcoded check):', normalizedCaller === normalizedHardcoded);
    console.groupEnd();

    // Immediate hardcoded admin check — no backend call needed
    if (normalizedCaller === normalizedHardcoded) {
      console.log('[useIsCallerAdminWithTimeout] ✅ Phase → confirmed (hardcoded admin match — access granted immediately)');
      setPhase('confirmed');
      return;
    }

    // Not the hardcoded admin — proceed with backend check
    if (actorFetching || !actor) {
      console.log('[useIsCallerAdminWithTimeout] Phase → waiting-for-actor (actor not ready yet)');
      setPhase('waiting-for-actor');

      // Start timeout while waiting for actor
      timeoutRef.current = setTimeout(() => {
        if (!checkedRef.current) {
          console.warn('[useIsCallerAdminWithTimeout] ⏱ Phase → timeout (timed out waiting for actor after ' + timeoutMs + 'ms)');
          setPhase('timeout');
        }
      }, timeoutMs);
      return;
    }

    // Actor is ready — perform backend check
    console.log('[useIsCallerAdminWithTimeout] Phase → checking (calling backend isCallerAdmin())');
    setPhase('checking');

    const performCheck = async () => {
      try {
        console.log('[useIsCallerAdminWithTimeout] Calling actor.isCallerAdmin() for principal:', callerPrincipal);
        const result = await actor.isCallerAdmin();
        checkedRef.current = true;
        console.group('[useIsCallerAdminWithTimeout] Backend isCallerAdmin() result');
        console.log('Raw result:', result);
        console.log('Type:', typeof result);
        console.log('Caller principal:', callerPrincipal);
        console.log('Final admin status:', result ? '✅ ADMIN' : '❌ NOT ADMIN');
        console.groupEnd();
        const nextPhase = result ? 'confirmed' : 'denied';
        console.log('[useIsCallerAdminWithTimeout] Phase →', nextPhase);
        setPhase(nextPhase);
      } catch (err: unknown) {
        checkedRef.current = true;
        console.group('[useIsCallerAdminWithTimeout] ❌ Backend isCallerAdmin() error');
        if (err instanceof Error) {
          console.error('Error message:', err.message);
          console.error('Error stack:', err.stack);
        } else {
          console.error('Unknown error:', err);
        }
        console.log('Caller principal at time of error:', callerPrincipal);
        console.groupEnd();
        console.log('[useIsCallerAdminWithTimeout] Phase → error');
        setPhase('error');
      }
    };

    // Set timeout for backend check
    timeoutRef.current = setTimeout(() => {
      if (!checkedRef.current) {
        console.warn('[useIsCallerAdminWithTimeout] ⏱ Phase → timeout (backend isCallerAdmin() did not respond within ' + timeoutMs + 'ms)');
        console.warn('[useIsCallerAdminWithTimeout] Caller principal at timeout:', callerPrincipal);
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
