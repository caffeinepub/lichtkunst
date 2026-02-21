import { Outlet } from '@tanstack/react-router';
import Navigation from './Navigation';
import LoginButton from './LoginButton';
import ProfileSetupModal from './ProfileSetupModal';
import { SiCaffeine } from 'react-icons/si';
import { Heart, Sparkles } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <ProfileSetupModal />
      
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <img src="/assets/generated/logo.dim_256x256.png" alt="Lichtkunst" className="h-10 w-10" />
            <span className="font-serif text-xl font-bold">Lichtkunst</span>
          </div>
          
          <Navigation />
          
          <LoginButton />
        </div>
      </header>

      {/* NFT Notice Banner */}
      <div className="bg-gradient-to-r from-primary/90 via-accent/90 to-primary/90 py-4 px-4 text-center">
        <div className="container mx-auto flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
          <p className="text-sm font-medium text-primary-foreground md:text-base">
            Alle Kunstwerke sind NFTs auf dem Internet Computer Protocol (ICP)
          </p>
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/30 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Lichtkunst. Built with{' '}
            <Heart className="inline h-4 w-4 fill-primary text-primary" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'lichtkunst'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
