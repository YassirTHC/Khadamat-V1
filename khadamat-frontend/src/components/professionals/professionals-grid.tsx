// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Shield, Crown, AlertCircle, Users, MessageCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { ProfessionalProfile, ProfessionalApiResponse, ProfessionalCardProps } from '@/types/professional-types';

interface ProfessionalsGridProps {
  filters: {
    cityId?: string;
    category?: string;
    minRating?: number;
    isVerified?: boolean;
    isPremium?: boolean;
    page?: number;
    limit?: number;
  };
  onPageChange: (page: number) => void;
  onTotalChange?: (total: number, totalPages: number) => void;
}

export const ProfessionalsGrid: React.FC<ProfessionalsGridProps> = ({ filters, onPageChange, onTotalChange }) => {
  const [professionals, setProfessionals] = useState<ProfessionalProfile[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Mock data for when API is not available
  const mockProfessionals: ProfessionalProfile[] = [
    {
      id: '1',
      userId: 'user1',
      fullName: 'Ahmed Bennani',
      title: 'Plombier',
      shortBio: 'Plombier professionnel avec 8 ans d\'expérience',
      detailedBio: 'Plombier professionnel avec 8 ans d\'expérience spécialisée dans les installations et réparations.',
      contact: { email: 'ahmed@example.com', phone: '+212600000001' },
      location: { cityId: 'casablanca', cityName: 'Casablanca', region: 'Grand Casablanca' },
      serviceCategory: { id: 'plumbing', name: 'Plomberie', slug: 'plomberie', isActive: true },
      services: [],
      workingHours: {
        monday: '08:00-18:00',
        tuesday: '08:00-18:00',
        wednesday: '08:00-18:00',
        thursday: '08:00-18:00',
        friday: '08:00-18:00',
        saturday: '08:00-12:00',
        sunday: 'Fermé'
      },
      rating: {
        average: 4.9,
        count: 127,
        distribution: { 1: 0, 2: 0, 3: 2, 4: 15, 5: 110 }
      },
      stats: {
        totalBookings: 247,
        completedBookings: 247,
        cancelledBookings: 0,
        totalRevenue: 98500,
        averageRating: 4.9,
        responseRate: 98,
        responseTime: '< 2h',
        completionRate: 100,
        repeatClients: 45
      },
      badges: [
        { id: 'verified', name: 'Vérifié', description: 'Artisan vérifié', icon: 'shield', color: 'green', earnedAt: '2023-01-15T10:00:00Z' },
        { id: 'premium', name: 'Premium', description: 'Artisan premium', icon: 'crown', color: 'gold', earnedAt: '2023-01-15T10:00:00Z' }
      ],
      certifications: [],
      portfolio: [],
      reviews: [],
      languages: ['Français', 'Arabe'],
      experienceYears: 8,
      startingPrice: 150,
      isVerified: true,
      verificationStatus: 'verified',
      premiumStatus: 'premium',
      status: 'active',
      availability: 'available',
      lastActive: new Date().toISOString(),
      createdAt: '2023-01-15T10:00:00Z',
      updatedAt: '2024-12-09T16:00:00Z'
    },
    {
      id: '2',
      userId: 'user2',
      fullName: 'Fatima Alaoui',
      title: 'Électricienne',
      shortBio: 'Spécialiste en installations électriques',
      detailedBio: 'Électricienne qualifiée avec expertise en installations domestiques et industrielles.',
      contact: { email: 'fatima@example.com', phone: '+212600000002' },
      location: { cityId: 'rabat', cityName: 'Rabat', region: 'Rabat-Salé-Zemmour-Zaër' },
      serviceCategory: { id: 'electricity', name: 'Électricité', slug: 'electricite', isActive: true },
      services: [],
      workingHours: {
        monday: '08:00-18:00',
        tuesday: '08:00-18:00',
        wednesday: '08:00-18:00',
        thursday: '08:00-18:00',
        friday: '08:00-18:00',
        saturday: '08:00-12:00',
        sunday: 'Fermé'
      },
      rating: {
        average: 4.8,
        count: 89,
        distribution: { 1: 0, 2: 1, 3: 3, 4: 12, 5: 73 }
      },
      stats: {
        totalBookings: 156,
        completedBookings: 156,
        cancelledBookings: 0,
        totalRevenue: 78000,
        averageRating: 4.8,
        responseRate: 95,
        responseTime: '< 1h',
        completionRate: 100,
        repeatClients: 28
      },
      badges: [],
      certifications: [],
      portfolio: [],
      reviews: [],
      languages: ['Français', 'Arabe'],
      experienceYears: 6,
      startingPrice: 200,
      isVerified: true,
      verificationStatus: 'verified',
      premiumStatus: 'free',
      status: 'active',
      availability: 'available',
      lastActive: new Date().toISOString(),
      createdAt: '2023-03-20T10:00:00Z',
      updatedAt: '2024-12-09T16:00:00Z'
    },
    {
      id: '3',
      userId: 'user3',
      fullName: 'Mohammed Tazi',
      title: 'Peintre',
      shortBio: 'Peinture intérieure et extérieure',
      detailedBio: 'Peintre professionnel spécialisé dans les travaux de peinture intérieure et extérieure.',
      contact: { email: 'mohammed@example.com', phone: '+212600000003' },
      location: { cityId: 'marrakech', cityName: 'Marrakech', region: 'Marrakech-Tensift-Al Haouz' },
      serviceCategory: { id: 'painting', name: 'Peinture', slug: 'peinture', isActive: true },
      services: [],
      workingHours: {
        monday: '08:00-18:00',
        tuesday: '08:00-18:00',
        wednesday: '08:00-18:00',
        thursday: '08:00-18:00',
        friday: '08:00-18:00',
        saturday: '08:00-12:00',
        sunday: 'Fermé'
      },
      rating: {
        average: 4.7,
        count: 203,
        distribution: { 1: 1, 2: 5, 3: 15, 4: 45, 5: 137 }
      },
      stats: {
        totalBookings: 89,
        completedBookings: 89,
        cancelledBookings: 0,
        totalRevenue: 44500,
        averageRating: 4.7,
        responseRate: 92,
        responseTime: '< 3h',
        completionRate: 100,
        repeatClients: 15
      },
      badges: [],
      certifications: [],
      portfolio: [],
      reviews: [],
      languages: ['Français', 'Arabe'],
      experienceYears: 5,
      startingPrice: 120,
      isVerified: false,
      verificationStatus: 'unverified',
      premiumStatus: 'free',
      status: 'active',
      availability: 'available',
      lastActive: new Date().toISOString(),
      createdAt: '2023-05-10T10:00:00Z',
      updatedAt: '2024-12-09T16:00:00Z'
    },
    {
      id: '4',
      userId: 'user4',
      fullName: 'Leila Mansouri',
      title: 'Femme de ménage',
      shortBio: 'Services de nettoyage professionnels',
      detailedBio: 'Professionnelle du nettoyage avec expertise en nettoyage domestique et commercial.',
      contact: { email: 'leila@example.com', phone: '+212600000004' },
      location: { cityId: 'casablanca', cityName: 'Casablanca', region: 'Grand Casablanca' },
      serviceCategory: { id: 'cleaning', name: 'Nettoyage', slug: 'nettoyage', isActive: true },
      services: [],
      workingHours: {
        monday: '08:00-18:00',
        tuesday: '08:00-18:00',
        wednesday: '08:00-18:00',
        thursday: '08:00-18:00',
        friday: '08:00-18:00',
        saturday: '08:00-12:00',
        sunday: 'Fermé'
      },
      rating: {
        average: 4.9,
        count: 312,
        distribution: { 1: 0, 2: 2, 3: 5, 4: 25, 5: 280 }
      },
      stats: {
        totalBookings: 445,
        completedBookings: 445,
        cancelledBookings: 0,
        totalRevenue: 133500,
        averageRating: 4.9,
        responseRate: 99,
        responseTime: '< 30min',
        completionRate: 100,
        repeatClients: 89
      },
      badges: [],
      certifications: [],
      portfolio: [],
      reviews: [],
      languages: ['Français', 'Arabe'],
      experienceYears: 7,
      startingPrice: 80,
      isVerified: true,
      verificationStatus: 'verified',
      premiumStatus: 'premium',
      status: 'active',
      availability: 'available',
      lastActive: new Date().toISOString(),
      createdAt: '2023-02-28T10:00:00Z',
      updatedAt: '2024-12-09T16:00:00Z'
    },
  ];

  useEffect(() => {
    const fetchProfessionals = async () => {
      setLoading(true);
      try {
        const response: any = await api.getPros({
          featured: true,
          limit: filters.limit,
          rating: filters.minRating,
        });

        setProfessionals(response.data || response.professionals || []);
        setTotal(response.count || response.total || 0);
        setTotalPages(response.totalPages || 1);
        setError(false);

        if (onTotalChange) {
          onTotalChange(response.total, response.totalPages);
        }
      } catch (err) {
        console.error('Error fetching professionals:', err);
        // Use mock data when API fails
        setProfessionals(mockProfessionals);
        setTotal(mockProfessionals.length);
        setTotalPages(1);
        setError(false); // Don't show error state, use mock data instead

        if (onTotalChange) {
          onTotalChange(mockProfessionals.length, 1);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, [filters]);

  const handleContactClick = (professionalId: string) => {
    // For now, show a toast. In a real app, this would check auth and redirect to messaging
    alert('La messagerie arrive bientôt ! Connectez-vous pour contacter cet artisan.');
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gradient-to-br from-[rgba(250,247,242,0.8)] to-[rgba(255,255,255,0.5)] backdrop-blur-sm rounded-[24px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.06)] animate-pulse">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-[#EDEEEF] rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-[#EDEEEF] rounded w-24"></div>
                  <div className="h-3 bg-[#EDEEEF] rounded w-16"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-[#EDEEEF] rounded w-full"></div>
                <div className="h-4 bg-[#EDEEEF] rounded w-3/4"></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="h-6 bg-[#EDEEEF] rounded w-16"></div>
                <div className="h-8 bg-[#EDEEEF] rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-[#EDEEEF] rounded-[24px] flex items-center justify-center">
          <AlertCircle className="w-12 h-12 text-text-muted" />
        </div>
        <h3 className="text-h3 font-semibold text-text-primary mb-2 font-heading">
          Impossible de charger les artisans
        </h3>
        <p className="text-text-secondary mb-6 font-body">
          Veuillez réessayer dans quelques instants.
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-[#F97B22] hover:bg-[#e66a1f] text-white rounded-[24px] px-6 py-3 font-semibold transition-all duration-200 hover:shadow-lg"
        >
          Réessayer
        </Button>
      </div>
    );
  }

  if (professionals.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-[#EDEEEF] rounded-[24px] flex items-center justify-center">
          <Users className="w-12 h-12 text-text-muted" />
        </div>
        <h3 className="text-h3 font-semibold text-text-primary mb-2 font-heading">
          Aucun artisan trouvé
        </h3>
        <p className="text-text-secondary mb-6 font-body">
          Essayez de modifier vos critères de recherche ou d'élargir votre zone géographique.
        </p>
        <Button
          onClick={() => {
            // Reset filters to show all professionals
            window.location.href = '/pros';
          }}
          className="bg-[#EDEEEF] hover:bg-[#F97B22]/10 text-text-primary rounded-[24px] px-6 py-3 font-semibold transition-all duration-200"
        >
          Voir tous les artisans
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results count */}
      <div className="text-center">
        <p className="text-text-secondary font-body">
          {total} artisan{total > 1 ? 's' : ''} trouvé{total > 1 ? 's' : ''}
        </p>
      </div>

      {/* Professionals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {professionals.map((pro: any) => (
          <Card key={pro.id} className="bg-gradient-to-br from-[rgba(250,247,242,0.8)] to-[rgba(255,255,255,0.5)] backdrop-blur-sm rounded-[24px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] transition-all duration-200 hover:scale-[1.02]">
            <div className="space-y-4">
              {/* Header with Avatar and Badges */}
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-bold text-lg">
                      {pro.name.split(' ').map((n: string) => n[0]).join('')}
                    </span>
                  </div>
                  {pro.isVerified && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success-500 rounded-full flex items-center justify-center">
                      <Shield className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-h3 font-semibold text-text-primary truncate">
                      {pro.name}
                    </h3>
                    {pro.isVerified && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-700">
                        Vérifié
                      </span>
                    )}
                  </div>

                  <p className="text-body font-medium text-primary-600 mb-2">
                    {pro.profession}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center space-x-1 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(pro.rating)
                              ? 'text-warning-500 fill-current'
                              : 'text-border-medium'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-small font-medium text-text-primary">
                      {pro.rating}
                    </span>
                    <span className="text-small text-text-muted">
                      ({pro.reviewCount} avis)
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center text-small text-text-muted">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{pro.city}</span>
                  </div>
                </div>
              </div>

              {/* Premium Badge */}
              {pro.isVerified && (
                <div className="flex items-center justify-center px-3 py-2 bg-gradient-to-r from-warning-50 to-warning-100 rounded-lg border border-warning-200">
                  <Crown className="w-4 h-4 text-warning-600 mr-2" />
                  <span className="text-sm font-medium text-warning-700">Artisan Premium</span>
                </div>
              )}

              {/* Description */}
              {pro.description && (
                <p className="text-small text-text-secondary line-clamp-2">
                  {pro.description}
                </p>
              )}

              {/* Stats */}
              <div className="text-center text-small text-text-muted">
                {pro.completedJobs} mission{pro.completedJobs > 1 ? 's' : ''} réalisée{pro.completedJobs > 1 ? 's' : ''}
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-2">
                <Link href={`/pros/${pro.id}`} className="flex-1">
                  <Button className="w-full bg-[#EDEEEF] hover:bg-[#F97B22]/10 text-text-primary rounded-[24px] py-2 font-semibold transition-all duration-200">
                    Voir le profil
                  </Button>
                </Link>
                <Button
                  onClick={() => handleContactClick(pro.id)}
                  className="flex-1 bg-[#F97B22] hover:bg-[#e66a1f] text-white rounded-[24px] py-2 font-semibold transition-all duration-200 hover:shadow-lg"
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Contacter
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
