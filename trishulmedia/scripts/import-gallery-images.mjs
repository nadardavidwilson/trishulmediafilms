import { access, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const wrangler = join(projectRoot, 'node_modules', 'wrangler', 'bin', 'wrangler.js');
const tempDir = await mkdtemp(join(tmpdir(), 'trishul-gallery-'));
const gallery = [
  { file: 'GalleryImage1.jpg', id: 'gallery-1', title: 'The golden hour', caption: 'A warm sunset frame full of emotion and motion.', category: 'Pre-wedding' },
  { file: 'GalleryImage2.jpg', id: 'gallery-2', title: 'A quiet moment', caption: 'Candid expressions, soft light and a relaxed coastal mood.', category: 'Pre-wedding' },
  { file: 'GalleryImage3.jpg', id: 'gallery-3', title: 'In the soft light', caption: 'A cinematic portrait inspired by natural light and storytelling.', category: 'Portraits' },
  { file: 'GalleryImage4.jpg', id: 'gallery-4', title: 'Simply together', caption: 'A graceful portrait session with rich tones and natural elegance.', category: 'Portraits' },
  { file: 'GalleryImage5.webp', id: 'gallery-5', title: 'The little details', caption: 'A candid emotional detail that brings the entire story together.', category: 'Details' },
  { file: 'GalleryImage6.webp', id: 'gallery-6', title: 'A story to keep', caption: 'A dreamy final frame that completes the full love-story sequence.', category: 'Pre-wedding' },
  { file: 'logo.jpg', id: 'public-logo', title: 'Trishul Media & Films logo', caption: 'Studio logo.', category: 'Branding' },
  { file: 'file.svg', id: 'public-file-icon', title: 'File icon', caption: 'Public file icon asset.', category: 'Site assets' },
  { file: 'globe.svg', id: 'public-globe-icon', title: 'Globe icon', caption: 'Public globe icon asset.', category: 'Site assets' },
  { file: 'next.svg', id: 'public-next-icon', title: 'Next.js icon', caption: 'Public Next.js icon asset.', category: 'Site assets' },
  { file: 'vercel.svg', id: 'public-vercel-icon', title: 'Vercel icon', caption: 'Public Vercel icon asset.', category: 'Site assets' },
  { file: 'window.svg', id: 'public-window-icon', title: 'Window icon', caption: 'Public window icon asset.', category: 'Site assets' },
  { file: 'GalleyVedio1.mp4', id: 'public-video', title: 'Trishul Media showreel', caption: 'Studio showreel video.', category: 'Video' },
];
const quote = (value) => `'${value.replaceAll("'", "''")}'`;

try {
  for (const [index, item] of gallery.entries()) {
    const sourcePath = join(projectRoot, 'public', item.file);
    try {
      await access(sourcePath);
    } catch {
      console.log(`Skipping ${item.file} (not present in public/)`);
      continue;
    }
    const bytes = await readFile(sourcePath);
    const mimeType = item.file.endsWith('.mp4')
      ? 'video/mp4'
      : item.file.endsWith('.webp')
        ? 'image/webp'
        : item.file.endsWith('.svg')
          ? 'image/svg+xml'
          : 'image/jpeg';
    const statements = [
      `INSERT INTO gallery_images (id, object_key, title, caption, category, alt_text, sort_order, mime_type) VALUES (${quote(item.id)}, ${quote(`/${item.file}`)}, ${quote(item.title)}, ${quote(item.caption)}, ${quote(item.category)}, ${quote(item.title)}, ${index + 1}, ${quote(mimeType)}) ON CONFLICT(id) DO UPDATE SET object_key=excluded.object_key, title=excluded.title, caption=excluded.caption, category=excluded.category, alt_text=excluded.alt_text, sort_order=excluded.sort_order, mime_type=excluded.mime_type;`,
      `DELETE FROM gallery_image_chunks WHERE image_id = ${quote(item.id)};`,
    ];
    const chunkSize = 32 * 1024;
    for (let offset = 0, chunkIndex = 0; offset < bytes.length; offset += chunkSize, chunkIndex += 1) {
      const chunk = bytes.subarray(offset, Math.min(offset + chunkSize, bytes.length));
      statements.push(`INSERT INTO gallery_image_chunks (image_id, chunk_index, image_data) VALUES (${quote(item.id)}, ${chunkIndex}, X'${chunk.toString('hex')}');`);
    }
    const sql = `${statements.join('\n')}\n`;
    const sqlFile = join(tempDir, `${item.id}.sql`);
    await writeFile(sqlFile, sql);
    const result = spawnSync(process.execPath, [wrangler, 'd1', 'execute', 'trishulmedia-gallery', '--remote', '--file', sqlFile, '--yes'], {
      cwd: projectRoot,
      stdio: 'inherit',
    });
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error(`D1 import failed for ${item.file} (exit ${result.status})`);
    console.log(`Stored ${item.file} (${bytes.byteLength} bytes)`);
  }
} finally {
  await rm(tempDir, { recursive: true, force: true });
}
