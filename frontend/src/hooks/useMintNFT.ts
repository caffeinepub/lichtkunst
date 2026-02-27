import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ExternalBlob, TokenId } from '../backend';

export interface MintNFTParams {
  title: string;
  description: string;
  image: ExternalBlob;
}

function parseAuthError(error: unknown): string {
  const msg = error instanceof Error ? error.message : String(error);
  if (
    msg.toLowerCase().includes('unauthorized') ||
    msg.toLowerCase().includes('only authenticated') ||
    msg.toLowerCase().includes('only users')
  ) {
    return 'Du musst angemeldet sein, um NFTs zu minten.';
  }
  return msg || 'Minting fehlgeschlagen. Bitte versuche es erneut.';
}

export function useMintNFT() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<TokenId, Error, MintNFTParams>({
    mutationFn: async (params: MintNFTParams) => {
      if (!actor) throw new Error('Actor nicht verfügbar. Bitte melde dich an.');
      try {
        const tokenId = await actor.mintNFT({
          title: params.title,
          description: params.description,
          image: params.image,
        });
        return tokenId;
      } catch (error) {
        throw new Error(parseAuthError(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issued-nfts'] });
      queryClient.invalidateQueries({ queryKey: ['nft-items'] });
    },
  });
}
