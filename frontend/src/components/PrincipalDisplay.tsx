import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { shortenPrincipal } from '@/utils/formatPrincipal';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PrincipalDisplayProps {
  principal: string;
  label?: string;
  shorten?: boolean;
  className?: string;
  toastMessage?: string;
}

export default function PrincipalDisplay({
  principal,
  label,
  shorten = true,
  className = '',
  toastMessage,
}: PrincipalDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(principal);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success(toastMessage ?? `${label ?? 'Adresse'} kopiert!`);
    }
  };

  const displayText = shorten ? shortenPrincipal(principal) : principal;

  return (
    <TooltipProvider>
      <div className={`flex items-center gap-2 ${className}`}>
        {label && (
          <span className="text-xs text-muted-foreground font-medium shrink-0">{label}</span>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="font-mono text-xs break-all cursor-default">{displayText}</span>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs break-all font-mono text-xs">
            {principal}
          </TooltipContent>
        </Tooltip>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
          title={`${label ?? 'Adresse'} kopieren`}
          aria-label={`${label ?? 'Adresse'} kopieren`}
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-green-500" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </TooltipProvider>
  );
}
