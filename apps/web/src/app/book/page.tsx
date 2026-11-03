'use client';

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Sparkles, ShieldCheck, MapPin, Clock } from 'lucide-react';
import { SALON_SERVICES, SalonService } from '@/data/servicesData';
import { saveAppointment, StoredAppointment } from '@/data/bookingStore';
import { apiRequest } from '@/lib/api';

import { BookingProgress } from '@/components/booking/BookingProgress';
import { ServiceSelectionStep } from '@/components/booking/ServiceSelectionStep';
import { StylistSelectionStep } from '@/components/booking/StylistSelectionStep';
import { DateTimeSelectionStep } from '@/components/booking/DateTimeSelectionStep';
import { CustomerDetailsStep } from '@/components/booking/CustomerDetailsStep';
import { BookingConfirmationScreen } from '@/components/booking/BookingConfirmationScreen';

function BookingWizardContent() {
  const searchParams = useSearchParams();
  const paramServiceId = searchParams.get('serviceId');
  const paramOffer = searchParams.get('offer');
  const paramStep = searchParams.get('step');
  const paramConfirmed = searchParams.get('confirmed');

  // Step state: 1: Service, 2: Stylist, 3: Date & Time, 4: Details
  const initialStepNum = paramStep ? Math.min(Math.max(parseInt(paramStep, 10) || 1, 1), 4) : 1;
  const [currentStep, setCurrentStep] = useState<number>(initialStepNum);
  const [maxAccessibleStep, setMaxAccessibleStep] = useState<number>(initialStepNum > 1 ? initialStepNum : 1);

  // Selected Service
  const initialService = useMemo(() => {
    if (paramServiceId) {
      const found = SALON_SERVICES.find(
        (s) => s.id === paramServiceId || s.slug === paramServiceId
      );
      if (found) return found;
    }
    return SALON_SERVICES[1]; // Signature Layered Haircut
  }, [paramServiceId]);

  const [selectedService, setSelectedService] = useState<SalonService>(initialService);

  // Selected Stylist
  const [selectedStylistId, setSelectedStylistId] = useState<string>('ANY');
  const [selectedStylistName, setSelectedStylistName] = useState<string>('Any Available Specialist');

  // Selected Date & Time
  const defaultDate = useMemo(() => {
    const today = new Date();
    // In Asia/Kolkata timezone
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const todayStr = formatter.format(today);

    // If today is Monday (day 1), default to tomorrow Tuesday
    const [y, m, d] = todayStr.split('-').map(Number);
    const dayOfWeek = new Date(Date.UTC(y, m - 1, d, 6, 0, 0)).getUTCDay();
    if (dayOfWeek === 1) {
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      return formatter.format(tomorrow);
    }
    return todayStr;
  }, []);

  const [selectedDate, setSelectedDate] = useState<string>(defaultDate);
  const [selectedSlot, setSelectedSlot] = useState<string | null>('11:00 AM');

  // Customer Contact Info
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Promo Code
  const [promoCode, setPromoCode] = useState<string>(paramOffer || '');
  const [discountApplied, setDiscountApplied] = useState<number>(0);
  const [promoMessage, setPromoMessage] = useState<string>('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string>('');
  const [confirmedBooking, setConfirmedBooking] = useState<StoredAppointment | null>(() => {
    if (paramConfirmed === '1') {
      return {
        id: 'confirmed-preview-01',
        reference: 'BBS-20261104-7891',
        serviceId: 'layered-haircut',
        serviceName: 'Signature Layered Haircut & Finish',
        category: 'Hair Styling & Cuts',
        clientName: 'Ananya Sharma',
        clientPhone: '+91 98235 73781',
        clientEmail: 'ananya.sharma@example.com',
        date: '2026-11-04',
        time: '11:00 AM',
        stylist: 'Priya Deshmukh (Senior Stylist)',
        status: 'CONFIRMED',
        price: '₹850',
        paymentStatus: 'UNPAID',
        notes: 'First visit welcome consultation.',
        createdAt: new Date().toISOString(),
      };
    }
    return null;
  });

  // Handle URL param changes
  useEffect(() => {
    if (paramServiceId) {
      const found = SALON_SERVICES.find(
        (s) => s.id === paramServiceId || s.slug === paramServiceId
      );
      if (found) {
        setSelectedService(found);
      }
    }
    if (paramOffer) {
      handleApplyPromo(paramOffer);
    }
  }, [paramServiceId, paramOffer]);

  const handleApplyPromo = (code: string) => {
    const clean = code.trim().toUpperCase();
    setPromoCode(clean);
    if (clean === 'WELCOME15') {
      setDiscountApplied(0.15);
      setPromoMessage('15% First-Visit Discount Applied!');
    } else if (clean === 'BRIDALGLAM') {
      setDiscountApplied(0.20);
      setPromoMessage('20% Bridal & Festive Special Applied!');
    } else if (clean === 'FESTIVE20') {
      setDiscountApplied(0.20);
      setPromoMessage('20% Festive Season Discount Applied!');
    } else if (clean) {
      setDiscountApplied(0);
      setPromoMessage('Invalid promo code. Try WELCOME15 or BRIDALGLAM');
    }
  };

  // Step 1: Select Service handler
  const handleSelectService = (service: SalonService) => {
    if (service.id !== selectedService.id) {
      setSelectedService(service);
      // Invalidate slots when service duration changes
      setSelectedSlot(null);
    }
  };

  const handleContinueFromService = () => {
    setCurrentStep(2);
    setMaxAccessibleStep((prev) => Math.max(prev, 2));
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  // Step 2: Select Stylist handler
  const handleSelectStylist = (id: string, name: string) => {
    setSelectedStylistId(id);
    setSelectedStylistName(name);
  };

  const handleContinueFromStylist = () => {
    setCurrentStep(3);
    setMaxAccessibleStep((prev) => Math.max(prev, 3));
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  // Step 3: Date & Slot Selection
  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    // Availability endpoint will automatically re-evaluate slots
  };

  const handleSelectSlot = (slot: string) => {
    setSelectedSlot(slot);
  };

  const handleContinueFromDateTime = () => {
    if (!selectedSlot) return;
    setCurrentStep(4);
    setMaxAccessibleStep((prev) => Math.max(prev, 4));
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  // Step 4: Final Confirmation Submission
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !clientName || !clientPhone) return;

    setIsSubmitting(true);
    setBookingError('');

    try {
      // Generate client-side idempotency key to prevent accidental duplicate bookings
      const idempotencyKey = `idem-${Date.now()}-${Math.random().toString(36).substring(7)}`;

      const res = await apiRequest<{
        appointmentId: string;
        referenceCode: string;
        stylist: string;
        date: string;
        time: string;
        clientName: string;
        serviceName: string;
        priceFormatted: string;
        location: string;
      }>('/appointments', {
        method: 'POST',
        body: JSON.stringify({
          serviceId: selectedService.slug || selectedService.id,
          date: selectedDate,
          time: selectedSlot,
          clientName: clientName.trim(),
          clientPhone: clientPhone.trim(),
          clientEmail: clientEmail.trim() || undefined,
          stylistId: selectedStylistId,
          notes: notes ? `${notes} ${promoCode ? `[Promo: ${promoCode}]` : ''}` : promoCode ? `[Promo: ${promoCode}]` : undefined,
          idempotencyKey,
        }),
      });

      if (!res.success) {
        setBookingError(
          res.error ||
            'The selected time slot is no longer available. Please choose another slot or date.'
        );
        setIsSubmitting(false);
        // If slot conflict, send user back to Step 3 so they can pick another slot
        if (res.error?.includes('available') || res.error?.includes('conflict')) {
          setCurrentStep(3);
        }
        return;
      }

      const calculatedTotal = Math.round(selectedService.priceNum * (1 - discountApplied));

      // Save appointment in reactive client store
      const created = saveAppointment({
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        category: selectedService.categoryLabel,
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        clientEmail: clientEmail.trim(),
        date: selectedDate,
        time: selectedSlot,
        stylist: res.data?.stylist || selectedStylistName,
        status: 'CONFIRMED',
        price: selectedService.priceNum > 0 ? `₹${calculatedTotal.toLocaleString('en-IN')}` : 'On Consultation',
        paymentStatus: 'UNPAID',
        notes: notes ? `${notes} ${promoCode ? `[Promo: ${promoCode}]` : ''}` : promoCode ? `[Promo: ${promoCode}]` : undefined,
      });

      // Override reference with backend generated reference code
      if (res.data?.referenceCode) {
        created.reference = res.data.referenceCode;
      }

      setConfirmedBooking(created);
      window.scrollTo({ top: 150, behavior: 'smooth' });
    } catch (err: any) {
      setBookingError(err?.message || 'Could not connect to the salon reservation server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetBooking = () => {
    setConfirmedBooking(null);
    setCurrentStep(1);
    setMaxAccessibleStep(1);
    setSelectedSlot(null);
    setBookingError('');
  };

  return (
    <div className="py-12 sm:py-16 bg-salon-ivory min-h-screen transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Main Page Header */}
        {!confirmedBooking && (
          <div className="text-center space-y-3">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-salon-rose-light text-xs font-semibold text-salon-rose-dark uppercase tracking-wider border border-salon-rose/20">
              <Sparkles className="w-3.5 h-3.5 text-salon-rose" />
              <span>Smart Appointment Booking V2</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-salon-black tracking-tight">
              Reserve Your Salon Visit
            </h1>
            <p className="text-xs sm:text-sm text-salon-muted max-w-xl mx-auto leading-relaxed">
              Real-time schedule integration with our Savedi studio. Zero sample slots, zero double-booking assurance, and verified specialist assignments.
            </p>
          </div>
        )}

        {/* Step Progress Indicator (visible when not on confirmation screen) */}
        {!confirmedBooking && (
          <BookingProgress
            currentStep={currentStep}
            onStepClick={(step) => {
              setCurrentStep(step);
              window.scrollTo({ top: 150, behavior: 'smooth' });
            }}
            maxAccessibleStep={maxAccessibleStep}
          />
        )}

        {/* Wizard Steps */}
        {confirmedBooking ? (
          /* Confirmation Screen */
          <BookingConfirmationScreen
            booking={confirmedBooking}
            onBookAnother={handleResetBooking}
          />
        ) : (
          <div>
            {currentStep === 1 && (
              <ServiceSelectionStep
                selectedService={selectedService}
                onSelectService={handleSelectService}
                onContinue={handleContinueFromService}
              />
            )}

            {currentStep === 2 && (
              <StylistSelectionStep
                selectedService={selectedService}
                selectedStylistId={selectedStylistId}
                selectedStylistName={selectedStylistName}
                onSelectStylist={handleSelectStylist}
                onBack={() => setCurrentStep(1)}
                onContinue={handleContinueFromStylist}
              />
            )}

            {currentStep === 3 && (
              <DateTimeSelectionStep
                selectedService={selectedService}
                selectedStylistId={selectedStylistId}
                selectedStylistName={selectedStylistName}
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                onSelectDate={handleSelectDate}
                onSelectSlot={handleSelectSlot}
                onBack={() => setCurrentStep(2)}
                onContinue={handleContinueFromDateTime}
              />
            )}

            {currentStep === 4 && (
              <CustomerDetailsStep
                selectedService={selectedService}
                selectedStylistName={selectedStylistName}
                selectedDate={selectedDate}
                selectedSlot={selectedSlot || ''}
                clientName={clientName}
                clientPhone={clientPhone}
                clientEmail={clientEmail}
                notes={notes}
                promoCode={promoCode}
                discountApplied={discountApplied}
                promoMessage={promoMessage}
                isSubmitting={isSubmitting}
                bookingError={bookingError}
                onChangeName={setClientName}
                onChangePhone={setClientPhone}
                onChangeEmail={setClientEmail}
                onChangeNotes={setNotes}
                onApplyPromo={handleApplyPromo}
                onBack={() => setCurrentStep(3)}
                onSubmit={handleSubmitBooking}
              />
            )}
          </div>
        )}

        {/* Bottom Trust & Studio Highlights */}
        {!confirmedBooking && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-center text-xs text-salon-muted border-t border-salon-gray/70">
            <div className="flex items-center justify-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-salon-rose" />
              <span>Zero Advance Payment Required</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Clock className="w-4 h-4 text-salon-rose" />
              <span>Tue–Sun: 8:30 AM – 9:30 PM (Mon Closed)</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <MapPin className="w-4 h-4 text-salon-rose" />
              <span>Savedi, Ahilyanagar Studio</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-salon-ivory flex items-center justify-center">
          <div className="w-10 h-10 border-3 border-salon-rose/30 border-t-salon-rose rounded-full animate-spin" />
        </div>
      }
    >
      <BookingWizardContent />
    </Suspense>
  );
}
