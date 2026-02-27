import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { NFT } from '../backend';

export function useGetMyIssuedNFTs() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return useQuery<NFT[]>({
    queryKey: ['my-issued-nfts', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMyNFTs();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
  });
}
