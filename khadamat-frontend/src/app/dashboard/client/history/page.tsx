'use client';

import React, { useEffect, useMemo, useState, Suspense } from 'react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, Search, Filter, Loader2, CheckCircle, XCircle, MessageCircle } from 'lucide-react';
import apiClientInstance from '@/lib/api-client';
import { bookingService } from '@/services/booking.service';
import { BookingStatus } from '@/types/api';
import Link from 'next/link';
import { communicationApi } from '@/services/communication.service';

type BookingView = {
  id: string;
  service: string;
  pro: string;
  city?: string;
  timeSlot?: string;
  status: BookingStatus;
  price?: number;
  proId?: string;
  contactPhone?: string;
};

const statusOptions = [
  { value: 'all', label: 'Tous les statuts' },
  { value: BookingStatus.REQUESTED, label: 'En attente' },
  { value: BookingStatus.ACCEPTED, label: 'Acceptée' },
  { value: BookingStatus.DECLINED, label: 'Refusée' },
  { value: BookingStatus.CANCELLED_BY_CLIENT, label: 'Annulée (client)' },
  { value: BookingStatus.CANCELLED_BY_PRO, label: 'Annulée (pro)' },
  { value: BookingStatus.COMPLETED, label: 'Terminée' },
  { value: BookingStatus.EXPIRED, label: 'Expirée' },
];

const statusLabel = (status: BookingStatus) => {
  switch (status) {
    case BookingStatus.REQUESTED:
      return 'En attente';
    case BookingStatus.ACCEPTED:
      return 'Acceptée';
    case BookingStatus.DECLINED:
      return 'Refusée';
    case BookingStatus.CANCELLED_BY_CLIENT:
      return 'Annulée (client)';
    case BookingStatus.CANCELLED_BY_PRO:
      return 'Annulée (pro)';
    case BookingStatus.COMPLETED:
      return 'Terminée';
    case BookingStatus.EXPIRED:
      return 'Expirée';
    default:
      return status;
  }
};

function ClientDashboardHistoryContent() {
  const [bookings, setBookings] = useState<BookingView[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        const data = await bookingService.getMyBookings();
        const normalized: BookingView[] = (data || []).map((b: any) => ({
          id: b.id,
          service: b.serviceCategory?.name || b.serviceName || 'Service',
          proId: b.pro?.id,
          pro: b.pro?.proProfile
            ? `${b.pro.proProfile.firstName} ${b.pro.proProfile.lastName}`
            : 'Professionnel',
          contactPhone: b.pro?.phone,
          city: b.city?.name,
          timeSlot: b.timeSlot,
          status: b.status,
          price: b.finalPrice ?? b.priceEstimate,
        }));
        setBookings(normalized);
      } catch (err) {
        console.error('Erreur chargement historique:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const filtered = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    return bookings.filter((b) => {
      const matchesSearch =
        b.service.toLowerCase().includes(searchLower) ||
        b.pro.toLowerCase().includes(searchLower);
      const matchesStatus = statusFilter === 'all' ? true : b.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchQuery, statusFilter]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-12">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)]">
      <DashboardHeader title="Historique" subtitle="Vos services passés et terminés" />

      <main className="flex-1 overflow-y-auto p-6">
        {/* Filtres et Recherche */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par service ou professionnel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
            </div>

            <div className="relative min-w-[200px]">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 appearance-none cursor-pointer"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Liste des réservations */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Aucune réservation trouvée</h3>
              <p className="text-gray-500 mt-1">Essayez de modifier vos filtres.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            filtered.map((booking) => (
              <Card
                key={booking.id}
                className="p-6 hover:shadow-md transition-all duration-200 border-gray-100"
                data-testid="booking-card"
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{booking.service}</h3>
                      <p className="text-gray-500 font-medium">{booking.pro}</p>

                      <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                          <Clock size={14} />
                          {booking.timeSlot
                            ? new Date(booking.timeSlot).toLocaleString('fr-FR')
                            : 'Créneau à définir'}
                        </span>
                        {booking.city && (
                          <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                            <MapPin size={14} />
                            {booking.city}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-left md:text-right flex flex-col justify-between min-w-[160px]">
                    <div className="mb-2">
                      {booking.status === BookingStatus.COMPLETED ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wide">
                          <CheckCircle size={12} /> Terminée
                        </span>
                      ) : booking.status === BookingStatus.DECLINED ||
                        booking.status === BookingStatus.CANCELLED_BY_CLIENT ||
                        booking.status === BookingStatus.CANCELLED_BY_PRO ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wide">
                          <XCircle size={12} /> {statusLabel(booking.status)}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide">
                          {statusLabel(booking.status)}
                        </span>
                      )}
                    </div>

                    <div>
                      <p className="font-bold text-xl text-gray-900">
                        {booking.price ? `${booking.price} DH` : 'Sur devis'}
                      </p>
                      <div className="flex gap-2 justify-end mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 border-green-200"
                          data-testid="history-contact-whatsapp"
                          data-contact-url={
                            booking.contactPhone
                              ? `https://wa.me/${(booking.contactPhone || '')
                                  .replace(/\\D/g, '')
                                  .replace(/^0/, '212')}` +
                                `?text=${encodeURIComponent(
                                  `Bonjour, je souhaite échanger à propos de la réservation #${booking.id}`,
                                )}`
                              : ''
                          }
                          disabled={!booking.contactPhone}
                          onClick={async () => {
                            if (!booking.contactPhone) return;
                            const url = `https://wa.me/${booking.contactPhone
                              .replace(/\\D/g, '')
                              .replace(/^0/, '212')}?text=${encodeURIComponent(
                              `Bonjour, je souhaite échanger à propos de la réservation #${booking.id}`,
                            )}`;
                            window.open(url, '_blank');
                            try {
                              await communicationApi.create({
                                channel: 'WHATSAPP',
                                proId: booking.proId || '',
                                bookingId: booking.id,
                                metadata: { source: 'client_history' },
                              });
                            } catch (err) {
                              console.warn('Trace communication failed', err);
                            }
                          }}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          {booking.contactPhone ? 'WhatsApp' : 'Numéro indisponible'}
                        </Button>
                        {(booking.status === BookingStatus.REQUESTED ||
                          booking.status === BookingStatus.ACCEPTED) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={async () => {
                              await bookingService.updateStatus(booking.id, BookingStatus.CANCELLED_BY_CLIENT);
                              setBookings((prev) =>
                                prev.map((b) =>
                                  b.id === booking.id ? { ...b, status: BookingStatus.CANCELLED_BY_CLIENT } : b,
                                ),
                              );
                            }}
                            data-testid="booking-cancel"
                          >
                            Annuler
                          </Button>
                        )}
                        {booking.status === BookingStatus.COMPLETED && (
                          <Link href={`/reviews/new?bookingId=${booking.id}`}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-orange-600 border-orange-200"
                              data-testid="review-open"
                            >
                              Laisser un avis
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default function ClientDashboardHistoryPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
        </div>
      }
    >
      <ClientDashboardHistoryContent />
    </Suspense>
  );
}
