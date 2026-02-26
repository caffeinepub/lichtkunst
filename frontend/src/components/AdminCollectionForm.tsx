import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Loader2, Plus, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateCollection } from '../hooks/useCreateCollection';
import { useUpdateCollection } from '../hooks/useUpdateCollection';
import type { NFTCollection } from '../backend';

interface AdminCollectionFormProps {
  editingCollection?: NFTCollection | null;
  onDone?: () => void;
}

function generateId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') +
    '-' +
    Date.now().toString(36);
}

export default function AdminCollectionForm({ editingCollection, onDone }: AdminCollectionFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const createCollection = useCreateCollection();
  const updateCollection = useUpdateCollection();

  const isEditing = !!editingCollection;
  const isPending = createCollection.isPending || updateCollection.isPending;

  useEffect(() => {
    if (editingCollection) {
      setName(editingCollection.name);
      setDescription(editingCollection.description);
    } else {
      setName('');
      setDescription('');
    }
  }, [editingCollection]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Bitte einen Namen eingeben.');
      return;
    }

    try {
      if (isEditing && editingCollection) {
        await updateCollection.mutateAsync({
          id: editingCollection.id,
          name: name.trim(),
          description: description.trim(),
        });
        toast.success('Kollektion erfolgreich aktualisiert.');
      } else {
        const id = generateId(name.trim());
        await createCollection.mutateAsync({
          id,
          name: name.trim(),
          description: description.trim(),
        });
        toast.success('Kollektion erfolgreich erstellt.');
        setName('');
        setDescription('');
      }
      onDone?.();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unbekannter Fehler';
      toast.error(`Fehler: ${message}`);
    }
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="pb-4">
        <CardTitle className="font-serif text-lg font-thin tracking-wide">
          {isEditing ? 'Kollektion bearbeiten' : 'Neue Kollektion erstellen'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="col-name" className="text-xs font-thin tracking-wide uppercase text-muted-foreground">
              Name *
            </Label>
            <Input
              id="col-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z.B. Lichtei"
              disabled={isPending}
              className="bg-background/50"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="col-desc" className="text-xs font-thin tracking-wide uppercase text-muted-foreground">
              Beschreibung
            </Label>
            <Textarea
              id="col-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Kurze Beschreibung der Kollektion..."
              rows={3}
              disabled={isPending}
              className="bg-background/50 resize-none"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <Button type="submit" disabled={isPending} size="sm" className="gap-1.5">
              {isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : isEditing ? (
                <Save className="h-3.5 w-3.5" />
              ) : (
                <Plus className="h-3.5 w-3.5" />
              )}
              {isEditing ? 'Speichern' : 'Erstellen'}
            </Button>
            {isEditing && onDone && (
              <Button type="button" variant="ghost" size="sm" onClick={onDone} disabled={isPending}>
                Abbrechen
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
