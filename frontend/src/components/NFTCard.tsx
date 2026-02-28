import type { NFTCollection, NFTItem } from '../backend';
import { ExternalLink } from 'lucide-react';

interface NFTCardProps {
  nft: NFTItem;
  collection?: NFTCollection;
  canisterId?: string;
  onClick?: (nft: NFTItem) => void;
}

export default function NFTCard({ nft, collection, canisterId, onClick }: NFTCardProps) {
  const imageUrl = nft.imageData?.getDirectURL?.() ?? '';

  const explorerUrl =
    canisterId && nft.tokenId != null
      ? `https://dashboard.internetcomputer.org/canister/${canisterId}`
      : nft.tokenId != null
      ? `https://dashboard.internetcomputer.org/token/${nft.tokenId}`
      : null;

  return (
    <div
      className={`group rounded-xl overflow-hidden border border-border/50 bg-card shadow-sm transition-all duration-200 hover:shadow-md hover:border-border ${onClick ? 'cursor-pointer' : ''}`}
      onClick={() => onClick?.(nft)}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(nft); } } : undefined}
      aria-label={onClick ? `NFT ansehen: ${nft.title}` : undefined}
    >
      <div className="aspect-square overflow-hidden bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={nft.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            Kein Bild
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm truncate">{nft.title}</h3>
        {collection && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">{collection.name}</p>
        )}
        <div className="flex items-center justify-between mt-2">
          {nft.price > 0n && (
            <span className="text-xs font-medium text-primary">
              {nft.price.toString()} ICP
            </span>
          )}
          {explorerUrl && (
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-muted-foreground hover:text-primary transition-colors"
              title="ICP Explorer"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
