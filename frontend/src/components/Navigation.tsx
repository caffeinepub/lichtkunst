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

  // Only show the Admin link when the backend has definitively confirmed admin status.
  // Do NOT show a loading placeholder — that causes the visible flash/disappear effect.
  const showAdminLink = isAdmin && phase === 'success';

  // Only show retry button on definitive failure states (not during loading)
  const showRetry = isAuthenticated && (phase === 'timed-out' || phase === 'error');

  // NOTE: The pulsing loading placeholder has been intentionally removed.
  // It was the cause of the "flash then disappear" bug — it would appear briefly
  // during the loading phase and then vanish when the backend returned not-admin or errored.
  // Now we simply show nothing while loading, and only show the Admin link on confirmed success.

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
