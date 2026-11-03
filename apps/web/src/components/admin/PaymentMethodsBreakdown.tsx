'use client';

import React from 'react';
import { CreditCard, QrCode, Banknote, Building2 } from 'lucide-react';
import { PaymentMethodItem } from './types';

interface PaymentMethodsBreakdownProps {
  paymentMethods: PaymentMethodItem[];
}

export function PaymentMethodsBreakdown({
  paymentMethods,
}: PaymentMethodsBreakdownProps) {
  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'UPI':
        return <QrCode className="w-4 h-4 text-emerald-600" />;
      case 'CASH':
        return <Banknote className="w-4 h-4 text-amber-600" />;
      case 'CARD_AT_COUNTER':
        return <CreditCard className="w-4 h-4 text-indigo-600" />;
      case 'BANK_TRANSFER':
        return <Building2 className="w-4 h-4 text-slate-600" />;
      default:
        return <CreditCard className="w-4 h-4 text-[#707070]" />;
    }
  };

  const totalPaise = paymentMethods.reduce((a, c) => a + c.amountPaise, 0);

  return (
    <div className="bg-white rounded-3xl border border-[#EAE6E3] p-6 sm:p-8 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#EAE6E3] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-[#B76E79]" />
            <h3 className="text-lg sm:text-xl font-bold text-[#252525] tracking-tight">
              Payment Methods Breakdown
            </h3>
          </div>
          <p className="text-xs text-[#707070] mt-0.5">
            Verified counter receipts categorized by payment channel.
          </p>
        </div>
        <span className="text-xs font-bold text-[#252525] bg-[#FAF9F7] px-3 py-1 rounded-full border border-[#EAE6E3]">
          Total: ₹{(totalPaise / 100).toLocaleString('en-IN')}
        </span>
      </div>

      {/* Breakdown Items */}
      <div className="space-y-4">
        {paymentMethods.map((pm) => (
          <div key={pm.method} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 rounded-lg bg-[#FAF9F7] border border-[#EAE6E3]">
                  {getMethodIcon(pm.method)}
                </span>
                <span className="font-bold text-[#252525]">{pm.label}</span>
                <span className="text-[10px] text-[#707070]">
                  ({pm.count} {pm.count === 1 ? 'receipt' : 'receipts'})
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-[#252525]">
                  {pm.amountFormatted}
                </span>
                <span className="text-[11px] font-semibold text-[#707070] w-10 text-right">
                  {pm.percentage}%
                </span>
              </div>
            </div>

            {/* Visual Bar */}
            <div className="w-full bg-[#FAF9F7] rounded-full h-2 overflow-hidden border border-[#EAE6E3]/60">
              <div
                style={{ width: `${Math.max(pm.percentage, pm.amountPaise > 0 ? 5 : 0)}%` }}
                className={`h-full rounded-full transition-all duration-500 ${
                  pm.method === 'UPI'
                    ? 'bg-emerald-500'
                    : pm.method === 'CASH'
                    ? 'bg-amber-500'
                    : pm.method === 'CARD_AT_COUNTER'
                    ? 'bg-indigo-500'
                    : 'bg-[#B76E79]'
                }`}
              />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

