import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ProProfile, User, ServiceCategory, City, ProService, Booking, ClientProfile } from '@/types/api';

// Configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to inject JWT token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('khadamat_access_token');
    console.log('🔑 Token injecté:', token ? 'OUI' : 'NON');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('👉 API Request:', (config.method || 'GET').toUpperCase(), config.url, 'Token:', config.headers.Authorization || 'No token');
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('✅ API Response:', response.status, response.data);
    return response;
  },
  (error: AxiosError) => {
    console.log('❌ API Error:', error.response?.status, error.message, error.response?.data);
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - token expired or invalid
          localStorage.removeItem('khadamat_access_token');
          // Redirect to login or dispatch logout action
          console.error('Unauthorized access - token removed');
          break;
        case 403:
          console.error('Forbidden access');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Internal server error');
          break;
        default:
          console.error(`API Error: ${status}`, data);
      }
    } else if (error.request) {
      // Network error
      console.error('Network error - please check your connection');
    } else {
      console.error('Request error:', error.message);
    }

    return Promise.reject(error);
  }
);

// API Client class
class ApiClient {
  // Professionals
  async getPros(filters?: {
    cityId?: string;
    category?: string;
    search?: string;
    minRating?: number;
    isVerified?: boolean;
    page?: number;
    limit?: number;
  }): Promise<ProProfile[]> {
    const params = new URLSearchParams();
    if (filters?.cityId) params.append('city', filters.cityId);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.minRating !== undefined) params.append('minRating', filters.minRating.toString());
    if (filters?.isVerified !== undefined) params.append('isVerified', filters.isVerified.toString());
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await apiClient.get<ProProfile[]>(`/pros?${params.toString()}`);
    return response.data;
  }

  async getProById(id: string): Promise<ProProfile> {
    const response = await apiClient.get<ProProfile>(`/pros/${id}`);
    return response.data;
  }

  // Featured Professionals
  async getFeaturedProfessionals(): Promise<ProProfile[]> {
    const response = await apiClient.get<ProProfile[]>('/pros/featured');
    return response.data;
  }

  // Platform Stats
  async getPlatformStats(): Promise<{
    totalUsers: number;
    totalPros: number;
    totalBookings: number;
    activeBookings: number;
  }> {
    const response = await apiClient.get<{
      totalUsers: number;
      totalPros: number;
      totalBookings: number;
      activeBookings: number;
    }>('/stats/platform');
    return response.data;
  }

  // Services by City
  async getServicesByCity(): Promise<{
    city: City;
    services: ServiceCategory[];
    prosCount: number;
  }[]> {
    const response = await apiClient.get<{
      city: City;
      services: ServiceCategory[];
      prosCount: number;
    }[]>('/services/by-city');
    return response.data;
  }

  // Search Services
  async searchServices(query: string): Promise<ServiceCategory[]> {
    const response = await apiClient.get<ServiceCategory[]>('/services/search', {
      params: { q: query }
    });
    return response.data;
  }

  // Bookings
  async createBooking(data: {
    proId: string;
    serviceCategoryId: string;
    cityId: string;
    description: string;
    photos?: string[];
    timeSlot: string;
    priceEstimate?: number;
  }): Promise<void> {
    await apiClient.post('/bookings', data);
  }

  // Search professionals/services
  async search(filters?: {
    cityId?: string;
    categoryId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<any> {
    return this.getPros(filters);
  }

  // Locations
  async getCities(): Promise<City[]> {
    const response = await apiClient.get<City[]>('/locations/cities');
    return response.data;
  }

  async getCategories(): Promise<ServiceCategory[]> {
    const response = await apiClient.get<ServiceCategory[]>('/locations/categories');
    return response.data;
  }

  // Pro Dashboard
  async getProServices(proId: string): Promise<ProService[]> {
    const response = await apiClient.get<ProService[]>(`/pros/${proId}/services`);
    return response.data;
  }

  async getProBookings(proId: string): Promise<Booking[]> {
    const response = await apiClient.get<Booking[]>(`/pros/${proId}/bookings`);
    return response.data;
  }

  // Client Bookings
  async getMyBookings(): Promise<Booking[]> {
    const response = await apiClient.get<Booking[]>('/bookings/my');
    return response.data;
  }
}

// Export singleton instance
const apiClientInstance = new ApiClient();

// Export the instance as default and also export the raw axios instance
export default apiClientInstance;
export { apiClient };
