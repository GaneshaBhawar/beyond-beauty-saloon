'use client';

import React, { useState } from 'react';
import { TrendingUp, BarChart2, Info } from 'lucide-react';
import { SalesPerformanceData } from './types';

interface BusinessPerformanceChartProps {
  salesData: SalesPerformanceData;
  onRangeChange: (range: 'daily' | 'weekly' | 'monthly') => void;
  loading?: boolean;
}

export function BusinessPerformanceChart({
  salesData,
  onRangeChange,
  loading = false,
}: BusinessPerformanceChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const series = salesData.series || [];
  const maxVal = Math.max(
    ...series.map((s) => Math.max(s.billedSales, s.collections)),
    1000
  );

  return (
    <div className="bg-white rounded-3xl border border-[#EAE6E3] p-6 sm:p-8 shadow-xs space-y-6">
      
      {/* Title & Range Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE6E3] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-[#B76E79]" />
            <h3 className="text-lg sm:text-xl font-bold text-[#252525] tracking-tight">
              Business Revenue & Collections
            </h3>
          </div>
          <p className="text-xs text-[#707070] mt-0.5">
            Compare billed service value against counter payments collected over time.
          </p>
        </div>

        {/* Range Selector */}
        <div className="flex items-center bg-[#FAF9F7] p-1 rounded-xl border border-[#EAE6E3] text-xs font-semibold self-start sm:self-auto">
          {(
            [
              { id: 'daily', label: '7 Days' },
              { id: 'weekly', label: '4 Weeks' },
              { id: 'monthly', label: '6 Months' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              disabled={loading}
              onClick={() => onRangeChange(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                salesData.range === tab.id
                  ? 'bg-white text-[#252525] font-bold shadow-2xs'
                  : 'text-[#707070] hover:text-[#252525]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Legend & Summary */}
      <div className="flex items-center justify-between text-xs flex-wrap gap-3">
        <div className="flex items-center space-x-5">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-md bg-[#B76E79]"></span>
            <span className="font-semibold text-[#252525]">Billed Sales (Invoiced)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-md bg-emerald-500"></span>
            <span className="font-semibold text-[#252525]">Collections Received</span>
          </div>
        </div>

        <div className="text-[11px] text-[#707070] italic">
          Hover over bars to inspect detailed counter receipts
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="relative pt-6 pb-2">
        {series.length === 0 ? (
          <div className="h-56 flex items-center justify-center text-xs text-[#707070]">
            No financial transactions recorded for this period.
          </div>
        ) : (
          <div className="h-64 flex items-end gap-3 sm:gap-6 px-2 sm:px-6">
            {series.map((item, idx) => {
              const billedHeight = Math.max(Math.round((item.billedSales / maxVal) * 100), 4);
              const collHeight = Math.max(Math.round((item.collections / maxVal) * 100), 4);
              const isHovered = hoveredIndex === idx;

              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                >
                  {/* Tooltip on Hover */}
                  {isHovered && (
                    <div className="absolute -top-16 z-20 bg-[#252525] text-white p-2.5 rounded-xl text-[11px] shadow-xl whitespace-nowrap pointer-events-none animate-in fade-in duration-150">
                      <span className="block font-bold text-center border-b border-white/20 pb-1 mb-1">
                        {item.label}
                      </span>
                      <div className="flex justify-between space-x-3 text-rose-200">
                        <span>Billed:</span>
                        <span className="font-mono font-bold">₹{item.billedSales.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between space-x-3 text-emerald-300">
                        <span>Collected:</span>
                        <span className="font-mono font-bold">₹{item.collections.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  )}

                  {/* Dual Bars */}
                  <div className="w-full flex items-end justify-center space-x-1 sm:space-x-2 h-44">
                    {/* Billed Bar */}
                    <div
                      style={{ height: `${billedHeight}%` }}
                      className={`w-1/2 max-w-[20px] rounded-t-lg transition-all duration-300 ${
                        isHovered ? 'bg-[#9A5A64]' : 'bg-[#B76E79]'
                      }`}
                    />
                    {/* Collected Bar */}
                    <div
                      style={{ height: `${collHeight}%` }}
                      className={`w-1/2 max-w-[20px] rounded-t-lg transition-all duration-300 ${
                        isHovered ? 'bg-emerald-600' : 'bg-emerald-500'
                      }`}
                    />
                  </div>

                  {/* X-Axis Label */}
                  <span className="text-[10px] sm:text-[11px] font-semibold text-[#707070] mt-3 truncate max-w-[60px] sm:max-w-none text-center">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}

