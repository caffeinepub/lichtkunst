import { Sparkles } from 'lucide-react';
import NFTCollectionCard from './NFTCollectionCard';

// Static NFT collection data with exact Getgems marketplace links as provided by the artist
const NFT_COLLECTIONS = [
  {
    id: 'lichtei',
    name: 'Lichtei',
    description: 'Leuchtende Lichteier – eine Serie abstrakter Lichtkunst, die das Ei als Symbol des Lebens und der Schöpfung interpretiert.',
    imageUrl: '/assets/generated/lichtei-preview.dim_800x600.png',
    tradeUrl: 'https://getgems.io/lichtei',
  },
  {
    id: 'wheeloftime',
    name: 'Wheel of Time',
    description: 'Das Rad der Zeit – eine mystische Lichtserie, die den ewigen Kreislauf von Zeit und Raum in Licht und Farbe darstellt.',
    imageUrl: '/assets/generated/wheeloftime-preview.dim_800x600.png',
    tradeUrl: 'https://getgems.io/wheeloftime',
  },
  {
    id: 'colourshades',
    name: 'Colourshades',
    description: 'Farbschattierungen – eine Erkundung der unendlichen Nuancen des Lichts, die Farbe als lebendige Energie zeigt.',
    imageUrl: '/assets/generated/colourshades-preview.dim_800x600.png',
    tradeUrl: 'https://getgems.io/colourshades',
  },
  {
    id: 'schieferlichtgrafik',
    name: 'Schieferlichtgrafik',
    description: 'Lichtgrafiken auf Schiefer – eine einzigartige Verbindung von natürlichem Stein und digitaler Lichtkunst.',
    imageUrl: '/assets/generated/schieferlichtgrafik-preview.dim_800x600.png',
    tradeUrl: 'https://getgems.io/collection/EQCgrHXOmAryUksLLtlh5dsXyT_h2DF6vLiEUiwsj05KFjJM',
  },
  {
    id: 'lightseekers',
    name: 'Light Seekers',
    description: 'Lichtsucher – Wesen aus reinem Licht auf der Suche nach dem Ursprung aller Dinge. Eine spirituelle Lichtserie.',
    imageUrl: '/assets/generated/light-seekers-preview.dim_800x600.png',
    tradeUrl: 'https://getgems.io/collection/EQA1W-YI6IGmi_94KoIgwgD79i_bhz0Uot-Z1y5W8fBGuIAz',
  },
  {
    id: 'panelpaintings',
    name: 'Panel Paintings',
    description: 'Tafelbilder aus Licht – klassische Bildkomposition neu interpretiert durch digitale Lichtmalerei.',
    imageUrl: '/assets/generated/panel-paintings-preview.dim_800x600.png',
    tradeUrl: 'https://getgems.io/collection/EQA_bfpwKniQOAATWojdfIDk9X7_mCW_Stpzt_1kDSF6UDYV',
  },
  {
    id: 'firedance',
    name: 'Flammenbilder Fire Dance',
    description: 'Feuerbilder – der Tanz der Flammen als Lichtkunst eingefangen. Eine feurige Serie voller Energie und Bewegung.',
    imageUrl: '/assets/generated/fire-dance-preview.dim_800x600.png',
    tradeUrl: 'https://getgems.io/collection/EQA8b4VisUmrk2tiumRI-wmlM3QhahoGeGNqSYzrO6s9O2Vf',
  },
];

export default function NFTCollectionsSection() {
  return (
    <section className="border-y border-border/40 bg-gradient-to-b from-background via-muted/20 to-background py-6">
      <div className="container mx-auto px-4">
        <div className="mb-6 text-center">
          <div className="mb-1 flex items-center justify-center gap-2">
            <Sparkles className="h-2.5 w-2.5 text-primary/50" />
            <h2
              className="font-serif tracking-[0.25em] text-foreground/60 md:text-lg"
              style={{ fontWeight: 100, fontSize: '0.95rem', letterSpacing: '0.28em' }}
            >
              NFT Kollektionen
            </h2>
            <Sparkles className="h-2.5 w-2.5 text-primary/50" />
          </div>
          <p className="mx-auto max-w-xl text-[11px] font-thin tracking-wide text-muted-foreground/70">
            Entdecken Sie NFT Kunstwerke von Istvan Seidel auf der TON Blockchain.
            Jede Kollektion ist auf Getgems verfügbar und repräsentiert einzigartige Lichtkunst-Serien.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {NFT_COLLECTIONS.map((collection) => (
            <div key={collection.id} className="transform transition-all duration-300">
              <NFTCollectionCard
                title={collection.name}
                description={collection.description}
                imageUrl={null}
                manualImageUrl={collection.imageUrl}
                tradeUrl={collection.tradeUrl}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <p className="text-[11px] font-thin text-muted-foreground/70">
            Handelbar auf{' '}
            <a
              href="https://getgems.io"
              target="_blank"
              rel="noopener noreferrer"
              className="font-light text-primary hover:underline"
            >
              Getgems
            </a>
            {' '}· TON Blockchain
          </p>
        </div>
      </div>
    </section>
  );
}
