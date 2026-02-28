import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { useActorReady } from './useActorReady';

const ADMIN_CHECK_TIMEOUT_MS = 15_000; // 15 seconds max wait

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity, isInitializing } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { isActorReady, actorError } = useActorReady();

  const principalKey = identity?.getPrincipal().toString() ?? undefined;
  const isAnonymous = identity ? identity.getPrincipal().isAnonymous() : true;
  const isAuthenticated = !!identity && !isAnonymous;

  // Check that the actor query for the current identity is in a 'success' state.
  const actorQueryState = queryClient.getQueryState(['actor', principalKey]);
  const actorMatchesIdentity =
    isActorReady || (actorQueryState?.status === 'success' && !!actor && !actorFetching);

  const isReady =
    !!actor &&
    !actorFetching &&
    !isInitializing &&
    isAuthenticated &&
    actorMatchesIdentity &&
    !actorError;

  const query = useQuery<boolean>({
    queryKey: ['isCallerAdmin', principalKey],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isCallerAdmin();
    },
    enabled: isReady,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
    staleTime: 30_000,
    // Timeout the query itself after ADMIN_CHECK_TIMEOUT_MS
    gcTime: ADMIN_CHECK_TIMEOUT_MS,
  });

  // isLoading is true while:
  // - identity is still initializing
  // - actor is still being fetched
  // - user is authenticated but the query hasn't completed yet
  // But NOT if there's an actor error (we should stop loading in that case)
  const isLoading =
    !actorError &&
    (isInitializing ||
      actorFetching ||
      (isAuthenticated && !actorMatchesIdentity) ||
      (isAuthenticated && actorMatchesIdentity && query.isLoading));

  return {
    ...query,
    isLoading,
    isFetched: isReady && query.isFetched,
    isError: query.isError || !!actorError,
    error: query.error || actorError,
  };
}
