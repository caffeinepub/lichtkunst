import { Link, useLocation } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdminWithTimeout } from '../hooks/useIsCallerAdminWithTimeout';
import { Shield, RefreshCw, WifiOff } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const navLinks = [
  { to: '/', label: 'Galerie' },
  { to: '/nft-galerie', label: 'NFT Galerie' },
  { to: '/upload', label: 'Upload' },
  { to: '/blog', label: 'Blog' },
  { to: '/kontakt', label: 'Kontakt' },
];

export default function Navigation() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const location = useLocation();

  const { phase, isAdmin, retry } = useIsCallerAdminWithTimeout(30000);

  // The Admin link is ONLY shown when the backend has definitively confirmed admin=true.
  // phase must be 'confirmed' AND isAdmin must be true — never shown during any loading phase.
  // This prevents the flash-then-disappear bug on the live site.
  const showAdminLink = phase === 'confirmed' && isAdmin;

  // Only show retry button on definitive failure states (not during loading)
  const showRetry = isAuthenticated && (phase === 'timeout' || phase === 'error');

  return (
    <TooltipProvider>
      <nav className="flex items-center gap-1 flex-wrap">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-foreground/70 hover:text-foreground hover:bg-muted'
              }`}
            >
              {link.label}
            </Link>
          );
        })}

        {showAdminLink && (
          <Link
            to="/admin"
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-1 ${
              location.pathname === '/admin'
                ? 'bg-primary/10 text-primary'
                : 'text-foreground/70 hover:text-foreground hover:bg-muted'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Admin
          </Link>
        )}

        {showRetry && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={retry}
                className="px-2 py-1.5 rounded text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1"
                aria-label="Admin-Verbindung wiederherstellen"
              >
                {phase === 'error' ? (
                  <WifiOff className="w-3.5 h-3.5 text-destructive" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {phase === 'error'
                  ? 'Admin-Prüfung fehlgeschlagen – erneut versuchen'
                  : 'Admin-Verbindung wiederherstellen'}
              </p>
            </TooltipContent>
          </Tooltip>
        )}
      </nav>
    </TooltipProvider>
  );
}
