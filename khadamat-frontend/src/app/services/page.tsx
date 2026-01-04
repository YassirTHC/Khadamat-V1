'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { mockCategories } from '@/lib/mocks/services-mocks';

type Category = { id: string; name: string; description?: string };

const CategoryCard: React.FC<{ category: Category }> = ({ category }) => {
  return (
    <Link href={`/pros?categoryId=${category.id}`} data-testid="service-category-card">
      <Card className="h-full p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 bg-white/80">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
          <Badge>Catégorie</Badge>
        </div>
        <p className="text-sm text-gray-600">
          {category.description || 'Voir les professionnels disponibles pour cette catégorie.'}
        </p>
        <div className="mt-4 text-sm text-primary-600 font-semibold">Voir les pros →</div>
      </Card>
    </Link>
  );
};

const ServicesPageContent = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>(mockCategories as any);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Compat: si un lien legacy pointe vers /services?categoryId=..., rediriger vers /pros
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('categoryId')) {
        router.replace(`/pros?${params.toString()}`);
        return;
      }
    }

    const load = async () => {
      try {
        setLoading(true);
        const res = await api.getCategories();
        const normalized = Array.isArray(res)
          ? res
          : res?.categories || res?.items || [];
        if (Array.isArray(normalized) && normalized.length) {
          setCategories(
            normalized.map((c: any) => ({ id: c.id, name: c.name, description: c.description })),
          );
        }
      } catch (err) {
        console.warn('Using fallback categories', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16">
        <section className="relative py-12 md:py-16">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-primary-200/20 to-primary-300/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
            <div className="absolute top-40 right-10 w-80 h-80 bg-gradient-to-br from-secondary-300/20 to-primary-500/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.02)_1px,transparent_0)] bg-[length:24px_24px] opacity-20"></div>
          </div>

          <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-h1 font-bold text-text-primary leading-tight tracking-tight font-heading mb-4">
                Trouvez un service par catégorie
              </h1>
              <p className="text-body text-text-secondary leading-relaxed font-body mb-8 max-w-2xl mx-auto">
                Choisissez une catégorie et découvrez les professionnels disponibles dans votre ville.
              </p>
            </div>
          </div>
        </section>

        <section className="py-8 bg-gradient-to-br from-[rgba(250,247,242,0.8)] to-[rgba(255,255,255,0.5)] backdrop-blur-sm">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
              {loading && categories.length === 0 && (
                <div className="col-span-full text-center text-gray-500">Chargement des catégories...</div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background">
          <Header />
          <main className="pt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="animate-pulse space-y-8">
                <div className="h-8 bg-surface rounded w-1/3"></div>
                <div className="h-12 bg-surface rounded w-full"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-64 bg-surface rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      }
    >
      <ServicesPageContent />
    </Suspense>
  );
}
