import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateCollection } from '../hooks/useCreateCollection';
import { useUpdateCollection } from '../hooks/useUpdateCollection';
import { toast } from 'sonner';
import type { NFTCollection } from '../backend';
import { Loader2 } from 'lucide-react';

interface AdminCollectionFormProps {
  editingCollection?: NFTCollection | null;
  onDone?: () => void;
}

export default function AdminCollectionForm({ editingCollection, onDone }: AdminCollectionFormProps) {
  const [id, setId] = useState(editingCollection?.id ?? '');
  const [name, setName] = useState(editingCollection?.name ?? '');
  const [description, setDescription] = useState(editingCollection?.description ?? '');

  const createMutation = useCreateCollection();
  const updateMutation = useUpdateCollection();

  const isEditing = !!editingCollection;
  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id.trim() || !name.trim()) {
      toast.error('ID und Name sind Pflichtfelder.');
      return;
    }

    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: id.trim(), name: name.trim(), description: description.trim() });
        toast.success('Kollektion erfolgreich aktualisiert.');
      } else {
        await createMutation.mutateAsync({ id: id.trim(), name: name.trim(), description: description.trim() });
        toast.success('Kollektion erfolgreich erstellt.');
        setId('');
        setName('');
        setDescription('');
      }
      onDone?.();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      if (msg.includes('Unauthorized') || msg.includes('Only admins') || msg.includes('Keine Berechtigung')) {
        toast.error('Keine Berechtigung: Nur Admins können Kollektionen verwalten.');
      } else if (msg.includes('Actor nicht verfügbar')) {
        toast.error('Verbindung zum Backend nicht möglich. Bitte erneut anmelden.');
      } else {
        toast.error(`Fehler: ${msg}`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isEditing && (
        <div className="space-y-1">
          <Label htmlFor="collection-id">ID (eindeutig)</Label>
          <Input
            id="collection-id"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="z.B. lichtei-2024"
            disabled={isPending}
            required
          />
        </div>
      )}
      <div className="space-y-1">
        <Label htmlFor="collection-name">Name</Label>
        <Input
          id="collection-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Kollektionsname"
          disabled={isPending}
          required
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="collection-description">Beschreibung</Label>
        <Textarea
          id="collection-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Kurze Beschreibung der Kollektion"
          disabled={isPending}
          rows={3}
        />
      </div>
      <div className="flex gap-2 justify-end">
        {onDone && (
          <Button type="button" variant="outline" onClick={onDone} disabled={isPending}>
            Abbrechen
          </Button>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? 'Aktualisieren' : 'Kollektion erstellen'}
        </Button>
      </div>
    </form>
  );
}
