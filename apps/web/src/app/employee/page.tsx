'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Scissors,
  Clock,
  UserCheck,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  Bell,
  Sparkles,
  Play,
  Check,
  Plus,
  MessageSquare,
  Shield,
  LogOut,
  X,
  Package,
  Layers,
} from 'lucide-react';
import { getStoredAppointments, updateAppointmentStatus, StoredAppointment } from '@/data/bookingStore';
import { SALON_IMAGES } from '@/data/salonImages';
import { apiRequest, getAuthUser, clearAuthSession, AuthUser } from '@/lib/api';

export default function EmployeePortalPage() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [attendanceStatus, setAttendanceStatus] = useState<'CHECKED_IN' | 'CHECKED_OUT'>('CHECKED_IN');
  const [checkInTime, setCheckInTime] = useState('10:00 AM');
  const [appointments, setAppointments] = useState<StoredAppointment[]>([]);
  const [activeTab, setActiveTab] = useState<'QUEUE' | 'EARNINGS' | 'NOTIFICATIONS'>('QUEUE');
  
  // Note modal
  const [selectedNoteApt, setSelectedNoteApt] = useState<StoredAppointment | null>(null);
  const [noteInput, setNoteInput] = useState('');

  // Service Completion & Consumables Modal
  const [completingApt, setCompletingApt] = useState<StoredAppointment | null>(null);
  const [consumablesUsed, setConsumablesUsed] = useState('1x Treatment Pack, 2x Single-Use Towels');
  const [finalPriceInput, setFinalPriceInput] = useState('850');
  const [tipInput, setTipInput] = useState('50');
  const [completingLoading, setCompletingLoading] = useState(false);

  // Real backend notifications
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);

  const loadAppointments = () => {
    setAppointments(getStoredAppointments());
  };

  const fetchNotifications = async () => {
    setLoadingNotifs(true);
    try {
      const res = await apiRequest<any[]>('/employee/notifications');
      if (res.success && res.data) {
        setNotifications(res.data);
      }
    } catch {
      // ignore
    } finally {
      setLoadingNotifs(false);
    }
  };

  useEffect(() => {
    const user = getAuthUser();
    setCurrentUser(user);
    loadAppointments();
    fetchNotifications();
    window.addEventListener('appointments-updated', loadAppointments);
    return () => window.removeEventListener('appointments-updated', loadAppointments);
  }, []);

  const handleToggleAttendance = async () => {
    const nextType = attendanceStatus === 'CHECKED_IN' ? 'CLOCK_OUT' : 'CLOCK_IN';
    try {
      await apiRequest('/employee/attendance', {
        method: 'POST',
        body: JSON.stringify({ type: nextType }),
      });
    } catch {
      // ignore
    }

    if (attendanceStatus === 'CHECKED_IN') {
      setAttendanceStatus('CHECKED_OUT');
    } else {
      setAttendanceStatus('CHECKED_IN');
      setCheckInTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  };

  const handleStartService = async (id: string) => {
    try {
      await apiRequest('/employee/service-entry', {
        method: 'POST',
        body: JSON.stringify({
          appointmentId: id,
          status: 'IN_SERVICE',
        }),
      });
    } catch {
      // ignore
    }
    updateAppointmentStatus(id, 'IN_SERVICE');
    loadAppointments();
  };

  const handleOpenCompleteModal = (apt: StoredAppointment) => {
    setCompletingApt(apt);
    const numeric = parseInt(apt.price.replace(/[^\d]/g, ''), 10) || 850;
    setFinalPriceInput(String(numeric));
    setConsumablesUsed('1x L’Oréal Spa Pack, 2x Single-Use Towels');
    setTipInput('50');
  };

  const handleConfirmCompleteService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!completingApt) return;

    setCompletingLoading(true);
    try {
      await apiRequest('/employee/service-entry', {
        method: 'POST',
        body: JSON.stringify({
          appointmentId: completingApt.id,
          status: 'COMPLETED',
          finalPricePaise: Math.round(Number(finalPriceInput || 850) * 100),
          tipPaise: Math.round(Number(tipInput || 0) * 100),
          consumablesUsed,
          notes: noteInput || undefined,
        }),
      });
    } catch {
      // ignore
    }

    updateAppointmentStatus(completingApt.id, 'COMPLETED', 'PAID_UPI');
    setCompletingLoading(false);
    setCompletingApt(null);
    loadAppointments();
  };

  const handleSaveStylistNote = () => {
    if (selectedNoteApt && noteInput) {
      const list = getStoredAppointments();
      const updated = list.map((a) => (a.id === selectedNoteApt.id ? { ...a, notes: noteInput } : a));
      localStorage.setItem('beyond_appointments_v1', JSON.stringify(updated));
      loadAppointments();
      setSelectedNoteApt(null);
      setNoteInput('');
    }
  };

  const handleMarkNotificationRead = async (id: string) => {
    await apiRequest(`/employee/notifications/${id}/read`, { method: 'PATCH' });
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  // Staff identity
  const staffName = currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : 'Priya Deshmukh';
  const staffCode = currentUser?.employeeProfile?.staffCode || 'BBS-0001';
  const jobTitle = currentUser?.employeeProfile?.jobTitle || 'Senior Hair Stylist';

  const completedCount = appointments.filter((a) => a.status === 'COMPLETED').length;
  const inServiceCount = appointments.filter((a) => a.status === 'IN_SERVICE').length;

  return (
    <div className="py-10 bg-salon-ivory min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl border border-salon-gray p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <img
              src={SALON_IMAGES.stylistPriya}
              alt={staffName}
              className="w-16 h-16 rounded-full object-cover border-2 border-salon-rose/40 shadow-sm shrink-0"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-serif text-2xl font-bold text-salon-black">
                  {staffName}
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-salon-rose-light text-salon-rose-dark border border-salon-rose/20">
                  {jobTitle}
                </span>
              </div>
              <p className="text-xs text-salon-muted mt-0.5">
                Staff ID: <strong className="text-salon-black font-mono">{staffCode}</strong> • Station 2 • Savedi Salon
              </p>
            </div>
          </div>

          {/* Attendance Check-in Widget & Portal Switch */}
          <div className="flex items-center space-x-4 border-t md:border-t-0 md:border-l border-salon-gray pt-4 md:pt-0 md:pl-6">
            <div>
              <span className="text-[11px] text-salon-muted block uppercase tracking-wider font-semibold">
                Daily Roster Status
              </span>
              <span className="text-sm font-bold text-emerald-600 flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-500" />
                {attendanceStatus === 'CHECKED_IN' ? `Present (In at ${checkInTime})` : 'Checked Out'}
              </span>
            </div>

            <button
              type="button"
              onClick={handleToggleAttendance}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                attendanceStatus === 'CHECKED_IN'
                  ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
              }`}
            >
              {attendanceStatus === 'CHECKED_IN' ? 'Check Out' : 'Check In Now'}
            </button>
          </div>
        </div>

        {/* Quick KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-salon-gray shadow-xs space-y-1">
            <span className="text-[11px] text-salon-muted uppercase font-semibold">Queue Total</span>
            <div className="font-serif text-2xl font-bold text-salon-black">{appointments.length}</div>
            <span className="text-[10px] text-salon-rose font-medium">Assigned to stylist</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-salon-gray shadow-xs space-y-1">
            <span className="text-[11px] text-salon-muted uppercase font-semibold">In Service</span>
            <div className="font-serif text-2xl font-bold text-salon-gold">{inServiceCount}</div>
            <span className="text-[10px] text-salon-muted">Currently at station</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-salon-gray shadow-xs space-y-1">
            <span className="text-[11px] text-salon-muted uppercase font-semibold">Completed Today</span>
            <div className="font-serif text-2xl font-bold text-emerald-600">{completedCount}</div>
            <span className="text-[10px] text-emerald-700 font-medium">Verified services</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-salon-gray shadow-xs space-y-1">
            <span className="text-[11px] text-salon-muted uppercase font-semibold">Commission Accrued</span>
            <div className="font-serif text-2xl font-bold text-salon-black">₹1,420</div>
            <span className="text-[10px] text-salon-muted">Base salary + Service share</span>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex space-x-3 border-b border-salon-gray pb-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('QUEUE')}
            className={`pb-2 px-3 border-b-2 transition-all ${
              activeTab === 'QUEUE'
                ? 'border-salon-rose text-salon-rose font-bold'
                : 'border-transparent text-salon-muted hover:text-salon-black'
            }`}
          >
            Today's Client Queue ({appointments.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('EARNINGS')}
            className={`pb-2 px-3 border-b-2 transition-all ${
              activeTab === 'EARNINGS'
                ? 'border-salon-rose text-salon-rose font-bold'
                : 'border-transparent text-salon-muted hover:text-salon-black'
            }`}
          >
            Earnings & Service Log
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('NOTIFICATIONS')}
            className={`pb-2 px-3 border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'NOTIFICATIONS'
                ? 'border-salon-rose text-salon-rose font-bold'
                : 'border-transparent text-salon-muted hover:text-salon-black'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Salon Notifications ({notifications.filter((n) => !n.isRead).length})</span>
          </button>
        </div>

        {/* Tab 1: Queue */}
        {activeTab === 'QUEUE' && (
          <div className="space-y-4">
            {appointments.map((apt) => {
              const isInService = apt.status === 'IN_SERVICE';
              const isCompleted = apt.status === 'COMPLETED';

              return (
                <div
                  key={apt.id}
                  className={`bg-white rounded-2xl border p-6 shadow-xs space-y-4 transition-all ${
                    isInService
                      ? 'border-salon-gold ring-1 ring-salon-gold/50 bg-salon-gold-light/20'
                      : 'border-salon-gray'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-salon-gray/60 pb-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold bg-salon-ivory px-2 py-0.5 rounded border border-salon-gray">
                        {apt.time}
                      </span>
                      <span className="font-serif text-base font-bold text-salon-black">
                        {apt.clientName}
                      </span>
                      <span className="text-xs text-salon-muted">({apt.clientPhone})</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                          isCompleted
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : isInService
                            ? 'bg-salon-gold text-salon-black animate-pulse'
                            : 'bg-salon-rose-light text-salon-rose-dark'
                        }`}
                      >
                        {apt.status}
                      </span>
                      <span className="text-xs font-bold text-salon-black">{apt.price}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-3">
                    <div>
                      <span className="text-salon-muted text-[11px] block uppercase">Treatment</span>
                      <p className="font-bold text-salon-black text-sm">{apt.serviceName}</p>
                      <span className="text-salon-rose text-[11px]">{apt.category}</span>
                      {apt.notes && (
                        <p className="text-salon-muted text-[11px] mt-1 bg-salon-ivory p-2 rounded-lg border border-salon-gray/50">
                          <strong>Client Note:</strong> {apt.notes}
                        </p>
                      )}
                    </div>

                    {/* Operational Action Buttons */}
                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedNoteApt(apt);
                          setNoteInput(apt.notes || '');
                        }}
                        className="px-3 py-1.5 rounded-lg border border-salon-gray text-[11px] font-semibold text-salon-black hover:bg-salon-ivory flex items-center"
                      >
                        <MessageSquare className="w-3 h-3 mr-1 text-salon-rose" />
                        Note
                      </button>

                      {!isCompleted && !isInService && (
                        <button
                          type="button"
                          onClick={() => handleStartService(apt.id)}
                          className="px-4 py-1.5 rounded-lg bg-salon-black text-white text-[11px] font-semibold uppercase tracking-wider hover:bg-neutral-800 flex items-center shadow-xs cursor-pointer"
                        >
                          <Play className="w-3 h-3 mr-1 text-salon-gold" />
                          Start Service
                        </button>
                      )}

                      {isInService && (
                        <button
                          type="button"
                          onClick={() => handleOpenCompleteModal(apt)}
                          className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-[11px] font-semibold uppercase tracking-wider hover:bg-emerald-700 flex items-center shadow-xs cursor-pointer"
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Complete & Log Bill
                        </button>
                      )}

                      {isCompleted && (
                        <span className="text-xs text-emerald-600 font-semibold flex items-center">
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Finished & Logged
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Earnings & Commission */}
        {activeTab === 'EARNINGS' && (
          <div className="bg-white rounded-3xl border border-salon-gray p-8 shadow-sm space-y-6">
            <h3 className="font-serif text-xl font-bold text-salon-black">
              Daily Service Payout & Commission Breakdown
            </h3>
            <p className="text-xs text-salon-muted">
              Stylist commission is calculated dynamically per verified completed service.
            </p>

            <div className="border border-salon-gray rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-salon-ivory border-b border-salon-gray text-salon-muted uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5">Client & Service</th>
                    <th className="p-3.5">Bill Amount</th>
                    <th className="p-3.5">Commission Rate</th>
                    <th className="p-3.5 text-right">Stylist Earning</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-salon-gray/60">
                  <tr>
                    <td className="p-3.5 font-medium text-salon-black">
                      Ananya Sharma – Signature Layered Haircut
                    </td>
                    <td className="p-3.5">₹850</td>
                    <td className="p-3.5 text-salon-muted">30% Senior Tier</td>
                    <td className="p-3.5 text-right font-bold text-emerald-700">₹255</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-medium text-salon-black">
                      Kavita Patil – L’Oréal Hair Spa
                    </td>
                    <td className="p-3.5">₹1,200</td>
                    <td className="p-3.5 text-salon-muted">30% Senior Tier</td>
                    <td className="p-3.5 text-right font-bold text-emerald-700">₹360</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Notifications */}
        {activeTab === 'NOTIFICATIONS' && (
          <div className="bg-white rounded-3xl border border-salon-gray p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="font-serif text-xl font-bold text-salon-black">
              Salon Workstation Notifications
            </h3>
            <p className="text-xs text-salon-muted">
              Schedule updates, new client appointments, and management directives.
            </p>

            {loadingNotifs ? (
              <p className="text-xs text-salon-muted py-6 text-center">Loading notifications...</p>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-salon-muted bg-salon-ivory rounded-2xl border border-salon-gray space-y-2">
                <Bell className="w-6 h-6 mx-auto text-salon-rose" />
                <p>No active unread notifications. Your queue is up to date.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-4 rounded-2xl border text-xs flex items-start justify-between gap-4 transition-all ${
                      n.isRead ? 'bg-salon-ivory/40 border-salon-gray/60 text-salon-muted' : 'bg-white border-salon-rose shadow-xs'
                    }`}
                  >
                    <div>
                      <strong className="block font-bold text-salon-black text-sm">{n.title}</strong>
                      <p className="mt-1 text-salon-muted">{n.message}</p>
                      <span className="text-[10px] text-neutral-400 mt-2 block font-mono">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {!n.isRead && (
                      <button
                        type="button"
                        onClick={() => handleMarkNotificationRead(n.id)}
                        className="px-3 py-1 rounded-full border border-salon-rose text-salon-rose text-[11px] font-semibold hover:bg-salon-rose-light shrink-0"
                      >
                        Mark Read
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Service Completion & Consumables Modal */}
        {completingApt && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-salon-gray">
                <div>
                  <h4 className="font-serif text-xl font-bold text-salon-black">
                    Complete Service & Log Bill
                  </h4>
                  <p className="text-xs text-salon-muted">
                    {completingApt.clientName} • {completingApt.serviceName}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCompletingApt(null)}
                  className="p-1 rounded-md text-salon-muted hover:text-salon-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleConfirmCompleteService} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-salon-black mb-1">
                    Final Billed Amount (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={finalPriceInput}
                    onChange={(e) => setFinalPriceInput(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-salon-gray text-xs focus:outline-none focus:border-salon-rose font-bold text-salon-black text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-salon-black mb-1">
                    Consumables & Products Used
                  </label>
                  <input
                    type="text"
                    value={consumablesUsed}
                    onChange={(e) => setConsumablesUsed(e.target.value)}
                    placeholder="e.g. 1x Treatment Pack, 2x Single-Use Towels"
                    className="w-full px-3.5 py-2 rounded-xl border border-salon-gray text-xs focus:outline-none focus:border-salon-rose"
                  />
                  <span className="text-[10px] text-salon-muted mt-1 block">
                    Logged consumables deduct automatically from salon stock inventory.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-salon-black mb-1">
                    Stylist Tip Received (₹)
                  </label>
                  <input
                    type="number"
                    value={tipInput}
                    onChange={(e) => setTipInput(e.target.value)}
                    placeholder="0"
                    className="w-full px-3.5 py-2 rounded-xl border border-salon-gray text-xs focus:outline-none focus:border-salon-rose"
                  />
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setCompletingApt(null)}
                    className="px-4 py-2 rounded-full border border-salon-gray text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={completingLoading}
                    className="px-6 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold uppercase tracking-wider"
                  >
                    {completingLoading ? 'Logging Service...' : 'Confirm & Close Ledger'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
