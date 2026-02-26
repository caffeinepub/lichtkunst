import { useState } from 'react';
import NFTExplanation from '../components/NFTExplanation';
import NFTCollectionsSection from '../components/NFTCollectionsSection';

const WALTER_RUSSELL_QUOTES = [
  {
    text: '„Ich bin das Licht; Ich allein BIN. Was Ich bin, bist du. Du bist das Licht. Du bist Eins mit Mir."',
  },
  {
    text: '„Das Universum ist ein Universum des Lichtes. Gott ist Licht. Der Mensch ist Licht."',
  },
  {
    text: '„Alles, was existiert, ist Licht in Bewegung. Licht ist die einzige Substanz des Universums."',
  },
  {
    text: '„Wissen ist das einzige Licht. Unwissenheit ist die einzige Dunkelheit."',
  },
  {
    text: '„Der Geist des Menschen ist das Licht Gottes, das durch den Menschen leuchtet."',
  },
  {
    text: '„Liebe ist das Fundament des Universums. Ohne Liebe gibt es keine Schöpfung."',
  },
  {
    text: '„Jeder Mensch ist ein Schöpfer, denn jeder Mensch ist ein Teil des Schöpfers."',
  },
  {
    text: '„Das Licht des Wissens ist das einzige Licht, das die Dunkelheit der Unwissenheit erhellen kann."',
  },
];

function getRandomQuote() {
  return WALTER_RUSSELL_QUOTES[Math.floor(Math.random() * WALTER_RUSSELL_QUOTES.length)];
}

export default function Gallery() {
  const [quote] = useState(() => getRandomQuote());

  return (
    <div className="min-h-screen">
      {/* Hero Banner - clean image, no text overlay */}
      <section className="relative h-24 w-full overflow-hidden md:h-28">
        <div className="absolute inset-0">
          <img
            src="/assets/generated/hero-light-art.dim_1920x1080.png"
            alt="Istvan Seidel Lichtkunst"
            className="h-full w-full object-cover object-center opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/40 to-background" />
        </div>
      </section>

      {/* Walter Russell Quote – directly above NFT Collections */}
      <div className="container mx-auto px-4 pb-2 pt-6 text-center">
        <blockquote className="mx-auto max-w-2xl">
          <p
            className="font-serif italic text-foreground/50 tracking-wide"
            style={{ fontWeight: 100, fontSize: '0.9rem', lineHeight: '1.7' }}
          >
            {quote.text}
          </p>
          <footer className="mt-2 text-[10px] font-thin tracking-widest text-muted-foreground/50 uppercase">
            — Walter Russell · Geheimnis des Lichtes
          </footer>
        </blockquote>
      </div>

      {/* NFT Collections Section */}
      <NFTCollectionsSection />

      {/* NFT Explanation Section */}
      <NFTExplanation />
    </div>
  );
}
