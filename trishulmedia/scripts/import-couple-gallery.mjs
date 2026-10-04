import { mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, join, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const coupleRoot = join(projectRoot, 'public', 'gallery', 'couples');
const wrangler = join(projectRoot, 'node_modules', 'wrangler', 'bin', 'wrangler.js');
const tempDir = await mkdtemp(join(tmpdir(), 'trishul-couple-gallery-'));
const localDatabase = process.argv.includes('--local');
const databaseLocationArgs = localDatabase
  ? [
    '--config',
    join(projectRoot, 'wrangler.jsonc'),
    '--persist-to',
    join(projectRoot, '.wrangler', 'state'),
  ]
  : ['--remote'];
const chunkSize = 32 * 1024;
const batchSize = 5;
const categoryByCouple = {
  'couple-01': 'Pre-wedding',
  'couple-02': 'Wedding',
  'couple-03': 'Pre-wedding',
  'couple-04': 'Wedding',
  'couple-05': 'Wedding',
};
const quote = (value) => `'${value.replaceAll("'", "''")}'`;

async function findWebpFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await findWebpFiles(path));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.webp')) files.push(path);
  }
  return files.sort();
}

try {
  const coupleEntries = (await readdir(coupleRoot, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory() && /^couple-\d+$/.test(entry.name))
    .sort((a, b) => a.name.localeCompare(b.name));
  let sortOrder = 0;
  let importedCount = 0;

  for (const couple of coupleEntries) {
    const coupleSlug = couple.name;
    const imageDirectory = join(coupleRoot, coupleSlug, 'images');
    const files = await findWebpFiles(imageDirectory);
    if (files.length === 0) continue;

    for (let batchStart = 0; batchStart < files.length; batchStart += batchSize) {
      const batchFiles = files.slice(batchStart, batchStart + batchSize);
      const statements = [];

      for (const sourcePath of batchFiles) {
        const filename = basename(sourcePath);
        const title = basename(filename, '.webp');
        const id = `${coupleSlug}-${title}`;
        const objectKey = `/${relative(projectRoot, sourcePath).split('\\').join('/')}`;
        const bytes = await readFile(sourcePath);
        statements.push(
          `INSERT INTO gallery_images (id, object_key, title, caption, category, alt_text, sort_order, mime_type) VALUES (${quote(id)}, ${quote(objectKey)}, ${quote(title)}, '', ${quote(categoryByCouple[coupleSlug] ?? 'Pre-wedding')}, ${quote(title)}, ${sortOrder + 1}, 'image/webp') ON CONFLICT(id) DO UPDATE SET object_key=excluded.object_key, title=excluded.title, caption=excluded.caption, category=excluded.category, alt_text=excluded.alt_text, sort_order=excluded.sort_order, mime_type=excluded.mime_type;`,
          `DELETE FROM gallery_image_chunks WHERE image_id = ${quote(id)};`,
        );

        for (let offset = 0, chunkIndex = 0; offset < bytes.length; offset += chunkSize, chunkIndex += 1) {
          const chunk = bytes.subarray(offset, Math.min(offset + chunkSize, bytes.length));
          statements.push(`INSERT INTO gallery_image_chunks (image_id, chunk_index, image_data) VALUES (${quote(id)}, ${chunkIndex}, X'${chunk.toString('hex')}');`);
        }
        sortOrder += 1;
      }

      const batchIndex = Math.floor(batchStart / batchSize) + 1;
      const sqlFile = join(tempDir, `${coupleSlug}-${batchIndex}.sql`);
      await writeFile(sqlFile, `${statements.join('\n')}\n`);
      const result = spawnSync(process.execPath, [
        wrangler,
        'd1',
        'execute',
        'trishulmedia-gallery',
        ...databaseLocationArgs,
        '--file',
        sqlFile,
        '--yes',
      ], { cwd: projectRoot, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });

      if (result.error) throw result.error;
      if (result.status !== 0) {
        console.error(result.stderr);
        throw new Error(`D1 import failed for ${coupleSlug} batch ${batchIndex} (exit ${result.status})`);
      }
      importedCount += batchFiles.length;
      console.log(`Stored ${batchStart + batchFiles.length} of ${files.length} images for ${coupleSlug}.`);
    }
  }

  if (importedCount === 0) throw new Error(`No WebP files found under ${coupleRoot}`);
  console.log(`Imported ${importedCount} couple gallery images into the ${localDatabase ? 'local' : 'remote'} D1 database.`);
} finally {
  await rm(tempDir, { recursive: true, force: true });
}