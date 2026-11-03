'use client';

import React from 'react';
import { X, Printer, CheckCircle2, Scissors } from 'lucide-react';
import { StoredAppointment } from '@/data/bookingStore';

interface ReceiptModalProps {
  receipt: StoredAppointment | null;
  onClose: () => void;
}

export function ReceiptModal({ receipt, onClose }: ReceiptModalProps) {
  if (!receipt) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-[#EAE6E3] max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150 text-xs">
        
        {/* Modal Actions */}
        <div className="flex items-center justify-between border-b border-[#EAE6E3] pb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#B76E79]">
            Official Counter Tax Receipt
          </span>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl bg-[#B76E79] text-white hover:bg-[#9A5A64] font-bold inline-flex items-center shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 mr-1" />
              Print Receipt
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl border border-[#EAE6E3] text-[#707070] hover:bg-[#FAF9F7]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Slip */}
        <div className="border border-dashed border-[#EAE6E3] rounded-2xl p-5 bg-[#FAF9F7]/70 space-y-4">
          
          <div className="text-center space-y-1">
            <h4 className="font-extrabold text-base text-[#252525] tracking-tight">
              Beyond Beauty Saloon
            </h4>
            <p className="text-[11px] text-[#707070]">
              Near Kohinoor Mangal Karyalaya, Savedi, Ahilyanagar 414003
            </p>
            <p className="text-[10px] text-[#707070]">
              Direct Dial: +91 98235 73781 / +91 97307 68487
            </p>
          </div>

          <div className="pt-2 border-t border-dashed border-[#EAE6E3] grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-[#707070] block">Receipt Ref:</span>
              <span className="font-bold text-[#252525] font-mono">{receipt.reference}</span>
            </div>
            <div className="text-right">
              <span className="text-[#707070] block">Date & Time:</span>
              <span className="font-semibold text-[#252525]">{receipt.date} {receipt.time}</span>
            </div>
            <div>
              <span className="text-[#707070] block">Client Name:</span>
              <span className="font-bold text-[#252525]">{receipt.clientName}</span>
            </div>
            <div className="text-right">
              <span className="text-[#707070] block">Attending Stylist:</span>
              <span className="font-semibold text-[#252525]">{receipt.stylist}</span>
            </div>
          </div>

          {/* Line Items */}
          <div className="pt-2 border-t border-dashed border-[#EAE6E3] space-y-1.5">
            <div className="flex justify-between items-center text-[11px] font-bold text-[#707070] pb-1 border-b border-[#EAE6E3]">
              <span>Service Description</span>
              <span>Amount</span>
            </div>
            <div className="flex justify-between items-center text-[12px] font-semibold text-[#252525]">
              <span>{receipt.serviceName}</span>
              <span className="font-bold">{receipt.price}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] text-emerald-600">
              <span>UV Sterilization & Hygiene Protocol</span>
              <span>Included</span>
            </div>
          </div>

          {/* Total & Payment Method */}
          <div className="pt-2 border-t border-dashed border-[#EAE6E3] space-y-1">
            <div className="flex justify-between items-center font-bold text-sm text-[#252525]">
              <span>Total Paid:</span>
              <span className="text-base text-[#B76E79]">{receipt.price}</span>
            </div>
            <div className="flex justify-between items-center text-[11px] text-[#707070]">
              <span>Settlement Channel:</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                {receipt.paymentStatus ? receipt.paymentStatus.replace('PAID_', '') : 'VERIFIED'}
              </span>
            </div>
          </div>

          <div className="text-center pt-2 text-[10px] text-[#707070] border-t border-dashed border-[#EAE6E3]">
            Thank you for visiting Beyond Beauty Saloon!
          </div>

        </div>

      </div>
    </div>
  );
}

