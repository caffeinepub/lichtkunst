import { useQuery } from '@tanstack/react-query';
import type { LegacyArtwork } from './useGetAllArtworks';

// The old artwork backend has been replaced by the NFT system.
// This hook always returns null.
export function useGetArtwork(_id: string) {
  return useQuery<LegacyArtwork | null>({
    queryKey: ['artwork', _id],
    queryFn: async () => null,
    staleTime: Infinity,
  });
}
