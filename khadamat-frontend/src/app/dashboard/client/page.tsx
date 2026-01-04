'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Star, TrendingUp, MessageSquare, Settings, User, XCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { bookingService } from '@/services/booking.service';
import { BookingStatus } from '@/types/api';

type BookingView = {
  id: string;
  service: string;
  pro: string;
  timeSlot?: string;
  status: BookingStatus;
  price?: number;
};

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

export default function ClientDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await bookingService.getMyBookings();
        const normalized: BookingView[] = (data || []).map((b: any) => ({
          id: b.id,
          service: b.serviceCategory?.name || b.serviceName || 'Service',
          pro: b.pro?.proProfile ? `${b.pro.proProfile.firstName} ${b.pro.proProfile.lastName}` : b.professionalName || 'Professionnel',
          timeSlot: b.timeSlot,
          status: b.status,
          price: b.finalPrice ?? b.priceEstimate,
        }));
        setBookings(normalized);
      } catch (e) {
        console.error(e);
        setError("Erreur lors du chargement des réservations");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const activeCount = bookings.filter((b) => [BookingStatus.REQUESTED, BookingStatus.ACCEPTED].includes(b.status)).length;
  const completedCount = bookings.filter((b) => b.status === BookingStatus.COMPLETED).length;
  const totalSpent = bookings
    .filter((b) => b.status === BookingStatus.COMPLETED)
    .reduce((sum, b) => sum + (b.price || 0), 0);

  const stats = [
    { title: 'Réservations actives', value: activeCount, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Services terminés', value: completedCount, icon: Clock, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Note moyenne', value: '4.8', icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { title: 'Total dépensé', value: `${totalSpent.toLocaleString()} DH`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const canCancel = (status: BookingStatus) =>
    status === BookingStatus.REQUESTED || status === BookingStatus.ACCEPTED;

  const handleCancel = async (id: string) => {
    try {
      await bookingService.updateStatus(id, BookingStatus.CANCELLED_BY_CLIENT);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: BookingStatus.CANCELLED_BY_CLIENT } : b)),
      );
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-[#F97B22]" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Bonjour, {user?.clientProfile?.firstName || 'Client'} !
          </h1>
          <p className="text-text-secondary">Bienvenue sur votre tableau de bord Khadamat</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 * idx }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-secondary mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-text-primary">Mes réservations récentes</h2>
                <Link href="/dashboard/client/history">
                  <Button variant="outline" size="sm">
                    Voir tout
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {bookings.length === 0 ? (
                  <div className="text-sm text-text-secondary">Aucune réservation.</div>
                ) : (
                  bookings.slice(0, 5).map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 border border-border-light rounded-lg hover:bg-surface-secondary transition-colors duration-200"
                    >
                      <div>
                        <h3 className="font-medium text-text-primary">{booking.service}</h3>
                        <p className="text-sm text-text-secondary">
                          {booking.pro} •{' '}
                          {booking.timeSlot
                            ? new Date(booking.timeSlot).toLocaleString()
                            : 'Créneau à préciser'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-text-primary">
                          {booking.price ? `${booking.price} DH` : 'Sur devis'}
                        </p>
                        <div className="flex items-center justify-end gap-2 mt-1">
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded-full ${
                              booking.status === BookingStatus.ACCEPTED
                                ? 'bg-green-100 text-green-800'
                                : booking.status === BookingStatus.REQUESTED
                                ? 'bg-yellow-100 text-yellow-800'
                                : booking.status === BookingStatus.COMPLETED
                                ? 'bg-blue-100 text-blue-800'
                                : booking.status === BookingStatus.DECLINED ||
                                  booking.status === BookingStatus.CANCELLED_BY_CLIENT ||
                                  booking.status === BookingStatus.CANCELLED_BY_PRO
                                ? 'bg-red-100 text-red-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {statusLabel(booking.status)}
                          </span>
                          {canCancel(booking.status) && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleCancel(booking.id)}
                              className="text-red-600 hover:text-red-700"
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
                  ))
                )}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-6">
                Actions rapides
              </h2>
              <div className="space-y-3">
                <Link href="/services" className="block">
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Nouvelle réservation
                  </Button>
                </Link>
                <Link href="/dashboard/client/messages" className="block">
                  <Button className="w-full justify-start" variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Mes messages
                  </Button>
                </Link>
                <Link href="/dashboard/client/history" className="block">
                  <Button className="w-full justify-start" variant="outline">
                    <Star className="h-4 w-4 mr-2" />
                    Mes avis
                  </Button>
                </Link>
                <Link href="/dashboard/client/profile" className="block">
                  <Button className="w-full justify-start" variant="outline">
                    <User className="h-4 w-4 mr-2" />
                    Mon profil
                  </Button>
                </Link>
                <Link href="/settings" className="block">
                  <Button className="w-full justify-start" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Paramètres
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
