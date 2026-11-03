'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldAlert,
  ArrowRight,
  Package,
  Layers,
  Settings,
  Scissors,
  Receipt,
  CreditCard,
  Plus,
  Printer,
  X,
  Search,
  Check,
  Copy,
  KeyRound,
  Lock,
  Sparkles,
  UserPlus,
  RefreshCw,
  LogOut,
  Palette,
  RotateCcw,
  UserCheck,
  Wallet,
  TrendingDown,
  BarChart3,
  CalendarDays,
  ShieldCheck,
  Phone,
  Eye,
} from 'lucide-react';
import { getStoredAppointments, saveAppointment, updateAppointmentStatus, StoredAppointment } from '@/data/bookingStore';
import { SALON_SERVICES } from '@/data/servicesData';
import { apiRequest, getAuthUser, clearAuthSession } from '@/lib/api';
import { useTheme, THEME_PRESETS } from '@/components/ThemeContext';

// Modular Admin V2 Components
import { AdminShell, AdminNavTab } from '@/components/admin/AdminShell';
import { DashboardGreeting } from '@/components/admin/DashboardGreeting';
import { QuickActionBar } from '@/components/admin/QuickActionBar';
import { DashboardKPIs } from '@/components/admin/DashboardKPIs';
import { TodayAppointmentsTable } from '@/components/admin/TodayAppointmentsTable';
import { AppointmentDetailsDrawer } from '@/components/admin/AppointmentDetailsDrawer';
import { BusinessPerformanceChart } from '@/components/admin/BusinessPerformanceChart';
import { MonthlySummaryCard } from '@/components/admin/MonthlySummaryCard';
import { StaffOverviewPanel } from '@/components/admin/StaffOverviewPanel';
import { PopularServicesList } from '@/components/admin/PopularServicesList';
import { PaymentMethodsBreakdown } from '@/components/admin/PaymentMethodsBreakdown';
import { ActionableAlertsPanel } from '@/components/admin/ActionableAlertsPanel';
import { NewAppointmentModal } from '@/components/admin/NewAppointmentModal';
import { WalkInBillModal } from '@/components/admin/WalkInBillModal';
import { AddCustomerModal } from '@/components/admin/AddCustomerModal';
import { MarkAttendanceModal } from '@/components/admin/MarkAttendanceModal';
import { ReceiptModal } from '@/components/admin/ReceiptModal';
import { DashboardV2Payload, DashboardAppointmentItem } from '@/components/admin/types';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { theme, setTheme, customAccent, setCustomAccent, resetCustomAccent, contrastColor } = useTheme();

  // Navigation State
  const [activeTab, setActiveTab] = useState<AdminNavTab>('DASHBOARD');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [salesRange, setSalesRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Dashboard Data State
  const [dashboardData, setDashboardData] = useState<DashboardV2Payload | null>(null);
  const [loadingDashboard, setLoadingDashboard] = useState(false);

  // Fallback appointments from local booking store
  const [localAppointments, setLocalAppointments] = useState<StoredAppointment[]>([]);

  // Modals State
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showMarkAttendanceModal, setShowMarkAttendanceModal] = useState(false);
  const [selectedAppointmentForDrawer, setSelectedAppointmentForDrawer] = useState<DashboardAppointmentItem | null>(null);
  const [receiptApt, setReceiptApt] = useState<StoredAppointment | null>(null);

  // Staff management & Onboarding state
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [staffActionLoading, setStaffActionLoading] = useState(false);
  const [staffActionError, setStaffActionError] = useState('');
  const [issuedCredentials, setIssuedCredentials] = useState<{
    staffCode: string;
    fullName: string;
    email: string;
    temporaryPassword: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [resetModalResult, setResetModalResult] = useState<{ name: string; password: string } | null>(null);

  // New staff form state
  const [staffFirstName, setStaffFirstName] = useState('');
  const [staffLastName, setStaffLastName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffJobTitle, setStaffJobTitle] = useState('Senior Hair Stylist');
  const [staffEmploymentStatus, setStaffEmploymentStatus] = useState<'FULL_TIME' | 'PART_TIME' | 'PROBATION'>('FULL_TIME');
  const [staffBaseSalary, setStaffBaseSalary] = useState('25000');
  const [staffCommissionRate, setStaffCommissionRate] = useState('5');
  const [staffIsPublicBookable, setStaffIsPublicBookable] = useState(true);
  const [staffInitialPassword, setStaffInitialPassword] = useState('');

  // Consumable Inventory state
  const [inventory, setInventory] = useState([
    { id: 'inv-1', name: 'L’Oréal Professionnel Hair Spa Argan Crème', category: 'Hair Care', stock: 4, min: 5, unit: 'tubs' },
    { id: 'inv-2', name: 'O3+ Dermal Brightening Facial Kits', category: 'Skin Care', stock: 12, min: 6, unit: 'kits' },
    { id: 'inv-3', name: 'MAC Studio Fix Base & Long-Wear Foundation', category: 'Cosmetics', stock: 8, min: 4, unit: 'bottles' },
    { id: 'inv-4', name: 'Single-Use Biodegradable Salon Towels', category: 'Hygiene Disposables', stock: 85, min: 50, unit: 'sheets' },
    { id: 'inv-5', name: 'Organic Antibacterial Thread Spools', category: 'Threading', stock: 20, min: 10, unit: 'rolls' },
  ]);

  // Fetch complete Dashboard V2 metrics from backend
  const fetchDashboardData = async () => {
    setLoadingDashboard(true);
    try {
      const res = await apiRequest<DashboardV2Payload>(
        `/admin/dashboard?date=${selectedDate}&range=${salesRange}`
      );
      if (res.success && res.data) {
        setDashboardData(res.data);
      }
    } catch {
      // Backend error fallback
    } finally {
      setLoadingDashboard(false);
    }
  };

  // Fetch Staff Directory
  const fetchStaffList = async () => {
    setLoadingStaff(true);
    try {
      const res = await apiRequest<any[]>('/admin/staff');
      if (res.success && res.data) {
        setStaffList(res.data);
      }
    } catch {
      // Ignore
    } finally {
      setLoadingStaff(false);
    }
  };

  // Synchronize local stored appointments
  const refreshLocalAppointments = () => {
    setLocalAppointments(getStoredAppointments());
  };

  useEffect(() => {
    fetchDashboardData();
    fetchStaffList();
    refreshLocalAppointments();

    const handleAptsUpdated = () => {
      refreshLocalAppointments();
      fetchDashboardData();
    };

    window.addEventListener('appointments-updated', handleAptsUpdated);
    return () => window.removeEventListener('appointments-updated', handleAptsUpdated);
  }, [selectedDate, salesRange]);

  // Handle staff onboarding
  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffFirstName || !staffLastName || !staffEmail || !staffJobTitle) return;

    setStaffActionLoading(true);
    setStaffActionError('');

    try {
      const res = await apiRequest<{
        staffId: string;
        staffCode: string;
        fullName: string;
        email: string;
        temporaryPassword: string;
      }>('/admin/staff', {
        method: 'POST',
        body: JSON.stringify({
          firstName: staffFirstName.trim(),
          lastName: staffLastName.trim(),
          email: staffEmail.trim(),
          phone: staffPhone.trim() || undefined,
          jobTitle: staffJobTitle,
          employmentStatus: staffEmploymentStatus,
          baseSalaryPaise: Math.round(Number(staffBaseSalary || 25000) * 100),
          commissionRateBps: Math.round(Number(staffCommissionRate || 5) * 100),
          isPublicBookable: staffIsPublicBookable,
          initialPassword: staffInitialPassword.trim() || undefined,
        }),
      });

      if (!res.success || !res.data) {
        setStaffActionError(res.error || 'Failed to onboard staff member.');
        setStaffActionLoading(false);
        return;
      }

      setIssuedCredentials({
        staffCode: res.data.staffCode,
        fullName: res.data.fullName,
        email: res.data.email,
        temporaryPassword: res.data.temporaryPassword,
      });

      // Clear form
      setStaffFirstName('');
      setStaffLastName('');
      setStaffEmail('');
      setStaffPhone('');
      setStaffInitialPassword('');
      setShowAddStaffModal(false);

      fetchStaffList();
      fetchDashboardData();
    } catch (err: any) {
      setStaffActionError(err?.message || 'Error communicating with salon backend.');
    } finally {
      setStaffActionLoading(false);
    }
  };

  // Handle staff status toggle
  const handleToggleStaffStatus = async (staffId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    const res = await apiRequest(`/admin/staff/${staffId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: nextStatus }),
    });
    if (res.success) {
      fetchStaffList();
      fetchDashboardData();
    }
  };

  // Handle staff password reset
  const handleResetStaffPassword = async (staffId: string, staffName: string) => {
    const res = await apiRequest<{ temporaryPassword?: string }>(`/admin/staff/${staffId}`, {
      method: 'PATCH',
      body: JSON.stringify({ resetPassword: true }),
    });
    if (res.success && res.data?.temporaryPassword) {
      setResetModalResult({
        name: staffName,
        password: res.data.temporaryPassword,
      });
    }
  };

  // Handle appointment status transition
  const handleUpdateAppointmentStatus = async (aptId: string, newStatus: string) => {
    updateAppointmentStatus(aptId, newStatus as any);
    await apiRequest(`/admin/appointments/${aptId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus }),
    }).catch(() => {});

    refreshLocalAppointments();
    fetchDashboardData();

    if (selectedAppointmentForDrawer && selectedAppointmentForDrawer.id === aptId) {
      setSelectedAppointmentForDrawer((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  // Handle inventory restock
  const handleRestock = async (id: string) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, stock: item.stock + 5 } : item))
    );
    await apiRequest(`/admin/inventory/${id}/restock`, {
      method: 'POST',
      body: JSON.stringify({ quantity: 5 }),
    }).catch(() => {});
    fetchDashboardData();
  };

  // Handle logout
  const handleLogout = () => {
    clearAuthSession();
    router.push('/login');
  };

  // Synthesize appointments list (combining backend appointments with local bookingStore items)
  const combinedAppointments: DashboardAppointmentItem[] = [
    ...(dashboardData?.todayAppointments || []),
    ...localAppointments.map((a) => ({
      id: a.id,
      referenceCode: a.reference,
      clientName: a.clientName,
      clientPhone: a.clientPhone,
      serviceName: a.serviceName,
      durationMinutes: 60,
      stylistName: a.stylist,
      stylistId: null,
      startTimeFormatted: a.time,
      endTimeFormatted: '',
      startTimeIso: new Date().toISOString(),
      status: a.status,
      estimatedTotalFormatted: a.price,
      estimatedTotalPaise: (parseInt(a.price.replace(/[^\d]/g, ''), 10) || 650) * 100,
      invoiceStatus: a.status === 'COMPLETED' ? 'PAID' : 'DRAFT',
      paymentStatus: (a.paymentStatus ? (a.paymentStatus.startsWith('PAID') ? 'PAID' : 'PENDING') : 'PENDING') as any,
    })),
  ].filter(
    (item, index, self) => index === self.findIndex((t) => t.id === item.id || t.referenceCode === item.referenceCode)
  );

  // Fallback KPIs
  const completedCount = combinedAppointments.filter((a) => a.status === 'COMPLETED').length;
  const inServiceCount = combinedAppointments.filter((a) => a.status === 'IN_SERVICE').length;
  const grossBilled = combinedAppointments.reduce((acc, curr) => acc + (curr.estimatedTotalPaise || 0), 0);

  const displayKpis = dashboardData?.kpis || {
    todayAppointmentsCount: combinedAppointments.length,
    completedAppointmentsToday: completedCount,
    inServiceAppointmentsToday: inServiceCount,
    confirmedAppointmentsToday: combinedAppointments.filter((a) => a.status === 'CONFIRMED').length,
    requestedAppointmentsToday: combinedAppointments.filter((a) => a.status === 'REQUESTED').length,
    cancelledAppointmentsToday: combinedAppointments.filter((a) => a.status.startsWith('CANCELLED')).length,
    todayBilledSalesFormatted: `₹${(grossBilled / 100).toLocaleString('en-IN')}`,
    todayBilledSalesPaise: grossBilled,
    todayCollectionsFormatted: `₹${((completedCount * 125000) / 100).toLocaleString('en-IN')}`,
    todayCollectionsPaise: completedCount * 125000,
    outstandingCustomerDuesFormatted: '₹0',
    outstandingCustomerDuesPaise: 0,
    todayRecordedExpensesFormatted: '₹0',
    todayRecordedExpensesPaise: 0,
    staffPresentCount: Math.min(staffList.length, 3),
    totalActiveStaffCount: staffList.length || 5,
    lowStockAlertsCount: inventory.filter((i) => i.stock <= i.min).length,
  };

  const staffOverviewData = dashboardData?.staffOverview || {
    counts: {
      total: staffList.length || 5,
      present: Math.min(staffList.length, 3),
      absent: 0,
      onLeave: 0,
      notMarked: Math.max(0, (staffList.length || 5) - 3),
    },
    staffList: staffList.map((s) => ({
      id: s.id,
      staffCode: s.staffCode || 'BBS-0001',
      fullName: s.user ? `${s.user.firstName} ${s.user.lastName}` : s.displayName,
      displayName: s.displayName,
      jobTitle: s.jobTitle,
      colorTag: s.colorTag || '#B76E79',
      status: 'PRESENT' as const,
      checkInTime: new Date().toISOString(),
      checkOutTime: null,
      assignedAppointmentsToday: 1,
    })),
  };

  return (
    <AdminShell
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      actionableAlertsCount={dashboardData?.actionableAlerts?.length || 0}
      onOpenAlerts={() => setActiveTab('DASHBOARD')}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onLogout={handleLogout}
    >
      <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
        
        {/* ============================================================== */}
        {/* VIEW 1: DASHBOARD (MAIN V2 OPERATIONAL CONTROL CENTER)          */}
        {/* ============================================================== */}
        {activeTab === 'DASHBOARD' && (
          <div className="space-y-8">
            
            {/* 1. Dashboard Greeting & Date Filter */}
            <DashboardGreeting
              ownerName="Salon Owner"
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              onRefresh={fetchDashboardData}
              loading={loadingDashboard}
            />

            {/* 2. Quick Actions Bar */}
            <QuickActionBar
              onNewAppointment={() => setShowNewAppointmentModal(true)}
              onCreateBill={() => setShowWalkInModal(true)}
              onAddCustomer={() => setShowAddCustomerModal(true)}
              onMarkAttendance={() => setShowMarkAttendanceModal(true)}
              onViewCalendar={() => setActiveTab('CALENDAR')}
            />

            {/* 3. 8 Business KPI Cards */}
            <DashboardKPIs
              kpis={displayKpis}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />

            {/* 4. Today's Appointment Schedule Table */}
            <TodayAppointmentsTable
              appointments={combinedAppointments}
              onSelectAppointment={(apt) => setSelectedAppointmentForDrawer(apt)}
              onUpdateStatus={handleUpdateAppointmentStatus}
              onNewAppointment={() => setShowNewAppointmentModal(true)}
              onCreateBill={(apt) => {
                const srv = SALON_SERVICES.find((s) => s.name === apt.serviceName) || SALON_SERVICES[0];
                const created = saveAppointment({
                  serviceId: srv.id,
                  serviceName: apt.serviceName,
                  category: srv.categoryLabel,
                  clientName: apt.clientName,
                  clientPhone: apt.clientPhone,
                  date: selectedDate,
                  time: apt.startTimeFormatted,
                  stylist: apt.stylistName,
                  status: 'COMPLETED',
                  price: apt.estimatedTotalFormatted,
                  paymentStatus: 'PAID_UPI',
                  notes: 'Direct counter invoice generated from today schedule.',
                });
                setReceiptApt(created);
                fetchDashboardData();
              }}
            />

            {/* 5. Business Performance Chart & Monthly Summary (Two Columns) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7">
                <BusinessPerformanceChart
                  salesData={
                    dashboardData?.salesPerformance || {
                      range: salesRange,
                      series: [
                        { label: 'Sun (28)', date: '2026-10-28', billedSales: 4500, collections: 4500 },
                        { label: 'Mon (29)', date: '2026-10-29', billedSales: 5200, collections: 5200 },
                        { label: 'Tue (30)', date: '2026-10-30', billedSales: 6800, collections: 6100 },
                        { label: 'Wed (31)', date: '2026-10-31', billedSales: 7400, collections: 7400 },
                        { label: 'Thu (01)', date: '2026-11-01', billedSales: 8200, collections: 8200 },
                        { label: 'Fri (02)', date: '2026-11-02', billedSales: 9100, collections: 9100 },
                        { label: 'Today', date: '2026-11-03', billedSales: displayKpis.todayBilledSalesPaise / 100, collections: displayKpis.todayCollectionsPaise / 100 },
                      ],
                    }
                  }
                  onRangeChange={(range) => setSalesRange(range)}
                  loading={loadingDashboard}
                />
              </div>

              <div className="lg:col-span-5">
                <MonthlySummaryCard
                  summary={
                    dashboardData?.monthlySummary || {
                      periodLabel: 'November 2026',
                      totalBilledSalesFormatted: '₹41,200',
                      totalBilledSalesPaise: 4120000,
                      totalCollectionsFormatted: '₹39,500',
                      totalCollectionsPaise: 3950000,
                      recordedExpensesFormatted: '₹8,400',
                      recordedExpensesPaise: 840000,
                      outstandingDuesFormatted: '₹1,700',
                      outstandingDuesPaise: 170000,
                      operatingResultFormatted: '₹31,100',
                      operatingResultPaise: 3110000,
                      methodologyNotes:
                        'Operating result represents cash & digital collections received minus recorded operational stock expenses during this calendar month. Outstanding dues remain on client ledger.',
                    }
                  }
                />
              </div>
            </div>

            {/* 6. Staff Overview & Popular Services (Two Columns) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7">
                <StaffOverviewPanel
                  staffOverview={staffOverviewData}
                  onMarkAttendance={() => setShowMarkAttendanceModal(true)}
                  onViewRoster={() => setActiveTab('STAFF')}
                />
              </div>

              <div className="lg:col-span-5">
                <PopularServicesList
                  services={
                    dashboardData?.popularServices && dashboardData.popularServices.length > 0
                      ? dashboardData.popularServices
                      : [
                          { id: '1', name: 'Signature Layered Haircut', count: 18, totalAmountFormatted: '₹15,300', revenuePaise: 1530000 },
                          { id: '2', name: 'Radiance Glow Facial', count: 14, totalAmountFormatted: '₹21,000', revenuePaise: 2100000 },
                          { id: '3', name: 'L’Oréal Hair Spa Restoration', count: 12, totalAmountFormatted: '₹15,000', revenuePaise: 1500000 },
                          { id: '4', name: 'Party Glam Makeup & Draping', count: 8, totalAmountFormatted: '₹20,000', revenuePaise: 2000000 },
                          { id: '5', name: 'Eyebrow Shaping & Upper Lip', count: 24, totalAmountFormatted: '₹2,880', revenuePaise: 288000 },
                        ]
                  }
                />
              </div>
            </div>

            {/* 7. Payment Methods Breakdown & Actionable Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-6">
                <PaymentMethodsBreakdown
                  paymentMethods={
                    dashboardData?.paymentMethodsBreakdown || [
                      { method: 'UPI', label: 'UPI / QR Code', amountFormatted: '₹28,500', amountPaise: 2850000, count: 26, percentage: 68 },
                      { method: 'CASH', label: 'Cash Counter', amountFormatted: '₹9,800', amountPaise: 980000, count: 14, percentage: 24 },
                      { method: 'CARD_AT_COUNTER', label: 'Card at Counter', amountFormatted: '₹3,200', amountPaise: 320000, count: 3, percentage: 8 },
                      { method: 'BANK_TRANSFER', label: 'Bank Transfer', amountFormatted: '₹0', amountPaise: 0, count: 0, percentage: 0 },
                    ]
                  }
                />
              </div>

              <div className="lg:col-span-6">
                <ActionableAlertsPanel
                  alerts={
                    dashboardData?.actionableAlerts && dashboardData.actionableAlerts.length > 0
                      ? dashboardData.actionableAlerts
                      : [
                          {
                            id: 'alert-stock-1',
                            type: 'LOW_STOCK',
                            title: 'Low Stock: L’Oréal Hair Spa Argan Crème',
                            description: 'Only 4 tubs remaining in Savedi dispensary (Reorder threshold: 5).',
                            linkTab: 'INVENTORY',
                          },
                          {
                            id: 'alert-attendance-1',
                            type: 'UNMARKED_ATTENDANCE',
                            title: 'Staff Shift Attendance Unmarked',
                            description: 'Review and confirm floor attendance records for today.',
                            linkTab: 'ATTENDANCE',
                          },
                        ]
                  }
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              </div>
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 2: APPOINTMENTS & CALENDAR                                 */}
        {/* ============================================================== */}
        {(activeTab === 'APPOINTMENTS' || activeTab === 'CALENDAR') && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#EAE6E3]">
              <div>
                <h2 className="text-xl font-bold text-[#252525]">Salon Appointments Master Schedule</h2>
                <p className="text-xs text-[#707070]">Filter, confirm, or seat clients across all treatment stations.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowNewAppointmentModal(true)}
                className="px-5 py-2.5 rounded-full bg-[#B76E79] hover:bg-[#9A5A64] text-white text-xs font-bold uppercase tracking-wider shadow-xs inline-flex items-center"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Schedule Appointment
              </button>
            </div>

            <TodayAppointmentsTable
              appointments={combinedAppointments}
              onSelectAppointment={(apt) => setSelectedAppointmentForDrawer(apt)}
              onUpdateStatus={handleUpdateAppointmentStatus}
              onNewAppointment={() => setShowNewAppointmentModal(true)}
              onCreateBill={(apt) => {
                const srv = SALON_SERVICES.find((s) => s.name === apt.serviceName) || SALON_SERVICES[0];
                const created = saveAppointment({
                  serviceId: srv.id,
                  serviceName: apt.serviceName,
                  category: srv.categoryLabel,
                  clientName: apt.clientName,
                  clientPhone: apt.clientPhone,
                  date: selectedDate,
                  time: apt.startTimeFormatted,
                  stylist: apt.stylistName,
                  status: 'COMPLETED',
                  price: apt.estimatedTotalFormatted,
                  paymentStatus: 'PAID_UPI',
                  notes: 'Direct counter invoice generated from appointments tab.',
                });
                setReceiptApt(created);
                fetchDashboardData();
              }}
            />
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 3: BILLING & POS / PAYMENTS                                */}
        {/* ============================================================== */}
        {(activeTab === 'BILLING' || activeTab === 'PAYMENTS') && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#EAE6E3]">
              <div>
                <h2 className="text-xl font-bold text-[#252525]">Billing, Invoices & Counter Receipts</h2>
                <p className="text-xs text-[#707070]">Generate client invoices, record UPI/cash receipts, and reprint tax slips.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowWalkInModal(true)}
                className="px-5 py-2.5 rounded-full bg-[#B76E79] hover:bg-[#9A5A64] text-white text-xs font-bold uppercase tracking-wider shadow-xs inline-flex items-center"
              >
                <Receipt className="w-4 h-4 mr-1.5" />
                New Walk-in / Bill
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-[#EAE6E3] p-6 shadow-xs overflow-hidden">
              <h3 className="font-bold text-sm text-[#252525] mb-4">Completed Invoices Ledger</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#EAE6E3] text-[#707070] text-[11px] uppercase bg-[#FAF9F7]/60">
                      <th className="p-3 font-bold">Invoice Ref</th>
                      <th className="p-3 font-bold">Client</th>
                      <th className="p-3 font-bold">Service</th>
                      <th className="p-3 font-bold">Amount</th>
                      <th className="p-3 font-bold">Payment Method</th>
                      <th className="p-3 font-bold">Status</th>
                      <th className="p-3 font-bold text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE6E3]">
                    {combinedAppointments
                      .filter((a) => a.status === 'COMPLETED')
                      .map((apt) => (
                        <tr key={apt.id} className="hover:bg-[#FAF9F7]/50">
                          <td className="p-3 font-mono font-bold text-[#252525]">{apt.referenceCode}</td>
                          <td className="p-3 font-bold">{apt.clientName}</td>
                          <td className="p-3 text-[#707070]">{apt.serviceName}</td>
                          <td className="p-3 font-bold text-[#252525]">{apt.estimatedTotalFormatted}</td>
                          <td className="p-3">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                              {apt.paymentStatus}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              PAID
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                const srv = SALON_SERVICES.find((s) => s.name === apt.serviceName) || SALON_SERVICES[0];
                                setReceiptApt({
                                  id: apt.id,
                                  reference: apt.referenceCode,
                                  serviceId: srv.id,
                                  serviceName: apt.serviceName,
                                  category: srv.categoryLabel,
                                  clientName: apt.clientName,
                                  clientPhone: apt.clientPhone,
                                  date: selectedDate,
                                  time: apt.startTimeFormatted,
                                  stylist: apt.stylistName,
                                  status: 'COMPLETED',
                                  price: apt.estimatedTotalFormatted,
                                  paymentStatus: 'PAID_UPI',
                                  createdAt: new Date().toISOString(),
                                });
                              }}
                              className="px-3 py-1 rounded-lg border border-[#EAE6E3] hover:border-[#B76E79] hover:bg-white text-xs font-semibold inline-flex items-center"
                            >
                              <Printer className="w-3.5 h-3.5 mr-1 text-[#B76E79]" />
                              Print
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 4: CUSTOMERS & CRM                                         */}
        {/* ============================================================== */}
        {activeTab === 'CUSTOMERS' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#EAE6E3]">
              <div>
                <h2 className="text-xl font-bold text-[#252525]">Salon Customer Directory & CRM</h2>
                <p className="text-xs text-[#707070]">Client contact numbers, skin/hair allergy profiles, and visit frequency.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddCustomerModal(true)}
                className="px-5 py-2.5 rounded-full bg-[#B76E79] hover:bg-[#9A5A64] text-white text-xs font-bold uppercase tracking-wider shadow-xs inline-flex items-center"
              >
                <UserPlus className="w-4 h-4 mr-1.5" />
                Add New Customer
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-[#EAE6E3] p-6 shadow-xs space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { name: 'Ananya Sharma', phone: '+91 98221 44556', visits: 6, pref: 'Prefers Priya Deshmukh; layered cuts' },
                  { name: 'Pooja Kulkarni', phone: '+91 97307 88123', visits: 4, pref: 'Regular Radiance Glow Facials; sensitive skin' },
                  { name: 'Kavita Shinde', phone: '+91 98901 22334', visits: 2, pref: 'Bridal consultation completed; Nauvari saree draping' },
                  { name: 'Meera Rajput', phone: '+91 98235 99001', visits: 8, pref: 'L’Oréal Hair Spa restoration monthly' },
                  { name: 'Sneha Jadhav', phone: '+91 98231 11223', visits: 3, pref: 'Eyebrow shaping & upper lip regular' },
                ].map((cust) => (
                  <div key={cust.name} className="p-4 rounded-2xl bg-[#FAF9F7] border border-[#EAE6E3] space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-sm text-[#252525]">{cust.name}</span>
                      <span className="text-[10px] font-bold bg-[#B76E79]/10 text-[#B76E79] px-2 py-0.5 rounded-full">
                        {cust.visits} Visits
                      </span>
                    </div>
                    <div className="text-xs text-[#707070] flex items-center">
                      <Phone className="w-3.5 h-3.5 mr-1 text-[#B76E79]" />
                      <a href={`tel:${cust.phone}`} className="hover:underline">{cust.phone}</a>
                    </div>
                    <p className="text-[11px] text-[#707070] italic border-t border-[#EAE6E3]/60 pt-1.5">
                      {cust.pref}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 5: STAFF ROSTER, ONBOARDING & CREDENTIALS                   */}
        {/* ============================================================== */}
        {(activeTab === 'STAFF' || activeTab === 'ATTENDANCE' || activeTab === 'PAYROLL') && (
          <div className="space-y-6">
            
            {/* Header & Onboard Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#EAE6E3]">
              <div>
                <h2 className="text-xl font-bold text-[#252525]">Staff Roster, Station Skills & Attendance</h2>
                <p className="text-xs text-[#707070]">
                  Create staff accounts with login credentials, assign stations, manage attendance, and reset access.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddStaffModal(true)}
                className="px-5 py-2.5 rounded-full bg-[#B76E79] hover:bg-[#9A5A64] text-white text-xs font-bold uppercase tracking-wider shadow-xs inline-flex items-center cursor-pointer"
              >
                <UserPlus className="w-4 h-4 mr-1.5" />
                Onboard New Staff Member
              </button>
            </div>

            {/* Credential Revelation Callout */}
            {issuedCredentials && (
              <div className="p-6 rounded-3xl bg-emerald-50 border-2 border-emerald-300 space-y-4 shadow-sm animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
                  <div className="flex items-center space-x-2 text-emerald-900 font-bold text-sm">
                    <KeyRound className="w-5 h-5 text-emerald-700" />
                    <span>Staff Account Created — Credentials Issued</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIssuedCredentials(null)}
                    className="text-xs text-emerald-700 hover:text-emerald-950 font-bold"
                  >
                    Dismiss
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-[#707070] block">Staff Name:</span>
                    <span className="font-bold text-[#252525]">{issuedCredentials.fullName}</span>
                  </div>
                  <div>
                    <span className="text-[#707070] block">Staff Code:</span>
                    <span className="font-mono font-bold text-emerald-800 text-sm">{issuedCredentials.staffCode}</span>
                  </div>
                  <div>
                    <span className="text-[#707070] block">Login Email:</span>
                    <span className="font-mono text-[#252525]">{issuedCredentials.email}</span>
                  </div>
                  <div>
                    <span className="text-[#707070] block">Temporary Password:</span>
                    <span className="font-mono font-bold text-rose-700 bg-white px-2 py-0.5 rounded border border-emerald-200 text-sm">
                      {issuedCredentials.temporaryPassword}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Staff Directory Table */}
            <div className="bg-white rounded-3xl border border-[#EAE6E3] p-6 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#EAE6E3] text-[#707070] text-[11px] uppercase bg-[#FAF9F7]/60">
                      <th className="p-3.5 font-bold">Staff Code</th>
                      <th className="p-3.5 font-bold">Stylist Name</th>
                      <th className="p-3.5 font-bold">Specialty Role</th>
                      <th className="p-3.5 font-bold">Login Email</th>
                      <th className="p-3.5 font-bold">Status</th>
                      <th className="p-3.5 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE6E3]">
                    {staffList.map((emp) => {
                      const isActive = emp.user?.status === 'ACTIVE';
                      const fullName = emp.user ? `${emp.user.firstName} ${emp.user.lastName}` : emp.displayName;
                      return (
                        <tr key={emp.id} className="hover:bg-[#FAF9F7]/40">
                          <td className="p-3.5 font-mono font-bold text-[#B76E79]">{emp.staffCode}</td>
                          <td className="p-3.5 font-bold text-[#252525]">{fullName}</td>
                          <td className="p-3.5 text-[#707070]">{emp.jobTitle}</td>
                          <td className="p-3.5 font-mono text-[#707070]">{emp.user?.email}</td>
                          <td className="p-3.5">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                isActive
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                            >
                              {isActive ? 'Active' : 'Disabled'}
                            </span>
                          </td>
                          <td className="p-3.5 text-right space-x-2">
                            <button
                              type="button"
                              onClick={() => handleResetStaffPassword(emp.id, fullName)}
                              className="px-2.5 py-1 rounded-lg border border-[#EAE6E3] hover:border-[#B76E79] bg-[#FAF9F7] text-[11px] font-semibold"
                            >
                              Reset Password
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleStaffStatus(emp.id, emp.user?.status || 'ACTIVE')}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
                                isActive
                                  ? 'border-rose-200 text-rose-700 hover:bg-rose-50'
                                  : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                              }`}
                            >
                              {isActive ? 'Deactivate' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 6: INVENTORY & STOCK OPERATIONS                            */}
        {/* ============================================================== */}
        {(activeTab === 'INVENTORY' || activeTab === 'EXPENSES') && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#EAE6E3]">
              <div>
                <h2 className="text-xl font-bold text-[#252525]">Consumables Inventory & Restock Alerts</h2>
                <p className="text-xs text-[#707070]">Hair spa crèmes, facial kits, MAC cosmetics, and single-use hygiene towels.</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-[#EAE6E3] p-6 shadow-xs overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#EAE6E3] text-[#707070] text-[11px] uppercase bg-[#FAF9F7]/60">
                    <th className="p-3.5 font-bold">Consumable Name</th>
                    <th className="p-3.5 font-bold">Category</th>
                    <th className="p-3.5 font-bold">Current Stock</th>
                    <th className="p-3.5 font-bold">Reorder Alert Status</th>
                    <th className="p-3.5 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE6E3]">
                  {inventory.map((item) => {
                    const isLow = item.stock <= item.min;
                    return (
                      <tr key={item.id} className="hover:bg-[#FAF9F7]/40">
                        <td className="p-3.5 font-bold text-[#252525]">{item.name}</td>
                        <td className="p-3.5 text-[#707070]">{item.category}</td>
                        <td className="p-3.5 font-mono font-bold text-[#252525]">{item.stock} {item.unit}</td>
                        <td className="p-3.5">
                          {isLow ? (
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                              Low Stock (Safety Min: {item.min})
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                              In Stock Optimal
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => handleRestock(item.id)}
                            className="px-3 py-1 rounded-lg bg-[#FAF9F7] border border-[#EAE6E3] hover:border-[#B76E79] text-[#252525] text-[11px] font-bold"
                          >
                            +5 Units Restock
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 7: SALON SETTINGS & THEMES                                */}
        {/* ============================================================== */}
        {activeTab === 'SETTINGS' && (
          <div className="bg-white rounded-3xl border border-[#EAE6E3] p-8 shadow-xs space-y-8">
            <div>
              <h2 className="text-xl font-bold text-[#252525]">Salon Brand Atmosphere & Configuration</h2>
              <p className="text-xs text-[#707070]">Configure luxury theme palettes, operating parameters, and contact policies.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs border-b border-[#EAE6E3] pb-6">
              <div className="space-y-1">
                <span className="font-semibold text-[#707070] uppercase text-[10px]">Registered Business Name</span>
                <p className="font-bold text-[#252525] text-sm">Beyond Beauty Saloon & Bridal Studio</p>
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-[#707070] uppercase text-[10px]">Savedi Location</span>
                <p className="font-bold text-[#252525] text-sm">Near Kohinoor Mangal Karyalaya, Savedi, Ahilyanagar 414003</p>
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-[#707070] uppercase text-[10px]">Direct Booking Lines</span>
                <p className="font-bold text-[#252525] text-sm">+91 98235 73781 / +91 97307 68487</p>
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-[#707070] uppercase text-[10px]">Operating Hours</span>
                <p className="font-bold text-[#252525] text-sm">Monday – Sunday: 10:00 AM – 8:00 PM (Daily)</p>
              </div>
            </div>

            {/* 6 Curated Theme Presets */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#252525] flex items-center">
                    <Palette className="w-4 h-4 mr-2 text-[#B76E79]" />
                    Curated Salon Color Themes
                  </h3>
                  <p className="text-xs text-[#707070]">Select a luxury color atmosphere applied across the public website and client portals.</p>
                </div>
                {customAccent && (
                  <button
                    type="button"
                    onClick={resetCustomAccent}
                    className="text-xs text-[#B76E79] hover:underline flex items-center font-semibold"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1" />
                    Reset to Default
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {THEME_PRESETS.map((t) => {
                  const isSelected = t.id === theme && !customAccent;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        resetCustomAccent();
                        setTheme(t.id);
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-[#B76E79] bg-rose-50/60 ring-2 ring-[#B76E79]/30 shadow-2xs'
                          : 'border-[#EAE6E3] hover:border-[#B76E79] bg-[#FAF9F7]/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex -space-x-1.5 shrink-0">
                          <span
                            className="w-5 h-5 rounded-full border border-white shadow-2xs"
                            style={{ backgroundColor: t.primary }}
                          />
                          <span
                            className="w-5 h-5 rounded-full border border-white shadow-2xs"
                            style={{ backgroundColor: t.accent }}
                          />
                        </div>
                        <div>
                          <span className="block font-bold text-xs text-[#252525]">{t.name}</span>
                          <span className="text-[10px] text-[#707070]">{t.tagline}</span>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#B76E79]" />}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ============================================================== */}
      {/* MODALS & DRAWERS                                               */}
      {/* ============================================================== */}

      {/* 1. New Appointment Modal */}
      <NewAppointmentModal
        isOpen={showNewAppointmentModal}
        onClose={() => setShowNewAppointmentModal(false)}
        onSuccess={() => {
          refreshLocalAppointments();
          fetchDashboardData();
        }}
        staffList={staffList.map((s) => ({
          id: s.id,
          fullName: s.user ? `${s.user.firstName} ${s.user.lastName}` : s.displayName,
          jobTitle: s.jobTitle,
        }))}
      />

      {/* 2. Walk-in Bill Modal */}
      <WalkInBillModal
        isOpen={showWalkInModal}
        onClose={() => setShowWalkInModal(false)}
        onSuccess={(created) => {
          setReceiptApt(created);
          refreshLocalAppointments();
          fetchDashboardData();
        }}
      />

      {/* 3. Add Customer Modal */}
      <AddCustomerModal
        isOpen={showAddCustomerModal}
        onClose={() => setShowAddCustomerModal(false)}
        onSuccess={() => {
          fetchDashboardData();
        }}
      />

      {/* 4. Mark Attendance Modal */}
      <MarkAttendanceModal
        isOpen={showMarkAttendanceModal}
        onClose={() => setShowMarkAttendanceModal(false)}
        onSuccess={() => {
          fetchDashboardData();
        }}
        selectedDate={selectedDate}
        staffList={staffList.map((s) => ({
          id: s.id,
          fullName: s.user ? `${s.user.firstName} ${s.user.lastName}` : s.displayName,
          jobTitle: s.jobTitle,
          staffCode: s.staffCode,
        }))}
      />

      {/* 5. Appointment Details Slide-over Drawer */}
      <AppointmentDetailsDrawer
        appointment={selectedAppointmentForDrawer}
        onClose={() => setSelectedAppointmentForDrawer(null)}
        onUpdateStatus={handleUpdateAppointmentStatus}
        onCreateBill={(apt) => {
          const srv = SALON_SERVICES.find((s) => s.name === apt.serviceName) || SALON_SERVICES[0];
          const created = saveAppointment({
            serviceId: srv.id,
            serviceName: apt.serviceName,
            category: srv.categoryLabel,
            clientName: apt.clientName,
            clientPhone: apt.clientPhone,
            date: selectedDate,
            time: apt.startTimeFormatted,
            stylist: apt.stylistName,
            status: 'COMPLETED',
            price: apt.estimatedTotalFormatted,
            paymentStatus: 'PAID_UPI',
            notes: 'Counter bill generated from drawer.',
          });
          setReceiptApt(created);
          setSelectedAppointmentForDrawer(null);
          fetchDashboardData();
        }}
      />

      {/* 6. Printable Counter Receipt Modal */}
      <ReceiptModal
        receipt={receiptApt}
        onClose={() => setReceiptApt(null)}
      />

      {/* 7. Add Staff Member Modal */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#EAE6E3] max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#EAE6E3] pb-4">
              <div>
                <h3 className="text-base font-bold text-[#252525]">Onboard New Staff Member</h3>
                <p className="text-[#707070]">Creates system profile, login ID, and initial password.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddStaffModal(false)}
                className="p-1.5 rounded-xl border border-[#EAE6E3] hover:bg-[#FAF9F7]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {staffActionError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{staffActionError}</span>
              </div>
            )}

            <form onSubmit={handleCreateStaff} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#252525]">First Name *</label>
                  <input
                    type="text"
                    required
                    value={staffFirstName}
                    onChange={(e) => setStaffFirstName(e.target.value)}
                    placeholder="e.g. Sneha"
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE6E3] focus:border-[#B76E79] focus:outline-none bg-[#FAF9F7]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#252525]">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={staffLastName}
                    onChange={(e) => setStaffLastName(e.target.value)}
                    placeholder="e.g. Patil"
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE6E3] focus:border-[#B76E79] focus:outline-none bg-[#FAF9F7]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#252525]">Email Address (Login ID) *</label>
                <input
                  type="email"
                  required
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  placeholder="e.g. sneha.patil@beyondbeauty.local"
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE6E3] focus:border-[#B76E79] focus:outline-none bg-[#FAF9F7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#252525]">Phone Number</label>
                  <input
                    type="tel"
                    value={staffPhone}
                    onChange={(e) => setStaffPhone(e.target.value)}
                    placeholder="e.g. 98235 00002"
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE6E3] focus:border-[#B76E79] focus:outline-none bg-[#FAF9F7]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#252525]">Job Title / Role *</label>
                  <select
                    value={staffJobTitle}
                    onChange={(e) => setStaffJobTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE6E3] focus:border-[#B76E79] focus:outline-none bg-[#FAF9F7]"
                  >
                    <option value="Senior Hair Stylist">Senior Hair Stylist</option>
                    <option value="Skin Specialist">Skin Specialist</option>
                    <option value="Bridal Makeup Artist">Bridal Makeup Artist</option>
                    <option value="Hair Spa & Care Expert">Hair Spa & Care Expert</option>
                    <option value="Threading & Waxing Artist">Threading & Waxing Artist</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#252525]">Temporary Initial Password</label>
                <input
                  type="text"
                  value={staffInitialPassword}
                  onChange={(e) => setStaffInitialPassword(e.target.value)}
                  placeholder="Leave empty for auto-generated secure password"
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE6E3] focus:border-[#B76E79] focus:outline-none bg-[#FAF9F7]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3 border-t border-[#EAE6E3]">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#EAE6E3] text-[#707070] font-semibold hover:bg-[#FAF9F7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={staffActionLoading}
                  className="px-6 py-2 rounded-xl bg-[#B76E79] hover:bg-[#9A5A64] text-white font-bold uppercase tracking-wider shadow-xs"
                >
                  {staffActionLoading ? 'Onboarding...' : 'Onboard & Generate ID'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. Password Reset Result Modal */}
      {resetModalResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#EAE6E3] max-w-sm w-full p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
              <KeyRound className="w-5 h-5 text-emerald-600" />
              <span>Password Reset Successful</span>
            </div>
            <p className="text-[#707070]">
              Temporary password for <span className="font-bold text-[#252525]">{resetModalResult.name}</span>:
            </p>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold text-sm text-[#252525] text-center select-all">
              {resetModalResult.password}
            </div>
            <button
              type="button"
              onClick={() => setResetModalResult(null)}
              className="w-full py-2.5 rounded-xl bg-[#B76E79] text-white font-bold uppercase tracking-wider text-center"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </AdminShell>
  );
}
