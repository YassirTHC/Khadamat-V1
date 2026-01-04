import {
  Professional,
  ProBooking,
  ClientBooking,
  ProfessionalService,
  ProfessionalDetail,
  ProfessionalReview,
  ProfessionalCertification,
} from '@/lib/mocks/services-mocks';

// Backend types (simplified)
export interface BackendProfessional {
  id: string;
  user: {
    id: string;
    phone?: string;
  };
  firstName: string;
  lastName: string;
  profession: string;
  averageRating?: number;
  isVerifiedPro: boolean;
   isPremium?: boolean;
   totalReviews?: number;
  city?: {
    id?: string;
    name?: string;
  };
  proServices?: BackendProService[];
}

export interface BackendProService {
  id: string;
  proProfileId: string;
  serviceCategoryId: string;
  serviceCategory?: {
    name: string;
  };
  pricingType?: 'FIXED' | 'QUOTE';
  basePrice?: number | null;
  cityId?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  city?: {
    id?: string;
    name?: string;
  };
}

interface BackendProDetail extends BackendProfessional {
  cityId?: string;
  city?: {
    id?: string;
    name?: string;
  };
  proServices?: BackendProService[];
  isPremium?: boolean;
  totalReviews?: number;
  bio?: string;
  averageRating?: number;
  contactPhone?: string;
}

interface BackendBooking {
  id: string;
  status:
    | 'REQUESTED'
    | 'ACCEPTED'
    | 'DECLINED'
    | 'CANCELLED_BY_CLIENT'
    | 'CANCELLED_BY_PRO'
    | 'COMPLETED'
    | 'EXPIRED'
    | string;
  timeSlot?: string;
  createdAt: string;
  updatedAt: string;
  client?: {
    id: string;
    clientProfile?: {
      firstName: string;
      lastName: string;
    };
    avatar?: string;
    phone?: string;
  };
  pro?: {
    id: string;
    proProfile?: {
      firstName: string;
      lastName: string;
    };
  };
  serviceCategory?: {
    name: string;
  };
  city?: {
    name?: string;
  };
  description?: string;
  priceEstimate?: number;
  finalPrice?: number;
}

// Status mapping
const STATUS_MAPPING: Record<string, string> = {
  REQUESTED: 'pending',
  ACCEPTED: 'confirmed',
  DECLINED: 'cancelled',
  CANCELLED_BY_CLIENT: 'cancelled',
  CANCELLED_BY_PRO: 'cancelled',
  COMPLETED: 'completed',
  EXPIRED: 'expired',
};

// Generate random Unsplash images
function generatePortfolioImages(keywords: string[] = ['repair', 'work']): string[] {
  const images: string[] = [];
  for (let i = 0; i < 3; i++) {
    const keyword = keywords[Math.floor(Math.random() * keywords.length)];
    const seed = Math.random().toString(36).substring(7);
    images.push(
      `https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop&q=80&sig=${seed}&q=${encodeURIComponent(
        keyword,
      )}`,
    );
  }
  return images;
}

// Generate DiceBear avatar
function generateAvatar(name: string): string {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;
}

// Transform backend professional to frontend format
export function transformProfessional(pro: BackendProfessional, preferredCategoryId?: string): Professional {
  const fullName = `${pro.firstName} ${pro.lastName}`.trim();
  const services = pro.proServices || [];
  const chosenService =
    (preferredCategoryId && services.find((svc) => svc.serviceCategoryId === preferredCategoryId)) || services[0];

  const isPremium = Boolean(pro.isPremium);
  const totalReviews = pro.totalReviews ?? 0;

  const cityId = pro.city?.id || pro.city?.name || chosenService?.cityId || '';
  const cityName = chosenService?.city?.name || pro.city?.name;
  const serviceCategoryId = chosenService?.serviceCategoryId || services[0]?.serviceCategoryId || '';
  const serviceCategoryName =
    chosenService?.serviceCategory?.name ||
    services[0]?.serviceCategory?.name ||
    chosenService?.serviceCategoryId ||
    pro.profession;

  return {
    id: pro.user.id,
    fullName,
    avatarUrl: generateAvatar(fullName),
    cityId,
    serviceCategoryId,
    // Afficher la catégorie filtrée en priorité pour éviter la confusion (ex: filtre ménage)
    title: serviceCategoryName || pro.profession,
    shortBio: '', // Backend doesn't provide this
    rating: pro.averageRating ?? 0,
    reviewCount: totalReviews,
    isVerified: pro.isVerifiedPro,
    isPremium,
    startingPrice: chosenService?.basePrice || services[0]?.basePrice || 0,
    experienceYears: 0, // Backend doesn't provide this
    responseTime: '', // Backend doesn't provide this
    badgeLabels: pro.isVerifiedPro ? ['VAcrifiAc'] : [],
    cityName,
    serviceCategoryName,
    portfolioImages: generatePortfolioImages(),
  };
}

export function transformProDetail(pro: BackendProDetail): ProfessionalDetail {
  const fullName = `${pro.firstName} ${pro.lastName}`.trim();
  const firstService = pro.proServices?.[0];

  const services: ProfessionalService[] = (pro.proServices || []).map((service) => ({
    id: service.id,
    proUserId: pro.user?.id || pro.id,
    proId: pro.user?.id || pro.id, // legacy
    name: service.serviceCategory?.name || 'Service',
    description: service.description || '',
    price: service.basePrice ?? 0,
    pricingType: service.pricingType || 'FIXED',
    duration: '1h',
    category: service.serviceCategory?.name || '',
    basePrice: service.basePrice ?? null,
    serviceCategoryId: service.serviceCategoryId,
    cityId: service.city?.id || service.cityId,
  }));

  return {
    id: pro.user?.id || pro.id,
    fullName,
    avatarUrl: generateAvatar(fullName),
    cityId: pro.cityId || pro.city?.id || '',
    serviceCategoryId: firstService?.serviceCategoryId || '',
    title: pro.profession,
    shortBio: pro.bio || '',
    detailedBio: pro.bio || '',
    rating: pro.averageRating ?? 0,
    reviewCount: pro.totalReviews ?? 0,
    isVerified: pro.isVerifiedPro,
    isPremium: pro.isPremium ?? false,
    startingPrice: firstService?.basePrice || 0,
    experienceYears: 0,
    responseTime: 'RAcpond sous 24h',
    badgeLabels: pro.isVerifiedPro ? ['VAcrifiAc'] : [],
    cityName: pro.city?.name,
    serviceCategoryName: firstService?.serviceCategory?.name,
    languages: ['FranAais'],
    availability: 'Disponible',
    completedJobs: 0,
    responseRate: 0,
    services,
    reviews: [] as ProfessionalReview[],
    certifications: [] as ProfessionalCertification[],
    portfolioImages: generatePortfolioImages(),
    workingHours: {
      monday: '09:00 - 18:00',
      tuesday: '09:00 - 18:00',
      wednesday: '09:00 - 18:00',
      thursday: '09:00 - 18:00',
      friday: '09:00 - 18:00',
      saturday: '10:00 - 14:00',
      sunday: 'FermAc',
    },
    contactPhone: pro.user?.phone || pro.contactPhone,
  };
}

// Transform backend booking to frontend ProBooking format
export function transformProBooking(booking: BackendBooking): ProBooking {
  const clientName = booking.client?.clientProfile
    ? `${booking.client.clientProfile.firstName} ${booking.client.clientProfile.lastName}`.trim()
    : 'Client';
  const slot = booking.timeSlot;

  return {
    id: booking.id,
    clientId: booking.client?.id || '',
    clientName,
    clientAvatar: booking.client?.avatar || generateAvatar(clientName),
    clientPhone: booking.client?.phone || '',
    serviceId: '', // Backend doesn't provide this
    serviceName: booking.serviceCategory?.name || 'Service',
    serviceCategory: booking.serviceCategory?.name || '',
    status: (STATUS_MAPPING[booking.status.toUpperCase()] || 'pending') as any,
    scheduledTime: slot ? new Date(slot).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '',
    duration: '1h', // slot = 60 min
    price: booking.finalPrice || booking.priceEstimate || 0,
    location: booking.city?.name || '',
    notes: booking.description,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
    timeSlot: booking.timeSlot || '',
    unreadMessages: 0, // Backend doesn't provide this
  };
}

// Transform backend booking to frontend ClientBooking format
export function transformClientBooking(booking: BackendBooking): ClientBooking {
  const proName = booking.pro?.proProfile
    ? `${booking.pro.proProfile.firstName} ${booking.pro.proProfile.lastName}`.trim()
    : 'Professionnel';
  const slot = booking.timeSlot;

  return {
    id: booking.id,
    clientId: booking.client?.id || '',
    professionalId: booking.pro?.id || '',
    professionalName: proName,
    professionalAvatar: generateAvatar(proName),
    serviceName: booking.serviceCategory?.name || 'Service',
    serviceCategory: booking.serviceCategory?.name || '',
    status: (STATUS_MAPPING[booking.status.toUpperCase()] || 'pending') as any,
    scheduledTime: slot ? new Date(slot).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '',
    duration: '1h', // slot = 60 min
    price: booking.finalPrice || booking.priceEstimate || 0,
    location: booking.city?.name || '',
    notes: booking.description,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
    timeSlot: booking.timeSlot || '',
  };
}

// Transform backend pro service to frontend ProService format
export interface TransformedProService {
  id: string;
  proUserId?: string;
  proId?: string; // legacy
  name: string;
  description: string;
  price: number;
  pricingType: 'FIXED' | 'QUOTE';
  basePrice?: number | null;
  duration: string;
  category: string;
  serviceCategoryId?: string;
  cityId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  bookingCount: number;
}

export function transformProService(service: BackendProService): TransformedProService {
  return {
    id: service.id,
    proUserId: service.proProfileId, // upstream does not expose userId here, keep alias for compatibility
    proId: service.proProfileId,
    name: service.serviceCategory?.name || 'Service',
    description: service.description || '',
    price: service.basePrice ?? 0,
    pricingType: service.pricingType || 'FIXED',
    basePrice: service.basePrice ?? null,
    duration: '2h', // Default duration
    category: service.serviceCategory?.name || '',
    serviceCategoryId: service.serviceCategoryId,
    cityId: service.city?.id || service.cityId,
    isActive: service.isActive,
    createdAt: service.createdAt,
    updatedAt: service.updatedAt,
    bookingCount: 0, // Backend doesn't provide this
  };
}
