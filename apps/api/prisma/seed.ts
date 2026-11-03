import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed for Beyond Beauty Saloon...');

  // 1. Operating Hours (Tue - Sun 08:30 AM - 09:30 PM, Monday Closed)
  const days = [
    { dayOfWeek: 0, openTime: '08:30', closeTime: '21:30', isClosed: false }, // Sunday
    { dayOfWeek: 1, openTime: '08:30', closeTime: '21:30', isClosed: true },  // Monday - CLOSED
    { dayOfWeek: 2, openTime: '08:30', closeTime: '21:30', isClosed: false }, // Tuesday
    { dayOfWeek: 3, openTime: '08:30', closeTime: '21:30', isClosed: false }, // Wednesday
    { dayOfWeek: 4, openTime: '08:30', closeTime: '21:30', isClosed: false }, // Thursday
    { dayOfWeek: 5, openTime: '08:30', closeTime: '21:30', isClosed: false }, // Friday
    { dayOfWeek: 6, openTime: '08:30', closeTime: '21:30', isClosed: false }, // Saturday
  ];

  for (const day of days) {
    await prisma.businessOperatingHour.upsert({
      where: { dayOfWeek: day.dayOfWeek },
      update: day,
      create: day,
    });
  }
  console.log('✅ Operating hours seeded.');

  // 2. Initial Service Categories
  const categoriesData = [
    { slug: 'hair-styling', name: 'Hair Styling', displayOrder: 1, description: 'Blow-dry, curling, iron styling, and layered haircuts.' },
    { slug: 'hair-care', name: 'Hair Care & Treatments', displayOrder: 2, description: 'Hair coloring, hair spa, deep conditioning, and damage repair.' },
    { slug: 'skin-care', name: 'Skin Care & Facials', displayOrder: 3, description: 'Rejuvenation facials, cleanups, and skin nourishment treatments.' },
    { slug: 'makeup-grooming', name: 'Makeup & Grooming', displayOrder: 4, description: 'Bridal makeup, party makeup, and special occasion beauty styling.' },
    { slug: 'threading', name: 'Threading & Waxing', displayOrder: 5, description: 'Eyebrow shaping, upper lip, and full-face threading.' },
    { slug: 'packages', name: 'Bridal & Special Packages', displayOrder: 6, description: 'Curated beauty and wellness bundles for celebrations.' },
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categoriesData) {
    const record = await prisma.serviceCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoryMap.set(cat.slug, record.id);
  }
  console.log('✅ Service categories seeded.');

  // 3. Initial Services (Clearly labeled prices or "Ask for price")
  const servicesData = [
    {
      categorySlug: 'hair-styling',
      slug: 'classic-blow-dry',
      name: 'Classic Blow-Dry & Styling',
      durationMinutes: 45,
      bufferAfterMinutes: 10,
      pricePaise: 65000, // ₹650.00
      isPriceVariable: false,
      requiresConsultation: false,
      shortDescription: 'Wash, blow-dry, and professional hair finishing for a sleek look.',
      isFeatured: true,
    },
    {
      categorySlug: 'hair-styling',
      slug: 'layered-haircut',
      name: 'Signature Layered Haircut',
      durationMinutes: 60,
      bufferAfterMinutes: 10,
      pricePaise: 80000, // ₹800.00
      isPriceVariable: false,
      requiresConsultation: false,
      shortDescription: 'Precision cut tailored to your face shape, including styling tips.',
      isFeatured: true,
    },
    {
      categorySlug: 'hair-care',
      slug: 'nourishing-hair-spa',
      name: 'Nourishing Hair Spa',
      durationMinutes: 60,
      bufferAfterMinutes: 15,
      pricePaise: 120000, // ₹1,200.00
      isPriceVariable: false,
      requiresConsultation: false,
      shortDescription: 'Deep hydration and scalp massage to restore damaged and dry hair.',
      isFeatured: true,
    },
    {
      categorySlug: 'hair-care',
      slug: 'hair-color-transformation',
      name: 'Hair Color & Highlights Consultation',
      durationMinutes: 90,
      bufferAfterMinutes: 15,
      pricePaise: null, // Ask for price
      isPriceVariable: true,
      requiresConsultation: true,
      shortDescription: 'Custom balayage, global color, or highlights. Exact price quoted upon in-salon assessment.',
      isFeatured: false,
    },
    {
      categorySlug: 'skin-care',
      slug: 'glow-rejuvenation-facial',
      name: 'Radiance Glow Facial',
      durationMinutes: 60,
      bufferAfterMinutes: 15,
      pricePaise: 150000, // ₹1,500.00
      isPriceVariable: false,
      requiresConsultation: false,
      shortDescription: 'Gentle exfoliation, steam, blackhead removal, mask, and face massage.',
      isFeatured: true,
    },
    {
      categorySlug: 'makeup-grooming',
      slug: 'party-glam-makeup',
      name: 'Party Glam Makeup',
      durationMinutes: 75,
      bufferAfterMinutes: 15,
      pricePaise: 250000, // ₹2,500.00
      isPriceVariable: false,
      requiresConsultation: false,
      shortDescription: 'Full-face event makeup including eye glam, lashes, and long-stay foundation.',
      isFeatured: true,
    },
    {
      categorySlug: 'makeup-grooming',
      slug: 'bridal-makeup-package',
      name: 'Complete Bridal Makeup & Draping',
      durationMinutes: 180,
      bufferAfterMinutes: 30,
      pricePaise: null, // Ask for price
      isPriceVariable: true,
      requiresConsultation: true,
      shortDescription: 'Premium bridal consultation, HD makeup, hairstyling, saree/lehenga draping.',
      isFeatured: true,
    },
    {
      categorySlug: 'threading',
      slug: 'eyebrow-upperlip-threading',
      name: 'Eyebrow Shaping & Upper Lip',
      durationMinutes: 20,
      bufferAfterMinutes: 5,
      pricePaise: 12000, // ₹120.00
      isPriceVariable: false,
      requiresConsultation: false,
      shortDescription: 'Precise eyebrow definition and gentle upper lip threading.',
      isFeatured: false,
    },
  ];

  const serviceRecords = [];
  for (const s of servicesData) {
    const categoryId = categoryMap.get(s.categorySlug)!;
    const record = await prisma.service.upsert({
      where: { slug: s.slug },
      update: {
        categoryId,
        name: s.name,
        durationMinutes: s.durationMinutes,
        bufferAfterMinutes: s.bufferAfterMinutes,
        pricePaise: s.pricePaise,
        isPriceVariable: s.isPriceVariable,
        requiresConsultation: s.requiresConsultation,
        shortDescription: s.shortDescription,
        isFeatured: s.isFeatured,
      },
      create: {
        categoryId,
        slug: s.slug,
        name: s.name,
        durationMinutes: s.durationMinutes,
        bufferAfterMinutes: s.bufferAfterMinutes,
        pricePaise: s.pricePaise,
        isPriceVariable: s.isPriceVariable,
        requiresConsultation: s.requiresConsultation,
        shortDescription: s.shortDescription,
        isFeatured: s.isFeatured,
      },
    });
    serviceRecords.push(record);
  }
  console.log(`✅ ${serviceRecords.length} services seeded.`);

  // 4. Seed Users & Profiles (clearly labeled sample credentials for development)
  const passwordHash = await bcrypt.hash('SalonOwnerKey99!', 10);
  const legacyPasswordHash = await bcrypt.hash('AdminPassword123!', 10);
  const staffPasswordHash = await bcrypt.hash('StaffSecret2026!', 10);
  const customerPasswordHash = await bcrypt.hash('Password@123', 10);

  // Admin User (Production & Demo Spec)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@beyondbeauty.in' },
    update: { passwordHash },
    create: {
      email: 'admin@beyondbeauty.in',
      passwordHash,
      role: 'OWNER_ADMIN',
      status: 'ACTIVE',
      firstName: 'Salon',
      lastName: 'Owner',
      phone: '+91 98235 73781',
      emailVerifiedAt: new Date(),
    },
  });

  // Admin User (.local alias)
  await prisma.user.upsert({
    where: { email: 'admin@beyondbeauty.local' },
    update: { passwordHash: legacyPasswordHash },
    create: {
      email: 'admin@beyondbeauty.local',
      passwordHash: legacyPasswordHash,
      role: 'OWNER_ADMIN',
      status: 'ACTIVE',
      firstName: 'Salon',
      lastName: 'Owner',
      phone: '+91 98235 73781',
      emailVerifiedAt: new Date(),
    },
  });

  // Employee 1: Priya (Senior Hair Stylist)
  const employeeUser1 = await prisma.user.upsert({
    where: { email: 'priya.stylist@beyondbeauty.in' },
    update: { passwordHash: staffPasswordHash },
    create: {
      email: 'priya.stylist@beyondbeauty.in',
      passwordHash: staffPasswordHash,
      role: 'EMPLOYEE',
      status: 'ACTIVE',
      firstName: 'Priya',
      lastName: 'Deshmukh',
      phone: '+91 98235 00001',
      emailVerifiedAt: new Date(),
    },
  });

  const empProfile1 = await prisma.employeeProfile.upsert({
    where: { userId: employeeUser1.id },
    update: { staffCode: 'BBS-0001' },
    create: {
      userId: employeeUser1.id,
      staffCode: 'BBS-0001',
      displayName: 'Priya (Senior Stylist)',
      jobTitle: 'Senior Hair Stylist',
      isPublicBookable: true,
      employmentStatus: 'FULL_TIME',
      baseSalaryPaise: 2500000, // ₹25,000 / month
      commissionRateBps: 500, // 5%
      colorTag: '#B78693',
    },
  });

  // Employee 2: Sneha (Skin Specialist & Makeup)
  const employeeUser2 = await prisma.user.upsert({
    where: { email: 'sneha.skin@beyondbeauty.in' },
    update: { passwordHash: staffPasswordHash },
    create: {
      email: 'sneha.skin@beyondbeauty.in',
      passwordHash: staffPasswordHash,
      role: 'EMPLOYEE',
      status: 'ACTIVE',
      firstName: 'Sneha',
      lastName: 'Patil',
      phone: '+91 98235 00002',
      emailVerifiedAt: new Date(),
    },
  });

  const empProfile2 = await prisma.employeeProfile.upsert({
    where: { userId: employeeUser2.id },
    update: { staffCode: 'BBS-0002' },
    create: {
      userId: employeeUser2.id,
      staffCode: 'BBS-0002',
      displayName: 'Sneha (Bridal Artist)',
      jobTitle: 'Skin & Head Bridal Artist',
      isPublicBookable: true,
      employmentStatus: 'FULL_TIME',
      baseSalaryPaise: 2800000,
      commissionRateBps: 600,
      colorTag: '#1C6758',
    },
  });


  // Assign skills to staff
  for (const service of serviceRecords) {
    // Priya does hair and threading
    if (service.slug.includes('hair') || service.slug.includes('threading')) {
      await prisma.employeeServiceSkill.upsert({
        where: {
          employeeId_serviceId: { employeeId: empProfile1.id, serviceId: service.id },
        },
        update: {},
        create: {
          employeeId: empProfile1.id,
          serviceId: service.id,
        },
      });
    }
    // Sneha does skin, makeup, and threading
    if (service.slug.includes('skin') || service.slug.includes('facial') || service.slug.includes('makeup') || service.slug.includes('threading')) {
      await prisma.employeeServiceSkill.upsert({
        where: {
          employeeId_serviceId: { employeeId: empProfile2.id, serviceId: service.id },
        },
        update: {},
        create: {
          employeeId: empProfile2.id,
          serviceId: service.id,
        },
      });
    }
  }

  // Create standard shifts (Tue-Sun 08:30 - 21:30, Monday closed)
  for (let day = 0; day <= 6; day++) {
    if (day === 1) continue; // Monday closed
    await prisma.staffShift.upsert({
      where: {
        employeeId_dayOfWeek: { employeeId: empProfile1.id, dayOfWeek: day },
      },
      update: {
        shiftStart: '08:30',
        shiftEnd: '21:30',
        breakStart: '13:30',
        breakEnd: '14:30',
      },
      create: {
        employeeId: empProfile1.id,
        dayOfWeek: day,
        shiftStart: '08:30',
        shiftEnd: '21:30',
        breakStart: '13:30',
        breakEnd: '14:30',
      },
    });

    await prisma.staffShift.upsert({
      where: {
        employeeId_dayOfWeek: { employeeId: empProfile2.id, dayOfWeek: day },
      },
      update: {
        shiftStart: '08:30',
        shiftEnd: '21:30',
        breakStart: '14:00',
        breakEnd: '15:00',
      },
      create: {
        employeeId: empProfile2.id,
        dayOfWeek: day,
        shiftStart: '08:30',
        shiftEnd: '21:30',
        breakStart: '14:00',
        breakEnd: '15:00',
      },
    });
  }

  // Sample Customer User
  const customerUser = await prisma.user.upsert({
    where: { email: 'customer.demo@beyondbeauty.local' },
    update: {},
    create: {
      email: 'customer.demo@beyondbeauty.local',
      passwordHash: customerPasswordHash,
      role: 'CUSTOMER',
      status: 'ACTIVE',
      firstName: 'Ananya',
      lastName: 'Sharma',
      phone: '+91 97307 00000',
      emailVerifiedAt: new Date(),
    },
  });

  await prisma.customerProfile.upsert({
    where: { userId: customerUser.id },
    update: {},
    create: {
      userId: customerUser.id,
      gender: 'FEMALE',
      preferredStylistNotes: 'Prefers layered styling with Priya',
    },
  });

  // Sample promotional offer
  await prisma.offer.upsert({
    where: { code: 'WELCOME15' },
    update: {},
    create: {
      code: 'WELCOME15',
      title: 'Festival & Welcome Special [SAMPLE]',
      description: 'Enjoy 15% off on your first salon visit or beauty package.',
      discountPercent: 15,
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-12-31'),
      isActive: true,
    },
  });

  console.log('✅ Sample users, staff, shifts, and offers seeded successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
