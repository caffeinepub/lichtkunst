import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { LightArtPiece } from '../backend';

export function useGetAllArtworks() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<LightArtPiece[]>({
    queryKey: ['artworks'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllArtworks();
    },
    enabled: !!actor && !actorFetching,
  });
}
