'use client';

import React, { useState } from 'react';
import { PersonalizedRecommendations } from '@/components/client/personalized-recommendations';
import { TrustBadgeSystem, ClientSuccessStories, TrustIndicators } from '@/components/client/trust-badge-system';
import { CustomizableDashboard } from '@/components/pro/customizable-dashboard';
import { AIBusinessInsights } from '@/components/pro/ai-business-insights';
import { AdvancedReporting } from '@/components/pro/advanced-reporting';
import { MobileBottomNav } from '@/components/ui/mobile-bottom-nav';
import { useResponsive } from '@/hooks/use-responsive';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Calendar, 
  MessageSquare, 
  Heart, 
  User,
  TrendingUp,
  Settings,
  Bell
} from 'lucide-react';

/**
 * Complete Client Dashboard Example
 * Demonstrates integration of all Phase 2 (Week 7-8) features
 */
export const CompleteClientDashboard: React.FC = () => {
  const { isMobile, isTablet } = useResponsive();
  const { metrics, getOverallScore } = usePerformanceMonitoring();
  const [activeTab, setActiveTab] = useState('home');

  // Mock user data
  const userId = 'client-123';
  const bookingHistory: string[] = [];

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Header */}
      <header className="bg-gradient-to-br from-[rgba(250,247,242,0.95)] to-[rgba(255,255,255,0.8)] backdrop-blur-sm border-b border-[#EDEEEF] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#3B3B3B] font-heading">
                Tableau de bord Client
              </h1>
              <p className="text-sm text-[#6B7280]">
                Bienvenue, Sarah M.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
        <div className="space-y-8">
          {/* Performance Badge (Development Only) */}
          {process.env.NODE_ENV === 'development' && (
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Performance Score
                  </p>
                  <p className="text-xs text-blue-700">
                    LCP: {metrics.lcp.toFixed(0)}ms | FID: {metrics.fid.toFixed(0)}ms
                  </p>
                </div>
                <Badge className="bg-blue-600 text-white">
                  {getOverallScore()}/100
                </Badge>
              </div>
            </Card>
          )}

          {/* Personalized Recommendations */}
          <section>
            <PersonalizedRecommendations
              userId={userId}
              bookingHistory={bookingHistory}
              maxRecommendations={6}
            />
          </section>

          {/* Advanced Booking Manager */}
          {/* Trust & Social Proof Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ClientSuccessStories maxStories={3} />
            
            <Card className="bg-gradient-to-br from-[rgba(250,247,242,0.8)] to-[rgba(255,255,255,0.5)] backdrop-blur-sm border-[#EDEEEF] p-6">
              <h3 className="text-lg font-bold text-[#3B3B3B] mb-4 font-heading">
                Professionnel en vedette
              </h3>
              <TrustBadgeSystem
                professional={{
                  id: 'pro-1',
                  name: 'Fatima Z.',
                  rating: 4.9,
                  reviewCount: 127,
                  completedProjects: 156,
                  responseTime: 1.5,
                  verified: true,
                  joinedDate: '2022-01-15'
                }}
                showDescription={true}
              />
              <div className="mt-6">
                <TrustIndicators
                  professional={{
                    id: 'pro-1',
                    name: 'Fatima Z.',
                    rating: 4.9,
                    reviewCount: 127,
                    completedProjects: 156,
                    responseTime: 1.5,
                    verified: true,
                    joinedDate: '2022-01-15'
                  }}
                />
              </div>
            </Card>
          </section>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <MobileBottomNav />
      )}
    </div>
  );
};

/**
 * Complete Professional Dashboard Example
 * Demonstrates integration of all Phase 3 (Week 9-10) features
 */
export const CompleteProfessionalDashboard: React.FC = () => {
  const { isMobile } = useResponsive();
  const { metrics, getOverallScore } = usePerformanceMonitoring();
  const [activeTab, setActiveTab] = useState('home');

  // Mock business data
  const businessData = {
    revenue: 18500,
    bookings: 127,
    averageRating: 4.9,
    completionRate: 98
  };

  const handleImplementInsight = (insight: any) => {
    console.log('Implementing insight:', insight);
  };

  const handleGenerateReport = async (config: any) => {
    console.log('Generating report with config:', config);
  };

  const handleScheduleReport = async (config: any) => {
    console.log('Schedule:', config);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Header */}
      <header className="bg-gradient-to-br from-[rgba(250,247,242,0.95)] to-[rgba(255,255,255,0.8)] backdrop-blur-sm border-b border-[#EDEEEF] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#3B3B3B] font-heading">
                Tableau de bord Professionnel
              </h1>
              <p className="text-sm text-[#6B7280]">
                Bienvenue, Ahmed M.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-green-100 text-green-700">
                <TrendingUp className="w-3 h-3 mr-1" />
                +15.2% ce mois
              </Badge>
              <Button variant="ghost" size="sm">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
        <div className="space-y-8">
          {/* Performance Badge (Development Only) */}
          {process.env.NODE_ENV === 'development' && (
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-900">
                    Performance Score
                  </p>
                  <p className="text-xs text-green-700">
                    Page optimized for {isMobile ? 'mobile' : 'desktop'}
                  </p>
                </div>
                <Badge className="bg-green-600 text-white">
                  {getOverallScore()}/100
                </Badge>
              </div>
            </Card>
          )}

          {/* Customizable Dashboard */}
          <section>
            <CustomizableDashboard />
          </section>

          {/* AI Business Insights */}
          <section>
            <AIBusinessInsights
              businessData={businessData}
              onImplement={handleImplementInsight}
              onLearnMore={(insight) => console.log('Learn more:', insight)}
            />
          </section>

          {/* Advanced Reporting */}
          <section>
            <AdvancedReporting
              onGenerateReport={handleGenerateReport}
              onScheduleReport={handleScheduleReport}
            />
          </section>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <MobileBottomNav />
      )}
    </div>
  );
};

/**
 * Usage Example in Next.js App Router
 * 
 * // app/client/dashboard/page.tsx
 * import { CompleteClientDashboard } from '@/components/examples/complete-dashboard-examples';
 * 
 * export default function ClientDashboardPage() {
 *   return <CompleteClientDashboard />;
 * }
 * 
 * // app/pro/dashboard/page.tsx
 * import { CompleteProfessionalDashboard } from '@/components/examples/complete-dashboard-examples';
 * 
 * export default function ProDashboardPage() {
 *   return <CompleteProfessionalDashboard />;
 * }
 */
