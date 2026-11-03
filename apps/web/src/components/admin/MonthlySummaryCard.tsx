'use client';

import React from 'react';
import { DollarSign, FileText, CreditCard, TrendingDown, AlertCircle, Info } from 'lucide-react';
import { MonthlySummaryData } from './types';

interface MonthlySummaryCardProps {
  summary: MonthlySummaryData;
}

export function MonthlySummaryCard({ summary }: MonthlySummaryCardProps) {
  const isPositive = summary.operatingResultPaise >= 0;

  return (
    <div className="bg-white rounded-3xl border border-[#EAE6E3] p-6 sm:p-8 shadow-xs space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EAE6E3] pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#B76E79] block">
            Financial Ledger Summary
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-[#252525] tracking-tight">
            {summary.periodLabel} Performance
          </h3>
        </div>
        <span className="text-xs text-[#707070] bg-[#FAF9F7] px-3 py-1 rounded-full border border-[#EAE6E3]">
          Savedi Operating Ledger
        </span>
      </div>

      {/* Grid of Key Financials */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl bg-[#FAF9F7] border border-[#EAE6E3] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#707070] flex items-center">
            <FileText className="w-3 h-3 mr-1 text-indigo-600" />
            Total Billed
          </span>
          <div className="text-lg sm:text-xl font-extrabold text-[#252525]">
            {summary.totalBilledSalesFormatted}
          </div>
          <span className="text-[10px] text-[#707070] block">Gross Invoiced</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAF9F7] border border-[#EAE6E3] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#707070] flex items-center">
            <CreditCard className="w-3 h-3 mr-1 text-[#C3A57B]" />
            Total Collected
          </span>
          <div className="text-lg sm:text-xl font-extrabold text-[#252525]">
            {summary.totalCollectionsFormatted}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold block">Counter Receipts</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAF9F7] border border-[#EAE6E3] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#707070] flex items-center">
            <TrendingDown className="w-3 h-3 mr-1 text-amber-600" />
            Expenses
          </span>
          <div className="text-lg sm:text-xl font-extrabold text-[#252525]">
            {summary.recordedExpensesFormatted}
          </div>
          <span className="text-[10px] text-[#707070] block">Stock & Supplies</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAF9F7] border border-[#EAE6E3] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#707070] flex items-center">
            <AlertCircle className="w-3 h-3 mr-1 text-rose-600" />
            Outstanding Dues
          </span>
          <div className="text-lg sm:text-xl font-extrabold text-[#252525]">
            {summary.outstandingDuesFormatted}
          </div>
          <span className="text-[10px] text-rose-600 font-semibold block">Pending Client Ledger</span>
        </div>

      </div>

      {/* Operating Result Callout */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        isPositive ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-amber-50/70 border-amber-200 text-amber-900'
      }`}>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider block">
            Net Monthly Operating Result (Collections – Recorded Expenses)
          </span>
          <span className="text-xs text-[#707070] mt-0.5 block">
            Realized counter receipts minus verified supply reorders for this month.
          </span>
        </div>
        <div className="text-2xl font-extrabold font-mono">
          {summary.operatingResultFormatted}
        </div>
      </div>

      {/* Methodology Disclosure Note */}
      <div className="p-3.5 rounded-xl bg-[#FAF9F7] border border-[#EAE6E3] text-[11px] text-[#707070] space-y-1 flex items-start space-x-2">
        <Info className="w-4 h-4 text-[#B76E79] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold text-[#252525]">Calculation Methodology: </span>
          {summary.methodologyNotes}
        </div>
      </div>

    </div>
  );
}

