'use client';

import React, { useState } from 'react';
import { X, Clock, Check, AlertCircle, CheckCircle2 } from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface StaffItem {
  id: string;
  fullName: string;
  jobTitle: string;
  staffCode: string;
}

interface MarkAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  staffList: StaffItem[];
  selectedDate: string;
}

export function MarkAttendanceModal({
  isOpen,
  onClose,
  onSuccess,
  staffList,
  selectedDate,
}: MarkAttendanceModalProps) {
  const [employeeId, setEmployeeId] = useState(staffList[0]?.id || '');
  const [status, setStatus] = useState<'PRESENT' | 'LATE' | 'HALF_DAY' | 'ON_LEAVE' | 'ABSENT'>('PRESENT');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId) return;

    setLoading(true);
    setError('');

    try {
      const res = await apiRequest('/admin/attendance', {
        method: 'POST',
        body: JSON.stringify({
          employeeId,
          date: selectedDate,
          status,
          notes: notes.trim() || undefined,
        }),
      });

      if (!res.success) {
        setError(res.error || 'Failed to record attendance.');
        return;
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Error communicating with server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-[#EAE6E3] max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150 text-xs">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EAE6E3] pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#252525] flex items-center">
              <Clock className="w-5 h-5 text-[#B76E79] mr-2" />
              Mark Staff Attendance
            </h3>
            <p className="text-[#707070] mt-0.5">
              Record daily shift status for {selectedDate}.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl border border-[#EAE6E3] hover:bg-[#FAF9F7] text-[#707070]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1">
            <label className="font-bold text-[#252525]">Staff Member *</label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE6E3] focus:border-[#B76E79] focus:outline-none bg-[#FAF9F7]"
            >
              {staffList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fullName} ({s.jobTitle}) — {s.staffCode}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="font-bold text-[#252525]">Attendance Status *</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'PRESENT', label: 'Present (On Duty)', color: 'text-emerald-700 border-emerald-300 bg-emerald-50' },
                { id: 'LATE', label: 'Late Arrival', color: 'text-blue-700 border-blue-300 bg-blue-50' },
                { id: 'HALF_DAY', label: 'Half Day Shift', color: 'text-purple-700 border-purple-300 bg-purple-50' },
                { id: 'ON_LEAVE', label: 'Authorized Leave', color: 'text-amber-700 border-amber-300 bg-amber-50' },
                { id: 'ABSENT', label: 'Unexcused Absent', color: 'text-rose-700 border-rose-300 bg-rose-50' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setStatus(opt.id as any)}
                  className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                    status === opt.id
                      ? `${opt.color} ring-2 ring-[#B76E79]/30`
                      : 'border-[#EAE6E3] bg-[#FAF9F7] text-[#707070] hover:text-[#252525]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#252525]">Notes / Shift Exceptions</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Swapped afternoon shift with Priya; arrived 15 mins late due to transit."
              className="w-full px-3.5 py-2 rounded-xl border border-[#EAE6E3] focus:border-[#B76E79] focus:outline-none bg-[#FAF9F7]"
            />
          </div>

          <div className="pt-3 flex items-center justify-end space-x-3 border-t border-[#EAE6E3]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#EAE6E3] text-[#707070] font-semibold hover:bg-[#FAF9F7]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-[#B76E79] hover:bg-[#9A5A64] text-white font-bold uppercase tracking-wider shadow-xs transition-all disabled:opacity-50"
            >
              {loading ? 'Recording...' : 'Save Attendance'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

