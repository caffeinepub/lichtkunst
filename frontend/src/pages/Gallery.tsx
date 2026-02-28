import { Link } from '@tanstack/react-router';
import NFTCollectionsSection from '../components/NFTCollectionsSection';
import NFTExplanation from '../components/NFTExplanation';

export default function Gallery() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Banner */}
      <section className="relative h-[20vh] min-h-[140px] overflow-hidden">
        <img
          src="/assets/generated/hero-light-art.dim_1920x1080.png"
          alt="Lichtkunst von Istvan Seidel"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-background/80" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-serif text-3xl md:text-5xl font-thin tracking-widest text-white drop-shadow-lg uppercase">
            Galerie
          </h1>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-10 px-4 text-center max-w-2xl mx-auto">
        <blockquote className="relative">
          <span className="text-4xl text-primary/30 font-serif leading-none select-none">"</span>
          <p className="font-serif text-lg md:text-xl italic text-foreground/60 font-thin leading-relaxed -mt-4">
            Das Geheimnis des Lichtes ist das Geheimnis des Lebens selbst.
          </p>
          <footer className="mt-3 text-sm font-light text-muted-foreground tracking-wide font-sans">
            — Walter Russell
          </footer>
        </blockquote>
      </section>

      {/* NFT Collections */}
      <NFTCollectionsSection />

      {/* NFT Explanation */}
      <NFTExplanation />

      {/* CTA */}
      <section className="py-12 px-4 text-center">
        <p className="text-muted-foreground mb-4 font-light">
          Entdecke die digitale Kunstwelt von Istvan Seidel
        </p>
        <Link
          to="/nft-galerie"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
        >
          NFT Galerie öffnen
        </Link>
      </section>
    </main>
  );
}
