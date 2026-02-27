import React, { useState, useEffect } from 'react';
import { NFTItem, ExternalBlob } from '../backend';
import { useCreateNFT } from '../hooks/useCreateNFT';
import { useUpdateNFT } from '../hooks/useUpdateNFT';
import { useUploadImage } from '../hooks/useUploadImage';
import { useGetAllCollections } from '../hooks/useGetAllCollections';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Loader2, Upload, FolderOpen, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface AdminNFTFormProps {
  nft?: NFTItem;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AdminNFTForm({ nft, onSuccess, onCancel }: AdminNFTFormProps) {
  const { mutateAsync: createNFT, isPending: isCreating } = useCreateNFT();
  const { mutateAsync: updateNFT, isPending: isUpdating } = useUpdateNFT();
  const { uploadImage, isUploading, uploadProgress } = useUploadImage();
  const { data: collections = [], isLoading: collectionsLoading } = useGetAllCollections();

  const [title, setTitle] = useState(nft?.title ?? '');
  const [description, setDescription] = useState(nft?.description ?? '');
  const [price, setPrice] = useState(nft ? (Number(nft.price) / 1e8).toString() : '');
  const [collectionId, setCollectionId] = useState(nft?.collectionId ?? '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    nft?.imageData ? nft.imageData.getDirectURL() : null
  );
  const [uploadedBlob, setUploadedBlob] = useState<ExternalBlob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!nft;
  const isPending = isCreating || isUpdating;

  // Pre-select collection when editing
  useEffect(() => {
    if (nft?.collectionId) {
      setCollectionId(nft.collectionId);
    }
  }, [nft?.collectionId]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setUploadedBlob(null);
    setError(null);

    // Show local preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload the image — pass the File directly as required by useUploadImage
    try {
      const blob = await uploadImage(file);
      setUploadedBlob(blob);
      toast.success('Bild erfolgreich hochgeladen');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Fehler beim Hochladen des Bildes.';
      setError(msg);
      toast.error('Fehler beim Hochladen des Bildes.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!collectionId) {
      setError('Bitte wählen Sie eine Kollektion aus.');
      return;
    }

    if (!isEditing && !uploadedBlob) {
      setError('Bitte wählen Sie ein Bild aus und warten Sie, bis der Upload abgeschlossen ist.');
      return;
    }

    try {
      const priceInE8s = price ? BigInt(Math.round(parseFloat(price) * 1e8)) : BigInt(0);

      if (isEditing && nft) {
        const imageData = uploadedBlob ?? nft.imageData;
        await updateNFT({
          id: nft.id,
          collectionId,
          title,
          description,
          imageData,
          price: priceInE8s,
        });
        toast.success('NFT erfolgreich aktualisiert');
      } else {
        const id = `nft-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        await createNFT({
          id,
          collectionId,
          title,
          description,
          imageData: uploadedBlob!,
          price: priceInE8s,
        });
        toast.success('NFT erfolgreich erstellt');
      }

      onSuccess?.();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Fehler beim Speichern des NFTs.';
      setError(msg);
      toast.error('Fehler beim Speichern des NFTs.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Collection Selector */}
      <div className="space-y-2">
        <Label htmlFor="nft-collection">Kollektion *</Label>
        {collectionsLoading ? (
          <div className="h-10 bg-muted animate-pulse rounded-md" />
        ) : collections.length === 0 ? (
          <Alert>
            <FolderOpen className="h-4 w-4" />
            <AlertDescription>
              Noch keine Kollektionen vorhanden. Bitte erstellen Sie zuerst eine Kollektion im Tab „Kollektionen".
            </AlertDescription>
          </Alert>
        ) : (
          <Select value={collectionId} onValueChange={setCollectionId}>
            <SelectTrigger id="nft-collection">
              <SelectValue placeholder="Kollektion auswählen..." />
            </SelectTrigger>
            <SelectContent>
              {collections.map((col) => (
                <SelectItem key={col.id} value={col.id}>
                  {col.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="nft-title">Titel *</Label>
        <Input
          id="nft-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="NFT Titel"
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="nft-description">Beschreibung</Label>
        <Textarea
          id="nft-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Beschreibung des NFTs..."
          rows={3}
        />
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Label htmlFor="nft-price">Preis (ICP)</Label>
        <Input
          id="nft-price"
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="0.00"
        />
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label htmlFor="nft-image">Bild {!isEditing && '*'}</Label>
        <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
          {imagePreview ? (
            <div className="space-y-2">
              <img
                src={imagePreview}
                alt="Vorschau"
                className="max-h-40 mx-auto rounded-md object-contain"
              />
              {isUploading && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Wird hochgeladen...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-1" />
                </div>
              )}
              {uploadedBlob && !isUploading && (
                <p className="text-xs text-green-600">✓ Bild hochgeladen</p>
              )}
              <label htmlFor="nft-image" className="cursor-pointer inline-block">
                <Button type="button" variant="outline" size="sm" asChild>
                  <span>Bild ändern</span>
                </Button>
              </label>
            </div>
          ) : (
            <label htmlFor="nft-image" className="cursor-pointer space-y-2 block">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">Bild auswählen</p>
              <p className="text-xs text-muted-foreground">PNG, JPG, GIF</p>
            </label>
          )}
          <input
            id="nft-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Actions */}
      <div className="flex gap-2 justify-end pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending || isUploading}>
            Abbrechen
          </Button>
        )}
        <Button
          type="submit"
          disabled={
            isPending ||
            isUploading ||
            !title ||
            !collectionId ||
            collections.length === 0 ||
            (!isEditing && !uploadedBlob)
          }
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isEditing ? 'Wird aktualisiert...' : 'Wird erstellt...'}
            </>
          ) : isEditing ? (
            'NFT aktualisieren'
          ) : (
            'NFT erstellen'
          )}
        </Button>
      </div>
    </form>
  );
}
