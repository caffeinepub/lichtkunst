import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetArtwork } from '../hooks/useGetArtwork';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import NFTInfo from '../components/NFTInfo';

export default function ArtworkDetail() {
  const { id } = useParams({ from: '/artwork/$id' });
  const navigate = useNavigate();
  const { data: artwork, isLoading, error } = useGetArtwork(id);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Gallery
        </Button>
        <div className="flex min-h-[40vh] items-center justify-center">
          <p className="text-destructive">Artwork not found</p>
        </div>
      </div>
    );
  }

  const imageUrl = artwork.image.getDirectURL();

  return (
    <div className="container mx-auto px-4 py-16">
      <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Gallery
      </Button>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Image Section */}
        <div className="relative overflow-hidden rounded-2xl bg-accent/20">
          <img
            src={imageUrl}
            alt={artwork.metadata.title}
            className="h-full w-full object-contain"
          />
        </div>

        {/* Info Section */}
        <div className="flex flex-col justify-center space-y-8">
          <div>
            <h1 className="mb-4 font-serif text-4xl font-bold md:text-5xl">{artwork.metadata.title}</h1>
            <p className="text-lg leading-relaxed text-muted-foreground">{artwork.metadata.description}</p>
          </div>

          <NFTInfo artwork={artwork} />
        </div>
      </div>
    </div>
  );
}
