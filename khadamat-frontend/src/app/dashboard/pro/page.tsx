'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { bookingApi, proApi } from '@/lib/api-client';
import { BookingStatus, ProProfile } from '@/types/api';
import { 
  Calendar, Clock, Star, 
  Settings, User, Wallet, 
  CheckCircle, Plus, AlertCircle 
} from 'lucide-react';
import { toast } from 'sonner';

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'Wallet': return Wallet;
    case 'CheckCircle': return CheckCircle;
    case 'Star': return Star;
    case 'Clock': return Clock;
    default: return Wallet;
  }
};

export default function ProDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [pendingBookings, setPendingBookings] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [monthlyEarnings, setMonthlyEarnings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const planId = 'premium-149-mad';

  // 1. Chargement des données sécurisé
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      // Si pas d'utilisateur, on attend (AuthContext gère ça)
      if (!user) return;

      try {
        setLoading(true);
        console.log("Chargement Dashboard pour:", user.email);

        const [bookingsRes, statsRes, profileRes] = await Promise.all([
          bookingApi.getMyBookings(),
          proApi.getStats(),
          proApi.getProfile(),
        ]);

        if (isMounted) {
          // Filtrage des réservations en attente
          const pending = Array.isArray(bookingsRes) 
            ? bookingsRes.filter((b: any) => 
                b.status === BookingStatus.REQUESTED || b.status === BookingStatus.ACCEPTED
              ) 
            : [];
            
          setPendingBookings(pending);
          setStats(statsRes);
          setProfile(profileRes);
          setProfileLoading(false);
          
          // Données simulées pour le graphique (en attendant l'API historique)
          setMonthlyEarnings([
            { month: 'Jan', amount: 0 },
            { month: 'Fév', amount: 0 },
            { month: 'Mar', amount: 0 },
            { month: 'Avr', amount: 0 },
            { month: 'Mai', amount: 0 },
            { month: 'Juin', amount: 0 }
          ]);
          
          setLoading(false); // ✅ Arrêt explicite du chargement
        }
      } catch (error) {
        console.error("Erreur Dashboard:", error);
        if (isMounted) {
          // Valeurs par défaut en cas d'erreur pour éviter la page blanche
          setStats({
              totalBookings: 0,
              totalRevenue: 0,
              activeServices: 0,
              averageRating: 5.0
          });
          setLoading(false); // ✅ Arrêt même en cas d'erreur
        }
      }
    };

    fetchData();

    return () => { isMounted = false; };
  }, [user]);

  // 2. Sécurité : Force l'arrêt du spinner après 5 secondes max
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading((l) => {
        if (l) console.warn("Dashboard : Délai d'attente dépassé, arrêt forcé du spinner.");
        return false;
      });
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Handlers
  const handleAccept = async (bookingId: string) => {
    try {
      await bookingApi.updateStatus(bookingId, BookingStatus.ACCEPTED);
      setPendingBookings(prev => prev.filter(b => b.id !== bookingId));
      toast.success('Demande acceptée');
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'acceptation");
    }
  };

  const handleRefuse = async (bookingId: string) => {
    try {
      await bookingApi.updateStatus(bookingId, BookingStatus.DECLINED);
      setPendingBookings(prev => prev.filter(b => b.id !== bookingId));
      toast.success('Demande refusée');
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors du refus");
    }
  };

  const handleComplete = async (bookingId: string) => {
    try {
      await bookingApi.updateStatus(bookingId, BookingStatus.COMPLETED);
      setPendingBookings(prev => prev.filter(b => b.id !== bookingId));
      toast.success('Prestation marquée comme terminée');
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la complétion");
    }
  };

  const handleCreateService = () => {
    router.push('/dashboard/pro/services');
  };

  const missingFieldsLabels: Record<string, string> = {
    phone: 'Téléphone vérifié',
    cgu: 'CGU acceptées',
    city: 'Ville',
    bio: 'Bio (50+ caractères)',
    service: 'Au moins 1 service actif',
  };

  const canUpgrade =
    profile?.verificationStatus === 'APPROVED' &&
    profile?.isActiveEligible &&
    !profile?.isPremium;

  const upgradeReason = !profile
    ? 'Profil en chargement'
    : profile.isPremium
      ? 'Déjà Premium'
      : profile.verificationStatus !== 'APPROVED'
        ? 'Premium nécessite Verified'
        : !profile.isActiveEligible
          ? 'Profil incomplet'
          : '';

  const handleUpgrade = async () => {
    if (!canUpgrade || upgradeLoading) return;
    try {
      setUpgradeLoading(true);
      await proApi.upgradePremium(planId);
      setProfile((prev) => (prev ? { ...prev, isPremium: true } : prev));
      const refreshed = await proApi.getProfile();
      setProfile(refreshed);
      toast.success('Premium activé');
    } catch (error: any) {
      console.error(error);
      const msg = error?.response?.data?.message || 'Erreur lors de l’activation Premium';
      toast.error(msg);
    } finally {
      setUpgradeLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F97B22]"></div>
            <p className="text-gray-500 text-sm animate-pulse">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex flex-col md:flex-row justify-between md:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 font-heading">
              Bonjour, {user?.firstName || 'Professionnel'} ! 👋
            </h1>
            <p className="text-gray-500">
              Gérez vos réservations et suivez vos performances
            </p>
          </div>
          <Button 
              onClick={handleCreateService} 
              className="bg-[#F97B22] hover:bg-[#d95f0d] text-white flex items-center space-x-2 px-6 py-6 rounded-xl shadow-lg shadow-orange-500/20"
          >
            <Plus className="h-5 w-5" />
            <span className="font-bold">Créer un service</span>
          </Button>
        </motion.div>

        {/* Visibilité / Statuts Pro */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle className={`h-5 w-5 ${profile?.verificationStatus === 'APPROVED' ? 'text-green-600' : 'text-gray-400'}`} />
              <span data-testid="pro-badge-verified">
                {profile?.verificationStatus === 'APPROVED' ? 'Verified' : 'Non vérifié'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Star className={`h-5 w-5 ${profile?.isPremium ? 'text-amber-500' : 'text-gray-400'}`} />
              <span data-testid="pro-badge-premium">
                {profile?.isPremium ? 'Premium actif' : 'Premium inactif'}
              </span>
            </div>
            <div className="text-sm text-gray-600" data-testid="pro-verification-status">
              Statut vérification : {profile?.verificationStatus ?? '—'}
            </div>
          </Card>
          <Card className="p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className={`h-5 w-5 ${profile?.isActiveEligible ? 'text-green-600' : 'text-orange-500'}`} />
              <span>
                {profile?.isActiveEligible ? 'Profil actif et éligible' : 'Profil incomplet'}
              </span>
            </div>
            <div data-testid="pro-missing-fields" className="text-sm text-gray-600">
              {!profileLoading && profile && (!profile.missingFields || profile.missingFields.length === 0) && 'Aucun champ manquant'}
              {profile?.missingFields?.length
                ? (
                  <ul className="list-disc list-inside space-y-1">
                    {profile.missingFields.map((field) => (
                      <li key={field}>{missingFieldsLabels[field] ?? field}</li>
                    ))}
                  </ul>
                )
                : null}
            </div>
          </Card>
          <Card className="p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              <span className="font-semibold">Upgrade Premium</span>
            </div>
            <p className="text-sm text-gray-600">Premium réservé aux pros vérifiés et profils complets.</p>
            <Button
              data-testid="pro-upgrade-premium"
              disabled={!canUpgrade || upgradeLoading}
              onClick={handleUpgrade}
              className="w-full"
            >
              {upgradeLoading ? 'Activation...' : profile?.isPremium ? 'Déjà Premium' : 'Activer Premium'}
            </Button>
            {upgradeReason && <p className="text-xs text-gray-500">{upgradeReason}</p>}
          </Card>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            {
              title: 'Réservations',
              value: stats?.totalBookings || 0,
              icon: 'CheckCircle',
              bgColor: 'bg-green-50',
              color: 'text-green-600'
            },
            {
              title: 'Revenus',
              value: `${stats?.totalEarnings || stats?.totalRevenue || 0} DH`,
              icon: 'Wallet',
              bgColor: 'bg-blue-50',
              color: 'text-blue-600'
            },
            {
              title: 'Services actifs',
              value: stats?.activeServices || 0,
              icon: 'Settings',
              bgColor: 'bg-purple-50',
              color: 'text-purple-600'
            },
            {
              title: 'Note moyenne',
              value: Number(stats?.averageRating || 5).toFixed(1),
              icon: 'Star',
              bgColor: 'bg-yellow-50',
              color: 'text-yellow-600'
            }
          ].map((stat, index) => {
            const IconComponent = getIcon(stat.icon);
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className="p-6 border-none shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <IconComponent className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* À traiter */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-6 border-none shadow-sm h-full">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#F97B22]" /> À traiter
              </h2>
              
              {pendingBookings.length === 0 ? (
                  <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                      <p className="text-gray-500">Aucune demande en attente 🎉</p>
                  </div>
              ) : (
                  <div className="space-y-4">
                  {pendingBookings.map((booking) => (
                      <div key={booking.id} className="p-4 border border-gray-100 bg-white rounded-xl shadow-sm hover:border-[#F97B22]/30 transition-colors">
                      <div className="flex justify-between items-start">
                          <div>
                          <h3 className="font-bold text-gray-900">
                              {booking.service?.name || 'Service inconnu'}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                              <User className="w-3 h-3" /> {booking.client?.firstName || 'Client'}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> {booking.timeSlot ? new Date(booking.timeSlot).toLocaleString() : 'Date à préciser'}
                          </p>
                          <p className="text-xs text-gray-400">Statut : {booking.status}</p>
                          </div>
                          <div className="text-right flex flex-col items-end gap-3">
                          <p className="font-bold text-[#F97B22] text-lg">
                              {booking.totalPrice || booking.price} DH
                          </p>
                          <div className="flex space-x-2">
                              {booking.status === BookingStatus.REQUESTED && (
                                <>
                                  <Button
                                    size="sm"
                                    className="bg-green-500 hover:bg-green-600 text-white border-none"
                                    onClick={() => handleAccept(booking.id)}
                                    data-testid="pro-accept"
                                  >
                                    Accepter
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={() => handleRefuse(booking.id)}
                                    data-testid="pro-decline"
                                  >
                                    Refuser
                                  </Button>
                                </>
                              )}
                              {booking.status === BookingStatus.ACCEPTED && (
                                <Button
                                  size="sm"
                                  className="bg-blue-500 hover:bg-blue-600 text-white border-none"
                                  onClick={() => handleComplete(booking.id)}
                                  data-testid="pro-complete"
                                >
                                  Marquer terminé
                                </Button>
                              )}
                          </div>
                          </div>
                      </div>
                      </div>
                  ))}
                  </div>
              )}
            </Card>
          </motion.div>

          {/* Revenus */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="p-6 border-none shadow-sm h-full">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-green-600" /> Revenus (6 derniers mois)
              </h2>
              <div className="flex items-end justify-between h-64 space-x-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
                {monthlyEarnings.length > 0 ? monthlyEarnings.map((earning, index) => {
                  const maxAmount = Math.max(...monthlyEarnings.map(e => e.amount), 100);
                  const height = (earning.amount / maxAmount) * 100;
                  return (
                    <div key={index} className="flex flex-col items-center flex-1 h-full justify-end group">
                      <div className="relative w-full flex justify-center">
                          <span className="absolute -top-8 text-xs font-bold bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                              {earning.amount} DH
                          </span>
                      </div>
                      <div
                        className="w-full bg-[#F97B22]/80 hover:bg-[#F97B22] rounded-t-lg transition-all duration-300"
                        style={{ height: `${height}%`, minHeight: '4px' }}
                      ></div>
                      <span className="text-xs mt-3 font-medium text-gray-500">
                        {earning.month}
                      </span>
                    </div>
                  );
                }) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    <div className="text-center">
                      <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      Données de revenus non disponibles
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
