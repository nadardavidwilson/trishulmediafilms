CREATE TABLE IF NOT EXISTS gallery_image_chunks (
  image_id TEXT NOT NULL REFERENCES gallery_images(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  image_data BLOB NOT NULL,
  PRIMARY KEY (image_id, chunk_index)
);
