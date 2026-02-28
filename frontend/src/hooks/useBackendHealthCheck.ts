import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

/**
 * React Query hook that performs a lightweight health check against the backend.
 * Uses getAllCollections() as a ping — it's a public query with no auth required.
 * Returns query status for the BackendStatusIndicator component.
 */
export function useBackendHealthCheck() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['backend-health-check'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Use getAllCollections as a lightweight ping — public, no auth required
      await actor.getAllCollections();
      return true;
    },
    enabled: !!actor && !actorFetching,
    retry: false,
    staleTime: 30_000,
    refetchInterval: 60_000, // Re-check every 60 seconds
    refetchOnWindowFocus: true,
  });
}
