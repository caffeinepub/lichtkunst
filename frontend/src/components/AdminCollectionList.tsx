import { useState } from 'react';
import { useGetAllCollections } from '../hooks/useGetAllCollections';
import { useDeleteCollection } from '../hooks/useDeleteCollection';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import AdminCollectionForm from './AdminCollectionForm';
import { toast } from 'sonner';
import type { NFTCollection } from '../backend';
import { Pencil, Trash2, FolderOpen } from 'lucide-react';

export default function AdminCollectionList() {
  const { data: collections, isLoading, error } = useGetAllCollections();
  const deleteMutation = useDeleteCollection();
  const [editingCollection, setEditingCollection] = useState<NFTCollection | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Kollektion gelöscht.');
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      toast.error(`Fehler beim Löschen: ${msg}`);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-destructive text-sm">
        Fehler beim Laden der Kollektionen: {error instanceof Error ? error.message : 'Unbekannter Fehler'}
      </p>
    );
  }

  if (!collections || collections.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FolderOpen className="mx-auto h-10 w-10 mb-2 opacity-40" />
        <p className="text-sm">Noch keine Kollektionen vorhanden.</p>
        <p className="text-xs mt-1">Erstelle deine erste Kollektion mit dem Formular oben.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {collections.map((collection) => (
        <div
          key={collection.id}
          className="flex items-center justify-between p-3 rounded-lg border border-border bg-card"
        >
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm truncate">{collection.name}</p>
            <p className="text-xs text-muted-foreground truncate">{collection.id}</p>
            {collection.description && (
              <p className="text-xs text-muted-foreground truncate mt-0.5">{collection.description}</p>
            )}
          </div>
          <div className="flex gap-1 ml-2 shrink-0">
            <Dialog
              open={editDialogOpen && editingCollection?.id === collection.id}
              onOpenChange={(open) => {
                setEditDialogOpen(open);
                if (!open) setEditingCollection(null);
              }}
            >
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditingCollection(collection);
                    setEditDialogOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Kollektion bearbeiten</DialogTitle>
                </DialogHeader>
                <AdminCollectionForm
                  editingCollection={editingCollection}
                  onDone={() => {
                    setEditDialogOpen(false);
                    setEditingCollection(null);
                  }}
                />
              </DialogContent>
            </Dialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Kollektion löschen?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Die Kollektion „{collection.name}" und alle zugehörigen NFTs werden unwiderruflich gelöscht.
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
