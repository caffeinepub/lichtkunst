import { useState } from 'react';
import { Layers, Sparkles, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import NFTCard from '../components/NFTCard';
import { useGetAllCollections } from '../hooks/useGetAllCollections';
import { useGetAllNFTs } from '../hooks/useGetAllNFTs';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import type { NFTCollection } from '../backend';

export default function NFTGallery() {
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();

  const { data: collections = [], isLoading: collectionsLoading } = useGetAllCollections();
  const { data: allNFTs = [], isLoading: nftsLoading } = useGetAllNFTs();

  const isLoading = collectionsLoading || nftsLoading;

  const displayedNFTs = selectedCollectionId
    ? allNFTs.filter((nft) => nft.collectionId === selectedCollectionId)
    : allNFTs;

  const collectionMap = new Map<string, NFTCollection>(
    collections.map((c) => [c.id, c])
  );

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative h-24 w-full overflow-hidden md:h-28">
        <div className="absolute inset-0">
          <img
            src="/assets/generated/hero-light-art.dim_1920x1080.png"
            alt="NFT Galerie – Istvan Seidel Lichtkunst"
            className="h-full w-full object-cover object-center opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/40 to-background" />
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        {/* Page heading */}
        <div className="mb-8 text-center">
          <div className="mb-3 flex items-center justify-center gap-2 text-muted-foreground/50">
            <Sparkles className="h-4 w-4 opacity-60" />
            <span
              className="tracking-[0.28em] uppercase"
              style={{ fontWeight: 100, fontSize: '0.75rem' }}
            >
              Blockchain · ICP
            </span>
            <Sparkles className="h-4 w-4 opacity-60" />
          </div>
          <h1
            className="font-serif text-foreground/80 tracking-[0.12em]"
            style={{ fontWeight: 100, fontSize: '2rem' }}
          >
            NFT Galerie
          </h1>
          <p className="mt-2 text-sm font-thin text-muted-foreground/60 tracking-wide">
            Originale Lichtkunst als digitale Sammlerstücke auf dem Internet Computer
          </p>

          {/* Upload CTA for authenticated users */}
          {identity && (
            <div className="mt-5">
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate({ to: '/upload' })}
                className="gap-2 tracking-wide font-thin"
              >
                <Upload className="h-4 w-4" />
                NFT hochladen
              </Button>
            </div>
          )}
        </div>

        {/* Collection filter */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
          <Button
            variant={selectedCollectionId === null ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedCollectionId(null)}
            className="text-xs font-thin tracking-wide"
          >
            <Layers className="mr-1.5 h-3.5 w-3.5" />
            Alle Kollektionen
          </Button>

          {collectionsLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-28 rounded-full" />
              ))
            : collections.map((collection) => (
                <Button
                  key={collection.id}
                  variant={selectedCollectionId === collection.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedCollectionId(collection.id)}
                  className="text-xs font-thin tracking-wide"
                >
                  {collection.name}
                </Button>
              ))}
        </div>

        {/* NFT Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-lg border border-border/50">
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="p-5 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : displayedNFTs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Sparkles className="mb-4 h-12 w-12 text-muted-foreground/30" />
            <h2 className="mb-2 font-serif text-xl font-thin text-muted-foreground/60">
              {selectedCollectionId
                ? 'Keine NFTs in dieser Kollektion'
                : 'Noch keine NFTs vorhanden'}
            </h2>
            <p className="text-sm font-thin text-muted-foreground/40 tracking-wide">
              Die ersten Kunstwerke werden bald als NFTs verfügbar sein.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayedNFTs.map((nft) => (
              <NFTCard
                key={nft.id}
                nft={nft}
                collection={collectionMap.get(nft.collectionId)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
