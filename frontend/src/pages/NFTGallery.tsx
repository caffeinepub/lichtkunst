import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetAllNFTs } from '../hooks/useGetAllNFTs';
import { useGetAllCollections } from '../hooks/useGetAllCollections';
import { useGetAllIssuedNFTs } from '../hooks/useGetAllIssuedNFTs';
import { useGetMyIssuedNFTs } from '../hooks/useGetMyIssuedNFTs';
import { useActor } from '../hooks/useActor';
import NFTCard from '../components/NFTCard';
import IssuedNFTCard from '../components/IssuedNFTCard';
import MintNFTModal from '../components/MintNFTModal';
import NFTDetailModal from '../components/NFTDetailModal';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Copy, Sparkles, LogIn, Loader2, RefreshCw, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { copyToClipboard } from '../utils/copyToClipboard';
import type { NFTItem, NFTCollection } from '../backend';

const CANISTER_ID: string =
  (import.meta as unknown as { env: Record<string, string> }).env?.VITE_CANISTER_ID_BACKEND ?? '';

export default function NFTGallery() {
  const { identity, login } = useInternetIdentity();
  const { isFetching: actorFetching } = useActor();
  const isAuthenticated = !!identity;
  const principalStr = identity?.getPrincipal().toString() ?? '';

  const [mintModalOpen, setMintModalOpen] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<NFTItem | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [collectionFilter, setCollectionFilter] = useState<string>('all');

  const { data: allNFTs = [], isLoading: nftsLoading, error: nftsError, refetch: refetchNFTs } = useGetAllNFTs();
  const { data: collections = [], isLoading: collectionsLoading } = useGetAllCollections();
  const { data: allIssuedNFTs = [], isLoading: issuedLoading, error: issuedError, refetch: refetchIssued } = useGetAllIssuedNFTs();
  const { data: myIssuedNFTs = [], isLoading: myNFTsLoading } = useGetMyIssuedNFTs();

  const filteredNFTs = collectionFilter === 'all'
    ? allNFTs
    : allNFTs.filter(nft => nft.collectionId === collectionFilter);

  const collectionMap = collections.reduce<Record<string, NFTCollection>>((acc, c) => {
    acc[c.id] = c;
    return acc;
  }, {});

  const handleCopy = async (text: string, label: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      toast.success(`${label} kopiert`);
    } else {
      toast.error('Kopieren fehlgeschlagen');
    }
  };

  const handleNFTClick = (nft: NFTItem) => {
    setSelectedNFT(nft);
    setDetailModalOpen(true);
  };

  const handleDetailClose = () => {
    setDetailModalOpen(false);
    setSelectedNFT(null);
  };

  if (actorFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground font-sans">Verbindung wird hergestellt…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-light text-foreground mb-2">NFT Galerie</h1>
          <p className="text-muted-foreground font-sans">
            Entdecken und sammeln Sie einzigartige digitale Kunstwerke
          </p>
        </div>

        {/* Wallet Info / Login Prompt */}
        {isAuthenticated ? (
          <div className="bg-card border border-border rounded-lg p-4 mb-6 space-y-3">
            <h3 className="font-sans font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Wallet-Informationen
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1">Ihre Principal-Adresse</p>
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono text-foreground truncate flex-1 bg-muted px-2 py-1 rounded">
                    {principalStr}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0"
                    onClick={() => handleCopy(principalStr, 'Principal')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              {CANISTER_ID && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">Canister-Adresse</p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono text-foreground truncate flex-1 bg-muted px-2 py-1 rounded">
                      {CANISTER_ID}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0"
                      onClick={() => handleCopy(CANISTER_ID, 'Canister-ID')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg p-6 mb-6 text-center space-y-3">
            <p className="text-muted-foreground font-sans text-sm">
              Melden Sie sich an, um NFTs zu minten und Ihre Sammlung zu verwalten.
            </p>
            <Button onClick={() => login()} className="gap-2">
              <LogIn className="h-4 w-4" />
              Anmelden
            </Button>
          </div>
        )}

        {/* Mint Button */}
        {isAuthenticated && (
          <div className="flex justify-end mb-6">
            <Button onClick={() => setMintModalOpen(true)} className="gap-2">
              <Sparkles className="h-4 w-4" />
              NFT minten
            </Button>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-xs">
            <TabsTrigger value="all">Alle NFTs</TabsTrigger>
            <TabsTrigger value="mine" disabled={!isAuthenticated}>
              Meine NFTs
            </TabsTrigger>
          </TabsList>

          {/* All NFTs Tab */}
          <TabsContent value="all" className="space-y-4">
            {/* Collection Filter */}
            {!collectionsLoading && collections.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground font-sans">Kollektion:</span>
                <Select value={collectionFilter} onValueChange={setCollectionFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Kollektionen</SelectItem>
                    {collections.map(col => (
                      <SelectItem key={col.id} value={col.id}>{col.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Error state */}
            {nftsError && (
              <div className="text-center py-12 space-y-4">
                <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
                <p className="text-muted-foreground font-sans">
                  Fehler beim Laden der NFTs. Bitte versuchen Sie es erneut.
                </p>
                <Button variant="outline" onClick={() => refetchNFTs()} className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Erneut versuchen
                </Button>
              </div>
            )}

            {/* Loading state */}
            {nftsLoading && !nftsError && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-64 rounded-lg" />
                ))}
              </div>
            )}

            {/* NFT Grid */}
            {!nftsLoading && !nftsError && (
              <>
                {filteredNFTs.length === 0 ? (
                  <div className="text-center py-16">
                    <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground font-sans">
                      Noch keine NFTs vorhanden.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNFTs.map(nft => (
                      <NFTCard
                        key={nft.id}
                        nft={nft}
                        collection={collectionMap[nft.collectionId]}
                        canisterId={CANISTER_ID}
                        onClick={handleNFTClick}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Issued NFTs Section */}
            <div className="mt-10">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="font-serif text-2xl font-light text-foreground">On-Chain NFTs</h2>
                <Badge variant="secondary" className="font-sans text-xs">
                  {allIssuedNFTs.length}
                </Badge>
              </div>

              {issuedError && (
                <div className="text-center py-8 space-y-3">
                  <AlertTriangle className="h-8 w-8 text-destructive mx-auto" />
                  <p className="text-muted-foreground font-sans text-sm">
                    Fehler beim Laden der On-Chain NFTs.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => refetchIssued()} className="gap-2">
                    <RefreshCw className="h-3 w-3" />
                    Erneut versuchen
                  </Button>
                </div>
              )}

              {issuedLoading && !issuedError && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-64 rounded-lg" />
                  ))}
                </div>
              )}

              {!issuedLoading && !issuedError && allIssuedNFTs.length === 0 && (
                <p className="text-muted-foreground font-sans text-sm py-4">
                  Noch keine On-Chain NFTs geminted.
                </p>
              )}

              {!issuedLoading && !issuedError && allIssuedNFTs.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allIssuedNFTs.map(nft => (
                    <IssuedNFTCard
                      key={nft.tokenId.toString()}
                      nft={nft}
                      isOwn={nft.owner.toString() === principalStr}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* My NFTs Tab */}
          <TabsContent value="mine" className="space-y-4">
            {!isAuthenticated ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground font-sans">
                  Bitte melden Sie sich an, um Ihre NFTs zu sehen.
                </p>
              </div>
            ) : myNFTsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-64 rounded-lg" />
                ))}
              </div>
            ) : myIssuedNFTs.length === 0 ? (
              <div className="text-center py-16">
                <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground font-sans mb-4">
                  Sie haben noch keine NFTs geminted.
                </p>
                <Button onClick={() => setMintModalOpen(true)} className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Erstes NFT minten
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myIssuedNFTs.map(nft => (
                  <IssuedNFTCard
                    key={nft.tokenId.toString()}
                    nft={nft}
                    isOwn={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <MintNFTModal
        open={mintModalOpen}
        onOpenChange={setMintModalOpen}
      />

      {selectedNFT && (
        <NFTDetailModal
          open={detailModalOpen}
          onClose={handleDetailClose}
          nftItem={selectedNFT}
          canisterId={CANISTER_ID}
        />
      )}
    </div>
  );
}
