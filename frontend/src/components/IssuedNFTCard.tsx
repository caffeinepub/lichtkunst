import React from 'react';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';
import type { NFT } from '@/backend';
import { shortenPrincipal } from '@/utils/formatPrincipal';

interface IssuedNFTCardProps {
  nft: NFT;
  onClick?: (nft: NFT) => void;
  /** Highlight this card if the owner matches the current user */
  isOwn?: boolean;
}

export default function IssuedNFTCard({ nft, onClick, isOwn = false }: IssuedNFTCardProps) {
  const imageUrl = nft.metadata.image.getDirectURL();
  const mintDate = new Date(Number(nft.mintedAt) / 1_000_000).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const ownerShort = shortenPrincipal(nft.owner.toString(), 8, 4);

  return (
    <div
      className={`group bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${
        isOwn ? 'border-primary/50 ring-1 ring-primary/20' : 'border-border'
      }`}
      onClick={() => onClick?.(nft)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.(nft);
        }
      }}
      aria-label={`NFT ansehen: ${nft.metadata.title}`}
    >
      <div className="relative overflow-hidden aspect-square bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={nft.metadata.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            Kein Bild
          </div>
        )}
        <div className="absolute top-2 left-2 flex gap-1.5">
          <Badge className="bg-accent/90 text-accent-foreground text-xs backdrop-blur-sm">
            On-Chain
          </Badge>
          {isOwn && (
            <Badge className="bg-primary/90 text-primary-foreground text-xs backdrop-blur-sm">
              Mein NFT
            </Badge>
          )}
        </div>
        <div className="absolute bottom-2 right-2">
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm text-xs font-mono">
            #{nft.tokenId.toString()}
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-serif text-base font-medium leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {nft.metadata.title}
        </h3>

        {nft.metadata.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{nft.metadata.description}</p>
        )}

        <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
          <span className="font-mono font-medium">Token #{nft.tokenId.toString()}</span>
          <span>{mintDate}</span>
        </div>

        <div
          className="flex items-center gap-1 text-xs text-muted-foreground font-mono truncate"
          title={nft.owner.toString()}
        >
          <User className="w-3 h-3 shrink-0" />
          <span className="truncate">{ownerShort}</span>
        </div>
      </div>
    </div>
  );
}
