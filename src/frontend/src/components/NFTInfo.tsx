import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Calendar, Hash } from 'lucide-react';
import type { LightArtPiece } from '../backend';

interface NFTInfoProps {
  artwork: LightArtPiece;
}

export default function NFTInfo({ artwork }: NFTInfoProps) {
  const creationDate = new Date(Number(artwork.metadata.creationDate) / 1000000);

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle className="font-serif">NFT Information</CardTitle>
        </div>
        <CardDescription>This artwork is minted as an NFT on the Internet Computer</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <Hash className="mt-1 h-4 w-4 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm font-medium">Token ID</p>
            <p className="text-sm text-muted-foreground break-all">{artwork.id}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Calendar className="mt-1 h-4 w-4 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm font-medium">Minted On</p>
            <p className="text-sm text-muted-foreground">{creationDate.toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-primary/50 text-primary">
            <Sparkles className="mr-1 h-3 w-3" />
            Minted on ICP
          </Badge>
        </div>

        <div className="rounded-lg bg-accent/20 p-4">
          <p className="text-sm text-muted-foreground">
            This NFT is stored on the Internet Computer blockchain, ensuring permanent ownership and authenticity.
            Trading functionality coming soon.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
