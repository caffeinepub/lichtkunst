import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useIsCallerAdmin';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, ShieldCheck, FolderOpen, Sparkles } from 'lucide-react';
import AdminCollectionForm from '../components/AdminCollectionForm';
import AdminCollectionList from '../components/AdminCollectionList';
import AdminNFTForm from '../components/AdminNFTForm';
import AdminNFTList from '../components/AdminNFTList';
import type { NFTCollection, NFTItem } from '../backend';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: isCheckingAdmin } = useIsCallerAdmin();

  const [editingCollection, setEditingCollection] = useState<NFTCollection | null>(null);
  const [editingNFT, setEditingNFT] = useState<NFTItem | null>(null);

  // Auth guard
  if (!identity && !isCheckingAdmin) {
    navigate({ to: '/' });
    return null;
  }

  if (!isCheckingAdmin && !isAdmin) {
    navigate({ to: '/' });
    return null;
  }

  if (isCheckingAdmin) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary/60" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2 text-muted-foreground/50">
          <ShieldCheck className="h-4 w-4" />
          <span className="text-xs font-thin tracking-[0.2em] uppercase">Admin-Bereich</span>
        </div>
        <h1 className="font-serif text-3xl font-thin tracking-wide text-foreground/80">
          NFT Verwaltung
        </h1>
        <p className="mt-1 text-sm font-thin text-muted-foreground/60">
          Kollektionen und NFT-Kunstwerke verwalten
        </p>
      </div>

      <Tabs defaultValue="collections">
        <TabsList className="mb-6 grid w-full grid-cols-2 max-w-sm">
          <TabsTrigger value="collections" className="gap-1.5 text-xs font-thin tracking-wide">
            <FolderOpen className="h-3.5 w-3.5" />
            Kollektionen
          </TabsTrigger>
          <TabsTrigger value="nfts" className="gap-1.5 text-xs font-thin tracking-wide">
            <Sparkles className="h-3.5 w-3.5" />
            NFTs
          </TabsTrigger>
        </TabsList>

        {/* Collections Tab */}
        <TabsContent value="collections" className="space-y-6">
          <AdminCollectionForm
            editingCollection={editingCollection}
            onDone={() => setEditingCollection(null)}
          />
          <div>
            <h2 className="mb-3 text-xs font-thin tracking-[0.2em] uppercase text-muted-foreground/60">
              Vorhandene Kollektionen
            </h2>
            <AdminCollectionList
              onEdit={(collection) => {
                setEditingCollection(collection);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        </TabsContent>

        {/* NFTs Tab */}
        <TabsContent value="nfts" className="space-y-6">
          <AdminNFTForm
            editingNFT={editingNFT}
            onDone={() => setEditingNFT(null)}
          />
          <div>
            <h2 className="mb-3 text-xs font-thin tracking-[0.2em] uppercase text-muted-foreground/60">
              Vorhandene NFTs
            </h2>
            <AdminNFTList
              onEdit={(nft) => {
                setEditingNFT(nft);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
