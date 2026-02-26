import React from 'react';
import { Link } from '@tanstack/react-router';
import type { NFTItem, NFTCollection } from '../backend';
import { ExternalLink, Hash } from 'lucide-react';

interface NFTCardProps {
  nft: NFTItem;
  collection?: NFTCollection;
  canisterId?: string;
}

function formatPrice(price: bigint): string {
  const icp = Number(price) / 1e8;
  return icp === 0 ? 'Nicht zum Verkauf' : `${icp.toFixed(2)} ICP`;
}

export default function NFTCard({ nft, collection, canisterId }: NFTCardProps) {
  const imageUrl = nft.imageData.getDirectURL();
  const explorerUrl = canisterId
    ? `https://dashboard.internetcomputer.org/canister/${canisterId}`
    : null;

  return (
    <Link
      to="/nft/$id"
      params={{ id: nft.id }}
      className="group block bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300"
    >
      {/* Image */}
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={nft.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <h3 className="font-serif font-medium text-foreground truncate group-hover:text-primary transition-colors">
          {nft.title}
        </h3>

        {/* Collection name */}
        {collection && (
          <p className="text-xs text-muted-foreground truncate">{collection.name}</p>
        )}

        {/* Token ID Badge */}
        {nft.tokenId !== undefined && nft.tokenId !== null && (
          <div className="flex items-center gap-1.5">
            <Hash className="w-3 h-3 text-primary" />
            <span className="text-xs font-mono text-primary font-medium">
              #{nft.tokenId.toString()}
            </span>
            {explorerUrl && (
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="ml-auto text-muted-foreground hover:text-primary transition-colors"
                title="Auf ICP Explorer ansehen"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{formatPrice(nft.price)}</span>
          {nft.minted && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
              On-Chain
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
