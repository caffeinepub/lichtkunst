import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { NFT } from '../backend';

export function useGetAllIssuedNFTs() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<NFT[]>({
    queryKey: ['issued-nfts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllNFTs();
    },
    enabled: !!actor && !actorFetching,
  });
}
