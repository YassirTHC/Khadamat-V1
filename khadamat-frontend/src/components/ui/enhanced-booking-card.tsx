// @ts-nocheck
'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, MessageSquare, Phone, Heart, Star, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BookingStatus } from '@/types/api';

export type BookingStatusUi =
  | BookingStatus
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'expired';

export interface ClientBooking {
  id: string;
  professionalName: string;
  professionalAvatar?: string;
  serviceName: string;
  serviceCategory?: string;
  status: BookingStatusUi;
  timeSlot?: string;
  duration?: string;
  price?: number;
  location?: string;
  notes?: string;
  createdAt?: string;
}

export interface ProfessionalBooking {
  id: string;
  clientName: string;
  clientAvatar?: string;
  serviceName: string;
  serviceCategory?: string;
  status: BookingStatusUi;
  timeSlot?: string;
  duration?: string;
  price?: number;
  location?: string;
  createdAt?: string;
  unreadMessages?: number;
  isUrgent?: boolean;
}

interface EnhancedBookingCardProps {
  variant?: 'default' | 'compact' | 'mobile';
  booking: ClientBooking | ProfessionalBooking;
  onAccept?: () => void;
  onDecline?: () => void;
  onComplete?: () => void;
  onCancel?: () => void;
  onRate?: () => void;
  onContact?: () => void;
  onMessage?: () => void;
  onFavorite?: () => void;
  interactive?: boolean;
  className?: string;
  isProView?: boolean;
}

const STATUS_CONFIG: Record<
  BookingStatusUi,
  { label: string; color: string }
> = {
  REQUESTED: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  ACCEPTED: { label: 'Acceptée', color: 'bg-green-100 text-green-800 border-green-200' },
  DECLINED: { label: 'Refusée', color: 'bg-red-100 text-red-700 border-red-200' },
  CANCELLED_BY_CLIENT: { label: 'Annulée (client)', color: 'bg-red-100 text-red-700 border-red-200' },
  CANCELLED_BY_PRO: { label: 'Annulée (pro)', color: 'bg-red-100 text-red-700 border-red-200' },
  COMPLETED: { label: 'Terminée', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  EXPIRED: { label: 'Expirée', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  confirmed: { label: 'Confirmée', color: 'bg-green-100 text-green-800 border-green-200' },
  in_progress: { label: 'En cours', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  completed: { label: 'Terminée', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-700 border-red-200' },
  expired: { label: 'Expirée', color: 'bg-gray-100 text-gray-700 border-gray-200' },
};

const formatSlot = (slot?: string) =>
  slot ? new Date(slot).toLocaleString('fr-FR') : 'Créneau à définir';

export function EnhancedBookingCard({
  variant = 'default',
  booking,
  onAccept,
  onDecline,
  onComplete,
  onCancel,
  onRate,
  onContact,
  onMessage,
  onFavorite,
  interactive = true,
  className,
  isProView = false,
}: EnhancedBookingCardProps) {
  const statusConfig =
    STATUS_CONFIG[booking.status] ||
    STATUS_CONFIG[booking.status.toUpperCase() as BookingStatusUi] ||
    STATUS_CONFIG.REQUESTED;

  const isCompact = variant !== 'default';
  const dateLabel = formatSlot(booking.timeSlot);

  const baseClasses = cn(
    'bg-gradient-to-br from-[rgba(250,247,242,0.8)] to-[rgba(255,255,255,0.5)] backdrop-blur-sm rounded-[20px] shadow-card border border-white/20 transition-all duration-200',
    interactive && 'cursor-pointer hover:shadow-card-hover hover:scale-[1.01]',
    isCompact ? 'p-3' : 'p-4',
    className,
  );

  const showAcceptDecline = isProView && booking.status === 'REQUESTED';
  const showComplete = isProView && booking.status === 'ACCEPTED';
  const showCancel = !isProView && (booking.status === 'REQUESTED' || booking.status === 'ACCEPTED');
  const showRate = !isProView && booking.status === 'COMPLETED';

  return (
    <motion.div className={baseClasses} whileHover={interactive ? { scale: 1.01 } : {}}>
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0">
          <h3 className={cn('font-semibold text-text-primary truncate', isCompact ? 'text-sm' : 'text-base')}>
            {booking.serviceName}
          </h3>
          <p className="text-xs text-text-secondary truncate">
            {booking.professionalName || (booking as any).clientName}
          </p>
        </div>
        <span
          className={cn(
            'inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium border',
            statusConfig.color,
          )}
        >
          {statusConfig.label}
        </span>
      </div>

      {!isCompact && (
        <div className="space-y-2 text-sm text-text-secondary mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#F97B22]" />
            <span>{dateLabel}</span>
          </div>
          {booking.duration && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#F97B22]" />
              <span>{booking.duration}</span>
            </div>
          )}
          {booking.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#F97B22]" />
              <span>{booking.location}</span>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-text-secondary">
          {booking.price ? <span className="font-semibold text-[#F97B22]">{booking.price} DH</span> : 'Sur devis'}
        </div>
        <div className="flex items-center gap-2 text-text-secondary">
          {booking.createdAt && <span className="text-xs">{new Date(booking.createdAt).toLocaleDateString('fr-FR')}</span>}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {showAcceptDecline && (
          <>
            <ButtonMini icon={<CheckCircle className="w-4 h-4" />} label="Accepter" onClick={onAccept} />
            <ButtonMini icon={<XCircle className="w-4 h-4" />} label="Refuser" onClick={onDecline} />
          </>
        )}
        {showComplete && (
          <ButtonMini icon={<CheckCircle className="w-4 h-4" />} label="Terminer" onClick={onComplete} />
        )}
        {showCancel && (
          <ButtonMini icon={<XCircle className="w-4 h-4" />} label="Annuler" onClick={onCancel} />
        )}
        {showRate && (
          <ButtonMini icon={<Star className="w-4 h-4" />} label="Noter" onClick={onRate} />
        )}
        {onContact && <ButtonMini icon={<Phone className="w-4 h-4" />} label="Contacter" onClick={onContact} />}
        {onMessage && <ButtonMini icon={<MessageSquare className="w-4 h-4" />} label="Message" onClick={onMessage} />}
        {onFavorite && <ButtonMini icon={<Heart className="w-4 h-4" />} label="Favori" onClick={onFavorite} />}
      </div>
    </motion.div>
  );
}

const ButtonMini = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick?.();
    }}
    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#F97B22]/10 text-[#F97B22] rounded-lg text-xs font-medium hover:bg-[#F97B22]/20 transition-colors"
  >
    {icon}
    <span>{label}</span>
  </button>
);
