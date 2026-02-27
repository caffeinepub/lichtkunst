import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdminWithTimeout } from '../hooks/useIsCallerAdminWithTimeout';
import { useActor } from '../hooks/useActor';
import AdminCollectionList from '../components/AdminCollectionList';
import AdminNFTList from '../components/AdminNFTList';
import AdminCollectionForm from '../components/AdminCollectionForm';
import AdminNFTForm from '../components/AdminNFTForm';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShieldCheck, RefreshCw, LogIn, Loader2, Clock, AlertTriangle } from 'lucide-react';
import type { NFTItem } from '../backend';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { identity, isInitializing, login } = useInternetIdentity();
  const { isFetching: actorFetching } = useActor();
  const { isAdmin, isLoading, timedOut, error, retry } = useIsCallerAdminWithTimeout(20000);

  const [editingNFT, setEditingNFT] = useState<NFTItem | null>(null);
  const [showNFTForm, setShowNFTForm] = useState(false);

  const isAuthenticated = !!identity;

  const handleEditNFT = (nft: NFTItem) => {
    setEditingNFT(nft);
    setShowNFTForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNFTFormDone = () => {
    setEditingNFT(null);
    setShowNFTForm(false);
  };

  // Still initializing identity or actor
  if (isInitializing || (isAuthenticated && actorFetching && isLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground font-sans">
            {isInitializing ? 'Initialisierung…' : 'Verbindung wird hergestellt…'}
          </p>
          <p className="text-muted-foreground/60 font-sans text-xs">
            Dies kann in der Produktionsumgebung einige Sekunden dauern.
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6 max-w-sm mx-auto px-4">
          <ShieldCheck className="h-16 w-16 text-muted-foreground mx-auto" />
          <div>
            <h2 className="font-serif text-2xl font-light text-foreground mb-2">
              Anmeldung erforderlich
            </h2>
            <p className="text-muted-foreground font-sans text-sm">
              Bitte melden Sie sich an, um auf den Admin-Bereich zuzugreifen.
            </p>
          </div>
          <Button onClick={() => login()} className="gap-2">
            <LogIn className="h-4 w-4" />
            Anmelden
          </Button>
        </div>
      </div>
    );
  }

  // Loading / checking admin status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground font-sans">Berechtigungen werden geprüft…</p>
          <p className="text-muted-foreground/60 font-sans text-xs">
            Dies kann in der Produktionsumgebung einige Sekunden dauern.
          </p>
        </div>
      </div>
    );
  }

  // Timed out
  if (timedOut && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6 max-w-sm mx-auto px-4">
          <Clock className="h-16 w-16 text-warning mx-auto" />
          <div>
            <h2 className="font-serif text-2xl font-light text-foreground mb-2">
              Zeitüberschreitung
            </h2>
            <p className="text-muted-foreground font-sans text-sm">
              Die Verbindung zum Backend hat zu lange gedauert. Bitte versuchen Sie es erneut.
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <Button onClick={retry} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Erneut versuchen
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()} className="gap-2">
              Seite neu laden
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6 max-w-sm mx-auto px-4">
          <AlertTriangle className="h-16 w-16 text-destructive mx-auto" />
          <div>
            <h2 className="font-serif text-2xl font-light text-foreground mb-2">
              Verbindungsfehler
            </h2>
            <p className="text-muted-foreground font-sans text-sm">
              {error.message || 'Verbindung zum Backend fehlgeschlagen.'}
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <Button onClick={retry} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Erneut versuchen
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()} className="gap-2">
              Seite neu laden
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6 max-w-sm mx-auto px-4">
          <ShieldCheck className="h-16 w-16 text-destructive mx-auto" />
          <div>
            <h2 className="font-serif text-2xl font-light text-foreground mb-2">
              Zugriff verweigert
            </h2>
            <p className="text-muted-foreground font-sans text-sm">
              Sie haben keine Administratorrechte für diesen Bereich.
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <Button onClick={retry} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Erneut prüfen
            </Button>
            <Button variant="outline" onClick={() => navigate({ to: '/' })} className="gap-2">
              Zur Startseite
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Admin granted — show dashboard
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center gap-3 mb-8">
          <ShieldCheck className="h-8 w-8 text-primary" />
          <div>
            <h1 className="font-serif text-3xl font-light text-foreground">Admin-Dashboard</h1>
            <p className="text-muted-foreground font-sans text-sm">
              Verwaltung von Kollektionen und NFTs
            </p>
          </div>
        </div>

        <Tabs defaultValue="collections" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
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
                  onCancel={showNFTForm && editingNFT ? handleNFTFormDone : undefined}
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
    </div>
  );
}
