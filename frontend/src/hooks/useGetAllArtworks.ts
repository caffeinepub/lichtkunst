import { useQuery } from '@tanstack/react-query';

// The old artwork backend has been replaced by the NFT system.
// This hook now returns an empty array to avoid breaking components
// that still reference it (e.g. NFTCollectionsSection).
export interface LegacyArtwork {
  id: string;
  image: { getDirectURL: () => string };
  metadata: {
    title: string;
    description: string;
    creationDate: bigint;
    category: string;
  };
}

export function useGetAllArtworks() {
  return useQuery<LegacyArtwork[]>({
    queryKey: ['artworks'],
    queryFn: async () => [],
    staleTime: Infinity,
  });
}
