'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  className 
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  // 1. On attend que le composant soit monté côté client (Hydration safe)
  useEffect(() => {
    setMounted(true);
  }, []);

  // 2. On gère le scroll du body (Bloquer le scroll quand modal ouverte)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Nettoyage au démontage
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // 3. Gestion de la touche ECHAP
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // ✅ CORRECTION CRITIQUE : Cette condition est placée APRÈS tous les hooks
  // pour éviter l'erreur "Rendered more hooks than during the previous render"
  if (!mounted) return null;

  // Sécurité supplémentaire pour s'assurer que document existe (SSR)
  if (typeof document === 'undefined') return null;

  // On utilise createPortal pour sortir la modal du flux HTML normal
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
          data-e2e="modal-container"
        >
          
          {/* OVERLAY (Fond sombre) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
          />

          {/* CONTENU MODAL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.3 }}
            className={cn(
              "relative w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]",
              {
                'max-w-md': size === 'sm',
                'max-w-lg': size === 'md',
                'max-w-2xl': size === 'lg',
                'max-w-4xl': size === 'xl',
              },
              className
            )}
            role="dialog"
            aria-modal="true"
            aria-label={title || 'Modal'}
            data-e2e="booking-modal-v2-root"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-4 border-b border-gray-100"
              data-e2e="modal-header-probe"
            >
              <h3 className="text-lg font-bold text-gray-900 font-heading">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-[#F97B22]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body Scrollable */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
