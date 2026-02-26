import Navigation from './Navigation';
import LoginButton from './LoginButton';
import { Heart } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Left: Logo + Artist Name */}
          <div className="flex items-center gap-3">
            <img src="/assets/generated/logo.dim_256x256.png" alt="Istvan Seidel Lichtkunst" className="h-10 w-10 shrink-0" />
            <span className="leading-tight text-foreground/80">
              <span className="block font-serif text-sm font-medium tracking-wide">Istvan Seidel</span>
              <span className="block text-[10px] font-light tracking-widest text-muted-foreground">
                Lichtkünstler&nbsp;/&nbsp;Light Artist
              </span>
            </span>
          </div>

          <Navigation />

          <div className="flex items-center gap-4">
            <LoginButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/30 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Istvan Seidel - Lichtkünstler. Erstellt mit{' '}
            <Heart className="inline h-4 w-4 fill-primary text-primary" /> bei{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'istvan-seidel-lichtkunst'
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
