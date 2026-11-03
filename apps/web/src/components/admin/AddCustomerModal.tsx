'use client';

import React, { useState } from 'react';
import { X, UserPlus, Phone, Mail, User, Check, AlertCircle } from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddCustomerModal({
  isOpen,
  onClose,
  onSuccess,
}: AddCustomerModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('FEMALE');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !phone) return;

    setLoading(true);
    setError('');

    try {
      const res = await apiRequest('/admin/customers', {
        method: 'POST',
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim() || undefined,
          phone: phone.trim(),
          email: email.trim() || undefined,
          gender,
          notes: notes.trim() || undefined,
        }),
      });

      if (!res.success) {
        setError(res.error || 'Failed to register customer.');
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
              <UserPlus className="w-5 h-5 text-[#B76E79] mr-2" />
              Add Customer Profile
            </h3>
            <p className="text-[#707070] mt-0.5">
              Register a new client record in salon CRM.
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
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-[#252525]">First Name *</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Ananya"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE6E3] focus:border-[#B76E79] focus:outline-none bg-[#FAF9F7]"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-[#252525]">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Kulkarni"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE6E3] focus:border-[#B76E79] focus:outline-none bg-[#FAF9F7]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#252525]">Phone Number *</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 98221 44556"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE6E3] focus:border-[#B76E79] focus:outline-none bg-[#FAF9F7]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#252525]">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. ananya@example.com (optional)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE6E3] focus:border-[#B76E79] focus:outline-none bg-[#FAF9F7]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#252525]">Hair & Skin Preferences / Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Prefers Priya Deshmukh; sensitive skin; allergic to sulfate."
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
              {loading ? 'Registering...' : 'Save Customer'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

