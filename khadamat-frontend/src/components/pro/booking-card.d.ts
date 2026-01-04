import React from 'react';
import { ProfessionalDetail } from '@/lib/mocks/services-mocks';
interface BookingCardProps {
    professional: ProfessionalDetail;
    onBookNow: () => void;
    onContact: () => void;
    contactUrl?: string;
    contactDisabled?: boolean;
    contactDisabledReason?: string;
}
export declare function BookingCard({ professional, onBookNow, onContact, contactUrl, contactDisabled, contactDisabledReason, }: BookingCardProps): React.JSX.Element;
export {};
