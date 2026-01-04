'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button'; // Assure-toi que ce bouton existe, sinon utilise un <button> standard
import { LanguageToggle } from '@/components/ui/language-toggle'; // Idem
import { Menu, X, User, LogIn, UserPlus, Settings, LogOut, Search, Bell, ChevronDown } from 'lucide-react';
import { useAuth, useIsClient, useIsPro, useIsAdmin } from '@/lib/auth-context';

export const Header: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const isClient = useIsClient();
  const isPro = useIsPro();
  const isAdmin = useIsAdmin();
  const isAuthenticated = !!user;

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // --- ANIMATIONS SCROLL (Ton ancien design) ---
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 50, 100], [0.9, 0.95, 0.98]);
  const headerBlur = useTransform(scrollY, [0, 50, 100], [10, 12, 15]);
  const headerScale = useTransform(scrollY, [0, 50], [1, 0.995]);
  const headerY = useTransform(scrollY, [0, 50], [0, -2]);
  const logoRotation = useTransform(scrollY, [0, 100], [0, 1]);
  
  // Parallax Patterns (Recréés depuis ton JS)
  const arabesqueParallax = useTransform(scrollY, [0, 500], [0, -50]);
  const geometricParallax = useTransform(scrollY, [0, 500], [0, 30]);
  const starPatternParallax = useTransform(scrollY, [0, 500], [0, -20]);

  // --- LOGIQUE FONCTIONNELLE ---
  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleDashboardRedirect = () => {
    if (isAdmin) router.push('/admin/dashboard');
    else if (isPro) router.push('/dashboard/pro');
    else if (isClient) router.push('/dashboard/client');
    else router.push('/dashboard');
  };

  const getUserDisplayName = () => {
    if (user?.clientProfile) return `${user.clientProfile.firstName} ${user.clientProfile.lastName}`;
    if (user?.proProfile) return `${user.proProfile.firstName} ${user.proProfile.lastName}`;
    return user?.email || 'Utilisateur';
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Blog', href: '/blog' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50'
          : 'bg-transparent'
      }`}
      style={{
        backdropFilter: `blur(${headerBlur}px)`,
        backgroundColor: headerOpacity,
        scale: headerScale,
        y: headerY
      }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, type: "spring", stiffness: 100, damping: 20 }}
    >
      {/* --- MOTIFS D'ARRIÈRE-PLAN (Provenant de ton JS) --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div className="absolute top-2 right-20 opacity-5" style={{ y: arabesqueParallax }}>
          <svg width="60" height="60" viewBox="0 0 100 100" className="text-orange-600">
             <path d="M50 10 C70 10, 90 30, 90 50 C90 70, 70 90, 50 90 C30 90, 10 70, 10 50 C10 30, 30 10, 50 10" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
             <circle cx="50" cy="50" r="3" fill="currentColor" opacity="0.5"/>
          </svg>
        </motion.div>
        <motion.div className="absolute top-4 left-32 opacity-5" style={{ y: geometricParallax }}>
           <svg width="40" height="40" viewBox="0 0 100 100" className="text-blue-600">
             <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4"/>
           </svg>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          {/* LOGO */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link href="/" className="flex items-center space-x-3 group relative">
              <motion.img 
                src="/logoSITE.png" 
                alt="Khadamat Logo" 
                className="h-16 w-auto" 
                style={{ rotate: logoRotation }}
              />
              <div className="flex flex-col">
                <span className="text-2xl font-black bg-gradient-to-r from-gray-900 to-orange-800 bg-clip-text text-transparent font-heading">
                  Khadamat
                </span>
                <motion.span 
                  className="text-xs text-gray-500 hidden sm:block font-medium"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                >
                  Plateforme #1 au Maroc
                </motion.span>
              </div>
            </Link>
          </motion.div>

          {/* NAV DESKTOP */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="text-gray-600 hover:text-orange-600 transition-colors font-medium relative group"
                >
                  <span className="inline-block relative">
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* ACTIONS */}
          <div className="hidden lg:flex items-center space-x-3">
            {isAuthenticated && user ? (
              <div className="relative user-dropdown-container">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-orange-50 transition-colors"
                  data-testid="user-menu-button"
                >
                  <div className="w-8 h-8 bg-[#F97B22] rounded-full flex items-center justify-center text-white">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {getUserDisplayName()}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-xl z-50 overflow-hidden">
                    <button onClick={handleDashboardRedirect} className="w-full text-left px-4 py-2 text-sm hover:bg-orange-50 flex items-center gap-2">
                       <User className="w-4 h-4" /> Tableau de bord
                    </button>
                    <button onClick={() => router.push('/profile')} className="w-full text-left px-4 py-2 text-sm hover:bg-orange-50 flex items-center gap-2">
                       <Settings className="w-4 h-4" /> Profil
                    </button>
                    <div className="border-t my-1"></div>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2" data-testid="nav-logout">
                       <LogOut className="w-4 h-4" /> Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => router.push('/auth/login')} className="flex gap-2" data-testid="nav-login">
                  <LogIn className="w-4 h-4" /> Connexion
                </Button>
                <Button size="sm" onClick={() => router.push('/auth/signup')} className="bg-[#F97B22] hover:bg-orange-600 text-white flex gap-2">
                  <UserPlus className="w-4 h-4" /> S'inscrire
                </Button>
                <Button variant="outline" size="sm" onClick={() => router.push('/devenir-pro')} className="border-yellow-400 text-yellow-700 hover:bg-yellow-50 flex gap-2">
                  Devenir Pro
                </Button>
              </>
            )}
            
            <LanguageToggle />
          </div>

          {/* MOBILE TOGGLE */}
          <button className="lg:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      
      {/* MOBILE MENU (Simplifié pour la démo) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="lg:hidden bg-white border-t overflow-hidden">
                <nav className="p-4 space-y-4">
                    {navigation.map(item => (
                        <Link key={item.name} href={item.href} className="block font-medium text-gray-700">{item.name}</Link>
                    ))}
                    {!isAuthenticated && <Button fullWidth onClick={() => router.push('/auth/login')}>Connexion</Button>}
                </nav>
            </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
