// @ts-nocheck
'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MessageSquare, Search, Send, Loader2 } from 'lucide-react';
import apiClientInstance from '@/lib/api-client';
import { Conversation, Message } from '@/types/api';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';

function ProDashboardMessagesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { error: showErrorToast } = useToast();
  const selectedConversationId = searchParams.get('conversation');

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    let filtered = conversations;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(conversation => {
        const lastMessage = conversation.messages[conversation.messages.length - 1];
        const otherParticipant = getOtherParticipant(conversation);
        return (
          otherParticipant?.toLowerCase().includes(query) ||
          lastMessage?.content.toLowerCase().includes(query) ||
          conversation.booking?.serviceCategory.name.toLowerCase().includes(query)
        );
      });
    }

    // Sort by date (most recent first)
    filtered = filtered.sort((a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    setFilteredConversations(filtered);
  }, [conversations, searchQuery]);

  useEffect(() => {
    if (selectedConversationId) {
      loadConversationMessages(selectedConversationId);
    } else {
      setSelectedConversation(null);
      setMessages([]);
    }
  }, [selectedConversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClientInstance.getConversations();
      setConversations(data);
    } catch (err) {
      setError('Erreur lors du chargement des conversations');
      showErrorToast('Erreur lors du chargement des conversations');
    } finally {
      setLoading(false);
    }
  };

  const loadConversationMessages = async (conversationId: string) => {
    try {
      const data = await apiClientInstance.getConversationMessages(conversationId);
      setMessages(data);
      setSelectedConversation(conversations.find(c => c.id === conversationId) || null);
    } catch (err) {
      showErrorToast('Erreur lors du chargement des messages');
    }
  };

  const getOtherParticipant = (conversation: Conversation) => {
    if (!user) return '';
    const otherParticipantId = conversation.participant1Id === user.id
      ? conversation.participant2Id
      : conversation.participant1Id;

    // Find the other participant in the messages
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    if (lastMessage) {
      const sender = lastMessage.sender;
      if (sender.id === otherParticipantId) {
        return sender.clientProfile
          ? `${sender.clientProfile.firstName} ${sender.clientProfile.lastName}`
          : sender.proProfile
          ? `${sender.proProfile.firstName} ${sender.proProfile.lastName}`
          : sender.email;
      }
    }
    return 'Utilisateur';
  };

  const getUnreadCount = (conversation: Conversation) => {
    if (!user) return 0;
    return conversation.messages.filter(msg =>
      msg.senderId !== user.id && !msg.readAt
    ).length;
  };

  const handleConversationClick = (conversation: Conversation) => {
    router.push(`/dashboard/pro/messages?conversation=${conversation.id}`);
  };

  const handleSendMessage = async () => {
    if (!selectedConversation || !newMessage.trim() || sendingMessage) return;

    try {
      setSendingMessage(true);
      await apiClientInstance.sendMessage(selectedConversation.id, { content: newMessage });
      setNewMessage('');
      // Reload messages
      await loadConversationMessages(selectedConversation.id);
      // Reload conversations to update last message
      await loadConversations();
    } catch (err) {
      showErrorToast('Erreur lors de l\'envoi du message');
    } finally {
      setSendingMessage(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const totalUnreadCount = conversations.reduce((total, conv) => total + getUnreadCount(conv), 0);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-16 bg-surface rounded-[24px]"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-surface rounded-[24px]"></div>
              ))}
            </div>
            <div className="h-96 bg-surface rounded-[24px]"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
              {/* Search */}
              <div className="bg-gradient-to-br from-[rgba(250,247,242,0.8)] to-[rgba(255,255,255,0.5)] backdrop-blur-sm rounded-[24px] shadow-[0_8px_24px_rgba(0,0,0,0.06)] p-6 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Rechercher dans vos messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-border-light rounded-[24px] text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-[#F97B22]/20 focus:border-[#F97B22] transition-all duration-200"
                  />
                </div>

                {/* Results Summary */}
                <div className="mt-4 pt-4 border-t border-border-light">
                  <p className="text-sm text-text-secondary">
                    {filteredConversations.length} conversation{filteredConversations.length !== 1 ? 's' : ''} trouvé{filteredConversations.length !== 1 ? 'es' : 'e'}
                    {totalUnreadCount > 0 && (
                      <span className="text-[#F97B22] font-medium"> • {totalUnreadCount} non lu{totalUnreadCount !== 1 ? 's' : ''}</span>
                    )}
                    {searchQuery && (
                      <span> pour "{searchQuery}"</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Messages Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Conversations List */}
                <div className="lg:col-span-2">
                  <div className="bg-gradient-to-br from-[rgba(250,247,242,0.8)] to-[rgba(255,255,255,0.5)] backdrop-blur-sm rounded-[24px] shadow-[0_8px_24px_rgba(0,0,0,0.06)] p-6">
                    <h3 className="text-lg font-bold text-text-primary mb-4 font-heading">
                      Toutes vos conversations
                    </h3>

                    {filteredConversations.length > 0 ? (
                      <div className="space-y-3">
                        {filteredConversations.map((conversation) => {
                          const lastMessage = conversation.messages[conversation.messages.length - 1];
                          const otherParticipant = getOtherParticipant(conversation);
                          const unreadCount = getUnreadCount(conversation);

                          return (
                            <div
                              key={conversation.id}
                              onClick={() => handleConversationClick(conversation)}
                              className={`p-4 rounded-[16px] cursor-pointer transition-all duration-200 ${
                                selectedConversationId === conversation.id
                                  ? 'bg-[#F97B22]/10 border border-[#F97B22]/20'
                                  : 'hover:bg-[#EDEEEF]'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="relative">
                                  <div className="w-10 h-10 bg-[#EDEEEF] rounded-full flex items-center justify-center">
                                    <span className="text-sm font-bold text-text-primary">
                                      {otherParticipant.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-semibold text-text-primary truncate">
                                      {otherParticipant}
                                    </h4>
                                    <span className="text-xs text-text-muted">
                                      {lastMessage ? new Date(lastMessage.createdAt).toLocaleDateString('fr-FR') : ''}
                                    </span>
                                  </div>
                                  <p className="text-xs text-text-secondary truncate">
                                    {conversation.booking ? `${conversation.booking.serviceCategory.name} - ${conversation.booking.city.name}` : 'Conversation'}
                                  </p>
                                  {lastMessage && (
                                    <p className="text-xs text-text-secondary truncate mt-1">
                                      {lastMessage.content}
                                    </p>
                                  )}
                                </div>
                                {unreadCount > 0 && (
                                  <div className="w-5 h-5 bg-[#F97B22] rounded-full flex items-center justify-center">
                                    <span className="text-xs text-white font-bold">{unreadCount}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <MessageSquare className="w-12 h-12 text-text-muted mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-text-primary mb-2">
                          Aucune conversation trouvée
                        </h3>
                        <p className="text-text-secondary mb-4">
                          {searchQuery ? 'Essayez de modifier vos critères de recherche.' : 'Vous n\'avez pas encore de conversations.'}
                        </p>
                        {searchQuery && (
                          <Button
                            onClick={() => setSearchQuery('')}
                            variant="outline"
                            className="border-[#F97B22]/20 text-[#F97B22] hover:bg-[#F97B22]/10"
                          >
                            Voir toutes les conversations
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Message Detail/Compose */}
                <div className="lg:col-span-1">
                  {selectedConversation ? (
                    <div className="bg-gradient-to-br from-[rgba(250,247,242,0.8)] to-[rgba(255,255,255,0.5)] backdrop-blur-sm rounded-[24px] shadow-[0_8px_24px_rgba(0,0,0,0.06)] p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-[#EDEEEF] rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-text-primary">
                            {getOtherParticipant(selectedConversation).split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-text-primary">
                            {getOtherParticipant(selectedConversation)}
                          </h3>
                          <p className="text-sm text-text-secondary">
                            {selectedConversation.booking ? `${selectedConversation.booking.serviceCategory.name}` : 'Conversation'}
                          </p>
                        </div>
                      </div>

                      {/* Messages History */}
                      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                        {messages.map((message) => {
                          const isFromCurrentUser = message.senderId === user?.id;
                          return (
                            <div key={message.id} className={`flex ${isFromCurrentUser ? 'justify-end' : 'justify-start'}`} >
                              <div className={`max-w-xs px-4 py-2 rounded-[16px] ${
                                isFromCurrentUser
                                  ? 'bg-[#F97B22] text-white'
                                  : 'bg-[#EDEEEF] text-text-primary'
                              }`}>
                                <p className="text-sm">{message.content}</p>
                                <p className={`text-xs mt-1 ${isFromCurrentUser ? 'text-orange-100' : 'text-text-muted'}`}>
                                  {new Date(message.createdAt).toLocaleTimeString('fr-FR', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Reply Form */}
                      <div className="space-y-3">
                        <textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Tapez votre message..."
                          rows={3}
                          className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-border-light rounded-[16px] text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-[#F97B22]/20 focus:border-[#F97B22] resize-none"
                          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim() || sendingMessage}
                          className="w-full bg-[#F97B22] hover:bg-[#e66a1f] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {sendingMessage ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4 mr-2" />
                          )}
                          {sendingMessage ? 'Envoi...' : 'Envoyer'}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-[rgba(250,247,242,0.8)] to-[rgba(255,255,255,0.5)] backdrop-blur-sm rounded-[24px] shadow-[0_8px_24px_rgba(0,0,0,0.06)] p-6 text-center">
                      <MessageSquare className="w-12 h-12 text-text-muted mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-text-primary mb-2">
                        Sélectionnez une conversation
                      </h3>
                      <p className="text-text-secondary">
                        Cliquez sur une conversation pour voir les messages.
                      </p>
                    </div>
                  )}
                </div>
              </div>
    </div>
  );
}

export default function ProDashboardMessagesPage() {
  return (
    <Suspense fallback={
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-16 bg-surface rounded-[24px]"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-surface rounded-[24px]"></div>
              ))}
            </div>
            <div className="h-96 bg-surface rounded-[24px]"></div>
          </div>
        </div>
      </div>
    }>
      <ProDashboardMessagesContent />
    </Suspense>
  );
}
