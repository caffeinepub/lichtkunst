import { useMutation } from '@tanstack/react-query';

// The old artwork upload backend has been replaced by the NFT system.
// This stub mutation always throws to indicate the feature is unavailable.
interface UploadArtworkParams {
  file: Uint8Array;
  title: string;
  description: string;
  category: string;
  onProgress?: (percentage: number) => void;
}

export function useUploadArtwork() {
  return useMutation({
    mutationFn: async (_params: UploadArtworkParams) => {
      throw new Error('Upload-Funktion wurde durch das neue NFT-System ersetzt.');
    },
  });
}
