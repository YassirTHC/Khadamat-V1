import axios from 'axios';
import { authManager } from './auth';
import { broadcastAuthEvent } from './auth-sync';
import { BookingStatus, PlatformStats, ProProfile, CreateBookingPayload } from '@/types/api';

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type ListResponse<T> =
  | T[]
  | { data: T[] }
  | { professionals: T[] }
  | PaginatedResponse<T>;

export type GetProsParams = {
  q?: string;
  search?: string;
  categoryId?: string;
  cityId?: string;
  minRating?: number;
  isVerified?: boolean;
  verified?: boolean;
  premium?: boolean;
  page?: number;
  limit?: number;
};

export type ProsListNormalized<T = ProProfile> = {
  professionals: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type CommunicationEventPayload = {
  channel: 'WHATSAPP' | 'SMS';
  proId: string;
  bookingId?: string;
  message?: string;
  metadata?: Record<string, any>;
};

function readAccessToken(): string | null {
  return authManager.getAccessToken();
}

function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    // Browser: relative path
    return '/api';
  } else {
    // Server/SSR: absolute path
    const defaultHost = process.env.API_HOST || 'localhost';
    const defaultPort = process.env.API_PORT || '4000';
    const backendOrigin =
      process.env.BACKEND_ORIGIN ||
      process.env.NEXT_PUBLIC_API_URL ||
      `http://${defaultHost}:${defaultPort}`;
    return `${backendOrigin}/api`;
  }
}

// Configuration
const axiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

// Dedicated refresh client without interceptors to avoid loops
const refreshClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// In-memory flag to prevent multiple concurrent refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;
const isBrowser = typeof window !== 'undefined';
let refreshDisabled = false;

export function disableRefresh(broadcast = false) {
  refreshDisabled = true;
  authManager.clearTokens();
  if (broadcast) {
    broadcastAuthEvent('REFRESH_FAILED');
  }
}

export function enableRefresh() {
  refreshDisabled = false;
}

// Unified refresh helper
async function refreshAccessToken(): Promise<string | null> {
  if (!isBrowser) return null;
  if (refreshDisabled) return null;

  if (isRefreshing && refreshPromise) {
    await refreshPromise;
    return readAccessToken();
  }

  isRefreshing = true;
  try {
    refreshPromise = refreshClient.post('/auth/refresh');
    const refreshResponse = await refreshPromise;
    const { access_token } = refreshResponse.data || {};
    if (access_token) {
      authManager.setAccessToken(access_token);
      refreshDisabled = false;
      return access_token;
    }
    disableRefresh(true);
    return null;
  } catch (error: any) {
    disableRefresh(true);
    throw error;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
}

// Intercepteur Token (assure un token avant l'appel)
axiosInstance.interceptors.request.use(async (config) => {
  if (isBrowser && !refreshDisabled) {
    let token = readAccessToken();
    if (!token) {
      try {
        token = await refreshAccessToken();
      } catch {
        // refresh failed, let the request hit backend and bubble 401
      }
    }
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur Erreurs (Pour éviter les crashs silencieux)
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    // Handle abort/canceled errors without logging
    if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
      return Promise.reject(error);
    }

    const method = error.config?.method?.toUpperCase() || 'UNKNOWN';
    const url = error.config?.url || 'UNKNOWN';
    const status = error.response?.status || 'UNKNOWN';
    const data = error.response?.data;
    const message = (!data || (typeof data === 'object' && Object.keys(data).length === 0))
      ? `${error.message} (${status})`
      : data;

    // Handle 401 - attempt refresh once
    if (status === 401 && isBrowser && !error.config._retry && !refreshDisabled) {
      // Avoid infinite loops on refresh endpoint
      if (error.config?.url?.includes('/auth/refresh')) {
        disableRefresh();
        return Promise.reject(error);
      }
      try {
        if (isRefreshing && refreshPromise) {
          await refreshPromise;
        } else {
          await refreshAccessToken();
        }
        const newToken = readAccessToken();
        if (newToken) {
          error.config._retry = true;
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(error.config);
        }
      } catch (refreshError) {
        // Refresh failed - logout silently without forcing reload to avoid loops
        console.log('Refresh failed, logging out silently');
        disableRefresh();
        return Promise.reject(refreshError);
      }
    }

    if (status >= 500) {
      console.error(`API ${method} ${url} ${status}: ${message}`);
    } else if (status === 429) {
      console.warn(`API ${method} ${url} ${status}: ${message}`);
    }
    // No logging for other statuses

    return Promise.reject(error);
  }
);

// ==========================================
// 1. SOUS-MODULES EXPORTÉS (Pour les imports nommés)
// ==========================================

export const bookingApi = {
  create: async (data: CreateBookingPayload) => {
    const response = await axiosInstance.post('/bookings', data);
    return response.data;
  },
  getMyBookings: async () => {
    const response = await axiosInstance.get('/bookings');
    return response.data;
  },
  updateStatus: async (id: string, status: BookingStatus) => {
    const response = await axiosInstance.patch(`/bookings/${id}/status`, { status });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await axiosInstance.get(`/bookings/${id}`);
    return response.data;
  }
};

export const proApi = {
  getProfile: async (): Promise<ProProfile> => {
    const response = await axiosInstance.get('/pro/profile');
    return response.data;
  },
  updateProfile: async (data: any) => {
    const response = await axiosInstance.put('/pro/profile', data);
    return response.data;
  },
  upgradePremium: async (subscriptionPlanId: string) => {
    const response = await axiosInstance.post('/subscriptions', {
      subscriptionPlanId,
      autoRenew: true,
    });
    return response.data;
  },
  getStats: async () => {
    const response = await axiosInstance.get('/pro/stats');
    return response.data;
  },
  getServices: async () => {
    const response = await axiosInstance.get('/pro/services');
    return response.data;
  },
  updateService: async (id: string, data: any) => {
    const response = await axiosInstance.put(`/pro/services/${id}`, data);
    return response.data;
  },
  createService: async (data: any) => {
    const response = await axiosInstance.post('/pro/services', data);
    return response.data;
  },
  deleteService: async (id: string) => {
    const response = await axiosInstance.delete(`/pro/services/${id}`);
    return response.data;
  },
  getProById: async (id: string): Promise<ProProfile> => {
    const response = await axiosInstance.get(`/pros/${id}`);
    return response.data;
  }
};

// ✅ CORRECTION : Ajout de locationsApi manquant
export const locationsApi = {
  getCities: async () => {
    const response = await axiosInstance.get('/locations/cities');
    return response.data;
  },
  getCategories: async () => {
    const response = await axiosInstance.get('/services/categories');
    return response.data;
  }
};

const updateProfileFn = async (data: any) => {
  const response = await axiosInstance.patch('/user/profile', data);
  return response.data;
};

export const userApi = {
  getProfile: async () => {
    const response = await axiosInstance.get('/user/profile');
    return response.data;
  },
  updateProfile: updateProfileFn,
  updateUserProfile: updateProfileFn,
  changePassword: async (data: any) => {
    const response = await axiosInstance.patch('/user/change-password', data);
    return response.data;
  }
};

const communicationApi = {
  create: async (payload: CommunicationEventPayload) => {
    const response = await axiosInstance.post('/communication-events', payload);
    return response.data;
  },
};

// ==========================================
// 2. EXPORT PAR DÉFAUT (apiClientInstance)
// ==========================================

const apiClientInstance = {
  client: axiosInstance,

  // --- STATS HERO (Corrige le +0 Pros) ---
  getPlatformStats: async (): Promise<PlatformStats> => {
    try {
      const response = await axiosInstance.get('/platform/stats');
      return response.data;
    } catch (error) {
      console.warn("Impossible de charger les stats plateforme, utilisation des valeurs par défaut.");
      return { totalPros: 12, totalClients: 150, totalBookings: 45, averageRating: 4.8 };
    }
  },

  // --- GLOBAL ---
  getProfile: async () => {
    const response = await axiosInstance.get('/user/profile');
    return response.data;
  },
  updateProfile: async (data: any) => {
    const response = await axiosInstance.patch('/user/profile', data);
    return response.data;
  },
  
  // Raccourcis pour compatibilité
  getCategories: locationsApi.getCategories,
  getCities: locationsApi.getCities,

  // Services API
  getServices: async (params?: {
    q?: string;
    categoryId?: string;
    cityId?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    verified?: boolean;
    premium?: boolean;
    sort?: string;
    order?: string;
    page?: number;
    limit?: number;
  }, config?: { signal?: AbortSignal }) => {
    const queryParams = new URLSearchParams();
    if (params?.q) queryParams.set('q', params.q);
    if (params?.categoryId) queryParams.set('categoryId', params.categoryId);
    if (params?.cityId) queryParams.set('cityId', params.cityId);
    if (params?.minPrice !== undefined) queryParams.set('minPrice', params.minPrice.toString());
    if (params?.maxPrice !== undefined) queryParams.set('maxPrice', params.maxPrice.toString());
    if (params?.minRating !== undefined) queryParams.set('minRating', params.minRating.toString());
    if (params?.verified !== undefined) queryParams.set('verified', params.verified.toString());
    if (params?.premium !== undefined) queryParams.set('premium', params.premium.toString());
    if (params?.sort) queryParams.set('sort', params.sort);
    if (params?.order) queryParams.set('order', params.order);
    if (params?.page !== undefined) queryParams.set('page', params.page.toString());
    if (params?.limit !== undefined) queryParams.set('limit', params.limit.toString());

    const response = await axiosInstance.get(`/services?${queryParams.toString()}`, config);
    return response.data;
  },

  getPros: async (params?: GetProsParams): Promise<ProsListNormalized<ProProfile>> => {
    const queryParams = new URLSearchParams();

    const searchValue = params?.search ?? params?.q;
    if (searchValue) queryParams.set('q', searchValue);
    if (params?.categoryId) queryParams.set('categoryId', params.categoryId);
    if (params?.cityId) queryParams.set('cityId', params.cityId);
    if (params?.minRating !== undefined) queryParams.set('minRating', params.minRating.toString());
    if (params?.limit !== undefined) queryParams.set('limit', params.limit.toString());
    if (params?.page !== undefined) queryParams.set('page', params.page.toString());

    const verifiedVal = params?.isVerified ?? params?.verified;
    if (verifiedVal === true) {
      queryParams.set('verified', 'true');
    }
    // ne pas filtrer si false par défaut
    if (params?.premium === true) {
      queryParams.set('premium', 'true');
    }

    const qs = queryParams.toString();
    const response = await axiosInstance.get(qs ? `/pros?${qs}` : '/pros');
    const data = response.data;

    // Normalize shape to always expose { professionals, total, page, totalPages, pageSize, hasNext, hasPrev }
    if (Array.isArray(data)) {
      return {
        professionals: data,
        total: data.length,
        page: 1,
        pageSize: data.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      } as ProsListNormalized;
    }

    if (data?.items) {
      return {
        professionals: data.items,
        total: data.total ?? data.items.length ?? 0,
        page: data.page ?? 1,
        pageSize: data.pageSize ?? data.items.length ?? 0,
        totalPages: data.totalPages ?? 1,
        hasNext: data.hasNext ?? false,
        hasPrev: data.hasPrev ?? false,
      } as ProsListNormalized;
    }

    if (data?.professionals) {
      return {
        professionals: data.professionals,
        total: data.total ?? data.professionals.length ?? 0,
        page: data.page ?? 1,
        pageSize: data.pageSize ?? data.professionals.length ?? 0,
        totalPages: data.totalPages ?? 1,
        hasNext: data.hasNext ?? false,
        hasPrev: data.hasPrev ?? false,
      } as ProsListNormalized;
    }

    // Fallback: return as-is
    return data;
  },

  // Accès aux sous-modules
  booking: bookingApi,
  pro: proApi,
  locations: locationsApi,
  user: userApi,
  communication: communicationApi,
};

export default apiClientInstance;
export { apiClientInstance };
