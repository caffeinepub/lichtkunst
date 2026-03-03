import { useQuery } from "@tanstack/react-query";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity, isInitializing } = useInternetIdentity();

  const isAuthenticated = !!identity;

  return useQuery<boolean>({
    queryKey: ["isCallerAdmin", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return false;
      try {
        // Try checkIsAdmin first (query call, faster)
        const result = await actor.checkIsAdmin();
        return result;
      } catch (err) {
        // Fallback to isCallerAdmin if checkIsAdmin fails
        try {
          const result = await actor.isCallerAdmin();
          return result;
        } catch (err2) {
          console.warn("Admin check failed:", err2);
          return false;
        }
      }
    },
    enabled: !!actor && !actorFetching && isAuthenticated && !isInitializing,
    retry: 2,
    retryDelay: 1000,
    staleTime: 30_000,
  });
}
