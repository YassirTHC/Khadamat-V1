// @ts-nocheck
import { apiClient } from '@/lib/api/client';

export const messagingService = {
  // Récupérer toutes les conversations
  async getConversations() {
    const response = await apiClient.get('/messaging/conversations');
    return response.data;
  },

  // ✅ Récupérer UNE conversation par son ID
  async getConversationById(id: string) {
    const response = await apiClient.get(`/messaging/conversations/${id}`);
    return response.data;
  },

  // Compter les messages non-lus
  async getUnreadCount() {
    const response = await apiClient.get('/messaging/unread-count');
    return response.data;
  },

  // Envoyer un message
  async sendMessage(conversationId: string, content: string) {
    const response = await apiClient.post(`/messaging/conversations/${conversationId}/messages`, { content });
    return response.data;
  }
};
