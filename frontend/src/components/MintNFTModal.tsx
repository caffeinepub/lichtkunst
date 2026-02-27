import React, { useState, useRef, useCallback } from 'react';
import { Upload, ImagePlus, Loader2, CheckCircle2, AlertCircle, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useUploadImage } from '../hooks/useUploadImage';
import { useMintNFT } from '../hooks/useMintNFT';
import type { TokenId } from '../backend';

interface MintNFTModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (tokenId: TokenId) => void;
}

export default function MintNFTModal({ open, onOpenChange, onSuccess }: MintNFTModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mintedTokenId, setMintedTokenId] = useState<TokenId | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadImage, isUploading, uploadProgress, uploadError, reset: resetUpload } = useUploadImage();
  const mintMutation = useMintNFT();

  const isProcessing = isUploading || mintMutation.isPending;
  const isSuccess = mintedTokenId !== null;

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setFormError(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setFormError(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleRemoveImage = useCallback(() => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [previewUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!selectedFile) {
      setFormError('Bitte wähle ein Bild aus.');
      return;
    }
    if (!title.trim()) {
      setFormError('Bitte gib einen Titel ein.');
      return;
    }

    try {
      const uploadedBlob = await uploadImage(selectedFile);
      const tokenId = await mintMutation.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        image: uploadedBlob,
      });
      setMintedTokenId(tokenId);
      onSuccess?.(tokenId);
    } catch (err) {
      // errors are shown via uploadError / mintMutation.error
    }
  };

  const handleClose = useCallback(() => {
    if (isProcessing) return;
    // cleanup
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setTitle('');
    setDescription('');
    setSelectedFile(null);
    setPreviewUrl(null);
    setMintedTokenId(null);
    setFormError(null);
    resetUpload();
    mintMutation.reset();
    onOpenChange(false);
  }, [isProcessing, previewUrl, resetUpload, mintMutation, onOpenChange]);

  const errorMessage = formError || uploadError || mintMutation.error?.message || null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif font-light tracking-wide text-xl">
            NFT auf ICP minten
          </DialogTitle>
          <DialogDescription className="text-sm font-thin text-muted-foreground">
            Lade ein Bild hoch und präge es als echtes NFT auf dem Internet Computer.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          /* Success state */
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-light text-foreground">
                NFT erfolgreich geminted!
              </h3>
              <p className="mt-1 text-sm text-muted-foreground font-thin">
                Dein NFT ist jetzt auf der ICP Blockchain gespeichert.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2">
              <span className="text-xs text-muted-foreground font-thin">Token ID:</span>
              <span className="font-mono text-sm font-medium text-primary">
                #{mintedTokenId!.toString()}
              </span>
            </div>
            <Button onClick={handleClose} className="mt-2 font-thin tracking-wide">
              Schließen
            </Button>
          </div>
        ) : (
          /* Form state */
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Image upload area */}
            <div className="space-y-2">
              <Label className="text-sm font-thin tracking-wide">
                Bild <span className="text-destructive">*</span>
              </Label>

              {previewUrl ? (
                <div className="relative rounded-xl overflow-hidden border border-border">
                  <img
                    src={previewUrl}
                    alt="Vorschau"
                    className="w-full max-h-56 object-contain bg-muted"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={isProcessing}
                    className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-background/80 text-foreground hover:bg-background transition-colors disabled:opacity-50"
                    aria-label="Bild entfernen"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border/60 bg-muted/30 px-6 py-10 text-center transition-colors hover:border-primary/40 hover:bg-muted/50"
                >
                  <ImagePlus className="h-10 w-10 text-muted-foreground/40" />
                  <div>
                    <p className="text-sm font-thin text-muted-foreground">
                      Bild hierher ziehen oder{' '}
                      <span className="text-primary underline underline-offset-2">auswählen</span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground/60">
                      JPEG, PNG, GIF, WebP, SVG
                    </p>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                onChange={handleFileChange}
                className="hidden"
                disabled={isProcessing}
              />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="mint-title" className="text-sm font-thin tracking-wide">
                Titel <span className="text-destructive">*</span>
              </Label>
              <Input
                id="mint-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Name deines NFTs"
                disabled={isProcessing}
                className="font-thin"
                maxLength={100}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="mint-description" className="text-sm font-thin tracking-wide">
                Beschreibung{' '}
                <span className="text-muted-foreground/60 text-xs">(optional)</span>
              </Label>
              <Textarea
                id="mint-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Beschreibe dein Kunstwerk…"
                disabled={isProcessing}
                className="font-thin resize-none"
                rows={3}
                maxLength={500}
              />
            </div>

            {/* Upload progress */}
            {isUploading && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-muted-foreground font-thin">
                  <span>Bild wird hochgeladen…</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-1.5" />
              </div>
            )}

            {/* Minting indicator */}
            {mintMutation.isPending && !isUploading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-thin">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                NFT wird auf der Blockchain gespeichert…
              </div>
            )}

            {/* Error message */}
            {errorMessage && (
              <div className="flex items-start gap-2 rounded-lg bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span className="font-thin">{errorMessage}</span>
              </div>
            )}

            <DialogFooter className="gap-2 pt-1">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                disabled={isProcessing}
                className="font-thin"
              >
                Abbrechen
              </Button>
              <Button
                type="submit"
                disabled={isProcessing || !selectedFile || !title.trim()}
                className="gap-2 font-thin tracking-wide"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isUploading ? 'Hochladen…' : 'Minten…'}
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    NFT minten
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
