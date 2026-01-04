// @ts-nocheck
import { useState, useEffect } from 'react';
import { type Professional } from '@/lib/mocks/services-mocks';
import api from '@/lib/api-client';

interface ProsFiltersState {
  cityId?: string;
  serviceCategoryId?: string;
  search?: string;
  minRating?: number;
  onlyVerified?: boolean;
  onlyPremium?: boolean;
  page?: number;
}

export const useProfessionals = (filters: ProsFiltersState) => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProfessionals = async () => {
      setIsLoading(true);

      try {
        const response = await api.getPros({
          cityId: filters.cityId,
          category: filters.serviceCategoryId,
          isVerified: filters.onlyVerified,
        });
        // Map ProProfile[] to Professional[]
        const mappedProfessionals = response.professionals.map(pro => ({
          id: pro.id,
          fullName: `${pro.firstName} ${pro.lastName}`,
          cityId: pro.cityId || '',
          serviceCategoryId: '', // Not available in ProProfile
          title: pro.profession || 'Professionnel',
          shortBio: pro.bio || '',
          rating: pro.averageRating || 0,
          reviewCount: pro.totalReviews,
          isVerified: pro.isVerifiedPro,
          isPremium: pro.isPremium,
          startingPrice: 0, // Not available in ProProfile
          experienceYears: 0, // Not available in ProProfile
          responseTime: 'Répond rapidement',
          badgeLabels: pro.isVerifiedPro ? ['Vérifié'] : [],
        }));
        setProfessionals(mappedProfessionals);
      } catch (error) {
        console.error('Error fetching professionals:', error);
        setProfessionals([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchProfessionals, 800);

    return () => clearTimeout(timeoutId);
  }, [filters]);

  return { professionals, isLoading };
};
