import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths, getDay } from "date-fns";
import { getTrainerAvailability } from "@/api/availability";
import { getBookings } from "@/api/bookings";
import type { AvailabilitySlot } from "@/api/availability";
import type { Booking } from "@/api/bookings";
import { useAuth } from "@/hooks/useAuth";

interface BookingCalendarProps {
  trainerId: number;
  trainerName: string;
  hourlyRate: number;
}

export default function BookingCalendar({ trainerId, trainerName, hourlyRate }: BookingCalendarProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bookingNotes, setBookingNotes] = useState("");

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Load availability and bookings
  useEffect(() => {
    loadAvailabilityAndBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trainerId]);

  const loadAvailabilityAndBookings = async () => {
    try {
      setLoading(true);
      const [availData, bookingData] = await Promise.all([
        getTrainerAvailability(trainerId),
        getBookings({ trainer_id: trainerId }),
      ]);
      setAvailability(availData);
      setBookings(bookingData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get available time slots for selected date
  const getAvailableTimesForDate = (date: Date) => {
    const dayName = format(date, "EEEE").toLowerCase();
    const dateString = format(date, "yyyy-MM-dd");

    // Find availability for this day
    const dayAvailability = availability.filter(
      (slot) => slot.day_of_week === dayName && slot.is_available
    );

    if (dayAvailability.length === 0) return [];

    // Generate hourly slots
    const slots: string[] = [];
    dayAvailability.forEach((slot) => {
      const start = parseInt(slot.start_time.split(":")[0]);
      const end = parseInt(slot.end_time.split(":")[0]);

      for (let hour = start; hour < end; hour++) {
        const timeSlot = `${hour.toString().padStart(2, "0")}:00`;
        
        // Check if this time is already booked
        const isBooked = bookings.some(
          (booking) =>
            booking.date === dateString &&
            booking.start_time === timeSlot &&
            booking.status !== "cancelled"
        );

        if (!isBooked) {
          slots.push(timeSlot);
        }
      }
    });

    return slots.sort();
  };

  const availableTimes = selectedDate ? getAvailableTimesForDate(selectedDate) : [];

  // Check if a date has any availability
  const hasAvailability = (date: Date) => {
    const dayName = format(date, "EEEE").toLowerCase();
    return availability.some((slot) => slot.day_of_week === dayName && slot.is_available);
  };

  // Check if a date has bookings
  const hasBooking = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd");
    return bookings.some((b) => b.date === dateString && b.status !== "cancelled");
  };

  const handleBookSession = () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select date and time");
      return;
    }

    if (!user) {
      alert("Please login to book a session");
      return;
    }

    if (user.role !== "client") {
      alert("Please login with a client account to book sessions");
      return;
    }

    // Show confirmation modal
    setShowConfirmModal(true);
  };

  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedTime) return;

    const endHour = parseInt(selectedTime.split(":")[0]) + 1;
    const endTime = `${endHour.toString().padStart(2, "0")}:00`;

    // Navigate to payment page with booking details
    navigate("/payment", {
      state: {
        bookingDetails: {
          trainer_id: trainerId,
          trainer_name: trainerName,
          date: format(selectedDate, "yyyy-MM-dd"),
          start_time: selectedTime,
          end_time: endTime,
          session_type: "Personal Training",
          price: hourlyRate,
          notes: bookingNotes,
        }
      }
    });
  };

  // Get day name for header
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Add empty cells for days before month starts
  const startDay = getDay(monthStart);
  const emptyCells = Array(startDay).fill(null);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-red-200">
      <h2 className="text-2xl font-bold mb-6 text-center">Select Date & Time</h2>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Previous month"
        >
          ←
        </button>
        <h3 className="text-lg font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Next month"
        >
          →
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {/* Day headers */}
        {dayNames.map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600 pb-2">
            {day}
          </div>
        ))}

        {/* Empty cells before month starts */}
        {emptyCells.map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}

        {/* Days */}
        {daysInMonth.map((date) => {
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const isTodayDate = isToday(date);
          const hasAvail = hasAvailability(date);
          const isBooked = hasBooking(date);
          const isPast = date < new Date() && !isToday(date);

          return (
            <button
              key={date.toString()}
              onClick={() => {
                if (!isPast && hasAvail) {
                  setSelectedDate(date);
                  setSelectedTime(null);
                }
              }}
              disabled={isPast || !hasAvail}
              className={`
                aspect-square p-2 rounded-lg text-sm font-medium transition-all
                ${isSelected ? "bg-blue-600 text-white ring-2 ring-blue-400" : ""}
                ${isTodayDate && !isSelected ? "bg-blue-50 text-blue-600 ring-1 ring-blue-200" : ""}
                ${isBooked && !isSelected ? "bg-gray-200 text-gray-500" : ""}
                ${!isSelected && !isTodayDate && !isBooked && hasAvail ? "hover:bg-gray-100" : ""}
                ${isPast || !hasAvail ? "text-gray-300 cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              {format(date, "d")}
            </button>
          );
        })}
      </div>

      {/* Available Times */}
      {selectedDate && (
        <div className="mb-6">
          <h4 className="font-semibold mb-3">
            Available Times for {format(selectedDate, "dd/MM/yyyy")}
          </h4>
          {loading ? (
            <div className="text-center py-4 text-gray-500">Loading times...</div>
          ) : availableTimes.length > 0 ? (
            <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
              {availableTimes.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`
                    p-3 rounded-lg border-2 text-sm font-medium transition-all
                    ${
                      selectedTime === time
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white border-gray-200 hover:border-blue-400 hover:bg-blue-50"
                    }
                  `}
                >
                  {time}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No available times for this date
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 text-sm mb-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded" />
          <span>Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-600 rounded" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded" />
          <span>Booked</span>
        </div>
      </div>

      {/* Book Button */}
      {user?.role === "client" ? (
        <button
          onClick={handleBookSession}
          disabled={!selectedDate || !selectedTime}
          className={`
            w-full py-4 rounded-lg font-semibold text-lg transition-all
            ${
              selectedDate && selectedTime
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }
          `}
        >
          Book Training Session - ${hourlyRate}/hr
        </button>
      ) : user ? (
        <div className="text-center py-4 text-gray-600 bg-gray-50 rounded-lg">
          <p className="font-medium mb-2">Logged in as {user.role}</p>
          <p className="text-sm">Switch to a client account to book sessions</p>
        </div>
      ) : (
        <div className="text-center py-4 text-gray-600 bg-gray-50 rounded-lg">
          Please login as a client to book
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && selectedDate && selectedTime && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-6">Confirm Booking</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Trainer:</span>
                <span className="font-medium">{trainerName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{format(selectedDate, "MMMM d, yyyy")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">
                  {selectedTime} - {parseInt(selectedTime.split(":")[0]) + 1}:00
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Price:</span>
                <span className="font-medium">${Number(hourlyRate).toFixed(2)}</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (optional)
              </label>
              <textarea
                value={bookingNotes}
                onChange={(e) => setBookingNotes(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={4}
                placeholder="Any special requests or goals for this session?"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setBookingNotes("");
                }}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                className="flex-1 px-4 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
