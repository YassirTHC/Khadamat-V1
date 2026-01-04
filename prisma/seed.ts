import { PrismaClient, PricingType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-');

type ProSeed = {
  slug: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  profession: string;
  cityId: string;
  verificationStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  isVerifiedPro?: boolean;
  isPremium?: boolean;
  averageRating?: number;
  totalReviews?: number;
  bio?: string;
  phoneVerified?: boolean;
  cguAccepted?: boolean;
  services: {
    id: string;
    categoryId: string;
    cityId: string;
    pricingType?: 'FIXED' | 'QUOTE';
    basePrice?: number;
    minPrice?: number;
    maxPrice?: number;
    description: string;
  }[];
};

async function main() {
  console.log('Seed: demarrage ...');

  // 1) Cities
  const cityNames = [
    'Casablanca',
    'Rabat',
    'Marrakech',
    'Tanger',
    'Agadir',
    'Fes',
    'Kenitra',
    'Oujda',
    'Meknes',
    'Tetouan',
    'Essaouira',
  ];
  const cities = await Promise.all(
    cityNames.map((name) => {
      const id = slugify(name);
      return prisma.city.upsert({
        where: { id },
        update: { name, isActive: true },
        create: { id, name, isActive: true },
      });
    }),
  );
  console.log(`Villes synchronisees: ${cities.length}`);

  // 2) Categories / service types
  const categories = [
    { id: 'plomberie', name: 'Plomberie' },
    { id: 'electricite', name: 'Electricite' },
    { id: 'menage', name: 'Menage' },
    { id: 'peinture', name: 'Peinture' },
    { id: 'maconnerie', name: 'Maconnerie' },
    { id: 'jardinage', name: 'Jardinage' },
    { id: 'climatisation', name: 'Climatisation' },
    { id: 'menuiserie', name: 'Menuiserie' },
    { id: 'nettoyage', name: 'Nettoyage industriel' },
    { id: 'depannage', name: 'Depannage' },
    { id: 'serrurerie', name: 'Serrurerie' },
  ];
  await Promise.all(
    categories.map((cat) =>
      prisma.serviceCategory.upsert({
        where: { id: cat.id },
        update: { name: cat.name, isActive: true, icon: 'Wrench' },
        create: { ...cat, isActive: true, icon: 'Wrench' },
      }),
    ),
  );
  console.log(`Categories synchronisees: ${categories.length}`);

  // 2bis) Subscription plan Premium (149 MAD/mois)
  await prisma.subscriptionPlan.upsert({
    where: { id: 'premium-149-mad' },
    update: {
      name: 'Premium',
      description: 'Boost visibilite + badge Premium + analytics leger',
      price: 149,
      duration: 30,
      features: JSON.stringify(['Badge Premium', 'Boost visibilite', 'Analytics leger']),
      isActive: true,
    },
    create: {
      id: 'premium-149-mad',
      name: 'Premium',
      description: 'Boost visibilite + badge Premium + analytics leger',
      price: 149,
      duration: 30,
      features: JSON.stringify(['Badge Premium', 'Boost visibilite', 'Analytics leger']),
      isActive: true,
    },
  });

  // 3) Users / Pros
  const passwordRaw = 'password123';
  const passwordHash = await bcrypt.hash(passwordRaw, 10);

  const pros: ProSeed[] = [
    // Pro PENDING (profil incomplet, pas de service actif)
    {
      slug: 'pending-pro',
      email: 'pro.pending@test.com',
      phone: '+212600001999',
      firstName: 'Pending',
      lastName: 'Pro',
      profession: 'En attente',
      cityId: 'rabat',
      verificationStatus: 'PENDING',
      isVerifiedPro: false,
      isPremium: false,
      bio: 'Profil en attente.',
      phoneVerified: false,
      cguAccepted: false,
      services: [],
    },
    // Pro QUOTE (profil complet + 1 service QUOTE)
    {
      slug: 'quote-pro',
      email: 'pro.quote@test.com',
      phone: '+212600002001',
      firstName: 'Quote',
      lastName: 'Pro',
      profession: 'Peintre devis',
      cityId: 'casablanca',
      verificationStatus: 'APPROVED',
      isVerifiedPro: true,
      isPremium: false,
      bio: 'Peintre specialise avec plus de 8 ans experience, propose devis personnalises et visites prealables.',
      phoneVerified: true,
      cguAccepted: true,
      averageRating: 4.5,
      totalReviews: 12,
      services: [
        {
          id: 'svc-peinture-casa-quote',
          categoryId: 'peinture',
          cityId: 'casablanca',
          pricingType: 'QUOTE',
          basePrice: undefined,
          minPrice: 0,
          maxPrice: 0,
          description: 'Peinture interieure/exterieure sur devis, visite necessaire.',
        },
      ],
    },
    // Pro VERIFIED (profil complet + 1 service actif FIXED)
    {
      slug: 'verified-pro',
      email: 'pro.verified@test.com',
      phone: '+212600002000',
      firstName: 'Verified',
      lastName: 'Pro',
      profession: 'Plombier',
      cityId: 'casablanca',
      verificationStatus: 'APPROVED',
      isVerifiedPro: true,
      isPremium: false,
      bio: 'Plombier certifie avec plus de 10 ans experience, interventions rapides et travaux garantis.',
      phoneVerified: true,
      cguAccepted: true,
      averageRating: 4.7,
      totalReviews: 42,
      services: [
        {
          id: 'svc-plomberie-casa-verified',
          categoryId: 'plomberie',
          cityId: 'casablanca',
          pricingType: 'FIXED',
          basePrice: 300,
          minPrice: 250,
          maxPrice: 700,
          description: 'Interventions plomberie, diagnostics et reparations courantes.',
        },
      ],
    },
    {
      slug: 'youssef-el-idrissi',
      email: 'pro.youssef@test.com',
      phone: '+212600000101',
      firstName: 'Youssef',
      lastName: 'El Idrissi',
      profession: 'Plombier',
      cityId: 'casablanca',
      isVerifiedPro: true,
      isPremium: true,
      averageRating: 4.8,
      totalReviews: 120,
      services: [
        {
          id: 'svc-plomberie-casa-youssef',
          categoryId: 'plomberie',
          cityId: 'casablanca',
          pricingType: 'FIXED',
          basePrice: 250,
          minPrice: 200,
          maxPrice: 600,
          description: 'Plomberie generale et urgences 24/7 a Casablanca',
        },
      ],
    },
    {
      slug: 'noura-elmokhtar',
      email: 'pro.noura@test.com',
      phone: '+212600000102',
      firstName: 'Noura',
      lastName: 'El Mokhtar',
      profession: 'Electricienne',
      cityId: 'rabat',
      isVerifiedPro: true,
      isPremium: false,
      averageRating: 4.6,
      totalReviews: 95,
      services: [
        {
          id: 'svc-electricite-rabat-noura',
          categoryId: 'electricite',
          cityId: 'rabat',
          pricingType: 'FIXED',
          basePrice: 220,
          minPrice: 180,
          maxPrice: 520,
          description: 'Diagnostics electriques et depannages rapides.',
        },
      ],
    },
    {
      slug: 'hassan-bouhaja',
      email: 'pro.hassan@test.com',
      phone: '+212600000103',
      firstName: 'Hassan',
      lastName: 'Bouhaja',
      profession: 'Climatisation',
      cityId: 'marrakech',
      isVerifiedPro: true,
      isPremium: false,
      averageRating: 4.3,
      totalReviews: 80,
      services: [
        {
          id: 'svc-clim-marrakech-hassan',
          categoryId: 'climatisation',
          cityId: 'marrakech',
          pricingType: 'FIXED',
          basePrice: 350,
          minPrice: 300,
          maxPrice: 850,
          description: 'Installation et maintenance climatisation.',
        },
      ],
    },
    {
      slug: 'fatima-zaidi',
      email: 'pro.fatima@test.com',
      phone: '+212600000104',
      firstName: 'Fatima',
      lastName: 'Zaidi',
      profession: 'Serrurerie',
      cityId: 'tanger',
      isVerifiedPro: true,
      isPremium: false,
      averageRating: 4.5,
      totalReviews: 70,
      services: [
        {
          id: 'svc-serrurerie-tanger-fatima',
          categoryId: 'serrurerie',
          cityId: 'tanger',
          pricingType: 'FIXED',
          basePrice: 200,
          minPrice: 150,
          maxPrice: 450,
          description: 'Ouverture portes, changement serrures.',
        },
      ],
    },
    {
      slug: 'samir-laarbi',
      email: 'pro.samir@test.com',
      phone: '+212600000105',
      firstName: 'Samir',
      lastName: 'Laarbi',
      profession: 'Electricien',
      cityId: 'agadir',
      isVerifiedPro: true,
      isPremium: false,
      averageRating: 4.4,
      totalReviews: 65,
      services: [
        {
          id: 'svc-electricite-agadir-samir',
          categoryId: 'electricite',
          cityId: 'agadir',
          pricingType: 'FIXED',
          basePrice: 210,
          minPrice: 170,
          maxPrice: 500,
          description: 'Installations et depannages electriques.',
        },
      ],
    },
    {
      slug: 'imane-cherkaoui',
      email: 'pro.imane@test.com',
      phone: '+212600000106',
      firstName: 'Imane',
      lastName: 'Cherkaoui',
      profession: 'Peinture',
      cityId: 'fes',
      isVerifiedPro: true,
      isPremium: false,
      averageRating: 4.2,
      totalReviews: 55,
      services: [
        {
          id: 'svc-peinture-fes-imane',
          categoryId: 'peinture',
          cityId: 'fes',
          pricingType: 'FIXED',
          basePrice: 240,
          minPrice: 200,
          maxPrice: 620,
          description: 'Peinture interieure/exterieure.',
        },
      ],
    },
    {
      slug: 'khalid-amine',
      email: 'pro.khalid@test.com',
      phone: '+212600000107',
      firstName: 'Khalid',
      lastName: 'Amine',
      profession: 'Depannage',
      cityId: 'kenitra',
      isVerifiedPro: true,
      isPremium: false,
      averageRating: 4.3,
      totalReviews: 60,
      services: [
        {
          id: 'svc-depannage-kenitra-khalid',
          categoryId: 'depannage',
          cityId: 'kenitra',
          pricingType: 'FIXED',
          basePrice: 230,
          minPrice: 180,
          maxPrice: 550,
          description: 'Depannages urgents multi-services.',
        },
      ],
    },
    {
      slug: 'salma-el-fassi',
      email: 'pro.salma@test.com',
      phone: '+212600000108',
      firstName: 'Salma',
      lastName: 'El Fassi',
      profession: 'Menage',
      cityId: 'oujda',
      isVerifiedPro: true,
      isPremium: false,
      averageRating: 4.0,
      totalReviews: 45,
      services: [
        {
          id: 'svc-menage-oujda-salma',
          categoryId: 'menage',
          cityId: 'oujda',
          pricingType: 'FIXED',
          basePrice: 180,
          minPrice: 150,
          maxPrice: 420,
          description: 'Menage a domicile et bureaux.',
        },
      ],
    },
    {
      slug: 'omar-el-khayati',
      email: 'pro.omar@test.com',
      phone: '+212600000109',
      firstName: 'Omar',
      lastName: 'El Khayati',
      profession: 'Maconnerie',
      cityId: 'meknes',
      isVerifiedPro: true,
      isPremium: false,
      averageRating: 4.3,
      totalReviews: 58,
      services: [
        {
          id: 'svc-maconnerie-meknes-omar',
          categoryId: 'maconnerie',
          cityId: 'meknes',
          pricingType: 'FIXED',
          basePrice: 400,
          minPrice: 350,
          maxPrice: 950,
          description: 'Travaux de maconnerie et renovations.',
        },
      ],
    },
    {
      slug: 'zineb-bennis',
      email: 'pro.zineb@test.com',
      phone: '+212600000110',
      firstName: 'Zineb',
      lastName: 'Bennis',
      profession: 'Climatisation',
      cityId: 'tetouan',
      isVerifiedPro: true,
      isPremium: false,
      averageRating: 4.5,
      totalReviews: 68,
      services: [
        {
          id: 'svc-clim-tetouan-zineb',
          categoryId: 'climatisation',
          cityId: 'tetouan',
          pricingType: 'FIXED',
          basePrice: 320,
          minPrice: 280,
          maxPrice: 820,
          description: 'Installation et entretien climatisation.',
        },
      ],
    },
    {
      slug: 'laila-ouhadi',
      email: 'pro.laila@test.com',
      phone: '+212600000111',
      firstName: 'Laila',
      lastName: 'Ouhadi',
      profession: 'Nettoyage',
      cityId: 'essaouira',
      isVerifiedPro: false,
      isPremium: false,
      averageRating: 4.0,
      totalReviews: 25,
      services: [
        {
          id: 'svc-nettoyage-essaouira-laila',
          categoryId: 'nettoyage',
          cityId: 'essaouira',
          pricingType: 'FIXED',
          basePrice: 260,
          minPrice: 220,
          maxPrice: 600,
          description: 'Nettoyage villas et locaux',
        },
        {
          id: 'svc-menage-essaouira-laila',
          categoryId: 'menage',
          cityId: 'essaouira',
          pricingType: 'FIXED',
          basePrice: 150,
          minPrice: 120,
          maxPrice: 320,
          description: 'Menage regulier',
        },
      ],
    },
    {
      slug: 'amin-belhaj',
      email: 'pro.amin@test.com',
      phone: '+212600000112',
      firstName: 'Amin',
      lastName: 'Belhaj',
      profession: 'Menuisier',
      cityId: 'casablanca',
      isVerifiedPro: true,
      isPremium: true,
      averageRating: 4.6,
      totalReviews: 110,
      services: [
        {
          id: 'svc-menuiserie-casa-amin',
          categoryId: 'menuiserie',
          cityId: 'casablanca',
          pricingType: 'FIXED',
          basePrice: 380,
          minPrice: 320,
          maxPrice: 950,
          description: 'Agencement sur mesure, portes, placards',
        },
        {
          id: 'svc-peinture-casa-amin',
          categoryId: 'peinture',
          cityId: 'casablanca',
          pricingType: 'FIXED',
          basePrice: 220,
          minPrice: 180,
          maxPrice: 520,
          description: 'Peinture et finitions bois',
        },
      ],
    },
    {
      slug: 'karima-essafi',
      email: 'pro.karima@test.com',
      phone: '+212600000113',
      firstName: 'Karima',
      lastName: 'Essafi',
      profession: 'Jardinage',
      cityId: 'rabat',
      isVerifiedPro: false,
      isPremium: false,
      averageRating: 4.1,
      totalReviews: 35,
      services: [
        {
          id: 'svc-jardinage-rabat-karima',
          categoryId: 'jardinage',
          cityId: 'rabat',
          pricingType: 'FIXED',
          basePrice: 210,
          minPrice: 170,
          maxPrice: 520,
          description: 'Entretien jardins, arrosage, taille',
        },
        {
          id: 'svc-menage-rabat-karima',
          categoryId: 'menage',
          cityId: 'rabat',
          pricingType: 'FIXED',
          basePrice: 150,
          minPrice: 120,
          maxPrice: 320,
          description: 'Menage ponctuel',
        },
      ],
    },
  ];

  for (const pro of pros) {
    const user = await prisma.user.upsert({
      where: { email: pro.email },
      update: {
        passwordHash: passwordHash,
        role: 'PRO',
        phone: pro.phone,
        cguAcceptedAt: pro.cguAccepted ? new Date() : null,
        phoneVerifiedAt: pro.phoneVerified ? new Date() : null,
      },
      create: {
        email: pro.email,
        passwordHash: passwordHash,
        role: 'PRO',
        phone: pro.phone,
        isEmailVerified: true,
        cguAcceptedAt: pro.cguAccepted ? new Date() : null,
        phoneVerifiedAt: pro.phoneVerified ? new Date() : null,
        proProfile: {
          create: {
            firstName: pro.firstName,
            lastName: pro.lastName,
            profession: pro.profession,
            bio: pro.bio ?? `${pro.profession} experimenté`,
            cityId: pro.cityId,
            verificationStatus: (pro.verificationStatus as any) ?? (pro.isVerifiedPro ? 'APPROVED' : 'PENDING'),
            isVerifiedPro: pro.isVerifiedPro ?? pro.verificationStatus === 'APPROVED',
            isPremium: pro.isPremium ?? false,
            averageRating: pro.averageRating,
            totalReviews: pro.totalReviews ?? 0,
          },
        },
      },
    });

    const proProfile = await prisma.proProfile.findUnique({
      where: { userId: user.id },
    });

    if (proProfile) {
      await prisma.proProfile.update({
        where: { id: proProfile.id },
        data: {
          firstName: pro.firstName,
          lastName: pro.lastName,
          profession: pro.profession,
          bio: pro.bio ?? `${pro.profession} experimenté`,
          cityId: pro.cityId,
          verificationStatus: (pro.verificationStatus as any) ?? (pro.isVerifiedPro ? 'APPROVED' : 'PENDING'),
          isVerifiedPro: pro.isVerifiedPro ?? pro.verificationStatus === 'APPROVED',
          isPremium: pro.isPremium ?? false,
          averageRating: pro.averageRating,
          totalReviews: pro.totalReviews ?? 0,
        },
      });

      for (const svc of pro.services) {
        const { categoryId, ...svcRest } = svc;
        await prisma.proService.upsert({
          where: { id: svc.id },
          update: {
            ...svcRest,
            pricingType: (svcRest.pricingType as PricingType) ?? PricingType.FIXED,
            basePrice: svcRest.basePrice ?? null,
            serviceCategoryId: categoryId,
            proProfileId: proProfile.id,
            isActive: true,
            updatedAt: new Date(),
          },
          create: {
            ...svcRest,
            pricingType: (svcRest.pricingType as PricingType) ?? PricingType.FIXED,
            basePrice: svcRest.basePrice ?? null,
            serviceCategoryId: categoryId,
            proProfileId: proProfile.id,
            isActive: true,
          },
        });
      }
    }
  }
  console.log(
    `Pros et services crees: ${pros.length} pros, ${pros.reduce((acc, p) => acc + p.services.length, 0)} services`,
  );

  // 4) Client demo
  await prisma.user.upsert({
    where: { email: 'jean.client@test.com' },
    update: {
      passwordHash,
      role: 'CLIENT',
    },
    create: {
      email: 'jean.client@test.com',
      passwordHash,
      role: 'CLIENT',
      phone: '+212600000002',
      isEmailVerified: true,
      clientProfile: {
        create: {
          firstName: 'Jean',
          lastName: 'Dupont',
        },
      },
    },
  });
  console.log('Client seed OK');

  console.log('Seed termine avec succes');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
