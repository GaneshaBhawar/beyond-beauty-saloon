// Curated high-resolution imagery for Beyond Beauty Saloon

export const SALON_IMAGES = {
  // Hero & Ambiance
  heroAmbiance: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1920&q=85',
  salonInterior: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
  washStations: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=1200&q=80',
  mirrorStations: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=80',

  // Service Categories
  hairCare: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800&q=80',
  hairStyling: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800&q=80',
  hairChemical: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=800&q=80',
  hairCareSpa: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=800&q=80',
  skinSpa: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
  skinCareFacial: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
  makeupGrooming: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
  bridalMakeup: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
  threadingGrooming: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',

  // Stylist Team Portraits
  stylistPriya: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
  stylistSneha: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
  stylistAarti: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=600&q=80',

  // Client Testimonials
  clientAnanya: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  clientPooja: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  clientMeera: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  clientRitu: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',

  // Work & Transformations
  transformHair: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80',
  transformSkin: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=800&q=80',
  transformBridal: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80',
  transformColor: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=800&q=80',

  // Offers & Banners
  bridalOffer: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
  spaOffer: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
  haircutOffer: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=800&q=80',
};

export interface GalleryItem {
  id: string;
  title: string;
  category: 'hair' | 'skin' | 'makeup' | 'ambiance';
  categoryLabel: string;
  image: string;
  description: string;
}

export const SALON_GALLERY: GalleryItem[] = [
  {
    id: 'g-1',
    title: 'Precision Feather Layers & Blowout',
    category: 'hair',
    categoryLabel: 'Hair Care & Styling',
    image: SALON_IMAGES.hairCare,
    description: 'Custom layered styling with thermal bounce finish at our styling station.',
  },
  {
    id: 'g-2',
    title: 'Custom Balayage & Highlight Tones',
    category: 'hair',
    categoryLabel: 'Chemical Treatments',
    image: SALON_IMAGES.hairChemical,
    description: 'Seamless dimensional honey balayage with zero-ammonia L’Oréal pigments.',
  },
  {
    id: 'g-3',
    title: 'Modern Salon Ambiance & Stations',
    category: 'ambiance',
    categoryLabel: 'Studio Ambiance',
    image: SALON_IMAGES.heroAmbiance,
    description: 'Spacious, hygienically maintained styling stations in Savedi, Ahilyanagar.',
  },
  {
    id: 'g-4',
    title: 'Radiance Dermal Glow Therapy',
    category: 'skin',
    categoryLabel: 'Skin & Spa',
    image: SALON_IMAGES.skinSpa,
    description: 'Antioxidant infusion and ultrasonic pore clarification for natural luminance.',
  },
  {
    id: 'g-5',
    title: 'Traditional HD Bridal Couture Makeover',
    category: 'makeup',
    categoryLabel: 'Makeup & Grooming',
    image: SALON_IMAGES.transformBridal,
    description: 'Full HD water-resistant bridal base with traditional hair architecture.',
  },
  {
    id: 'g-6',
    title: 'Relaxing Acupressure Hair Spa Station',
    category: 'ambiance',
    categoryLabel: 'Studio Ambiance',
    image: SALON_IMAGES.washStations,
    description: 'Deep moisture scalp therapy with warm towel infusion and head massage.',
  },
  {
    id: 'g-7',
    title: 'Antimicrobial Eyebrow Shaping',
    category: 'makeup',
    categoryLabel: 'Makeup & Grooming',
    image: SALON_IMAGES.threadingGrooming,
    description: 'Precise threading using organic antibacterial spools for crisp definition.',
  },
  {
    id: 'g-8',
    title: 'Special Occasion Party Glam',
    category: 'makeup',
    categoryLabel: 'Makeup & Grooming',
    image: SALON_IMAGES.bridalOffer,
    description: 'Evening glam makeup with soft smokey eyes and radiant cheek highlights.',
  },
];
