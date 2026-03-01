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

// Hardcoded admin principal — immediate access granted without backend round-trip
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

    console.group('[AdminCheck] Admin check started (retryCount=' + retryCount + ')');
    console.log('isInitializing:', isInitializing);
    console.log('identity:', identity ? identity.getPrincipal().toText() : null);
    console.log('actor ready:', !!actor);
    console.log('actorFetching:', actorFetching);
    console.log('hardcoded admin principal:', HARDCODED_ADMIN_PRINCIPAL);
    console.groupEnd();

    if (isInitializing) {
      setPhase('initializing');
      return;
    }

    if (!identity) {
      setPhase('denied');
      return;
    }

    const callerPrincipal = identity.getPrincipal().toText();
    const normalizedCaller = callerPrincipal.trim().toLowerCase();
    const normalizedHardcoded = HARDCODED_ADMIN_PRINCIPAL.trim().toLowerCase();

    console.group('[AdminCheck] Principal comparison');
    console.log('Caller principal:', callerPrincipal);
    console.log('Hardcoded admin principal:', HARDCODED_ADMIN_PRINCIPAL);
    console.log('Match:', normalizedCaller === normalizedHardcoded);
    console.groupEnd();

    // ── Immediate hardcoded admin check — no backend call needed ──────────
    if (normalizedCaller === normalizedHardcoded) {
      console.log('[AdminCheck] ✅ Phase → confirmed (hardcoded admin match — access granted immediately)');
      checkedRef.current = true;
      setPhase('confirmed');
      return;
    }

    // ── Not the hardcoded admin — proceed with backend check ──────────────
    if (actorFetching || !actor) {
      console.log('[AdminCheck] Phase → waiting-for-actor (actor not ready yet)');
      setPhase('waiting-for-actor');

      timeoutRef.current = setTimeout(() => {
        if (!checkedRef.current) {
          console.warn('[AdminCheck] ⏱ Phase → timeout (timed out waiting for actor after ' + timeoutMs + 'ms)');
          setPhase('timeout');
        }
      }, timeoutMs);
      return;
    }

    // ── Actor is ready — perform backend check ────────────────────────────
    console.log('[AdminCheck] Phase → checking (calling backend isCallerAdmin())');
    setPhase('checking');

    const performCheck = async () => {
      try {
        console.log('[AdminCheck] Calling actor.isCallerAdmin() for principal:', callerPrincipal);
        const result = await actor.isCallerAdmin();
        checkedRef.current = true;

        console.group('[AdminCheck] Backend admin check result');
        console.log('Caller principal:', callerPrincipal);
        console.log('isCallerAdmin() result:', result);
        console.log('Final admin status:', result ? '✅ ADMIN' : '❌ NOT ADMIN');
        console.groupEnd();

        const nextPhase = result ? 'confirmed' : 'denied';
        console.log('[AdminCheck] Phase →', nextPhase);
        setPhase(nextPhase);
      } catch (err: unknown) {
        checkedRef.current = true;

        console.group('[AdminCheck] ❌ Backend isCallerAdmin() error');
        if (err instanceof Error) {
          console.error('Error message:', err.message);
        } else {
          console.error('Unknown error:', err);
        }
        console.log('Caller principal at time of error:', callerPrincipal);
        console.groupEnd();
        console.log('[AdminCheck] Phase → error');
        setPhase('error');
      }
    };

    // Set timeout for backend check
    timeoutRef.current = setTimeout(() => {
      if (!checkedRef.current) {
        console.warn('[AdminCheck] ⏱ Phase → timeout (backend isCallerAdmin() did not respond within ' + timeoutMs + 'ms)');
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
