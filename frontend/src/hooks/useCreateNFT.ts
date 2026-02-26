import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob, NFTItem } from '../backend';

interface CreateNFTParams {
  id: string;
  collectionId: string;
  title: string;
  description: string;
  imageData: ExternalBlob;
  price: bigint;
}

function parseAuthError(error: unknown): string {
  const msg = error instanceof Error ? error.message : String(error);
  if (msg.includes('Unauthorized') || msg.includes('Only users') || msg.includes('Only admins')) {
    return 'Keine Berechtigung: Nur angemeldete Benutzer können NFTs hochladen.';
  }
  return msg;
}

export function useCreateNFT() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<NFTItem | null, Error, CreateNFTParams>({
    mutationFn: async (params: CreateNFTParams) => {
      if (!actor) throw new Error('Actor nicht verfügbar');
      try {
        await actor.addNFT(
          params.id,
          params.collectionId,
          params.title,
          params.description,
          params.imageData,
          params.price
        );
        // Fetch the newly created NFT to return it with tokenId/mintedAt
        const created = await actor.getNFT(params.id);
        return created;
      } catch (error) {
        throw new Error(parseAuthError(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nft-items'] });
    },
  });
}
