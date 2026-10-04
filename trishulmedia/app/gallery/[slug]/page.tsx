import { notFound } from 'next/navigation';
import CoupleAlbum from '../../components/CoupleAlbum';
import { couples } from '../../data/couples';

export function generateStaticParams() {
  return couples.map(({ slug }) => ({ slug }));
}

export default async function CoupleGalleryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const couple = couples.find((entry) => entry.slug === slug);

  if (!couple) notFound();

  return <CoupleAlbum couple={couple} />;
}