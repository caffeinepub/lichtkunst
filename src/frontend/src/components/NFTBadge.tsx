import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import type { LightArtPiece } from '../backend';

interface NFTBadgeProps {
  artwork: LightArtPiece;
}

export default function NFTBadge({ artwork }: NFTBadgeProps) {
  return (
    <Badge className="bg-primary/90 text-primary-foreground backdrop-blur">
      <Sparkles className="mr-1 h-3 w-3" />
      NFT
    </Badge>
  );
}
