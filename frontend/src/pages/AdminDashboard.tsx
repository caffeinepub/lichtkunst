import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useIsCallerAdmin';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AdminCollectionForm from '../components/AdminCollectionForm';
import AdminCollectionList from '../components/AdminCollectionList';
import AdminNFTForm from '../components/AdminNFTForm';
import AdminNFTList from '../components/AdminNFTList';
import { ShieldCheck, FolderOpen, ImageIcon, Loader2 } from 'lucide-react';
import type { NFTItem } from '../backend';

export default function AdminDashboard() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

  const [showNFTForm, setShowNFTForm] = useState(false);
  const [editingNFT, setEditingNFT] = useState<NFTItem | null>(null);

  if (!identity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <ShieldCheck className="w-12 h-12 text-muted-foreground mx-auto" />
          <h2 className="text-xl font-semibold">Anmeldung erforderlich</h2>
          <p className="text-muted-foreground">Bitte melden Sie sich an, um auf das Admin-Dashboard zuzugreifen.</p>
        </div>
      </div>
    );
  }

  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <ShieldCheck className="w-12 h-12 text-destructive mx-auto" />
          <h2 className="text-xl font-semibold">Zugriff verweigert</h2>
          <p className="text-muted-foreground">Sie haben keine Berechtigung, auf das Admin-Dashboard zuzugreifen.</p>
        </div>
      </div>
    );
  }

  const handleEditNFT = (nft: NFTItem) => {
    setEditingNFT(nft);
    setShowNFTForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNFTFormDone = () => {
    setShowNFTForm(false);
    setEditingNFT(null);
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <ShieldCheck className="w-7 h-7 text-primary" />
          <div>
            <h1 className="text-2xl font-serif font-light tracking-wide">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Verwalten Sie Kollektionen und NFTs</p>
          </div>
        </div>

        <Tabs defaultValue="collections">
          <TabsList className="mb-6">
            <TabsTrigger value="collections" className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              Kollektionen
            </TabsTrigger>
            <TabsTrigger value="nfts" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              NFTs
            </TabsTrigger>
          </TabsList>

          {/* Collections Tab */}
          <TabsContent value="collections" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif font-light text-lg">Neue Kollektion erstellen</CardTitle>
                <CardDescription>
                  Erstellen Sie eine neue Kollektion, um NFTs zu organisieren. Die erste Kollektion heißt z.B.
                  „Tafelmalerei".
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminCollectionForm />
              </CardContent>
            </Card>

            <Separator />

            <div>
              <h2 className="text-base font-medium mb-4 flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-muted-foreground" />
                Vorhandene Kollektionen
              </h2>
              <AdminCollectionList />
            </div>
          </TabsContent>

          {/* NFTs Tab */}
          <TabsContent value="nfts" className="space-y-6">
            {showNFTForm ? (
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif font-light text-lg">
                    {editingNFT ? 'NFT bearbeiten' : 'Neues NFT erstellen'}
                  </CardTitle>
                  <CardDescription>
                    {editingNFT
                      ? 'Bearbeiten Sie die Details des NFTs.'
                      : 'Fügen Sie ein neues NFT zu einer Kollektion hinzu.'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AdminNFTForm
                    nft={editingNFT ?? undefined}
                    onSuccess={handleNFTFormDone}
                    onCancel={handleNFTFormDone}
                  />
                </CardContent>
              </Card>
            ) : (
              <div className="flex justify-end">
                <button
                  onClick={() => { setEditingNFT(null); setShowNFTForm(true); }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <ImageIcon className="w-4 h-4" />
                  Neues NFT erstellen
                </button>
              </div>
            )}

            <Separator />

            <div>
              <h2 className="text-base font-medium mb-4 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-muted-foreground" />
                Vorhandene NFTs
              </h2>
              <AdminNFTList onEdit={handleEditNFT} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
