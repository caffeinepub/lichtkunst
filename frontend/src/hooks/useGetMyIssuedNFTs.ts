import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { NFT } from '../backend';

export function useGetMyIssuedNFTs() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity, isInitializing } = useInternetIdentity();

  const isAuthenticated = !!identity;
  const principalStr = identity?.getPrincipal().toString();

  const query = useQuery<NFT[]>({
    queryKey: ['my-issued-nfts', principalStr],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMyNFTs();
    },
    enabled: isAuthenticated && !isInitializing && !!actor && !actorFetching,
    staleTime: 30_000,
  });

  return {
    ...query,
    isLoading: actorFetching || isInitializing || (isAuthenticated && query.isLoading),
  };
}
