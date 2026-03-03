import { useState } from "react";
import { useIsCallerAdminWithTimeout } from "../hooks/useIsCallerAdminWithTimeout";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, RefreshCw, Loader2, AlertTriangle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminCollectionForm from "../components/AdminCollectionForm";
import AdminCollectionList from "../components/AdminCollectionList";
import AdminNFTForm from "../components/AdminNFTForm";
import AdminNFTList from "../components/AdminNFTList";
import PrincipalDisplay from "../components/PrincipalDisplay";
import type { NFTItem } from "../backend";

export default function AdminDashboard() {
  const { phase, isAdmin, retry, errorMessage } = useIsCallerAdminWithTimeout();
  const { identity } = useInternetIdentity();
  const principalId = identity?.getPrincipal().toString();
  const [editingNFT, setEditingNFT] = useState<NFTItem | null>(null);

  const handleEditNFT = (nft: NFTItem) => {
    setEditingNFT(nft);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNFTFormDone = () => {
    setEditingNFT(null);
  };

  // Initializing identity
  if (phase === "initializing") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Identität wird geladen…</p>
        </div>
      </div>
    );
  }

  // Waiting for actor
  if (phase === "waiting-for-actor") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Verbindung zum Backend wird hergestellt…</p>
        </div>
      </div>
    );
  }

  // Checking admin status
  if (phase === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Admin-Status wird geprüft…</p>
        </div>
      </div>
    );
  }

  // Timeout
  if (phase === "timeout") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-md">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto" />
          <h2 className="text-xl font-semibold">Zeitüberschreitung</h2>
          <p className="text-muted-foreground">
            Die Admin-Prüfung hat zu lange gedauert. Bitte versuche es erneut.
          </p>
          {principalId && (
            <div className="text-sm text-muted-foreground">
              <p className="mb-1">Dein Principal:</p>
              <PrincipalDisplay principal={principalId} shorten />
            </div>
          )}
          <Button onClick={retry} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Erneut versuchen
          </Button>
        </div>
      </div>
    );
  }

  // Error
  if (phase === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-md">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
          <h2 className="text-xl font-semibold">Fehler bei der Admin-Prüfung</h2>
          <p className="text-muted-foreground">
            {errorMessage ?? "Ein unbekannter Fehler ist aufgetreten."}
          </p>
          {principalId && (
            <div className="text-sm text-muted-foreground">
              <p className="mb-1">Dein Principal:</p>
              <PrincipalDisplay principal={principalId} shorten />
            </div>
          )}
          <Button onClick={retry} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Erneut versuchen
          </Button>
        </div>
      </div>
    );
  }

  // Not authenticated or denied
  if (!identity || phase === "denied" || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-md">
          <Lock className="h-12 w-12 text-muted-foreground mx-auto" />
          <h2 className="text-xl font-semibold">Zugriff verweigert</h2>
          <p className="text-muted-foreground">
            {!identity
              ? "Bitte melde dich an, um auf den Admin-Bereich zuzugreifen."
              : "Admin-Zugriff wurde für diesen Principal verweigert. Nur der autorisierte Admin-Principal kann auf diesen Bereich zugreifen."}
          </p>
          {principalId && (
            <div className="text-sm text-muted-foreground space-y-2">
              <p>Zugriff verweigert für Principal:</p>
              <PrincipalDisplay principal={principalId} shorten />
              <p className="text-xs">
                Kopiere deinen Principal und teile ihn mit dem Administrator, um Zugriff zu erhalten.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Confirmed admin — show dashboard
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-7 w-7 text-primary" />
          <div>
            <h1 className="text-2xl font-serif font-light tracking-wide">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Verwalte Kollektionen und NFTs</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="collections">
          <TabsList className="mb-6">
            <TabsTrigger value="collections">Kollektionen</TabsTrigger>
            <TabsTrigger value="nfts">NFTs</TabsTrigger>
          </TabsList>

          {/* Collections Tab */}
          <TabsContent value="collections" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-medium mb-4">Neue Kollektion erstellen</h2>
                <AdminCollectionForm />
              </div>
              <div>
                <h2 className="text-lg font-medium mb-4">Vorhandene Kollektionen</h2>
                <AdminCollectionList />
              </div>
            </div>
          </TabsContent>

          {/* NFTs Tab */}
          <TabsContent value="nfts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-medium mb-4">
                  {editingNFT ? "NFT bearbeiten" : "Neues NFT erstellen"}
                </h2>
                <AdminNFTForm
                  nft={editingNFT ?? undefined}
                  onSuccess={handleNFTFormDone}
                  onCancel={editingNFT ? handleNFTFormDone : undefined}
                />
              </div>
              <div>
                <h2 className="text-lg font-medium mb-4">Vorhandene NFTs</h2>
                <AdminNFTList onEdit={handleEditNFT} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
