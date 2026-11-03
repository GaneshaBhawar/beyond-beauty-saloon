'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, Shield, User, Scissors, Eye, EyeOff, AlertCircle, KeyRound, Sparkles } from 'lucide-react';
import { apiRequest, setAuthSession } from '@/lib/api';

type PortalRole = 'OWNER_ADMIN' | 'EMPLOYEE' | 'CUSTOMER';

export default function LoginPage() {
  const router = useRouter();
  const [roleMode, setRoleMode] = useState<PortalRole>('EMPLOYEE');
  const [identifier, setIdentifier] = useState('BBS-0001');
  const [password, setPassword] = useState('StaffSecret2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRoleSelect = (role: PortalRole) => {
    setRoleMode(role);
    setErrorMessage('');
    setSuccessMessage('');
    if (role === 'EMPLOYEE') {
      setIdentifier('BBS-0001');
      setPassword('StaffSecret2026!');
    } else if (role === 'OWNER_ADMIN') {
      setIdentifier('admin@beyondbeauty.in');
      setPassword('SalonOwnerKey99!');
    } else {
      setIdentifier('ananya.sharma@example.com');
      setPassword('Password@123');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await apiRequest<{ token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          identifier: identifier.trim(),
          password,
          role: roleMode,
        }),
      });

      if (!res.success || !res.data) {
        setErrorMessage(res.error || 'Authentication failed. Please check your credentials.');
        setLoading(false);
        return;
      }

      setAuthSession(res.data.token, res.data.user);
      setSuccessMessage(`Welcome back, ${res.data.user.firstName}! Redirecting...`);

      setTimeout(() => {
        if (res.data!.user.role === 'OWNER_ADMIN') {
          router.push('/admin');
        } else if (res.data!.user.role === 'EMPLOYEE') {
          router.push('/employee');
        } else {
          router.push('/account');
        }
      }, 500);
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
      setLoading(false);
    }
  };

  return (
    <div className="py-12 sm:py-20 bg-salon-ivory min-h-[85vh] flex items-center justify-center px-4 transition-colors duration-300">
      <div className="max-w-md w-full bg-white rounded-3xl border border-salon-gray p-7 sm:p-10 shadow-luxury space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-salon-rose-light flex items-center justify-center text-salon-rose mx-auto shadow-inner border border-salon-rose/20">
            {roleMode === 'OWNER_ADMIN' ? (
              <Shield className="w-7 h-7 text-salon-rose" />
            ) : roleMode === 'EMPLOYEE' ? (
              <Scissors className="w-7 h-7 text-salon-rose" />
            ) : (
              <User className="w-7 h-7 text-salon-rose" />
            )}
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-salon-black">
            Portal Authentication
          </h1>
          <p className="text-xs text-salon-muted max-w-xs mx-auto">
            Mutually exclusive access control for salon operations and staff workstations.
          </p>
        </div>

        {/* Primary Role Selector: Admin vs Staff */}
        <div className="bg-salon-ivory p-1.5 rounded-2xl border border-salon-gray flex gap-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => handleRoleSelect('EMPLOYEE')}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
              roleMode === 'EMPLOYEE'
                ? 'bg-salon-rose text-white shadow-xs'
                : 'text-salon-muted hover:text-salon-black'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Login as Staff</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect('OWNER_ADMIN')}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
              roleMode === 'OWNER_ADMIN'
                ? 'bg-salon-black text-white shadow-xs'
                : 'text-salon-muted hover:text-salon-black'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Login as Admin</span>
          </button>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-salon-black mb-1.5">
              {roleMode === 'EMPLOYEE'
                ? 'Staff Login ID (BBS-XXXX) or Registered Email'
                : roleMode === 'OWNER_ADMIN'
                ? 'Admin Account Email / Username'
                : 'Client Email'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-salon-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={
                  roleMode === 'EMPLOYEE'
                    ? 'e.g. BBS-0001 or priya.stylist@beyondbeauty.in'
                    : 'admin@beyondbeauty.in'
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-salon-gray text-xs focus:outline-none focus:border-salon-rose bg-salon-ivory/30 focus:bg-white transition-all text-salon-black font-medium"
              />
            </div>
            {roleMode === 'EMPLOYEE' && (
              <p className="text-[11px] text-salon-muted mt-1">
                Enter your issued BBS-ID (e.g. BBS-0001) or the email assigned by management.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-salon-black mb-1.5">
              Account Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-salon-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-salon-gray text-xs focus:outline-none focus:border-salon-rose bg-salon-ivory/30 focus:bg-white transition-all text-salon-black font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-salon-muted hover:text-salon-black"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick autofill helper chips */}
          <div className="bg-salon-ivory/60 p-2.5 rounded-xl border border-salon-gray/70 text-[11px] space-y-1 text-salon-muted">
            <span className="font-semibold text-salon-black flex items-center">
              <KeyRound className="w-3 h-3 mr-1 text-salon-gold" /> Quick Demo Credentials:
            </span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  setRoleMode('EMPLOYEE');
                  setIdentifier('BBS-0001');
                  setPassword('StaffSecret2026!');
                }}
                className="px-2 py-0.5 rounded-md bg-white border border-salon-gray hover:border-salon-rose text-[11px] text-salon-black hover:text-salon-rose"
              >
                Stylist (BBS-0001)
              </button>
              <button
                type="button"
                onClick={() => {
                  setRoleMode('OWNER_ADMIN');
                  setIdentifier('admin@beyondbeauty.in');
                  setPassword('SalonOwnerKey99!');
                }}
                className="px-2 py-0.5 rounded-md bg-white border border-salon-gray hover:border-salon-rose text-[11px] text-salon-black hover:text-salon-rose"
              >
                Owner Admin
              </button>
            </div>
          </div>

          {/* Error / Success Notices */}
          {errorMessage && (
            <div className="text-xs text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="text-xs text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-salon-rose hover:bg-salon-rose-dark shadow-sm hover:shadow transition-all flex items-center justify-center disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating Securely...</span>
            ) : (
              <>
                <span>
                  {roleMode === 'OWNER_ADMIN'
                    ? 'Enter Owner Admin Center'
                    : roleMode === 'EMPLOYEE'
                    ? 'Enter Staff Workstation'
                    : 'Sign In to Client Portal'}
                </span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </>
            )}
          </button>
        </form>

        {/* Client Account Switcher & Customer Sign in */}
        <div className="pt-3 border-t border-salon-gray flex flex-col sm:flex-row items-center justify-between text-xs text-salon-muted gap-2">
          <span>Booking as a salon client?</span>
          <button
            type="button"
            onClick={() => handleRoleSelect('CUSTOMER')}
            className="font-semibold text-salon-rose hover:underline flex items-center"
          >
            <User className="w-3 h-3 mr-1" />
            Switch to Client Sign In
          </button>
        </div>

      </div>
    </div>
  );
}
