import { City, Category } from '@/lib/api';
export type ServiceCategory = Category;
export interface BlogArticle {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    author: {
        name: string;
        avatar?: string;
        bio?: string;
    };
    category: string;
    tags: string[];
    publishedAt: string;
    updatedAt: string;
    readTime: number;
    featuredImage?: string;
    isPublished: boolean;
    views: number;
    likes: number;
}
export interface BlogCategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
    articleCount: number;
    color: string;
}
export declare const mockCities: City[];
export declare const mockCategories: ServiceCategory[];
export interface Professional {
    id: string;
    fullName: string;
    avatarUrl?: string;
    cityId: string;
    serviceCategoryId: string;
    title: string;
    shortBio: string;
    rating: number;
    reviewCount: number;
    isVerified: boolean;
    isPremium: boolean;
    startingPrice: number;
    experienceYears: number;
    responseTime: string;
    badgeLabels?: string[];
    cityName?: string;
    serviceCategoryName?: string;
    portfolioImages?: string[];
}
export interface ProfessionalService {
    id: string;
    name: string;
    description: string;
    pricingType?: 'FIXED' | 'QUOTE';
    price?: number;
    basePrice?: number | null;
    duration: string;
    category: string;
}
export interface ProfessionalReview {
    id: string;
    clientName: string;
    clientAvatar?: string;
    rating: number;
    comment: string;
    serviceName: string;
    date: string;
    verified: boolean;
}
export interface ProfessionalCertification {
    id: string;
    title: string;
    issuer: string;
    year: number;
    description?: string;
}
export interface ProfessionalDetail {
    id: string;
    fullName: string;
    avatarUrl?: string;
    cityId: string;
    serviceCategoryId: string;
    title: string;
    shortBio: string;
    detailedBio: string;
    rating: number;
    reviewCount: number;
    isVerified: boolean;
    isPremium: boolean;
    startingPrice: number;
    experienceYears: number;
    responseTime: string;
    badgeLabels?: string[];
    cityName?: string;
    serviceCategoryName?: string;
    languages: string[];
    availability: string;
    completedJobs: number;
    responseRate: number;
    services: ProfessionalService[];
    reviews: ProfessionalReview[];
    certifications: ProfessionalCertification[];
    portfolioImages?: string[];
    workingHours: {
        monday: string;
        tuesday: string;
        wednesday: string;
        thursday: string;
        friday: string;
        saturday: string;
        sunday: string;
    };
    contactPhone?: string;
}
export declare const mockProfessionals: Professional[];
export declare const mockProfessionalDetails: Record<string, ProfessionalDetail>;
export declare const mockBlogCategories: BlogCategory[];
export declare const mockBlogArticles: BlogArticle[];
export declare const getBlogArticleBySlug: (slug: string) => BlogArticle | undefined;
export declare const getBlogArticlesByCategory: (categorySlug: string) => BlogArticle[];
export declare const getPopularBlogArticles: (limit?: number) => BlogArticle[];
export declare const getRelatedBlogArticles: (currentArticle: BlogArticle, limit?: number) => BlogArticle[];
export interface Client {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    avatar?: string;
    cityId: string;
    cityName?: string;
    createdAt: string;
    isVerified: boolean;
    totalBookings: number;
    totalSpent: number;
    favoriteCount: number;
}
export interface ClientBooking {
    id: string;
    clientId: string;
    professionalId: string;
    professionalName: string;
    professionalAvatar?: string;
    serviceName: string;
    serviceCategory: string;
    status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
    timeSlot: string;
    scheduledTime: string;
    duration: string;
    price: number;
    location: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}
export interface ClientMessage {
    id: string;
    clientId: string;
    professionalId: string;
    professionalName: string;
    professionalAvatar?: string;
    bookingId?: string;
    content: string;
    isFromClient: boolean;
    isRead: boolean;
    createdAt: string;
}
export interface ClientFavorite {
    id: string;
    clientId: string;
    professionalId: string;
    professionalName: string;
    professionalAvatar?: string;
    serviceCategory: string;
    rating: number;
    reviewCount: number;
    startingPrice: number;
    cityName: string;
    addedAt: string;
}
export interface ClientStats {
    totalBookings: number;
    activeBookings: number;
    completedBookings: number;
    totalSpent: number;
    averageRating: number;
    favoriteCount: number;
    unreadMessages: number;
}
export declare const mockClient: Client;
export declare const mockClientBookings: ClientBooking[];
export declare const mockClientMessages: ClientMessage[];
export declare const mockClientFavorites: ClientFavorite[];
export declare const mockClientStats: ClientStats;
export declare const getClientBookingsByStatus: (status?: ClientBooking["status"]) => ClientBooking[];
export declare const getClientUnreadMessages: () => ClientMessage[];
export declare const getClientRecentBookings: (limit?: number) => ClientBooking[];
export declare const getClientUpcomingBookings: () => ClientBooking[];
export interface ProProfile {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    avatar?: string;
    cityId: string;
    cityName?: string;
    serviceCategoryId: string;
    serviceCategoryName?: string;
    title: string;
    shortBio: string;
    isVerified: boolean;
    isPremium: boolean;
    rating: number;
    reviewCount: number;
    responseRate: number;
    monthlyRevenue: number;
    totalBookings: number;
    completedBookings: number;
    createdAt: string;
    badges: string[];
}
export interface ProBooking {
    id: string;
    clientId: string;
    clientName: string;
    clientAvatar?: string;
    clientPhone: string;
    serviceId: string;
    serviceName: string;
    serviceCategory: string;
    status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
    timeSlot: string;
    scheduledTime: string;
    duration: string;
    price: number;
    location: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    unreadMessages: number;
}
export interface ProService {
    id: string;
    proUserId: string;
    proProfileId?: string;
    proId?: string;
    name: string;
    description: string;
    price: number;
    duration: string;
    category: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    bookingCount: number;
}
export interface ProTransaction {
    id: string;
    bookingId: string;
    clientName: string;
    serviceName: string;
    amount: number;
    fee: number;
    netAmount: number;
    status: 'pending' | 'completed' | 'failed';
    paymentDate: string;
    createdAt: string;
}
export interface ProEarningsStats {
    monthlyRevenue: number;
    totalRevenue: number;
    pendingPayments: number;
    averageTicket: number;
    growthRate: number;
    totalTransactions: number;
}
export declare const mockProProfile: ProProfile;
export declare const mockProBookings: ProBooking[];
export declare const mockProServices: ProService[];
export declare const mockProTransactions: ProTransaction[];
export declare const mockProEarningsStats: ProEarningsStats;
export declare const getProBookingsByStatus: (status?: ProBooking["status"]) => ProBooking[];
export declare const getProRecentBookings: (limit?: number) => ProBooking[];
export declare const getProPendingBookings: () => ProBooking[];
export declare const getProActiveServices: () => ProService[];
export declare const getProMonthlyTransactions: (month?: string) => ProTransaction[];
export declare const getProRevenueByMonth: () => {
    month: string;
    revenue: number;
}[];
export interface SupportCategory {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon: string;
    color: string;
    articleCount: number;
    isPopular: boolean;
}
export interface SupportArticle {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    categoryId: string;
    categoryName: string;
    categoryColor: string;
    author: string;
    publishedAt: string;
    updatedAt: string;
    views: number;
    helpful: number;
    notHelpful: number;
    tags: string[];
    isPublished: boolean;
}
export interface FAQItem {
    id: string;
    question: string;
    answer: string;
    category: string;
    isPopular: boolean;
    views: number;
}
export declare const mockSupportCategories: SupportCategory[];
export declare const mockSupportArticles: SupportArticle[];
export declare const mockFAQItems: FAQItem[];
export declare const getSupportArticleBySlug: (slug: string) => SupportArticle | undefined;
export declare const getSupportArticlesByCategory: (categorySlug: string) => SupportArticle[];
export declare const getPopularSupportArticles: (limit?: number) => SupportArticle[];
export declare const getRelatedSupportArticles: (currentArticle: SupportArticle, limit?: number) => SupportArticle[];
export declare const searchSupportArticles: (query: string) => SupportArticle[];
export declare const getPopularFAQItems: (limit?: number) => FAQItem[];
export interface CompanyStats {
    prosCount: number;
    missionsCompleted: number;
    averageRating: number;
    citiesCovered: number;
}
export interface TeamMember {
    id: string;
    fullName: string;
    role: string;
    shortBio: string;
    avatarUrl: string;
}
export interface CompanyValue {
    id: string;
    title: string;
    description: string;
    iconName: string;
}
export declare const mockCompanyStats: CompanyStats;
export declare const mockTeamMembers: TeamMember[];
export declare const mockCompanyValues: CompanyValue[];
