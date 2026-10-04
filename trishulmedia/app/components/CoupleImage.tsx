'use client';

import { useState } from 'react';

type CoupleImageProps = {
  src: string;
  alt: string;
  fallbackLabel: string;
  className?: string;
};

export default function CoupleImage({ src, alt, fallbackLabel, className = '' }: CoupleImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className={`flex items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_#77513f,_#362721_65%)] ${className}`} aria-label={`${fallbackLabel} cover image not uploaded`}>
        <span className="font-[var(--font-display)] text-4xl text-white/50">{fallbackLabel}</span>
      </span>
    );
  }

  return <img src={src} alt={alt} onError={() => setFailed(true)} className={className} loading="lazy" />;
}