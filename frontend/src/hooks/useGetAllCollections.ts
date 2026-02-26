import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { NFTCollection } from '../backend';

export function useGetAllCollections() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<NFTCollection[]>({
    queryKey: ['nft-collections'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllCollections();
    },
    enabled: !!actor && !actorFetching,
  });
}
