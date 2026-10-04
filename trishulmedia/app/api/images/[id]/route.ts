import { env } from "cloudflare:workers";

const CHUNK_SIZE = 32 * 1024;
const QUERY_CHUNK_COUNT = 32;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const image = await env.DB.prepare(
    "SELECT mime_type, (SELECT SUM(length(image_data)) FROM gallery_image_chunks WHERE image_id = gallery_images.id) AS content_length FROM gallery_images WHERE id = ?",
  )
    .bind(id)
    .first<{ mime_type: string; content_length: number | null }>();

  if (!image) {
    return new Response("Image not found", { status: 404 });
  }

  const contentLength = image.content_length;
  if (!contentLength) {
    return new Response("Image data not found", { status: 404 });
  }

  const rangeHeader = request.headers.get("Range");
  let rangeStart = 0;
  let rangeEnd = contentLength - 1;
  let status = 200;

  if (rangeHeader) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader);
    if (!match || (!match[1] && !match[2])) {
      return new Response(null, {
        status: 416,
        headers: { "Content-Range": `bytes */${contentLength}` },
      });
    }

    if (!match[1]) {
      const suffixLength = Number(match[2]);
      if (suffixLength <= 0) {
        return new Response(null, {
          status: 416,
          headers: { "Content-Range": `bytes */${contentLength}` },
        });
      }
      rangeStart = Math.max(0, contentLength - suffixLength);
    } else {
      rangeStart = Number(match[1]);
      if (match[2]) rangeEnd = Number(match[2]);
    }

    if (rangeStart >= contentLength || rangeEnd < rangeStart) {
      return new Response(null, {
        status: 416,
        headers: { "Content-Range": `bytes */${contentLength}` },
      });
    }
    rangeEnd = Math.min(rangeEnd, contentLength - 1);
    status = 206;
  }

  const firstChunkIndex = Math.floor(rangeStart / CHUNK_SIZE);
  const lastChunkIndex = Math.floor(rangeEnd / CHUNK_SIZE);
  let nextChunkIndex = firstChunkIndex;
  const body = new ReadableStream<Uint8Array>({
    async pull(controller) {
      const { results } = await env.DB.prepare(
        "SELECT chunk_index, image_data FROM gallery_image_chunks WHERE image_id = ? AND chunk_index >= ? AND chunk_index <= ? ORDER BY chunk_index LIMIT ?",
      )
        .bind(id, nextChunkIndex, lastChunkIndex, QUERY_CHUNK_COUNT)
        .all<{ chunk_index: number; image_data: ArrayBuffer | Uint8Array }>();

      if (results.length === 0) {
        controller.close();
        return;
      }

      for (const row of results) {
        nextChunkIndex = row.chunk_index + 1;
        const chunk = new Uint8Array(row.image_data);
        const chunkStart = row.chunk_index * CHUNK_SIZE;
        const from = Math.max(0, rangeStart - chunkStart);
        const to = Math.min(chunk.byteLength, rangeEnd - chunkStart + 1);
        if (to > from) controller.enqueue(chunk.subarray(from, to));
      }

      if (nextChunkIndex > lastChunkIndex) controller.close();
    },
  });

  const headers = new Headers({
    "Content-Type": image.mime_type,
    "Content-Length": String(rangeEnd - rangeStart + 1),
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=31536000, immutable",
    "X-Content-Type-Options": "nosniff",
  });
  if (status === 206) {
    headers.set(
      "Content-Range",
      `bytes ${rangeStart}-${rangeEnd}/${contentLength}`,
    );
  }

  return new Response(body, { status, headers });
}
