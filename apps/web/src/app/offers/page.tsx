'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Calendar, Tag, ArrowRight, CheckCircle2, Copy, Check } from 'lucide-react';
import { SALON_IMAGES } from '@/data/salonImages';

export default function OffersPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const offers = [
    {
      code: 'WELCOME15',
      title: 'First-Visit Welcome Privilege',
      subtitle: '15% Off Any Service or Package',
      description: 'Receive 15% instant reduction on your inaugural salon visit when booking online. Valid on all haircuts, facial therapies, and hair spa treatments.',
      terms: 'Valid on services above ₹800. Applicable for new guests booking through our online scheduling portal.',
      validTill: 'Ongoing Season 2026',
      badge: 'New Guest Special',
      image: SALON_IMAGES.haircutOffer,
    },
    {
      code: 'BRIDALGLAM',
      title: 'Royal Bridal & Pre-Bridal Suite',
      subtitle: '20% Off Complete Bridal Package',
      description: 'Comprehensive luxury makeover package: HD / Airbrush makeup, bridal hair architecture, saree draping, and complimentary pre-wedding skin consultation.',
      terms: 'Advance booking advised. In-salon personalized trial consultation included.',
      validTill: 'Wedding Season 2026',
      badge: 'Bridal Privilege',
      image: SALON_IMAGES.bridalOffer,
    },
    {
      code: 'SPARELAX',
      title: 'Dermal Glow & Botanic Hair Spa Duo',
      subtitle: 'Complimentary Deep Conditioning Mask',
      description: 'Book any Radiance Vitamin-C or Anti-Tan facial and receive a complimentary Moroccan Argan deep conditioning hair restoration mask.',
      terms: 'Available on all weekdays (Monday – Friday). Both services completed in single appointment.',
      validTill: 'Valid all month',
      badge: 'Midweek Rejuvenation',
      image: SALON_IMAGES.spaOffer,
    },
    {
      code: 'FESTIVE20',
      title: 'Festive Occasion & Family Glamour',
      subtitle: '20% Off Group Booking (2+ Guests)',
      description: 'Planning for a family celebration or engagement? Book styling or makeup for 2 or more guests and enjoy an automatic 20% discount on total billing.',
      terms: 'Minimum 2 guests. Applicable on party makeup, blowouts, and signature haircuts.',
      validTill: 'Festive Holidays',
      badge: 'Group Celebration',
      image: SALON_IMAGES.hairStyling,
    },
  ];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  return (
    <div className="py-16 bg-salon-ivory min-h-screen transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-widest font-semibold text-salon-rose">
            Exclusive Privileges
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-salon-black">
            Promotions & Packages
          </h1>
          <p className="text-sm text-salon-muted">
            Enjoy curated beauty packages, festive privileges, and bridal specials at Beyond Beauty Saloon in Savedi, Ahilyanagar.
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {offers.map((offer) => {
            const isCopied = copiedCode === offer.code;
            return (
              <div
                key={offer.code}
                className="bg-white rounded-3xl border border-salon-gray overflow-hidden shadow-sm hover:shadow-luxury-hover hover:border-salon-rose/40 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Banner Image */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full bg-salon-rose text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                      {offer.badge}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-[11px] text-salon-gold font-semibold uppercase tracking-wider block">
                      {offer.subtitle}
                    </span>
                    <h3 className="font-serif text-xl font-bold drop-shadow-sm">
                      {offer.title}
                    </h3>
                  </div>
                </div>

                {/* Offer Details */}
                <div className="p-6 sm:p-8 space-y-5 flex-grow flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      {/* Promo Code Copy Pill */}
                      <button
                        type="button"
                        onClick={() => handleCopyCode(offer.code)}
                        className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-salon-ivory border border-salon-gray hover:border-salon-rose text-xs font-mono font-bold text-salon-black transition-colors"
                        title="Click to copy promo code"
                      >
                        <Tag className="w-3.5 h-3.5 text-salon-rose" />
                        <span>CODE: {offer.code}</span>
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600 ml-1" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-salon-muted ml-1" />
                        )}
                      </button>

                      <span className="text-[11px] text-salon-muted font-medium">
                        {offer.validTill}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-salon-muted leading-relaxed">
                      {offer.description}
                    </p>

                    <div className="p-3 bg-salon-ivory rounded-xl border border-salon-gray/60 text-[11px] text-salon-muted leading-relaxed">
                      <strong className="text-salon-black font-semibold">Terms:</strong> {offer.terms}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-salon-gray flex items-center justify-between gap-4">
                    <span className="text-[11px] text-salon-muted">
                      {isCopied ? (
                        <span className="text-emerald-600 font-semibold flex items-center">
                          <Check className="w-3 h-3 mr-1" /> Code copied!
                        </span>
                      ) : (
                        'Mention during booking'
                      )}
                    </span>

                    <Link
                      href={`/book?offer=${offer.code}`}
                      className="inline-flex items-center text-xs font-semibold px-5 py-2.5 rounded-full bg-salon-rose text-white hover:bg-salon-rose-dark shadow-xs transition-colors"
                    >
                      Book with Offer
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
