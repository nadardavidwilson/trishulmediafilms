'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { CouplePhotoCategory } from '../data/couples';
import type { Couple } from '../data/couples';
import CoupleImage from './CoupleImage';

const categories: Array<'All' | CouplePhotoCategory> = ['All', 'Pre-wedding', 'Wedding', 'Portraits', 'Details'];

export default function CoupleAlbum({ couple }: { couple: Couple }) {
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>('All');
  const visiblePhotos = activeCategory === 'All'
    ? couple.photos
    : couple.photos.filter((photo) => photo.category === activeCategory);

  return (
    <main className="min-h-screen bg-[#fffaf7] px-5 py-8 text-black sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <Link href="/#gallery" className="inline-flex items-center gap-2 text-sm font-semibold text-[#8c482d] transition hover:text-black">
          <span aria-hidden="true">←</span> All couple stories
        </Link>
        <header className="mb-8 mt-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#a65c3a]">{couple.location}</p>
            <h1 className="mt-2 font-[var(--font-display)] text-5xl font-medium sm:text-6xl">{couple.names}</h1>
          </div>
          <p className="text-sm text-black/60">{couple.photos.length} photographs</p>
        </header>

        {couple.photos.length > 0 ? (
          <>
            <div className="mb-6 flex flex-wrap gap-2" aria-label="Filter photos by category">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  aria-pressed={activeCategory === category}
                  className={`border-b-2 px-3 py-2 text-sm transition ${activeCategory === category ? 'border-[#a65c3a] text-black' : 'border-transparent text-black/55 hover:text-black'}`}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="grid auto-rows-[240px] grid-cols-2 gap-3 sm:auto-rows-[300px] sm:grid-cols-3 lg:grid-cols-4">
              {visiblePhotos.map((photo, index) => (
                <div key={photo.src} className={`group relative overflow-hidden rounded-lg bg-[#eee3dc] ${index % 7 === 0 ? 'row-span-2' : ''}`}>
                  <CoupleImage src={photo.src} alt={photo.alt} fallbackLabel="Photo" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                  <span className="absolute bottom-3 left-3 rounded-sm bg-black/55 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-white">{photo.category}</span>
                </div>
              ))}
            </div>
            {visiblePhotos.length === 0 ? <p className="py-16 text-center text-black/60">No photos in this category yet.</p> : null}
          </>
        ) : (
          <div className="grid min-h-80 place-items-center rounded-xl bg-[#211714] px-6 py-16 text-center text-white">
            <div>
              <p className="font-[var(--font-display)] text-4xl">This story is being prepared.</p>
              <p className="mt-3 text-sm text-white/65">Photos for {couple.names} will appear here soon.</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}