'use client';

import React from 'react';
import { Scissors, Award } from 'lucide-react';
import { PopularServiceItem } from './types';

interface PopularServicesListProps {
  services: PopularServiceItem[];
}

export function PopularServicesList({ services }: PopularServicesListProps) {
  const maxCount = Math.max(...services.map((s) => s.count), 1);

  return (
    <div className="bg-white rounded-3xl border border-[#EAE6E3] p-6 sm:p-8 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#EAE6E3] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Scissors className="w-5 h-5 text-[#B76E79]" />
            <h3 className="text-lg sm:text-xl font-bold text-[#252525] tracking-tight">
              Popular Salon Services
            </h3>
          </div>
          <p className="text-xs text-[#707070] mt-0.5">
            Top customer treatments by completed service volume.
          </p>
        </div>
        <span className="p-2 rounded-xl bg-[#FAF9F7] text-[#C3A57B] border border-[#EAE6E3]">
          <Award className="w-4 h-4" />
        </span>
      </div>

      {/* Services List */}
      <div className="space-y-4">
        {services.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#707070]">
            No completed service records logged yet.
          </div>
        ) : (
          services.map((srv, idx) => {
            const percentage = Math.round((srv.count / maxCount) * 100);
            return (
              <div key={srv.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-[#FAF9F7] border border-[#EAE6E3] text-[10px] font-extrabold text-[#707070] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-[#252525] truncate max-w-[200px] sm:max-w-xs">
                      {srv.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-right">
                    <span className="font-bold text-[#252525]">
                      {srv.totalAmountFormatted}
                    </span>
                    <span className="text-[11px] text-[#707070] w-14 text-right">
                      {srv.count} {srv.count === 1 ? 'visit' : 'visits'}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-[#FAF9F7] rounded-full h-2 overflow-hidden border border-[#EAE6E3]/60">
                  <div
                    style={{ width: `${Math.max(percentage, 5)}%` }}
                    className="bg-[#B76E79] h-full rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}

