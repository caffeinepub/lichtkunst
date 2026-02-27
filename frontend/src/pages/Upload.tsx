import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useCreateNFT } from '../hooks/useCreateNFT';
import { useGetAllCollections } from '../hooks/useGetAllCollections';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { ExternalLink, Upload as UploadIcon, CheckCircle, Loader2, AlertCircle, FolderOpen } from 'lucide-react';
import { ExternalBlob } from '../backend';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';

export default function Upload() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { mutateAsync: createNFT, isPending } = useCreateNFT();
  const { data: collections = [], isLoading: collectionsLoading } = useGetAllCollections();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [collectionId, setCollectionId] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [mintedNFT, setMintedNFT] = useState<{ tokenId?: bigint; id: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!identity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Anmeldung erforderlich</h2>
            <p className="text-muted-foreground">Bitte melden Sie sich an, um NFTs hochzuladen.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!imageFile) {
      setError('Bitte wählen Sie ein Bild aus.');
      return;
    }
    if (!collectionId) {
      setError('Bitte wählen Sie eine Kollektion aus.');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(10);

      const arrayBuffer = await imageFile.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
        setUploadProgress(10 + Math.floor(pct * 0.7));
      });

      setUploadProgress(80);

      const priceInE8s = price ? BigInt(Math.round(parseFloat(price) * 1e8)) : BigInt(0);
      const id = `nft-${Date.now()}-${Math.random().toString(36).slice(2)}`;

      const result = await createNFT({
        id,
        collectionId,
        title,
        description,
        imageData: blob,
        price: priceInE8s,
      });

      setUploadProgress(100);
      setMintedNFT({ tokenId: result?.tokenId, id: result?.id ?? id });
      toast.success('NFT erfolgreich erstellt!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Fehler beim Erstellen des NFTs.';
      setError(msg);
      toast.error('Fehler beim Erstellen des NFTs.');
    } finally {
      setIsUploading(false);
    }
  };

  if (mintedNFT) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-lg w-full">
          <CardContent className="pt-8 text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-serif font-semibold">NFT erfolgreich erstellt!</h2>
            {mintedNFT.tokenId !== undefined && (
              <div className="bg-muted rounded-lg p-4 space-y-2">
                <p className="text-sm text-muted-foreground">On-Chain Token ID</p>
                <p className="text-2xl font-mono font-bold text-primary">#{mintedNFT.tokenId.toString()}</p>
                <a
                  href="https://dashboard.internetcomputer.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  ICP Explorer <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
            <div className="flex gap-3 justify-center pt-2">
              <Button variant="outline" onClick={() => navigate({ to: '/nft-galerie' })}>
                Zur Galerie
              </Button>
              <Button
                onClick={() => {
                  setMintedNFT(null);
                  setTitle('');
                  setDescription('');
                  setPrice('');
                  setCollectionId('');
                  setImageFile(null);
                  setImagePreview(null);
                  setUploadProgress(0);
                }}
              >
                Weiteres NFT erstellen
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-serif font-light tracking-wide mb-2">NFT hochladen</h1>
          <p className="text-muted-foreground">Erstellen Sie ein neues NFT und fügen Sie es einer Kollektion hinzu.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif font-light">NFT Details</CardTitle>
            <CardDescription>Füllen Sie alle Felder aus, um Ihr NFT zu erstellen.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Collection Selector */}
              <div className="space-y-2">
                <Label htmlFor="collection">Kollektion *</Label>
                {collectionsLoading ? (
                  <div className="h-10 bg-muted animate-pulse rounded-md" />
                ) : collections.length === 0 ? (
                  <Alert>
                    <FolderOpen className="h-4 w-4" />
                    <AlertDescription>
                      Noch keine Kollektionen vorhanden. Bitte erstellen Sie zuerst eine Kollektion im{' '}
                      <button
                        type="button"
                        className="underline font-medium hover:text-primary"
                        onClick={() => navigate({ to: '/admin' })}
                      >
                        Admin-Bereich
                      </button>
                      .
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Select value={collectionId} onValueChange={setCollectionId}>
                    <SelectTrigger id="collection">
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
                <Label htmlFor="title">Titel *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="NFT Titel"
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
                  placeholder="Beschreibung des NFTs..."
                  rows={4}
                />
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

              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="image">Bild *</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  {imagePreview ? (
                    <div className="space-y-3">
                      <img
                        src={imagePreview}
                        alt="Vorschau"
                        className="max-h-48 mx-auto rounded-md object-contain"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                      >
                        Bild entfernen
                      </Button>
                    </div>
                  ) : (
                    <label htmlFor="image" className="cursor-pointer space-y-2 block">
                      <UploadIcon className="w-10 h-10 text-muted-foreground mx-auto" />
                      <p className="text-sm text-muted-foreground">
                        Klicken Sie hier oder ziehen Sie ein Bild hierher
                      </p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, GIF bis 10MB</p>
                    </label>
                  )}
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
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

              {/* Error */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isPending || isUploading || !imageFile || !title || !collectionId || collections.length === 0}
                >
                  {isPending || isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Wird erstellt...
                    </>
                  ) : (
                    <>
                      <UploadIcon className="w-4 h-4 mr-2" />
                      NFT erstellen
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
