'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProfessionalDetail } from '@/lib/mocks/services-mocks';
import { Calendar, Clock, Star, CheckCircle } from 'lucide-react';

interface BookingCardProps {
  professional: ProfessionalDetail;
  onBookNow: () => void;
  onContact: () => void;
  contactUrl?: string;
  contactDisabled?: boolean;
  contactDisabledReason?: string;
}

export function BookingCard({
  professional,
  onBookNow,
  onContact,
  contactUrl,
  contactDisabled,
  contactDisabledReason,
}: BookingCardProps) {
  return (
    <Card className="p-6 sticky top-24">
      <div className="space-y-4">
        {/* Price */}
        <div className="text-center">
          <div className="text-2xl font-bold text-primary-600">
            À partir de {professional.startingPrice} DH
          </div>
          <div className="text-sm text-text-secondary">Prix indicatif</div>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-center space-x-2">
          <div className="flex items-center">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 font-medium">{professional.rating}</span>
          </div>
          <span className="text-text-secondary">
            ({professional.reviewCount} avis)
          </span>
        </div>

        {/* Response Time */}
        <div className="flex items-center justify-center space-x-2 text-sm text-text-secondary">
          <Clock className="w-4 h-4" />
          <span>{professional.responseTime}</span>
        </div>

        {/* Verified Badge */}
        {professional.isVerified && (
          <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span>Professionnel vérifié</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onBookNow}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white"
            size="lg"
            data-testid="booking-open"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Réserver maintenant
          </Button>

          <Button
            onClick={onContact}
            variant="outline"
            className="w-full"
            size="lg"
            data-testid="contact-whatsapp"
            data-contact-url={contactUrl || ''}
            disabled={contactDisabled}
            title={contactDisabledReason}
          >
            Contacter
          </Button>
        </div>

        {/* Additional Info */}
        <div className="text-xs text-text-secondary text-center space-y-1">
          <div>Réservation gratuite • Paiement sécurisé</div>
          <div>Annulation gratuite jusqu'à 24h avant</div>
        </div>
      </div>
    </Card>
  );
}
