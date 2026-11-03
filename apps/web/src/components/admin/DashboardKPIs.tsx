'use client';

import React from 'react';
import {
  Calendar,
  CheckCircle2,
  FileText,
  CreditCard,
  AlertCircle,
  TrendingDown,
  Users,
  Package,
  Info,
} from 'lucide-react';
import { DashboardKPIsData } from './types';
import { AdminNavTab } from './AdminShell';

interface DashboardKPIsProps {
  kpis: DashboardKPIsData;
  onNavigateTab: (tab: AdminNavTab) => void;
}

export function DashboardKPIs({ kpis, onNavigateTab }: DashboardKPIsProps) {
  const cards = [
    {
      id: 'today-apts',
      title: "Today's Appointments",
      value: kpis.todayAppointmentsCount.toString(),
      subtext: `${kpis.completedAppointmentsToday} completed, ${kpis.inServiceAppointmentsToday} in service`,
      icon: Calendar,
      iconColor: 'text-[#B76E79]',
      bgColor: 'bg-rose-50/60',
      tooltip: 'Total scheduled customer appointments booked for this business date.',
      tab: 'APPOINTMENTS' as AdminNavTab,
    },
    {
      id: 'completed-apts',
      title: 'Completed Visits',
      value: kpis.completedAppointmentsToday.toString(),
      subtext: `${kpis.todayAppointmentsCount - kpis.completedAppointmentsToday} remaining today`,
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50/60',
      tooltip: 'Appointments where treatments have finished and service lines logged.',
      tab: 'APPOINTMENTS' as AdminNavTab,
    },
    {
      id: 'billed-sales',
      title: "Today's Billed Sales",
      value: kpis.todayBilledSalesFormatted,
      subtext: 'Invoiced service value',
      icon: FileText,
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50/60',
      tooltip: 'Gross monetary value of all client invoices and bills generated today. Note: Billed sales are distinct from actual payment collections.',
      tab: 'BILLING' as AdminNavTab,
    },
    {
      id: 'today-collections',
      title: "Today's Collections",
      value: kpis.todayCollectionsFormatted,
      subtext: 'Verified counter receipts',
      icon: CreditCard,
      iconColor: 'text-[#C3A57B]',
      bgColor: 'bg-amber-50/60',
      tooltip: 'Actual monetary funds received via Cash, UPI, and Card at the counter today. Represents real cash flow.',
      tab: 'PAYMENTS' as AdminNavTab,
    },
    {
      id: 'outstanding-dues',
      title: 'Outstanding Dues',
      value: kpis.outstandingCustomerDuesFormatted,
      subtext: 'Unsettled customer credit',
      icon: AlertCircle,
      iconColor: 'text-rose-600',
      bgColor: 'bg-rose-50/60',
      tooltip: 'Cumulative unpaid balance across issued and draft invoices awaiting counter clearance.',
      tab: 'BILLING' as AdminNavTab,
    },
    {
      id: 'recorded-expenses',
      title: "Today's Expenses",
      value: kpis.todayRecordedExpensesFormatted,
      subtext: 'Stock & operational costs',
      icon: TrendingDown,
      iconColor: 'text-[#707070]',
      bgColor: 'bg-stone-50/60',
      tooltip: 'Documented stock reorders and consumable purchases recorded for today.',
      tab: 'EXPENSES' as AdminNavTab,
    },
    {
      id: 'staff-present',
      title: 'Staff On Duty',
      value: `${kpis.staffPresentCount} / ${kpis.totalActiveStaffCount}`,
      subtext: `${kpis.totalActiveStaffCount - kpis.staffPresentCount} unmarked / off`,
      icon: Users,
      iconColor: 'text-[#252525]',
      bgColor: 'bg-slate-50/60',
      tooltip: 'Stylists and therapists who have checked in as PRESENT for today.',
      tab: 'ATTENDANCE' as AdminNavTab,
    },
    {
      id: 'low-stock',
      title: 'Low-Stock Alerts',
      value: kpis.lowStockAlertsCount.toString(),
      subtext: kpis.lowStockAlertsCount > 0 ? 'Requires salon restock' : 'All stock optimal',
      icon: Package,
      iconColor: kpis.lowStockAlertsCount > 0 ? 'text-amber-600' : 'text-emerald-600',
      bgColor: kpis.lowStockAlertsCount > 0 ? 'bg-amber-50/60' : 'bg-emerald-50/60',
      tooltip: 'Consumables, salon products, and hair spa kits currently at or below minimum safety levels.',
      tab: 'INVENTORY' as AdminNavTab,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={() => onNavigateTab(card.tab)}
            className="bg-white p-5 rounded-2xl border border-[#EAE6E3] hover:border-[#B76E79] hover:shadow-xs transition-all duration-200 cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between text-[#707070]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#707070]">
                {card.title}
              </span>
              <div className="flex items-center space-x-1.5">
                <span title={card.tooltip} className="cursor-help text-[#707070] hover:text-[#252525]">
                  <Info className="w-3.5 h-3.5" />
                </span>
                <span className={`p-2 rounded-xl ${card.bgColor} ${card.iconColor} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </span>
              </div>
            </div>

            <div className="text-2xl sm:text-3xl font-extrabold text-[#252525] tracking-tight">
              {card.value}
            </div>

            <div className="text-[11px] text-[#707070] flex items-center justify-between pt-1 border-t border-[#EAE6E3]/60">
              <span className="truncate">{card.subtext}</span>
              <span className="text-[#B76E79] font-bold group-hover:translate-x-0.5 transition-transform text-[10px]">
                View &rarr;
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

