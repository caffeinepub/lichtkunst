import { useMutation } from '@tanstack/react-query';

export function useCreateBlogPost() {
  return useMutation({
    mutationFn: async (_data: { title: string; content: string; imageUrl?: string }) => {
      // Blog creation is currently unavailable — NFT system is active
      return null;
    },
  });
}
