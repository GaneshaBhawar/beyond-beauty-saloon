'use client';

import React, { useState } from 'react';
import { X, Calendar, Clock, User, Scissors, Check, Phone } from 'lucide-react';
import { SALON_SERVICES } from '@/data/servicesData';
import { saveAppointment } from '@/data/bookingStore';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  staffList?: { id: string; fullName: string; jobTitle: string }[];
}

export function NewAppointmentModal({
  isOpen,
  onClose,
  onSuccess,
  staffList = [],
}: NewAppointmentModalProps) {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [serviceId, setServiceId] = useState(SALON_SERVICES[0].id);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('11:00 AM');
  const [stylist, setStylist] = useState('Priya Deshmukh (Senior Stylist)');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) return;

    setSubmitting(true);
    const selectedSrv = SALON_SERVICES.find((s) => s.id === serviceId) || SALON_SERVICES[0];

    saveAppointment({
      serviceId: selectedSrv.id,
      serviceName: selectedSrv.name,
      category: selectedSrv.categoryLabel,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      date,
      time,
      stylist,
      status: 'CONFIRMED',
      price: selectedSrv.priceFormatted,
      paymentStatus: 'PAID_PENDING' as any,
      notes: notes.trim() || 'Booked via Admin Command Center.',
    });

    setSubmitting(false);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-[#EAE6E3] max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150 text-xs">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EAE6E3] pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#252525]">
              Schedule New Appointment
            </h3>
            <p className="text-[#707070] mt-0.5">
              Book a confirmed treatment slot for a client.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl border border-[#EAE6E3] hover:bg-[#FAF9F7] text-[#707070]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-[#252525]">Client Full Name *</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Radhika Sharma"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE6E3] focus:border-[#B76E79] focus:outline-none bg-[#FAF9F7]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#252525]">Phone Number *</label>
              <input
                type="tel"
                required
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="e.g. 98221 44556"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE6E3] focus:border-[#B76E79] focus:outline-none bg-[#FAF9F7]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#252525]">Salon Treatment / Service *</label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE6E3] focus:border-[#B76E79] focus:outline-none bg-[#FAF9F7]"
            >
              {SALON_SERVICES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.priceFormatted} ({s.durationMinutes} mins)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-[#252525]">Appointment Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE6E3] focus:border-[#B76E79] focus:outline-none bg-[#FAF9F7]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#252525]">Preferred Time Slot *</label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE6E3] focus:border-[#B76E79] focus:outline-none bg-[#FAF9F7]"
              >
                {['10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#252525]">Assigned Stylist</label>
            <select
              value={stylist}
              onChange={(e) => setStylist(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE6E3] focus:border-[#B76E79] focus:outline-none bg-[#FAF9F7]"
            >
              <option value="Priya Deshmukh (Senior Stylist)">Priya Deshmukh (Senior Stylist)</option>
              <option value="Sneha Patil (Skin Specialist)">Sneha Patil (Skin Specialist)</option>
              <option value="Aarti Shinde (Spa & Makeup)">Aarti Shinde (Spa & Makeup)</option>
              {staffList.map((s) => (
                <option key={s.id} value={`${s.fullName} (${s.jobTitle})`}>
                  {s.fullName} ({s.jobTitle})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#252525]">Client Consultation Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Requested soft face-framing layers or special herbal cleanup."
              className="w-full px-3.5 py-2 rounded-xl border border-[#EAE6E3] focus:border-[#B76E79] focus:outline-none bg-[#FAF9F7]"
            />
          </div>

          <div className="pt-3 flex items-center justify-end space-x-3 border-t border-[#EAE6E3]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#EAE6E3] text-[#707070] font-semibold hover:bg-[#FAF9F7]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-[#B76E79] hover:bg-[#9A5A64] text-white font-bold uppercase tracking-wider shadow-xs transition-all"
            >
              Confirm Booking
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
