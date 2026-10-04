ALTER TABLE gallery_images ADD COLUMN mime_type TEXT NOT NULL DEFAULT 'image/jpeg';
ALTER TABLE gallery_images ADD COLUMN image_data BLOB;
