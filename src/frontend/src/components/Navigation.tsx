import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useIsCallerAdmin';
import { Button } from '@/components/ui/button';
import { Home, Upload } from 'lucide-react';

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
        Gallery
      </Button>

      {identity && isAdmin && (
        <Button
          variant={currentPath === '/upload' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => navigate({ to: '/upload' })}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
      )}
    </nav>
  );
}
