// @ts-nocheck
import { bookingApi } from '@/lib/api-client';

export const bookingService = {
  // Récupérer mes réservations
  async getMyBookings() {
    return await bookingApi.getMyBookings();
  },

  // Créer une réservation
  async create(data: any) {
    return await bookingApi.create(data);
  },

  // Mettre à jour un statut (pour les pros)
  async updateStatus(id: string, status: string) {
    return await bookingApi.updateStatus(id, status);
  }
};
