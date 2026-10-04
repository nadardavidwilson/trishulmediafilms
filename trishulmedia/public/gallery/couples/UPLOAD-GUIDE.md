# Couple gallery uploads

Each couple has a separate staging folder. Put optimized `.webp` files in that couple's `images/` folder before importing them into D1.

```text
public/gallery/couples/
  couple-01/
    images/
      01.webp
      02.webp
  couple-02/
    images/
  couple-03/
    images/
  couple-04/
    images/
  couple-05/
    images/
```

For a new album, add each image to `photos` in `app/data/couples.ts` and set `cover` to the chosen image path. Keep the path and filename there after import; the app uses its filename to create the matching D1 image ID. Add useful alt text and a category (`Pre-wedding`, `Wedding`, `Portraits`, or `Details`).

Import the staged WebP files into both databases while they are still in `public/`:

```sh
npm run import:couple-gallery:local
npm run import:couple-gallery
```

The first command fills local D1 for `npm run dev` and `npm start`; the second fills remote D1 for deployment. After both imports succeed, the staged WebP files can be removed from `public/gallery/couples/`. The gallery images are then served by `/api/images/<couple-slug>-<filename>`.