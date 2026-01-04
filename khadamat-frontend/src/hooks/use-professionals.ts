// @ts-nocheck
import { useState, useEffect } from 'react';
import { type Professional } from '@/lib/mocks/services-mocks';
import api from '@/lib/api-client';
import { transformProfessional, type BackendProfessional } from '@/lib/api/transformers';

export interface ProsFiltersState {
  cityId?: string;
  categoryId?: string;
  search?: string;
  minRating?: number;
  verified?: boolean;
  // premium flag is not supported by backend, keep for UI state only (not sent)
  premium?: boolean;
  page?: number;
  limit?: number;
}

export const useProfessionals = (filters: ProsFiltersState) => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [pagination, setPagination] = useState<{
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProfessionals = async () => {
      setIsLoading(true);

      try {
        const response = await api.getPros({
          cityId: filters.cityId,
          categoryId: filters.categoryId,
          search: filters.search,
          minRating: filters.minRating,
          verified: filters.verified,
          premium: filters.premium,
          page: filters.page || 1,
          // Montrer plus de pros par défaut
          limit: filters.limit || 50,
        });

        type ProsResponseShape = {
          professionals?: unknown[];
          items?: unknown[];
          total?: number;
          page?: number;
          pageSize?: number;
          totalPages?: number;
          hasNext?: boolean;
          hasPrev?: boolean;
        };

        const normalizedResponse = response as ProsResponseShape | unknown[];
        const prosArray: unknown[] = Array.isArray(normalizedResponse)
          ? normalizedResponse
          : normalizedResponse.professionals ?? normalizedResponse.items ?? [];

        const transformedProfessionals: Professional[] = Array.isArray(prosArray)
          ? prosArray.map((pro) => transformProfessional(pro as BackendProfessional, filters.categoryId))
          : [];

        const total =
          (!Array.isArray(normalizedResponse) && normalizedResponse.total) ?? transformedProfessionals.length ?? 0;
        const page = (!Array.isArray(normalizedResponse) && normalizedResponse.page) ?? 1;
        const pageSize =
          (!Array.isArray(normalizedResponse) && normalizedResponse.pageSize) ?? transformedProfessionals.length ?? 0;
        const totalPages =
          (!Array.isArray(normalizedResponse) && normalizedResponse.totalPages) ??
          (pageSize ? Math.ceil(total / pageSize) : 1);
        const hasNext = (!Array.isArray(normalizedResponse) && normalizedResponse.hasNext) ?? page < totalPages;
        const hasPrev = (!Array.isArray(normalizedResponse) && normalizedResponse.hasPrev) ?? page > 1;

        setProfessionals(transformedProfessionals);
        setPagination({
          total,
          page,
          pageSize,
          totalPages,
          hasNext,
          hasPrev,
        });
      } catch (error) {
        console.error('Error fetching professionals:', error);
        setProfessionals([]);
        setPagination({
          total: 0,
          page: filters.page || 1,
          pageSize: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfessionals();
  }, [filters]);

  return { professionals, pagination, isLoading };
};
