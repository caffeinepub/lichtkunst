import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import NFTBadge from './NFTBadge';
import type { LightArtPiece } from '../backend';

interface ArtworkCardProps {
  artwork: LightArtPiece;
}

export default function ArtworkCard({ artwork }: ArtworkCardProps) {
  const navigate = useNavigate();
  const imageUrl = artwork.image.getDirectURL();

  return (
    <Card
      className="group cursor-pointer overflow-hidden border-border/50 bg-card/50 backdrop-blur transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/20"
      onClick={() => navigate({ to: '/artwork/$id', params: { id: artwork.id } })}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-accent/20">
        <img
          src={imageUrl}
          alt={artwork.metadata.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute right-3 top-3">
          <NFTBadge artwork={artwork} />
        </div>
      </div>
      <CardContent className="p-6">
        <h3 className="mb-2 font-serif text-xl font-semibold line-clamp-1">{artwork.metadata.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{artwork.metadata.description}</p>
      </CardContent>
    </Card>
  );
}
