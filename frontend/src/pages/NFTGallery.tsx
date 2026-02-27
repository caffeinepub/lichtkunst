import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetAllNFTs } from '../hooks/useGetAllNFTs';
import { useGetAllCollections } from '../hooks/useGetAllCollections';
import { useGetAllIssuedNFTs } from '../hooks/useGetAllIssuedNFTs';
import { useGetMyIssuedNFTs } from '../hooks/useGetMyIssuedNFTs';
import NFTCard from '../components/NFTCard';
import IssuedNFTCard from '../components/IssuedNFTCard';
import NFTDetailModal from '../components/NFTDetailModal';
import MintNFTModal from '../components/MintNFTModal';
import PrincipalDisplay from '../components/PrincipalDisplay';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Copy, Check, ExternalLink, Wallet, LogIn } from 'lucide-react';
import type { NFTItem, NFT, NFTCollection, TokenId } from '@/backend';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';

const canisterId =
  (import.meta as unknown as { env: Record<string, string> }).env
    ?.VITE_CANISTER_ID_BACKEND ?? '';

function CanisterAddressBanner({ canisterId }: { canisterId: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(canisterId);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Canister-Adresse kopiert!');
    }
  };

  if (!canisterId) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wide">
          ICP Canister-Adresse
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-sm break-all">{canisterId}</span>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
            title="Canister-ID kopieren"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-500" />
                <span className="text-green-500">Kopiert!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Kopieren</span>
              </>
            )}
          </button>
        </div>
      </div>
      <a
        href={`https://dashboard.internetcomputer.org/canister/${canisterId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0"
      >
        <Button variant="outline" size="sm" className="gap-2 text-xs">
          <ExternalLink className="w-3.5 h-3.5" />
          ICP Dashboard
        </Button>
      </a>
    </div>
  );
}

interface WalletInfoCardProps {
  principalId: string;
  canisterId: string;
  myNFTCount: number;
}

function WalletInfoCard({ principalId, canisterId, myNFTCount }: WalletInfoCardProps) {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Meine Wallet</h3>
          <Badge variant="outline" className="ml-auto text-xs">
            {myNFTCount} NFT{myNFTCount !== 1 ? 's' : ''}
          </Badge>
        </div>
        <div className="space-y-3">
          <div className="bg-background/60 rounded-lg p-3 border border-border/50">
            <p className="text-xs text-muted-foreground mb-1.5 uppercase tracking-wide font-medium">
              Meine Principal-Adresse
            </p>
            <PrincipalDisplay
              principal={principalId}
              shorten={false}
              toastMessage="Principal-Adresse kopiert!"
            />
          </div>
          {canisterId && (
            <div className="bg-background/60 rounded-lg p-3 border border-border/50">
              <p className="text-xs text-muted-foreground mb-1.5 uppercase tracking-wide font-medium">
                Canister-Adresse
              </p>
              <PrincipalDisplay
                principal={canisterId}
                shorten={false}
                toastMessage="Canister-Adresse kopiert!"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function NFTGallery() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const { data: nfts = [], isLoading: nftsLoading } = useGetAllNFTs();
  const { data: collections = [], isLoading: collectionsLoading } = useGetAllCollections();
  const { data: issuedNFTs = [], isLoading: issuedLoading } = useGetAllIssuedNFTs();
  const { data: myNFTs = [], isLoading: myNFTsLoading } = useGetMyIssuedNFTs();

  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [mintModalOpen, setMintModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');

  // Detail modal state
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedNFTItem, setSelectedNFTItem] = useState<NFTItem | null>(null);
  const [selectedIssuedNFT, setSelectedIssuedNFT] = useState<NFT | null>(null);

  const handleNFTItemClick = (nft: NFTItem) => {
    setSelectedNFTItem(nft);
    setSelectedIssuedNFT(null);
    setDetailOpen(true);
  };

  const handleIssuedNFTClick = (nft: NFT) => {
    setSelectedIssuedNFT(nft);
    setSelectedNFTItem(null);
    setDetailOpen(true);
  };

  const handleDetailClose = () => {
    setDetailOpen(false);
    setSelectedNFTItem(null);
    setSelectedIssuedNFT(null);
  };

  const handleMintSuccess = (tokenId: TokenId) => {
    toast.success(`NFT #${tokenId.toString()} erfolgreich auf ICP geminted! 🎉`);
    setMintModalOpen(false);
    // Switch to "My NFTs" tab after minting
    setActiveTab('mine');
  };

  const handleMintClick = () => {
    if (!isAuthenticated) {
      toast.info('Bitte melde dich an, um NFTs zu minten.');
      return;
    }
    setMintModalOpen(true);
  };

  const collectionMap = collections.reduce<Record<string, NFTCollection>>((acc, c) => {
    acc[c.id] = c;
    return acc;
  }, {});

  const filteredNFTs = selectedCollection
    ? nfts.filter((n) => n.collectionId === selectedCollection)
    : nfts;

  const isLoading = nftsLoading || collectionsLoading || issuedLoading;

  const userPrincipal = identity?.getPrincipal().toString() ?? '';

  // Determine which issued NFTs belong to the current user (for "all" tab highlighting)
  const myPrincipalStr = userPrincipal;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-light tracking-wide mb-3">NFT Galerie</h1>
          <p className="text-muted-foreground text-lg">
            Entdecke die digitalen Kunstwerke von Istvan Seidel auf der ICP Blockchain.
          </p>
        </div>

        {/* Wallet Info + Mint Button Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Wallet Info */}
          <div className="lg:col-span-2">
            {isAuthenticated && userPrincipal ? (
              <WalletInfoCard
                principalId={userPrincipal}
                canisterId={canisterId}
                myNFTCount={myNFTs.length}
              />
            ) : (
              <Card className="border-dashed border-border/60">
                <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground mb-1">
                      Wallet nicht verbunden
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Melde dich an, um deine Principal-Adresse zu sehen und NFTs zu minten.
                    </p>
                  </div>
                  <Button
                    onClick={() => login()}
                    disabled={isLoggingIn}
                    variant="outline"
                    size="sm"
                    className="gap-2 shrink-0"
                  >
                    <LogIn className="w-4 h-4" />
                    {isLoggingIn ? 'Anmelden...' : 'Anmelden'}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Mint Button */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleMintClick}
              disabled={isLoggingIn}
              size="lg"
              className="gap-2 h-full min-h-[80px] text-base font-light tracking-wide"
            >
              <Sparkles className="w-5 h-5" />
              NFT minten
            </Button>
            {!isAuthenticated && (
              <p className="text-xs text-muted-foreground text-center">
                Anmeldung erforderlich
              </p>
            )}
          </div>
        </div>

        {/* Canister Address Banner */}
        <div className="mb-8">
          <CanisterAddressBanner canisterId={canisterId} />
        </div>

        {/* Tabs: All NFTs / My NFTs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="all" className="gap-2">
                Alle NFTs
                {!isLoading && (
                  <Badge variant="secondary" className="text-xs ml-1">
                    {issuedNFTs.length + filteredNFTs.length}
                  </Badge>
                )}
              </TabsTrigger>
              {isAuthenticated && (
                <TabsTrigger value="mine" className="gap-2">
                  Meine NFTs
                  {!myNFTsLoading && (
                    <Badge variant="secondary" className="text-xs ml-1">
                      {myNFTs.length}
                    </Badge>
                  )}
                </TabsTrigger>
              )}
            </TabsList>

            {/* Collection Filter (only in "all" tab) */}
            {activeTab === 'all' && collections.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCollection(null)}
                  className={`px-3 py-1 rounded-full text-xs transition-colors border ${
                    selectedCollection === null
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-transparent text-muted-foreground border-border hover:border-primary hover:text-foreground'
                  }`}
                >
                  Alle
                </button>
                {collections.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCollection(c.id)}
                    className={`px-3 py-1 rounded-full text-xs transition-colors border ${
                      selectedCollection === c.id
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-transparent text-muted-foreground border-border hover:border-primary hover:text-foreground'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ALL NFTs Tab */}
          <TabsContent value="all">
            {/* Loading Skeletons */}
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="rounded-xl overflow-hidden">
                    <Skeleton className="aspect-square w-full" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ICP Minted NFTs */}
            {!isLoading && issuedNFTs.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="font-serif text-2xl font-light">Auf ICP gemintete NFTs</h2>
                  <Badge variant="outline" className="text-xs">
                    {issuedNFTs.length} NFT{issuedNFTs.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {issuedNFTs.map((nft) => (
                    <IssuedNFTCard
                      key={nft.tokenId.toString()}
                      nft={nft}
                      onClick={handleIssuedNFTClick}
                      isOwn={
                        isAuthenticated &&
                        nft.owner.toString() === myPrincipalStr
                      }
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Admin NFTs */}
            {!isLoading && filteredNFTs.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="font-serif text-2xl font-light">NFT Kollektion</h2>
                  <Badge variant="outline" className="text-xs">
                    {filteredNFTs.length} NFT{filteredNFTs.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredNFTs.map((nft) => (
                    <NFTCard
                      key={nft.id}
                      nft={nft}
                      collection={collectionMap[nft.collectionId]}
                      canisterId={canisterId}
                      onClick={handleNFTItemClick}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Empty State */}
            {!isLoading && filteredNFTs.length === 0 && issuedNFTs.length === 0 && (
              <div className="text-center py-24 text-muted-foreground">
                <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-serif">Noch keine NFTs vorhanden.</p>
                <p className="text-sm mt-2">
                  Klicke auf „NFT minten", um das erste NFT zu erstellen.
                </p>
              </div>
            )}
          </TabsContent>

          {/* MY NFTs Tab */}
          {isAuthenticated && (
            <TabsContent value="mine">
              {myNFTsLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-xl overflow-hidden">
                      <Skeleton className="aspect-square w-full" />
                      <div className="p-4 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!myNFTsLoading && myNFTs.length > 0 && (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="font-serif text-2xl font-light">Meine NFTs</h2>
                    <Badge variant="outline" className="text-xs">
                      {myNFTs.length} NFT{myNFTs.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {myNFTs.map((nft) => (
                      <IssuedNFTCard
                        key={nft.tokenId.toString()}
                        nft={nft}
                        onClick={handleIssuedNFTClick}
                        isOwn={true}
                      />
                    ))}
                  </div>
                </>
              )}

              {!myNFTsLoading && myNFTs.length === 0 && (
                <div className="text-center py-24 text-muted-foreground">
                  <Wallet className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-serif">Noch keine NFTs in deiner Wallet.</p>
                  <p className="text-sm mt-2 mb-6">
                    Klicke auf „NFT minten", um dein erstes NFT zu erstellen.
                  </p>
                  <Button onClick={() => setMintModalOpen(true)} className="gap-2">
                    <Sparkles className="w-4 h-4" />
                    NFT minten
                  </Button>
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Detail Modal */}
      <NFTDetailModal
        open={detailOpen}
        onClose={handleDetailClose}
        nftItem={selectedNFTItem}
        issuedNFT={selectedIssuedNFT}
        canisterId={canisterId}
      />

      {/* Mint Modal */}
      {isAuthenticated && (
        <MintNFTModal
          open={mintModalOpen}
          onOpenChange={setMintModalOpen}
          onSuccess={handleMintSuccess}
        />
      )}
    </div>
  );
}
