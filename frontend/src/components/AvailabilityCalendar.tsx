import React, { useState, useEffect } from "react";
import { getTrainerAvailability } from "@/api/availability";
import { getBookings } from "@/api/bookings";
import type { AvailabilitySlot } from "@/api/availability";
import type { Booking } from "@/api/bookings";

interface AvailabilityCalendarProps {
  trainerId: number;
  onSelectSlot: (date: Date, startTime: string, endTime: string) => void;
}

interface TimeSlot {
  time: string;
  available: boolean;
  booked: boolean;
}

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  trainerId,
  onSelectSlot,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [trainerId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const availabilityData = await getTrainerAvailability(trainerId);
      setAvailability(availabilityData);
      
      // Try to get bookings, but don't fail if user is not authenticated
      try {
        const bookingsData = await getBookings({ trainer_id: trainerId });
        setBookings(bookingsData);
      } catch (bookingError) {
        console.warn("Could not load bookings (user may not be logged in):", bookingError);
        setBookings([]);
      }
    } catch (error) {
      console.error("Error loading availability:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // Add empty slots for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const isDateAvailable = (date: Date) => {
    const dayName = DAYS_OF_WEEK[date.getDay()].toLowerCase();
    const hasAvailability = availability.some(
      (slot) => slot.day_of_week === dayName && slot.is_available
    );
    
    // Check if date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isNotPast = date >= today;
    
    return hasAvailability && isNotPast;
  };

  const getTimeSlotsForDate = (date: Date): TimeSlot[] => {
    const dayName = DAYS_OF_WEEK[date.getDay()].toLowerCase();
    const dayAvailability = availability.filter(
      (slot) => slot.day_of_week === dayName && slot.is_available
    );

    if (dayAvailability.length === 0) return [];

    const slots: TimeSlot[] = [];
    const dateString = date.toISOString().split("T")[0];

    dayAvailability.forEach((avail) => {
      const startHour = parseInt(avail.start_time.split(":")[0]);
      const endHour = parseInt(avail.end_time.split(":")[0]);

      for (let hour = startHour; hour < endHour; hour++) {
        const timeSlot = `${hour.toString().padStart(2, "0")}:00`;
        const endTimeSlot = `${(hour + 1).toString().padStart(2, "0")}:00`;

        // Check if this slot is booked
        const isBooked = bookings.some((booking) => {
          if (booking.date !== dateString) return false;
          if (booking.status === "cancelled") return false;

          const bookingStart = booking.start_time.slice(0, 5);
          const bookingEnd = booking.end_time.slice(0, 5);

          return timeSlot >= bookingStart && timeSlot < bookingEnd;
        });

        slots.push({
          time: timeSlot,
          available: !isBooked,
          booked: isBooked,
        });
      }
    });

    return slots;
  };

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    setSelectedDate(null);
  };

  const handleDateClick = (date: Date) => {
    if (isDateAvailable(date)) {
      setSelectedDate(date);
      setSelectedSlot(null);
    }
  };

  const handleSlotClick = (slot: TimeSlot) => {
    if (!slot.available || !selectedDate) return;

    const endHour = parseInt(slot.time.split(":")[0]) + 1;
    const endTime = `${endHour.toString().padStart(2, "0")}:00`;

    setSelectedSlot(slot.time);
    onSelectSlot(selectedDate, slot.time, endTime);
  };

  const monthYear = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const days = getDaysInMonth(currentDate);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading availability...</div>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Select Date & Time</h3>

      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePreviousMonth}
          className="p-2 hover:bg-gray-100 rounded"
        >
          ←
        </button>
        <div className="font-semibold">{monthYear}</div>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded"
        >
          →
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500 p-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="p-2" />;
          }

          const isAvailable = isDateAvailable(date);
          const isSelected =
            selectedDate?.toDateString() === date.toDateString();
          const isToday =
            date.toDateString() === new Date().toDateString();

          return (
            <button
              key={date.toISOString()}
              onClick={() => handleDateClick(date)}
              disabled={!isAvailable}
              className={`
                p-2 text-sm rounded transition-colors
                ${isSelected ? "bg-blue-600 text-white" : ""}
                ${!isSelected && isAvailable ? "hover:bg-blue-100 cursor-pointer" : ""}
                ${!isAvailable ? "text-gray-300 cursor-not-allowed" : ""}
                ${isToday && !isSelected ? "border-2 border-blue-600" : ""}
              `}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div>
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3">
              Available Times for {selectedDate.toLocaleDateString()}
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {getTimeSlotsForDate(selectedDate).map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => handleSlotClick(slot)}
                  disabled={!slot.available}
                  className={`
                    p-2 text-sm rounded border transition-colors
                    ${selectedSlot === slot.time ? "bg-blue-600 text-white border-blue-600" : ""}
                    ${!selectedSlot && slot.available ? "hover:bg-blue-50 border-gray-300" : ""}
                    ${slot.booked ? "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-200" : ""}
                    ${!slot.available && !slot.booked ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}
                  `}
                >
                  {slot.time}
                  {slot.booked && <span className="block text-xs">Booked</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 border-2 border-blue-600 rounded"></div>
            <span>Today</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-blue-600 rounded"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <span>Booked</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
