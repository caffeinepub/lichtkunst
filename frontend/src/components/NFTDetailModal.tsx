import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Check, ExternalLink, Coins, Calendar, Hash, User, Wallet } from 'lucide-react';
import type { NFTItem, NFT } from '@/backend';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { toast } from 'sonner';

interface NFTDetailModalProps {
  open: boolean;
  onClose: () => void;
  nftItem?: NFTItem | null;
  issuedNFT?: NFT | null;
  canisterId?: string;
}

function CopyField({ label, value, mono = true }: { label: string; value: string; mono?: boolean }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(value);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success(`${label} kopiert!`);
    }
  };

  return (
    <div className="flex items-start gap-2 min-w-0">
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`text-xs break-all ${mono ? 'font-mono' : ''}`}
            title={value}
          >
            {value}
          </span>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
            title={`${label} kopieren`}
            aria-label={`${label} kopieren`}
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NFTDetailModal({
  open,
  onClose,
  nftItem,
  issuedNFT,
  canisterId,
}: NFTDetailModalProps) {
  const title = issuedNFT?.metadata.title ?? nftItem?.title ?? 'NFT';
  const description = issuedNFT?.metadata.description ?? nftItem?.description ?? '';

  const imageUrl = issuedNFT
    ? issuedNFT.metadata.image.getDirectURL()
    : nftItem?.imageData.getDirectURL();

  const tokenId = issuedNFT
    ? issuedNFT.tokenId.toString()
    : nftItem?.tokenId != null
    ? nftItem.tokenId.toString()
    : null;

  const mintedAt = issuedNFT ? issuedNFT.mintedAt : nftItem?.mintedAt ?? null;

  const ownerPrincipal = issuedNFT?.owner?.toString() ?? nftItem?.owner?.toString() ?? null;

  const price =
    nftItem?.price != null ? (Number(nftItem.price) / 1e8).toFixed(2) : null;

  const formattedMintDate = mintedAt
    ? new Date(Number(mintedAt) / 1_000_000).toLocaleDateString('de-DE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const explorerUrl = canisterId
    ? `https://dashboard.internetcomputer.org/canister/${canisterId}`
    : null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl w-full p-0 overflow-hidden rounded-2xl">
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="md:w-1/2 bg-muted flex items-center justify-center min-h-[260px] md:min-h-[420px]">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover md:rounded-l-2xl"
                style={{ maxHeight: '520px' }}
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center text-muted-foreground text-sm">
                Kein Bild verfügbar
              </div>
            )}
          </div>

          {/* Details */}
          <div className="md:w-1/2 flex flex-col p-6 gap-4 overflow-y-auto max-h-[520px]">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl leading-tight">{title}</DialogTitle>
              {description && (
                <DialogDescription className="text-sm text-muted-foreground mt-1">
                  {description}
                </DialogDescription>
              )}
            </DialogHeader>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {issuedNFT && (
                <Badge className="bg-accent text-accent-foreground text-xs">On-Chain ICP</Badge>
              )}
              {tokenId && (
                <Badge variant="outline" className="text-xs font-mono">
                  Token #{tokenId}
                </Badge>
              )}
            </div>

            {/* Metadata */}
            <div className="space-y-4 text-sm">
              {tokenId && (
                <div className="flex items-start gap-2">
                  <Hash className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                  <CopyField label="Token ID" value={tokenId} />
                </div>
              )}

              {formattedMintDate && (
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Geminted am</p>
                    <p className="text-xs">{formattedMintDate}</p>
                  </div>
                </div>
              )}

              {price && (
                <div className="flex items-start gap-2">
                  <Coins className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Preis</p>
                    <p className="text-xs font-semibold">{price} ICP</p>
                  </div>
                </div>
              )}

              {ownerPrincipal && (
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                  <CopyField label="Eigentümer (Principal)" value={ownerPrincipal} />
                </div>
              )}

              {canisterId && (
                <div className="flex items-start gap-2">
                  <Wallet className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                  <CopyField label="Canister-Adresse (ICP)" value={canisterId} />
                </div>
              )}
            </div>

            {/* Explorer Link */}
            {explorerUrl && (
              <div className="mt-auto pt-2">
                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Im ICP Dashboard ansehen
                  </Button>
                </a>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
