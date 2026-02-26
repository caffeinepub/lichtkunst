import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface NFTCollectionCardProps {
  title: string;
  description: string;
  imageUrl: string | null;
  manualImageUrl?: string;
  tradeUrl: string;
}

export default function NFTCollectionCard({ 
  title, 
  description, 
  imageUrl, 
  manualImageUrl,
  tradeUrl,
}: NFTCollectionCardProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Prioritize manual image URL over automatic backend loading
  const displayImageUrl = manualImageUrl || imageUrl;

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  return (
    <a
      href={tradeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
      aria-label={`${title} NFT Kollektion kaufen und handeln`}
    >
      <Card className="group cursor-pointer overflow-hidden border-border/50 bg-card/50 backdrop-blur transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/20">
        <div className="relative h-24 overflow-hidden bg-accent/20">
          {displayImageUrl && !imageError ? (
            <>
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Skeleton className="h-full w-full" />
                </div>
              )}
              <img
                src={displayImageUrl}
                alt={title}
                className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-110 ${
                  imageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-accent/20 to-secondary/10">
              <div className="text-center">
                <div className="text-2xl">🎨</div>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute right-2 top-2 rounded-full bg-primary/90 p-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <ExternalLink className="h-3 w-3 text-primary-foreground" />
          </div>
        </div>
        <CardContent className="p-3">
          <h3 className="font-serif text-sm font-thin tracking-wide line-clamp-1 mb-0.5">{title}</h3>
          <p className="text-[10px] font-thin text-muted-foreground line-clamp-2 leading-tight">{description}</p>
          <div className="mt-2 flex items-center gap-1 text-[10px] font-light text-primary">
            <span>Kaufen und Handeln</span>
            <ExternalLink className="h-2.5 w-2.5" />
          </div>
        </CardContent>
      </Card>
    </a>
  );
}
