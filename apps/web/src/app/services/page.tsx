'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Sparkles, Calendar, Clock, Tag, CheckCircle2, ArrowRight, Search, Scissors, Droplets, Crown, Filter } from 'lucide-react';
import { SALON_SERVICES, SalonService } from '@/data/servicesData';
import { SALON_IMAGES } from '@/data/salonImages';

function ServicesContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'hair-styling', label: 'Hair Styling & Cuts' },
    { id: 'hair-care', label: 'Hair Care & Spa' },
    { id: 'skin-care', label: 'Skin Care & Facials' },
    { id: 'makeup', label: 'Bridal & Party Makeup' },
    { id: 'threading', label: 'Threading & Grooming' },
  ];

  const filteredServices = SALON_SERVICES.filter((srv) => {
    const matchesCategory = selectedCategory === 'all' || srv.category === selectedCategory;
    const matchesQuery =
      srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="py-16 bg-salon-ivory min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-salon-rose-light text-xs font-semibold text-salon-rose-dark uppercase tracking-wider border border-salon-rose/20">
            <Sparkles className="w-3.5 h-3.5 text-salon-rose" />
            <span>Salon Catalog & Pricing</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-salon-black">
            Our Services & Treatments
          </h1>
          <p className="text-sm sm:text-base text-salon-muted leading-relaxed">
            Experience premium hair styling, rejuvenating hair spas, clinical skincare, and regal bridal makeovers in Savedi, Ahilyanagar.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl border border-salon-gray p-4 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Category Pills */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-salon-rose text-white shadow-sm'
                        : 'bg-salon-ivory text-salon-black hover:border-salon-rose border border-salon-gray'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[260px]">
              <Search className="w-4 h-4 text-salon-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services, e.g. facial, spa..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-full border border-salon-gray bg-salon-ivory focus:bg-white focus:outline-none focus:border-salon-rose transition-all"
              />
            </div>
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-salon-gray p-8 space-y-3">
            <p className="font-serif text-xl font-bold text-salon-black">No services found</p>
            <p className="text-xs text-salon-muted">Try clearing your search query or selecting another category.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-2 px-5 py-2 rounded-full bg-salon-rose text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((srv) => (
              <div
                key={srv.id}
                className="bg-white rounded-2xl border border-salon-gray overflow-hidden hover:shadow-luxury-hover hover:border-salon-rose/40 transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Service Card Image Header */}
                <div className="relative h-48 w-full overflow-hidden bg-neutral-100">
                  <img
                    src={srv.image}
                    alt={srv.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {srv.popular && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-salon-gold text-salon-black text-[10px] font-bold uppercase tracking-wider shadow-sm">
                      Popular Choice
                    </span>
                  )}

                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                    <span className="text-xs font-mono font-bold bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/30">
                      {srv.priceFormatted}
                    </span>
                    <span className="text-xs flex items-center text-neutral-200">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      {srv.durationMinutes} mins
                    </span>
                  </div>
                </div>

                {/* Service Card Body */}
                <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-salon-rose block">
                      {srv.categoryLabel}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-salon-black group-hover:text-salon-rose transition-colors">
                      {srv.name}
                    </h3>
                    <p className="text-xs text-salon-muted leading-relaxed">
                      {srv.shortDesc}
                    </p>

                    {/* Benefit checklist */}
                    <div className="pt-2 space-y-1.5 border-t border-salon-gray/60">
                      {srv.benefits.map((b, idx) => (
                        <div key={idx} className="flex items-center text-xs text-salon-black">
                          <CheckCircle2 className="w-3.5 h-3.5 text-salon-gold mr-1.5 shrink-0" />
                          <span className="text-[11px]">{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-salon-gray flex items-center justify-between gap-3">
                    <Link
                      href={`/book?serviceId=${srv.id}`}
                      className="w-full inline-flex items-center justify-center py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-salon-rose hover:bg-salon-rose-dark transition-colors shadow-xs"
                    >
                      <Calendar className="w-3.5 h-3.5 mr-1.5" />
                      Book This Service
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Consultation Callout Banner */}
        <div className="bg-white rounded-3xl border border-salon-gray p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs uppercase tracking-wider font-semibold text-salon-gold">
              Need Personalized Guidance?
            </span>
            <h3 className="font-serif text-2xl font-bold text-salon-black">
              Complimentary In-Salon Consultation
            </h3>
            <p className="text-xs sm:text-sm text-salon-muted leading-relaxed">
              Not sure which facial fits your skin type or planning your bridal beauty roadmap? Walk in or schedule a 15-minute consultation with our senior aesthetician.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <a
              href="tel:+919823573781"
              className="w-full sm:w-auto px-6 py-3 rounded-full border border-salon-black text-xs font-semibold uppercase tracking-wider text-salon-black hover:bg-salon-ivory text-center"
            >
              Call Specialist
            </a>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-salon-rose text-white text-xs font-semibold uppercase tracking-wider hover:bg-salon-rose-dark text-center shadow-xs"
            >
              Send Enquiry
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-xs text-salon-muted font-medium">Loading catalog...</div>}>
      <ServicesContent />
    </Suspense>
  );
}
