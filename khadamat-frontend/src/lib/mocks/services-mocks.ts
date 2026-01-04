// Centralized mock data for services page
export type ServiceCategory = any;

// Blog types
export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  category: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  readTime: number; // in minutes
  featuredImage?: string;
  isPublished: boolean;
  views: number;
  likes: number;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  articleCount: number;
  color: string;
}

export const mockCities: any[] = [
  { id: '1', name: 'Casablanca', region: 'Grand Casablanca', isActive: true },
  { id: '2', name: 'Rabat', region: 'Rabat-SalÃ©-Zemmour-ZaÃ«r', isActive: true },
  { id: '3', name: 'Marrakech', region: 'Marrakech-Tensift-Al Haouz', isActive: true },
  { id: '4', name: 'FÃ¨s', region: 'FÃ¨s-Boulemane', isActive: true },
  { id: '5', name: 'Tanger', region: 'Tanger-TÃ©touan', isActive: true },
  { id: '6', name: 'Oujda', region: 'Oriental', isActive: true },
  { id: '7', name: 'Agadir', region: 'Souss-Massa', isActive: true },
  { id: '8', name: 'MeknÃ¨s', region: 'MeknÃ¨s-Tafilalet', isActive: true },
];

export const mockCategories: any[] = [
  { id: '1', name: 'Plomberie', description: 'RÃ©parations et installations de plomberie', icon: 'Wrench', isActive: true },
  { id: '2', name: 'Ã‰lectricitÃ©', description: 'Travaux Ã©lectriques et installations', icon: 'Zap', isActive: true },
  { id: '3', name: 'MÃ©nage', description: 'Services de nettoyage et entretien', icon: 'Home', isActive: true },
  { id: '4', name: 'Peinture', description: 'Peinture intÃ©rieure et extÃ©rieure', icon: 'Palette', isActive: true },
  { id: '5', name: 'Jardinage', description: 'Entretien d\'espaces verts', icon: 'Scissors', isActive: true },
  { id: '6', name: 'MaÃ§onnerie', description: 'Travaux de maÃ§onnerie et construction', icon: 'Hammer', isActive: true },
  { id: '7', name: 'DÃ©mÃ©nagement', description: 'Services de dÃ©mÃ©nagement', icon: 'Truck', isActive: true },
  { id: '8', name: 'Photographie', description: 'Services photographiques', icon: 'Camera', isActive: true },
  { id: '9', name: 'Climatisation', description: 'Installation et rÃ©paration de climatisations', icon: 'Wind', isActive: true },
  { id: '10', name: 'Menuiserie', description: 'Travaux de menuiserie et bois', icon: 'TreePine', isActive: true },
  { id: '11', name: 'Carrelage', description: 'Pose de carrelage et revÃªtements', icon: 'Grid3X3', isActive: true },
  { id: '12', name: 'Vitrerie', description: 'RÃ©paration et remplacement de vitres', icon: 'Square', isActive: true },
  { id: '13', name: 'Serrurerie', description: 'Services de serrurerie d\'urgence', icon: 'Lock', isActive: true },
  { id: '14', name: 'Informatique', description: 'DÃ©pannage et rÃ©paration informatique', icon: 'Monitor', isActive: true },
  { id: '15', name: 'Coiffure', description: 'Services de coiffure Ã  domicile', icon: 'Scissors', isActive: true },
  { id: '16', name: 'Massage', description: 'Massages et soins relaxants', icon: 'Sparkles', isActive: true },
];

// Professional type for pros page
export interface Professional {
  id: string;
  fullName: string;
  avatarUrl?: string;
  cityId: string;
  serviceCategoryId: string;
  title: string;
  shortBio: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isPremium: boolean;
  startingPrice: number;
  experienceYears: number;
  responseTime: string;
  badgeLabels?: string[];
  cityName?: string;
  serviceCategoryName?: string;
  portfolioImages?: string[];
}

// Extended types for detailed professional profiles
export interface ProfessionalService {
  id: string;
  name: string;
  description: string;
  pricingType?: 'FIXED' | 'QUOTE';
  price?: number;
  basePrice?: number | null;
  duration: string; // e.g., "1h", "2h30"
  category: string;
}

export interface ProfessionalReview {
  id: string;
  clientName: string;
  clientAvatar?: string;
  rating: number;
  comment: string;
  serviceName: string;
  date: string; // ISO date string
  verified: boolean;
}

export interface ProfessionalCertification {
  id: string;
  title: string;
  issuer: string;
  year: number;
  description?: string;
}

export interface ProfessionalDetail {
  id: string;
  fullName: string;
  avatarUrl?: string;
  cityId: string;
  serviceCategoryId: string;
  title: string;
  shortBio: string;
  detailedBio: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isPremium: boolean;
  startingPrice: number;
  experienceYears: number;
  responseTime: string;
  badgeLabels?: string[];
  cityName?: string;
  serviceCategoryName?: string;
  languages: string[];
  availability: string;
  completedJobs: number;
  responseRate: number; // percentage
  services: ProfessionalService[];
  reviews: ProfessionalReview[];
  certifications: ProfessionalCertification[];
  portfolioImages?: string[];
  workingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  contactPhone?: string;
}


// Mock professionals data
export const mockProfessionals: Professional[] = [
  {
    id: '1',
    fullName: 'Ahmed Bennani',
    cityId: '1',
    serviceCategoryId: '1',
    title: 'Plombier certifiÃ©',
    shortBio: 'Expert en rÃ©paration et installation de plomberie depuis 12 ans. Intervention rapide et garantie.',
    rating: 4.8,
    reviewCount: 127,
    isVerified: true,
    isPremium: false,
    startingPrice: 150,
    experienceYears: 12,
    responseTime: 'RÃ©pond en moins d\'1h',
    badgeLabels: ['Top choix', 'TrÃ¨s rÃ©actif'],
    cityName: 'Casablanca',
    serviceCategoryName: 'Plomberie',
    portfolioImages: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop'
    ],
  },
  {
    id: '2',
    fullName: 'Fatima Alaoui',
    cityId: '2',
    serviceCategoryId: '2',
    title: 'Ã‰lectricienne expÃ©rimentÃ©e',
    shortBio: 'SpÃ©cialiste en installations Ã©lectriques et dÃ©pannages. SÃ©curitÃ© et qualitÃ© garanties.',
    rating: 4.9,
    reviewCount: 89,
    isVerified: true,
    isPremium: true,
    startingPrice: 200,
    experienceYears: 8,
    responseTime: 'RÃ©pond en moins d\'2h',
    badgeLabels: ['Premium', 'CertifiÃ©e'],
    cityName: 'Rabat',
    serviceCategoryName: 'Ã‰lectricitÃ©',
    portfolioImages: [
      'https://images.unsplash.com/photo-1621905252472-943afaa20e20?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop'
    ],
  },
  {
    id: '3',
    fullName: 'Mohammed Tazi',
    cityId: '3',
    serviceCategoryId: '4',
    title: 'Peintre professionnel',
    shortBio: 'Peinture intÃ©rieure et extÃ©rieure avec matÃ©riaux de qualitÃ©. Finitions impeccables.',
    rating: 4.7,
    reviewCount: 203,
    isVerified: false,
    isPremium: false,
    startingPrice: 120,
    experienceYears: 15,
    responseTime: 'RÃ©pond en moins d\'3h',
    badgeLabels: ['ExpÃ©rimentÃ©'],
    cityName: 'Marrakech',
    serviceCategoryName: 'Peinture',
    portfolioImages: [
      'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
    ],
  },
  {
    id: '4',
    fullName: 'Leila Mansouri',
    cityId: '1',
    serviceCategoryId: '3',
    title: 'Femme de mÃ©nage qualifiÃ©e',
    shortBio: 'Services de nettoyage complets pour particuliers et entreprises. Produits Ã©cologiques.',
    rating: 4.9,
    reviewCount: 312,
    isVerified: true,
    isPremium: false,
    startingPrice: 80,
    experienceYears: 6,
    responseTime: 'RÃ©pond en moins d\'1h',
    badgeLabels: ['Ã‰cologique', 'Ponctuelle'],
    cityName: 'Casablanca',
    serviceCategoryName: 'MÃ©nage',
  },
  {
    id: '5',
    fullName: 'Youssef El Amrani',
    cityId: '4',
    serviceCategoryId: '6',
    title: 'MaÃ§on expÃ©rimentÃ©',
    shortBio: 'Construction et rÃ©novation de maÃ§onnerie. Travail soignÃ© et durable.',
    rating: 4.6,
    reviewCount: 156,
    isVerified: true,
    isPremium: false,
    startingPrice: 180,
    experienceYears: 20,
    responseTime: 'RÃ©pond en moins d\'4h',
    badgeLabels: ['MaÃ®tre artisan'],
    cityName: 'FÃ¨s',
    serviceCategoryName: 'MaÃ§onnerie',
  },
  {
    id: '6',
    fullName: 'Amina Bouazza',
    cityId: '5',
    serviceCategoryId: '5',
    title: 'Jardinier paysagiste',
    shortBio: 'CrÃ©ation et entretien d\'espaces verts. PassionnÃ©e par les jardins marocains traditionnels.',
    rating: 4.8,
    reviewCount: 94,
    isVerified: true,
    isPremium: true,
    startingPrice: 100,
    experienceYears: 10,
    responseTime: 'RÃ©pond en moins d\'2h',
    badgeLabels: ['Premium', 'CrÃ©atif'],
    cityName: 'Tanger',
    serviceCategoryName: 'Jardinage',
  },
  {
    id: '7',
    fullName: 'Karim Haddad',
    cityId: '1',
    serviceCategoryId: '7',
    title: 'DÃ©mÃ©nageur professionnel',
    shortBio: 'DÃ©mÃ©nagements locaux et interurbains. Ã‰quipe formÃ©e et vÃ©hicules adaptÃ©s.',
    rating: 4.5,
    reviewCount: 78,
    isVerified: false,
    isPremium: false,
    startingPrice: 250,
    experienceYears: 7,
    responseTime: 'RÃ©pond en moins d\'6h',
    badgeLabels: ['Ã‰quipÃ©'],
    cityName: 'Casablanca',
    serviceCategoryName: 'DÃ©mÃ©nagement',
  },
  {
    id: '8',
    fullName: 'Sofia Benjelloun',
    cityId: '3',
    serviceCategoryId: '8',
    title: 'Photographe Ã©vÃ©nementiel',
    shortBio: 'Photographie de mariages, Ã©vÃ©nements et portraits. Style artistique et naturel.',
    rating: 4.9,
    reviewCount: 245,
    isVerified: true,
    isPremium: true,
    startingPrice: 500,
    experienceYears: 9,
    responseTime: 'RÃ©pond en moins d\'12h',
    badgeLabels: ['Premium', 'Artistique'],
    cityName: 'Marrakech',
    serviceCategoryName: 'Photographie',
  },
  {
    id: '9',
    fullName: 'Omar Chraibi',
    cityId: '2',
    serviceCategoryId: '1',
    title: 'Plombier d\'urgence',
    shortBio: 'DÃ©pannage plomberie 24/7. Intervention rapide pour les urgences.',
    rating: 4.7,
    reviewCount: 189,
    isVerified: true,
    isPremium: false,
    startingPrice: 200,
    experienceYears: 14,
    responseTime: 'RÃ©pond en moins d\'30min',
    badgeLabels: ['Urgence', '24/7'],
    cityName: 'Rabat',
    serviceCategoryName: 'Plomberie',
  },
  {
    id: '10',
    fullName: 'Nadia El Fassi',
    cityId: '4',
    serviceCategoryId: '3',
    title: 'SpÃ©cialiste nettoyage',
    shortBio: 'Nettoyage de bureaux et locaux commerciaux. Services rÃ©guliers disponibles.',
    rating: 4.6,
    reviewCount: 167,
    isVerified: true,
    isPremium: false,
    startingPrice: 90,
    experienceYears: 5,
    responseTime: 'RÃ©pond en moins d\'2h',
    badgeLabels: ['Entreprises'],
    cityName: 'FÃ¨s',
    serviceCategoryName: 'MÃ©nage',
  },
  {
    id: '11',
    fullName: 'Hassan Alaoui',
    cityId: '1',
    serviceCategoryId: '2',
    title: 'Ã‰lectricien bÃ¢timent',
    shortBio: 'Installations Ã©lectriques pour bÃ¢timents rÃ©sidentiels et commerciaux.',
    rating: 4.8,
    reviewCount: 134,
    isVerified: true,
    isPremium: true,
    startingPrice: 250,
    experienceYears: 16,
    responseTime: 'RÃ©pond en moins d\'3h',
    badgeLabels: ['Premium', 'BÃ¢timents'],
    cityName: 'Casablanca',
    serviceCategoryName: 'Ã‰lectricitÃ©',
  },
  {
    id: '12',
    fullName: 'Zineb Tazi',
    cityId: '3',
    serviceCategoryId: '4',
    title: 'Peintre dÃ©coratrice',
    shortBio: 'Peinture dÃ©corative et rÃ©novation intÃ©rieure. Conseils en couleur et style.',
    rating: 4.9,
    reviewCount: 98,
    isVerified: true,
    isPremium: false,
    startingPrice: 140,
    experienceYears: 11,
    responseTime: 'RÃ©pond en moins d\'4h',
    badgeLabels: ['CrÃ©ative', 'Designer'],
    cityName: 'Marrakech',
    serviceCategoryName: 'Peinture',
  },
  {
    id: '13',
    fullName: 'Mehdi Bennani',
    cityId: '5',
    serviceCategoryId: '6',
    title: 'MaÃ§on rÃ©novation',
    shortBio: 'SpÃ©cialisÃ© dans la rÃ©novation de maÃ§onnerie ancienne et moderne.',
    rating: 4.5,
    reviewCount: 112,
    isVerified: false,
    isPremium: false,
    startingPrice: 160,
    experienceYears: 18,
    responseTime: 'RÃ©pond en moins d\'5h',
    badgeLabels: ['RÃ©novation'],
    cityName: 'Tanger',
    serviceCategoryName: 'MaÃ§onnerie',
  },
  {
    id: '14',
    fullName: 'Laila Chraibi',
    cityId: '2',
    serviceCategoryId: '5',
    title: 'JardiniÃ¨re urbaine',
    shortBio: 'AmÃ©nagement de petits espaces et balcons. Solutions Ã©cologiques.',
    rating: 4.7,
    reviewCount: 76,
    isVerified: true,
    isPremium: false,
    startingPrice: 110,
    experienceYears: 8,
    responseTime: 'RÃ©pond en moins d\'3h',
    badgeLabels: ['Urbain', 'Ã‰colo'],
    cityName: 'Rabat',
    serviceCategoryName: 'Jardinage',
  },
  {
    id: '15',
    fullName: 'Rachid El Amrani',
    cityId: '1',
    serviceCategoryId: '7',
    title: 'DÃ©mÃ©nageur express',
    shortBio: 'DÃ©mÃ©nagements rapides et sÃ©curisÃ©s. Emballage professionnel disponible.',
    rating: 4.4,
    reviewCount: 145,
    isVerified: true,
    isPremium: false,
    startingPrice: 220,
    experienceYears: 9,
    responseTime: 'RÃ©pond en moins d\'2h',
    badgeLabels: ['Rapide', 'Emballage'],
    cityName: 'Casablanca',
    serviceCategoryName: 'DÃ©mÃ©nagement',
  },
  {
    id: '16',
    fullName: 'Imane Bouazza',
    cityId: '4',
    serviceCategoryId: '8',
    title: 'Photographe portrait',
    shortBio: 'Portraits professionnels et sÃ©ances en studio. Retouches incluses.',
    rating: 4.8,
    reviewCount: 178,
    isVerified: true,
    isPremium: true,
    startingPrice: 350,
    experienceYears: 7,
    responseTime: 'RÃ©pond en moins d\'8h',
    badgeLabels: ['Premium', 'Studio'],
    cityName: 'FÃ¨s',
    serviceCategoryName: 'Photographie',
  },
  {
    id: '17',
    fullName: 'Younes Haddad',
    cityId: '3',
    serviceCategoryId: '1',
    title: 'Plombier chauffage',
    shortBio: 'SpÃ©cialiste en chauffage et climatisation. Maintenance et installation.',
    rating: 4.6,
    reviewCount: 201,
    isVerified: true,
    isPremium: false,
    startingPrice: 170,
    experienceYears: 13,
    responseTime: 'RÃ©pond en moins d\'2h',
    badgeLabels: ['Chauffage', 'Climatisation'],
    cityName: 'Marrakech',
    serviceCategoryName: 'Plomberie',
  },
  {
    id: '18',
    fullName: 'Sara Benjelloun',
    cityId: '5',
    serviceCategoryId: '3',
    title: 'MÃ©nage Ã©cologique',
    shortBio: 'Nettoyage avec produits naturels et biodÃ©gradables. Respectueux de l\'environnement.',
    rating: 4.8,
    reviewCount: 223,
    isVerified: true,
    isPremium: true,
    startingPrice: 95,
    experienceYears: 4,
    responseTime: 'RÃ©pond en moins d\'1h',
    badgeLabels: ['Premium', 'Ã‰cologique'],
    cityName: 'Tanger',
    serviceCategoryName: 'MÃ©nage',
  },
  {
    id: '19',
    fullName: 'Adil Mansouri',
    cityId: '2',
    serviceCategoryId: '2',
    title: 'Ã‰lectricien domotique',
    shortBio: 'Installation de systÃ¨mes domotiques et automatisation rÃ©sidentielle.',
    rating: 4.9,
    reviewCount: 87,
    isVerified: true,
    isPremium: true,
    startingPrice: 300,
    experienceYears: 12,
    responseTime: 'RÃ©pond en moins d\'6h',
    badgeLabels: ['Premium', 'Domotique'],
    cityName: 'Rabat',
    serviceCategoryName: 'Ã‰lectricitÃ©',
  },
  {
    id: '20',
    fullName: 'Khadija El Fassi',
    cityId: '1',
    serviceCategoryId: '4',
    title: 'Peintre artistique',
    shortBio: 'Peinture murale et dÃ©corative. CrÃ©ations personnalisÃ©es et fresques.',
    rating: 4.7,
    reviewCount: 156,
    isVerified: false,
    isPremium: false,
    startingPrice: 180,
    experienceYears: 10,
    responseTime: 'RÃ©pond en moins d\'5h',
    badgeLabels: ['Artistique', 'PersonnalisÃ©'],
    cityName: 'Casablanca',
    serviceCategoryName: 'Peinture',
  },
  {
    id: '21',
    fullName: 'Mustapha Alaoui',
    cityId: '4',
    serviceCategoryId: '6',
    title: 'MaÃ§on traditionnel',
    shortBio: 'Construction en techniques traditionnelles marocaines. Zelliges et plÃ¢tre.',
    rating: 4.8,
    reviewCount: 134,
    isVerified: true,
    isPremium: true,
    startingPrice: 220,
    experienceYears: 25,
    responseTime: 'RÃ©pond en moins d\'4h',
    badgeLabels: ['Premium', 'Traditionnel'],
    cityName: 'FÃ¨s',
    serviceCategoryName: 'MaÃ§onnerie',
  },
  {
    id: '22',
    fullName: 'Najat Tazi',
    cityId: '3',
    serviceCategoryId: '5',
    title: 'Paysagiste crÃ©ative',
    shortBio: 'Design de jardins contemporains et traditionnels. Irrigation automatique.',
    rating: 4.9,
    reviewCount: 112,
    isVerified: true,
    isPremium: true,
    startingPrice: 150,
    experienceYears: 14,
    responseTime: 'RÃ©pond en moins d\'3h',
    badgeLabels: ['Premium', 'Designer'],
    cityName: 'Marrakech',
    serviceCategoryName: 'Jardinage',
  },
  {
    id: '23',
    fullName: 'Hamza Bennani',
    cityId: '5',
    serviceCategoryId: '7',
    title: 'DÃ©mÃ©nageur international',
    shortBio: 'DÃ©mÃ©nagements internationaux et relocation. Services complets et assurÃ©s.',
    rating: 4.6,
    reviewCount: 89,
    isVerified: true,
    isPremium: false,
    startingPrice: 400,
    experienceYears: 11,
    responseTime: 'RÃ©pond en moins d\'12h',
    badgeLabels: ['International', 'AssurÃ©'],
    cityName: 'Tanger',
    serviceCategoryName: 'DÃ©mÃ©nagement',
  },
  {
    id: '24',
    fullName: 'Aicha Chraibi',
    cityId: '2',
    serviceCategoryId: '8',
    title: 'Photographe culinaire',
    shortBio: 'Photographie de plats et Ã©tablissements. SpÃ©cialisÃ©e dans la cuisine marocaine.',
    rating: 4.7,
    reviewCount: 198,
    isVerified: true,
    isPremium: false,
    startingPrice: 280,
    experienceYears: 8,
    responseTime: 'RÃ©pond en moins d\'10h',
    badgeLabels: ['Culinaire', 'SpÃ©cialisÃ©e'],
    cityName: 'Rabat',
    serviceCategoryName: 'Photographie',
  },
  {
    id: '25',
    fullName: 'Reda El Amrani',
    cityId: '1',
    serviceCategoryId: '1',
    title: 'Plombier piscine',
    shortBio: 'Installation et maintenance de piscines. Traitement de l\'eau et filtration.',
    rating: 4.5,
    reviewCount: 167,
    isVerified: false,
    isPremium: false,
    startingPrice: 190,
    experienceYears: 9,
    responseTime: 'RÃ©pond en moins d\'3h',
    badgeLabels: ['Piscines'],
    cityName: 'Casablanca',
    serviceCategoryName: 'Plomberie',
  },
  {
    id: '26',
    fullName: 'Meryem Bouazza',
    cityId: '4',
    serviceCategoryId: '3',
    title: 'MÃ©nage bureaux',
    shortBio: 'Nettoyage d\'espaces de bureaux et open spaces. Services quotidiens.',
    rating: 4.6,
    reviewCount: 145,
    isVerified: true,
    isPremium: false,
    startingPrice: 85,
    experienceYears: 6,
    responseTime: 'RÃ©pond en moins d\'2h',
    badgeLabels: ['Bureaux', 'Quotidien'],
    cityName: 'FÃ¨s',
    serviceCategoryName: 'MÃ©nage',
  },
  {
    id: '27',
    fullName: 'Salah Haddad',
    cityId: '3',
    serviceCategoryId: '2',
    title: 'Ã‰lectricien solaire',
    shortBio: 'Installation de panneaux solaires et systÃ¨mes photovoltaÃ¯ques.',
    rating: 4.8,
    reviewCount: 123,
    isVerified: true,
    isPremium: true,
    startingPrice: 350,
    experienceYears: 10,
    responseTime: 'RÃ©pond en moins d\'5h',
    badgeLabels: ['Premium', 'Solaire'],
    cityName: 'Marrakech',
    serviceCategoryName: 'Ã‰lectricitÃ©',
  },
  {
    id: '28',
    fullName: 'Wafa Benjelloun',
    cityId: '5',
    serviceCategoryId: '4',
    title: 'Peintre industrielle',
    shortBio: 'Peinture de bÃ¢timents industriels et entrepÃ´ts. RÃ©sistances spÃ©ciales.',
    rating: 4.4,
    reviewCount: 98,
    isVerified: false,
    isPremium: false,
    startingPrice: 130,
    experienceYears: 12,
    responseTime: 'RÃ©pond en moins d\'6h',
    badgeLabels: ['Industriel'],
    cityName: 'Tanger',
    serviceCategoryName: 'Peinture',
  },
  {
    id: '29',
    fullName: 'Ibrahim Mansouri',
    cityId: '2',
    serviceCategoryId: '6',
    title: 'MaÃ§on isolation',
    shortBio: 'Isolation thermique et acoustique. Ã‰conomies d\'Ã©nergie garanties.',
    rating: 4.7,
    reviewCount: 156,
    isVerified: true,
    isPremium: false,
    startingPrice: 175,
    experienceYears: 17,
    responseTime: 'RÃ©pond en moins d\'4h',
    badgeLabels: ['Isolation', 'Ã‰conomie'],
    cityName: 'Rabat',
    serviceCategoryName: 'MaÃ§onnerie',
  },
  {
    id: '30',
    fullName: 'Houda El Fassi',
    cityId: '1',
    serviceCategoryId: '5',
    title: 'Jardinier thÃ©rapeutique',
    shortBio: 'Jardinage adaptÃ© aux personnes Ã¢gÃ©es et handicapÃ©es. Espaces accessibles.',
    rating: 4.9,
    reviewCount: 87,
    isVerified: true,
    isPremium: true,
    startingPrice: 125,
    experienceYears: 7,
    responseTime: 'RÃ©pond en moins d\'2h',
    badgeLabels: ['Premium', 'ThÃ©rapeutique'],
    cityName: 'Casablanca',
    serviceCategoryName: 'Jardinage',
  },
];


// Mock detailed professional profiles
export const mockProfessionalDetails: Record<string, ProfessionalDetail> = {
  '1': {
    ...mockProfessionals[0],
    detailedBio: `Ahmed Bennani est un plombier expÃ©rimentÃ© avec plus de 12 ans d'expÃ©rience dans le domaine de la plomberie rÃ©sidentielle et commerciale. PassionnÃ© par son mÃ©tier, il met un point d'honneur Ã  offrir des services de qualitÃ© supÃ©rieure avec une attention particuliÃ¨re aux dÃ©tails.

SpÃ©cialisÃ© dans l'installation et la rÃ©paration de systÃ¨mes de plomberie, Ahmed maÃ®trise toutes les techniques modernes et traditionnelles. Il travaille avec des matÃ©riaux de haute qualitÃ© et respecte toujours les normes de sÃ©curitÃ© les plus strictes.

Son approche client-centrÃ©e lui permet de comprendre les besoins spÃ©cifiques de chaque projet et de proposer des solutions adaptÃ©es. Disponible 7j/7 pour les urgences, Ahmed garantit une intervention rapide et efficace.`,
    services: [
      {
        id: '1-1',
        name: 'RÃ©paration de fuite d\'eau',
        description: 'Diagnostic et rÃ©paration de toutes types de fuites',
        price: 150,
        duration: '1-2h',
        category: 'RÃ©paration'
      },
      {
        id: '1-2',
        name: 'Installation de chauffe-eau',
        description: 'Installation complÃ¨te de chauffe-eau Ã©lectrique ou gaz',
        price: 300,
        duration: '2-3h',
        category: 'Installation'
      },
      {
        id: '1-3',
        name: 'DÃ©bouchage canalisation',
        description: 'DÃ©bouchage professionnel avec Ã©quipement spÃ©cialisÃ©',
        price: 120,
        duration: '30-60min',
        category: 'DÃ©bouchage'
      },
      {
        id: '1-4',
        name: 'Installation salle de bain',
        description: 'Installation complÃ¨te de salle de bain (douche, WC, lavabo)',
        price: 800,
        duration: '1 journÃ©e',
        category: 'Installation'
      }
    ],
    reviews: [
      {
        id: 'r1-1',
        clientName: 'Fatima Alaoui',
        rating: 5,
        comment: 'Excellent travail ! Ahmed est arrivÃ© Ã  l\'heure et a rÃ©parÃ© la fuite en moins d\'une heure. TrÃ¨s professionnel et prix correct.',
        date: '2024-01-15',
        serviceName: 'RÃ©paration de fuite d\'eau',
        verified: true
      },
      {
        id: 'r1-2',
        clientName: 'Mohammed Tazi',
        rating: 5,
        comment: 'TrÃ¨s satisfait du service. Ahmed a installÃ© mon chauffe-eau en une matinÃ©e. Nettoyage impeccable et conseils utiles.',
        date: '2024-01-10',
        serviceName: 'Installation de chauffe-eau',
        verified: true
      },
      {
        id: 'r1-3',
        clientName: 'Leila Mansouri',
        rating: 4,
        comment: 'Bon travail, intervention rapide pour le dÃ©bouchage. Un peu cher mais qualitÃ© au rendez-vous.',
        date: '2024-01-05',
        serviceName: 'DÃ©bouchage canalisation',
        verified: true
      }
    ],
    certifications: [
      {
        id: 'c1-1',
        title: 'Certificat de Qualification Professionnelle Plomberie',
        issuer: 'Chambre des MÃ©tiers du Maroc',
        year: 2015,
        description: 'Certification officielle pour les travaux de plomberie'
      },
      {
        id: 'c1-2',
        title: 'Formation SÃ©curitÃ© Gaz',
        issuer: 'GRDF Maroc',
        year: 2018,
        description: 'Formation spÃ©cialisÃ©e pour les installations gaz'
      },
      {
        id: 'c1-3',
        title: 'Certification Qualibat',
        issuer: 'Qualibat',
        year: 2020,
        description: 'Label de qualitÃ© pour les artisans du bÃ¢timent'
      }
    ],
    languages: ['Arabe', 'FranÃ§ais'],
    availability: 'Disponible 7j/7, urgences 24h/24',
    completedJobs: 247,
    responseRate: 98,
    workingHours: {
      monday: '08:00 - 18:00',
      tuesday: '08:00 - 18:00',
      wednesday: '08:00 - 18:00',
      thursday: '08:00 - 18:00',
      friday: '08:00 - 17:00',
      saturday: '09:00 - 16:00',
      sunday: 'FermÃ©'
    }
  },
  '2': {
    ...mockProfessionals[1],
    detailedBio: `Fatima Alaoui est une Ã©lectricienne qualifiÃ©e avec 8 ans d'expÃ©rience dans l'installation et la maintenance Ã©lectrique. Femme pionniÃ¨re dans un mÃ©tier traditionnellement masculin, elle apporte prÃ©cision, sÃ©curitÃ© et professionnalisme Ã  chaque intervention.

SpÃ©cialisÃ©e dans les installations Ã©lectriques rÃ©sidentielles et commerciales, Fatima maÃ®trise les derniÃ¨res normes Ã©lectriques et utilise uniquement des matÃ©riaux certifiÃ©s. Elle est particuliÃ¨rement attentive Ã  la sÃ©curitÃ© et forme rÃ©guliÃ¨rement ses clients sur les bonnes pratiques Ã©lectriques.

Membre active de l'association des femmes Ã©lectriciennes, Fatima s'engage pour la promotion des femmes dans les mÃ©tiers techniques.`,
    services: [
      {
        id: '2-1',
        name: 'Installation Ã©lectrique complÃ¨te',
        description: 'Installation Ã©lectrique d\'un appartement ou maison',
        price: 2500,
        duration: '2-3 jours',
        category: 'Installation'
      },
      {
        id: '2-2',
        name: 'RÃ©paration prise Ã©lectrique',
        description: 'Diagnostic et rÃ©paration de problÃ¨mes Ã©lectriques',
        price: 100,
        duration: '30-60min',
        category: 'RÃ©paration'
      },
      {
        id: '2-3',
        name: 'Installation domotique',
        description: 'SystÃ¨me d\'Ã©clairage intelligent et automatisation',
        price: 1500,
        duration: '1 journÃ©e',
        category: 'Installation'
      }
    ],
    reviews: [
      {
        id: 'r2-1',
        clientName: 'Ahmed Bennani',
        rating: 5,
        comment: 'Fatima a fait un travail impeccable pour l\'installation Ã©lectrique de mon appartement. TrÃ¨s professionnelle et Ã  l\'Ã©coute.',
        date: '2024-01-12',
        serviceName: 'Installation Ã©lectrique complÃ¨te',
        verified: true
      },
      {
        id: 'r2-2',
        clientName: 'Youssef El Amrani',
        rating: 5,
        comment: 'Intervention rapide et efficace pour une panne Ã©lectrique. Fatima a trouvÃ© le problÃ¨me en 5 minutes !',
        date: '2024-01-08',
        serviceName: 'RÃ©paration prise Ã©lectrique',
        verified: true
      }
    ],
    certifications: [
      {
        id: 'c2-1',
        title: 'Brevet d\'Ã‰lectricien',
        issuer: 'MinistÃ¨re de l\'Ã‰ducation Nationale',
        year: 2016,
        description: 'DiplÃ´me officiel d\'Ã©lectricien qualifiÃ©'
      },
      {
        id: 'c2-2',
        title: 'Certification NF C 15-100',
        issuer: 'Consuel',
        year: 2019,
        description: 'Certification pour les installations Ã©lectriques'
      }
    ],
    languages: ['Arabe', 'FranÃ§ais', 'Anglais'],
    availability: 'Lundi au Samedi, 8h-18h',
    completedJobs: 156,
    responseRate: 95,
    workingHours: {
      monday: '07:00 - 19:00',
      tuesday: '07:00 - 19:00',
      wednesday: '07:00 - 19:00',
      thursday: '07:00 - 19:00',
      friday: '07:00 - 18:00',
      saturday: '08:00 - 17:00',
      sunday: '09:00 - 14:00'
    }
  },
  '3': {
    ...mockProfessionals[2],
    detailedBio: `Mohammed Tazi est un peintre professionnel expÃ©rimentÃ© spÃ©cialisÃ© dans les travaux de peinture intÃ©rieure et extÃ©rieure. Avec plus de 15 ans d'expÃ©rience, il maÃ®trise toutes les techniques de peinture moderne et traditionnelle.

PassionnÃ© par son mÃ©tier, Mohammed apporte un soin particulier Ã  la prÃ©paration des surfaces et utilise uniquement des peintures de qualitÃ© supÃ©rieure. Il est reconnu pour ses finitions impeccables et son respect des dÃ©lais.

Son approche artisanale lui permet de conseiller ses clients sur les choix de couleurs et de matÃ©riaux adaptÃ©s Ã  leurs besoins spÃ©cifiques.`,
    services: [
      {
        id: '3-1',
        name: 'Peinture intÃ©rieure complÃ¨te',
        description: 'Peinture de toutes les piÃ¨ces d\'un appartement',
        price: 800,
        duration: '2-3 jours',
        category: 'IntÃ©rieur'
      },
      {
        id: '3-2',
        name: 'Peinture extÃ©rieure',
        description: 'Peinture de faÃ§ade et extÃ©rieur',
        price: 1200,
        duration: '3-4 jours',
        category: 'ExtÃ©rieur'
      },
      {
        id: '3-3',
        name: 'Peinture dÃ©corative',
        description: 'Techniques dÃ©coratives et effets spÃ©ciaux',
        price: 150,
        duration: '1 journÃ©e',
        category: 'DÃ©coratif'
      }
    ],
    reviews: [
      {
        id: 'r3-1',
        clientName: 'Ahmed Bennani',
        rating: 5,
        comment: 'Excellent travail de peinture. TrÃ¨s professionnel et propre.',
        date: '2024-01-10',
        serviceName: 'Peinture intÃ©rieure complÃ¨te',
        verified: true
      },
      {
        id: 'r3-2',
        clientName: 'Fatima Alaoui',
        rating: 4,
        comment: 'Bon peintre, dÃ©lais respectÃ©s. Quelques retouches mineures.',
        date: '2024-01-05',
        serviceName: 'Peinture extÃ©rieure',
        verified: true
      }
    ],
    certifications: [
      {
        id: 'c3-1',
        title: 'Certificat de Peintre Professionnel',
        issuer: 'Chambre des MÃ©tiers',
        year: 2010,
        description: 'Certification officielle pour les travaux de peinture'
      }
    ],
    languages: ['Arabe', 'FranÃ§ais'],
    availability: 'Lundi au Vendredi, 8h-17h',
    completedJobs: 203,
    responseRate: 92,
    workingHours: {
      monday: '08:00 - 17:00',
      tuesday: '08:00 - 17:00',
      wednesday: '08:00 - 17:00',
      thursday: '08:00 - 17:00',
      friday: '08:00 - 17:00',
      saturday: 'FermÃ©',
      sunday: 'FermÃ©'
    }
  }
};

// Blog mock data
export const mockBlogCategories: BlogCategory[] = [
 {
   id: '1',
   name: 'Conseils',
   slug: 'conseils',
   description: 'Conseils pratiques pour vos projets',
   articleCount: 12,
   color: '#F97B22'
 },
 {
   id: '2',
   name: 'Maintenance',
   slug: 'maintenance',
   description: 'Entretien et maintenance de votre maison',
   articleCount: 8,
   color: '#2E7D32'
 },
 {
   id: '3',
   name: 'RÃ©novation',
   slug: 'renovation',
   description: 'Guides de rÃ©novation et travaux',
   articleCount: 15,
   color: '#1976D2'
 },
 {
   id: '4',
   name: 'Ã‰conomie d\'Ã©nergie',
   slug: 'economie-energie',
   description: 'Astuces pour rÃ©duire vos factures',
   articleCount: 6,
   color: '#FF9800'
 },
 {
   id: '5',
   name: 'SÃ©curitÃ©',
   slug: 'securite',
   description: 'SÃ©curitÃ© Ã  la maison et au travail',
   articleCount: 9,
   color: '#D32F2F'
 }
];

export const mockBlogArticles: BlogArticle[] = [
 {
   id: '1',
   slug: 'comment-choisir-bon-plombier',
   title: 'Comment choisir le bon plombier pour votre maison',
   excerpt: 'DÃ©couvrez les critÃ¨res essentiels pour sÃ©lectionner un professionnel qualifiÃ© et Ã©viter les mauvaises surprises.',
   content: `# Comment choisir le bon plombier pour votre maison

Choisir le bon plombier est crucial pour garantir la qualitÃ© et la sÃ©curitÃ© de vos installations. Voici les critÃ¨res essentiels Ã  prendre en compte.

## 1. VÃ©rifiez les qualifications

Un bon plombier doit Ãªtre titulaire d'un certificat de qualification professionnelle. Au Maroc, les plombiers qualifiÃ©s possÃ¨dent gÃ©nÃ©ralement :

- Un diplÃ´me de l'enseignement professionnel
- Une certification de la Chambre des MÃ©tiers
- Une assurance responsabilitÃ© civile

## 2. Demandez des rÃ©fÃ©rences

N'hÃ©sitez pas Ã  demander des rÃ©fÃ©rences auprÃ¨s d'anciens clients. Un professionnel sÃ©rieux sera ravi de vous fournir des contacts de clients satisfaits.

## 3. Comparez les devis

Obtenez au moins 3 devis dÃ©taillÃ©s avant de prendre votre dÃ©cision. Un devis sÃ©rieux comprend :

- Le dÃ©tail des travaux
- Les matÃ©riaux utilisÃ©s
- Les dÃ©lais d'intervention
- La garantie proposÃ©e

## 4. VÃ©rifiez l'assurance

Assurez-vous que le plombier est couvert par une assurance responsabilitÃ© civile et dÃ©cennale pour les gros travaux.

## 5. La rÃ©activitÃ©

Un bon professionnel rÃ©pond rapidement Ã  vos appels et propose des crÃ©neaux adaptÃ©s Ã  votre emploi du temps.

En suivant ces critÃ¨res, vous maximiserez vos chances de trouver un plombier compÃ©tent et fiable pour vos travaux.`,
   author: {
     name: 'Ahmed Bennani',
     avatar: '/avatars/ahmed.jpg',
     bio: 'Plombier certifiÃ© avec 12 ans d\'expÃ©rience'
   },
   category: 'Conseils',
   tags: ['plomberie', 'choix professionnel', 'qualitÃ©'],
   publishedAt: '2024-11-15T10:00:00Z',
   updatedAt: '2024-11-15T10:00:00Z',
   readTime: 5,
   featuredImage: '/blog/plomberie-hero.jpg',
   isPublished: true,
   views: 1250,
   likes: 45
 },
 {
   id: '2',
   slug: 'entretien-climatisation-annuel',
   title: 'L\'importance de l\'entretien rÃ©gulier de votre climatisation',
   excerpt: 'Pourquoi un entretien annuel peut vous faire Ã©conomiser jusqu\'Ã  30% sur vos factures d\'Ã©nergie.',
   content: `# L'importance de l'entretien rÃ©gulier de votre climatisation

Un entretien rÃ©gulier de votre climatisation n'est pas seulement une question de confort, c'est aussi une Ã©conomie substantielle sur vos factures d'Ã©nergie.

## Les bÃ©nÃ©fices de l'entretien annuel

### Ã‰conomies d'Ã©nergie
Un systÃ¨me bien entretenu consomme jusqu'Ã  30% d'Ã©nergie en moins. La poussiÃ¨re et les saletÃ©s obstruent les filtres et rÃ©duisent l'efficacitÃ© du systÃ¨me.

### DurÃ©e de vie prolongÃ©e
L'entretien rÃ©gulier peut augmenter la durÃ©e de vie de votre climatisation de 5 Ã  10 ans supplÃ©mentaires.

### QualitÃ© de l'air
Des filtres propres garantissent un air sain et rÃ©duisent les risques d'allergies.

## FrÃ©quence recommandÃ©e

- **Filtre Ã  air** : Nettoyage tous les 2 mois, remplacement annuel
- **UnitÃ© extÃ©rieure** : Nettoyage 2 fois par an
- **RÃ©frigÃ©rant** : ContrÃ´le annuel des niveaux
- **Entretien complet** : Une fois par an par un professionnel

## Signes qu'il faut intervenir

- Climatisation qui fonctionne en continu
- Air moins frais qu'avant
- Bruits inhabituels
- Odeurs dÃ©sagrÃ©ables
- Consommation Ã©lectrique excessive

N'attendez pas que votre climatisation tombe en panne. Un entretien prÃ©ventif vous Ã©vitera des rÃ©parations coÃ»teuses.`,
   author: {
     name: 'Fatima Alaoui',
     avatar: '/avatars/fatima.jpg',
     bio: 'SpÃ©cialiste en climatisation et chauffage'
   },
   category: 'Maintenance',
   tags: ['climatisation', 'entretien', 'Ã©conomie Ã©nergie'],
   publishedAt: '2024-11-12T14:30:00Z',
   updatedAt: '2024-11-12T14:30:00Z',
   readTime: 4,
   featuredImage: '/blog/clim-hero.jpg',
   isPublished: true,
   views: 890,
   likes: 32
 },
 {
   id: '3',
   slug: 'guide-renovation-salle-bain',
   title: 'Guide complet de la rÃ©novation de salle de bain',
   excerpt: 'Tout ce que vous devez savoir avant de vous lancer dans les travaux de rÃ©novation.',
   content: `# Guide complet de la rÃ©novation de salle de bain

La rÃ©novation d'une salle de bain est un projet important qui nÃ©cessite une bonne prÃ©paration. Voici votre guide complet pour rÃ©ussir vos travaux.

## 1. Planification du projet

### Ã‰valuez vos besoins
- Nombre d'utilisateurs quotidiens
- Budget disponible
- DurÃ©e des travaux acceptable
- Style souhaitÃ©

### DÃ©finissez votre budget
PrÃ©voyez 15-20% supplÃ©mentaires pour les imprÃ©vus :
- DÃ©molition : 10-15% du budget total
- Plomberie : 20-30%
- Ã‰lectricitÃ© : 10-15%
- RevÃªtements : 25-35%
- Mobilier : 15-25%

## 2. Les Ã©tapes clÃ©s

### Phase prÃ©paratoire
- Obtention des autorisations si nÃ©cessaire
- Choix des matÃ©riaux et Ã©quipements
- Planification des travaux

### DÃ©molition
- Protection des zones adjacentes
- Ã‰vacuation des dÃ©chets
- PrÃ©paration des surfaces

### Installation
- Plomberie et Ã©lectricitÃ©
- RevÃªtements muraux et sols
- Pose des Ã©quipements

## 3. Choix des matÃ©riaux

### Carrelage
- GrÃ¨s cÃ©rame pour sa rÃ©sistance
- Format adaptÃ© Ã  la taille de la piÃ¨ce
- Jointoiement Ã©tanche

### Receveur de douche
- PrÃ©fÃ©rer les receveurs extra-plats
- Bon systÃ¨me d'Ã©vacuation
- FacilitÃ© d'entretien

### Meubles et rangements
- Optimisation de l'espace
- QualitÃ© des finitions
- FonctionnalitÃ©

## 4. Ã‰conomies d'Ã©nergie

- Robinetterie Ã©conome
- Chauffage performant
- Ventilation efficace
- Isolation thermique

## 5. SÃ©curitÃ©

- RevÃªtements antidÃ©rapants
- Barres d'appui si nÃ©cessaire
- Ã‰clairage adaptÃ©
- Prises Ã©lectriques hors d'eau

Une rÃ©novation bien planifiÃ©e transforme votre salle de bain en un espace moderne et fonctionnel.`,
   author: {
     name: 'Youssef Tazi',
     avatar: '/avatars/youssef.jpg',
     bio: 'Expert en rÃ©novation et design d\'intÃ©rieur'
   },
   category: 'RÃ©novation',
   tags: ['salle de bain', 'rÃ©novation', 'guide travaux'],
   publishedAt: '2024-11-10T09:15:00Z',
   updatedAt: '2024-11-10T09:15:00Z',
   readTime: 8,
   featuredImage: '/blog/sdb-hero.jpg',
   isPublished: true,
   views: 2100,
   likes: 78
 },
 {
   id: '4',
   slug: 'isolation-thermique-economique',
   title: 'Isolation thermique : comment rÃ©duire vos factures de chauffage',
   excerpt: 'DÃ©couvrez les meilleures techniques d\'isolation pour optimiser votre confort et rÃ©duire vos dÃ©penses Ã©nergÃ©tiques.',
   content: `# Isolation thermique : comment rÃ©duire vos factures de chauffage

Une bonne isolation thermique peut rÃ©duire vos factures de chauffage de 20 Ã  30%. Voici les solutions les plus efficaces.

## Les points critiques Ã  isoler

### Les murs
- Isolation par l'extÃ©rieur (ITE) : la solution idÃ©ale
- Isolation par l'intÃ©rieur : moins coÃ»teuse mais rÃ©duit l'espace
- MatÃ©riaux : laine de verre, laine de roche, ouate de cellulose

### Le toit
- 30% des dÃ©perditions de chaleur passent par le toit
- Isolation des combles : solution Ã©conomique et efficace
- MatÃ©riaux adaptÃ©s Ã  l'humiditÃ©

### Les fenÃªtres
- Double vitrage obligatoire
- Triple vitrage pour les rÃ©gions froides
- Calfeutrage des joints

## Les aides financiÃ¨res

### Au Maroc
- Programme d'efficacitÃ© Ã©nergÃ©tique
- CrÃ©dits bancaires prÃ©fÃ©rentiels
- Subventions locales

### Retour sur investissement
- Isolation des combles : 2-3 ans
- Changement des fenÃªtres : 5-7 ans
- Isolation des murs : 7-10 ans

## Les erreurs Ã  Ã©viter

- NÃ©gliger l'Ã©tanchÃ©itÃ© Ã  l'air
- Choisir des matÃ©riaux de mauvaise qualitÃ©
- Oublier l'isolation des ponts thermiques
- Mal installer les matÃ©riaux

Une isolation bien rÃ©alisÃ©e amÃ©liore votre confort toute l'annÃ©e et valorise votre bien immobilier.`,
   author: {
     name: 'Karim Alaoui',
     avatar: '/avatars/karim.jpg',
     bio: 'SpÃ©cialiste en rÃ©novation Ã©nergÃ©tique'
   },
   category: 'Ã‰conomie d\'Ã©nergie',
   tags: ['isolation', 'Ã©conomie Ã©nergie', 'chauffage'],
   publishedAt: '2024-11-08T11:45:00Z',
   updatedAt: '2024-11-08T11:45:00Z',
   readTime: 6,
   featuredImage: '/blog/isolation-hero.jpg',
   isPublished: true,
   views: 1650,
   likes: 56
 },
 {
   id: '5',
   slug: 'securite-electrique-domicile',
   title: 'SÃ©curitÃ© Ã©lectrique Ã  domicile : les rÃ¨gles essentielles',
   excerpt: 'ProtÃ©gez votre famille et vos biens en respectant les normes de sÃ©curitÃ© Ã©lectrique.',
   content: `# SÃ©curitÃ© Ã©lectrique Ã  domicile : les rÃ¨gles essentielles

La sÃ©curitÃ© Ã©lectrique est primordiale pour protÃ©ger votre famille et vos biens. Voici les rÃ¨gles essentielles Ã  respecter.

## Les installations obligatoires

### Disjoncteur diffÃ©rentiel
- ProtÃ¨ge contre les Ã©lectrocutions
- Doit Ãªtre installÃ© sur tous les circuits
- Test mensuel obligatoire

### Prises de terre
- Essentielles pour la sÃ©curitÃ©
- VÃ©rification pÃ©riodique requise
- Normes strictes Ã  respecter

### Tableau Ã©lectrique
- Accessible et sÃ©curisÃ©
- Ã‰tiquetage clair des circuits
- Protection contre les surintensitÃ©s

## Les bonnes pratiques

### Utilisation quotidienne
- Ne jamais surcharger les prises
- Utiliser des multiprises avec protection
- DÃ©brancher les appareils en cas d'orage

### Entretien
- VÃ©rification annuelle par un professionnel
- Remplacement des installations anciennes
- Mise Ã  jour selon les normes actuelles

### En cas de problÃ¨me
- Couper immÃ©diatement le courant
- Ne pas toucher un fil dÃ©nudÃ©
- Faire appel Ã  un Ã©lectricien qualifiÃ©

## Les signes de danger

- Odeurs de brÃ»lÃ©
- Ã‰tincelles ou arcs Ã©lectriques
- Appareils qui chauffent anormalement
- Disjoncteurs qui se dÃ©clenchent frÃ©quemment

La sÃ©curitÃ© Ã©lectrique n'est pas une option. Elle sauve des vies et protÃ¨ge vos biens.`,
   author: {
     name: 'Leila Mansouri',
     avatar: '/avatars/leila.jpg',
     bio: 'Ã‰lectricienne spÃ©cialisÃ©e en sÃ©curitÃ©'
   },
   category: 'SÃ©curitÃ©',
   tags: ['sÃ©curitÃ© Ã©lectrique', 'domicile', 'normes'],
   publishedAt: '2024-11-05T16:20:00Z',
   updatedAt: '2024-11-05T16:20:00Z',
   readTime: 7,
   featuredImage: '/blog/securite-hero.jpg',
   isPublished: true,
   views: 1350,
   likes: 41
 }
];

// Helper functions for blog
export const getBlogArticleBySlug = (slug: string): BlogArticle | undefined => {
 return mockBlogArticles.find(article => article.slug === slug && article.isPublished);
};

export const getBlogArticlesByCategory = (categorySlug: string): BlogArticle[] => {
 const category = mockBlogCategories.find(cat => cat.slug === categorySlug);
 if (!category) return [];
 return mockBlogArticles.filter(article => article.category === category.name && article.isPublished);
};

export const getPopularBlogArticles = (limit: number = 5): BlogArticle[] => {
 return mockBlogArticles
   .filter(article => article.isPublished)
   .sort((a, b) => b.views - a.views)
   .slice(0, limit);
};

export const getRelatedBlogArticles = (currentArticle: BlogArticle, limit: number = 3): BlogArticle[] => {
  return mockBlogArticles
    .filter(article =>
      article.id !== currentArticle.id &&
      article.isPublished &&
      (article.category === currentArticle.category ||
       article.tags.some(tag => currentArticle.tags.includes(tag)))
    )
    .slice(0, limit);
};

// Client Dashboard types
export interface Client {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
  cityId: string;
  cityName?: string;
  createdAt: string;
  isVerified: boolean;
  totalBookings: number;
  totalSpent: number;
  favoriteCount: number;
}

export interface ClientBooking {
  id: string;
  clientId: string;
  professionalId: string;
  professionalName: string;
  professionalAvatar?: string;
  serviceName: string;
  serviceCategory: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  timeSlot: string;
  scheduledTime: string;
  duration: string;
  price: number;
  location: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientMessage {
  id: string;
  clientId: string;
  professionalId: string;
  professionalName: string;
  professionalAvatar?: string;
  bookingId?: string;
  content: string;
  isFromClient: boolean;
  isRead: boolean;
  createdAt: string;
}

export interface ClientFavorite {
  id: string;
  clientId: string;
  professionalId: string;
  professionalName: string;
  professionalAvatar?: string;
  serviceCategory: string;
  rating: number;
  reviewCount: number;
  startingPrice: number;
  cityName: string;
  addedAt: string;
}

export interface ClientStats {
  totalBookings: number;
  activeBookings: number;
  completedBookings: number;
  totalSpent: number;
  averageRating: number;
  favoriteCount: number;
  unreadMessages: number;
}

// Mock client data
export const mockClient: Client = {
  id: 'client-1',
  fullName: 'Karim Bennani',
  email: 'karim.bennani@email.com',
  phone: '+212 6 12 34 56 78',
  avatar: '/avatars/client-karim.jpg',
  cityId: '1',
  cityName: 'Casablanca',
  createdAt: '2024-01-15T10:00:00Z',
  isVerified: true,
  totalBookings: 12,
  totalSpent: 8500,
  favoriteCount: 8
};

export const mockClientBookings: ClientBooking[] = [
  {
    id: 'booking-1',
    clientId: 'client-1',
    professionalId: '1',
    professionalName: 'Ahmed Bennani',
    professionalAvatar: '/avatars/ahmed.jpg',
    serviceName: 'RÃ©paration de fuite d\'eau',
    serviceCategory: 'Plomberie',
    status: 'completed',
    timeSlot: '2024-11-20',
    scheduledTime: '14:00',
    duration: '2h',
    price: 300,
    location: 'Casablanca, Maarif',
    notes: 'Fuite sous l\'Ã©vier de la cuisine',
    createdAt: '2024-11-18T09:00:00Z',
    updatedAt: '2024-11-20T16:00:00Z'
  },
  {
    id: 'booking-2',
    clientId: 'client-1',
    professionalId: '2',
    professionalName: 'Fatima Alaoui',
    professionalAvatar: '/avatars/fatima.jpg',
    serviceName: 'Installation Ã©lectrique complÃ¨te',
    serviceCategory: 'Ã‰lectricitÃ©',
    status: 'confirmed',
    timeSlot: '2024-11-25',
    scheduledTime: '09:00',
    duration: '1 journÃ©e',
    price: 1200,
    location: 'Casablanca, Racine',
    notes: 'Installation Ã©lectrique pour appartement neuf',
    createdAt: '2024-11-15T14:30:00Z',
    updatedAt: '2024-11-15T14:30:00Z'
  },
  {
    id: 'booking-3',
    clientId: 'client-1',
    professionalId: '4',
    professionalName: 'Leila Mansouri',
    professionalAvatar: '/avatars/leila.jpg',
    serviceName: 'Nettoyage complet appartement',
    serviceCategory: 'MÃ©nage',
    status: 'in_progress',
    timeSlot: '2024-11-22',
    scheduledTime: '10:00',
    duration: '4h',
    price: 200,
    location: 'Casablanca, Gauthier',
    notes: 'Nettoyage appartement 3 piÃ¨ces',
    createdAt: '2024-11-20T11:00:00Z',
    updatedAt: '2024-11-20T11:00:00Z'
  },
  {
    id: 'booking-4',
    clientId: 'client-1',
    professionalId: '6',
    professionalName: 'Amina Bouazza',
    professionalAvatar: '/avatars/amina.jpg',
    serviceName: 'Entretien jardin mensuel',
    serviceCategory: 'Jardinage',
    status: 'pending',
    timeSlot: '2024-12-01',
    scheduledTime: '08:00',
    duration: '3h',
    price: 150,
    location: 'Casablanca, Californie',
    notes: 'Taille des haies et arrosage automatique',
    createdAt: '2024-11-10T16:45:00Z',
    updatedAt: '2024-11-10T16:45:00Z'
  },
  {
    id: 'booking-5',
    clientId: 'client-1',
    professionalId: '3',
    professionalName: 'Mohammed Tazi',
    professionalAvatar: '/avatars/mohammed.jpg',
    serviceName: 'Peinture intÃ©rieure salon',
    serviceCategory: 'Peinture',
    status: 'completed',
    timeSlot: '2024-10-15',
    scheduledTime: '13:00',
    duration: '6h',
    price: 800,
    location: 'Casablanca, Palmier',
    notes: 'Peinture salon 25mÂ², couleur blanc cassÃ©',
    createdAt: '2024-10-10T10:30:00Z',
    updatedAt: '2024-10-15T19:00:00Z'
  }
];

export const mockClientMessages: ClientMessage[] = [
  {
    id: 'msg-1',
    clientId: 'client-1',
    professionalId: '2',
    professionalName: 'Fatima Alaoui',
    professionalAvatar: '/avatars/fatima.jpg',
    bookingId: 'booking-2',
    content: 'Bonjour, je confirme le rendez-vous pour demain Ã  9h. Auriez-vous des prÃ©fÃ©rences particuliÃ¨res pour les interrupteurs ?',
    isFromClient: false,
    isRead: false,
    createdAt: '2024-11-21T18:30:00Z'
  },
  {
    id: 'msg-2',
    clientId: 'client-1',
    professionalId: '4',
    professionalName: 'Leila Mansouri',
    professionalAvatar: '/avatars/leila.jpg',
    bookingId: 'booking-3',
    content: 'Le nettoyage se dÃ©roule parfaitement. Je termine dans environ 1h.',
    isFromClient: false,
    isRead: true,
    createdAt: '2024-11-22T11:30:00Z'
  },
  {
    id: 'msg-3',
    clientId: 'client-1',
    professionalId: '6',
    professionalName: 'Amina Bouazza',
    professionalAvatar: '/avatars/amina.jpg',
    bookingId: 'booking-4',
    content: 'Parfait pour le rendez-vous du 1er dÃ©cembre. Le temps devrait Ãªtre favorable.',
    isFromClient: false,
    isRead: true,
    createdAt: '2024-11-18T14:15:00Z'
  },
  {
    id: 'msg-4',
    clientId: 'client-1',
    professionalId: '1',
    professionalName: 'Ahmed Bennani',
    professionalAvatar: '/avatars/ahmed.jpg',
    bookingId: 'booking-1',
    content: 'Intervention terminÃ©e avec succÃ¨s. La facture sera disponible sous 24h.',
    isFromClient: false,
    isRead: true,
    createdAt: '2024-11-20T16:15:00Z'
  }
];

export const mockClientFavorites: ClientFavorite[] = [
  {
    id: 'fav-1',
    clientId: 'client-1',
    professionalId: '2',
    professionalName: 'Fatima Alaoui',
    professionalAvatar: '/avatars/fatima.jpg',
    serviceCategory: 'Ã‰lectricitÃ©',
    rating: 4.9,
    reviewCount: 89,
    startingPrice: 200,
    cityName: 'Rabat',
    addedAt: '2024-09-15T10:00:00Z'
  },
  {
    id: 'fav-2',
    clientId: 'client-1',
    professionalId: '4',
    professionalName: 'Leila Mansouri',
    professionalAvatar: '/avatars/leila.jpg',
    serviceCategory: 'MÃ©nage',
    rating: 4.9,
    reviewCount: 312,
    startingPrice: 80,
    cityName: 'Casablanca',
    addedAt: '2024-08-20T14:30:00Z'
  },
  {
    id: 'fav-3',
    clientId: 'client-1',
    professionalId: '6',
    professionalName: 'Amina Bouazza',
    professionalAvatar: '/avatars/amina.jpg',
    serviceCategory: 'Jardinage',
    rating: 4.8,
    reviewCount: 94,
    startingPrice: 100,
    cityName: 'Tanger',
    addedAt: '2024-10-05T09:15:00Z'
  },
  {
    id: 'fav-4',
    clientId: 'client-1',
    professionalId: '11',
    professionalName: 'Hassan Alaoui',
    professionalAvatar: '/avatars/hassan.jpg',
    serviceCategory: 'Ã‰lectricitÃ©',
    rating: 4.8,
    reviewCount: 134,
    startingPrice: 250,
    cityName: 'Casablanca',
    addedAt: '2024-07-12T16:45:00Z'
  },
  {
    id: 'fav-5',
    clientId: 'client-1',
    professionalId: '19',
    professionalName: 'Adil Mansouri',
    professionalAvatar: '/avatars/adil.jpg',
    serviceCategory: 'Ã‰lectricitÃ©',
    rating: 4.9,
    reviewCount: 87,
    startingPrice: 300,
    cityName: 'Rabat',
    addedAt: '2024-11-01T11:20:00Z'
  }
];

export const mockClientStats: ClientStats = {
  totalBookings: 12,
  activeBookings: 2,
  completedBookings: 8,
  totalSpent: 8500,
  averageRating: 4.7,
  favoriteCount: 8,
  unreadMessages: 1
};

// Helper functions for client dashboard
export const getClientBookingsByStatus = (status?: ClientBooking['status']): ClientBooking[] => {
  if (!status) return mockClientBookings;
  return mockClientBookings.filter(booking => booking.status === status);
};

export const getClientUnreadMessages = (): ClientMessage[] => {
  return mockClientMessages.filter(message => !message.isRead && message.isFromClient === false);
};

export const getClientRecentBookings = (limit: number = 5): ClientBooking[] => {
  return mockClientBookings
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
};

export const getClientUpcomingBookings = (): ClientBooking[] => {
  const now = new Date();
  return mockClientBookings
    .filter(booking => {
      const bookingDate = new Date(`${booking.timeSlot}T${booking.scheduledTime}`);
      return bookingDate > now && booking.status !== 'cancelled';
    })
    .sort((a, b) => new Date(a.timeSlot).getTime() - new Date(b.timeSlot).getTime());
};

// Pro Dashboard types
export interface ProProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
  cityId: string;
  cityName?: string;
  serviceCategoryId: string;
  serviceCategoryName?: string;
  title: string;
  shortBio: string;
  isVerified: boolean;
  isPremium: boolean;
  rating: number;
  reviewCount: number;
  responseRate: number; // percentage
  monthlyRevenue: number;
  totalBookings: number;
  completedBookings: number;
  createdAt: string;
  badges: string[];
}

export interface ProBooking {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  clientPhone: string;
  serviceId: string;
  serviceName: string;
  serviceCategory: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  timeSlot: string;
  scheduledTime: string;
  duration: string;
  price: number;
  location: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  unreadMessages: number;
}

export interface ProService {
  id: string;
  proUserId: string;
  proProfileId?: string;
  proId?: string; // legacy alias
  name: string;
  description: string;
  price: number;
  duration: string; // e.g., "1h", "2h30"
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  bookingCount: number;
}

export interface ProTransaction {
  id: string;
  bookingId: string;
  clientName: string;
  serviceName: string;
  amount: number;
  fee: number; // platform fee
  netAmount: number;
  status: 'pending' | 'completed' | 'failed';
  paymentDate: string;
  createdAt: string;
}

export interface ProEarningsStats {
  monthlyRevenue: number;
  totalRevenue: number;
  pendingPayments: number;
  averageTicket: number;
  growthRate: number; // percentage
  totalTransactions: number;
}

// Mock pro data
export const mockProProfile: ProProfile = {
  id: 'pro-1',
  fullName: 'Ahmed Bennani',
  email: 'ahmed.bennani@email.com',
  phone: '+212 6 12 34 56 78',
  avatar: '/avatars/ahmed.jpg',
  cityId: '1',
  cityName: 'Casablanca',
  serviceCategoryId: '1',
  serviceCategoryName: 'Plomberie',
  title: 'Plombier certifiÃ©',
  shortBio: 'Expert en rÃ©paration et installation de plomberie depuis 12 ans. Intervention rapide et garantie.',
  isVerified: true,
  isPremium: false,
  rating: 4.8,
  reviewCount: 127,
  responseRate: 98,
  monthlyRevenue: 12500,
  totalBookings: 45,
  completedBookings: 42,
  createdAt: '2023-06-15T10:00:00Z',
  badges: ['Top professionnel', 'RÃ©ponse rapide', 'Service garanti']
};

export const mockProBookings: ProBooking[] = [
  {
    id: 'pro-booking-1',
    clientId: 'client-1',
    clientName: 'Karim Bennani',
    clientAvatar: '/avatars/client-karim.jpg',
    clientPhone: '+212 6 98 76 54 32',
    serviceId: 'service-1',
    serviceName: 'RÃ©paration de fuite d\'eau',
    serviceCategory: 'Plomberie',
    status: 'confirmed',
    timeSlot: '2024-11-25',
    scheduledTime: '09:00',
    duration: '2h',
    price: 300,
    location: 'Casablanca, Maarif',
    notes: 'Fuite sous l\'Ã©vier de la cuisine',
    createdAt: '2024-11-20T14:30:00Z',
    updatedAt: '2024-11-20T14:30:00Z',
    unreadMessages: 1
  },
  {
    id: 'pro-booking-2',
    clientId: 'client-2',
    clientName: 'Fatima Alaoui',
    clientAvatar: '/avatars/fatima.jpg',
    clientPhone: '+212 6 11 22 33 44',
    serviceId: 'service-2',
    serviceName: 'Installation chauffe-eau',
    serviceCategory: 'Plomberie',
    status: 'pending',
    timeSlot: '2024-11-28',
    scheduledTime: '14:00',
    duration: '3h',
    price: 450,
    location: 'Rabat, Agdal',
    notes: 'Installation d\'un chauffe-eau Ã©lectrique 200L',
    createdAt: '2024-11-18T10:15:00Z',
    updatedAt: '2024-11-18T10:15:00Z',
    unreadMessages: 0
  },
  {
    id: 'pro-booking-3',
    clientId: 'client-3',
    clientName: 'Mohammed Tazi',
    clientAvatar: '/avatars/mohammed.jpg',
    clientPhone: '+212 6 55 66 77 88',
    serviceId: 'service-3',
    serviceName: 'DÃ©bouchage canalisation',
    serviceCategory: 'Plomberie',
    status: 'completed',
    timeSlot: '2024-11-15',
    scheduledTime: '11:00',
    duration: '1h',
    price: 150,
    location: 'Marrakech, Gueliz',
    notes: 'DÃ©bouchage complet salle de bain',
    createdAt: '2024-11-10T09:00:00Z',
    updatedAt: '2024-11-15T12:00:00Z',
    unreadMessages: 0
  },
  {
    id: 'pro-booking-4',
    clientId: 'client-4',
    clientName: 'Leila Mansouri',
    clientAvatar: '/avatars/leila.jpg',
    clientPhone: '+212 6 44 33 22 11',
    serviceId: 'service-4',
    serviceName: 'RÃ©paration robinetterie',
    serviceCategory: 'Plomberie',
    status: 'in_progress',
    timeSlot: '2024-11-22',
    scheduledTime: '16:00',
    duration: '1h30',
    price: 200,
    location: 'Casablanca, Racine',
    notes: 'RÃ©paration de 3 robinets qui fuient',
    createdAt: '2024-11-19T13:45:00Z',
    updatedAt: '2024-11-19T13:45:00Z',
    unreadMessages: 2
  },
  {
    id: 'pro-booking-5',
    clientId: 'client-5',
    clientName: 'Youssef El Amrani',
    clientAvatar: '/avatars/youssef.jpg',
    clientPhone: '+212 6 77 88 99 00',
    serviceId: 'service-5',
    serviceName: 'Installation salle de bain',
    serviceCategory: 'Plomberie',
    status: 'cancelled',
    timeSlot: '2024-11-20',
    scheduledTime: '08:00',
    duration: '4h',
    price: 600,
    location: 'FÃ¨s, Ville Nouvelle',
    notes: 'Installation complÃ¨te douche + WC',
    createdAt: '2024-11-12T11:20:00Z',
    updatedAt: '2024-11-18T15:30:00Z',
    unreadMessages: 0
  }
];

export const mockProServices: ProService[] = [
  {
    id: 'service-1',
    proUserId: 'pro-1',
    name: 'RÃ©paration de fuite d\'eau',
    description: 'Diagnostic et rÃ©paration de toutes types de fuites d\'eau. Intervention rapide garantie.',
    price: 150,
    duration: '1-2h',
    category: 'RÃ©paration',
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    bookingCount: 23
  },
  {
    id: 'service-2',
    proUserId: 'pro-1',
    name: 'Installation de chauffe-eau',
    description: 'Installation complÃ¨te de chauffe-eau Ã©lectrique ou gaz avec mise en service.',
    price: 300,
    duration: '2-3h',
    category: 'Installation',
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    bookingCount: 15
  },
  {
    id: 'service-3',
    proUserId: 'pro-1',
    name: 'DÃ©bouchage canalisation',
    description: 'DÃ©bouchage professionnel avec Ã©quipement spÃ©cialisÃ©. Traitement Ã©cologique.',
    price: 120,
    duration: '30-60min',
    category: 'DÃ©bouchage',
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    bookingCount: 31
  },
  {
    id: 'service-4',
    proUserId: 'pro-1',
    name: 'RÃ©paration robinetterie',
    description: 'RÃ©paration et remplacement de robinets, mÃ©langeurs et accessoires.',
    price: 100,
    duration: '45min-1h',
    category: 'RÃ©paration',
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    bookingCount: 18
  },
  {
    id: 'service-5',
    proUserId: 'pro-1',
    name: 'Installation salle de bain',
    description: 'Installation complÃ¨te de salle de bain : douche, WC, lavabo avec finitions.',
    price: 800,
    duration: '1 journÃ©e',
    category: 'Installation',
    isActive: false,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-06-20T14:00:00Z',
    bookingCount: 7
  }
];

export const mockProTransactions: ProTransaction[] = [
  {
    id: 'txn-1',
    bookingId: 'pro-booking-3',
    clientName: 'Mohammed Tazi',
    serviceName: 'DÃ©bouchage canalisation',
    amount: 150,
    fee: 15, // 10% platform fee
    netAmount: 135,
    status: 'completed',
    paymentDate: '2024-11-15T12:00:00Z',
    createdAt: '2024-11-15T12:00:00Z'
  },
  {
    id: 'txn-2',
    bookingId: 'pro-booking-1',
    clientName: 'Karim Bennani',
    serviceName: 'RÃ©paration de fuite d\'eau',
    amount: 300,
    fee: 30,
    netAmount: 270,
    status: 'completed',
    paymentDate: '2024-11-20T16:00:00Z',
    createdAt: '2024-11-20T16:00:00Z'
  },
  {
    id: 'txn-3',
    bookingId: 'pro-booking-4',
    clientName: 'Leila Mansouri',
    serviceName: 'RÃ©paration robinetterie',
    amount: 200,
    fee: 20,
    netAmount: 180,
    status: 'pending',
    paymentDate: '2024-11-22T16:00:00Z',
    createdAt: '2024-11-19T13:45:00Z'
  },
  {
    id: 'txn-4',
    bookingId: 'pro-booking-2',
    clientName: 'Fatima Alaoui',
    serviceName: 'Installation chauffe-eau',
    amount: 450,
    fee: 45,
    netAmount: 405,
    status: 'pending',
    paymentDate: '2024-11-28T14:00:00Z',
    createdAt: '2024-11-18T10:15:00Z'
  }
];

export const mockProEarningsStats: ProEarningsStats = {
  monthlyRevenue: 12500,
  totalRevenue: 87500,
  pendingPayments: 585,
  averageTicket: 208,
  growthRate: 15.5,
  totalTransactions: 421
};

// Helper functions for pro dashboard
export const getProBookingsByStatus = (status?: ProBooking['status']): ProBooking[] => {
  if (!status) return mockProBookings;
  return mockProBookings.filter(booking => booking.status === status);
};

export const getProRecentBookings = (limit: number = 5): ProBooking[] => {
  return mockProBookings
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
};

export const getProPendingBookings = (): ProBooking[] => {
  return mockProBookings.filter(booking => booking.status === 'pending');
};

export const getProActiveServices = (): ProService[] => {
  return mockProServices.filter(service => service.isActive);
};

export const getProMonthlyTransactions = (month?: string): ProTransaction[] => {
  if (!month) {
    // Return current month transactions
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return mockProTransactions.filter(txn =>
      txn.createdAt.startsWith(currentMonth)
    );
  }
  return mockProTransactions.filter(txn =>
    txn.createdAt.startsWith(month)
  );
};

export const getProRevenueByMonth = (): { month: string; revenue: number }[] => {
  // Mock monthly revenue data for the last 6 months
  return [
    { month: '2024-06', revenue: 9200 },
    { month: '2024-07', revenue: 10100 },
    { month: '2024-08', revenue: 11800 },
    { month: '2024-09', revenue: 11200 },
    { month: '2024-10', revenue: 12100 },
    { month: '2024-11', revenue: 12500 }
  ];
};

// Support & Legal types
export interface SupportCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  articleCount: number;
  isPopular: boolean;
}

export interface SupportArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  views: number;
  helpful: number;
  notHelpful: number;
  tags: string[];
  isPublished: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  isPopular: boolean;
  views: number;
}

// Support mock data
export const mockSupportCategories: SupportCategory[] = [
  {
    id: '1',
    name: 'RÃ©servations',
    slug: 'reservations',
    description: 'Tout savoir sur vos rÃ©servations et rendez-vous',
    icon: 'Calendar',
    color: '#F97B22',
    articleCount: 8,
    isPopular: true
  },
  {
    id: '2',
    name: 'Paiements',
    slug: 'paiements',
    description: 'Paiements sÃ©curisÃ©s et remboursements',
    icon: 'CreditCard',
    color: '#2E7D32',
    articleCount: 6,
    isPopular: true
  },
  {
    id: '3',
    name: 'Mon compte',
    slug: 'compte',
    description: 'Gestion de votre profil et paramÃ¨tres',
    icon: 'User',
    color: '#1976D2',
    articleCount: 5,
    isPopular: false
  },
  {
    id: '4',
    name: 'SÃ©curitÃ©',
    slug: 'securite',
    description: 'Protection de vos donnÃ©es et sÃ©curitÃ©',
    icon: 'Shield',
    color: '#D32F2F',
    articleCount: 4,
    isPopular: false
  },
  {
    id: '5',
    name: 'Litiges',
    slug: 'litiges',
    description: 'RÃ©soudre les problÃ¨mes et conflits',
    icon: 'AlertTriangle',
    color: '#FF9800',
    articleCount: 3,
    isPopular: false
  },
  {
    id: '6',
    name: 'Services',
    slug: 'services',
    description: 'Comprendre nos services et tarifs',
    icon: 'Wrench',
    color: '#9C27B0',
    articleCount: 7,
    isPopular: true
  }
];

export const mockSupportArticles: SupportArticle[] = [
  {
    id: '1',
    slug: 'comment-annuler-reservation',
    title: 'Comment annuler ou modifier une rÃ©servation ?',
    excerpt: 'DÃ©couvrez comment gÃ©rer vos rÃ©servations : annulation, modification de date ou de service.',
    content: `# Comment annuler ou modifier une rÃ©servation ?

Vous pouvez gÃ©rer vos rÃ©servations directement depuis votre tableau de bord client ou l'application mobile.

## Annulation d'une rÃ©servation

### DÃ©lais d'annulation
- **Plus de 24h avant** : Annulation gratuite
- **Entre 24h et 2h avant** : Frais d'annulation de 20%
- **Moins de 2h avant** : Frais d'annulation de 50%

### Comment annuler
1. Connectez-vous Ã  votre compte
2. Allez dans "Mes rÃ©servations"
3. SÃ©lectionnez la rÃ©servation
4. Cliquez sur "Annuler"
5. Confirmez l'annulation

## Modification d'une rÃ©servation

### Ce qui peut Ãªtre modifiÃ©
- Date et heure du rendez-vous
- Adresse d'intervention
- Service demandÃ© (sous conditions)

### Conditions de modification
- Au moins 24h avant le rendez-vous
- MÃªme professionnel disponible
- Tarif identique ou supÃ©rieur

### ProcÃ©dure de modification
1. Contactez directement le professionnel
2. Ou utilisez le chat intÃ©grÃ©
3. Le professionnel confirmera la modification

## Remboursement

### DÃ©lais de traitement
- Annulation gratuite : Remboursement sous 3-5 jours ouvrÃ©s
- Annulation avec frais : Remboursement sous 7-10 jours ouvrÃ©s

### MÃ©thodes de remboursement
- Carte bancaire : MÃªme carte utilisÃ©e
- Virement bancaire : Sur demande
- PayPal : Retour sur votre compte

## Conseils importants

âš ï¸ **Important** : Les annulations rÃ©pÃ©tÃ©es peuvent affecter votre compte.

ðŸ’¡ **Astuce** : Contactez toujours le professionnel en premier pour une modification.

ðŸ“ž **Support** : Notre Ã©quipe est lÃ  pour vous aider en cas de problÃ¨me.`,
    categoryId: '1',
    categoryName: 'RÃ©servations',
    categoryColor: '#F97B22',
    author: 'Ã‰quipe Support Khadamat',
    publishedAt: '2024-11-15T10:00:00Z',
    updatedAt: '2024-11-15T10:00:00Z',
    views: 1250,
    helpful: 89,
    notHelpful: 3,
    tags: ['annulation', 'modification', 'remboursement'],
    isPublished: true
  },
  {
    id: '2',
    slug: 'paiement-securise',
    title: 'Comment fonctionne le paiement sÃ©curisÃ© ?',
    excerpt: 'DÃ©couvrez notre systÃ¨me de paiement sÃ©curisÃ© et les garanties offertes.',
    content: `# Comment fonctionne le paiement sÃ©curisÃ© ?

Chez Khadamat, votre sÃ©curitÃ© est notre prioritÃ©. Nous utilisons les derniÃ¨res technologies de paiement sÃ©curisÃ©.

## Paiement en ligne

### MÃ©thodes acceptÃ©es
- **Carte bancaire** : Visa, MasterCard, American Express
- **PayPal** : Compte PayPal ou carte bancaire
- **Virement bancaire** : Pour les montants Ã©levÃ©s

### SÃ©curitÃ© des transactions
- Chiffrement SSL 256 bits
- Tokenisation des donnÃ©es bancaires
- ConformitÃ© PCI DSS
- Authentification 3D Secure

## Moment du paiement

### RÃ©servation
- Paiement immÃ©diat lors de la rÃ©servation
- Montant bloquÃ© sur votre compte
- LibÃ©ration aprÃ¨s service rendu

### Service terminÃ©
- Confirmation du service par le professionnel
- Validation par le client sous 24h
- Virement au professionnel sous 2-3 jours

## Garanties Khadamat

### Protection acheteur
- Service non conforme : Remboursement intÃ©gral
- Professionnel absent : Annulation gratuite + remboursement
- ProblÃ¨me qualitÃ© : MÃ©diation gratuite

### Assurance qualitÃ©
- VÃ©rification des professionnels
- Avis clients certifiÃ©s
- Support client 7j/7

## Frais et commissions

### Pour les clients
- Aucun frais supplÃ©mentaire
- Prix affichÃ© = prix payÃ©
- Frais de paiement inclus

### Pour les professionnels
- Commission de 10% sur chaque transaction
- Frais de traitement bancaire inclus
- Paiement sous 48h aprÃ¨s service

## ProblÃ¨mes de paiement

### Carte refusÃ©e
- VÃ©rifiez vos fonds disponibles
- Contactez votre banque
- Essayez une autre carte

### Erreur technique
- Actualisez la page
- Videz le cache de votre navigateur
- Contactez notre support

### Remboursement
- Traitement sous 3-5 jours ouvrÃ©s
- MÃªme mÃ©thode de paiement
- Confirmation par email

## Conseils de sÃ©curitÃ©

ðŸ”’ **SÃ©curitÃ©** : Ne partagez jamais vos informations bancaires par email.

âš¡ **RapiditÃ©** : Les paiements sont traitÃ©s instantanÃ©ment.

ðŸ“ž **Support** : Notre Ã©quipe vous aide pour tout problÃ¨me de paiement.`,
    categoryId: '2',
    categoryName: 'Paiements',
    categoryColor: '#2E7D32',
    author: 'Ã‰quipe Support Khadamat',
    publishedAt: '2024-11-12T14:30:00Z',
    updatedAt: '2024-11-12T14:30:00Z',
    views: 890,
    helpful: 76,
    notHelpful: 2,
    tags: ['paiement', 'sÃ©curitÃ©', 'remboursement'],
    isPublished: true
  },
  {
    id: '3',
    slug: 'modifier-mot-de-passe',
    title: 'Comment modifier mon mot de passe ?',
    excerpt: 'Guide simple pour changer votre mot de passe et sÃ©curiser votre compte.',
    content: `# Comment modifier mon mot de passe ?

La sÃ©curitÃ© de votre compte est importante. Voici comment changer votre mot de passe facilement.

## Depuis votre compte

### Via le tableau de bord
1. Connectez-vous Ã  votre compte
2. Cliquez sur votre avatar en haut Ã  droite
3. SÃ©lectionnez "ParamÃ¨tres du compte"
4. Allez dans "SÃ©curitÃ©"
5. Cliquez sur "Changer le mot de passe"

### Via l'application mobile
1. Ouvrez l'application Khadamat
2. Allez dans "Profil"
3. Touchez "ParamÃ¨tres"
4. SÃ©lectionnez "Mot de passe"
5. Suivez les instructions

## Mot de passe oubliÃ©

### RÃ©initialisation par email
1. Sur la page de connexion, cliquez sur "Mot de passe oubliÃ© ?"
2. Entrez votre adresse email
3. VÃ©rifiez votre boÃ®te mail
4. Cliquez sur le lien de rÃ©initialisation
5. CrÃ©ez un nouveau mot de passe

### RÃ©initialisation par SMS
1. Choisissez "RÃ©initialisation par SMS"
2. Entrez votre numÃ©ro de tÃ©lÃ©phone
3. Recevez le code de vÃ©rification
4. Entrez le code
5. CrÃ©ez un nouveau mot de passe

## Exigences du mot de passe

### CritÃ¨res obligatoires
- Au minimum 8 caractÃ¨res
- Au moins une lettre majuscule
- Au moins une lettre minuscule
- Au moins un chiffre
- Au moins un caractÃ¨re spÃ©cial (!@#$%^&*)

### Conseils de sÃ©curitÃ©
- Utilisez des mots de passe uniques
- Changez rÃ©guliÃ¨rement votre mot de passe
- N'utilisez pas d'informations personnelles
- Activez l'authentification Ã  deux facteurs

## Authentification Ã  deux facteurs (2FA)

### Activation
1. Allez dans "ParamÃ¨tres de sÃ©curitÃ©"
2. Cliquez sur "Activer 2FA"
3. Choisissez votre mÃ©thode (SMS ou application)
4. Suivez les instructions d'installation

### Applications recommandÃ©es
- Google Authenticator
- Authy
- Microsoft Authenticator
- LastPass Authenticator

## ProblÃ¨mes courants

### Mot de passe rejetÃ©
- VÃ©rifiez les critÃ¨res de sÃ©curitÃ©
- Ã‰vitez les mots de passe trop simples
- N'utilisez pas votre nom ou date de naissance

### Email de rÃ©initialisation non reÃ§u
- VÃ©rifiez votre dossier spam
- Attendez quelques minutes
- Contactez le support si nÃ©cessaire

### Compte bloquÃ©
- Trop de tentatives de connexion Ã©chouÃ©es
- Contactez le support pour dÃ©blocage
- RÃ©initialisation du mot de passe requise

## Conseils de sÃ©curitÃ©

ðŸ” **ConfidentialitÃ©** : Ne partagez jamais votre mot de passe.

ðŸ“± **2FA** : Activez l'authentification Ã  deux facteurs.

ðŸ”„ **Changement rÃ©gulier** : Changez votre mot de passe tous les 3 mois.

ðŸ“ž **Support** : Notre Ã©quipe vous aide en cas de problÃ¨me.`,
    categoryId: '3',
    categoryName: 'Mon compte',
    categoryColor: '#1976D2',
    author: 'Ã‰quipe Support Khadamat',
    publishedAt: '2024-11-10T09:15:00Z',
    updatedAt: '2024-11-10T09:15:00Z',
    views: 654,
    helpful: 92,
    notHelpful: 1,
    tags: ['mot de passe', 'sÃ©curitÃ©', 'compte'],
    isPublished: true
  },
  {
    id: '4',
    slug: 'signaler-probleme-securite',
    title: 'Comment signaler un problÃ¨me de sÃ©curitÃ© ?',
    excerpt: 'DÃ©couvrez comment signaler les problÃ¨mes de sÃ©curitÃ© et protÃ©ger la communautÃ© Khadamat.',
    content: `# Comment signaler un problÃ¨me de sÃ©curitÃ© ?

La sÃ©curitÃ© de notre communautÃ© est primordiale. Voici comment signaler tout problÃ¨me de sÃ©curitÃ©.

## Types de problÃ¨mes Ã  signaler

### Comptes suspects
- Profils frauduleux
- Tentatives d'escroquerie
- Comportements inappropriÃ©s
- Violations des conditions d'utilisation

### ProblÃ¨mes techniques
- Fuites de donnÃ©es
- AccÃ¨s non autorisÃ©
- Virus ou malware
- Phishing

### ProblÃ¨mes de paiement
- Fraude dÃ©tectÃ©e
- Transactions suspectes
- ProblÃ¨mes de remboursement
- Erreurs de facturation

## Comment signaler

### Via l'application
1. Allez sur le profil ou la rÃ©servation concernÃ©e
2. Cliquez sur les trois points "..."
3. SÃ©lectionnez "Signaler un problÃ¨me"
4. Choisissez la catÃ©gorie du problÃ¨me
5. DÃ©crivez le problÃ¨me en dÃ©tail
6. Ajoutez des captures d'Ã©cran si possible

### Via le site web
1. Connectez-vous Ã  votre compte
2. Allez dans "Aide & Support"
3. Cliquez sur "Signaler un problÃ¨me"
4. Remplissez le formulaire dÃ©taillÃ©
5. TÃ©lÃ©chargez des preuves si nÃ©cessaire

### Par email
- **Support sÃ©curitÃ©** : security@khadamat.ma
- **Urgences** : emergency@khadamat.ma
- **Fraude** : fraud@khadamat.ma

## Traitement des signalements

### DÃ©lais de rÃ©ponse
- **Signalements standards** : 24-48h
- **Urgences sÃ©curitÃ©** : ImmÃ©diat
- **Fraude** : 4-6h ouvrÃ©es

### Actions prises
- Investigation approfondie
- Suspension temporaire si nÃ©cessaire
- RÃ©solution du problÃ¨me
- Communication transparente

## Protection de vos donnÃ©es

### ConfidentialitÃ©
- Vos signalements sont confidentiels
- Anonymat prÃ©servÃ© si souhaitÃ©
- Protection des donnÃ©es personnelles

### Suivi
- NumÃ©ro de ticket pour suivi
- Mises Ã  jour rÃ©guliÃ¨res
- RÃ©solution garantie

## PrÃ©vention

### Conseils de sÃ©curitÃ©
- VÃ©rifiez toujours les profils
- Utilisez des mots de passe forts
- Activez l'authentification 2FA
- MÃ©fiez-vous des offres trop belles

### Signes d'alerte
- Prix anormalement bas
- Demandes de paiement extÃ©rieur
- Pression pour rÃ©server rapidement
- Informations manquantes sur le profil

## Contact d'urgence

### En cas d'urgence
- **Police** : 19 (Maroc)
- **Support Khadamat** : +212 6 12 34 56 78
- **Email urgence** : emergency@khadamat.ma

### Heures d'ouverture
- Support sÃ©curitÃ© : 24h/24, 7j/7
- Support technique : 8h-20h, du lundi au samedi
- Support commercial : 9h-18h, du lundi au vendredi

## Engagement Khadamat

ðŸ›¡ï¸ **SÃ©curitÃ©** : Nous prenons tous les signalements au sÃ©rieux.

âš¡ **RapiditÃ©** : Action immÃ©diate sur les menaces graves.

ðŸ¤ **Transparence** : Communication claire sur les actions prises.

ðŸ“ž **Support** : Notre Ã©quipe est lÃ  pour vous protÃ©ger.`,
    categoryId: '4',
    categoryName: 'SÃ©curitÃ©',
    categoryColor: '#D32F2F',
    author: 'Ã‰quipe Support Khadamat',
    publishedAt: '2024-11-08T11:45:00Z',
    updatedAt: '2024-11-08T11:45:00Z',
    views: 432,
    helpful: 67,
    notHelpful: 0,
    tags: ['sÃ©curitÃ©', 'signalement', 'fraude'],
    isPublished: true
  },
  {
    id: '5',
    slug: 'resoudre-litige-client',
    title: 'Comment rÃ©soudre un litige avec un professionnel ?',
    excerpt: 'Guide pour rÃ©soudre les conflits et obtenir satisfaction en cas de problÃ¨me.',
    content: `# Comment rÃ©soudre un litige avec un professionnel ?

Nous sommes lÃ  pour vous aider Ã  rÃ©soudre tout litige de maniÃ¨re amiable et efficace.

## Ã‰tapes de rÃ©solution

### 1. Contact direct
**PremiÃ¨re Ã©tape** : Contactez toujours le professionnel en premier.

#### Comment procÃ©der
- Utilisez le chat intÃ©grÃ© Ã  la plateforme
- Soyez courtois et prÃ©cis dans votre demande
- Fournissez des photos ou vidÃ©os si nÃ©cessaire
- Donnez un dÃ©lai raisonnable pour la rÃ©ponse

#### DÃ©lais attendus
- RÃ©ponse sous 24h pour les professionnels actifs
- RÃ©solution sous 48-72h pour les problÃ¨mes simples
- Plus de temps pour les problÃ¨mes complexes

### 2. MÃ©diation Khadamat
**DeuxiÃ¨me Ã©tape** : Si le contact direct Ã©choue.

#### Quand faire appel Ã  nous
- Pas de rÃ©ponse du professionnel sous 48h
- Refus injustifiÃ© de rÃ©soudre le problÃ¨me
- DÃ©saccord sur la qualitÃ© du service
- ProblÃ¨me de facturation

#### Comment nous contacter
1. Allez dans "Mes rÃ©servations"
2. SÃ©lectionnez la rÃ©servation concernÃ©e
3. Cliquez sur "Signaler un problÃ¨me"
4. Choisissez "Litige avec professionnel"
5. DÃ©crivez le problÃ¨me en dÃ©tail

### 3. Arbitrage
**DerniÃ¨re Ã©tape** : Si la mÃ©diation Ã©choue.

#### Conditions d'arbitrage
- Preuves suffisantes fournies
- Tentative de rÃ©solution amiable effectuÃ©e
- DÃ©lai de 30 jours aprÃ¨s la prestation
- Montant du litige > 200 DH

#### ProcÃ©dure
- Soumission du dossier complet
- Examen par notre Ã©quipe d'arbitrage
- DÃ©cision sous 15 jours
- Application immÃ©diate de la dÃ©cision

## Types de litiges courants

### QualitÃ© du service
- Travail non conforme aux attentes
- MatÃ©riaux de mauvaise qualitÃ©
- DÃ©lais non respectÃ©s
- Comportement inappropriÃ©

### ProblÃ¨mes de paiement
- Frais supplÃ©mentaires non prÃ©vus
- Facturation erronÃ©e
- Remboursement refusÃ©
- ProblÃ¨mes techniques de paiement

### Annulation et retard
- Annulation injustifiÃ©e
- Retards importants
- Non-prÃ©sentation du professionnel
- Changement de conditions

## Garanties Khadamat

### Protection client
- **Satisfaction garantie** : RÃ©solution de 95% des litiges
- **Remboursement possible** : Jusqu'Ã  100% selon le cas
- **Support gratuit** : MÃ©diation sans frais supplÃ©mentaires
- **RapiditÃ©** : Traitement sous 48h en moyenne

### Engagements
- **ImpartialitÃ©** : DÃ©cisions basÃ©es sur les faits
- **Transparence** : Communication claire des dÃ©cisions
- **EfficacitÃ©** : RÃ©solutions concrÃ¨tes et applicables

## PrÃ©vention des litiges

### Avant la rÃ©servation
- Lisez attentivement les profils professionnels
- VÃ©rifiez les avis et certifications
- Posez toutes vos questions avant de rÃ©server
- Prenez des photos de l'Ã©tat initial

### Pendant le service
- Communiquez rÃ©guliÃ¨rement avec le professionnel
- Notez tout problÃ¨me immÃ©diatement
- Prenez des photos du travail en cours
- Conservez tous les Ã©changes

### AprÃ¨s le service
- Laissez un avis dÃ©taillÃ©
- Signalez immÃ©diatement tout problÃ¨me
- Conservez les factures et photos
- Contactez le support si nÃ©cessaire

## Contact support litiges

### CoordonnÃ©es
- **Email** : litiges@khadamat.ma
- **TÃ©lÃ©phone** : +212 6 12 34 56 78
- **Chat** : Disponible 24h/24 dans l'application

### Horaires
- **Support litiges** : 9h-18h, du lundi au vendredi
- **Urgences** : 24h/24, 7j/7
- **DÃ©lai de rÃ©ponse** : 4h maximum

## Conseils importants

âš–ï¸ **Calme** : Restez courtois dans vos Ã©changes.

ðŸ“ **Preuves** : Conservez tous les Ã©lÃ©ments de preuve.

â° **RapiditÃ©** : Signalez les problÃ¨mes rapidement.

ðŸ¤ **Dialogue** : Le dialogue rÃ©sout 80% des litiges.

ðŸ“ž **Support** : Notre Ã©quipe vous accompagne Ã  chaque Ã©tape.`,
    categoryId: '5',
    categoryName: 'Litiges',
    categoryColor: '#FF9800',
    author: 'Ã‰quipe Support Khadamat',
    publishedAt: '2024-11-05T16:20:00Z',
    updatedAt: '2024-11-05T16:20:00Z',
    views: 387,
    helpful: 58,
    notHelpful: 2,
    tags: ['litige', 'rÃ©solution', 'mÃ©diation'],
    isPublished: true
  },
  {
    id: '6',
    slug: 'comprendre-tarifs-services',
    title: 'Comment comprendre les tarifs des services ?',
    excerpt: 'DÃ©couvrez comment sont fixÃ©s les prix et ce qui influence les tarifs.',
    content: `# Comment comprendre les tarifs des services ?

Les prix sur Khadamat sont transparents et compÃ©titifs. Voici comment ils sont dÃ©terminÃ©s.

## Structure des prix

### Prix affichÃ©
- **Prix de base** : Tarif minimum pour le service standard
- **Prix moyen** : Tarif le plus demandÃ©
- **Prix maximum** : Pour services premium ou complexes

### Ã‰lÃ©ments inclus
- DÃ©placement du professionnel
- Main d'Å“uvre qualifiÃ©e
- MatÃ©riaux de base (si mentionnÃ©)
- Garantie du travail
- Assurance responsabilitÃ© civile

## Facteurs influenÃ§ant les prix

### ExpÃ©rience du professionnel
- **DÃ©butant** : 0-2 ans d'expÃ©rience (-20% sur moyenne)
- **ConfirmÃ©** : 3-5 ans d'expÃ©rience (prix moyen)
- **Expert** : 5+ ans d'expÃ©rience (+20% sur moyenne)

### ComplexitÃ© du travail
- **Simple** : Travaux standards (-10%)
- **Moyen** : Travaux nÃ©cessitant expertise (prix de base)
- **Complexe** : Travaux techniques avancÃ©s (+30%)

### Localisation
- **Casablanca/Rabat** : Prix de rÃ©fÃ©rence
- **Marrakech/FÃ¨s** : -5% Ã  +5%
- **Autres villes** : -10% Ã  +10%

### SaisonnalitÃ©
- **Haute saison** : +10-15% (Ã©tÃ© pour clim, hiver pour chauffage)
- **Basse saison** : -5% (pÃ©riodes creuses)

## Tarifs par catÃ©gorie

### Plomberie
- **RÃ©paration fuite** : 150-300 DH
- **Installation chauffe-eau** : 300-600 DH
- **Salle de bain complÃ¨te** : 800-2000 DH

### Ã‰lectricitÃ©
- **RÃ©paration prise** : 100-200 DH
- **Installation complÃ¨te** : 2500-5000 DH
- **Domotique** : 1500-3000 DH

### MÃ©nage
- **MÃ©nage standard** : 80-120 DH
- **Grand mÃ©nage** : 150-250 DH
- **Nettoyage bureaux** : 100-150 DH

### Peinture
- **PiÃ¨ce simple** : 400-600 DH
- **FaÃ§ade** : 800-1500 DH
- **DÃ©coratif** : 200-400 DH

## Frais supplÃ©mentaires

### DÃ©placements
- **Zone urbaine** : Inclus dans le prix
- **Zone pÃ©riurbaine** : +50-100 DH
- **Zone rurale** : +100-200 DH

### MatÃ©riaux
- **Fournis par le pro** : +20-50% sur coÃ»t rÃ©el
- **Fournis par le client** : Prix main d'Å“uvre uniquement
- **Options premium** : +10-30% sur tarif standard

### Urgences
- **Intervention < 24h** : +50% sur tarif normal
- **Intervention < 2h** : +100% sur tarif normal
- **Week-end/nuits** : +30% sur tarif normal

## RÃ©ductions et avantages

### Khadamat Premium
- **RÃ©duction** : -10% sur tous les services
- **PrioritÃ©** : RÃ©servation accÃ©lÃ©rÃ©e
- **Support** : Ligne dÃ©diÃ©e

### Premiers clients
- **RÃ©duction** : -15% sur 3 premiÃ¨res rÃ©servations
- **Code promo** : KHADAMAT15

### FidÃ©litÃ©
- **Ã€ partir de 5 rÃ©servations** : -5% automatique
- **Programme VIP** : RÃ©ductions croissantes

## Transparence des prix

### Commission Khadamat
- **10%** sur chaque transaction
- Inclus dans le prix affichÃ©
- Support et sÃ©curitÃ© inclus

### Pas de frais cachÃ©s
- Prix affichÃ© = prix payÃ©
- Pas de frais de rÃ©servation
- Pas de frais d'annulation (sous conditions)

### Garanties incluses
- **QualitÃ©** : Garantie 1 an sur travaux
- **Satisfaction** : Remboursement si insatisfaction
- **Assurance** : Couverture professionnelle

## Conseils pour Ã©conomiser

### Planification
- RÃ©servez Ã  l'avance pour Ã©viter supplÃ©ments
- Choisissez des crÃ©neaux standards
- Regroupez plusieurs services

### Comparaison
- Comparez 3 devis minimum
- Lisez les avis clients
- VÃ©rifiez les certifications

### NÃ©gociation
- NÃ©gociez pour travaux multiples
- Demandez devis dÃ©taillÃ©
- Mentionnez concurrence si pertinente

## Support tarifaire

### Questions frÃ©quentes
- **Prix trop Ã©levÃ©** : Contactez le professionnel pour nÃ©gocier
- **Prix trop bas** : MÃ©fiance, peut indiquer manque de qualitÃ©
- **Devis gratuit** : Toujours demandÃ© avant rÃ©servation

### Contact
- **Email** : tarifs@khadamat.ma
- **Chat** : Disponible dans l'application
- **TÃ©lÃ©phone** : +212 6 12 34 56 78

## Engagement transparence

ðŸ’° **ClartÃ©** : Prix transparents et justifiÃ©s.

âš–ï¸ **Ã‰quitÃ©** : Tarifs adaptÃ©s Ã  la qualitÃ© du service.

ðŸ¤ **Confiance** : Pas de mauvaises surprises.

ðŸ“ž **Support** : Notre Ã©quipe explique tous les tarifs.`,
    categoryId: '6',
    categoryName: 'Services',
    categoryColor: '#9C27B0',
    author: 'Ã‰quipe Support Khadamat',
    publishedAt: '2024-11-03T13:10:00Z',
    updatedAt: '2024-11-03T13:10:00Z',
    views: 756,
    helpful: 83,
    notHelpful: 1,
    tags: ['tarifs', 'prix', 'transparence'],
    isPublished: true
  }
];

export const mockFAQItems: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Comment puis-je annuler une rÃ©servation ?',
    answer: 'Vous pouvez annuler votre rÃ©servation directement depuis votre tableau de bord client. Allez dans "Mes rÃ©servations", sÃ©lectionnez la rÃ©servation concernÃ©e et cliquez sur "Annuler". Les conditions d\'annulation varient selon le dÃ©lai avant le rendez-vous.',
    category: 'RÃ©servations',
    isPopular: true,
    views: 1250
  },
  {
    id: 'faq-2',
    question: 'Quand serai-je dÃ©bitÃ© pour ma rÃ©servation ?',
    answer: 'Le paiement est dÃ©bitÃ© immÃ©diatement lors de la confirmation de votre rÃ©servation. Les fonds sont sÃ©curisÃ©s et ne sont versÃ©s au professionnel qu\'aprÃ¨s validation du service rendu.',
    category: 'Paiements',
    isPopular: true,
    views: 890
  },
  {
    id: 'faq-3',
    question: 'Comment contacter un professionnel ?',
    answer: 'Utilisez le systÃ¨me de messagerie intÃ©grÃ© Ã  la plateforme. Allez sur la page du professionnel ou dans vos rÃ©servations actives pour accÃ©der au chat. Les professionnels rÃ©pondent gÃ©nÃ©ralement sous 2 heures.',
    category: 'RÃ©servations',
    isPopular: true,
    views: 654
  },
  {
    id: 'faq-4',
    question: 'Que faire si le professionnel est en retard ?',
    answer: 'Contactez immÃ©diatement le professionnel via le chat. Si le retard dÃ©passe 30 minutes, vous pouvez annuler gratuitement. Khadamat vous remboursera intÃ©gralement.',
    category: 'RÃ©servations',
    isPopular: false,
    views: 432
  },
  {
    id: 'faq-5',
    question: 'Comment modifier mes informations de paiement ?',
    answer: 'Allez dans "ParamÃ¨tres du compte" > "Moyens de paiement". Vous pouvez ajouter, modifier ou supprimer vos cartes bancaires. Toutes les transactions sont sÃ©curisÃ©es.',
    category: 'Paiements',
    isPopular: false,
    views: 387
  },
  {
    id: 'faq-6',
    question: 'Comment laisser un avis sur un service ?',
    answer: 'AprÃ¨s validation du service, vous recevrez une notification pour laisser votre avis. Les avis sont anonymes et aident la communautÃ© Ã  choisir les meilleurs professionnels.',
    category: 'Mon compte',
    isPopular: false,
    views: 298
  },
  {
    id: 'faq-7',
    question: 'Que faire en cas de problÃ¨me avec un service ?',
    answer: 'Contactez d\'abord le professionnel via le chat. Si le problÃ¨me persiste, signalez-le via "Signaler un problÃ¨me" dans votre rÃ©servation. Notre Ã©quipe de mÃ©diation interviendra gratuitement.',
    category: 'Litiges',
    isPopular: true,
    views: 567
  },
  {
    id: 'faq-8',
    question: 'Comment devenir professionnel sur Khadamat ?',
    answer: 'Rendez-vous sur khadamat.ma/devenir-pro pour crÃ©er votre profil. Vous devrez fournir vos certifications, assurances et rÃ©fÃ©rences. Notre Ã©quipe valide chaque candidature sous 48h.',
    category: 'Services',
    isPopular: false,
    views: 723
  },
  {
    id: 'faq-9',
    question: 'Mes donnÃ©es personnelles sont-elles sÃ©curisÃ©es ?',
    answer: 'Oui, nous respectons le RGPD et utilisons le chiffrement SSL. Vos donnÃ©es ne sont jamais vendues et ne servent qu\'Ã  amÃ©liorer votre expÃ©rience sur la plateforme.',
    category: 'SÃ©curitÃ©',
    isPopular: false,
    views: 345
  },
  {
    id: 'faq-10',
    question: 'Comment fonctionne la garantie Khadamat ?',
    answer: 'Tous les services bÃ©nÃ©ficient d\'une garantie de 1 an. En cas de problÃ¨me, contactez le support. Nous organisons une intervention corrective gratuite ou un remboursement.',
    category: 'Services',
    isPopular: true,
    views: 678
  }
];

// Helper functions for support
export const getSupportArticleBySlug = (slug: string): SupportArticle | undefined => {
  return mockSupportArticles.find(article => article.slug === slug && article.isPublished);
};

export const getSupportArticlesByCategory = (categorySlug: string): SupportArticle[] => {
  const category = mockSupportCategories.find(cat => cat.slug === categorySlug);
  if (!category) return [];
  return mockSupportArticles.filter(article => article.categoryId === category.id && article.isPublished);
};

export const getPopularSupportArticles = (limit: number = 5): SupportArticle[] => {
  return mockSupportArticles
    .filter(article => article.isPublished)
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
};

export const getRelatedSupportArticles = (currentArticle: SupportArticle, limit: number = 3): SupportArticle[] => {
  return mockSupportArticles
    .filter(article =>
      article.id !== currentArticle.id &&
      article.isPublished &&
      (article.categoryId === currentArticle.categoryId ||
       article.tags.some(tag => currentArticle.tags.includes(tag)))
    )
    .slice(0, limit);
};

export const searchSupportArticles = (query: string): SupportArticle[] => {
  if (!query.trim()) return mockSupportArticles.filter(article => article.isPublished);

  const searchTerm = query.toLowerCase();
  return mockSupportArticles
    .filter(article =>
      article.isPublished && (
        article.title.toLowerCase().includes(searchTerm) ||
        article.content.toLowerCase().includes(searchTerm) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        article.categoryName.toLowerCase().includes(searchTerm)
      )
    );
};

export const getPopularFAQItems = (limit: number = 5): FAQItem[] => {
  return mockFAQItems
    .filter(faq => faq.isPopular)
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
};

// About page types
export interface CompanyStats {
  prosCount: number;
  missionsCompleted: number;
  averageRating: number;
  citiesCovered: number;
}

export interface TeamMember {
  id: string;
  fullName: string;
  role: string;
  shortBio: string;
  avatarUrl: string;
}

export interface CompanyValue {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

// About page mock data
export const mockCompanyStats: CompanyStats = {
  prosCount: 2500,
  missionsCompleted: 15000,
  averageRating: 4.8,
  citiesCovered: 15
};

export const mockTeamMembers: TeamMember[] = [
  {
    id: 'team-1',
    fullName: 'Ahmed Bennani',
    role: 'Co-fondateur & CEO',
    shortBio: 'PassionnÃ© par la simplification des services au Maroc, Ahmed a fondÃ© Khadamat pour connecter artisans et clients de maniÃ¨re transparente.',
    avatarUrl: '/avatars/team-ahmed.jpg'
  },
  {
    id: 'team-2',
    fullName: 'Fatima Alaoui',
    role: 'Co-fondatrice & CTO',
    shortBio: 'Experte en technologie, Fatima dÃ©veloppe les solutions innovantes qui rendent Khadamat fiable et sÃ©curisÃ©e pour tous.',
    avatarUrl: '/avatars/team-fatima.jpg'
  },
  {
    id: 'team-3',
    fullName: 'Youssef Tazi',
    role: 'Directeur des OpÃ©rations',
    shortBio: 'Avec 10 ans d\'expÃ©rience dans les services, Youssef assure la qualitÃ© et la satisfaction de chaque intervention.',
    avatarUrl: '/avatars/team-youssef.jpg'
  },
  {
    id: 'team-4',
    fullName: 'Leila Mansouri',
    role: 'Responsable QualitÃ©',
    shortBio: 'Leila veille Ã  ce que chaque professionnel respecte nos standards Ã©levÃ©s de service et de sÃ©curitÃ©.',
    avatarUrl: '/avatars/team-leila.jpg'
  },
  {
    id: 'team-5',
    fullName: 'Karim Alaoui',
    role: 'Chef Produit',
    shortBio: 'Karim conÃ§oit les fonctionnalitÃ©s qui rendent Khadamat intuitive et adaptÃ©e aux besoins des utilisateurs marocains.',
    avatarUrl: '/avatars/team-karim.jpg'
  },
  {
    id: 'team-6',
    fullName: 'Amina Bouazza',
    role: 'Responsable Support Client',
    shortBio: 'Amina et son Ã©quipe accompagnent clients et professionnels pour une expÃ©rience exceptionnelle sur la plateforme.',
    avatarUrl: '/avatars/team-amina.jpg'
  }
];

export const mockCompanyValues: CompanyValue[] = [
  {
    id: 'value-1',
    title: 'SÃ©curitÃ©',
    description: 'Nous garantissons des transactions sÃ©curisÃ©es et vÃ©rifions rigoureusement tous nos professionnels.',
    iconName: 'Shield'
  },
  {
    id: 'value-2',
    title: 'Transparence',
    description: 'Prix clairs, avis authentiques, processus transparents : la confiance est au cÅ“ur de notre modÃ¨le.',
    iconName: 'Eye'
  },
  {
    id: 'value-3',
    title: 'QualitÃ©',
    description: 'Nous sÃ©lectionnons les meilleurs artisans et assurons un suivi qualitÃ© sur chaque mission.',
    iconName: 'Award'
  },
  {
    id: 'value-4',
    title: 'ProximitÃ©',
    description: 'Plateforme 100% marocaine, nous comprenons les besoins locaux et valorisons l\'expertise nationale.',
    iconName: 'Heart'
  }
];

