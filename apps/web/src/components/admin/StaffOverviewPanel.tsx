'use client';

import React from 'react';
import { Users, Clock, CheckCircle2, UserCheck, Calendar } from 'lucide-react';
import { StaffOverviewData } from './types';

interface StaffOverviewPanelProps {
  staffOverview: StaffOverviewData;
  onMarkAttendance: () => void;
  onViewRoster: () => void;
}

export function StaffOverviewPanel({
  staffOverview,
  onMarkAttendance,
  onViewRoster,
}: StaffOverviewPanelProps) {
  const { counts, staffList } = staffOverview;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PRESENT':
      case 'LATE':
      case 'HALF_DAY':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Present
          </span>
        );
      case 'ON_LEAVE':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            On Leave
          </span>
        );
      case 'ABSENT':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            Absent
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-600">
            Not Marked
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#EAE6E3] p-6 sm:p-8 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE6E3] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-[#B76E79]" />
            <h3 className="text-lg sm:text-xl font-bold text-[#252525] tracking-tight">
              Staff Floor Roster & Attendance
            </h3>
          </div>
          <p className="text-xs text-[#707070] mt-0.5">
            Active stylists, technicians, and floor attendance status for this date.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onMarkAttendance}
            className="px-3.5 py-1.5 rounded-xl bg-[#FAF9F7] text-[#B76E79] hover:bg-[#B76E79] hover:text-white border border-[#B76E79] text-xs font-bold transition-all cursor-pointer"
          >
            Mark Attendance
          </button>
          <button
            type="button"
            onClick={onViewRoster}
            className="px-3.5 py-1.5 rounded-xl bg-white text-[#252525] hover:bg-[#FAF9F7] border border-[#EAE6E3] text-xs font-bold transition-all cursor-pointer"
          >
            Full Roster &rarr;
          </button>
        </div>
      </div>

      {/* Attendance Summary Status Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
              Present
            </span>
            <span className="text-xl font-extrabold text-emerald-900">
              {counts.present}
            </span>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        </div>

        <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
              On Leave
            </span>
            <span className="text-xl font-extrabold text-amber-900">
              {counts.onLeave}
            </span>
          </div>
          <Clock className="w-5 h-5 text-amber-600" />
        </div>

        <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block">
              Absent
            </span>
            <span className="text-xl font-extrabold text-rose-900">
              {counts.absent}
            </span>
          </div>
          <Users className="w-5 h-5 text-rose-600" />
        </div>

        <div className="p-3 rounded-2xl bg-[#FAF9F7] border border-[#EAE6E3] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#707070] block">
              Not Yet Marked
            </span>
            <span className="text-xl font-extrabold text-[#252525]">
              {counts.notMarked}
            </span>
          </div>
          <UserCheck className="w-5 h-5 text-[#707070]" />
        </div>
      </div>

      {/* Staff Roster Cards List */}
      <div className="divide-y divide-[#EAE6E3]">
        {staffList.slice(0, 5).map((staff) => (
          <div
            key={staff.id}
            className="py-3 flex items-center justify-between gap-4 hover:bg-[#FAF9F7]/50 px-2 rounded-xl transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-[#FAF9F7] border border-[#EAE6E3] flex items-center justify-center font-bold text-xs text-[#252525] shrink-0">
                {staff.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <span className="block font-bold text-xs text-[#252525]">
                  {staff.fullName}
                </span>
                <span className="text-[11px] text-[#707070] flex items-center space-x-1.5">
                  <span>{staff.jobTitle}</span>
                  <span>•</span>
                  <span className="font-mono text-[10px] text-[#B76E79] font-bold">{staff.staffCode}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <span className="text-[11px] font-bold text-[#252525] block">
                  {staff.assignedAppointmentsToday} {staff.assignedAppointmentsToday === 1 ? 'client' : 'clients'}
                </span>
                <span className="text-[10px] text-[#707070]">assigned today</span>
              </div>
              {getStatusBadge(staff.status)}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

