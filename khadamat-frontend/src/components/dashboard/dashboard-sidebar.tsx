'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  Heart,
  History,
  Settings,
  LogOut,
  User,
  X,
  Wallet,
  Briefcase,
  ChevronRight
} from 'lucide-react';

interface DashboardSidebarProps {
  userType: 'client' | 'pro';
  userName: string;
  userAvatar?: string;
  unreadMessages?: number;
  onClose?: () => void; // Pour fermer le menu sur mobile
  className?: string; // Pour surcharger les classes si besoin
}

// 🟢 Navigation CLIENT
const clientNavigation = [
  { name: 'Vue d\'ensemble', href: '/dashboard/client', icon: LayoutDashboard },
  { name: 'Mes Réservations', href: '/dashboard/client/history', icon: History },
  { name: 'Messages', href: '/dashboard/client/messages', icon: MessageSquare },
  { name: 'Favoris', href: '/dashboard/client/favorites', icon: Heart },
  { name: 'Paramètres', href: '/dashboard/client/settings', icon: Settings },
];

// 🟠 Navigation PRO
const proNavigation = [
  { name: 'Tableau de bord', href: '/dashboard/pro', icon: LayoutDashboard },
  { name: 'Planning', href: '/dashboard/pro/bookings', icon: Calendar },
  { name: 'Mes Services', href: '/dashboard/pro/services', icon: Briefcase },
  { name: 'Revenus', href: '/dashboard/pro/earnings', icon: Wallet },
  { name: 'Messages', href: '/dashboard/pro/messages', icon: MessageSquare },
  { name: 'Paramètres', href: '/dashboard/pro/settings', icon: Settings },
];

export function DashboardSidebar({ 
  userType, 
  userName, 
  userAvatar, 
  unreadMessages = 0, 
  onClose,
  className 
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  
  const navigation = userType === 'client' ? clientNavigation : proNavigation;

  const handleLogoutClick = () => {
    logout();
    // On force un rechargement complet pour nettoyer le cache
    window.location.href = '/'; 
  };

  return (
    <>
    {/* Diagramme contextuel pour visualiser la structure */}
    {/* 

[Image of dashboard layout wireframe]
 */}
    
    <div className={cn("flex flex-col h-full bg-white border-r border-gray-100 w-72 transition-all duration-300", className)}>
      
      {/* 1. HEADER : Logo & Close Mobile */}
      <div className="flex items-center justify-between h-20 px-6 border-b border-gray-100/50">
        <Link href="/" className="group flex items-center gap-2">
          {/* Logo simplifié ou complet */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F97B22] to-[#D95F0D] flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
            K
          </div>
          <span className="font-heading font-bold text-xl text-gray-900 tracking-tight">
            Khadamat
          </span>
        </Link>
        
        {/* Bouton fermer (visible uniquement si onClose est passé - mobile) */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* 2. NAVIGATION (Scrollable) */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Menu Principal
        </p>
        
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                'group flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                isActive
                  ? 'bg-[#F97B22]/10 text-[#F97B22]' // Style Actif : Fond léger + Texte Orange
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900' // Style Inactif
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  className={cn(
                    'h-5 w-5 transition-colors',
                    isActive ? 'text-[#F97B22]' : 'text-gray-400 group-hover:text-gray-600'
                  )}
                />
                <span>{item.name}</span>
              </div>

              {/* Badges et Indicateurs */}
              {item.name === 'Messages' && unreadMessages > 0 ? (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm animate-pulse">
                  {unreadMessages}
                </span>
              ) : isActive && (
                // Petite flèche ou barre quand actif
                <div className="w-1.5 h-1.5 rounded-full bg-[#F97B22]" />
              )}
            </Link>
          );
        })}
      </div>

      {/* 3. FOOTER : Profil Utilisateur (En bas) */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-200/60 shadow-sm hover:shadow-md transition-shadow cursor-default group relative">
          
          {/* Avatar */}
          <div className="relative">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName}
                className="w-10 h-10 rounded-full object-cover border border-gray-100"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-[#F97B22]">
                <User className="w-5 h-5" />
              </div>
            )}
            {/* Indicateur en ligne */}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </div>

          {/* Info Texte */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">
              {userName}
            </p>
            <p className="text-xs text-gray-500 truncate capitalize flex items-center gap-1">
              {userType === 'pro' ? 'Professionnel' : 'Client'}
            </p>
          </div>

          {/* Bouton Logout (Icône seule pour gagner de la place) */}
          <button
            onClick={handleLogoutClick}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Se déconnecter"
            data-testid="dashboard-logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
