import { useEffect, useRef, useState } from 'react';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';

const ACTOR_READY_TIMEOUT_MS = 15_000; // 15 seconds max wait for actor

interface ActorReadyResult {
  isActorReady: boolean;
  actorError: Error | null;
}

/**
 * Lightweight wrapper around useActor that exposes a boolean isActorReady flag
 * and an actorError state. Returns true for isActorReady only when the actor is
 * fully initialized and matches the current identity. If actor initialization
 * takes longer than ACTOR_READY_TIMEOUT_MS, sets actorError to indicate failure.
 */
export function useActorReady(): ActorReadyResult {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const [actorError, setActorError] = useState<Error | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);
  const resolvedRef = useRef(false);

  const principalKey = identity?.getPrincipal().toString() ?? undefined;
  const actorQueryState = queryClient.getQueryState(['actor', principalKey]);
  const isActorReady =
    actorQueryState?.status === 'success' && !!actor && !actorFetching;

  // If actor query itself errored, surface that immediately
  const actorQueryError = actorQueryState?.status === 'error' ? actorQueryState.error : null;

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

  // Reset when principal changes
  useEffect(() => {
    resolvedRef.current = false;
    setActorError(null);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [principalKey]);

  // Surface actor query errors immediately
  useEffect(() => {
    if (actorQueryError) {
      setActorError(
        actorQueryError instanceof Error
          ? actorQueryError
          : new Error('Actor initialization failed')
      );
      resolvedRef.current = true;
    }
  }, [actorQueryError]);

  // Start timeout when actor is fetching and not yet ready
  useEffect(() => {
    if (isActorReady) {
      resolvedRef.current = true;
      setActorError(null);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    if (resolvedRef.current) return;

    if (actorFetching && !timeoutRef.current) {
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        if (mountedRef.current && !resolvedRef.current) {
          resolvedRef.current = true;
          setActorError(new Error('Actor connection timed out'));
        }
      }, ACTOR_READY_TIMEOUT_MS);
    }
  }, [isActorReady, actorFetching]);

  return { isActorReady, actorError };
}
