'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Search, Clock, Sparkles, Info, Check, ArrowRight } from 'lucide-react';
import { SALON_SERVICES, SalonService } from '@/data/servicesData';
import { ServiceDetailModal } from './ServiceDetailModal';

interface ServiceSelectionStepProps {
  selectedService: SalonService;
  onSelectService: (service: SalonService) => void;
  onContinue: () => void;
}

export function ServiceSelectionStep({
  selectedService,
  onSelectService,
  onContinue,
}: ServiceSelectionStepProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [detailModalService, setDetailModalService] = useState<SalonService | null>(null);

  const categories = [
    { id: 'all', label: 'All Treatments' },
    { id: 'hair-styling', label: 'Hair Styling & Cuts' },
    { id: 'hair-care', label: 'Hair Care & Spa' },
    { id: 'skin-care', label: 'Skin Care & Facials' },
    { id: 'makeup', label: 'Makeup & Bridal' },
    { id: 'threading', label: 'Threading & Waxing' },
  ];

  const filteredServices = useMemo(() => {
    return SALON_SERVICES.filter((srv) => {
      const matchesCategory =
        activeCategory === 'all' || srv.category === activeCategory;
      const matchesQuery =
        searchQuery.trim() === '' ||
        srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        srv.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        srv.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Category Tabs & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-salon-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search treatment (e.g. Layered haircut, Facial, Spa)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white border border-salon-gray rounded-full focus:outline-hidden focus:border-salon-rose focus:ring-2 focus:ring-salon-rose/20 text-salon-black placeholder:text-salon-muted/70 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-salon-muted hover:text-salon-black"
              >
                Clear
              </button>
            )}
          </div>

          <div className="text-xs text-salon-muted text-right">
            Showing <span className="font-bold text-salon-black">{filteredServices.length}</span> active treatments
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-salon-black text-white shadow-xs'
                    : 'bg-white border border-salon-gray text-salon-muted hover:border-salon-rose/40 hover:text-salon-black'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-salon-gray p-8 space-y-3">
          <Sparkles className="w-8 h-8 text-salon-muted mx-auto" />
          <h4 className="font-serif text-lg font-bold text-salon-black">
            No Treatments Found
          </h4>
          <p className="text-xs text-salon-muted max-w-sm mx-auto">
            We couldn’t find treatments matching your search. Try resetting the category filter or searching for a different keyword.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-full bg-salon-ivory text-xs font-semibold text-salon-black border border-salon-gray hover:bg-salon-rose-light/50"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((service) => {
            const isSelected = selectedService.id === service.id;

            return (
              <div
                key={service.id}
                className={`group relative bg-white rounded-3xl border overflow-hidden transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'border-salon-rose ring-2 ring-salon-rose/30 shadow-md scale-[1.01]'
                    : 'border-salon-gray hover:border-salon-rose/40 hover:shadow-md'
                }`}
              >
                {/* Image Section */}
                <div className="relative h-44 w-full bg-salon-ivory overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* Badges on Image */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-bold text-salon-black uppercase tracking-wider shadow-xs">
                      {service.categoryLabel}
                    </span>

                    {service.popular && (
                      <span className="px-2.5 py-1 rounded-full bg-salon-rose text-white text-[10px] font-bold uppercase tracking-wider shadow-xs flex items-center space-x-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Popular</span>
                      </span>
                    )}
                  </div>

                  {/* Selected Indicator Pill */}
                  {isSelected && (
                    <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-salon-rose text-white text-[11px] font-bold flex items-center space-x-1.5 shadow-md">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Selected</span>
                    </div>
                  )}

                  {/* Duration on bottom right of image */}
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-xs text-[11px] flex items-center space-x-1 font-medium">
                    <Clock className="w-3 h-3 text-salon-gold" />
                    <span>{service.durationMinutes} min</span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between">
                      <h4 className="font-serif text-base font-bold text-salon-black group-hover:text-salon-rose-dark transition-colors line-clamp-1">
                        {service.name}
                      </h4>
                    </div>
                    <p className="text-xs text-salon-muted line-clamp-2 leading-relaxed">
                      {service.shortDesc}
                    </p>
                  </div>

                  {/* Pricing and Action Buttons */}
                  <div className="pt-2 border-t border-salon-gray/70 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-salon-muted block tracking-wider">
                          Treatment Price
                        </span>
                        <span className="font-mono text-base font-bold text-salon-black">
                          {service.priceFormatted}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setDetailModalService(service)}
                        className="text-xs text-salon-rose-dark hover:text-salon-black font-semibold inline-flex items-center space-x-1 px-2.5 py-1 rounded-full hover:bg-salon-ivory transition-colors"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>
                    </div>

                    {/* Select / Selected Button */}
                    <button
                      type="button"
                      onClick={() => onSelectService(service)}
                      className={`w-full py-2.5 px-4 rounded-full text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
                        isSelected
                          ? 'bg-salon-rose text-white shadow-sm hover:bg-salon-rose-dark'
                          : 'bg-salon-ivory hover:bg-salon-rose-light/70 text-salon-black border border-salon-gray/80 hover:border-salon-rose/30'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Service Selected</span>
                        </>
                      ) : (
                        <span>Select Service</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Bottom Step Bar */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 bg-white rounded-2xl border border-salon-gray shadow-xs">
        <div className="text-xs">
          <span className="text-salon-muted">Selected Treatment: </span>
          <span className="font-bold text-salon-black">{selectedService.name}</span>
          <span className="text-salon-rose-dark font-mono font-bold ml-2">
            ({selectedService.priceFormatted} • {selectedService.durationMinutes} min)
          </span>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3 rounded-full bg-salon-rose hover:bg-salon-rose-dark text-white text-xs font-semibold uppercase tracking-wider shadow-md transition-all group"
        >
          <span>Continue to Choose Stylist</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Service Detail Modal */}
      <ServiceDetailModal
        service={detailModalService}
        isOpen={!!detailModalService}
        onClose={() => setDetailModalService(null)}
        onSelectAndProceed={(service) => {
          onSelectService(service);
          onContinue();
        }}
      />
    </div>
  );
}

