'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

type CoupleImageProps = {
  src: string;
  alt: string;
  fallbackLabel: string;
  className?: string;
  sizes: string;
  loading?: 'eager' | 'lazy';
};

export default function CoupleImage({ src, alt, fallbackLabel, className = '', sizes, loading = 'lazy' }: CoupleImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'failed'>('loading');
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const image = imageRef.current;
    if (!image) return;

    if (image.complete) {
      setStatus(image.naturalWidth > 0 ? 'loaded' : 'failed');
      return;
    }

    if (loading === 'eager' || !('IntersectionObserver' in window)) {
      image.loading = 'eager';
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          image.loading = 'eager';
          observer.disconnect();
        }
      },
      { rootMargin: '1600px 0px' },
    );
    observer.observe(image);

    return () => observer.disconnect();
  }, [loading, src]);

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
      <Image
        ref={imageRef}
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('failed')}
        className={className}
        loading={loading}
        quality={80}
      />
    </>
  );
}