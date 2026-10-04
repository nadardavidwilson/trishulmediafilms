export type CouplePhotoCategory = 'Pre-wedding' | 'Wedding' | 'Portraits' | 'Details';

export type CouplePhoto = {
  src: string;
  alt: string;
  category: CouplePhotoCategory;
};

export type Couple = {
  slug: string;
  names: string;
  location: string;
  cover: string;
  photos: CouplePhoto[];
};

const coupleDefinitions: Couple[] = [
  {
    slug: 'couple-01',
    names: 'Prashant',
    location: 'Pre-wedding story',
    cover: '/gallery/couples/couple-01/images/Beach_4.webp',
    photos: [
      { src: '/gallery/couples/couple-01/images/Beach_4.webp', alt: 'Couple together at the beach', category: 'Pre-wedding' },
      { src: '/gallery/couples/couple-01/images/CST_9.webp', alt: 'Couple portrait near the Gateway of India', category: 'Pre-wedding' },
      { src: '/gallery/couples/couple-01/images/Marines_3.webp', alt: 'Couple walking together in the rain', category: 'Pre-wedding' },
      { src: '/gallery/couples/couple-01/images/Marines_4.webp', alt: 'Couple sharing an umbrella', category: 'Pre-wedding' },
      { src: '/gallery/couples/couple-01/images/Marines_8.webp', alt: 'Close portrait of the couple', category: 'Portraits' },
      { src: '/gallery/couples/couple-01/images/bridge_14.webp', alt: 'Couple sharing a quiet moment on a bridge', category: 'Portraits' },
      { src: '/gallery/couples/couple-01/images/bridge_2.webp', alt: 'Couple embracing outdoors', category: 'Pre-wedding' },
      { src: '/gallery/couples/couple-01/images/uran_2.webp', alt: 'Couple portrait at Uran', category: 'Portraits' },
    ],
  },
  {
    slug: 'couple-02',
    names: 'Kedar & Amruta',
    location: 'Wedding portraits',
    cover: '/gallery/couples/couple-02/images/GSP00615.webp',
    photos: [
      { src: '/gallery/couples/couple-02/images/GSP00615.webp', alt: 'Bride and groom posing together in wedding attire', category: 'Wedding' },
      { src: '/gallery/couples/couple-02/images/GSP00786.webp', alt: 'Bride and groom sharing a moment during their wedding', category: 'Wedding' },
      { src: '/gallery/couples/couple-02/images/GSP01310_.webp', alt: 'Close wedding portrait of the couple', category: 'Portraits' },
      { src: '/gallery/couples/couple-02/images/GSP01377.webp', alt: 'Bride and groom seated together', category: 'Wedding' },
      { src: '/gallery/couples/couple-02/images/GSP01393.webp', alt: 'The couple holding their cat in a wedding portrait', category: 'Details' },
      { src: '/gallery/couples/couple-02/images/GSP01425.webp', alt: 'Bride and groom sharing a quiet wedding moment', category: 'Wedding' },
    ],
  },
  {
    slug: 'couple-03',
    names: 'Naveen & Selvi',
    location: 'Pre Wedding portraits',
    cover: '/gallery/couples/couple-03/images/Lane_1.webp',
    photos: [
      { src: '/gallery/couples/couple-03/images/beach_1.webp', alt: 'Expecting couple walking by the water', category: 'Pre-wedding' },
      { src: '/gallery/couples/couple-03/images/beach_2.webp', alt: 'Couple sharing a moment at the beach', category: 'Pre-wedding' },
      { src: '/gallery/couples/couple-03/images/beach_3.webp', alt: 'Maternity portrait beside the sea', category: 'Portraits' },
      { src: '/gallery/couples/couple-03/images/beach_4.webp', alt: 'Expecting couple together on the shore', category: 'Pre-wedding' },
      { src: '/gallery/couples/couple-03/images/Collage_2.webp', alt: 'A collage of the couple’s beach portraits', category: 'Details' },
      { src: '/gallery/couples/couple-03/images/Collage_3.webp', alt: 'A collage of maternity and couple moments', category: 'Details' },
      { src: '/gallery/couples/couple-03/images/CST_1.webp', alt: 'Couple portrait near the Gateway of India', category: 'Portraits' },
      { src: '/gallery/couples/couple-03/images/CST_2.webp', alt: 'Expecting couple posing in the city', category: 'Pre-wedding' },
      { src: '/gallery/couples/couple-03/images/CST_3.webp', alt: 'Maternity portrait in Mumbai', category: 'Portraits' },
      { src: '/gallery/couples/couple-03/images/CST_6.webp', alt: 'Couple sharing a moment by the waterfront', category: 'Pre-wedding' },
      { src: '/gallery/couples/couple-03/images/CST_9.webp', alt: 'Expecting couple together near the waterfront', category: 'Pre-wedding' },
      { src: '/gallery/couples/couple-03/images/CST_11.webp', alt: 'Couple portrait at the Gateway of India', category: 'Portraits' },
      { src: '/gallery/couples/couple-03/images/Lane_1.webp', alt: 'Expecting couple walking through a heritage lane', category: 'Pre-wedding' },
      { src: '/gallery/couples/couple-03/images/Lane_2.webp', alt: 'Couple portrait beneath a heritage archway', category: 'Portraits' },
      { src: '/gallery/couples/couple-03/images/Lane_3.webp', alt: 'Maternity portrait in a historic lane', category: 'Portraits' },
    ],
  },
  {
    slug: 'couple-04',
    names: 'Mahesh & Supriya',
    location: 'Wedding portraits',
    cover: '/gallery/couples/couple-04/images/GSP01917.webp',
    photos: [
      { src: '/gallery/couples/couple-04/images/GSP01762.webp', alt: 'Bride and groom together in wedding attire', category: 'Wedding' },
      { src: '/gallery/couples/couple-04/images/GSP01798.webp', alt: 'Wedding portrait of the couple', category: 'Wedding' },
      { src: '/gallery/couples/couple-04/images/GSP01917.webp', alt: 'Bride and groom sharing a close moment', category: 'Portraits' },
      { src: '/gallery/couples/couple-04/images/GSP01946.webp', alt: 'Bride and groom posing together', category: 'Wedding' },
      { src: '/gallery/couples/couple-04/images/GSP01996.webp', alt: 'A candid moment from the couple’s wedding', category: 'Wedding' },
      { src: '/gallery/couples/couple-04/images/GSP02139.webp', alt: 'Wedding portrait of the newlyweds', category: 'Portraits' },
      { src: '/gallery/couples/couple-04/images/GSP02425.webp', alt: 'Bride and groom in a wedding portrait', category: 'Wedding' },
      { src: '/gallery/couples/couple-04/images/GSP02461.webp', alt: 'The couple sharing a wedding moment', category: 'Wedding' },
      { src: '/gallery/couples/couple-04/images/GSP02489.webp', alt: 'Close portrait of the newlyweds', category: 'Portraits' },
    ],
  },
  {
    slug: 'couple-05',
    names: 'Laxmi Priya & Praveen',
    location: 'Post-wedding portraits',
    cover: '/gallery/couples/couple-05/images/DSC01607.webp',
    photos: [
      { src: '/gallery/couples/couple-05/images/Collage-01.webp', alt: 'A collage of the couple’s post-wedding portraits', category: 'Details' },
      { src: '/gallery/couples/couple-05/images/DSC00698.webp', alt: 'Bride in traditional wedding attire', category: 'Portraits' },
      { src: '/gallery/couples/couple-05/images/DSC00794_.webp', alt: 'Couple sharing a post-wedding moment', category: 'Wedding' },
      { src: '/gallery/couples/couple-05/images/DSC01098.webp', alt: 'Bride and groom in a post-wedding portrait', category: 'Wedding' },
      { src: '/gallery/couples/couple-05/images/DSC01133.webp', alt: 'The newlyweds posing together', category: 'Wedding' },
      { src: '/gallery/couples/couple-05/images/DSC01290.webp', alt: 'Couple seated together after their wedding', category: 'Wedding' },
      { src: '/gallery/couples/couple-05/images/DSC01308.webp', alt: 'Bride and groom sharing a quiet moment', category: 'Wedding' },
      { src: '/gallery/couples/couple-05/images/DSC01339_.webp', alt: 'Post-wedding portrait of the couple', category: 'Wedding' },
      { src: '/gallery/couples/couple-05/images/DSC01392.webp', alt: 'Bride and groom together in traditional attire', category: 'Wedding' },
      { src: '/gallery/couples/couple-05/images/DSC01429.webp', alt: 'Portrait of the bride after the ceremony', category: 'Portraits' },
      { src: '/gallery/couples/couple-05/images/DSC01443.webp', alt: 'A candid moment with the newlyweds', category: 'Wedding' },
      { src: '/gallery/couples/couple-05/images/DSC01448.webp', alt: 'The couple posing together after their wedding', category: 'Wedding' },
      { src: '/gallery/couples/couple-05/images/DSC01461.webp', alt: 'Bride and groom in a traditional portrait', category: 'Wedding' },
      { src: '/gallery/couples/couple-05/images/DSC01527.webp', alt: 'Close post-wedding portrait of the couple', category: 'Portraits' },
      { src: '/gallery/couples/couple-05/images/DSC01607.webp', alt: 'Newlyweds sharing a portrait together', category: 'Wedding' },
      { src: '/gallery/couples/couple-05/images/DSC01688.webp', alt: 'Bride and groom during their post-wedding session', category: 'Wedding' },
      { src: '/gallery/couples/couple-05/images/DSC01729.webp', alt: 'Traditional portrait of the newlyweds', category: 'Wedding' },
      { src: '/gallery/couples/couple-05/images/DSC01747.webp', alt: 'Couple sharing a post-wedding moment', category: 'Wedding' },
      { src: '/gallery/couples/couple-05/images/DSC01864.webp', alt: 'Bride and groom together after the ceremony', category: 'Wedding' },
      { src: '/gallery/couples/couple-05/images/DSC01868.webp', alt: 'Post-wedding portrait of the newlyweds', category: 'Wedding' },
      { src: '/gallery/couples/couple-05/images/GSP04308.webp', alt: 'Bride in a traditional portrait', category: 'Portraits' },
      { src: '/gallery/couples/couple-05/images/Village_1.webp', alt: 'Newlyweds in a post-wedding portrait', category: 'Wedding' },
    ],
  },
];

function databaseImageUrl(coupleSlug: string, publicPath: string) {
  const filename = publicPath.slice(publicPath.lastIndexOf('/') + 1);
  const extensionIndex = filename.lastIndexOf('.');
  const imageName = extensionIndex === -1 ? filename : filename.slice(0, extensionIndex);
  return `/api/images/${coupleSlug}-${imageName}`;
}

export const couples = coupleDefinitions.map((couple) => ({
  ...couple,
  cover: databaseImageUrl(couple.slug, couple.cover),
  photos: couple.photos.map((photo) => ({
    ...photo,
    src: databaseImageUrl(couple.slug, photo.src),
  })),
}));