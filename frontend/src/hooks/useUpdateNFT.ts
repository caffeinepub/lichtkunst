import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob } from '../backend';

interface UpdateNFTParams {
  id: string;
  collectionId: string;
  title: string;
  description: string;
  imageData: ExternalBlob;
  price: bigint;
}

export function useUpdateNFT() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, collectionId, title, description, imageData, price }: UpdateNFTParams) => {
      if (!actor) throw new Error('Actor nicht verfügbar');
      return actor.updateNFT(id, collectionId, title, description, imageData, price);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nft-items'] });
    },
  });
}
