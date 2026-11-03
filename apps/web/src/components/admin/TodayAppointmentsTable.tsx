'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  Scissors,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Plus,
  Receipt,
  Eye,
  Filter,
} from 'lucide-react';
import { DashboardAppointmentItem } from './types';

interface TodayAppointmentsTableProps {
  appointments: DashboardAppointmentItem[];
  onSelectAppointment: (apt: DashboardAppointmentItem) => void;
  onUpdateStatus: (aptId: string, newStatus: string) => void;
  onNewAppointment: () => void;
  onCreateBill: (apt: DashboardAppointmentItem) => void;
}

export function TodayAppointmentsTable({
  appointments,
  onSelectAppointment,
  onUpdateStatus,
  onNewAppointment,
  onCreateBill,
}: TodayAppointmentsTableProps) {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchFilter, setSearchFilter] = useState('');

  const filtered = appointments.filter((apt) => {
    const matchesStatus =
      filterStatus === 'ALL' ||
      (filterStatus === 'CONFIRMED' && (apt.status === 'CONFIRMED' || apt.status === 'REQUESTED')) ||
      (filterStatus === 'IN_SERVICE' && apt.status === 'IN_SERVICE') ||
      (filterStatus === 'COMPLETED' && apt.status === 'COMPLETED') ||
      (filterStatus === 'CANCELLED' && apt.status.startsWith('CANCELLED'));

    const matchesSearch =
      apt.clientName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      apt.clientPhone.includes(searchFilter) ||
      apt.serviceName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      apt.referenceCode.toLowerCase().includes(searchFilter.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            Confirmed
          </span>
        );
      case 'REQUESTED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
            Requested
          </span>
        );
      case 'IN_SERVICE':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            In Chair / Service
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Completed
          </span>
        );
      case 'CANCELLED_BY_CUSTOMER':
      case 'CANCELLED_BY_STAFF':
      case 'NO_SHOW':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-stone-100 text-stone-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#EAE6E3] shadow-xs overflow-hidden space-y-4 p-6 sm:p-8">
      
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE6E3] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-[#B76E79]" />
            <h2 className="text-lg sm:text-xl font-bold text-[#252525] tracking-tight">
              Today's Appointment Schedule
            </h2>
          </div>
          <p className="text-xs text-[#707070] mt-0.5">
            Real client bookings assigned to stylist stations for this business date.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 flex-wrap gap-y-2">
          {/* Status Filter Buttons */}
          <div className="flex items-center bg-[#FAF9F7] p-1 rounded-xl border border-[#EAE6E3] text-xs font-semibold">
            {(
              [
                { id: 'ALL', label: `All (${appointments.length})` },
                { id: 'CONFIRMED', label: 'Upcoming' },
                { id: 'IN_SERVICE', label: 'In Service' },
                { id: 'COMPLETED', label: 'Completed' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setFilterStatus(t.id)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filterStatus === t.id
                    ? 'bg-white text-[#252525] font-bold shadow-2xs'
                    : 'text-[#707070] hover:text-[#252525]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onNewAppointment}
            className="px-4 py-2 rounded-xl bg-[#B76E79] hover:bg-[#9A5A64] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            New Appointment
          </button>
        </div>
      </div>

      {/* Table Content or Empty State */}
      {filtered.length === 0 ? (
        <div className="py-12 px-4 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#FAF9F7] text-[#707070] mx-auto flex items-center justify-center border border-[#EAE6E3]">
            <Calendar className="w-6 h-6 text-[#B76E79]" />
          </div>
          <h3 className="text-sm font-bold text-[#252525]">
            No appointments scheduled for this view
          </h3>
          <p className="text-xs text-[#707070] max-w-sm mx-auto leading-relaxed">
            There are currently no matching client visits for today. You can schedule an advance appointment or record a walk-in visit.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={onNewAppointment}
              className="px-5 py-2 rounded-full bg-[#B76E79] hover:bg-[#9A5A64] text-white text-xs font-bold uppercase tracking-wider shadow-xs transition-all inline-flex items-center cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Create Appointment
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#EAE6E3] text-[#707070] text-[11px] uppercase tracking-wider bg-[#FAF9F7]/60">
                <th className="py-3 px-3.5 font-bold">Time & Ref</th>
                <th className="py-3 px-3.5 font-bold">Client</th>
                <th className="py-3 px-3.5 font-bold">Service</th>
                <th className="py-3 px-3.5 font-bold">Assigned Stylist</th>
                <th className="py-3 px-3.5 font-bold">Est. Fee</th>
                <th className="py-3 px-3.5 font-bold">Status</th>
                <th className="py-3 px-3.5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE6E3]">
              {filtered.map((apt) => (
                <tr key={apt.id} className="hover:bg-[#FAF9F7]/50 transition-colors">
                  
                  {/* Time & Reference */}
                  <td className="py-3.5 px-3.5">
                    <span className="block font-bold text-[#252525]">
                      {apt.startTimeFormatted}
                    </span>
                    <span className="text-[10px] text-[#707070] font-mono">
                      {apt.referenceCode}
                    </span>
                  </td>

                  {/* Client Name & Phone */}
                  <td className="py-3.5 px-3.5">
                    <span className="block font-bold text-[#252525]">
                      {apt.clientName}
                    </span>
                    <a
                      href={`tel:${apt.clientPhone}`}
                      className="text-[11px] text-[#707070] hover:text-[#B76E79] transition-colors"
                    >
                      {apt.clientPhone}
                    </a>
                  </td>

                  {/* Service & Duration */}
                  <td className="py-3.5 px-3.5">
                    <span className="block font-semibold text-[#252525]">
                      {apt.serviceName}
                    </span>
                    <span className="text-[10px] text-[#707070] flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {apt.durationMinutes} mins
                    </span>
                  </td>

                  {/* Assigned Stylist */}
                  <td className="py-3.5 px-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#FAF9F7] text-[#252525] border border-[#EAE6E3]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B76E79] mr-1.5"></span>
                      {apt.stylistName}
                    </span>
                  </td>

                  {/* Estimated Price */}
                  <td className="py-3.5 px-3.5 font-bold text-[#252525]">
                    {apt.estimatedTotalFormatted}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-3.5">
                    {getStatusBadge(apt.status)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-3.5 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onSelectAppointment(apt)}
                      className="p-1.5 rounded-lg border border-[#EAE6E3] hover:border-[#B76E79] hover:bg-white text-[#252525] transition-colors"
                      title="View full appointment details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    {apt.status === 'CONFIRMED' && (
                      <button
                        type="button"
                        onClick={() => onUpdateStatus(apt.id, 'IN_SERVICE')}
                        className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 font-bold text-[11px]"
                      >
                        Start Service
                      </button>
                    )}

                    {apt.status === 'IN_SERVICE' && (
                      <button
                        type="button"
                        onClick={() => onUpdateStatus(apt.id, 'COMPLETED')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-bold text-[11px]"
                      >
                        Complete
                      </button>
                    )}

                    {apt.status === 'COMPLETED' && (
                      <button
                        type="button"
                        onClick={() => onCreateBill(apt)}
                        className="px-2.5 py-1 rounded-lg bg-[#FAF9F7] text-[#B76E79] border border-[#B76E79] hover:bg-[#B76E79] hover:text-white font-bold text-[11px] inline-flex items-center transition-colors"
                      >
                        <Receipt className="w-3 h-3 mr-1" />
                        Invoice / Bill
                      </button>
                    )}

                    {apt.status === 'REQUESTED' && (
                      <button
                        type="button"
                        onClick={() => onUpdateStatus(apt.id, 'CONFIRMED')}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 font-bold text-[11px]"
                      >
                        Confirm Slot
                      </button>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}

