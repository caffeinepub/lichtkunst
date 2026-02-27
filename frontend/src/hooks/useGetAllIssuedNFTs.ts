import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { NFT } from '../backend';

export function useGetAllIssuedNFTs() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<NFT[]>({
    queryKey: ['issued-nfts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllNFTs();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 30_000,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
  };
}
