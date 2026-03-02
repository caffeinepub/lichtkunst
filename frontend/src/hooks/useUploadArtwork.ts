import { useMutation } from '@tanstack/react-query';

export function useUploadArtwork() {
  return useMutation({
    mutationFn: async (_data: unknown): Promise<null> => {
      // Artwork upload has been replaced by the NFT system
      return null;
    },
  });
}
