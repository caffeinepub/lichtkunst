import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdminWithTimeout } from '../hooks/useIsCallerAdminWithTimeout';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Home, Mail, BookOpen, Sparkles, ShieldCheck, Upload, Loader2, RefreshCw, WifiOff } from 'lucide-react';

export default function Navigation() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { identity } = useInternetIdentity();
  // Use timeout-aware hook so the Admin button never stays grey indefinitely
  const { isAdmin, isLoading: adminLoading, timedOut, error: adminError, retry, phase } =
    useIsCallerAdminWithTimeout(30000);

  const currentPath = routerState.location.pathname;

  const isAnonymous = identity ? identity.getPrincipal().isAnonymous() : true;
  const isAuthenticated = !!identity && !isAnonymous;

  // Determine Admin button visibility:
  // - Show loading/disabled state only during bounded waiting period (waiting-actor or checking-admin)
  // - Show active button once confirmed admin (phase === 'done' && isAdmin)
  // - Hide entirely on timeout or error (don't show grey button indefinitely)
  const showAdminLoading = isAuthenticated && adminLoading;
  const showAdminActive = isAuthenticated && phase === 'done' && isAdmin;
  const showAdminButton = showAdminLoading || showAdminActive;

  // Show a subtle retry affordance when timed out or errored
  const showRetryHint = isAuthenticated && (timedOut || !!adminError);

  return (
    <TooltipProvider>
      <nav className="flex items-center gap-2">
        <Button
          variant={currentPath === '/' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => navigate({ to: '/' })}
        >
          <Home className="mr-2 h-4 w-4" />
          Startseite
        </Button>

        <Button
          variant={currentPath === '/nft-galerie' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => navigate({ to: '/nft-galerie' })}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          NFT Galerie
        </Button>

        <Button
          variant={currentPath.startsWith('/blog') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => navigate({ to: '/blog' })}
        >
          <BookOpen className="mr-2 h-4 w-4" />
          Blog
        </Button>

        <Button
          variant={currentPath === '/kontakt' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => navigate({ to: '/kontakt' })}
        >
          <Mail className="mr-2 h-4 w-4" />
          Kontakt
        </Button>

        {isAuthenticated && (
          <Button
            variant={currentPath === '/upload' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => navigate({ to: '/upload' })}
            className="text-accent-foreground"
          >
            <Upload className="mr-2 h-4 w-4" />
            NFT hochladen
          </Button>
        )}

        {showAdminButton && (
          <Button
            variant={currentPath === '/admin' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => !adminLoading && navigate({ to: '/admin' })}
            disabled={adminLoading}
            className={adminLoading ? 'opacity-60 cursor-wait' : ''}
          >
            {adminLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ShieldCheck className="mr-2 h-4 w-4" />
            )}
            Admin
          </Button>
        )}

        {showRetryHint && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={retry}
                className="h-8 w-8 opacity-50 hover:opacity-100 transition-opacity"
                aria-label="Admin-Verbindung erneut versuchen"
              >
                {adminError ? (
                  <WifiOff className="h-3.5 w-3.5 text-destructive" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              {adminError
                ? 'Verbindungsfehler – erneut versuchen'
                : 'Zeitüberschreitung – erneut versuchen'}
            </TooltipContent>
          </Tooltip>
        )}
      </nav>
    </TooltipProvider>
  );
}
