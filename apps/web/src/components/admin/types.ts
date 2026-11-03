export interface DashboardKPIsData {
  todayAppointmentsCount: number;
  completedAppointmentsToday: number;
  inServiceAppointmentsToday: number;
  confirmedAppointmentsToday: number;
  requestedAppointmentsToday: number;
  cancelledAppointmentsToday: number;
  todayBilledSalesFormatted: string;
  todayBilledSalesPaise: number;
  todayCollectionsFormatted: string;
  todayCollectionsPaise: number;
  outstandingCustomerDuesFormatted: string;
  outstandingCustomerDuesPaise: number;
  todayRecordedExpensesFormatted: string;
  todayRecordedExpensesPaise: number;
  staffPresentCount: number;
  totalActiveStaffCount: number;
  lowStockAlertsCount: number;
}

export interface DashboardAppointmentItem {
  id: string;
  referenceCode: string;
  clientName: string;
  clientPhone: string;
  serviceName: string;
  durationMinutes: number;
  stylistName: string;
  stylistId: string | null;
  startTimeFormatted: string;
  endTimeFormatted: string;
  startTimeIso: string;
  status: string; // 'REQUESTED' | 'CONFIRMED' | 'IN_SERVICE' | 'COMPLETED' | 'CANCELLED_BY_CUSTOMER' | 'CANCELLED_BY_STAFF' | 'NO_SHOW'
  estimatedTotalFormatted: string;
  estimatedTotalPaise: number;
  invoiceStatus: string;
  paymentStatus: 'PAID' | 'PARTIALLY_PAID' | 'PENDING';
}

export interface SalesChartDataPoint {
  label: string;
  date: string;
  billedSales: number;
  collections: number;
}

export interface SalesPerformanceData {
  range: 'daily' | 'weekly' | 'monthly';
  series: SalesChartDataPoint[];
}

export interface MonthlySummaryData {
  periodLabel: string;
  totalBilledSalesFormatted: string;
  totalBilledSalesPaise: number;
  totalCollectionsFormatted: string;
  totalCollectionsPaise: number;
  recordedExpensesFormatted: string;
  recordedExpensesPaise: number;
  outstandingDuesFormatted: string;
  outstandingDuesPaise: number;
  operatingResultFormatted: string;
  operatingResultPaise: number;
  methodologyNotes: string;
}

export interface StaffOverviewItem {
  id: string;
  staffCode: string;
  fullName: string;
  displayName: string;
  jobTitle: string;
  colorTag: string;
  status: 'PRESENT' | 'LATE' | 'HALF_DAY' | 'ON_LEAVE' | 'ABSENT' | 'NOT_MARKED';
  checkInTime: string | null;
  checkOutTime: string | null;
  assignedAppointmentsToday: number;
}

export interface StaffOverviewData {
  counts: {
    total: number;
    present: number;
    absent: number;
    onLeave: number;
    notMarked: number;
  };
  staffList: StaffOverviewItem[];
}

export interface PopularServiceItem {
  id: string;
  name: string;
  count: number;
  totalAmountFormatted: string;
  revenuePaise: number;
}

export interface PaymentMethodItem {
  method: string;
  label: string;
  amountFormatted: string;
  amountPaise: number;
  count: number;
  percentage: number;
}

export interface ActionableAlertItem {
  id: string;
  type: 'LOW_STOCK' | 'UNCONFIRMED_APPOINTMENT' | 'UNPAID_INVOICE' | 'UNMARKED_ATTENDANCE';
  title: string;
  description: string;
  linkTab: string;
}

export interface DashboardV2Payload {
  businessDate: string;
  kpis: DashboardKPIsData;
  todayAppointments: DashboardAppointmentItem[];
  salesPerformance: SalesPerformanceData;
  monthlySummary: MonthlySummaryData;
  staffOverview: StaffOverviewData;
  popularServices: PopularServiceItem[];
  paymentMethodsBreakdown: PaymentMethodItem[];
  actionableAlerts: ActionableAlertItem[];
}

