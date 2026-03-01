import { useState } from 'react';
import { useIsCallerAdminWithTimeout } from '../hooks/useIsCallerAdminWithTimeout';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import AdminCollectionForm from '../components/AdminCollectionForm';
import AdminCollectionList from '../components/AdminCollectionList';
import AdminNFTForm from '../components/AdminNFTForm';
import AdminNFTList from '../components/AdminNFTList';
import PrincipalDisplay from '../components/PrincipalDisplay';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Loader2, AlertTriangle, RefreshCw, Clock, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { NFTItem } from '../backend';

export default function AdminDashboard() {
  const { phase, isAdmin, retry } = useIsCallerAdminWithTimeout(90000);
  const { identity } = useInternetIdentity();
  const [editingNFT, setEditingNFT] = useState<NFTItem | null>(null);

  const callerPrincipal = identity?.getPrincipal().toString() ?? '';

  const handleEditNFT = (nft: NFTItem) => {
    setEditingNFT(nft);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNFTFormDone = () => {
    setEditingNFT(null);
  };

  // ── Loading: identity still initializing ──────────────────────────────────
  if (phase === 'initializing') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground font-sans">Initialisierung…</p>
        </div>
      </div>
    );
  }

  // ── Loading: waiting for actor to connect ─────────────────────────────────
  if (phase === 'waiting-for-actor') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground font-sans">Verbindung wird hergestellt…</p>
          <p className="text-xs text-muted-foreground/60 font-sans">
            Verbindung zum ICP-Netzwerk wird aufgebaut
          </p>
        </div>
      </div>
    );
  }

  // ── Loading: backend admin check in progress ──────────────────────────────
  if (phase === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Shield className="w-10 h-10 text-primary mx-auto animate-pulse" />
          <p className="text-muted-foreground font-sans">Überprüfe Admin-Berechtigung…</p>
          <p className="text-xs text-muted-foreground/60 font-sans">
            Backend-Anfrage läuft, bitte warten
          </p>
        </div>
      </div>
    );
  }

  // ── Error: timeout waiting for backend ────────────────────────────────────
  if (phase === 'timeout') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <Clock className="w-12 h-12 text-amber-500 mx-auto mb-2" />
            <CardTitle className="font-serif font-light">Zeitüberschreitung</CardTitle>
            <CardDescription>
              Die Verbindung zum ICP-Netzwerk hat zu lange gedauert. Bitte versuche es erneut.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            {callerPrincipal && (
              <div className="w-full p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1 font-sans">Dein Principal:</p>
                <PrincipalDisplay principal={callerPrincipal} shorten={false} />
              </div>
            )}
            <Button onClick={retry} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Erneut versuchen
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Error: backend call failed ────────────────────────────────────────────
  if (phase === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <WifiOff className="w-12 h-12 text-destructive mx-auto mb-2" />
            <CardTitle className="font-serif font-light">Verbindungsfehler</CardTitle>
            <CardDescription>
              Die Admin-Prüfung ist fehlgeschlagen. Bitte überprüfe deine Verbindung und versuche
              es erneut.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            {callerPrincipal && (
              <div className="w-full p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1 font-sans">Dein Principal:</p>
                <PrincipalDisplay principal={callerPrincipal} shorten={false} />
              </div>
            )}
            <Button onClick={retry} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Erneut versuchen
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Access denied: backend confirmed not-admin ────────────────────────────
  if (phase === 'denied' || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-2" />
            <CardTitle className="font-serif font-light">Zugriff verweigert</CardTitle>
            <CardDescription>
              Admin-Zugriff wurde für diesen Principal verweigert. Nur der autorisierte
              Admin-Principal kann auf diesen Bereich zugreifen.
            </CardDescription>
          </CardHeader>
          {callerPrincipal && (
            <CardContent className="flex flex-col items-center gap-3">
              <div className="w-full p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1 font-sans">
                  Zugriff verweigert für Principal:
                </p>
                <PrincipalDisplay principal={callerPrincipal} shorten={false} />
              </div>
              <p className="text-xs text-muted-foreground/70 font-sans text-center">
                Kopiere deinen Principal und teile ihn mit dem Administrator, um Zugriff zu
                erhalten.
              </p>
            </CardContent>
          )}
        </Card>
      </div>
    );
  }

  // ── phase === 'confirmed' && isAdmin — render full dashboard ──────────────
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="w-7 h-7 text-primary" />
        <h1 className="text-3xl font-serif font-light tracking-wide">Admin Dashboard</h1>
      </div>

      <Tabs defaultValue="collections">
        <TabsList className="mb-6">
          <TabsTrigger value="collections">Kollektionen</TabsTrigger>
          <TabsTrigger value="nfts">NFTs</TabsTrigger>
        </TabsList>

        <TabsContent value="collections" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h2 className="font-serif text-xl font-light text-foreground mb-4">
                Neue Kollektion
              </h2>
              <AdminCollectionForm />
            </div>
            <div>
              <h2 className="font-serif text-xl font-light text-foreground mb-4">
                Vorhandene Kollektionen
              </h2>
              <AdminCollectionList />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="nfts" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h2 className="font-serif text-xl font-light text-foreground mb-4">
                {editingNFT ? 'NFT bearbeiten' : 'Neues NFT'}
              </h2>
              <AdminNFTForm
                nft={editingNFT ?? undefined}
                onSuccess={handleNFTFormDone}
                onCancel={editingNFT ? handleNFTFormDone : undefined}
              />
            </div>
            <div>
              <h2 className="font-serif text-xl font-light text-foreground mb-4">
                Vorhandene NFTs
              </h2>
              <AdminNFTList onEdit={handleEditNFT} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
