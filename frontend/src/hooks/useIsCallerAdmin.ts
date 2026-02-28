import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';

/**
 * React Query hook checking if the caller has admin permissions.
 * Only runs when actor is ready and user is authenticated.
 */
export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity, isInitializing } = useInternetIdentity();

  const isAuthenticated = !!identity;
  const isReady = !!actor && !actorFetching && !isInitializing && isAuthenticated;

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch (err) {
        console.error('isCallerAdmin error:', err);
        return false;
      }
    },
    enabled: isReady,
    staleTime: 60000,
    retry: 1,
  });
}
