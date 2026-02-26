import { useQuery } from '@tanstack/react-query';
import type { BackendBlogPost } from '../utils/blogHelpers';

// The old blog backend has been replaced by the NFT system.
// This hook returns an empty array so static blog posts still display.
export function useGetAllBlogPosts() {
  return useQuery<BackendBlogPost[]>({
    queryKey: ['blogPosts'],
    queryFn: async () => [],
    staleTime: Infinity,
  });
}
