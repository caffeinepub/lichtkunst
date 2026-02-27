import React, { useState } from 'react';
import { NFTCollection } from '../backend';
import { useGetAllCollections } from '../hooks/useGetAllCollections';
import { useDeleteCollection } from '../hooks/useDeleteCollection';
import AdminCollectionForm from './AdminCollectionForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pencil, Trash2, FolderOpen, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminCollectionList() {
  const { data: collections = [], isLoading } = useGetAllCollections();
  const { mutateAsync: deleteCollection, isPending: isDeleting } = useDeleteCollection();
  const [editingCollection, setEditingCollection] = useState<NFTCollection | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteCollection(id);
      toast.success('Kollektion erfolgreich gelöscht');
    } catch (err: any) {
      toast.error(err?.message ?? 'Fehler beim Löschen der Kollektion.');
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
        <p className="text-sm">Noch keine Kollektionen vorhanden.</p>
        <p className="text-xs mt-1">Erstellen Sie Ihre erste Kollektion mit dem Formular oben.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {collections.map((col) => (
          <Card key={col.id} className="border border-border">
            <CardContent className="py-4 px-5 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">{col.name}</h3>
                {col.description && (
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{col.description}</p>
                )}
                <p className="text-xs text-muted-foreground/60 mt-1">
                  ID: <span className="font-mono">{col.id}</span>
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setEditingCollection(col)}
                  title="Bearbeiten"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      title="Löschen"
                      disabled={isDeleting && deletingId === col.id}
                    >
                      {isDeleting && deletingId === col.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Kollektion löschen?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Möchten Sie die Kollektion „{col.name}" wirklich löschen? Alle zugehörigen NFTs werden
                        ebenfalls gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={() => handleDelete(col.id)}
                      >
                        Löschen
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingCollection} onOpenChange={(open) => !open && setEditingCollection(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kollektion bearbeiten</DialogTitle>
          </DialogHeader>
          {editingCollection && (
            <AdminCollectionForm
              collection={editingCollection}
              onSuccess={() => setEditingCollection(null)}
              onCancel={() => setEditingCollection(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
