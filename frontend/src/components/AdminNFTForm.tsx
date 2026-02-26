import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Loader2, Plus, Save, ImageIcon, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateNFT } from '../hooks/useCreateNFT';
import { useUpdateNFT } from '../hooks/useUpdateNFT';
import { useGetAllCollections } from '../hooks/useGetAllCollections';
import { useUploadImage } from '../hooks/useUploadImage';
import type { NFTItem, ExternalBlob } from '../backend';

interface AdminNFTFormProps {
  editingNFT?: NFTItem | null;
  onDone?: () => void;
}

function generateId(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') +
    '-' +
    Date.now().toString(36)
  );
}

export default function AdminNFTForm({ editingNFT, onDone }: AdminNFTFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [collectionId, setCollectionId] = useState('');
  const [priceICP, setPriceICP] = useState('');

  // Uploaded blob state
  const [uploadedBlob, setUploadedBlob] = useState<ExternalBlob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: collections = [] } = useGetAllCollections();
  const createNFT = useCreateNFT();
  const updateNFT = useUpdateNFT();
  const { uploadImage, isUploading, uploadProgress, uploadError, reset: resetUpload } = useUploadImage();

  const isEditing = !!editingNFT;
  const isPending = createNFT.isPending || updateNFT.isPending;
  const isDisabled = isPending || isUploading;

  useEffect(() => {
    if (editingNFT) {
      setTitle(editingNFT.title);
      setDescription(editingNFT.description);
      setCollectionId(editingNFT.collectionId);
      // Use existing blob from the NFT
      setUploadedBlob(editingNFT.imageData);
      setPreviewUrl(editingNFT.imageData.getDirectURL());
      const icpValue = Number(editingNFT.price) / 100_000_000;
      setPriceICP(icpValue.toString());
    } else {
      setTitle('');
      setDescription('');
      setCollectionId('');
      setUploadedBlob(null);
      setPreviewUrl(null);
      setPriceICP('');
      resetUpload();
    }
  }, [editingNFT]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setUploadedBlob(null);

    try {
      const blob = await uploadImage(file);
      setUploadedBlob(blob);
      // Update preview to the canister URL
      setPreviewUrl(blob.getDirectURL());
      URL.revokeObjectURL(localUrl);
    } catch {
      // Error is already set in the hook; revert preview
      setPreviewUrl(null);
      URL.revokeObjectURL(localUrl);
    }

    // Reset file input so the same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveImage = () => {
    setUploadedBlob(null);
    setPreviewUrl(null);
    resetUpload();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Bitte einen Titel eingeben.');
      return;
    }
    if (!collectionId) {
      toast.error('Bitte eine Kollektion auswählen.');
      return;
    }
    if (!uploadedBlob) {
      toast.error('Bitte ein Bild hochladen.');
      return;
    }

    const priceNum = parseFloat(priceICP);
    if (isNaN(priceNum) || priceNum < 0) {
      toast.error('Bitte einen gültigen Preis eingeben.');
      return;
    }
    const priceE8s = BigInt(Math.round(priceNum * 100_000_000));

    try {
      if (isEditing && editingNFT) {
        await updateNFT.mutateAsync({
          id: editingNFT.id,
          collectionId,
          title: title.trim(),
          description: description.trim(),
          imageData: uploadedBlob,
          price: priceE8s,
        });
        toast.success('NFT erfolgreich aktualisiert.');
      } else {
        const id = generateId(title.trim());
        await createNFT.mutateAsync({
          id,
          collectionId,
          title: title.trim(),
          description: description.trim(),
          imageData: uploadedBlob,
          price: priceE8s,
        });
        toast.success('NFT erfolgreich erstellt.');
        setTitle('');
        setDescription('');
        setCollectionId('');
        setUploadedBlob(null);
        setPreviewUrl(null);
        setPriceICP('');
        resetUpload();
      }
      onDone?.();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unbekannter Fehler';
      toast.error(`Fehler: ${message}`);
    }
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="pb-4">
        <CardTitle className="font-serif text-lg font-thin tracking-wide">
          {isEditing ? 'NFT bearbeiten' : 'Neues NFT erstellen'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="nft-title" className="text-xs font-thin tracking-wide uppercase text-muted-foreground">
              Titel *
            </Label>
            <Input
              id="nft-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="z.B. Lichtei #001"
              disabled={isDisabled}
              className="bg-background/50"
            />
          </div>

          {/* Collection */}
          <div className="space-y-1.5">
            <Label htmlFor="nft-collection" className="text-xs font-thin tracking-wide uppercase text-muted-foreground">
              Kollektion *
            </Label>
            <Select value={collectionId} onValueChange={setCollectionId} disabled={isDisabled}>
              <SelectTrigger id="nft-collection" className="bg-background/50">
                <SelectValue placeholder="Kollektion auswählen..." />
              </SelectTrigger>
              <SelectContent>
                {collections.length === 0 ? (
                  <SelectItem value="__none__" disabled>
                    Keine Kollektionen vorhanden
                  </SelectItem>
                ) : (
                  collections.map((col) => (
                    <SelectItem key={col.id} value={col.id}>
                      {col.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="nft-desc" className="text-xs font-thin tracking-wide uppercase text-muted-foreground">
              Beschreibung
            </Label>
            <Textarea
              id="nft-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Beschreibung des NFTs..."
              rows={3}
              disabled={isDisabled}
              className="bg-background/50 resize-none"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-1.5">
            <Label className="text-xs font-thin tracking-wide uppercase text-muted-foreground">
              Bild *
            </Label>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
              className="hidden"
              onChange={handleFileChange}
              disabled={isDisabled}
            />

            {/* Preview or drop zone */}
            {previewUrl ? (
              <div className="relative mt-1 overflow-hidden rounded-md border border-border/40">
                <img
                  src={previewUrl}
                  alt="Vorschau"
                  className="h-32 w-full object-cover"
                />
                {/* Upload progress overlay */}
                {isUploading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/70 backdrop-blur-sm">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span className="text-xs font-thin text-foreground/70">
                      Wird hochgeladen… {uploadProgress}%
                    </span>
                    <Progress value={uploadProgress} className="h-1 w-2/3" />
                  </div>
                )}
                {/* Remove button (only when not uploading) */}
                {!isUploading && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={isDisabled}
                    className="absolute right-1.5 top-1.5 rounded-full bg-background/80 p-1 text-foreground/70 hover:bg-background hover:text-foreground transition-colors"
                    aria-label="Bild entfernen"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
                {/* Replace button */}
                {!isUploading && uploadedBlob && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isDisabled}
                    className="absolute bottom-1.5 right-1.5 rounded-md bg-background/80 px-2 py-1 text-xs font-thin text-foreground/70 hover:bg-background hover:text-foreground transition-colors flex items-center gap-1"
                  >
                    <Upload className="h-3 w-3" />
                    Ersetzen
                  </button>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isDisabled}
                className="mt-1 flex h-24 w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border/50 bg-background/30 text-muted-foreground/50 transition-colors hover:border-border hover:bg-background/50 hover:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ImageIcon className="h-6 w-6" />
                <span className="text-xs font-thin tracking-wide">
                  Bild auswählen (JPEG, PNG, GIF, WebP, SVG)
                </span>
              </button>
            )}

            {/* Upload error */}
            {uploadError && (
              <p className="text-xs text-destructive font-thin mt-1">{uploadError}</p>
            )}

            {/* Success indicator */}
            {uploadedBlob && !isUploading && (
              <p className="text-xs text-green-600 dark:text-green-400 font-thin mt-1">
                ✓ Bild erfolgreich hochgeladen
              </p>
            )}
          </div>

          {/* Price */}
          <div className="space-y-1.5">
            <Label htmlFor="nft-price" className="text-xs font-thin tracking-wide uppercase text-muted-foreground">
              Preis (ICP)
            </Label>
            <Input
              id="nft-price"
              type="number"
              min="0"
              step="0.0001"
              value={priceICP}
              onChange={(e) => setPriceICP(e.target.value)}
              placeholder="z.B. 1.5"
              disabled={isDisabled}
              className="bg-background/50"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              type="submit"
              disabled={isDisabled || !uploadedBlob}
              size="sm"
              className="gap-1.5"
            >
              {isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : isEditing ? (
                <Save className="h-3.5 w-3.5" />
              ) : (
                <Plus className="h-3.5 w-3.5" />
              )}
              {isEditing ? 'Speichern' : 'Erstellen'}
            </Button>
            {isEditing && onDone && (
              <Button type="button" variant="ghost" size="sm" onClick={onDone} disabled={isDisabled}>
                Abbrechen
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
