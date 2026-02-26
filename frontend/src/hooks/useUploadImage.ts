import { useState, useCallback } from 'react';
import { useActor } from './useActor';
import { ExternalBlob } from '../backend';

interface UseUploadImageResult {
  uploadImage: (file: File, onProgress?: (pct: number) => void) => Promise<ExternalBlob>;
  isUploading: boolean;
  uploadProgress: number;
  uploadError: string | null;
  reset: () => void;
}

function parseAuthError(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);
  if (
    message.toLowerCase().includes('unauthorized') ||
    message.toLowerCase().includes('only users') ||
    message.toLowerCase().includes('only admins')
  ) {
    return 'Keine Berechtigung zum Hochladen. Bitte melde dich erneut an.';
  }
  return message || 'Upload fehlgeschlagen';
}

export function useUploadImage(): UseUploadImageResult {
  const { actor } = useActor();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setIsUploading(false);
    setUploadProgress(0);
    setUploadError(null);
  }, []);

  const uploadImage = useCallback(
    async (file: File, onProgress?: (pct: number) => void): Promise<ExternalBlob> => {
      if (!actor) throw new Error('Actor nicht verfügbar. Bitte melde dich an.');

      const SUPPORTED = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
      if (!SUPPORTED.includes(file.type)) {
        const err = `Nicht unterstütztes Format: ${file.type}. Erlaubt: JPEG, PNG, GIF, WebP, SVG.`;
        setUploadError(err);
        throw new Error(err);
      }

      setIsUploading(true);
      setUploadProgress(0);
      setUploadError(null);

      try {
        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);

        const handleProgress = (pct: number) => {
          setUploadProgress(pct);
          onProgress?.(pct);
        };

        const blob = ExternalBlob.fromBytes(bytes).withUploadProgress(handleProgress);
        const uploaded = await actor.uploadImage(blob);
        setUploadProgress(100);
        return uploaded;
      } catch (err: unknown) {
        const message = parseAuthError(err);
        setUploadError(message);
        throw new Error(message);
      } finally {
        setIsUploading(false);
      }
    },
    [actor]
  );

  return { uploadImage, isUploading, uploadProgress, uploadError, reset };
}
