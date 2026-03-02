import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetCallerUserProfile } from '../hooks/useGetCallerUserProfile';
import { useSaveCallerUserProfile } from '../hooks/useSaveCallerUserProfile';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';

export default function ProfileSetupModal() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading, isFetched } = useGetCallerUserProfile();
  const { mutateAsync: saveProfile, isPending } = useSaveCallerUserProfile();
  const [name, setName] = useState('');

  const isAuthenticated = !!identity;
  const showModal = isAuthenticated && !isLoading && isFetched && userProfile === null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await saveProfile({ name: name.trim() });
      toast.success('Profil gespeichert!');
    } catch (error) {
      toast.error('Fehler beim Speichern des Profils.');
    }
  };

  return (
    <Dialog open={showModal}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Willkommen!</DialogTitle>
          <DialogDescription>
            Bitte gib deinen Namen ein, um dein Profil einzurichten.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="py-4">
            <Label htmlFor="profile-name">Name</Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dein Name"
              className="mt-2"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending || !name.trim()}>
              {isPending ? 'Speichern…' : 'Speichern'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
