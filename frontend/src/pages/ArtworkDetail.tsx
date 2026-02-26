import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

// The artwork detail page is no longer functional since the old artwork
// backend has been replaced by the NFT system.
export default function ArtworkDetail() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-16">
      <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Zurück zur Galerie
      </Button>
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-muted-foreground">Kunstwerk nicht gefunden.</p>
      </div>
    </div>
  );
}
