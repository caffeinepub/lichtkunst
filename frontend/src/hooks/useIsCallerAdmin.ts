import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity, isInitializing } = useInternetIdentity();
  const queryClient = useQueryClient();

  const principalKey = identity?.getPrincipal().toString() ?? null;
  const isAnonymous = identity ? identity.getPrincipal().isAnonymous() : true;
  const isAuthenticated = !!identity && !isAnonymous;

  // Check that the actor in the cache corresponds to the current identity
  // This prevents calling isCallerAdmin() with a stale anonymous actor
  const actorQueryData = queryClient.getQueryData<unknown>(['actor', principalKey]);
  const actorMatchesIdentity = !!actorQueryData && actorQueryData === actor;

  const isReady =
    !!actor &&
    !actorFetching &&
    !isInitializing &&
    isAuthenticated &&
    actorMatchesIdentity;

  const query = useQuery<boolean>({
    queryKey: ['isCallerAdmin', principalKey],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isCallerAdmin();
    },
    enabled: isReady,
    retry: false,
    staleTime: 30_000,
  });

  return {
    ...query,
    isLoading: isInitializing || actorFetching || (isAuthenticated && query.isLoading),
    isFetched: isReady && query.isFetched,
  };
}
