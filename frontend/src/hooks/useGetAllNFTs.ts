import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { NFTItem } from '../backend';

export function useGetAllNFTs() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<NFTItem[]>({
    queryKey: ['nft-items'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllNFTs();
    },
    enabled: !!actor && !actorFetching,
  });
}
