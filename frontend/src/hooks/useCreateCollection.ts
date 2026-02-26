import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

interface CreateCollectionParams {
  id: string;
  name: string;
  description: string;
}

export function useCreateCollection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name, description }: CreateCollectionParams) => {
      if (!actor) throw new Error('Actor nicht verfügbar');
      return actor.addCollection(id, name, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nft-collections'] });
    },
  });
}
