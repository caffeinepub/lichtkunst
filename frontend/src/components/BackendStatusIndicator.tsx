import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useBackendHealthCheck } from '@/hooks/useBackendHealthCheck';

/**
 * Small badge component showing the current backend connectivity status.
 * Displays green/Online, red/Unreachable, or gray/Checking based on health check result.
 */
export default function BackendStatusIndicator() {
  const { isLoading, isSuccess, isError } = useBackendHealthCheck();

  if (isLoading) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
        <Loader2 className="h-2.5 w-2.5 animate-spin" />
        Verbinde…
      </span>
    );
  }

  if (isError) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-destructive/15 px-2 py-0.5 text-[10px] font-medium text-destructive">
        <AlertCircle className="h-2.5 w-2.5" />
        Backend: Nicht erreichbar
      </span>
    );
  }

  if (isSuccess) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-medium text-success">
        <CheckCircle2 className="h-2.5 w-2.5" />
        Backend: Online
      </span>
    );
  }

  return null;
}
