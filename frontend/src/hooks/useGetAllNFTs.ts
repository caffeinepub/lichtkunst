import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { NFTItem } from '../backend';

export function useGetAllNFTs() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<NFTItem[]>({
    queryKey: ['nft-items'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllNFTs();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 30_000,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
  };
}
