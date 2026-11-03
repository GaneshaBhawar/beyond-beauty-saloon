'use client';

import React from 'react';
import {
  CalendarPlus,
  Receipt,
  UserPlus,
  Clock,
  CalendarDays,
} from 'lucide-react';

interface QuickActionBarProps {
  onNewAppointment: () => void;
  onCreateBill: () => void;
  onAddCustomer: () => void;
  onMarkAttendance: () => void;
  onViewCalendar: () => void;
}

export function QuickActionBar({
  onNewAppointment,
  onCreateBill,
  onAddCustomer,
  onMarkAttendance,
  onViewCalendar,
}: QuickActionBarProps) {
  const actions = [
    {
      label: 'New Appointment',
      desc: 'Schedule advance client visit',
      icon: CalendarPlus,
      onClick: onNewAppointment,
      primary: true,
    },
    {
      label: 'Create Bill / Walk-in',
      desc: 'Instant counter invoice & receipt',
      icon: Receipt,
      onClick: onCreateBill,
      primary: false,
    },
    {
      label: 'Add Customer',
      desc: 'Register client profile',
      icon: UserPlus,
      onClick: onAddCustomer,
      primary: false,
    },
    {
      label: 'Mark Attendance',
      desc: 'Record shift attendance',
      icon: Clock,
      onClick: onMarkAttendance,
      primary: false,
    },
    {
      label: 'View Calendar',
      desc: 'Full stylist station grid',
      icon: CalendarDays,
      onClick: onViewCalendar,
      primary: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {actions.map((act) => {
        const Icon = act.icon;
        return (
          <button
            key={act.label}
            type="button"
            onClick={act.onClick}
            className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between group cursor-pointer ${
              act.primary
                ? 'bg-[#B76E79] border-[#B76E79] text-white shadow-xs hover:bg-[#9A5A64] hover:shadow'
                : 'bg-white border-[#EAE6E3] text-[#252525] hover:border-[#B76E79] hover:bg-[#FAF9F7] shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-2">
              <span className={`p-2 rounded-xl ${act.primary ? 'bg-white/20 text-white' : 'bg-[#FAF9F7] text-[#B76E79]'}`}>
                <Icon className="w-4 h-4" />
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${act.primary ? 'text-white/80' : 'text-[#707070]'}`}>
                Action
              </span>
            </div>
            <div>
              <span className="block text-xs font-bold leading-tight group-hover:underline">
                {act.label}
              </span>
              <span className={`text-[10px] line-clamp-1 mt-0.5 ${act.primary ? 'text-white/80' : 'text-[#707070]'}`}>
                {act.desc}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

