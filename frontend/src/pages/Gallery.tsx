import React from 'react';
import { useGetAllCollections } from '../hooks/useGetAllCollections';
import { useGetAllNFTs } from '../hooks/useGetAllNFTs';
import { useActor } from '../hooks/useActor';
import NFTCollectionsSection from '../components/NFTCollectionsSection';
import NFTExplanation from '../components/NFTExplanation';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';

const UZ_QUOTE = {
  text: 'Das Licht ist die einzige Realität. Alles andere ist nur eine Erscheinung des Lichts.',
  attribution: 'Walter Russell',
};

export default function Gallery() {
  const { isFetching: actorFetching } = useActor();
  const { isLoading: collectionsLoading, error: collectionsError, refetch: refetchCollections } = useGetAllCollections();
  const { isLoading: nftsLoading, error: nftsError, refetch: refetchNFTs } = useGetAllNFTs();

  const isLoading = actorFetching || collectionsLoading || nftsLoading;
  const hasError = collectionsError || nftsError;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner — quarter-height (half of previous 40vh) */}
      <section className="relative h-[20vh] min-h-[110px] max-h-[210px] overflow-hidden">
        <img
          src="/assets/generated/hero-light-art.dim_1920x1080.png"
          alt="Lichtkunst von Istvan Seidel"
          className="w-full h-full object-cover object-center"
        />
        {/* Subtle gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30" />
      </section>

      {/* Single static UZ quote */}
      <section className="py-10 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <blockquote className="font-serif text-xl font-light text-muted-foreground italic leading-relaxed">
            &bdquo;{UZ_QUOTE.text}&ldquo;
          </blockquote>
          <p className="mt-3 font-sans text-sm text-muted-foreground/60">
            — {UZ_QUOTE.attribution}
            <span className="ml-1 not-italic">(Geheimnis des Lichtes)</span>
          </p>
        </div>
      </section>

      {/* Error State */}
      {hasError && !isLoading && (
        <section className="py-8 px-4">
          <div className="max-w-md mx-auto text-center space-y-4">
            <AlertTriangle className="h-10 w-10 text-destructive mx-auto" />
            <p className="text-muted-foreground font-sans text-sm">
              Fehler beim Laden der Inhalte. Bitte versuchen Sie es erneut.
            </p>
            <Button
              variant="outline"
              onClick={() => { refetchCollections(); refetchNFTs(); }}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Erneut versuchen
            </Button>
          </div>
        </section>
      )}

      {/* Loading skeletons for collections */}
      {isLoading && (
        <section className="py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-lg" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* NFT Collections Section */}
      {!isLoading && (
        <>
          <NFTCollectionsSection />
          <NFTExplanation />
        </>
      )}
    </div>
  );
}
