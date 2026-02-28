import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { useEffect, useRef, useState } from 'react';

/**
 * Lightweight hook that exposes whether the actor is fully ready for calls.
 * isActorReady: true only when actor exists and is not currently fetching.
 * actorError: set if actor fails to initialize within the 20-second timeout window.
 */
export function useActorReady() {
  const { actor, isFetching: actorFetching } = useActor();
  const { isInitializing } = useInternetIdentity();
  const [actorError, setActorError] = useState<Error | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasBeenReady = useRef(false);

  const isActorReady = !!actor && !actorFetching && !isInitializing;

  useEffect(() => {
    // Once ready, clear any pending error and mark as ready
    if (isActorReady) {
      hasBeenReady.current = true;
      setActorError(null);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Don't start a new timer if one is already running
    if (timerRef.current) return;

    // Start a 20-second timeout to detect stalled actor initialization
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      if (!hasBeenReady.current) {
        setActorError(
          new Error(
            'Verbindung zum Backend konnte nicht hergestellt werden. Bitte überprüfe deine Internetverbindung und versuche es erneut.'
          )
        );
      }
    }, 20000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isActorReady]);

  const clearError = () => {
    setActorError(null);
    hasBeenReady.current = false;
  };

  return { isActorReady, actorError, clearError };
}
