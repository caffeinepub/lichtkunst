import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useDeleteNFT() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor nicht verfügbar');
      return actor.deleteNFT(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nft-items'] });
    },
  });
}
