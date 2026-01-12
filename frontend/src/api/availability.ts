import api from "./axios";

export interface AvailabilitySlot {
  id?: number;
  trainer?: number;
  trainer_name?: string;
  day_of_week: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
  start_time: string; // "HH:MM" format
  end_time: string;   // "HH:MM" format
  is_available: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AvailabilityResponse {
  message: string;
  availability: AvailabilitySlot[];
}

// Get availability for a trainer
export const getTrainerAvailability = async (trainerId?: number): Promise<AvailabilitySlot[]> => {
  const params = trainerId ? `?trainer_id=${trainerId}` : '';
  const response = await api.get(`/api/bookings/availability/${params}`);
  return response.data;
};

// Create a single availability slot
export const createAvailabilitySlot = async (data: AvailabilitySlot): Promise<AvailabilitySlot> => {
  const response = await api.post("/api/bookings/availability/", data);
  return response.data;
};

// Update a single availability slot
export const updateAvailabilitySlot = async (id: number, data: Partial<AvailabilitySlot>): Promise<AvailabilitySlot> => {
  const response = await api.patch(`/api/bookings/availability/${id}/`, data);
  return response.data;
};

// Delete a single availability slot
export const deleteAvailabilitySlot = async (id: number): Promise<void> => {
  await api.delete(`/api/bookings/availability/${id}/`);
};

// Bulk update all availability slots for a trainer
export const bulkUpdateAvailability = async (availability: AvailabilitySlot[]): Promise<AvailabilityResponse> => {
  const response = await api.post("/api/bookings/availability/bulk-update/", {
    availability
  });
  return response.data;
};
