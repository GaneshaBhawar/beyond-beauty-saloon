'use client';

export interface StoredAppointment {
  id: string;
  reference: string;
  serviceId: string;
  serviceName: string;
  category: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  date: string;
  time: string;
  stylist: string;
  status: 'CONFIRMED' | 'IN_SERVICE' | 'COMPLETED' | 'CANCELLED';
  price: string;
  paymentStatus: 'UNPAID' | 'PAID_UPI' | 'PAID_CASH' | 'PAID_CARD';
  notes?: string;
  createdAt: string;
}

const DEFAULT_APPOINTMENTS: StoredAppointment[] = [
  {
    id: 'apt-101',
    reference: 'BBS-20261028-9182',
    serviceId: 'hs-2',
    serviceName: 'Signature Layered Haircut & Finish',
    category: 'Hair Styling & Cuts',
    clientName: 'Ananya Sharma',
    clientPhone: '+91 98230 11223',
    clientEmail: 'ananya.sharma@example.com',
    date: '2026-10-28',
    time: '11:00 AM',
    stylist: 'Priya Deshmukh (Senior Stylist)',
    status: 'CONFIRMED',
    price: '₹850',
    paymentStatus: 'UNPAID',
    notes: 'Requested face-framing curtain bangs and light layering.',
    createdAt: '2026-10-27T10:15:00Z',
  },
  {
    id: 'apt-102',
    reference: 'BBS-20261028-4421',
    serviceId: 'hc-1',
    serviceName: 'L’Oréal Deep Nourishing Hair Spa',
    category: 'Hair Care & Spa',
    clientName: 'Kavita Patil',
    clientPhone: '+91 97305 44890',
    clientEmail: 'kavita.p@example.com',
    date: '2026-10-28',
    time: '02:30 PM',
    stylist: 'Priya Deshmukh (Senior Stylist)',
    status: 'CONFIRMED',
    price: '₹1,250',
    paymentStatus: 'UNPAID',
    notes: 'Focus on dry scalp soothing & argan hydration.',
    createdAt: '2026-10-27T14:20:00Z',
  },
  {
    id: 'apt-103',
    reference: 'BBS-20261028-7712',
    serviceId: 'sc-1',
    serviceName: 'Radiance Vitamin-C Glow Facial',
    category: 'Skin Care & Facials',
    clientName: 'Meera Rao',
    clientPhone: '+91 98901 23456',
    date: '2026-10-28',
    time: '04:00 PM',
    stylist: 'Sneha Patil (Skin Specialist)',
    status: 'CONFIRMED',
    price: '₹1,500',
    paymentStatus: 'PAID_UPI',
    notes: 'Pre-wedding glow facial.',
    createdAt: '2026-10-26T18:00:00Z',
  },
  {
    id: 'apt-104',
    reference: 'BBS-20261027-3810',
    serviceId: 'sc-1',
    serviceName: 'Radiance Vitamin-C Glow Facial',
    category: 'Skin Care & Facials',
    clientName: 'Ananya Sharma',
    clientPhone: '+91 98230 11223',
    date: '2026-10-20',
    time: '12:00 PM',
    stylist: 'Sneha Patil (Skin Specialist)',
    status: 'COMPLETED',
    price: '₹1,500',
    paymentStatus: 'PAID_UPI',
    notes: 'Completed successfully with sunscreen application.',
    createdAt: '2026-10-18T11:00:00Z',
  },
];

const STORAGE_KEY = 'beyond_appointments_v1';

export function getStoredAppointments(): StoredAppointment[] {
  if (typeof window === 'undefined') return DEFAULT_APPOINTMENTS;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_APPOINTMENTS));
      return DEFAULT_APPOINTMENTS;
    }
    return JSON.parse(data);
  } catch (e) {
    return DEFAULT_APPOINTMENTS;
  }
}

export function saveAppointment(newApt: Omit<StoredAppointment, 'id' | 'reference' | 'createdAt'>): StoredAppointment {
  const current = getStoredAppointments();
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const created: StoredAppointment = {
    ...newApt,
    id: `apt-${Date.now()}`,
    reference: `BBS-${timestamp}-${randomSuffix}`,
    createdAt: new Date().toISOString(),
  };

  const updated = [created, ...current];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('appointments-updated'));
  } catch (e) {
    // ignore
  }
  return created;
}

export function updateAppointmentStatus(
  id: string,
  status: StoredAppointment['status'],
  paymentStatus?: StoredAppointment['paymentStatus']
): void {
  const current = getStoredAppointments();
  const updated = current.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        status,
        ...(paymentStatus ? { paymentStatus } : {}),
      };
    }
    return item;
  });
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('appointments-updated'));
  } catch (e) {
    // ignore
  }
}

export function cancelAppointment(id: string): void {
  updateAppointmentStatus(id, 'CANCELLED');
}

