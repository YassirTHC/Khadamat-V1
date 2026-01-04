'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context'; // On utilise le contexte global pour la synchro
import { Loader2, ArrowRight, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth(); // On utilise la fonction du Contexte
  
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // On efface l'erreur dès que l'utilisateur tape
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Connexion via le contexte (stocke le token et met à jour le user)
      await login(formData.identifier, formData.password);
      
      // 2. ✅ REDIRECTION FORCÉE ET IMMÉDIATE
      // On utilise replace pour qu'il ne puisse pas faire "précédent" pour revenir au login
      console.log('Login successful, redirecting to dashboard: /dashboard');
      router.replace('/dashboard');
      
    } catch (err: any) {
      console.error("Erreur Login:", err);
      // Message d'erreur convivial
      const msg = err.response?.data?.message || 'Email ou mot de passe incorrect.';
      setError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      
      {/* 🟢 GAUCHE : Formulaire */}
      <div className="flex items-center justify-center p-8 bg-white relative">
        <div className="w-full max-w-md space-y-8">
          
          {/* En-tête du formulaire */}
          <div className="text-center">
            <Link href="/" className="inline-block mb-8 group">
              <span className="text-4xl font-extrabold bg-gradient-to-r from-[#F97B22] to-[#D95F0D] bg-clip-text text-transparent font-heading tracking-tight group-hover:opacity-80 transition-opacity">
                Khadamat
              </span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-3 font-heading">
              Bon retour ! 👋
            </h1>
            <p className="text-gray-500 font-body">
              Entrez vos identifiants pour accéder à votre espace
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Message d'erreur animé */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm font-medium"
              >
                <AlertCircle size={20} className="flex-shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Login Method Tabs */}
            <div className="space-y-4">
              <div className="flex rounded-xl bg-gray-100 p-1">
                <button
                  type="button"
                  onClick={() => setLoginMethod('email')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                    loginMethod === 'email'
                      ? 'bg-white text-[#F97B22] shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('phone')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                    loginMethod === 'phone'
                      ? 'bg-white text-[#F97B22] shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Téléphone
                </button>
              </div>

              {/* Input Email/Phone */}
              <div className="space-y-2">
                <label htmlFor="identifier" className="block text-sm font-semibold text-gray-700 ml-1">
                  {loginMethod === 'email' ? 'Email' : 'Numéro de téléphone'}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {loginMethod === 'email' ? (
                      <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-[#F97B22] transition-colors" />
                    ) : (
                      <svg className="h-5 w-5 text-gray-400 group-focus-within:text-[#F97B22] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    )}
                  </div>
                  <input
                    id="identifier"
                    name="identifier"
                    type={loginMethod === 'email' ? 'email' : 'text'}
                    required
                    data-testid="auth-email"
                    placeholder={loginMethod === 'email' ? 'exemple@email.com' : '+212 6XX XXX XXX'}
                    className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F97B22]/20 focus:border-[#F97B22] transition-all duration-200 sm:text-sm bg-gray-50/50 focus:bg-white"
                    value={formData.identifier}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  Mot de passe
                </label>
                <Link 
                  href="/auth/forgot-password" 
                  className="text-sm font-medium text-[#F97B22] hover:text-[#d95f0d] transition-colors"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#F97B22] transition-colors" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F97B22]/20 focus:border-[#F97B22] transition-all duration-200 sm:text-sm bg-gray-50/50 focus:bg-white"
                  value={formData.password}
                  onChange={handleChange}
                  data-testid="auth-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Bouton de soumission */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#F97B22] to-[#ea580c] hover:from-[#ea580c] hover:to-[#d95f0d] text-white py-6 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
              disabled={loading}
              data-testid="auth-submit"
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Se connecter <ArrowRight className="h-5 w-5" />
                </span>
              )}
            </Button>
          </form>

          {/* Pied de page du formulaire */}
          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
              Pas encore de compte ?{' '}
              <Link href="/auth/signup" className="font-bold text-[#F97B22] hover:text-[#d95f0d] hover:underline transition-all">
                Créer un compte gratuitement
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* 🟠 DROITE : Image & Témoignage (Caché sur mobile) */}
      <div className="hidden lg:block relative bg-gray-900 overflow-hidden">
        {/* Image de fond */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop"
            alt="Électricien professionnel Khadamat"
            className="w-full h-full object-cover opacity-90 scale-105 hover:scale-100 transition-transform duration-[20s]"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-[#F97B22]/20" />
        </div>

        {/* Contenu sur l'image */}
        <div className="absolute bottom-0 left-0 right-0 p-16 z-20 text-white">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex gap-1 text-[#F97B22] mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
            <blockquote className="text-3xl font-bold leading-tight mb-6 font-heading">
              "J'ai trouvé un électricien certifié en moins de 10 minutes. Le service client est exceptionnel."
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-xl">
                K
              </div>
              <div>
                <cite className="block font-bold text-lg not-italic">Karim Bennani</cite>
                <span className="text-gray-300 text-sm">Client Vérifié, Casablanca</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

    </div>
  );
}
