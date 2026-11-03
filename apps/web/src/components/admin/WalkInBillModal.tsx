'use client';

import React, { useState } from 'react';
import { X, Receipt, Check, DollarSign, QrCode, Banknote, CreditCard } from 'lucide-react';
import { SALON_SERVICES } from '@/data/servicesData';
import { saveAppointment, StoredAppointment } from '@/data/bookingStore';

interface WalkInBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (createdApt: StoredAppointment) => void;
}

export function WalkInBillModal({
  isOpen,
  onClose,
  onSuccess,
}: WalkInBillModalProps) {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [serviceId, setServiceId] = useState(SALON_SERVICES[0].id);
  const [paymentMode, setPaymentMode] = useState<'PAID_UPI' | 'PAID_CASH' | 'PAID_CARD'>('PAID_UPI');
  const [discountPaise, setDiscountPaise] = useState('0');

  if (!isOpen) return null;

  const selectedSrv = SALON_SERVICES.find((s) => s.id === serviceId) || SALON_SERVICES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName) return;

    const created = saveAppointment({
      serviceId: selectedSrv.id,
      serviceName: selectedSrv.name,
      category: selectedSrv.categoryLabel,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim() || '+91 98000 00000',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      stylist: 'Priya Deshmukh (Senior Stylist)',
      status: 'COMPLETED',
      price: selectedSrv.priceFormatted,
      paymentStatus: paymentMode,
      notes: `Counter walk-in bill generated. Payment mode: ${paymentMode.replace('PAID_', '')}.`,
    });

    onSuccess(created);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-[#EAE6E3] max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150 text-xs">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EAE6E3] pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#252525] flex items-center">
              <Receipt className="w-5 h-5 text-[#B76E79] mr-2" />
              Generate Walk-in Counter Bill
            </h3>
            <p className="text-[#707070] mt-0.5">
              Instantly record client treatments and counter payment receipts.
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
              <label className="font-bold text-[#252525]">Client Name *</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Pooja Patil"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE6E3] focus:border-[#B76E79] focus:outline-none bg-[#FAF9F7]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#252525]">Contact Phone</label>
              <input
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="e.g. 97307 68487"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE6E3] focus:border-[#B76E79] focus:outline-none bg-[#FAF9F7]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#252525]">Service Rendered *</label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE6E3] focus:border-[#B76E79] focus:outline-none bg-[#FAF9F7]"
            >
              {SALON_SERVICES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.priceFormatted}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="font-bold text-[#252525]">Settlement Channel *</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'PAID_UPI', label: 'UPI / QR', icon: QrCode },
                { id: 'PAID_CASH', label: 'Cash', icon: Banknote },
                { id: 'PAID_CARD', label: 'POS Card', icon: CreditCard },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = paymentMode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMode(m.id as any)}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all ${
                      isSelected
                        ? 'border-[#B76E79] bg-rose-50/60 text-[#B76E79] font-bold shadow-2xs'
                        : 'border-[#EAE6E3] bg-[#FAF9F7] text-[#252525] hover:border-[#B76E79]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[11px]">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bill Summary Box */}
          <div className="p-4 rounded-2xl bg-[#FAF9F7] border border-[#EAE6E3] space-y-2">
            <div className="flex justify-between items-center text-[#707070]">
              <span>Treatment Rate:</span>
              <span className="font-bold text-[#252525]">{selectedSrv.priceFormatted}</span>
            </div>
            <div className="flex justify-between items-center text-[#707070]">
              <span>Taxes & Hygiene Kit:</span>
              <span className="text-emerald-600 font-semibold">Included</span>
            </div>
            <div className="pt-2 border-t border-[#EAE6E3] flex justify-between items-center font-bold text-sm text-[#252525]">
              <span>Total Payable:</span>
              <span className="text-base text-[#B76E79]">{selectedSrv.priceFormatted}</span>
            </div>
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
              className="px-6 py-2.5 rounded-xl bg-[#B76E79] hover:bg-[#9A5A64] text-white font-bold uppercase tracking-wider shadow-xs transition-all"
            >
              Record Bill & Print
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

