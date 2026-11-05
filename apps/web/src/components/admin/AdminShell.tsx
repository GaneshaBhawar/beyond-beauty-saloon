'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Calendar,
  CalendarDays,
  Users,
  Receipt,
  CreditCard,
  Scissors,
  UserCheck,
  Clock,
  Wallet,
  Package,
  TrendingDown,
  BarChart3,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  LogOut,
  Sparkles,
  ShieldCheck,
  Phone,
  HelpCircle,
} from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';

export type AdminNavTab =
  | 'DASHBOARD'
  | 'APPOINTMENTS'
  | 'CALENDAR'
  | 'CUSTOMERS'
  | 'BILLING'
  | 'PAYMENTS'
  | 'SERVICES'
  | 'STAFF'
  | 'ATTENDANCE'
  | 'PAYROLL'
  | 'INVENTORY'
  | 'EXPENSES'
  | 'REPORTS'
  | 'SETTINGS';

interface AdminShellProps {
  activeTab: AdminNavTab;
  onSelectTab: (tab: AdminNavTab) => void;
  actionableAlertsCount?: number;
  onOpenAlerts?: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onLogout?: () => void;
  children: React.ReactNode;
}

export function AdminShell({
  activeTab,
  onSelectTab,
  actionableAlertsCount = 0,
  onOpenAlerts,
  searchQuery = '',
  onSearchChange,
  onLogout,
  children,
}: AdminShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [liveIstTime, setLiveIstTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveIstTime(
        now.toLocaleDateString('en-IN', {
          timeZone: 'Asia/Kolkata',
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const navSections = [
    {
      group: 'Overview',
      items: [
        { id: 'DASHBOARD' as AdminNavTab, label: 'Dashboard', icon: LayoutDashboard },
        { id: 'APPOINTMENTS' as AdminNavTab, label: 'Appointments', icon: Calendar },
        { id: 'CALENDAR' as AdminNavTab, label: 'Calendar Schedule', icon: CalendarDays },
      ],
    },
    {
      group: 'Business',
      items: [
        { id: 'CUSTOMERS' as AdminNavTab, label: 'Customers & CRM', icon: Users },
        { id: 'BILLING' as AdminNavTab, label: 'Billing / POS', icon: Receipt },
        { id: 'PAYMENTS' as AdminNavTab, label: 'Payments & Dues', icon: CreditCard },
        { id: 'SERVICES' as AdminNavTab, label: 'Services Catalog', icon: Scissors },
      ],
    },
    {
      group: 'Team',
      items: [
        { id: 'STAFF' as AdminNavTab, label: 'Staff Roster', icon: UserCheck },
        { id: 'ATTENDANCE' as AdminNavTab, label: 'Attendance & Shifts', icon: Clock },
        { id: 'PAYROLL' as AdminNavTab, label: 'Payroll & Advances', icon: Wallet },
      ],
    },
    {
      group: 'Operations',
      items: [
        { id: 'INVENTORY' as AdminNavTab, label: 'Inventory & Stock', icon: Package },
        { id: 'EXPENSES' as AdminNavTab, label: 'Expenses Ledger', icon: TrendingDown },
      ],
    },
    {
      group: 'Insights & System',
      items: [
        { id: 'REPORTS' as AdminNavTab, label: 'Reports & P&L', icon: BarChart3 },
        { id: 'SETTINGS' as AdminNavTab, label: 'Settings & Themes', icon: Settings },
      ],
    },
  ];

  const handleNavClick = (tab: AdminNavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-[#252525] flex flex-col font-sans transition-colors duration-300">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#EAE6E3] shadow-xs">
        <div className="flex items-center justify-between h-16 px-3 sm:px-6 lg:px-8 max-w-full overflow-hidden">
          
          {/* Left: Mobile Toggle & Breadcrumbs */}
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 rounded-xl border border-[#EAE6E3] hover:bg-[#FAF9F7] text-[#252525] transition-colors shrink-0"
              aria-label="Toggle Navigation Drawer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link href="/" className="lg:hidden flex items-center shrink min-w-0" aria-label="Beyond Beauty Saloon Home">
              <BrandLogo variant="navbar" className="scale-85 sm:scale-95 origin-left" />
            </Link>

            {/* Desktop Breadcrumbs */}
            <div className="hidden lg:flex items-center space-x-2 text-xs text-[#707070]">
              <span className="font-semibold text-[#252525]">Beyond Beauty Saloon</span>
              <span>/</span>
              <span>Admin Center</span>
              <span>/</span>
              <span className="font-bold text-[#B76E79] capitalize">
                {activeTab.toLowerCase().replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Center: Search Box */}
          {onSearchChange && (
            <div className="hidden md:flex items-center max-w-xs w-full mx-4">
              <div className="relative w-full">
                <Search className="w-3.5 h-3.5 text-[#707070] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search appointments, clients, staff..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-full border border-[#EAE6E3] bg-[#FAF9F7] text-xs text-[#252525] placeholder:text-[#707070] focus:outline-none focus:border-[#B76E79] focus:bg-white transition-all"
                />
              </div>
            </div>
          )}

          {/* Right: Date, Alerts, User Profile */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Live IST Date */}
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-[#252525] leading-tight">
                {liveIstTime || 'Today, Savedi'}
              </span>
              <span className="text-[10px] text-[#707070]">10:00 AM – 8:00 PM (Daily)</span>
            </div>

            {/* Notification Bell */}
            <button
              type="button"
              onClick={onOpenAlerts}
              className="relative p-2 rounded-full border border-[#EAE6E3] hover:border-[#B76E79] hover:bg-[#FAF9F7] text-[#252525] transition-all cursor-pointer"
              title={`${actionableAlertsCount} actionable alerts`}
            >
              <Bell className="w-4 h-4 text-[#252525]" />
              {actionableAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#B76E79] text-white text-[10px] font-extrabold flex items-center justify-center ring-2 ring-white">
                  {actionableAlertsCount}
                </span>
              )}
            </button>

            {/* User Profile Avatar & Role */}
            <div className="flex items-center space-x-2 pl-2 border-l border-[#EAE6E3]">
              <div className="w-8 h-8 rounded-full bg-[#B76E79] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                SO
              </div>
              <div className="hidden md:flex flex-col">
                <span className="text-xs font-bold text-[#252525] leading-none">Salon Owner</span>
                <span className="text-[10px] text-[#C3A57B] font-semibold tracking-wider uppercase mt-0.5">
                  OWNER_ADMIN
                </span>
              </div>

              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-1.5 text-[#707070] hover:text-[#B76E79] hover:bg-[#FAF9F7] rounded-lg transition-colors ml-1"
                  title="Sign out of Admin Session"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>

        </div>
      </header>

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Desktop Collapsible Left Sidebar */}
        <aside
          className={`hidden lg:flex flex-col bg-white border-r border-[#EAE6E3] transition-all duration-300 select-none ${
            sidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          {/* Salon Brand at Sidebar Top */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-[#EAE6E3]">
            {!sidebarCollapsed ? (
              <Link href="/" className="flex items-center space-x-2.5 overflow-hidden">
                <BrandLogo variant="navbar" />
              </Link>
            ) : (
              <div className="w-full flex justify-center">
                <BrandLogo variant="mark" className="w-8 h-8" />
              </div>
            )}
            <button
              type="button"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-lg text-[#707070] hover:text-[#252525] hover:bg-[#FAF9F7] transition-colors"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin">
            {navSections.map((sec) => (
              <div key={sec.group} className="space-y-1">
                {!sidebarCollapsed && (
                  <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#707070] block mb-1">
                    {sec.group}
                  </span>
                )}
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        sidebarCollapsed
                          ? 'justify-center p-2.5'
                          : 'px-3 py-2.5 space-x-3 text-left'
                      } ${
                        isActive
                          ? 'bg-[#B76E79] text-white shadow-xs font-bold'
                          : 'text-[#252525] hover:bg-[#FAF9F7] hover:text-[#B76E79]'
                      }`}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#707070]'}`} />
                      {!sidebarCollapsed && <span>{item.label}</span>}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Authenticated User Card at Bottom */}
          <div className="p-3 border-t border-[#EAE6E3] bg-[#FAF9F7]">
            {!sidebarCollapsed ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#252525] text-white flex items-center justify-center text-[10px] font-bold">
                    BB
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#252525] leading-tight">Admin System</span>
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 inline-block animate-pulse"></span>
                      Verified Session
                    </span>
                  </div>
                </div>
                <Link
                  href="/"
                  className="text-[11px] text-[#B76E79] hover:underline font-semibold"
                  title="View Public Salon Website"
                >
                  Site &rarr;
                </Link>
              </div>
            ) : (
              <div className="flex justify-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
            )}
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <div className="relative w-72 max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
              <div className="h-16 flex items-center justify-between px-5 border-b border-[#EAE6E3]">
                <BrandLogo variant="navbar" />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-[#707070] hover:text-[#252525] border border-[#EAE6E3]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {navSections.map((sec) => (
                  <div key={sec.group} className="space-y-1">
                    <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#707070] block mb-1">
                      {sec.group}
                    </span>
                    {sec.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleNavClick(item.id)}
                          className={`w-full flex items-center px-3 py-2.5 space-x-3 rounded-xl text-xs font-semibold text-left transition-all ${
                            isActive
                              ? 'bg-[#B76E79] text-white shadow-xs font-bold'
                              : 'text-[#252525] hover:bg-[#FAF9F7] hover:text-[#B76E79]'
                          }`}
                        >
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#707070]'}`} />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-[#EAE6E3] bg-[#FAF9F7] flex items-center justify-between">
                <div className="text-xs">
                  <span className="block font-bold text-[#252525]">Salon Owner</span>
                  <span className="text-[10px] text-[#707070]">Savedi, Ahilyanagar</span>
                </div>
                {onLogout && (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#FAF9F7]">
          {children}
        </main>

      </div>

    </div>
  );
}

