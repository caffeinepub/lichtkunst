import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { NFTItem } from '../backend';

export function useGetNFT(id: string | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<NFTItem | null>({
    queryKey: ['nft-item', id],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      if (!id) return null;
      return actor.getNFT(id);
    },
    enabled: !!actor && !actorFetching && !!id,
  });
}
