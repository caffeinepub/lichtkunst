import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

interface UpdateCollectionParams {
  id: string;
  name: string;
  description: string;
}

export function useUpdateCollection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name, description }: UpdateCollectionParams) => {
      if (!actor) throw new Error('Actor nicht verfügbar');
      return actor.updateCollection(id, name, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nft-collections'] });
    },
  });
}
