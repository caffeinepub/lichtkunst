import { useState } from 'react';
import { useIsCallerAdminWithTimeout } from '../hooks/useIsCallerAdminWithTimeout';
import AdminCollectionForm from '../components/AdminCollectionForm';
import AdminCollectionList from '../components/AdminCollectionList';
import AdminNFTForm from '../components/AdminNFTForm';
import AdminNFTList from '../components/AdminNFTList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Loader2, AlertTriangle, RefreshCw, Clock, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { NFTItem } from '../backend';

export default function AdminDashboard() {
  const { phase, isAdmin, retry } = useIsCallerAdminWithTimeout(90000);
  const [editingNFT, setEditingNFT] = useState<NFTItem | null>(null);

  const handleEditNFT = (nft: NFTItem) => {
    setEditingNFT(nft);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNFTFormDone = () => {
    setEditingNFT(null);
  };

  // Loading states
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

  if (phase === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Shield className="w-10 h-10 text-primary mx-auto animate-pulse" />
          <p className="text-muted-foreground font-sans">Berechtigungen werden geprüft…</p>
        </div>
      </div>
    );
  }

  if (phase === 'timed-out') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md px-4">
          <Clock className="w-12 h-12 text-amber-500 mx-auto" />
          <div>
            <h2 className="text-xl font-serif font-semibold mb-2">Zeitüberschreitung</h2>
            <p className="text-muted-foreground font-sans text-sm">
              Die Verbindung zum ICP-Netzwerk hat zu lange gedauert. Bitte versuche es erneut.
            </p>
          </div>
          <Button onClick={retry} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Erneut versuchen
          </Button>
        </div>
      </div>
    );
  }

  if (phase === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md px-4">
          <WifiOff className="w-12 h-12 text-destructive mx-auto" />
          <div>
            <h2 className="text-xl font-serif font-semibold mb-2">Verbindungsfehler</h2>
            <p className="text-muted-foreground font-sans text-sm">
              Die Admin-Prüfung ist fehlgeschlagen. Bitte überprüfe deine Verbindung und versuche
              es erneut.
            </p>
          </div>
          <Button onClick={retry} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Erneut versuchen
          </Button>
        </div>
      </div>
    );
  }

  if (phase === 'not-admin' || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md px-4">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="text-xl font-serif font-semibold">Zugriff verweigert</h2>
          <p className="text-muted-foreground font-sans text-sm">
            Du hast keine Admin-Berechtigung für diesen Bereich.
          </p>
        </div>
      </div>
    );
  }

  // phase === 'success' && isAdmin
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
