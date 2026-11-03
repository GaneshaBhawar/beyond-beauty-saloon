'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  CheckCircle2,
  ArrowRight,
  Scissors,
  Droplets,
  Heart,
  Crown,
  Users,
  MessageCircle,
  Navigation,
  ExternalLink,
  X,
  Eye,
  Filter,
} from 'lucide-react';
import { SALON_IMAGES, SALON_GALLERY, GalleryItem } from '@/data/salonImages';
import { BrandLogo } from '@/components/BrandLogo';

export default function HomePage() {
  const [galleryCategory, setGalleryCategory] = useState<string>('all');
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItem | null>(null);

  const googleMapsUrl =
    'https://www.google.com/maps/search/?api=1&query=Beyond+Beauty+Saloon+Shrikrishna+Nagar+Savedi+Ahilyanagar+Maharashtra+414003';

  // 4 Core Service Categories as specified in PRD Section 5
  const serviceCategories = [
    {
      title: 'Hair Care',
      subtitle: 'Precision Haircuts & Styling',
      desc: 'Expert face-framing cuts, deep feather layers, bouncy blowouts, and restorative split-end trims tailored to your hair texture.',
      sampleServices: ['Classic Blow-Dry & Styling', 'Deep Layered Haircut', 'Precision Hair Trims', 'Occasion Curls & Thermal Waves'],
      slug: 'hair-styling',
      image: SALON_IMAGES.hairCare,
    },
    {
      title: 'Hair Chemical Treatments',
      subtitle: 'Coloring, Balayage & Straightening',
      desc: 'Custom balayage, dimensional highlights, radiant root touchups, keratin hair smoothing, and chemical rebonding using gentle L’Oréal formulations.',
      sampleServices: ['Dimensional Honey Balayage', 'Global Color & Highlights', 'Keratin Smoothing Therapy', 'Hair Rebonding & Straightening'],
      slug: 'hair-care',
      image: SALON_IMAGES.hairChemical,
    },
    {
      title: 'Skin and Spa',
      subtitle: 'Clinical Facials & Rejuvenation',
      desc: 'Ultrasonic pore clarifying cleanups, antioxidant Vitamin-C facials, organic dermal nourishment, and deep moisture acupressure hair spas.',
      sampleServices: ['Radiance Glow Facial', 'Herbal Pore Cleanup', 'Anti-Tan Dermal Rejuvenation', 'L’Oréal Hair Spa Restoration'],
      slug: 'skin-care',
      image: SALON_IMAGES.skinSpa,
    },
    {
      title: 'Makeup and Grooming',
      subtitle: 'Bridal Couture & Basic Grooming',
      desc: 'Full HD water-resistant bridal suites, party glam event makeup, saree/lehenga draping, and antimicrobial organic thread eyebrow shaping.',
      sampleServices: ['HD Bridal Makeover Suite', 'Special Occasion Party Glam', 'Eyebrow Shaping & Upper Lip', 'Complete Facial Waxing & Grooming'],
      slug: 'makeup',
      image: SALON_IMAGES.makeupGrooming,
    },
  ];

  // Filter gallery items
  const filteredGallery =
    galleryCategory === 'all'
      ? SALON_GALLERY
      : SALON_GALLERY.filter((item) => item.category === galleryCategory);

  // Business provided reviews
  const reviews = [
    {
      name: 'Ananya Sharma',
      service: 'Layered Cut & Blowout',
      image: SALON_IMAGES.clientAnanya,
      quote:
        'Priya did a fantastic job with my hair! She understood exactly the face-framing layers I wanted. The salon ambiance in Savedi is clean, calm, and truly relaxing.',
      rating: 5,
    },
    {
      name: 'Pooja Kulkarni',
      service: 'Radiance Glow Facial',
      image: SALON_IMAGES.clientPooja,
      quote:
        'The Vitamin-C facial made my skin look hydrated and refreshed without any harsh irritation. Hospital-grade cleanliness and single-use towels are strictly followed here.',
      rating: 5,
    },
    {
      name: 'Meera Rajput',
      service: 'L’Oréal Hair Spa & Trim',
      image: SALON_IMAGES.clientMeera,
      quote:
        'The hair spa massage was wonderfully relaxing. Honest stylist guidance with no pushy product upselling. Will definitely be a regular visitor in Savedi.',
      rating: 5,
    },
  ];

  return (
    <div className="flex flex-col bg-[#FAF8F5] text-[#272525] font-sans transition-colors duration-300">
      
      {/* Schema.org LocalBusiness Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BeautySalon',
            name: 'Beyond Beauty Saloon',
            image: SALON_IMAGES.heroAmbiance,
            telephone: '+919823573781',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Shrikrishna Nagar, Savedi',
              addressLocality: 'Ahilyanagar',
              addressRegion: 'Maharashtra',
              postalCode: '414003',
              addressCountry: 'IN',
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: 19.1158,
              longitude: 74.7294,
            },
            openingHoursSpecification: [
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                opens: '08:30',
                closes: '21:30',
              },
            ],
            priceRange: '₹120 - ₹25000',
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.7',
              reviewCount: '100',
            },
          }),
        }}
      />

      {/* ============================================================== */}
      {/* 1. HERO SECTION (TOP PRIORITY)                                  */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden min-h-[580px] lg:min-h-[660px] flex items-center justify-center border-b border-[#EAE6E3]">
        {/* Background photo layer: Clean, high-res salon photograph with subtle legibility overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={SALON_IMAGES.heroAmbiance}
            alt="Beyond Beauty Saloon Luxury Interior in Savedi"
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
          {/* Subtle gradient overlay for contrast while preserving photo clarity */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/65" />
        </div>

        {/* Hero Content: Sharp, high-contrast text and action buttons */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center text-white space-y-6">
          
          {/* Introductory Line */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-bold text-[#C7A77D] tracking-widest uppercase shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C7A77D]" />
            <span>BEYOND BEAUTY SALOON • AHILYANAGAR</span>
          </div>

          {/* Primary Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.15] drop-shadow-sm font-sans">
            Beauty Beyond <br className="hidden sm:inline" />
            <span className="text-[#C7A77D]">Expectations</span>
          </h1>

          {/* Supporting Copy */}
          <p className="text-base sm:text-xl text-neutral-200 max-w-2xl mx-auto leading-relaxed font-normal">
            Discover a personalised beauty and grooming experience at Beyond Beauty Saloon, Savedi.
          </p>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/book"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full text-xs font-bold tracking-wider uppercase text-white bg-[#B76E79] hover:bg-[#9A5A64] shadow-lg hover:shadow-xl hover:scale-102 transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Book Appointment
            </Link>

            <a
              href="#services"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full text-xs font-bold tracking-wider uppercase text-white bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-md shadow-md transition-all cursor-pointer"
            >
              Explore Services
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-white/20 text-neutral-200 text-xs">
            <div className="space-y-0.5">
              <span className="block font-bold text-white text-sm">Shrikrishna Nagar</span>
              <span className="text-neutral-300 text-[11px]">Savedi, Ahilyanagar</span>
            </div>
            <div className="space-y-0.5">
              <span className="block font-bold text-white text-sm">Tue – Sun Schedule</span>
              <span className="text-neutral-300 text-[11px]">8:30 AM – 9:30 PM (Mon Closed)</span>
            </div>
            <div className="space-y-0.5">
              <span className="block font-bold text-white text-sm flex items-center justify-center">
                4.7 Rating
                <Star className="w-3.5 h-3.5 fill-[#C7A77D] text-[#C7A77D] ml-1 inline" />
              </span>
              <span className="text-neutral-300 text-[11px]">100+ Verified Client Reviews</span>
            </div>
            <div className="space-y-0.5">
              <span className="block font-bold text-white text-sm">Sterilized Instruments</span>
              <span className="text-neutral-300 text-[11px]">UV Sanitized Protocol</span>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. SERVICES SECTION                                             */}
      {/* ============================================================== */}
      <section id="services" className="py-20 bg-white border-b border-[#EAE6E3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-widest font-bold text-[#B76E79]">
              Curated Treatments
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#272525] tracking-tight">
              Personalised Beauty & Hair Care
            </h2>
            <p className="text-sm text-[#707070] leading-relaxed">
              Explore custom haircutting, advanced color treatments, skin therapies, and bridal grooming tailored around you.
            </p>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {serviceCategories.map((cat) => (
              <div
                key={cat.title}
                className="bg-[#FAF8F5] rounded-3xl overflow-hidden border border-[#EAE6E3] hover:border-[#B76E79]/50 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Image Header */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-lg font-bold text-white drop-shadow-sm leading-tight">
                      {cat.title}
                    </h3>
                    <span className="text-[11px] text-[#C7A77D] font-medium block">
                      {cat.subtitle}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-grow space-y-4 flex flex-col justify-between">
                  <p className="text-xs text-[#707070] leading-relaxed">
                    {cat.desc}
                  </p>

                  <div className="pt-2 space-y-1.5 border-t border-[#EAE6E3]">
                    {cat.sampleServices.map((srv, idx) => (
                      <div key={idx} className="flex items-center text-xs text-[#272525]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C7A77D] mr-2 shrink-0" />
                        <span className="truncate">{srv}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-[#EAE6E3]">
                    <Link
                      href={`/services?category=${cat.slug}`}
                      className="text-xs font-bold text-[#B76E79] group-hover:text-[#9A5A64] inline-flex items-center"
                    >
                      View Services
                      <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                    </Link>

                    <Link
                      href={`/book?category=${cat.slug}`}
                      className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-white text-[#272525] border border-[#EAE6E3] hover:border-[#B76E79] hover:bg-[#FAF8F5] transition-all"
                    >
                      Book
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              href="/services"
              className="inline-flex items-center px-8 py-3.5 rounded-full text-xs uppercase tracking-wider font-bold text-[#272525] bg-[#FAF8F5] hover:bg-[#B76E79] hover:text-white border border-[#EAE6E3] transition-all shadow-xs"
            >
              Browse Complete Service Catalog & Rates
              <ArrowRight className="w-3.5 h-3.5 ml-2" />
            </Link>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. WHY CHOOSE US SECTION                                        */}
      {/* ============================================================== */}
      <section className="py-20 bg-[#FAF8F5] border-b border-[#EAE6E3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-widest font-bold text-[#B76E79]">
              The Beyond Beauty Standard
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#272525] tracking-tight">
              Why Clients Choose Our Salon
            </h2>
            <p className="text-sm text-[#707070] leading-relaxed">
              We focus on thoughtful consultations, hospital-grade instrument hygiene, and dependable scheduling in Savedi.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white p-6 rounded-3xl border border-[#EAE6E3] shadow-xs space-y-3">
              <span className="w-10 h-10 rounded-2xl bg-rose-50 text-[#B76E79] flex items-center justify-center font-bold">
                <Heart className="w-5 h-5" />
              </span>
              <h3 className="font-bold text-base text-[#272525]">Personalised Beauty</h3>
              <p className="text-xs text-[#707070] leading-relaxed">
                Every hair cut, facial treatment, and bridal look begins with a one-on-one consultation addressing your hair texture, skin sensitivity, and style.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#EAE6E3] shadow-xs space-y-3">
              <span className="w-10 h-10 rounded-2xl bg-amber-50 text-[#C7A77D] flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </span>
              <h3 className="font-bold text-base text-[#272525]">Convenient Booking</h3>
              <p className="text-xs text-[#707070] leading-relaxed">
                Simple online appointment reservation with real-time slot selection and zero double-booking policy. We value your time.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#EAE6E3] shadow-xs space-y-3">
              <span className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Scissors className="w-5 h-5" />
              </span>
              <h3 className="font-bold text-base text-[#272525]">Complete Hair & Skin</h3>
              <p className="text-xs text-[#707070] leading-relaxed">
                From precision feather cuts and gentle balayage coloring to deep clarifying dermal facials and Nauvari saree draping under one roof.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#EAE6E3] shadow-xs space-y-3">
              <span className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h3 className="font-bold text-base text-[#272525]">Comfortable Sanctuary</h3>
              <p className="text-xs text-[#707070] leading-relaxed">
                Hospital-grade UV instrument sterilization, single-use biodegradable gowns and towels, and a welcoming air-conditioned salon space.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. PHOTO GALLERY SECTION (WITH INTERACTIVE LIGHTBOX)            */}
      {/* ============================================================== */}
      <section id="gallery" className="py-20 bg-white border-b border-[#EAE6E3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#EAE6E3] pb-6">
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-[#B76E79]">
                Visual Portfolio
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#272525] tracking-tight mt-1">
                Photo Gallery Preview
              </h2>
              <p className="text-sm text-[#707070] mt-1">
                A glimpse inside our Savedi studio, styling artistry, and client transformations.
              </p>
            </div>

            {/* Gallery Category Filter */}
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              {[
                { id: 'all', label: 'All Photos' },
                { id: 'hair', label: 'Hair & Styling' },
                { id: 'skin', label: 'Skin & Spa' },
                { id: 'makeup', label: 'Makeup & Bridal' },
                { id: 'ambiance', label: 'Salon Ambiance' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setGalleryCategory(tab.id)}
                  className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
                    galleryCategory === tab.id
                      ? 'bg-[#B76E79] text-white shadow-xs font-bold'
                      : 'bg-[#FAF8F5] text-[#272525] border border-[#EAE6E3] hover:border-[#B76E79]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredGallery.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedGalleryItem(item)}
                className="group relative h-64 rounded-3xl overflow-hidden border border-[#EAE6E3] shadow-xs cursor-pointer bg-[#FAF8F5]"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                <div className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-md text-[#272525] opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="w-3.5 h-3.5 text-[#B76E79]" />
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#C7A77D] tracking-wider block">
                    {item.categoryLabel}
                  </span>
                  <h4 className="font-bold text-sm leading-tight drop-shadow-xs">
                    {item.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. ABOUT SECTION                                                */}
      {/* ============================================================== */}
      <section className="py-20 bg-[#FAF8F5] border-b border-[#EAE6E3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Salon Photograph */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden border border-[#EAE6E3] shadow-luxury">
                <img
                  src={SALON_IMAGES.salonInterior}
                  alt="Beyond Beauty Saloon Sanctuary in Savedi"
                  className="w-full h-[400px] sm:h-[460px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-2 sm:right-6 bg-white rounded-2xl p-4 shadow-xl border border-[#EAE6E3] max-w-xs space-y-1">
                <div className="flex items-center space-x-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#C7A77D] text-[#C7A77D]" />
                  ))}
                </div>
                <span className="font-bold text-xs text-[#272525] block">
                  Ahilyanagar’s Premier Destination
                </span>
                <span className="text-[10px] text-[#707070]">
                  Hospital-grade hygiene & gentle formulations.
                </span>
              </div>
            </div>

            {/* Right: Narrative & CTAs */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest font-bold text-[#B76E79]">
                  About Beyond Beauty Saloon
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#272525] tracking-tight">
                  A Welcoming Sanctuary for Beauty & Self-Care
                </h2>
              </div>

              <p className="text-sm text-[#707070] leading-relaxed">
                Located in Shrikrishna Nagar, Savedi, Beyond Beauty Saloon was established with a singular vision: to offer women in Ahilyanagar a calm, hygienic, and personalized salon space where hair and skincare are treated with authentic expertise.
              </p>

              <p className="text-sm text-[#707070] leading-relaxed">
                We strictly utilize genuine formulations from L’Oréal Professionnel, O3+, and MAC Cosmetics, accompanied by hospital-grade UV sterilization of all metal instruments. Whether you are seeking a refreshing haircut, restorative hair spa, or complete bridal couture styling, we treat every visit with the attention it deserves.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                <Link
                  href="/book"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#B76E79] hover:bg-[#9A5A64] shadow-xs transition-all"
                >
                  <Calendar className="w-3.5 h-3.5 mr-2" />
                  Schedule Your Visit
                </Link>

                <Link
                  href="/about"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-[#272525] bg-white hover:bg-[#FAF8F5] border border-[#EAE6E3] transition-colors"
                >
                  Learn More About Us &rarr;
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. BUSINESS HOURS AND LOCATION                                 */}
      {/* ============================================================== */}
      <section className="py-20 bg-white border-b border-[#EAE6E3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-widest font-bold text-[#B76E79]">
              Studio Details
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#272525] tracking-tight">
              Hours & Studio Location
            </h2>
            <p className="text-sm text-[#707070]">
              Visit our Savedi studio or call reception directly for booking consultations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Operating Hours */}
            <div className="bg-[#FAF8F5] rounded-3xl p-8 border border-[#EAE6E3] shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#C7A77D] flex items-center justify-center font-bold">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#272525]">Working Hours</h3>
                <span className="text-xs text-[#707070]">Tuesday through Sunday</span>
              </div>
              <div className="space-y-2 text-xs border-t border-[#EAE6E3] pt-4">
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-[#272525]">Tuesday – Sunday</span>
                  <span className="font-bold text-[#272525]">8:30 AM – 9:30 PM</span>
                </div>
                <div className="flex justify-between items-center text-rose-600 font-bold">
                  <span>Monday</span>
                  <span>Closed (Weekly Off)</span>
                </div>
              </div>
            </div>

            {/* Card 2: Location */}
            <div className="bg-[#FAF8F5] rounded-3xl p-8 border border-[#EAE6E3] shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#B76E79] flex items-center justify-center font-bold">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#272525]">Studio Address</h3>
                <span className="text-xs text-[#707070]">Savedi, Ahilyanagar</span>
              </div>
              <div className="text-xs text-[#707070] leading-relaxed border-t border-[#EAE6E3] pt-4 space-y-2">
                <p className="font-medium text-[#272525]">
                  Shrikrishna Nagar, Savedi, near Kohinoor Mangal Karyalaya, Ahilyanagar 414003, Maharashtra.
                </p>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs font-bold text-[#B76E79] hover:underline pt-1"
                >
                  <Navigation className="w-3.5 h-3.5 mr-1" />
                  Get Directions on Google Maps &rarr;
                </a>
              </div>
            </div>

            {/* Card 3: Contact */}
            <div className="bg-[#FAF8F5] rounded-3xl p-8 border border-[#EAE6E3] shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#272525]">Direct Telephone</h3>
                <span className="text-xs text-[#707070]">Reception & Appointments</span>
              </div>
              <div className="text-xs text-[#707070] border-t border-[#EAE6E3] pt-4 space-y-2">
                <div>
                  <span className="text-[11px] text-[#707070] block">Primary Line:</span>
                  <a href="tel:+919823573781" className="font-bold text-sm text-[#272525] hover:text-[#B76E79]">
                    +91 98235 73781
                  </a>
                </div>
                <div>
                  <span className="text-[11px] text-[#707070] block">Alternate Bookings:</span>
                  <a href="tel:+919730768487" className="font-bold text-sm text-[#272525] hover:text-[#B76E79]">
                    +91 97307 68487
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. CUSTOMER REVIEWS & RATINGS SUMMARY                           */}
      {/* ============================================================== */}
      <section className="py-20 bg-[#FAF8F5] border-b border-[#EAE6E3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-widest font-bold text-[#B76E79]">
              Verified Feedback
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#272525] tracking-tight">
              Customer Rating & Experiences
            </h2>
            
            {/* Rating Banner */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white border border-[#EAE6E3] shadow-xs">
              <div className="flex items-center space-x-1 text-[#C7A77D]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#C7A77D] text-[#C7A77D]" />
                ))}
              </div>
              <span className="font-bold text-xs text-[#272525]">
                4.7 / 5 — based on 100+ customer reviews
              </span>
              <span className="text-[10px] text-[#707070]">(Business-Provided Data)</span>
            </div>
          </div>

          {/* Review Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((r, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-[#EAE6E3] p-6 sm:p-8 space-y-4 shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center space-x-1 text-[#C7A77D]">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#C7A77D] text-[#C7A77D]" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#707070] leading-relaxed italic">
                    "{r.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EAE6E3] flex items-center space-x-3">
                  <img
                    src={r.image}
                    alt={r.name}
                    className="w-11 h-11 rounded-full object-cover border border-[#EAE6E3] shrink-0"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-[#272525] leading-tight">
                      {r.name}
                    </h4>
                    <span className="text-[11px] text-[#B76E79] font-semibold block">
                      {r.service}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 8. FINAL BOOKING CTA SECTION                                    */}
      {/* ============================================================== */}
      <section className="py-20 bg-[#272525] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs uppercase tracking-widest font-bold text-[#C7A77D]">
            Shrikrishna Nagar, Savedi, Ahilyanagar
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Your Next Beauty Experience Starts Here
          </h2>
          <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto leading-relaxed">
            Find a time that works for you and book your appointment with Beyond Beauty Saloon.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/book"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#B76E79] hover:bg-[#9A5A64] shadow-md hover:shadow-lg transition-all"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Book Your Appointment
            </Link>

            <a
              href="tel:+919823573781"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full text-xs font-bold uppercase tracking-wider text-white border border-neutral-700 hover:border-white transition-colors"
            >
              <Phone className="w-4 h-4 mr-2 text-[#C7A77D]" />
              Call Studio: +91 98235 73781
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 9. LIGHTBOX MODAL FOR PHOTO GALLERY                            */}
      {/* ============================================================== */}
      {selectedGalleryItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative max-w-3xl w-full bg-[#272525] text-white rounded-3xl overflow-hidden shadow-2xl border border-neutral-700 space-y-4">
            
            <button
              type="button"
              onClick={() => setSelectedGalleryItem(null)}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
              aria-label="Close Lightbox Preview"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-[380px] sm:h-[480px] w-full overflow-hidden bg-black">
              <img
                src={selectedGalleryItem.image}
                alt={selectedGalleryItem.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-6 pt-0 space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#C7A77D] tracking-wider block">
                {selectedGalleryItem.categoryLabel}
              </span>
              <h3 className="text-xl font-bold text-white">
                {selectedGalleryItem.title}
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed pt-1">
                {selectedGalleryItem.description}
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
