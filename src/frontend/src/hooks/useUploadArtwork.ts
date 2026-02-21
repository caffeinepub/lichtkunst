import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob } from '../backend';

interface UploadArtworkParams {
  file: Uint8Array;
  title: string;
  description: string;
  onProgress?: (percentage: number) => void;
}

export function useUploadArtwork() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, title, description, onProgress }: UploadArtworkParams) => {
      if (!actor) throw new Error('Actor not available');

      // Create a proper Uint8Array with ArrayBuffer type
      const properArray = new Uint8Array(file.buffer.slice(0)) as Uint8Array<ArrayBuffer>;
      let blob = ExternalBlob.fromBytes(properArray);
      
      if (onProgress) {
        blob = blob.withUploadProgress(onProgress);
      }

      return actor.uploadArtwork(blob, title, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artworks'] });
    },
  });
}
