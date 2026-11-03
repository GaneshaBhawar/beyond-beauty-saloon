'use client';

import React from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  Scissors,
  DollarSign,
  Receipt,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { DashboardAppointmentItem } from './types';

interface AppointmentDetailsDrawerProps {
  appointment: DashboardAppointmentItem | null;
  onClose: () => void;
  onUpdateStatus: (aptId: string, newStatus: string) => void;
  onCreateBill: (apt: DashboardAppointmentItem) => void;
}

export function AppointmentDetailsDrawer({
  appointment,
  onClose,
  onUpdateStatus,
  onCreateBill,
}: AppointmentDetailsDrawerProps) {
  if (!appointment) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200 text-xs">
        
        {/* Header */}
        <div className="p-6 border-b border-[#EAE6E3] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#707070] block">
              Appointment Dossier
            </span>
            <h3 className="text-base font-bold text-[#252525] font-mono mt-0.5">
              {appointment.referenceCode}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl border border-[#EAE6E3] hover:bg-[#FAF9F7] text-[#707070]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Status Banner */}
          <div className="p-3.5 rounded-2xl bg-[#FAF9F7] border border-[#EAE6E3] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#707070] uppercase font-bold block">
                Booking Status
              </span>
              <span className="font-extrabold text-[#252525] text-sm mt-0.5 block">
                {appointment.status.replace(/_/g, ' ')}
              </span>
            </div>
            <span className="text-xs font-bold text-[#B76E79]">
              {appointment.paymentStatus === 'PAID' ? 'Bill Settled' : 'Payment Pending'}
            </span>
          </div>

          {/* Customer Profile */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#252525] uppercase tracking-wider flex items-center text-[#B76E79]">
              <User className="w-3.5 h-3.5 mr-1.5" />
              Client Information
            </h4>
            <div className="p-4 rounded-2xl border border-[#EAE6E3] bg-white space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-[#252525]">
                  {appointment.clientName}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                  Savedi Studio Client
                </span>
              </div>
              <div className="flex items-center text-[#707070] pt-1 border-t border-[#EAE6E3]/60">
                <Phone className="w-3.5 h-3.5 mr-1.5 text-[#B76E79]" />
                <a
                  href={`tel:${appointment.clientPhone}`}
                  className="hover:underline font-semibold text-[#252525]"
                >
                  {appointment.clientPhone}
                </a>
              </div>
            </div>
          </div>

          {/* Treatment & Pricing */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#252525] uppercase tracking-wider flex items-center text-[#B76E79]">
              <Scissors className="w-3.5 h-3.5 mr-1.5" />
              Scheduled Treatment
            </h4>
            <div className="p-4 rounded-2xl border border-[#EAE6E3] bg-white space-y-2.5">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-bold text-sm text-[#252525] block">
                    {appointment.serviceName}
                  </span>
                  <span className="text-[10px] text-[#707070] flex items-center mt-0.5">
                    <Clock className="w-3 h-3 mr-1" />
                    Duration: {appointment.durationMinutes} minutes
                  </span>
                </div>
                <span className="text-sm font-extrabold text-[#252525]">
                  {appointment.estimatedTotalFormatted}
                </span>
              </div>
              <div className="pt-2 border-t border-[#EAE6E3]/60 flex items-center justify-between text-[#707070]">
                <span>Assigned Stylist:</span>
                <span className="font-bold text-[#252525]">{appointment.stylistName}</span>
              </div>
              <div className="flex items-center justify-between text-[#707070]">
                <span>Time Slot:</span>
                <span className="font-semibold text-[#252525]">
                  {appointment.startTimeFormatted} – {appointment.endTimeFormatted}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Status Workflow Transitions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#252525] uppercase tracking-wider">
              Transition Status
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {appointment.status !== 'IN_SERVICE' && (
                <button
                  type="button"
                  onClick={() => onUpdateStatus(appointment.id, 'IN_SERVICE')}
                  className="p-2.5 rounded-xl border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-center"
                >
                  Seat Client / Start
                </button>
              )}
              {appointment.status !== 'COMPLETED' && (
                <button
                  type="button"
                  onClick={() => onUpdateStatus(appointment.id, 'COMPLETED')}
                  className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-center"
                >
                  Mark Completed
                </button>
              )}
              {!appointment.status.startsWith('CANCELLED') && (
                <button
                  type="button"
                  onClick={() => onUpdateStatus(appointment.id, 'CANCELLED_BY_STAFF')}
                  className="p-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-center"
                >
                  Cancel Booking
                </button>
              )}
              {appointment.status !== 'CONFIRMED' && (
                <button
                  type="button"
                  onClick={() => onUpdateStatus(appointment.id, 'CONFIRMED')}
                  className="p-2.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-center"
                >
                  Confirm Slot
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#EAE6E3] bg-[#FAF9F7] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onCreateBill(appointment)}
            className="flex-1 py-3 px-4 rounded-xl bg-[#B76E79] hover:bg-[#9A5A64] text-white font-bold uppercase tracking-wider text-center shadow-xs transition-all inline-flex items-center justify-center"
          >
            <Receipt className="w-4 h-4 mr-1.5" />
            Generate Counter Bill
          </button>
        </div>

      </div>
    </div>
  );
}

