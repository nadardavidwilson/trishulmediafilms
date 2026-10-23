'use client';

import { useState } from 'react';

type CoupleImageProps = {
  src: string;
  alt: string;
  fallbackLabel: string;
  className?: string;
  loading?: 'eager' | 'lazy';
};

export default function CoupleImage({ src, alt, fallbackLabel, className = '', loading = 'lazy' }: CoupleImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'failed'>('loading');

  if (status === 'failed') {
    return (
      <span className={`flex items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_#77513f,_#362721_65%)] ${className}`} aria-label={`${fallbackLabel} cover image not uploaded`}>
        <span className="font-[var(--font-display)] text-4xl text-white/50">{fallbackLabel}</span>
      </span>
    );
  }

  return (
    <>
      {status === 'loading' ? (
        <span
          className="pointer-events-none absolute inset-0 z-10 animate-pulse bg-gradient-to-r from-[#e8d9ce] via-[#f4ece6] to-[#e8d9ce]"
          aria-hidden="true"
        />
      ) : null}
      <img
        src={src}
        alt={alt}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('failed')}
        className={className}
        loading={loading}
        decoding="async"
      />
    </>
  );
}