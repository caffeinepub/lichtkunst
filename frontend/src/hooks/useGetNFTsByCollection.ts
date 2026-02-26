import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { NFTItem } from '../backend';

export function useGetNFTsByCollection(collectionId: string | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<NFTItem[]>({
    queryKey: ['nft-items-by-collection', collectionId],
    queryFn: async () => {
      if (!actor || !collectionId) return [];
      return actor.getNFTsByCollection(collectionId);
    },
    enabled: !!actor && !actorFetching && !!collectionId,
  });
}
