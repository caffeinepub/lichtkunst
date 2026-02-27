import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { NFTCollection } from '../backend';

export function useGetAllCollections() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<NFTCollection[]>({
    queryKey: ['nft-collections'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCollections();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 30_000,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
  };
}
