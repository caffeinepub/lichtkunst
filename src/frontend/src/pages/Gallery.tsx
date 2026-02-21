import { useGetAllArtworks } from '../hooks/useGetAllArtworks';
import ArtworkCard from '../components/ArtworkCard';
import { Loader2 } from 'lucide-react';

export default function Gallery() {
  const { data: artworks, isLoading, error } = useGetAllArtworks();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/assets/generated/hero-light-art.dim_1920x1080.png"
            alt="Light Art"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background" />
        </div>
        <div className="relative z-10 flex h-full items-center justify-center px-4">
          <div className="text-center">
            <h1 className="mb-4 font-serif text-5xl font-bold tracking-tight text-foreground md:text-7xl">
              Lichtkunst
            </h1>
            <div className="mx-auto max-w-2xl">
              <p className="inline-block rounded-lg bg-black/70 px-6 py-3 text-lg text-gray-100 backdrop-blur-sm md:text-xl">
                Exploring the intersection of light, space, and digital art through NFT-backed creations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Walter Russell Quote Section */}
      <section className="border-b border-border/40 bg-gradient-to-b from-card/50 to-background py-16">
        <div className="container mx-auto px-4">
          <blockquote className="mx-auto max-w-4xl text-center">
            <p className="mb-6 font-serif text-2xl italic leading-relaxed text-foreground md:text-3xl">
              "Perfection of rhythm, balanced perfection of rhythm. Everything in Nature is expressed by rhythmic waves of light. Every thought and action is a light-wave of thought and action."
            </p>
            <footer className="text-base text-muted-foreground md:text-lg">
              — Walter Russell
            </footer>
          </blockquote>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-3 font-serif text-3xl font-bold md:text-4xl">Gallery</h2>
          <p className="text-muted-foreground">Each piece is a unique NFT on the Internet Computer</p>
        </div>

        {isLoading && (
          <div className="flex min-h-[400px] items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="flex min-h-[400px] items-center justify-center">
            <p className="text-destructive">Failed to load artworks. Please try again later.</p>
          </div>
        )}

        {artworks && artworks.length === 0 && (
          <div className="flex min-h-[400px] items-center justify-center">
            <p className="text-muted-foreground">No artworks yet. Check back soon!</p>
          </div>
        )}

        {artworks && artworks.length > 0 && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {artworks.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
