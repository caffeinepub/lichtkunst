import type { NFT } from '../backend';
import { User } from 'lucide-react';

interface IssuedNFTCardProps {
  nft: NFT;
  isOwn?: boolean;
}

export default function IssuedNFTCard({ nft, isOwn }: IssuedNFTCardProps) {
  const imageUrl = nft.metadata?.image?.getDirectURL?.() ?? '';
  const mintDate = nft.mintedAt
    ? new Date(Number(nft.mintedAt) / 1_000_000).toLocaleDateString('de-DE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const ownerStr = nft.owner?.toString() ?? '';
  const shortOwner = ownerStr.length > 12
    ? `${ownerStr.slice(0, 6)}…${ownerStr.slice(-4)}`
    : ownerStr;

  return (
    <div
      className={`group rounded-xl overflow-hidden border bg-card shadow-sm transition-all duration-200 hover:shadow-md ${
        isOwn ? 'border-primary/50 ring-1 ring-primary/30' : 'border-border/50'
      }`}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={nft.metadata?.title ?? 'NFT'}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            Kein Bild
          </div>
        )}
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span className="text-[10px] font-semibold bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
            On-Chain
          </span>
          {isOwn && (
            <span className="text-[10px] font-semibold bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full">
              Mein NFT
            </span>
          )}
        </div>
        {/* Token ID badge */}
        <div className="absolute top-2 right-2">
          <span className="text-[10px] font-mono bg-black/60 text-white px-1.5 py-0.5 rounded">
            #{nft.tokenId?.toString()}
          </span>
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm truncate">{nft.metadata?.title ?? 'Unbekannt'}</h3>
        {nft.metadata?.description && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">{nft.metadata.description}</p>
        )}
        {mintDate && (
          <p className="text-xs text-muted-foreground mt-1">{mintDate}</p>
        )}
        {ownerStr && (
          <div className="flex items-center gap-1 mt-1.5">
            <User className="h-3 w-3 text-muted-foreground shrink-0" />
            <span className="text-xs text-muted-foreground font-mono truncate">{shortOwner}</span>
          </div>
        )}
      </div>
    </div>
  );
}
