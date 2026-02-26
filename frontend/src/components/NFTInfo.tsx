import React from 'react';
import { ExternalLink, Hash, Calendar, Tag } from 'lucide-react';
import { NFTItem } from '../backend';

interface NFTInfoProps {
  nft: NFTItem;
  canisterId?: string;
}

function formatDate(timestamp: bigint | undefined | null): string {
  if (!timestamp) return 'Unbekannt';
  // Convert nanoseconds to milliseconds
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

export default function NFTInfo({ nft, canisterId }: NFTInfoProps) {
  const explorerUrl = canisterId
    ? `https://dashboard.internetcomputer.org/canister/${canisterId}`
    : 'https://dashboard.internetcomputer.org';

  return (
    <div className="space-y-4">
      {/* Token ID */}
      {nft.tokenId !== undefined && nft.tokenId !== null && (
        <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
          <Hash className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-0.5">
              ICRC-7 Token ID
            </p>
            <p className="text-lg font-mono font-bold text-primary">
              #{nft.tokenId.toString()}
            </p>
          </div>
        </div>
      )}

      {/* Mint Date */}
      <div className="flex items-start gap-3">
        <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-0.5">
            Geminted am
          </p>
          <p className="text-sm text-foreground">
            {nft.mintedAt ? formatDate(nft.mintedAt) : 'Unbekannt'}
          </p>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-start gap-3">
        <Tag className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-0.5">
            Preis
          </p>
          <p className="text-sm text-foreground font-medium">
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
          className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
        >
          <ExternalLink className="w-4 h-4" />
          Auf ICP Explorer ansehen
        </a>
      )}
    </div>
  );
}
