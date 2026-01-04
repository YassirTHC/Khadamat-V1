export type Role = 'CLIENT' | 'PRO' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  role: Role;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  phone?: string;
  clientProfile?: ClientProfile;
  proProfile?: ProProfile;
}

// ✅ CORRECTION : L'enum manquant (Indispensable pour le dashboard)
export enum BookingStatus {
  REQUESTED = 'REQUESTED',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  CANCELLED_BY_CLIENT = 'CANCELLED_BY_CLIENT',
  CANCELLED_BY_PRO = 'CANCELLED_BY_PRO',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED',
}

export interface SignupDto {
  email: string;
  password: string;
  role: Role;
  firstName: string;
  lastName: string;
  phone: string;
  profession?: string;
  bio?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token?: string;
}

export interface AuthResponse {
  user: User;
  access_token?: string;
  refresh_token?: string;
  accessToken?: string;
  refreshToken?: string;
}

// Type pour les statistiques (pour corriger le +0 Pros)
export interface PlatformStats {
  totalPros: number;
  totalClients: number;
  totalBookings: number;
  averageRating: number;
  totalServices?: number;
  totalCities?: number;
}

export interface ProProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  profession: string;
  bio?: string;
  experienceYears?: number;
  verificationStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  isVerified: boolean;
  isPremium: boolean;
  isActiveEligible?: boolean;
  missingFields?: string[];
  rating?: number;
  reviewCount?: number;
  cityId?: string;
  city?: City;
  services?: ProService[];
  avatarUrl?: string;
  phone?: string;
  email?: string;
}

export interface ClientProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
   avatar?: string;
  avatarUrl?: string;
}

export interface City {
  id: string;
  name: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  isActive?: boolean;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  isActive: boolean;
}

export interface ProService {
  id: string;
  proUserId?: string;
  proId?: string; // legacy
  categoryId: string;
  category: ServiceCategory;
  pricingType: 'FIXED' | 'QUOTE';
  title: string;
  description: string;
  price?: number | null;
  basePrice?: number | null;
  duration?: number;
  isActive: boolean;
  cityId?: string;
  serviceCategoryId?: string;
}

export interface Booking {
  id: string;
  clientId: string;
  proUserId?: string;
  proId?: string; // legacy alias
  serviceId: string;
  serviceCategory?: { name?: string; id?: string };
  city?: { name?: string; id?: string };
  status: BookingStatus;
  description: string;
  timeSlot: string;
  priceEstimate?: number;
  photos?: string[];
  createdAt: string;
  updatedAt: string;
  client?: User;
  pro?: ProProfile;
  service?: ProService;
}

export interface CreateBookingPayload {
  proUserId: string;
  serviceCategoryId: string;
  cityId: string;
  timeSlot: string;
  description: string;
  pricingType?: 'FIXED' | 'QUOTE';
  // legacy alias should not be used; kept for compile-time guard
  proId?: never;
}

export interface Message {
  id: string;
  content: string;
  senderId?: string;
  createdAt?: string;
  sender?: {
    clientProfile?: ClientProfile;
    proProfile?: ProProfile;
    email?: string;
  };
  readAt?: string;
}

export interface Conversation {
  id: string;
  messages?: Message[];
  pro?: ProProfile;
  client?: ClientProfile;
  booking?: Booking;
  updatedAt?: string;
  participant1Id?: string;
  participant2Id?: string;
}
