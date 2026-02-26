import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Zap, Shield, Database, Coins, CheckCircle2 } from 'lucide-react';

export default function NFTExplanation() {
  return (
    <section className="border-b border-border/40 bg-gradient-to-b from-background via-card/30 to-background py-10 pt-6">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <Sparkles className="h-3 w-3 text-primary/60" />
            <h2 className="font-serif text-xl font-thin tracking-[0.15em] text-foreground/80 md:text-2xl" style={{ fontWeight: 100 }}>
              Wie funktioniert die NFT-Technologie?
            </h2>
            <Sparkles className="h-3 w-3 text-primary/60" />
          </div>
          <p className="mx-auto max-w-2xl text-[11px] font-thin tracking-wide text-muted-foreground/70">
            Jedes hochgeladene Kunstwerk wird automatisch als NFT auf dem Internet Computer Protocol (ICP) geprägt
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Was ist ein NFT? */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="font-serif">Was ist ein NFT?</CardTitle>
              <CardDescription>Non-Fungible Token</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Ein NFT ist ein einzigartiges digitales Zertifikat, das auf einer Blockchain gespeichert wird
                und die Echtheit und das Eigentum eines digitalen Kunstwerks beweist.
              </p>
              <p>
                Jedes NFT ist unverwechselbar und kann nicht kopiert oder gefälscht werden – wie ein digitaler
                Echtheitsstempel.
              </p>
            </CardContent>
          </Card>

          {/* Automatisches Minting */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="font-serif">Automatisches Minting</CardTitle>
              <CardDescription>Sofort auf der Blockchain</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Sobald ein Kunstwerk hochgeladen wird, wird es automatisch als NFT auf dem Internet Computer
                Protocol (ICP) geprägt – ohne manuelle Schritte.
              </p>
              <p>
                Der gesamte Prozess läuft im Hintergrund ab und dauert nur wenige Sekunden.
              </p>
            </CardContent>
          </Card>

          {/* ICP Architektur */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="font-serif">ICP Architektur</CardTitle>
              <CardDescription>Internet Computer Protocol</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Das Internet Computer Protocol ist eine dezentralisierte Blockchain-Plattform, die
                vollständige Anwendungen direkt auf der Blockchain ausführen kann.
              </p>
              <p>
                Im Gegensatz zu anderen Blockchains speichert ICP sowohl den Code als auch die Daten
                vollständig dezentralisiert.
              </p>
            </CardContent>
          </Card>

          {/* Kosten */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Coins className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="font-serif">Minimale Kosten</CardTitle>
              <CardDescription>0.0001 – 0.01 ICP pro Werk</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Das Minting auf ICP ist extrem kostengünstig. Die Transaktionsgebühren betragen nur
                einen Bruchteil eines Cents – deutlich günstiger als auf Ethereum oder Solana.
              </p>
              <p>
                Dies ermöglicht es, auch kleinere Kunstwerke wirtschaftlich als NFTs zu prägen.
              </p>
            </CardContent>
          </Card>

          {/* Vorteile */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="font-serif">Vorteile für Sammler</CardTitle>
              <CardDescription>Echtes digitales Eigentum</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Als NFT-Besitzer haben Sie nachweisbares Eigentum an einem einzigartigen digitalen
                Kunstwerk von Istvan Seidel.
              </p>
              <p>
                Die Echtheit und Provenienz jedes Werks ist dauerhaft und unveränderlich auf der
                Blockchain dokumentiert.
              </p>
            </CardContent>
          </Card>

          {/* Permanente Speicherung */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="font-serif">Permanente Speicherung</CardTitle>
              <CardDescription>Für die Ewigkeit gesichert</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Alle Kunstwerke und ihre NFT-Metadaten werden dauerhaft auf dem Internet Computer
                gespeichert – ohne zentrale Server, die abgeschaltet werden könnten.
              </p>
              <p>
                Ihre digitale Kunstsammlung bleibt für immer erhalten und zugänglich.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
