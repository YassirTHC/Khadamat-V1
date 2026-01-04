// Optimized response shapes for frontend consumption

export interface UserSummary {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface ServiceCategorySummary {
  id: string;
  name: string;
  icon?: string;
}

export interface CitySummary {
  id: string;
  name: string;
}

export interface BookingSummary {
  id: string;
  status: string;
  timeSlot: Date;
  description: string;
  priceEstimate?: number;
  finalPrice?: number;
  createdAt: Date;
  updatedAt: Date;
  client: UserSummary;
  pro: UserSummary;
  serviceCategory: ServiceCategorySummary;
  city: CitySummary;
  hasReview: boolean;
  hasDispute: boolean;
}

export interface ConversationSummary {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  lastMessage?: {
    content: string;
    createdAt: Date;
    sender: UserSummary;
  };
  booking?: {
    id: string;
    status: string;
    serviceCategory: ServiceCategorySummary;
    city: CitySummary;
  };
  unreadCount: number;
}

export interface ProSummary {
  id: string;
  firstName: string;
  lastName: string;
  profession: string;
  averageRating?: number;
  totalReviews: number;
  isVerifiedPro: boolean;
  isPremium: boolean;
  city: CitySummary;
  services: Array<{
    id: string;
    basePrice: number;
    serviceCategory: ServiceCategorySummary;
  }>;
}
