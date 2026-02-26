import { useState } from 'react';
import { toast } from 'sonner';
import { Pencil, Trash2, Loader2, ImageOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useGetAllNFTs } from '../hooks/useGetAllNFTs';
import { useGetAllCollections } from '../hooks/useGetAllCollections';
import { useDeleteNFT } from '../hooks/useDeleteNFT';
import type { NFTItem } from '../backend';

interface AdminNFTListProps {
  onEdit: (nft: NFTItem) => void;
}

function formatICP(e8s: bigint): string {
  const icp = Number(e8s) / 100_000_000;
  return icp.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
}

export default function AdminNFTList({ onEdit }: AdminNFTListProps) {
  const { data: nfts = [], isLoading: nftsLoading } = useGetAllNFTs();
  const { data: collections = [] } = useGetAllCollections();
  const deleteNFT = useDeleteNFT();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const collectionMap = new Map(collections.map((c) => [c.id, c.name]));

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteNFT.mutateAsync(id);
      toast.success('NFT erfolgreich gelöscht.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unbekannter Fehler';
      toast.error(`Fehler beim Löschen: ${message}`);
    } finally {
      setDeletingId(null);
    }
  };

  if (nftsLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/50 py-10 text-center">
        <ImageOff className="mb-3 h-8 w-8 text-muted-foreground/30" />
        <p className="text-sm font-thin text-muted-foreground/60">Noch keine NFTs vorhanden.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {nfts.map((nft) => {
        const imageUrl = nft.imageData.getDirectURL();
        const collectionName = collectionMap.get(nft.collectionId) ?? nft.collectionId;

        return (
          <div
            key={nft.id}
            className="flex items-center gap-3 rounded-lg border border-border/40 bg-card/40 px-4 py-3 backdrop-blur"
          >
            {/* Thumbnail */}
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-border/30 bg-accent/20">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={nft.title}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground/30">
                  <ImageOff className="h-4 w-4" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <p className="truncate font-serif text-sm font-light tracking-wide">{nft.title}</p>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-thin text-muted-foreground/60">{collectionName}</span>
                <Badge variant="outline" className="h-4 px-1.5 text-[10px] font-thin">
                  {formatICP(nft.price)} ICP
                </Badge>
                {!nft.owner && (
                  <Badge variant="secondary" className="h-4 px-1.5 text-[10px] font-thin">
                    Verfügbar
                  </Badge>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="ml-1 flex shrink-0 items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => onEdit(nft)}
                title="Bearbeiten"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    disabled={deletingId === nft.id}
                    title="Löschen"
                  >
                    {deletingId === nft.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>NFT löschen?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Das NFT <strong>„{nft.title}"</strong> wird unwiderruflich gelöscht.
                      Diese Aktion kann nicht rückgängig gemacht werden.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(nft.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Löschen
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        );
      })}
    </div>
  );
}
