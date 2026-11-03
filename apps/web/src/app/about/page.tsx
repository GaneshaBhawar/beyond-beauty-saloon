'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart, ShieldCheck, Award, MapPin, Phone, ArrowRight, CheckCircle2, Clock, Star } from 'lucide-react';
import { SALON_IMAGES } from '@/data/salonImages';
import { BrandLogo } from '@/components/BrandLogo';

export default function AboutPage() {
  const teamMembers = [
    {
      name: 'Priya Deshmukh',
      role: 'Senior Hair Stylist & Educator',
      experience: '8+ Years Industry Mastery',
      specialty: 'Precision layering, face-framing bobs, thermal blowouts, & hair texture management.',
      image: SALON_IMAGES.stylistPriya,
    },
    {
      name: 'Sneha Patil',
      role: 'Head Bridal & Dermal Aesthetician',
      experience: '6+ Years Bridal Excellence',
      specialty: 'HD Airbrush makeup, traditional saree draping, Vitamin C brightening facials.',
      image: SALON_IMAGES.stylistSneha,
    },
    {
      name: 'Aarti Shinde',
      role: 'Botanic Spa & Color Specialist',
      experience: '5+ Years Care Mastery',
      specialty: 'L’Oréal deep nourishment spas, ammonia-free balayage, scalp detox therapies.',
      image: SALON_IMAGES.stylistAarti,
    },
  ];

  return (
    <div className="py-16 bg-salon-ivory min-h-screen transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header with Brand Logo */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-salon-rose-light text-xs font-semibold text-salon-rose-dark uppercase tracking-wider border border-salon-rose/20">
            <Sparkles className="w-3.5 h-3.5 text-salon-rose" />
            <span>Heritage & Philosophy</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-salon-black">
            About Beyond Beauty Saloon
          </h1>
          <p className="text-sm sm:text-base text-salon-muted leading-relaxed">
            Conveniently situated in Shrikrishna Nagar / Savedi, near Kohinoor Mangal Karyalaya in Ahilyanagar. We were established to bring modern haute-coiffure hair artistry, scientific dermal skincare, and royal bridal perfection to our community.
          </p>
        </div>

        {/* Feature Hero Card with Salon Atmosphere Photo */}
        <div className="bg-white rounded-3xl border border-salon-gray overflow-hidden shadow-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-[460px] w-full">
              <img
                src={SALON_IMAGES.salonInterior}
                alt="Beyond Beauty Saloon Interior in Ahilyanagar"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-6 text-white">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-salon-gold block">
                  Studio Atmosphere
                </span>
                <h3 className="font-serif text-xl font-bold">
                  Serenity, Hygiene & Elegance in Savedi
                </h3>
              </div>
            </div>

            <div className="lg:col-span-5 p-8 sm:p-10 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-salon-gold">
                  Our Mission
                </span>
                <h3 className="font-serif text-2xl font-bold text-salon-black">
                  Personalized Beauty, Never Generic
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-salon-muted leading-relaxed">
                At Beyond Beauty Saloon, we believe true elegance begins with attentive listening. Every appointment starts with an individualized consultation assessing your hair health, facial symmetry, and aesthetic preferences.
              </p>

              <div className="space-y-3 pt-2 text-xs text-salon-black">
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-salon-gold shrink-0" />
                  <span>UV Sterilized instruments for every client</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-salon-gold shrink-0" />
                  <span>Authentic products from L’Oréal, O3+, & MAC</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-salon-gold shrink-0" />
                  <span>Transparent upfront pricing with zero surprises</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/book"
                  className="inline-flex items-center px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-salon-rose hover:bg-salon-rose-dark transition-colors shadow-sm"
                >
                  Schedule Your Visit
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Master Stylists Team Section */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-widest font-semibold text-salon-rose">
              Our Artisans
            </span>
            <h2 className="font-serif text-3xl font-bold text-salon-black">
              Meet Our Senior Specialists
            </h2>
            <p className="text-xs sm:text-sm text-salon-muted">
              Certified professionals trained in modern precision cutting, dermal rejuvenation, and traditional bridal couture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-3xl border border-salon-gray overflow-hidden shadow-sm hover:shadow-luxury-hover hover:border-salon-rose/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative h-64 w-full overflow-hidden bg-neutral-100">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-[11px] font-semibold text-salon-gold uppercase tracking-wider block">
                      {member.experience}
                    </span>
                    <h3 className="font-serif text-lg font-bold">
                      {member.name}
                    </h3>
                  </div>
                </div>

                <div className="p-6 space-y-3 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-salon-rose block">
                      {member.role}
                    </span>
                    <p className="text-xs text-salon-muted leading-relaxed">
                      {member.specialty}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-salon-gray">
                    <Link
                      href={`/book?stylist=${encodeURIComponent(member.name)}`}
                      className="text-xs font-semibold text-salon-black hover:text-salon-rose inline-flex items-center"
                    >
                      Book with {member.name.split(' ')[0]}
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Studio Gallery Grid */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-widest font-semibold text-salon-rose">
              Visual Tour
            </span>
            <h2 className="font-serif text-3xl font-bold text-salon-black">
              Inside Our Savedi Studio
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative h-60 rounded-2xl overflow-hidden border border-salon-gray group">
              <img
                src={SALON_IMAGES.washStations}
                alt="Hair Wash Station"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/30 flex items-end p-4">
                <span className="text-white text-xs font-semibold">Ergonomic Hair Spa Stations</span>
              </div>
            </div>

            <div className="relative h-60 rounded-2xl overflow-hidden border border-salon-gray group">
              <img
                src={SALON_IMAGES.mirrorStations}
                alt="Styling Stations"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/30 flex items-end p-4">
                <span className="text-white text-xs font-semibold">Custom Illuminated Mirrors</span>
              </div>
            </div>

            <div className="relative h-60 rounded-2xl overflow-hidden border border-salon-gray group">
              <img
                src={SALON_IMAGES.heroAmbiance}
                alt="Bridal Lounge"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/30 flex items-end p-4">
                <span className="text-white text-xs font-semibold">Private Bridal Suite</span>
              </div>
            </div>
          </div>
        </div>

        {/* Location & Invitation */}
        <div className="bg-white rounded-3xl border border-salon-gray p-8 sm:p-10 shadow-sm space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-salon-gold">
              Ahilyanagar • Savedi
            </span>
            <h2 className="font-serif text-2xl font-bold text-salon-black">
              Visit Us in Person
            </h2>
            <p className="text-xs sm:text-sm text-salon-muted leading-relaxed">
              Located conveniently in Shrikrishna Nagar / Savedi, near Kohinoor Mangal Karyalaya, Ahilyanagar 414003. We welcome appointments and consultations 7 days a week from 10:00 AM to 8:00 PM.
            </p>
          </div>

          <div className="pt-4 border-t border-salon-gray flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-salon-muted">
              Call salon reception: <strong className="text-salon-black">+91 98235 73781</strong> or <strong className="text-salon-black">+91 97307 68487</strong>
            </div>
            <Link
              href="/book"
              className="inline-flex items-center px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-salon-rose hover:bg-salon-rose-dark transition-colors shadow-xs"
            >
              Book an Appointment
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
