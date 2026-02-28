import { AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ActorErrorBannerProps {
  error: Error;
  onRetry: () => void;
}

/**
 * Displays a prominent error banner when the backend actor fails to initialize
 * within the timeout period. Includes a retry button to re-attempt connection.
 */
export default function ActorErrorBanner({ error, onRetry }: ActorErrorBannerProps) {
  const handleRetry = () => {
    onRetry();
    // Force a full page reload to re-initialize the actor
    window.location.reload();
  };

  return (
    <div className="border-b border-destructive/30 bg-destructive/10 px-4 py-3">
      <div className="container mx-auto">
        <Alert variant="destructive" className="border-destructive/50 bg-destructive/5">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-semibold">Verbindungsfehler</AlertTitle>
          <AlertDescription className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm">
              {error.message ||
                'Das Backend konnte nicht erreicht werden. Bitte überprüfe deine Internetverbindung.'}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              className="shrink-0 border-destructive/50 text-destructive hover:bg-destructive/10"
            >
              <RefreshCw className="mr-2 h-3.5 w-3.5" />
              Erneut versuchen
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
