'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, User, Mail, Lock, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !email || !phone || !password) return;

    setLoading(true);
    setTimeout(() => {
      const sessionUser = {
        role: 'CUSTOMER',
        name: `${firstName} ${lastName}`.trim(),
        email,
        phone,
      };

      try {
        localStorage.setItem('beyond_session_user', JSON.stringify(sessionUser));
      } catch (err) {
        // ignore
      }

      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        router.push('/account');
      }, 1000);
    }, 700);
  };

  return (
    <div className="py-16 bg-salon-ivory min-h-[85vh] flex items-center justify-center transition-colors duration-300">
      <div className="max-w-md w-full mx-4 bg-white rounded-3xl border border-salon-gray p-8 sm:p-10 shadow-luxury space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-salon-rose-light flex items-center justify-center text-salon-rose mx-auto shadow-inner">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-salon-black">
            Create Client Profile
          </h1>
          <p className="text-xs text-salon-muted">
            Join Beyond Beauty Saloon for streamlined bookings, bridal consultations, and exclusive privileges.
          </p>
        </div>

        {success ? (
          <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3 animate-in fade-in">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="font-serif text-lg font-bold text-emerald-900">
              Welcome to Beyond Beauty!
            </h4>
            <p className="text-xs text-emerald-700">
              Your profile has been created. Redirecting to your account dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-salon-black mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Pooja"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-salon-gray text-xs focus:outline-none focus:border-salon-rose"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-salon-black mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Deshmukh"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-salon-gray text-xs focus:outline-none focus:border-salon-rose"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-salon-black mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="pooja@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-salon-gray text-xs focus:outline-none focus:border-salon-rose"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-salon-black mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98230..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-salon-gray text-xs focus:outline-none focus:border-salon-rose"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-salon-black mb-1">
                Create Password *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-salon-gray text-xs focus:outline-none focus:border-salon-rose"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-salon-rose hover:bg-salon-rose-dark shadow-sm transition-all flex items-center justify-center cursor-pointer"
            >
              {loading ? 'Creating Profile...' : 'Complete Registration'}
              {!loading && <ArrowRight className="w-3.5 h-3.5 ml-1.5" />}
            </button>
          </form>
        )}

        <div className="pt-2 border-t border-salon-gray flex items-center justify-between text-xs text-salon-muted">
          <span>Already have an account?</span>
          <Link href="/login" className="font-semibold text-salon-rose hover:underline">
            Sign In here
          </Link>
        </div>

      </div>
    </div>
  );
}
