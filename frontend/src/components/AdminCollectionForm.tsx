import React, { useState, useEffect } from 'react';
import { NFTCollection } from '../backend';
import { useCreateCollection } from '../hooks/useCreateCollection';
import { useUpdateCollection } from '../hooks/useUpdateCollection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface AdminCollectionFormProps {
  collection?: NFTCollection;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AdminCollectionForm({ collection, onSuccess, onCancel }: AdminCollectionFormProps) {
  const { mutateAsync: createCollection, isPending: isCreating } = useCreateCollection();
  const { mutateAsync: updateCollection, isPending: isUpdating } = useUpdateCollection();

  const [name, setName] = useState(collection?.name ?? '');
  const [description, setDescription] = useState(collection?.description ?? '');
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!collection;
  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (collection) {
      setName(collection.name);
      setDescription(collection.description);
    }
  }, [collection]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Bitte geben Sie einen Namen für die Kollektion ein.');
      return;
    }

    try {
      if (isEditing && collection) {
        await updateCollection({ id: collection.id, name: name.trim(), description: description.trim() });
        toast.success('Kollektion erfolgreich aktualisiert');
      } else {
        const id = `col-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        await createCollection({ id, name: name.trim(), description: description.trim() });
        toast.success('Kollektion erfolgreich erstellt');
        setName('');
        setDescription('');
      }
      onSuccess?.();
    } catch (err: any) {
      const msg = err?.message ?? 'Fehler beim Speichern der Kollektion.';
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="col-name">Name *</Label>
        <Input
          id="col-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="z.B. Tafelmalerei"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="col-description">Beschreibung (optional)</Label>
        <Textarea
          id="col-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Kurze Beschreibung der Kollektion..."
          rows={3}
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            Abbrechen
          </Button>
        )}
        <Button type="submit" disabled={isPending || !name.trim()}>
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isEditing ? 'Wird aktualisiert...' : 'Wird erstellt...'}
            </>
          ) : isEditing ? (
            'Kollektion aktualisieren'
          ) : (
            'Kollektion erstellen'
          )}
        </Button>
      </div>
    </form>
  );
}
