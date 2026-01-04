'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { type ProfessionalDetail } from '@/lib/mocks/services-mocks';

interface ProServicesProps {
  professional: ProfessionalDetail;
}

export const ProServices: React.FC<ProServicesProps> = ({ professional }) => {
  return (
    <Card className="bg-gradient-to-br from-[rgba(250,247,242,0.8)] to-[rgba(255,255,255,0.5)] backdrop-blur-sm rounded-[24px] p-8 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
      <h2 className="text-h2 font-semibold text-text-primary mb-6 font-heading">Services & Tarifs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {professional.services.map((service) => (
          <div key={service.id} className="bg-surface rounded-lg p-4 border border-border-light">
            <div className="flex items-center justify-between mb-2 gap-2">
              <h3 className="font-semibold text-text-primary">{service.name}</h3>
              <span className="text-xs px-2 py-1 rounded-full bg-primary-50 text-primary-700 font-semibold uppercase">
                {service.pricingType === 'QUOTE' ? 'QUOTE' : 'FIXED'}
              </span>
            </div>
            <p className="text-sm text-text-secondary mb-3">{service.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-primary-600">
                {service.pricingType === 'QUOTE' ? 'Prix sur devis' : `${service.price ?? service.basePrice ?? 0} MAD`}
              </span>
              <span className="text-sm text-text-muted">{service.duration}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
