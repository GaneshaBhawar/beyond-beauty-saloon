'use client';

import React, { useState } from 'react';
import {
  User,
  Phone,
  Mail,
  FileText,
  Tag,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Lock,
  AlertCircle,
} from 'lucide-react';
import { SalonService } from '@/data/servicesData';

interface CustomerDetailsStepProps {
  selectedService: SalonService;
  selectedStylistName: string;
  selectedDate: string;
  selectedSlot: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  notes: string;
  promoCode: string;
  discountApplied: number;
  promoMessage: string;
  isSubmitting: boolean;
  bookingError: string;
  onChangeName: (val: string) => void;
  onChangePhone: (val: string) => void;
  onChangeEmail: (val: string) => void;
  onChangeNotes: (val: string) => void;
  onApplyPromo: (code: string) => void;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function CustomerDetailsStep({
  selectedService,
  selectedStylistName,
  selectedDate,
  selectedSlot,
  clientName,
  clientPhone,
  clientEmail,
  notes,
  promoCode,
  discountApplied,
  promoMessage,
  isSubmitting,
  bookingError,
  onChangeName,
  onChangePhone,
  onChangeEmail,
  onChangeNotes,
  onApplyPromo,
  onBack,
  onSubmit,
}: CustomerDetailsStepProps) {
  const [promoInput, setPromoInput] = useState<string>(promoCode);
  const [phoneError, setPhoneError] = useState<string>('');

  // Validate phone
  const handlePhoneBlur = () => {
    const clean = clientPhone.replace(/[\s-]/g, '');
    const isValid = /^(?:(?:\+|0{0,2})91)?[6-9]\d{9}$/.test(clean);
    if (clientPhone && !isValid) {
      setPhoneError('Please enter a valid 10-digit Indian mobile number (e.g. 98235 73781).');
    } else {
      setPhoneError('');
    }
  };

  const calculatedTotal = Math.round(selectedService.priceNum * (1 - discountApplied));

  const isFormValid =
    clientName.trim().length >= 2 &&
    clientPhone.trim().length >= 10 &&
    !phoneError;

  return (
    <form onSubmit={onSubmit} className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="bg-white rounded-3xl border border-salon-gray p-6 sm:p-8 space-y-2">
        <div className="flex items-center space-x-2 text-xs font-semibold text-salon-rose-dark uppercase tracking-wider">
          <FileText className="w-3.5 h-3.5 text-salon-rose" />
          <span>Step 4 of 4 • Contact Details & Final Confirmation</span>
        </div>
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-salon-black">
          Confirm Your Appointment Details
        </h3>
        <p className="text-xs sm:text-sm text-salon-muted max-w-xl">
          Zero advance payment required. Review your booking summary and provide your contact number for booking confirmation and arrival reminders.
        </p>
      </div>

      {bookingError && (
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start space-x-3 animate-in shake duration-200">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
          <div>
            <span className="font-bold">Reservation Notice: </span>
            {bookingError}
          </div>
        </div>
      )}

      {/* Grid: Details Form (7 cols) + Order Review (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Inputs (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-salon-gray p-6 sm:p-8 space-y-5 shadow-xs">
          <h4 className="font-serif text-base font-bold text-salon-black flex items-center space-x-2 pb-2 border-b border-salon-gray">
            <User className="w-4 h-4 text-salon-rose" />
            <span>Guest Information</span>
          </h4>

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-salon-muted">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-salon-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g. Ananya Sharma"
                value={clientName}
                onChange={(e) => onChangeName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-salon-ivory/40 border border-salon-gray rounded-xl focus:outline-hidden focus:border-salon-rose focus:ring-2 focus:ring-salon-rose/20 text-salon-black transition-all"
              />
            </div>
          </div>

          {/* Mobile Phone */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-salon-muted">
              Mobile Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-salon-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                placeholder="e.g. 98235 73781"
                value={clientPhone}
                onChange={(e) => {
                  onChangePhone(e.target.value);
                  if (phoneError) setPhoneError('');
                }}
                onBlur={handlePhoneBlur}
                className={`w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-salon-ivory/40 border rounded-xl focus:outline-hidden text-salon-black transition-all ${
                  phoneError
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                    : 'border-salon-gray focus:border-salon-rose focus:ring-2 focus:ring-salon-rose/20'
                }`}
              />
            </div>
            {phoneError ? (
              <p className="text-[11px] text-rose-600 font-medium">{phoneError}</p>
            ) : (
              <p className="text-[11px] text-salon-muted">
                Indian 10-digit mobile number for instant appointment updates.
              </p>
            )}
          </div>

          {/* Email (Optional) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-salon-muted">
              Email Address <span className="text-salon-muted/60 lowercase font-normal">(optional)</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-salon-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="e.g. ananya.sharma@example.com"
                value={clientEmail}
                onChange={(e) => onChangeEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-salon-ivory/40 border border-salon-gray rounded-xl focus:outline-hidden focus:border-salon-rose focus:ring-2 focus:ring-salon-rose/20 text-salon-black transition-all"
              />
            </div>
          </div>

          {/* Notes / Special Requests */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-salon-muted">
              Special Requests or Skin/Hair Allergies <span className="text-salon-muted/60 lowercase font-normal">(optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="Any specific preference, haircut reference, hair length, sensitive scalp, or bridal event timing..."
              value={notes}
              onChange={(e) => onChangeNotes(e.target.value)}
              className="w-full p-3 text-xs sm:text-sm bg-salon-ivory/40 border border-salon-gray rounded-xl focus:outline-hidden focus:border-salon-rose focus:ring-2 focus:ring-salon-rose/20 text-salon-black transition-all"
            />
          </div>

          {/* Promo Code Box */}
          <div className="pt-2 border-t border-salon-gray/70 space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-salon-muted flex items-center space-x-1.5">
              <Tag className="w-3.5 h-3.5 text-salon-rose" />
              <span>Have a Promotional Code?</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. WELCOME15"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs uppercase bg-white border border-salon-gray rounded-xl font-mono text-salon-black focus:outline-hidden focus:border-salon-rose"
              />
              <button
                type="button"
                onClick={() => onApplyPromo(promoInput)}
                className="px-4 py-2 rounded-xl bg-salon-ivory hover:bg-salon-rose-light/50 border border-salon-gray text-xs font-semibold text-salon-black transition-colors"
              >
                Apply Code
              </button>
            </div>
            {promoMessage && (
              <p
                className={`text-[11px] font-medium ${
                  discountApplied > 0 ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {promoMessage}
              </p>
            )}
          </div>
        </div>

        {/* Booking Summary Box (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-salon-gray p-6 sm:p-8 space-y-6 shadow-xs sticky top-24">
          <h4 className="font-serif text-base font-bold text-salon-black flex items-center space-x-2 pb-2 border-b border-salon-gray">
            <Sparkles className="w-4 h-4 text-salon-rose" />
            <span>Appointment Summary</span>
          </h4>

          {/* Summary Breakdown */}
          <div className="space-y-3.5 text-xs">
            <div className="flex justify-between items-start">
              <span className="text-salon-muted">Selected Treatment:</span>
              <span className="font-bold text-salon-black text-right max-w-[200px]">
                {selectedService.name}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-salon-muted">Duration:</span>
              <span className="font-semibold text-salon-black">
                {selectedService.durationMinutes} Minutes
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-salon-muted">Specialist:</span>
              <span className="font-semibold text-salon-rose-dark text-right">
                {selectedStylistName}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-salon-muted">Scheduled Date:</span>
              <span className="font-semibold text-salon-black">{selectedDate}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-salon-muted">Arrival Time:</span>
              <span className="font-bold text-salon-black bg-salon-ivory px-2.5 py-1 rounded-md border border-salon-gray font-mono">
                {selectedSlot}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-salon-muted">Studio Location:</span>
              <span className="font-medium text-salon-black text-right">
                Savedi, Ahilyanagar
              </span>
            </div>

            {/* Price Calculations */}
            <div className="pt-3 border-t border-salon-gray space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-salon-muted">Base Service Fee:</span>
                <span className="font-mono text-salon-black">{selectedService.priceFormatted}</span>
              </div>

              {discountApplied > 0 && (
                <div className="flex justify-between items-center text-emerald-700">
                  <span>Promotional Discount:</span>
                  <span className="font-mono">
                    -₹{(selectedService.priceNum - calculatedTotal).toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t border-salon-gray/80 text-sm">
                <span className="font-bold text-salon-black">Payable at Salon:</span>
                <span className="font-serif font-bold text-lg text-salon-rose-dark font-mono">
                  {selectedService.priceNum > 0 ? `₹${calculatedTotal.toLocaleString('en-IN')}` : 'On Consultation'}
                </span>
              </div>
            </div>
          </div>

          {/* Zero Advance Guarantee */}
          <div className="p-3.5 rounded-2xl bg-salon-ivory border border-salon-gray/80 flex items-center space-x-2.5 text-[11px] text-salon-muted">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Zero advance payment needed today. Pay at the salon counter after treatment via Cash, UPI, or Card.
            </span>
          </div>

          {/* Confirm Button */}
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={`w-full py-3.5 px-6 rounded-full font-semibold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center space-x-2 ${
              isFormValid && !isSubmitting
                ? 'bg-salon-rose hover:bg-salon-rose-dark text-white cursor-pointer hover:shadow-lg'
                : 'bg-salon-gray text-salon-muted cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Locking Appointment Slot...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Appointment</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Back button row */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full border border-salon-gray bg-white text-xs font-semibold text-salon-black hover:bg-salon-ivory transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Date & Time</span>
        </button>
      </div>
    </form>
  );
}

