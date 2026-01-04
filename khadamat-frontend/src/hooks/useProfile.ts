// @ts-nocheck
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useAuth } from '@/lib/auth-context';
import apiClientInstance from '@/lib/api-client';
import { User, ClientProfile, ProProfile } from '@/types/api';
import { authManager } from '@/lib/auth';

// Query keys for profile data
export const PROFILE_QUERY_KEYS = {
  profile: ['profile'] as const,
  clientProfile: ['profile', 'client'] as const,
  proProfile: ['profile', 'pro'] as const,
  user: ['user'] as const,
} as const;

// Hook for fetching user profile with caching
export const useProfile = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  return useQuery({
    queryKey: PROFILE_QUERY_KEYS.profile,
    queryFn: async (): Promise<User> => {
      const response = await apiClientInstance.client.get('/user/profile');
      const profileUser = response.data as User;
      authManager.setUser(profileUser);
      return profileUser;
    },
    enabled: isAuthenticated && !isLoading,
    initialData: user ?? undefined,
    staleTime: 2 * 60 * 1000, // 2 minutes - profile data changes infrequently
    gcTime: 10 * 60 * 1000, // 10 minutes cache
    retry: (failureCount, error) => {
      // Don't retry on 401 (unauthorized)
      if (error instanceof AxiosError && error.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

// Hook for fetching client profile specifically
export const useClientProfile = () => {
  const { data: user } = useProfile();

  return useQuery({
    queryKey: PROFILE_QUERY_KEYS.clientProfile,
    queryFn: async (): Promise<ClientProfile | null> => {
      if (!user?.clientProfile) return null;
      // In a real app, this might fetch additional client-specific data
      return user.clientProfile;
    },
    enabled: !!user?.clientProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes cache
  });
};

// Hook for fetching pro profile specifically
export const useProProfile = () => {
  const { data: user } = useProfile();

  return useQuery({
    queryKey: PROFILE_QUERY_KEYS.proProfile,
    queryFn: async (): Promise<ProProfile | null> => {
      if (!user?.proProfile) return null;
      // In a real app, this might fetch additional pro-specific data
      return user.proProfile;
    },
    enabled: !!user?.proProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes cache
  });
};

// Mutation for updating client profile
export const useUpdateClientProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData: Partial<ClientProfile>) => {
      // In a real app, this would call an API endpoint
      return authService.updateClientProfile(profileData);
    },
    onSuccess: (updatedProfile) => {
      // Update the cached profile data
      queryClient.setQueryData(PROFILE_QUERY_KEYS.clientProfile, updatedProfile);
      // Also update the main profile
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.profile });
    },
  });
};

// Mutation for updating pro profile
export const useUpdateProProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData: Partial<ProProfile>) => {
      // In a real app, this would call an API endpoint
      return authService.updateProProfile(profileData);
    },
    onSuccess: (updatedProfile) => {
      // Update the cached profile data
      queryClient.setQueryData(PROFILE_QUERY_KEYS.proProfile, updatedProfile);
      // Also update the main profile
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.profile });
    },
  });
};
