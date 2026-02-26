import { useState } from 'react';
import { toast } from 'sonner';
import { Pencil, Trash2, Loader2, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
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
import { useGetAllCollections } from '../hooks/useGetAllCollections';
import { useDeleteCollection } from '../hooks/useDeleteCollection';
import type { NFTCollection } from '../backend';

interface AdminCollectionListProps {
  onEdit: (collection: NFTCollection) => void;
}

export default function AdminCollectionList({ onEdit }: AdminCollectionListProps) {
  const { data: collections = [], isLoading } = useGetAllCollections();
  const deleteCollection = useDeleteCollection();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteCollection.mutateAsync(id);
      toast.success('Kollektion und zugehörige NFTs wurden gelöscht.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unbekannter Fehler';
      toast.error(`Fehler beim Löschen: ${message}`);
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/50 py-10 text-center">
        <FolderOpen className="mb-3 h-8 w-8 text-muted-foreground/30" />
        <p className="text-sm font-thin text-muted-foreground/60">Noch keine Kollektionen vorhanden.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {collections.map((collection) => (
        <div
          key={collection.id}
          className="flex items-center justify-between rounded-lg border border-border/40 bg-card/40 px-4 py-3 backdrop-blur"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate font-serif text-sm font-light tracking-wide">{collection.name}</p>
            {collection.description && (
              <p className="truncate text-[11px] font-thin text-muted-foreground/60">{collection.description}</p>
            )}
          </div>
          <div className="ml-3 flex shrink-0 items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onEdit(collection)}
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
                  disabled={deletingId === collection.id}
                  title="Löschen"
                >
                  {deletingId === collection.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Kollektion löschen?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Die Kollektion <strong>„{collection.name}"</strong> und alle zugehörigen NFTs werden
                    unwiderruflich gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(collection.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Löschen
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ))}
    </div>
  );
}
