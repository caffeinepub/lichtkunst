import React from 'react';
import { ExternalLink, Coins } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { NFTItem, NFTCollection } from '@/backend';

interface NFTCardProps {
  nft: NFTItem;
  collection?: NFTCollection;
  canisterId?: string;
  onClick?: (nft: NFTItem) => void;
}

export default function NFTCard({ nft, collection, canisterId, onClick }: NFTCardProps) {
  const imageUrl = nft.imageData.getDirectURL();
  const priceICP = nft.price != null ? (Number(nft.price) / 1e8).toFixed(2) : null;

  const explorerUrl =
    canisterId && nft.tokenId != null
      ? `https://dashboard.internetcomputer.org/canister/${canisterId}`
      : null;

  return (
    <div
      className="group bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
      onClick={() => onClick?.(nft)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.(nft);
        }
      }}
      aria-label={`NFT ansehen: ${nft.title}`}
    >
      <div className="relative overflow-hidden aspect-square bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={nft.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            Kein Bild
          </div>
        )}
        {nft.tokenId != null && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-accent/90 text-accent-foreground text-xs backdrop-blur-sm">
              On-Chain
            </Badge>
          </div>
        )}
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-serif text-base font-medium leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {nft.title}
        </h3>

        {collection && (
          <p className="text-xs text-muted-foreground">{collection.name}</p>
        )}

        <div className="flex items-center justify-between pt-1">
          {priceICP && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Coins className="w-3 h-3" />
              <span>{priceICP} ICP</span>
            </div>
          )}

          {nft.tokenId != null && explorerUrl && (
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-muted-foreground hover:text-primary transition-colors"
              title="Im ICP Explorer ansehen"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
