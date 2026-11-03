'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Check,
  Sun,
  Sunset,
  Moon,
} from 'lucide-react';
import { SalonService } from '@/data/servicesData';
import { apiRequest } from '@/lib/api';

interface SlotData {
  time: string;
  time24: string;
  period: 'morning' | 'afternoon' | 'evening';
  startIso: string;
  available: boolean;
  availableStaffIds: string[];
  availableStaffNames: string[];
}

interface AvailabilityResponse {
  date: string;
  serviceId: string;
  serviceName: string;
  durationMinutes: number;
  bufferMinutes: number;
  operatingHours: string;
  isClosed: boolean;
  isPast: boolean;
  isFullyBooked: boolean;
  availableSlotsCount: number;
  totalSlotsCount: number;
  reason?: string;
  message?: string;
  slots: SlotData[];
}

interface DateTimeSelectionStepProps {
  selectedService: SalonService;
  selectedStylistId: string;
  selectedStylistName: string;
  selectedDate: string; // YYYY-MM-DD
  selectedSlot: string | null; // e.g. "11:00 AM"
  onSelectDate: (date: string) => void;
  onSelectSlot: (slot: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

export function DateTimeSelectionStep({
  selectedService,
  selectedStylistId,
  selectedStylistName,
  selectedDate,
  selectedSlot,
  onSelectDate,
  onSelectSlot,
  onBack,
  onContinue,
}: DateTimeSelectionStepProps) {
  // Calendar month state
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(() => {
    const d = new Date(selectedDate);
    return isNaN(d.getTime()) ? new Date() : d;
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [apiError, setApiError] = useState<string>('');

  // Fetch real availability from backend
  useEffect(() => {
    let isMounted = true;
    async function loadAvailability() {
      setLoading(true);
      setApiError('');
      try {
        const queryStaff = selectedStylistId && selectedStylistId !== 'ANY' ? selectedStylistId : 'ANY';
        const res = await apiRequest<AvailabilityResponse>(
          `/public/availability?serviceId=${encodeURIComponent(
            selectedService.slug || selectedService.id
          )}&date=${selectedDate}&staffId=${queryStaff}`
        );

        if (isMounted) {
          const availData = (res.data || res) as AvailabilityResponse;
          if (res.success && availData && (availData.slots || availData.isClosed)) {
            setAvailability(availData);
            // If currently selected slot is not in the available slots, clear or preserve
            if (availData.slots && selectedSlot) {
              const matchedSlot = availData.slots.find((s) => s.time === selectedSlot);
              if (!matchedSlot || !matchedSlot.available) {
                // Pick first available slot as convenient default if possible
                const firstAvailable = availData.slots.find((s) => s.available);
                if (firstAvailable) onSelectSlot(firstAvailable.time);
                else onSelectSlot('');
              }
            }
          } else {
            setApiError(res.error || 'Failed to load availability for this date.');
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setApiError(err?.message || 'Failed to connect to reservation server.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadAvailability();
    return () => {
      isMounted = false;
    };
  }, [selectedService, selectedStylistId, selectedDate]);

  // Today in Asia/Kolkata
  const todayStr = useMemo(() => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(now);
  }, []);

  // Calendar days calculation
  const calendarDays = useMemo(() => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay(); // 0=Sun, 1=Mon...
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: Array<{
      dateStr: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isToday: boolean;
      isPast: boolean;
      isMonday: boolean;
      isSelected: boolean;
    }> = [];

    // Prefix days from previous month
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      const mStr = String(month === 0 ? 12 : month).padStart(2, '0');
      const yStr = month === 0 ? year - 1 : year;
      const dStr = String(dayNum).padStart(2, '0');
      const dateStr = `${yStr}-${mStr}-${dStr}`;
      const isMon = new Date(Date.UTC(yStr, (month === 0 ? 12 : month) - 1, dayNum, 6, 0, 0)).getUTCDay() === 1;

      days.push({
        dateStr,
        dayNumber: dayNum,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        isPast: dateStr < todayStr,
        isMonday: isMon,
        isSelected: dateStr === selectedDate,
      });
    }

    // Days in current month
    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const mStr = String(month + 1).padStart(2, '0');
      const dStr = String(dayNum).padStart(2, '0');
      const dateStr = `${year}-${mStr}-${dStr}`;
      const dayOfWeek = new Date(Date.UTC(year, month, dayNum, 6, 0, 0)).getUTCDay();
      const isMonday = dayOfWeek === 1;

      days.push({
        dateStr,
        dayNumber: dayNum,
        isCurrentMonth: true,
        isToday: dateStr === todayStr,
        isPast: dateStr < todayStr,
        isMonday,
        isSelected: dateStr === selectedDate,
      });
    }

    return days;
  }, [currentMonthDate, todayStr, selectedDate]);

  // Group slots by period
  const morningSlots = availability?.slots.filter((s) => s.period === 'morning') || [];
  const afternoonSlots = availability?.slots.filter((s) => s.period === 'afternoon') || [];
  const eveningSlots = availability?.slots.filter((s) => s.period === 'evening') || [];

  const handlePrevMonth = () => {
    setCurrentMonthDate(
      new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(
      new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1)
    );
  };

  const monthLabel = currentMonthDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Notice */}
      <div className="bg-white rounded-3xl border border-salon-gray p-6 sm:p-8 space-y-2">
        <div className="flex items-center space-x-2 text-xs font-semibold text-salon-rose-dark uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5 text-salon-rose" />
          <span>Step 3 of 4 • Salon Calendar & Time Selection</span>
        </div>
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-salon-black">
          Select Your Preferred Date & Time
        </h3>
        <p className="text-xs sm:text-sm text-salon-muted max-w-xl">
          Beyond Beauty Saloon is open <span className="font-semibold text-salon-black">Tuesday to Sunday from 8:30 AM to 9:30 PM</span> (Closed Mondays). Slot availability updates dynamically in real-time.
        </p>
      </div>

      {/* Two Column Layout: Calendar on Left, Slots on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Calendar (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-salon-gray p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-salon-gray">
            <h4 className="font-serif text-base font-bold text-salon-black flex items-center space-x-2">
              <CalendarIcon className="w-4 h-4 text-salon-rose" />
              <span>{monthLabel}</span>
            </h4>
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-full hover:bg-salon-ivory text-salon-black border border-salon-gray transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-full hover:bg-salon-ivory text-salon-black border border-salon-gray transition-colors"
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Header */}
          <div className="grid grid-cols-7 text-center text-[11px] font-bold text-salon-muted uppercase tracking-wider">
            <span>Su</span>
            <span className="text-rose-500 font-extrabold" title="Closed on Mondays">
              Mo*
            </span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {calendarDays.map((d, idx) => {
              const isDisabled = !d.isCurrentMonth || d.isPast || d.isMonday;

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => onSelectDate(d.dateStr)}
                  className={`h-9 sm:h-10 rounded-xl text-xs font-semibold flex flex-col items-center justify-center transition-all relative ${
                    d.isSelected
                      ? 'bg-salon-rose text-white shadow-md ring-2 ring-salon-rose/30 font-bold scale-105'
                      : d.isMonday
                      ? 'bg-rose-50/50 text-rose-300 cursor-not-allowed line-through'
                      : d.isPast || !d.isCurrentMonth
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'hover:bg-salon-rose-light/60 hover:text-salon-rose-dark text-salon-black bg-salon-ivory/50 border border-transparent'
                  }`}
                  title={
                    d.isMonday
                      ? 'Closed on Mondays'
                      : d.isPast
                      ? 'Past date'
                      : d.dateStr
                  }
                >
                  <span>{d.dayNumber}</span>
                  {d.isToday && !d.isSelected && (
                    <span className="w-1 h-1 rounded-full bg-salon-rose absolute bottom-1" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-salon-gray/70 space-y-2 text-[11px] text-salon-muted">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span>*Mondays are closed for studio sanitization and inventory maintenance.</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-salon-rose" />
              <span>Selected date: <strong className="text-salon-black">{selectedDate}</strong></span>
            </div>
          </div>
        </div>

        {/* Right Column: Time Slot Selector (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-salon-gray p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-salon-gray">
            <div>
              <h4 className="font-serif text-base font-bold text-salon-black">
                Available Start Times
              </h4>
              <p className="text-xs text-salon-muted">
                {selectedService.name} requires {selectedService.durationMinutes} mins + 10 mins prep.
              </p>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 rounded-full bg-salon-ivory text-xs font-mono font-bold text-salon-black border border-salon-gray">
                {availability?.availableSlotsCount || 0} Slots Free
              </span>
            </div>
          </div>

          {loading ? (
            /* Loading Spinner & Skeletons */
            <div className="py-12 text-center space-y-4">
              <div className="w-10 h-10 border-3 border-salon-rose/30 border-t-salon-rose rounded-full animate-spin mx-auto" />
              <p className="text-xs text-salon-muted">
                Calculating live specialist schedules for {selectedDate}...
              </p>
            </div>
          ) : availability?.isClosed ? (
            /* Monday / Closed Banner */
            <div className="py-10 px-6 text-center bg-rose-50/60 rounded-2xl border border-rose-200/70 space-y-3">
              <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
              <h5 className="font-serif text-base font-bold text-rose-900">
                Salon Closed on This Date
              </h5>
              <p className="text-xs text-rose-700 max-w-md mx-auto leading-relaxed">
                {availability.reason ||
                  'Beyond Beauty Saloon is closed on Mondays. We welcome you Tuesday through Sunday from 8:30 AM to 9:30 PM.'}
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    // Pick next Tuesday
                    const current = new Date(selectedDate);
                    current.setDate(current.getDate() + 1);
                    onSelectDate(current.toISOString().split('T')[0]);
                  }}
                  className="px-4 py-2 rounded-full bg-white text-xs font-semibold text-rose-800 border border-rose-200 hover:bg-rose-50 shadow-xs"
                >
                  Switch to Next Available Day
                </button>
              </div>
            </div>
          ) : availability?.isFullyBooked ? (
            /* Fully Booked Banner */
            <div className="py-10 px-6 text-center bg-amber-50/70 rounded-2xl border border-amber-200/70 space-y-3">
              <Sparkles className="w-8 h-8 text-amber-600 mx-auto" />
              <h5 className="font-serif text-base font-bold text-amber-900">
                Fully Booked on {selectedDate}
              </h5>
              <p className="text-xs text-amber-800 max-w-md mx-auto leading-relaxed">
                We’re fully booked for {selectedService.name} on this date. Would another date work for you?
              </p>
              <button
                type="button"
                onClick={() => {
                  const current = new Date(selectedDate);
                  current.setDate(current.getDate() + 1);
                  if (current.getDay() === 1) current.setDate(current.getDate() + 1); // skip Monday
                  onSelectDate(current.toISOString().split('T')[0]);
                }}
                className="px-5 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs"
              >
                Check Next Available Date
              </button>
            </div>
          ) : (
            /* Time Slot Sections */
            <div className="space-y-5">
              {/* Morning Slots */}
              {morningSlots.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-salon-black uppercase tracking-wider">
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Morning Slots (08:30 AM – 12:00 PM)</span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {morningSlots.map((slot) => {
                      const isSelected = selectedSlot === slot.time;
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => onSelectSlot(slot.time)}
                          className={`py-2 px-2.5 rounded-xl text-xs font-semibold text-center transition-all ${
                            isSelected
                              ? 'bg-salon-rose text-white shadow-sm ring-2 ring-salon-rose/30 font-bold'
                              : slot.available
                              ? 'bg-salon-ivory text-salon-black hover:bg-salon-rose-light/60 hover:text-salon-rose-dark border border-salon-gray/70'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed line-through border border-transparent'
                          }`}
                        >
                          {slot.time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Afternoon Slots */}
              {afternoonSlots.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-salon-black uppercase tracking-wider">
                    <Sunset className="w-3.5 h-3.5 text-orange-500" />
                    <span>Afternoon Slots (12:00 PM – 05:00 PM)</span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {afternoonSlots.map((slot) => {
                      const isSelected = selectedSlot === slot.time;
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => onSelectSlot(slot.time)}
                          className={`py-2 px-2.5 rounded-xl text-xs font-semibold text-center transition-all ${
                            isSelected
                              ? 'bg-salon-rose text-white shadow-sm ring-2 ring-salon-rose/30 font-bold'
                              : slot.available
                              ? 'bg-salon-ivory text-salon-black hover:bg-salon-rose-light/60 hover:text-salon-rose-dark border border-salon-gray/70'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed line-through border border-transparent'
                          }`}
                        >
                          {slot.time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Evening Slots */}
              {eveningSlots.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-salon-black uppercase tracking-wider">
                    <Moon className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Evening Slots (05:00 PM – 09:30 PM)</span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {eveningSlots.map((slot) => {
                      const isSelected = selectedSlot === slot.time;
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => onSelectSlot(slot.time)}
                          className={`py-2 px-2.5 rounded-xl text-xs font-semibold text-center transition-all ${
                            isSelected
                              ? 'bg-salon-rose text-white shadow-sm ring-2 ring-salon-rose/30 font-bold'
                              : slot.available
                              ? 'bg-salon-ivory text-salon-black hover:bg-salon-rose-light/60 hover:text-salon-rose-dark border border-salon-gray/70'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed line-through border border-transparent'
                          }`}
                        >
                          {slot.time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="pt-4 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 p-4 sm:p-5 bg-white rounded-2xl border border-salon-gray shadow-xs">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-full border border-salon-gray bg-white text-xs font-semibold text-salon-black hover:bg-salon-ivory transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Stylist</span>
        </button>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="text-xs text-right hidden md:block">
            <span className="text-salon-muted">Selected Slot: </span>
            <span className="font-bold text-salon-black">
              {selectedDate} at {selectedSlot || 'None selected'}
            </span>
          </div>
          <button
            type="button"
            disabled={!selectedSlot}
            onClick={onContinue}
            className={`w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all group ${
              selectedSlot
                ? 'bg-salon-rose hover:bg-salon-rose-dark text-white shadow-md cursor-pointer'
                : 'bg-salon-gray text-salon-muted cursor-not-allowed'
            }`}
          >
            <span>Continue to Your Details</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
