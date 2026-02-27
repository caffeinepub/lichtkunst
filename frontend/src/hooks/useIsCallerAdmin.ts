import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity, isInitializing } = useInternetIdentity();

  const isAuthenticated = !!identity;
  const isReady = !!actor && !actorFetching && !isInitializing && isAuthenticated;

  const query = useQuery<boolean>({
    queryKey: ['isCallerAdmin', identity?.getPrincipal().toString()],
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
