import Link from 'next/link';
import { couples } from '../data/couples';
import CoupleImage from './CoupleImage';

export default function CoupleGallery() {
  return (
    <section id="gallery" className="space-y-8 rounded-[2rem] border border-[#eadbd0] bg-[#f7eee8] px-5 py-8 text-[#211714] sm:px-8 sm:py-10 lg:px-10 lg:py-12">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <p className="mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.32em] text-[#a65332]">
            <span className="h-px w-8 bg-[#a65332]" /> The visual journal
          </p>
          <h3 className="font-[var(--font-display)] text-4xl font-medium leading-tight text-[#211714] sm:text-5xl">
            Five stories, <span className="italic text-[#a65332]">uniquely theirs.</span>
          </h3>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#635950] sm:text-base">
            Step into each couple’s collection of moments, details and memories.
          </p>
        </div>
        <p className="shrink-0 text-xs uppercase tracking-[0.22em] text-[#6e625a]">{couples.length} couple stories</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {couples.map((couple, index) => (
          <Link
            key={couple.slug}
            href={`/gallery/${couple.slug}`}
            className="group relative isolate aspect-[4/5] overflow-hidden rounded-xl bg-[#e8d9ce] ring-1 ring-black/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a65332]"
          >
            <CoupleImage
              src={couple.cover}
              alt={`${couple.names} gallery cover`}
              fallbackLabel={`Story ${String(index + 1).padStart(2, '0')}`}
              className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/5" aria-hidden="true" />
            <span className="absolute left-5 top-5 text-xs uppercase tracking-[0.24em] text-white/70">Story {String(index + 1).padStart(2, '0')}</span>
            <span className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3 text-white">
              <span>
                <span className="block font-[var(--font-display)] text-3xl font-medium">{couple.names}</span>
                <span className="mt-1 block text-sm text-white/75">{couple.location}</span>
              </span>
              <span aria-hidden="true" className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/60 transition group-hover:border-[#a65332] group-hover:bg-[#a65332] group-hover:text-white">↗</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}