import { useQuery } from '@tanstack/react-query';
import type { LegacyArtwork } from './useGetAllArtworks';

// The old artwork backend has been replaced by the NFT system.
// This hook always returns an empty array.
export function useGetArtworksByCategory(_category: string) {
  return useQuery<LegacyArtwork[]>({
    queryKey: ['artworks', 'category', _category],
    queryFn: async () => [],
    staleTime: Infinity,
  });
}
