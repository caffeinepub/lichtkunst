import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useIsCallerAdmin';
import { Button } from '@/components/ui/button';
import { Home, Mail, BookOpen, Sparkles, ShieldCheck, Upload } from 'lucide-react';

export default function Navigation() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();

  const currentPath = routerState.location.pathname;

  return (
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

      {identity && (
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

      {identity && isAdmin && (
        <Button
          variant={currentPath === '/admin' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => navigate({ to: '/admin' })}
        >
          <ShieldCheck className="mr-2 h-4 w-4" />
          Admin
        </Button>
      )}
    </nav>
  );
}
