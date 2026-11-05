import React from 'react';

interface BrandLogoProps {
  variant?: 'navbar' | 'footer' | 'mark' | 'hero';
  className?: string;
}

export function BrandLogo({ variant = 'navbar', className = '' }: BrandLogoProps) {
  if (variant === 'mark') {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="markRoseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--theme-primary, #B78693)" />
              <stop offset="100%" stopColor="var(--theme-primary-dark, #9A6B78)" />
            </linearGradient>
            <linearGradient id="markGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DFC386" />
              <stop offset="50%" stopColor="var(--theme-accent, #B79A62)" />
              <stop offset="100%" stopColor="#9E7D44" />
            </linearGradient>
          </defs>

          {/* Luxury Circular Frame */}
          <circle cx="50" cy="50" r="46" stroke="url(#markGoldGrad)" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="41" fill="url(#markRoseGrad)" fillOpacity="0.12" stroke="url(#markRoseGrad)" strokeWidth="1" />

          {/* Central Stylized Crown / Bloom / Shears Crest */}
          <path
            d="M50 20 L53 32 L65 30 L56 39 L62 50 L50 44 L38 50 L44 39 L35 30 L47 32 Z"
            fill="url(#markGoldGrad)"
            opacity="0.95"
          />

          {/* Elegant Scissor blades intersecting */}
          <path
            d="M34 76 C37 76 40 73 40 69 C40 65 37 62 33 62 C29 62 26 65 26 69 C26 73 29 76 34 76 Z"
            stroke="url(#markRoseGrad)"
            strokeWidth="2.5"
            fill="none"
          />
          <path
            d="M66 76 C69 76 72 73 72 69 C72 65 69 62 65 62 C61 62 58 65 58 69 C58 73 61 76 66 76 Z"
            stroke="url(#markRoseGrad)"
            strokeWidth="2.5"
            fill="none"
          />
          <path
            d="M37 64 L50 47 L63 64"
            stroke="url(#markRoseGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M50 47 L58 35 M50 47 L42 35"
            stroke="url(#markGoldGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Sparkles */}
          <circle cx="50" cy="47" r="2.5" fill="url(#markGoldGrad)" />
          <path d="M22 38 L25 41 L22 44 L19 41 Z" fill="url(#markGoldGrad)" opacity="0.8" />
          <path d="M78 38 L81 41 L78 44 L75 41 Z" fill="url(#markGoldGrad)" opacity="0.8" />
        </svg>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`flex items-center space-x-3.5 ${className}`}>
        <div className="w-12 h-12 shrink-0">
          <BrandLogo variant="mark" className="w-12 h-12" />
        </div>
        <div className="flex flex-col">
          <span className="font-serif text-2xl font-bold tracking-tight text-white leading-none">
            Beyond Beauty
          </span>
          <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-salon-gold mt-1">
            Saloon & Bridal Studio
          </span>
          <span className="text-[9px] text-neutral-400 tracking-wider uppercase mt-0.5">
            Savedi • Ahilyanagar
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <div className={`flex flex-col items-center text-center space-y-2 ${className}`}>
        <div className="w-20 h-20 mb-2">
          <BrandLogo variant="mark" className="w-20 h-20" />
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-salon-black">
          Beyond Beauty <span className="font-normal italic text-salon-rose">Saloon</span>
        </h2>
        <p className="text-xs tracking-[0.3em] uppercase font-semibold text-salon-gold">
          Ahilyanagar’s Premier Sanctuary for Hair, Skin & Bridal
        </p>
      </div>
    );
  }

  // Navbar default variant
  return (
    <div className={`flex items-center space-x-2 sm:space-x-3.5 group min-w-0 ${className}`}>
      <div className="w-9 h-9 sm:w-11 sm:h-11 md:w-[52px] md:h-[52px] shrink-0 group-hover:scale-105 transition-transform duration-300">
        <BrandLogo variant="mark" className="w-9 h-9 sm:w-11 sm:h-11 md:w-[52px] md:h-[52px]" />
      </div>
      <div className="flex flex-col justify-center min-w-0">
        <span className="text-base sm:text-lg md:text-xl lg:text-[22px] font-extrabold tracking-tight text-salon-black leading-tight group-hover:text-salon-rose transition-colors truncate">
          Beyond Beauty Saloon
        </span>
        <span className="text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.15em] sm:tracking-[0.2em] uppercase font-semibold text-salon-gold leading-none mt-0.5 truncate">
          Savedi · Ahilyanagar
        </span>
      </div>
    </div>
  );
}

