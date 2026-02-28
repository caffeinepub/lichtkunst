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
      if (!actor) throw new Error('Actor nicht verfügbar. Bitte erneut anmelden.');
      await actor.addCollection(id, name, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nft-collections'] });
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
    onError: (error: unknown) => {
      const msg = error instanceof Error ? error.message : String(error);
      if (msg.includes('Unauthorized') || msg.includes('Only admins')) {
        throw new Error('Keine Berechtigung: Nur Admins können Kollektionen erstellen.');
      }
      throw error;
    },
  });
}
