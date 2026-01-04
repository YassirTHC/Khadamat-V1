export interface ProService {
    id: string;
    name: string;
    category: string;
    pricingType?: 'FIXED' | 'QUOTE';
    price?: number | null;
    description: string;
    isActive: boolean;
    proUserId?: string;
    proProfileId?: string;
}
export declare const mockProServices: ProService[];
