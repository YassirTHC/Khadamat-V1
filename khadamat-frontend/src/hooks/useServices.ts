// @ts-nocheck
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Query keys for services
export const SERVICES_QUERY_KEYS = {
  categories: ['services', 'categories'] as const,
  category: (id: string) => ['services', 'category', id] as const,
  servicesByCity: (cityId?: string) => ['services', 'byCity', cityId] as const,
  popularServices: ['services', 'popular'] as const,
} as const;

// Hook for fetching service categories with caching
export const useServiceCategories = () => {
  return useQuery({
    queryKey: SERVICES_QUERY_KEYS.categories,
    queryFn: async () => {
      const data = await api.getCategories();
      return data.filter((cat: any) => cat.isActive);
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - categories don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes cache
    retry: 2,
  });
};

// Hook for fetching services by city with caching
export const useServicesByCity = (cityId?: string) => {
  return useQuery({
    queryKey: SERVICES_QUERY_KEYS.servicesByCity(cityId),
    queryFn: async () => {
      return api.getServicesByCity(cityId);
    },
    enabled: !!cityId, // Only run if cityId is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes cache
    retry: 2,
  });
};

// Hook for fetching popular services with caching
export const usePopularServices = () => {
  return useQuery({
    queryKey: SERVICES_QUERY_KEYS.popularServices,
    queryFn: async () => {
      return api.getPopularServices();
    },
    staleTime: 15 * 60 * 1000, // 15 minutes - popular services change less frequently
    gcTime: 60 * 60 * 1000, // 1 hour cache
    retry: 2,
  });
};

// Hook for fetching a specific service category
export const useServiceCategory = (categoryId: string) => {
  return useQuery({
    queryKey: SERVICES_QUERY_KEYS.category(categoryId),
    queryFn: async () => {
      return api.getCategoryById(categoryId);
    },
    enabled: !!categoryId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes cache
    retry: 2,
  });
};
