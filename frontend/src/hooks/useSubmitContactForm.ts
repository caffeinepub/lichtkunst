import { useMutation } from '@tanstack/react-query';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function useSubmitContactForm() {
  return useMutation({
    mutationFn: async (_data: ContactFormData): Promise<void> => {
      // Contact form backend is currently unavailable
      return;
    },
  });
}
