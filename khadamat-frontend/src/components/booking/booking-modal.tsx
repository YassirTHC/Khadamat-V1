'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ProService } from '@/types/api';
import apiClientInstance from '@/lib/api-client';

interface BookingModalProps {
  selectedService: ProService;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  selectedService,
  isOpen,
  onClose,
}) => {
  console.info('BOOKING_MODAL_V2 render');
  const priceValue = selectedService.basePrice ?? selectedService.price;
  const inferredPricingType = priceValue === undefined || priceValue === null ? 'QUOTE' : 'FIXED';
  const pricingType = selectedService.pricingType || inferredPricingType;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [timeSlotInput, setTimeSlotInput] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ timeSlot?: string; description?: string }>({});

  const snapToHourIso = (value: string) => {
    const d = new Date(value);
    const ms = d.getTime();
    const slotMs = Math.ceil(ms / (60 * 60 * 1000)) * 60 * 60 * 1000;
    return new Date(slotMs).toISOString();
  };

  const validate = (): boolean => {
    const nextErrors: { timeSlot?: string; description?: string } = {};
    if (!timeSlotInput) {
      nextErrors.timeSlot = 'Le créneau est requis';
    } else {
      const selectedDate = new Date(timeSlotInput);
      const now = new Date();
      if (selectedDate <= now) {
        nextErrors.timeSlot = 'La date doit être dans le futur';
      }
    }
    if (!description || description.length < 10) {
      nextErrors.description = 'La description doit contenir au moins 10 caractères';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submitBooking = async () => {
    console.log('[booking] submit handler triggered');
    if (!validate()) return;
    setLoading(true);
    try {
      const timeSlot = snapToHourIso(timeSlotInput);
      const proUserId =
        (selectedService as any).proUserId ||
        (selectedService as any).proUser?.id ||
        (selectedService as any).proOwnerId ||
        (selectedService as any).proId ||
        (selectedService as any).proProfileId ||
        undefined;
      if (!selectedService.proUserId && (selectedService as any).proId) {
        console.warn('[booking] legacy proId used from service; please migrate to proUserId');
      }
      const serviceCategoryId =
        (selectedService as any).serviceCategoryId || (selectedService as any).categoryId;

      if (!proUserId || !serviceCategoryId || !selectedService.cityId) {
        throw new Error('Données service incomplètes pour la réservation');
      }

      console.log('[booking] submit payload', {
        proUserId,
        serviceCategoryId,
        cityId: selectedService.cityId,
        timeSlot,
      });

      const payload = {
        proUserId,
        serviceCategoryId,
        cityId: selectedService.cityId,
        description,
        timeSlot,
        pricingType,
      };

      await apiClientInstance.booking.create(payload);

      toast.success('Réservation créée avec succès !');
      onClose();
      setDescription('');
      setTimeSlotInput('');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Booking error:', error);
      const message =
        error?.response?.status === 409
          ? 'Créneau déjà pris. Merci de choisir un autre créneau.'
          : error?.response?.data?.message ||
            error.message ||
            'Erreur lors de la création de la réservation';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Réserver ce service">
      {/* Marker to help E2E locate the correct modal version */}
      <div className="space-y-6" data-testid="booking-modal-v2-root" id="booking-modal-v2-root">
        <span className="sr-only" data-testid="booking-modal-v2-marker">
          booking modal v2
        </span>
        {/* Service Info and Price */}
        <div className="bg-surface rounded-lg p-4">
          <div className="text-center">
            <h3 className="font-semibold text-text-primary mb-2">Prix</h3>
            {pricingType === 'QUOTE' ? (
              <p className="text-2xl font-bold text-primary-500">Prix sur devis</p>
            ) : (
              <p className="text-2xl font-bold text-primary-500">
                {(selectedService as any).basePrice ?? (selectedService as any).price ?? 0} DH
              </p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Time Slot */}
          <Input
            type="datetime-local"
            label="Créneau souhaité (60 min) *"
            value={timeSlotInput}
            onChange={(e) => setTimeSlotInput(e.target.value)}
            error={errors.timeSlot}
            min={new Date().toISOString().slice(0, 16)}
            step={3600}
            data-testid="booking-timeslot"
          />

          {/* Description */}
          <Textarea
            label="Description de votre besoin *"
            placeholder="Décrivez en détail ce dont vous avez besoin..."
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={errors.description}
            data-testid="booking-description"
          />

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
              data-testid="booking-cancel"
            >
              Annuler
            </Button>
            <Button
              type="button"
              className="flex-1 bg-[#F97B22] hover:bg-[#F97B22]/90"
              disabled={loading}
              data-testid="booking-submit"
              onClick={submitBooking}
            >
              {loading ? 'Création en cours...' : 'Réserver ce service'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
