// Core User Roles
export type UserRole = 'CUSTOMER' | 'EMPLOYEE' | 'OWNER_ADMIN';

export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';

export interface UserSummaryDto {
  id: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  firstName: string;
  lastName: string;
  status: UserStatus;
}

// Service Taxonomy & Catalog
export interface ServiceCategoryDto {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  displayOrder: number;
  isActive: boolean;
}

export interface ServiceDto {
  id: string;
  categoryId: string;
  categoryName?: string;
  slug: string;
  name: string;
  shortDescription?: string | null;
  fullDescription?: string | null;
  durationMinutes: number;
  bufferAfterMinutes: number;
  pricePaise: number | null; // null represents "Ask for price"
  isPriceVariable: boolean;
  requiresConsultation: boolean;
  isActive: boolean;
  isFeatured: boolean;
  preparationNotes?: string | null;
  aftercareNotes?: string | null;
}

// Staff & Eligibility
export interface EmployeeSummaryDto {
  id: string;
  userId: string;
  staffCode: string;
  displayName: string;
  jobTitle: string;
  isPublicBookable: boolean;
  colorTag: string;
  skills?: string[]; // list of serviceIds
}

// Business Info & Hours
export interface BusinessInfoDto {
  name: string;
  tagline: string;
  address: string;
  primaryContact: string;
  alternateContact: string;
  instagramUrl: string;
  indicativeRating: number;
  ratingDisclaimer: string;
  timezone: string;
  currency: string;
  hours: BusinessOperatingHoursDto[];
}

export interface BusinessOperatingHoursDto {
  dayOfWeek: number; // 0=Sunday, 1=Monday, etc.
  dayName: string;
  isClosed: boolean;
  openTime: string; // "10:00"
  closeTime: string; // "20:00"
}

// Appointments & Scheduling
export type AppointmentStatus =
  | 'REQUESTED'
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'IN_SERVICE'
  | 'COMPLETED'
  | 'CANCELLED_BY_CUSTOMER'
  | 'CANCELLED_BY_STAFF'
  | 'NO_SHOW'
  | 'REJECTED';

export interface AppointmentDto {
  id: string;
  referenceCode: string;
  customerId: string;
  customerName: string;
  customerPhone?: string | null;
  status: AppointmentStatus;
  startTime: string; // ISO UTC
  endTime: string;   // ISO UTC
  totalDurationMinutes: number;
  estimatedTotalPaise: number;
  customerNotes?: string | null;
  internalNotes?: string | null;
  services: {
    serviceId: string;
    serviceName: string;
    durationMinutes: number;
    pricePaise: number | null;
  }[];
  allocatedEmployeeId?: string | null;
  allocatedEmployeeName?: string | null;
  createdAt: string;
}

// Availability Slots
export interface AvailabilitySlotDto {
  startTime: string; // ISO UTC
  endTime: string;   // ISO UTC
  localStartTime: string; // "10:30 AM"
  localEndTime: string;   // "11:30 AM"
  availableEmployeeIds: string[];
  status: 'AVAILABLE' | 'LIMITED' | 'UNAVAILABLE';
}

// Visits & Service Lines
export interface VisitServiceLineDto {
  id: string;
  serviceId: string;
  serviceName: string;
  employeeId: string;
  employeeName: string;
  quantity: number;
  unitPricePaise: number;
  discountPaise: number;
  totalPaise: number;
}

// Billing & Payments
export type InvoiceStatus = 'DRAFT' | 'ISSUED' | 'PARTIALLY_PAID' | 'PAID' | 'VOID';

export type PaymentMethod = 'CASH' | 'UPI' | 'CARD_AT_COUNTER' | 'BANK_TRANSFER';

export interface InvoiceDto {
  id: string;
  invoiceNumber: string;
  visitId?: string | null;
  customerId: string;
  customerName: string;
  subtotalPaise: number;
  discountPaise: number;
  taxPaise: number;
  totalPaise: number;
  paidAmountPaise: number;
  balanceDuePaise: number;
  status: InvoiceStatus;
  issuedAt?: string | null;
  lines: VisitServiceLineDto[];
  payments: PaymentDto[];
  createdAt: string;
}

export interface PaymentDto {
  id: string;
  invoiceId: string;
  paymentMethod: PaymentMethod;
  amountPaise: number;
  transactionReference?: string | null;
  recordedByUserName: string;
  paymentDate: string;
  notes?: string | null;
}

// Attendance
export type AttendanceStatus =
  | 'PRESENT'
  | 'LATE'
  | 'HALF_DAY'
  | 'ABSENT'
  | 'ON_LEAVE'
  | 'HOLIDAY'
  | 'OFF_DAY';

export interface AttendanceRecordDto {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string; // "YYYY-MM-DD"
  checkInTime?: string | null;
  checkOutTime?: string | null;
  status: AttendanceStatus;
  isManuallyCorrected: boolean;
  correctionReason?: string | null;
}

// Notifications
export interface NotificationDto {
  id: string;
  title: string;
  message: string;
  type: 'BOOKING' | 'SCHEDULE' | 'ATTENDANCE' | 'PAYROLL' | 'ALERT';
  relatedEntityType?: string | null;
  relatedEntityId?: string | null;
  isRead: boolean;
  createdAt: string;
}

// API Response Envelope
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  meta?: Record<string, unknown>;
}
