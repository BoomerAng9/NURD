import React from 'react';

/**
 * Inline BETA tag — small, monochrome, mono-typography. Appears beside the
 * NURD wordmark in the nav, NOT as a floating sticker.
 *
 * Honors the FOAI restraint: no rotation, no gradients, no animate-pulse.
 * Removable when the platform is no longer beta.
 */
export interface BetaStampProps {
  className?: string;
}

export function BetaStamp({ className }: BetaStampProps) {
  return (
    <span
      className={
        className ||
        'inline-flex items-center font-mono uppercase tracking-wordmark text-[9px] px-1.5 py-0.5 border border-border text-muted-foreground'
      }
      aria-label="beta release"
    >
      BETA
    </span>
  );
}
