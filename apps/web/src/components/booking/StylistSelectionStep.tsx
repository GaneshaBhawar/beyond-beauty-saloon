'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Sparkles, User, Check, ArrowRight, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import { SalonService } from '@/data/servicesData';
import { SALON_IMAGES } from '@/data/salonImages';
import { apiRequest } from '@/lib/api';

export interface EligibleStylist {
  id: string;
  staffCode: string;
  displayName: string;
  jobTitle: string;
  colorTag: string;
  specialties: string[];
  bio: string;
  isAny?: boolean;
}

interface StylistSelectionStepProps {
  selectedService: SalonService;
  selectedStylistId: string; // 'ANY' or employeeProfile id
  selectedStylistName: string;
  onSelectStylist: (id: string, name: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

export function StylistSelectionStep({
  selectedService,
  selectedStylistId,
  selectedStylistName,
  onSelectStylist,
  onBack,
  onContinue,
}: StylistSelectionStepProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [staffList, setStaffList] = useState<EligibleStylist[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    async function fetchEligibleStylists() {
      setLoading(true);
      setError('');
      try {
        const res = await apiRequest<{
          serviceName: string;
          anyStylistOption: EligibleStylist;
          staff: EligibleStylist[];
        }>(`/public/staff/eligible?serviceId=${encodeURIComponent(selectedService.slug || selectedService.id)}`);

        if (isMounted) {
          if (res.success && res.data) {
            setStaffList(res.data.staff || []);
          } else {
            // Fallback default stylists if endpoint has issue
            setStaffList([
              {
                id: 'priya-default',
                staffCode: 'BBS-0001',
                displayName: 'Priya Deshmukh (Senior Stylist)',
                jobTitle: 'Senior Hair Stylist',
                colorTag: '#B78693',
                specialties: ['Precision Layers', 'Blowouts', 'Balayage'],
                bio: 'Priya brings 8+ years of expertise in bespoke haircutting, color design, and signature blowouts in Ahilyanagar.',
              },
              {
                id: 'sneha-default',
                staffCode: 'BBS-0002',
                displayName: 'Sneha Patil (Bridal Artist)',
                jobTitle: 'Skin Care & Head Bridal Artist',
                colorTag: '#1C6758',
                specialties: ['Dermal Glow', 'Bridal HD Art', 'Deep Spas'],
                bio: 'Sneha specializes in clinical dermal therapies, organic facials, and couture wedding makeup.',
              },
            ]);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || 'Could not load stylists.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchEligibleStylists();
    return () => {
      isMounted = false;
    };
  }, [selectedService]);

  // Image mapping helper based on staff name
  const getStylistPhoto = (name: string) => {
    if (name.toLowerCase().includes('priya')) return SALON_IMAGES.stylistPriya;
    if (name.toLowerCase().includes('sneha')) return SALON_IMAGES.stylistSneha;
    return SALON_IMAGES.stylistAarti;
  };

  const isAnySelected = selectedStylistId === 'ANY' || !selectedStylistId;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Step Header Notice */}
      <div className="bg-white rounded-3xl border border-salon-gray p-6 sm:p-8 space-y-2">
        <div className="flex items-center space-x-2 text-xs font-semibold text-salon-rose-dark uppercase tracking-wider">
          <User className="w-3.5 h-3.5 text-salon-rose" />
          <span>Step 2 of 4 • Specialist Assignment</span>
        </div>
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-salon-black">
          Who Would You Like to Style You?
        </h3>
        <p className="text-xs sm:text-sm text-salon-muted max-w-xl">
          Choose a preferred beauty specialist qualified for <span className="font-semibold text-salon-black">{selectedService.name}</span>, or select Any Available Stylist for the widest slot flexibility.
        </p>
      </div>

      {loading ? (
        /* Loading Skeleton */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 bg-white rounded-3xl border border-salon-gray animate-pulse space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-salon-gray/70" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-salon-gray/70 rounded-md w-3/4" />
                  <div className="h-3 bg-salon-gray/50 rounded-md w-1/2" />
                </div>
              </div>
              <div className="h-10 bg-salon-gray/40 rounded-xl" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {/* 1. Any Available Stylist Card (Default / Recommended) */}
          <div
            onClick={() => onSelectStylist('ANY', 'Any Available Specialist')}
            className={`cursor-pointer p-6 rounded-3xl border transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              isAnySelected
                ? 'bg-salon-rose-light/40 border-salon-rose ring-2 ring-salon-rose/30 shadow-md'
                : 'bg-white border-salon-gray hover:border-salon-rose/40 hover:bg-salon-ivory/50 shadow-xs'
            }`}
          >
            <div className="flex items-start sm:items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-salon-rose to-salon-gold flex items-center justify-center text-white shrink-0 shadow-sm">
                <Sparkles className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-serif text-base sm:text-lg font-bold text-salon-black">
                    Any Available Specialist
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-salon-rose text-white text-[10px] font-bold uppercase tracking-wider">
                    Recommended
                  </span>
                </div>
                <p className="text-xs text-salon-muted leading-relaxed max-w-lg">
                  Fastest confirmation. We will automatically assign the best available qualified stylist on your chosen date & time.
                </p>
              </div>
            </div>

            <div className="shrink-0 self-end sm:self-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
                  isAnySelected
                    ? 'bg-salon-rose border-salon-rose text-white shadow-xs'
                    : 'border-salon-gray bg-white text-transparent'
                }`}
              >
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-salon-muted">
              Or Choose Your Specific Specialist
            </span>
          </div>

          {/* 2. Specific Stylist Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {staffList.map((stylist) => {
              const isSelected = selectedStylistId === stylist.id;
              const photo = getStylistPhoto(stylist.displayName);

              return (
                <div
                  key={stylist.id}
                  onClick={() => onSelectStylist(stylist.id, stylist.displayName)}
                  className={`group cursor-pointer p-5 sm:p-6 rounded-3xl border transition-all duration-200 flex flex-col justify-between space-y-4 ${
                    isSelected
                      ? 'bg-salon-rose-light/40 border-salon-rose ring-2 ring-salon-rose/30 shadow-md'
                      : 'bg-white border-salon-gray hover:border-salon-rose/40 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3.5">
                      {/* Stylist Avatar / Photo */}
                      <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-salon-gray shadow-xs">
                        <Image
                          src={photo}
                          alt={stylist.displayName}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="56px"
                        />
                      </div>

                      <div className="space-y-0.5">
                        <h4 className="font-serif text-base font-bold text-salon-black group-hover:text-salon-rose-dark transition-colors">
                          {stylist.displayName}
                        </h4>
                        <p className="text-xs font-medium text-salon-rose-dark">
                          {stylist.jobTitle}
                        </p>
                        <span className="inline-block text-[10px] font-mono text-salon-muted">
                          {stylist.staffCode} • Verified Specialist
                        </span>
                      </div>
                    </div>

                    {/* Radio Checkmark */}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border shrink-0 transition-all ${
                        isSelected
                          ? 'bg-salon-rose border-salon-rose text-white shadow-xs'
                          : 'border-salon-gray bg-white text-transparent group-hover:border-salon-rose/50'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-salon-muted leading-relaxed line-clamp-2">
                    {stylist.bio}
                  </p>

                  {/* Specialties Pills */}
                  {stylist.specialties && stylist.specialties.length > 0 && (
                    <div className="pt-2 border-t border-salon-gray/70 flex flex-wrap gap-1.5">
                      {stylist.specialties.slice(0, 3).map((spec, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-full bg-salon-ivory text-salon-black text-[10px] font-medium border border-salon-gray"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="pt-4 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 p-4 sm:p-5 bg-white rounded-2xl border border-salon-gray shadow-xs">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-full border border-salon-gray bg-white text-xs font-semibold text-salon-black hover:bg-salon-ivory transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Services</span>
        </button>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="text-xs text-right hidden md:block">
            <span className="text-salon-muted">Specialist: </span>
            <span className="font-bold text-salon-black">{selectedStylistName}</span>
          </div>
          <button
            type="button"
            onClick={onContinue}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3 rounded-full bg-salon-rose hover:bg-salon-rose-dark text-white text-xs font-semibold uppercase tracking-wider shadow-md transition-all group"
          >
            <span>Continue to Date & Time</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

