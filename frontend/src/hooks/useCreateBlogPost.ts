import { useMutation } from '@tanstack/react-query';

interface CreateBlogPostParams {
  title: string;
  content: string;
  featuredImage: Uint8Array | null;
}

// The old blog backend has been replaced by the NFT system.
// This stub mutation always throws to indicate the feature is unavailable.
export function useCreateBlogPost() {
  return useMutation({
    mutationFn: async (_params: CreateBlogPostParams) => {
      throw new Error('Blog-Erstellung ist derzeit nicht verfügbar.');
    },
  });
}
