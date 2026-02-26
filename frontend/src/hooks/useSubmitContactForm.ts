import { useMutation } from '@tanstack/react-query';

interface SubmitContactFormParams {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// The old contact form backend has been replaced by the NFT system.
// This stub mutation always throws to indicate the feature is unavailable.
export function useSubmitContactForm() {
  return useMutation({
    mutationFn: async (_params: SubmitContactFormParams) => {
      throw new Error('Kontaktformular ist derzeit nicht verfügbar.');
    },
  });
}
