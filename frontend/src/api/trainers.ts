// src/api/trainers.ts
export interface Trainer {
  id: number;
  name: string;
  title: string;
  rating: number;
  reviews: number;
  thumbnail: string;
  description: string;
  price: number;
  specialties: string[];
  experienceYears: number;
  location: string;
}

// src/api/dashboard.ts
export type RevenuePoint = { date: string; revenue: number };
export type ProfileData = {
  trainerId: number;
  name: string;
  totalRevenue: number;
  activeBookings: number;
  pendingRequests: number;
  completedSessions: number;
  revenueSeries: RevenuePoint[];
};


export interface TrainersResponse {
  data: Trainer[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalResults: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// simulate network latency
const wait = (ms = 600) => new Promise((res) => setTimeout(res, ms));

export async function fetchTrainers({
  page = 1,
  pageSize = 5,
  filters = {},
  sortBy = "relevance",
}: {
  page?: number;
  pageSize?: number;
  filters?: any;
  sortBy?: string;
}): Promise<TrainersResponse> {
  await wait(700);

  const module = await import("@/data/trainer.json");
  const raw: any = module.items || module.default?.items || module;

  // apply simple filters
  let list = raw.slice();

  if (filters.location) {
    const loc = String(filters.location).toLowerCase();
    list = list.filter((t: any) => t.location.toLowerCase().includes(loc));
  }

  if (filters.specialties && filters.specialties.length) {
    list = list.filter((t: any) =>
      filters.specialties.some((s: string) => t.specialties.includes(s))
    );
  }

  if (filters.priceMin != null) {
    list = list.filter((t: any) => t.price >= filters.priceMin);
  }
  if (filters.priceMax != null) {
    list = list.filter((t: any) => t.price <= filters.priceMax);
  }

  // sorting examples
  if (sortBy === "price_asc") list.sort((a: any, b: any) => a.price - b.price);
  else if (sortBy === "price_desc") list.sort((a: any, b: any) => b.price - a.price);
  else if (sortBy === "rating") list.sort((a: any, b: any) => b.rating - a.rating);

  const totalResults = list.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize;
  const data = list.slice(start, start + pageSize);

  return {
    data,
    pagination: {
      currentPage,
      pageSize,
      totalPages,
      totalResults,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    },
  };
}


/** fetch profile & revenue */
export async function getTrainerProfile(trainerId?: number): Promise<ProfileData> {
  await wait(800);
  const module = await import("../data/profile.json");
  const data: ProfileData = module.default || module;
  // (optionally filter by trainerId)
  return data;
}
