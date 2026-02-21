import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { LightArtPiece } from '../backend';

export function useGetArtwork(id: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<LightArtPiece | null>({
    queryKey: ['artwork', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getArtwork(id);
    },
    enabled: !!actor && !actorFetching && !!id,
  });
}
