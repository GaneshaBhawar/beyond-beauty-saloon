'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { X, Clock, Sparkles, Check, AlertCircle, ArrowRight } from 'lucide-react';
import { SalonService } from '@/data/servicesData';

interface ServiceDetailModalProps {
  service: SalonService | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectAndProceed: (service: SalonService) => void;
}

export function ServiceDetailModal({
  service,
  isOpen,
  onClose,
  onSelectAndProceed,
}: ServiceDetailModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !service) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-service-title"
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-luxury overflow-hidden border border-salon-gray max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image */}
        <div className="relative h-56 sm:h-64 w-full bg-salon-charcoal overflow-hidden shrink-0">
          <Image
            src={service.image}
            alt={service.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 672px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Floating Category Badge */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-white/90 text-salon-rose-dark text-xs font-semibold backdrop-blur-xs uppercase tracking-wider">
                {service.categoryLabel}
              </span>
              <h2
                id="modal-service-title"
                className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1 drop-shadow-xs"
              >
                {service.name}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-xs text-white/80 block uppercase tracking-wider font-medium">Price</span>
              <span className="font-mono text-xl sm:text-2xl font-bold text-white drop-shadow-xs">
                {service.priceFormatted}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-salon-black">
          {/* Duration & Key Metrics */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-salon-ivory border border-salon-gray text-xs font-medium text-salon-black">
              <Clock className="w-3.5 h-3.5 text-salon-rose" />
              <span>{service.durationMinutes} Minutes Treatment</span>
            </div>
            {service.popular && (
              <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-salon-rose-light border border-salon-rose/20 text-xs font-semibold text-salon-rose-dark">
                <Sparkles className="w-3.5 h-3.5 text-salon-rose" />
                <span>Guest Favorite</span>
              </div>
            )}
            <div className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs font-medium">
              <span>Savedi, Ahilyanagar Studio</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-salon-muted">
              Treatment Overview
            </h3>
            <p className="text-xs sm:text-sm text-salon-muted leading-relaxed">
              {service.fullDesc || service.shortDesc}
            </p>
          </div>

          {/* Key Benefits / Inclusions */}
          {service.benefits && service.benefits.length > 0 && (
            <div className="space-y-3 bg-salon-ivory/60 rounded-2xl p-4 sm:p-5 border border-salon-gray">
              <h3 className="text-xs font-bold uppercase tracking-wider text-salon-black flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-salon-rose" />
                <span>What’s Included in This Service</span>
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {service.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-xs text-salon-black">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Preparation & Client Notes */}
          <div className="flex items-start space-x-3 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-amber-900 text-xs leading-relaxed">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
            <div>
              <span className="font-bold">Preparation & Arrival Note: </span>
              Please arrive 5 to 10 minutes prior to your booking. Our specialists in Savedi will conduct a brief personalized texture and skin assessment before treatment begins.
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 sm:p-6 bg-salon-ivory border-t border-salon-gray flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-salon-muted hidden sm:block">
            Step 1 of 4: Stylist selection follows
          </div>
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-salon-gray bg-white text-xs font-semibold text-salon-black hover:bg-salon-ivory transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onSelectAndProceed(service);
                onClose();
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-full bg-salon-rose hover:bg-salon-rose-dark text-white text-xs font-semibold shadow-md transition-all group"
            >
              <span>Book This Service</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

