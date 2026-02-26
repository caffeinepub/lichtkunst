import React from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetNFT } from '../hooks/useGetNFT';
import { useGetAllCollections } from '../hooks/useGetAllCollections';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, ShoppingCart, Hash, Calendar, Tag } from 'lucide-react';

// Get canister ID from environment
function getCanisterId(): string {
  return (window as unknown as Record<string, string>).__CANISTER_ID_BACKEND__
    || import.meta.env.VITE_CANISTER_ID_BACKEND
    || '';
}

function formatDate(timestamp: bigint | undefined | null): string {
  if (!timestamp) return 'Unbekannt';
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatPrice(price: bigint): string {
  const icp = Number(price) / 1e8;
  return icp === 0 ? 'Nicht zum Verkauf' : `${icp.toFixed(2)} ICP`;
}

export default function NFTDetail() {
  const { id } = useParams({ from: '/nft/$id' });
  const navigate = useNavigate();
  const { data: nft, isLoading, error } = useGetNFT(id);
  const { data: collections = [] } = useGetAllCollections();

  const canisterId = getCanisterId();
  const explorerUrl = canisterId
    ? `https://dashboard.internetcomputer.org/canister/${canisterId}`
    : 'https://dashboard.internetcomputer.org';

  const collection = collections.find((c) => c.id === nft?.collectionId);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !nft) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground text-lg mb-4">NFT nicht gefunden.</p>
        <Button variant="outline" onClick={() => navigate({ to: '/nft-galerie' })}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück zur Galerie
        </Button>
      </div>
    );
  }

  const imageUrl = nft.imageData.getDirectURL();

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Back Button */}
      <button
        onClick={() => navigate({ to: '/nft-galerie' })}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm">Zurück zur Galerie</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
            <img
              src={imageUrl}
              alt={nft.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div className="space-y-6">
          {/* Collection Badge */}
          {collection && (
            <Badge variant="secondary" className="text-xs">
              {collection.name}
            </Badge>
          )}

          {/* Title */}
          <h1 className="text-4xl font-serif font-light text-foreground leading-tight">
            {nft.title}
          </h1>

          {/* Description */}
          {nft.description && (
            <p className="text-muted-foreground leading-relaxed">{nft.description}</p>
          )}

          {/* On-Chain Info */}
          <div className="space-y-3 p-4 bg-muted/30 rounded-xl border border-border">
            <h3 className="text-sm font-medium text-foreground uppercase tracking-wider">
              On-Chain Details
            </h3>

            {/* Token ID */}
            {nft.tokenId !== undefined && nft.tokenId !== null && (
              <div className="flex items-center gap-3">
                <Hash className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">ICRC-7 Token ID</p>
                  <p className="text-base font-mono font-bold text-primary">
                    #{nft.tokenId.toString()}
                  </p>
                </div>
              </div>
            )}

            {/* Mint Date */}
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Geminted am</p>
                <p className="text-sm text-foreground">
                  {nft.mintedAt ? formatDate(nft.mintedAt) : 'Unbekannt'}
                </p>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <Tag className="w-4 h-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Preis</p>
                <p className="text-sm font-medium text-foreground">
                  {formatPrice(nft.price)}
                </p>
              </div>
            </div>

            {/* ICP Explorer Link */}
            {nft.tokenId !== undefined && nft.tokenId !== null && (
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium pt-1"
              >
                <ExternalLink className="w-4 h-4" />
                Auf ICP Explorer ansehen
              </a>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3 pt-2">
            <a
              href="https://entrepot.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              Kaufen und Handeln
            </a>
            <div className="flex gap-3">
              <a
                href="https://entrepot.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
              >
                Entrepot
              </a>
              <a
                href="https://yumi.io"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
              >
                Yumi
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
