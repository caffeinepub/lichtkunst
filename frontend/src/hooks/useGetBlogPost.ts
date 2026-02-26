import { useQuery } from '@tanstack/react-query';
import type { BackendBlogPost } from '../utils/blogHelpers';

// The old blog backend has been replaced by the NFT system.
// This hook always returns null so static posts are used instead.
export function useGetBlogPost(_id: string) {
  return useQuery<BackendBlogPost | null>({
    queryKey: ['blogPost', _id],
    queryFn: async () => null,
    staleTime: Infinity,
  });
}
