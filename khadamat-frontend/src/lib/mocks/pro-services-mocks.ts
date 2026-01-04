export interface ProService {
  id: string;
  name: string;
  category: string;
  pricingType?: 'FIXED' | 'QUOTE';
  price?: number | null;
  description: string;
  isActive: boolean;
  proUserId?: string;
  proProfileId?: string;
}

export const mockProServices: ProService[] = [
  {
    id: '1',
    name: 'Reparation de plomberie',
    category: 'Plomberie',
    pricingType: 'FIXED',
    price: 150,
    description: 'Reparation de fuites, installation de robinets et depannage plomberie general.',
    isActive: true,
  },
  {
    id: '2',
    name: 'Installation electrique',
    category: 'Electricite',
    pricingType: 'FIXED',
    price: 200,
    description: 'Installation de prises, interrupteurs et depannage electrique de base.',
    isActive: true,
  },
  {
    id: '3',
    name: 'Peinture interieure',
    category: 'Peinture',
    pricingType: 'QUOTE',
    price: null,
    description: 'Peinture de murs interieurs avec preparation et finition professionnelle.',
    isActive: false,
  },
  {
    id: '4',
    name: 'Jardinage complet',
    category: 'Jardinage',
    pricingType: 'FIXED',
    price: 250,
    description: 'Taille, arrosage et entretien general de jardins et espaces verts.',
    isActive: true,
  },
  {
    id: '5',
    name: 'Reparation de climatisation',
    category: 'Climatisation',
    pricingType: 'FIXED',
    price: 400,
    description: 'Depannage et reparation de systemes de climatisation et ventilation.',
    isActive: true,
  },
];
