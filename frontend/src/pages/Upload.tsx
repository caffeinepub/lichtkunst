import React, { useState, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetAllCollections } from '../hooks/useGetAllCollections';
import { useCreateNFT } from '../hooks/useCreateNFT';
import { ExternalBlob } from '../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Upload as UploadIcon, ImagePlus, CheckCircle, ExternalLink, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function Upload() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: collections = [] } = useGetAllCollections();
  const createNFT = useCreateNFT();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [collectionId, setCollectionId] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [mintedNFT, setMintedNFT] = useState<{ tokenId?: bigint; id: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get canister ID from environment for explorer link
  const canisterId = (window as unknown as Record<string, string>).__CANISTER_ID_BACKEND__ 
    || import.meta.env.VITE_CANISTER_ID_BACKEND 
    || '';

  const explorerUrl = canisterId
    ? `https://dashboard.internetcomputer.org/canister/${canisterId}`
    : 'https://dashboard.internetcomputer.org';

  if (!identity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Sparkles className="w-12 h-12 text-primary mx-auto" />
          <h2 className="text-2xl font-serif text-foreground">Anmeldung erforderlich</h2>
          <p className="text-muted-foreground">Bitte melde dich an, um NFTs hochzuladen.</p>
        </div>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error('Bitte wähle ein Bild aus.');
      return;
    }
    if (!collectionId) {
      toast.error('Bitte wähle eine Kollektion aus.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const arrayBuffer = await imageFile.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
        setUploadProgress(pct);
      });

      const id = `nft-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const priceInE8s = BigInt(Math.round(parseFloat(price || '0') * 1e8));

      const result = await createNFT.mutateAsync({
        id,
        collectionId,
        title,
        description,
        imageData: blob,
        price: priceInE8s,
      });

      setMintedNFT({ tokenId: result?.tokenId ?? undefined, id });
      toast.success('NFT erfolgreich geminted! 🎉');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unbekannter Fehler';
      toast.error(`Fehler beim Hochladen: ${msg}`);
    } finally {
      setIsUploading(false);
    }
  };

  if (mintedNFT) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-serif font-light text-foreground mb-2">NFT geminted!</h2>
            <p className="text-muted-foreground">Dein Kunstwerk wurde erfolgreich auf der ICP Blockchain gespeichert.</p>
          </div>

          {mintedNFT.tokenId !== undefined && (
            <div className="bg-muted/50 rounded-xl p-4 space-y-2 text-left border border-border">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Token ID</p>
              <p className="text-2xl font-mono font-bold text-primary">#{mintedNFT.tokenId.toString()}</p>
              <p className="text-xs text-muted-foreground">ICRC-7 On-Chain Token</p>
            </div>
          )}

          <div className="space-y-3">
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Auf ICP Explorer ansehen
            </a>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate({ to: '/nft-galerie' })}
            >
              Zur NFT Galerie
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                setMintedNFT(null);
                setTitle('');
                setDescription('');
                setCollectionId('');
                setPrice('');
                setImageFile(null);
                setImagePreview(null);
                setUploadProgress(0);
              }}
            >
              Weiteres NFT hochladen
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-light text-foreground mb-2">NFT hochladen</h1>
        <p className="text-muted-foreground">Lade dein Kunstwerk hoch und minte es als NFT auf der ICP Blockchain.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div className="space-y-2">
          <Label>Bild *</Label>
          <div
            className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <div className="space-y-3">
                <img
                  src={imagePreview}
                  alt="Vorschau"
                  className="max-h-64 mx-auto rounded-lg object-contain"
                />
                <p className="text-sm text-muted-foreground">{imageFile?.name}</p>
              </div>
            ) : (
              <div className="space-y-3">
                <ImagePlus className="w-12 h-12 text-muted-foreground mx-auto" />
                <div>
                  <p className="text-foreground font-medium">Bild auswählen</p>
                  <p className="text-sm text-muted-foreground">PNG, JPG, GIF bis 10MB</p>
                </div>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Titel *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Name des Kunstwerks"
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Beschreibung</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Beschreibe dein Kunstwerk..."
            rows={4}
          />
        </div>

        {/* Collection */}
        <div className="space-y-2">
          <Label>Kollektion *</Label>
          <Select value={collectionId} onValueChange={setCollectionId}>
            <SelectTrigger>
              <SelectValue placeholder="Kollektion auswählen" />
            </SelectTrigger>
            <SelectContent>
              {collections.map((col) => (
                <SelectItem key={col.id} value={col.id}>
                  {col.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price */}
        <div className="space-y-2">
          <Label htmlFor="price">Preis (ICP)</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
          />
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Wird hochgeladen...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} />
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isUploading || createNFT.isPending || !imageFile}
        >
          {isUploading || createNFT.isPending ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Wird geminted...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <UploadIcon className="w-4 h-4" />
              NFT minting
            </span>
          )}
        </Button>
      </form>
    </div>
  );
}
