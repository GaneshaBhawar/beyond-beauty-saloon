'use client';

import React from 'react';
import Link from 'next/link';
import {
  Check,
  Calendar,
  Clock,
  User,
  MapPin,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Home,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { StoredAppointment } from '@/data/bookingStore';

interface BookingConfirmationScreenProps {
  booking: StoredAppointment;
  onBookAnother: () => void;
}

export function BookingConfirmationScreen({
  booking,
  onBookAnother,
}: BookingConfirmationScreenProps) {
  return (
    <div className="bg-white rounded-3xl border border-salon-rose/40 p-6 sm:p-10 shadow-luxury text-center space-y-8 animate-in fade-in zoom-in-95 duration-300 max-w-3xl mx-auto">
      {/* Animated Success Badge */}
      <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-salon-rose to-salon-gold flex items-center justify-center text-white mx-auto shadow-lg ring-8 ring-salon-rose/10 animate-bounce duration-1000">
        <Check className="w-10 h-10 stroke-[2.5]" />
      </div>

      {/* Main Headline */}
      <div className="space-y-3">
        <span className="inline-flex items-center space-x-1.5 text-xs font-mono font-bold uppercase tracking-wider text-salon-rose-dark bg-salon-rose-light px-4 py-1.5 rounded-full border border-salon-rose/30">
          <Sparkles className="w-3.5 h-3.5 text-salon-rose" />
          <span>Booking Reference: {booking.reference}</span>
        </span>

        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-salon-black">
          Your Beauty Appointment Is Confirmed!
        </h2>

        <p className="text-xs sm:text-sm text-salon-muted max-w-md mx-auto leading-relaxed">
          We are delighted to welcome you to Beyond Beauty Saloon in Savedi. Your specialist and styling chair have been securely reserved.
        </p>
      </div>

      {/* Detailed Receipt Card */}
      <div className="p-6 sm:p-8 bg-salon-ivory rounded-3xl border border-salon-gray max-w-xl mx-auto text-left space-y-4">
        <div className="flex justify-between items-start pb-3 border-b border-salon-gray/80">
          <div>
            <span className="text-[10px] uppercase font-bold text-salon-muted tracking-wider block">
              Reserved Treatment
            </span>
            <span className="font-serif text-base sm:text-lg font-bold text-salon-black">
              {booking.serviceName}
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
            CONFIRMED
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <span className="text-salon-muted block flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-salon-rose" />
              <span>Appointment Date:</span>
            </span>
            <span className="font-semibold text-salon-black block">{booking.date}</span>
          </div>

          <div className="space-y-1">
            <span className="text-salon-muted block flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-salon-rose" />
              <span>Arrival Time:</span>
            </span>
            <span className="font-bold text-salon-black font-mono block">{booking.time}</span>
          </div>

          <div className="space-y-1">
            <span className="text-salon-muted block flex items-center space-x-1">
              <User className="w-3.5 h-3.5 text-salon-rose" />
              <span>Assigned Specialist:</span>
            </span>
            <span className="font-semibold text-salon-rose-dark block">{booking.stylist}</span>
          </div>

          <div className="space-y-1">
            <span className="text-salon-muted block flex items-center space-x-1">
              <User className="w-3.5 h-3.5 text-salon-rose" />
              <span>Guest Name:</span>
            </span>
            <span className="font-medium text-salon-black block">{booking.clientName}</span>
          </div>
        </div>

        {/* Location & Directions */}
        <div className="pt-3 border-t border-salon-gray/80 space-y-2 text-xs">
          <div className="flex items-start space-x-2 text-salon-black">
            <MapPin className="w-4 h-4 text-salon-rose shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Beyond Beauty Saloon</span>
              <p className="text-[11px] text-salon-muted leading-relaxed">
                Shrikrishna Nagar / Savedi, near Kohinoor Mangal Karyalaya, Ahilyanagar, Maharashtra 414003
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-salon-muted">
            <Phone className="w-3.5 h-3.5 text-salon-rose" />
            <span>Salon Helpline: +91 98235 73781 • +91 97307 68487</span>
          </div>
        </div>

        {/* Payment Policy */}
        <div className="pt-3 border-t border-salon-gray/80 flex justify-between items-center text-xs">
          <span className="text-salon-muted">Estimated Service Total:</span>
          <span className="font-mono font-bold text-sm text-salon-black">{booking.price}</span>
        </div>
        <div className="text-[11px] text-salon-muted bg-white p-3 rounded-xl border border-salon-gray/60">
          Payment is payable at the salon desk after your service (Cash, UPI, Credit/Debit cards accepted).
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={onBookAnother}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-full border border-salon-black text-xs font-semibold text-salon-black hover:bg-salon-ivory transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Book Another Visit</span>
        </button>

        <Link
          href="/"
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3 rounded-full bg-salon-rose hover:bg-salon-rose-dark text-white text-xs font-semibold uppercase tracking-wider shadow-md transition-all group"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Rescheduling/Cancellation Note */}
      <div className="text-[11px] text-salon-muted max-w-md mx-auto pt-4 border-t border-salon-gray/60">
        Need to reschedule or cancel? You can call us directly at +91 98235 73781 up to 2 hours before your scheduled arrival time.
      </div>
    </div>
  );
}

