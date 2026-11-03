'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  User,
  Phone,
  ArrowRight,
  ShieldCheck,
  XCircle,
  Receipt,
  Printer,
  X,
  AlertCircle,
  Scissors,
} from 'lucide-react';
import { getStoredAppointments, cancelAppointment, StoredAppointment } from '@/data/bookingStore';

export default function CustomerAccountPage() {
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'HISTORY' | 'PROFILE'>('UPCOMING');
  const [appointments, setAppointments] = useState<StoredAppointment[]>([]);
  const [activeReceipt, setActiveReceipt] = useState<StoredAppointment | null>(null);
  const [cancelModalApt, setCancelModalApt] = useState<StoredAppointment | null>(null);

  // Profile state
  const [profileName, setProfileName] = useState('Ananya Sharma');
  const [profilePhone, setProfilePhone] = useState('+91 98230 11223');
  const [profileEmail, setProfileEmail] = useState('ananya.sharma@example.com');
  const [profileHairType, setProfileHairType] = useState('Wavy / Medium Density');
  const [profileSkinType, setProfileSkinType] = useState('Combination / Sensitive');
  const [profileSaved, setProfileSaved] = useState(false);

  const loadAppointments = () => {
    setAppointments(getStoredAppointments());
  };

  useEffect(() => {
    loadAppointments();
    window.addEventListener('appointments-updated', loadAppointments);
    return () => window.removeEventListener('appointments-updated', loadAppointments);
  }, []);

  const upcoming = appointments.filter(
    (a) => a.status === 'CONFIRMED' || a.status === 'IN_SERVICE'
  );

  const history = appointments.filter(
    (a) => a.status === 'COMPLETED' || a.status === 'CANCELLED'
  );

  const handleConfirmCancel = () => {
    if (cancelModalApt) {
      cancelAppointment(cancelModalApt.id);
      setCancelModalApt(null);
      loadAppointments();
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  return (
    <div className="py-12 bg-salon-ivory min-h-screen transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Profile Summary Header */}
        <div className="bg-white rounded-3xl border border-salon-gray p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-full bg-salon-rose-light border border-salon-rose/30 flex items-center justify-center text-salon-rose font-serif text-2xl font-bold shrink-0">
              {profileName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-serif text-2xl font-bold text-salon-black">
                  {profileName}
                </h1>
                <span className="text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-salon-rose-light text-salon-rose-dark border border-salon-rose/30">
                  Verified Client
                </span>
              </div>
              <p className="text-xs text-salon-muted mt-0.5">
                {profilePhone} • {profileEmail} • Savedi Regular
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/book"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-salon-rose hover:bg-salon-rose-dark transition-colors shadow-xs"
            >
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              Book New Visit
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 border-b border-salon-gray pb-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('UPCOMING')}
            className={`pb-2 px-3 border-b-2 transition-all ${
              activeTab === 'UPCOMING'
                ? 'border-salon-rose text-salon-rose font-bold'
                : 'border-transparent text-salon-muted hover:text-salon-black'
            }`}
          >
            Upcoming Visits ({upcoming.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('HISTORY')}
            className={`pb-2 px-3 border-b-2 transition-all ${
              activeTab === 'HISTORY'
                ? 'border-salon-rose text-salon-rose font-bold'
                : 'border-transparent text-salon-muted hover:text-salon-black'
            }`}
          >
            Visit & Billing History ({history.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('PROFILE')}
            className={`pb-2 px-3 border-b-2 transition-all ${
              activeTab === 'PROFILE'
                ? 'border-salon-rose text-salon-rose font-bold'
                : 'border-transparent text-salon-muted hover:text-salon-black'
            }`}
          >
            Hair & Skin Profile
          </button>
        </div>

        {/* Tab Content: Upcoming Visits */}
        {activeTab === 'UPCOMING' && (
          <div className="space-y-4">
            {upcoming.length === 0 ? (
              <div className="bg-white rounded-2xl border border-salon-gray p-10 text-center space-y-4">
                <Calendar className="w-10 h-10 text-salon-muted mx-auto" />
                <h3 className="font-serif text-lg font-bold text-salon-black">No upcoming appointments</h3>
                <p className="text-xs text-salon-muted max-w-sm mx-auto">
                  Ready to refresh your style or rejuvenate your skin? Schedule your next visit online with guaranteed slot readiness.
                </p>
                <Link
                  href="/book"
                  className="inline-flex items-center px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-salon-rose hover:bg-salon-rose-dark"
                >
                  Book Appointment
                </Link>
              </div>
            ) : (
              upcoming.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-white rounded-2xl border border-salon-gray p-6 sm:p-8 shadow-sm space-y-4 hover:border-salon-rose/40 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-salon-gray/60 pb-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-salon-black bg-salon-ivory px-2.5 py-1 rounded-lg border border-salon-gray">
                        {apt.reference}
                      </span>
                      <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {apt.status}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-salon-black">
                      Total: {apt.price}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-salon-muted block text-[11px] uppercase">Service</span>
                      <strong className="font-serif text-sm text-salon-black block mt-0.5">
                        {apt.serviceName}
                      </strong>
                      <span className="text-salon-rose text-[11px]">{apt.category}</span>
                    </div>

                    <div>
                      <span className="text-salon-muted block text-[11px] uppercase">Date & Time</span>
                      <p className="font-semibold text-salon-black mt-0.5">
                        {apt.date} at {apt.time}
                      </p>
                      <span className="text-salon-muted text-[11px]">Savedi, Ahilyanagar</span>
                    </div>

                    <div>
                      <span className="text-salon-muted block text-[11px] uppercase">Stylist</span>
                      <p className="font-semibold text-salon-black mt-0.5">
                        {apt.stylist}
                      </p>
                      <span className="text-salon-muted text-[11px]">Assigned Specialist</span>
                    </div>
                  </div>

                  {apt.notes && (
                    <div className="p-2.5 bg-salon-ivory rounded-xl text-[11px] text-salon-muted border border-salon-gray/60">
                      <strong>Client Note:</strong> {apt.notes}
                    </div>
                  )}

                  <div className="pt-3 border-t border-salon-gray/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <span className="text-[11px] text-salon-muted">
                      Need changes? Reschedule or cancel at least 2 hours before your slot.
                    </span>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setCancelModalApt(apt)}
                        className="px-4 py-1.5 rounded-full border border-neutral-300 text-neutral-600 hover:text-rose-600 hover:border-rose-300 transition-colors"
                      >
                        Cancel
                      </button>

                      <Link
                        href={`/book?serviceId=${apt.serviceId}`}
                        className="px-4 py-1.5 rounded-full bg-salon-ivory text-salon-black hover:bg-salon-rose hover:text-white border border-salon-gray transition-colors"
                      >
                        Reschedule
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab Content: Visit & Billing History */}
        {activeTab === 'HISTORY' && (
          <div className="space-y-4">
            {history.length === 0 ? (
              <div className="bg-white rounded-2xl border border-salon-gray p-8 text-center text-xs text-salon-muted">
                No past visit records yet.
              </div>
            ) : (
              history.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-white rounded-2xl border border-salon-gray p-6 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-salon-black">
                        {apt.reference}
                      </span>
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                          apt.status === 'COMPLETED'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveReceipt(apt)}
                      className="inline-flex items-center text-xs font-semibold text-salon-rose hover:underline"
                    >
                      <Receipt className="w-3.5 h-3.5 mr-1" />
                      View Receipt
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-salon-muted gap-2">
                    <div>
                      <strong className="text-salon-black text-sm">{apt.serviceName}</strong>
                      <span className="block text-[11px]">Stylist: {apt.stylist} • Date: {apt.date}</span>
                    </div>
                    <div className="sm:text-right">
                      <span className="font-bold text-salon-black block">{apt.price}</span>
                      <span className="text-[11px] text-emerald-600 font-medium">
                        {apt.paymentStatus === 'PAID_UPI' ? 'Paid via UPI' : 'Paid at Counter'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab Content: Profile Settings */}
        {activeTab === 'PROFILE' && (
          <div className="bg-white rounded-3xl border border-salon-gray p-8 shadow-sm space-y-6">
            <div>
              <h3 className="font-serif text-xl font-bold text-salon-black">
                Personalized Hair & Skin Dossier
              </h3>
              <p className="text-xs text-salon-muted mt-1">
                Help our stylists personalize your consultations, formulation strengths, and recommended aftercare products.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-salon-black mb-1">
                    Client Full Name
                  </label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-salon-gray text-xs focus:outline-none focus:border-salon-rose"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-salon-black mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-salon-gray text-xs focus:outline-none focus:border-salon-rose"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-salon-black mb-1">
                    Hair Texture & Density
                  </label>
                  <input
                    type="text"
                    value={profileHairType}
                    onChange={(e) => setProfileHairType(e.target.value)}
                    placeholder="e.g. Fine, Thick, Wavy, Chemically Treated"
                    className="w-full px-4 py-2.5 rounded-xl border border-salon-gray text-xs focus:outline-none focus:border-salon-rose"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-salon-black mb-1">
                    Skin Sensitivity / Notes
                  </label>
                  <input
                    type="text"
                    value={profileSkinType}
                    onChange={(e) => setProfileSkinType(e.target.value)}
                    placeholder="e.g. Normal, Oily, Sensitive to chemical peels"
                    className="w-full px-4 py-2.5 rounded-xl border border-salon-gray text-xs focus:outline-none focus:border-salon-rose"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                {profileSaved && (
                  <span className="text-xs text-emerald-600 font-semibold flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Profile changes saved successfully!
                  </span>
                )}
                <button
                  type="submit"
                  className="ml-auto px-6 py-2.5 rounded-full bg-salon-black hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Receipt Modal */}
        {activeReceipt && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-salon-gray">
                <div>
                  <span className="text-[10px] uppercase font-bold text-salon-gold tracking-widest block">
                    Official Salon Receipt
                  </span>
                  <h4 className="font-serif text-lg font-bold text-salon-black">
                    Beyond Beauty Saloon
                  </h4>
                </div>
                <button
                  onClick={() => setActiveReceipt(null)}
                  className="p-1 rounded-full text-salon-muted hover:text-salon-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-salon-muted">Receipt Ref:</span>
                  <span className="font-mono font-bold">{activeReceipt.reference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-salon-muted">Client:</span>
                  <span className="font-semibold">{activeReceipt.clientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-salon-muted">Date & Time:</span>
                  <span>{activeReceipt.date} at {activeReceipt.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-salon-muted">Specialist:</span>
                  <span>{activeReceipt.stylist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-salon-muted">Treatment:</span>
                  <span className="font-bold text-salon-black">{activeReceipt.serviceName}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-salon-gray text-sm font-bold">
                  <span>Total Amount:</span>
                  <span className="text-salon-rose-dark">{activeReceipt.price}</span>
                </div>
                <div className="flex justify-between text-[11px] text-emerald-600 font-semibold">
                  <span>Payment Status:</span>
                  <span>PAID (Receipt Generated)</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-full border border-salon-black text-xs font-semibold flex items-center hover:bg-salon-ivory"
                >
                  <Printer className="w-3.5 h-3.5 mr-1.5" />
                  Print Receipt
                </button>
                <button
                  type="button"
                  onClick={() => setActiveReceipt(null)}
                  className="px-5 py-2 rounded-full bg-salon-black text-white text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        {cancelModalApt && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1">
                <h4 className="font-serif text-lg font-bold text-salon-black">
                  Cancel Appointment?
                </h4>
                <p className="text-xs text-salon-muted">
                  Are you sure you want to cancel your visit for <strong className="text-salon-black">{cancelModalApt.serviceName}</strong> on {cancelModalApt.date}?
                </p>
              </div>

              <div className="pt-2 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setCancelModalApt(null)}
                  className="flex-1 py-2.5 rounded-full border border-salon-gray text-xs font-semibold text-salon-black hover:bg-salon-ivory"
                >
                  Keep Booking
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  className="flex-1 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
