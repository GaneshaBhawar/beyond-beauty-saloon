'use client';

import React from 'react';
import { Calendar as CalendarIcon, RefreshCw, Sparkles, MapPin } from 'lucide-react';

interface DashboardGreetingProps {
  ownerName?: string;
  selectedDate: string;
  onDateChange: (date: string) => void;
  onRefresh: () => void;
  loading?: boolean;
}

export function DashboardGreeting({
  ownerName = 'Beyond Salon',
  selectedDate,
  onDateChange,
  onRefresh,
  loading = false,
}: DashboardGreetingProps) {
  const getGreeting = () => {
    // Asia/Kolkata hour
    const now = new Date();
    const istHour = (now.getUTCHours() + 5.5) % 24;
    if (istHour < 12) return 'Good Morning';
    if (istHour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="bg-white rounded-3xl border border-[#EAE6E3] p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
      
      {/* Greeting and Context */}
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-[#FAF9F7] border border-[#EAE6E3] text-[10px] sm:text-[11px] font-bold text-[#B76E79] uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-[#C3A57B]" />
            <span>Operations Control Center</span>
          </span>
          <span className="text-xs text-[#707070] flex items-center">
            <MapPin className="w-3 h-3 mr-1 text-[#C3A57B]" />
            Savedi, Ahilyanagar
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525] tracking-tight">
          {getGreeting()}, <span className="text-[#B76E79]">{ownerName}</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#707070] max-w-xl leading-relaxed">
          Here is what is happening at Beyond Beauty Saloon today. Track live bookings, manage counter collections, review stylist stations, and ensure hospital-grade hygiene standards.
        </p>
      </div>

      {/* Date Filter & Refresh CTA */}
      <div className="flex items-center space-x-3 shrink-0">
        <div className="flex items-center space-x-2 bg-[#FAF9F7] border border-[#EAE6E3] rounded-2xl px-3.5 py-2 shadow-2xs">
          <CalendarIcon className="w-4 h-4 text-[#707070]" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="text-xs font-semibold text-[#252525] bg-transparent focus:outline-none cursor-pointer"
            title="Filter dashboard operational data by business date"
          />
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="p-2.5 rounded-2xl border border-[#EAE6E3] hover:border-[#B76E79] bg-[#FAF9F7] hover:bg-white text-[#252525] transition-all cursor-pointer shadow-2xs disabled:opacity-50"
          title="Refresh dashboard database metrics"
        >
          <RefreshCw className={`w-4 h-4 text-[#B76E79] ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

    </div>
  );
}

