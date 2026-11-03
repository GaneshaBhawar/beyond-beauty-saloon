'use client';

import React from 'react';
import { ShieldAlert, AlertTriangle, Package, Calendar, Clock, Receipt, ArrowRight } from 'lucide-react';
import { ActionableAlertItem } from './types';
import { AdminNavTab } from './AdminShell';

interface ActionableAlertsPanelProps {
  alerts: ActionableAlertItem[];
  onNavigateTab: (tab: AdminNavTab) => void;
}

export function ActionableAlertsPanel({
  alerts,
  onNavigateTab,
}: ActionableAlertsPanelProps) {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'LOW_STOCK':
        return <Package className="w-4 h-4 text-amber-600" />;
      case 'UNCONFIRMED_APPOINTMENT':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case 'UNMARKED_ATTENDANCE':
        return <Clock className="w-4 h-4 text-rose-600" />;
      case 'UNPAID_INVOICE':
        return <Receipt className="w-4 h-4 text-[#B76E79]" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#EAE6E3] p-6 sm:p-8 shadow-xs space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#EAE6E3] pb-4">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 text-[#B76E79]" />
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#252525] tracking-tight">
              Actionable Alerts & Attention Required
            </h3>
            <p className="text-xs text-[#707070] mt-0.5">
              Live salon operations requiring owner review and resolution.
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
          {alerts.length} Pending
        </span>
      </div>

      {/* Alerts List */}
      <div className="divide-y divide-[#EAE6E3]">
        {alerts.length === 0 ? (
          <div className="py-8 text-center text-xs text-emerald-700 bg-emerald-50/50 rounded-2xl border border-emerald-200/60 p-4">
            <span className="font-bold block text-sm">All Salon Operations Clear!</span>
            No low-stock alerts, pending appointments, or unrecorded attendance items.
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF9F7]/60 px-3 rounded-2xl transition-colors"
            >
              <div className="flex items-start space-x-3">
                <span className="p-2 rounded-xl bg-[#FAF9F7] border border-[#EAE6E3] shrink-0 mt-0.5">
                  {getAlertIcon(alert.type)}
                </span>
                <div>
                  <span className="font-bold text-xs text-[#252525] block">
                    {alert.title}
                  </span>
                  <span className="text-[11px] text-[#707070] leading-relaxed block mt-0.5">
                    {alert.description}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigateTab(alert.linkTab as AdminNavTab)}
                className="px-3 py-1.5 rounded-xl bg-white border border-[#EAE6E3] hover:border-[#B76E79] hover:text-[#B76E79] text-[#252525] text-xs font-bold transition-all inline-flex items-center shrink-0 self-end sm:self-center shadow-2xs cursor-pointer"
              >
                Resolve
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

