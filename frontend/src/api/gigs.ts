// src/api/gigs.ts

export type GigStatus = "active" | "draft" | "paused";

export interface Gig {
  id: string;
  trainerId: number;
  title: string;
  description: string;
  price: number;
  unit: string;
  status: GigStatus;
  rating: number | null;
  reviews: number;
  views: number;
  category?: string;
  imageUrl?: string | null;
  durationMinutes?: number;
  locationType?: string;
  maxParticipants?: number;
  equipmentIncluded?: string[];
  fitnessLevels?: string[];
  cancellationPolicy?: string;
  additionalNotes?: string;
  instantBookingEnabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GigInput {
  title: string;
  description: string;
  price: number;
  unit: string;
  category?: string;
  imageUrl?: string | null;
  durationMinutes?: number;
  locationType?: string;
  maxParticipants?: number;
  equipmentIncluded?: string[];
  fitnessLevels?: string[];
  cancellationPolicy?: string;
  additionalNotes?: string;
  instantBookingEnabled?: boolean;
}

export interface TrainerBooking {
  id: string;
  trainerId: number;
  clientName: string;
  clientAvatar: string | null;
  gigTitle: string;
  date: string;
  time: string;
  price: number;
  status: "pending" | "confirmed" | "completed";
}

// Simulate network latency
const wait = (ms = 600) => new Promise((res) => setTimeout(res, ms));


/**
 * Fetch recent bookings for a trainer
 */
export async function getTrainerBookings(trainerId: number): Promise<TrainerBooking[]> {
  await wait(800);
  const module = await import("../data/trainerBookings.json");
  const data: TrainerBooking[] = (module.default || module) as TrainerBooking[];
  
  // Filter by trainerId
  return data.filter((booking) => booking.trainerId === trainerId);
}


/**
 * Update booking status (simulate server call)
 */
export async function updateBookingStatus(
  bookingId: string,
  status: TrainerBooking["status"]
): Promise<{ ok: boolean; bookingId: string; status: string }> {
  await wait(600);
  // In a real API you would POST to server and persist. Here we simply return success.
  return { ok: true, bookingId, status };
}

/**
 * Update gig status (simulate server call)
 */
export async function updateGigStatus(
  gigId: string,
  status: GigStatus
): Promise<{ ok: boolean; gigId: string; status: string }> {
  await wait(600);
  // TODO: In a real API you would POST to server and persist. Here we simply return success.
  return { ok: true, gigId, status };
}

// In-memory storage for mock persistence
let mockGigsStorage: Gig[] | null = null;


function generateGigId(): string {
  return `g${Date.now()}`;
}

/**
 * Create a new gig
 */
export async function createGig(trainerId: number, payload: GigInput, status: GigStatus = "active"): Promise<Gig> {
  await wait(800);
  const gigs = await loadGigsFromStorage();
  
  const newGig: Gig = {
    id: generateGigId(),
    trainerId,
    ...payload,
    status,
    rating: null,
    reviews: 0,
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  gigs.push(newGig);
  mockGigsStorage = gigs;
  
  // Update localStorage for persistence across page reloads
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("trainerhub_mock_gigs", JSON.stringify(gigs));
    } catch (e) {
      console.warn("Failed to save to localStorage", e);
    }
  }
  
  return newGig;
}

/**
 * Update an existing gig
 */
export async function updateGig(trainerId: number, gigId: string, payload: GigInput, status?: GigStatus): Promise<Gig> {
  await wait(800);
  const gigs = await loadGigsFromStorage();
  
  const gigIndex = gigs.findIndex((g) => g.trainerId === trainerId && g.id === gigId);
  
  if (gigIndex === -1) {
    throw new Error("Gig not found");
  }
  
  const existingGig = gigs[gigIndex];
  const updatedGig: Gig = {
    ...existingGig,
    ...payload,
    status: status !== undefined ? status : existingGig.status,
    updatedAt: new Date().toISOString(),
  };
  
  gigs[gigIndex] = updatedGig;
  mockGigsStorage = gigs;
  
  // Update localStorage
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("trainerhub_mock_gigs", JSON.stringify(gigs));
    } catch (e) {
      console.warn("Failed to save to localStorage", e);
    }
  }
  
  return updatedGig;
}

/**
 * Publish a gig (sets status to ACTIVE)
 */
export async function publishGig(trainerId: number, gigId: string): Promise<Gig> {
  await wait(600);
  const gigs = await loadGigsFromStorage();
  
  const gigIndex = gigs.findIndex((g) => g.trainerId === trainerId && g.id === gigId);
  
  if (gigIndex === -1) {
    throw new Error("Gig not found");
  }
  
  const updatedGig: Gig = {
    ...gigs[gigIndex],
    status: "active",
    updatedAt: new Date().toISOString(),
  };
  
  gigs[gigIndex] = updatedGig;
  mockGigsStorage = gigs;
  
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("trainerhub_mock_gigs", JSON.stringify(gigs));
    } catch (e) {
      console.warn("Failed to save to localStorage", e);
    }
  }
  
  return updatedGig;
}

/**
 * Save a gig as draft (creates or updates with status DRAFT)
 */
export async function saveDraftGig(trainerId: number, payload: GigInput, gigId?: string): Promise<Gig> {
  if (gigId) {
    // Update existing gig
    return updateGig(trainerId, gigId, payload, "draft");
  } else {
    // Create new draft gig
    return createGig(trainerId, payload, "draft");
  }
}

// Initialize from localStorage on module load (only in browser)
if (typeof window !== "undefined") {
  try {
    const stored = localStorage.getItem("trainerhub_mock_gigs");
    if (stored) {
      mockGigsStorage = JSON.parse(stored);
    }
  } catch (e) {
    // Silently fail - will fall back to JSON file
    console.warn("Failed to load from localStorage", e);
  }
}

// Ensure loadGigsFromStorage also checks localStorage first
async function loadGigsFromStorage(): Promise<Gig[]> {
  // Check localStorage first if available
  if (typeof window !== "undefined" && !mockGigsStorage) {
    try {
      const stored = localStorage.getItem("trainerhub_mock_gigs");
      if (stored) {
        mockGigsStorage = JSON.parse(stored);
        if (mockGigsStorage) {
          return mockGigsStorage;
        }
      }
    } catch (e) {
      console.warn("Failed to load from localStorage", e);
    }
  }
  
  // Fall back to JSON file if localStorage doesn't have data
  if (!mockGigsStorage) {
    const module = await import("../data/gigs.json");
    const data: Gig[] = (module.default || module) as Gig[];
    mockGigsStorage = [...data];
    
    // Save to localStorage for next time
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("trainerhub_mock_gigs", JSON.stringify(mockGigsStorage));
      } catch (e) {
        console.warn("Failed to save to localStorage", e);
      }
    }
  }
  
  return mockGigsStorage || [];
}

/**
 * Fetch all gigs for a trainer
 */
export async function getTrainerGigs(trainerId: number): Promise<Gig[]> {
  await wait(700);
  const gigs = await loadGigsFromStorage();
  return gigs.filter((gig) => gig.trainerId === trainerId);
}

/**
 * Fetch a single gig by ID
 */
export async function getGigById(trainerId: number, gigId: string): Promise<Gig | null> {
  await wait(600);
  const gigs = await loadGigsFromStorage();
  const gig = gigs.find((g) => g.trainerId === trainerId && g.id === gigId);
  
  if (!gig) {
    return null;
  }
  
  // Provide safe defaults for optional fields
  return {
    ...gig,
    category: gig.category || "Training Service",
    imageUrl: gig.imageUrl || null,
    durationMinutes: gig.durationMinutes ?? 60,
    locationType: gig.locationType || "At My Gym",
    maxParticipants: gig.maxParticipants ?? 1,
    equipmentIncluded: gig.equipmentIncluded || [],
    fitnessLevels: gig.fitnessLevels || [],
    cancellationPolicy: gig.cancellationPolicy || "Cancel up to 24 hours before the session for a full refund.",
    additionalNotes: gig.additionalNotes || "",
    instantBookingEnabled: gig.instantBookingEnabled ?? false,
  };
}

