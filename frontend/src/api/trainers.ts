import api from "./axios";

export interface Specialisation {
  id: number;
  name: string;
}

export interface TrainerProfile {
  id: number;
  user_name: string;
  email: string;
  phone: string;
  city?: string;
  state?: string;
  years_of_experience: number;
  hourly_rate: number;
  professional_title?: string;
  bio?: string;
  profile_pic?: {
    id: number;
    file: string;
    uploaded_at: string;
  };
  certifications?: Array<{
    id: number;
    file: string;
    uploaded_at: string;
  }>;
  specialisations?: Specialisation[];
  videos?: string[];
  created_at: string;
}

export interface TrainerProfileUpdate {
  phone: string;
  city?: string;
  state?: string;
  years_of_experience: number;
  hourly_rate: number;
  professional_title?: string;
  bio?: string;
  specialisations?: number[];
  videos?: string[];
}

export interface TrainerFilters {
  location?: string;
  specialties?: string[];
  priceMin?: number;
  priceMax?: number;
  expMin?: number;
  expMax?: number;
}

export interface TrainerListParams {
  page?: number;
  pageSize?: number;
  filters?: TrainerFilters;
  sortBy?: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface TrainerListResponse {
  data: TrainerProfile[];
  pagination: PaginationInfo;
  count: number;
}

// Get all trainers with filters and pagination
export const getTrainers = async (): Promise<TrainerProfile[]> => {
  const response = await api.get("/api/trainers/list/");
  return response.data;
};

// Get featured trainers
export const getFeaturedTrainers = async (): Promise<TrainerProfile[]> => {
  const response = await api.get("/api/trainers/featured/");
  return response.data;
};

// Fetch trainers with filters and pagination
export const fetchTrainers = async (params: TrainerListParams = {}): Promise<TrainerListResponse> => {
  const { page = 1, pageSize = 10, filters = {}, sortBy = 'relevance' } = params;

  // Build query parameters
  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  queryParams.append('page_size', pageSize.toString());
  queryParams.append('sortBy', sortBy);

  // Add filters
  if (filters.location) {
    queryParams.append('location', filters.location);
  }
  if (filters.specialties && filters.specialties.length > 0) {
    filters.specialties.forEach(spec => {
      queryParams.append('specialties[]', spec);
    });
  }
  if (filters.priceMin !== undefined) {
    queryParams.append('priceMin', filters.priceMin.toString());
  }
  if (filters.priceMax !== undefined) {
    queryParams.append('priceMax', filters.priceMax.toString());
  }
  if (filters.expMin !== undefined) {
    queryParams.append('expMin', filters.expMin.toString());
  }
  if (filters.expMax !== undefined) {
    queryParams.append('expMax', filters.expMax.toString());
  }

  const response = await api.get(`/api/trainers/list/?${queryParams.toString()}`);
  return response.data;
};

// Get single trainer profile
export const getTrainerProfile = async (id: number): Promise<TrainerProfile> => {
  const response = await api.get(`/api/trainers/${id}/`);
  return response.data;
};

// Update trainer profile
export const updateTrainerProfile = async (
  id: number,
  data: TrainerProfileUpdate
): Promise<TrainerProfile> => {
  const response = await api.patch(`/api/trainers/${id}/update/`, data);
  return response.data;
};

// Get all specialisations
export const getSpecialisations = async (): Promise<Specialisation[]> => {
  const response = await api.get("/api/trainers/specialisations/");
  return response.data;
};
