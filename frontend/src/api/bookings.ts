import api from "./axios";

export interface Booking {
  id?: number;
  client: number;
  client_name?: string;
  client_email?: string;
  trainer: number;
  trainer_name?: string;
  trainer_email?: string;
  session_type: string;
  date: string; // "YYYY-MM-DD" format
  start_time: string; // "HH:MM" format
  end_time: string;   // "HH:MM" format
  price: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BookingFilters {
  status?: "pending" | "confirmed" | "cancelled" | "completed";
  trainer_id?: number;
}

// Get all bookings (filtered by user role automatically)
export const getBookings = async (filters?: BookingFilters): Promise<Booking[]> => {
  let url = "/api/bookings/";
  
  if (filters) {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.trainer_id) params.append("trainer_id", filters.trainer_id.toString());
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
  }
  
  const response = await api.get(url);
  return response.data;
};

// Get a specific booking
export const getBooking = async (id: number): Promise<Booking> => {
  const response = await api.get(`/api/bookings/${id}/`);
  return response.data;
};

// Create a new booking
export const createBooking = async (data: Partial<Booking>): Promise<Booking> => {
  const response = await api.post("/api/bookings/create/", data);
  return response.data;
};

// Update a booking
export const updateBooking = async (id: number, data: Partial<Booking>): Promise<Booking> => {
  const response = await api.patch(`/api/bookings/${id}/update/`, data);
  return response.data;
};

// Update booking status (accept, decline, complete)
export const updateBookingStatus = async (
  id: number,
  status: "pending" | "confirmed" | "cancelled" | "completed"
): Promise<Booking> => {
  const response = await api.patch(`/api/bookings/${id}/status/`, { status });
  return response.data;
};

// Delete/cancel a booking
export const deleteBooking = async (id: number): Promise<void> => {
  await api.delete(`/api/bookings/${id}/delete/`);
};

// Accept a booking (for trainers)
export const acceptBooking = async (id: number): Promise<Booking> => {
  return updateBookingStatus(id, "confirmed");
};

// Decline a booking (for trainers)
export const declineBooking = async (id: number): Promise<Booking> => {
  return updateBookingStatus(id, "cancelled");
};

// Complete a booking (for trainers)
export const completeBooking = async (id: number): Promise<Booking> => {
  return updateBookingStatus(id, "completed");
};
