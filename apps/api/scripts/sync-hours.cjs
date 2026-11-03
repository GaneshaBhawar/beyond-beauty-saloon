const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  // 1. Update operating hours
  const hours = [
    { dayOfWeek: 0, openTime: '08:30', closeTime: '21:30', isClosed: false }, // Sunday
    { dayOfWeek: 1, openTime: '08:30', closeTime: '21:30', isClosed: true },  // Monday - CLOSED
    { dayOfWeek: 2, openTime: '08:30', closeTime: '21:30', isClosed: false }, // Tuesday
    { dayOfWeek: 3, openTime: '08:30', closeTime: '21:30', isClosed: false }, // Wednesday
    { dayOfWeek: 4, openTime: '08:30', closeTime: '21:30', isClosed: false }, // Thursday
    { dayOfWeek: 5, openTime: '08:30', closeTime: '21:30', isClosed: false }, // Friday
    { dayOfWeek: 6, openTime: '08:30', closeTime: '21:30', isClosed: false }, // Saturday
  ];
  for (const h of hours) {
    await prisma.businessOperatingHour.upsert({
      where: { dayOfWeek: h.dayOfWeek },
      update: h,
      create: h,
    });
  }
  console.log('Operating hours updated.');

  // 2. Remove [SAMPLE] from service names and populate preparationNotes / fullDescription
  const services = await prisma.service.findMany();
  for (const s of services) {
    const cleanName = s.name.replace(/\s*\[SAMPLE\]/g, '').trim();
    const updateData = { name: cleanName };
    if (!s.fullDescription) {
      updateData.fullDescription = s.shortDescription || 'Experience premium salon care tailored to your unique beauty and style preferences.';
    }
    if (!s.preparationNotes) {
      updateData.preparationNotes = 'Please arrive 5 to 10 minutes prior to your scheduled time. Wear comfortable clothing.';
    }
    await prisma.service.update({
      where: { id: s.id },
      data: updateData,
    });
    console.log('Updated service:', cleanName);
  }

  // 3. Ensure staff shifts match operating hours (08:30 - 21:30)
  const staff = await prisma.employeeProfile.findMany();
  for (const emp of staff) {
    for (let day = 0; day <= 6; day++) {
      if (day === 1) {
        // Monday closed
        continue;
      }
      await prisma.staffShift.upsert({
        where: {
          employeeId_dayOfWeek: { employeeId: emp.id, dayOfWeek: day },
        },
        update: {
          shiftStart: '08:30',
          shiftEnd: '21:30',
          breakStart: '13:30',
          breakEnd: '14:30',
        },
        create: {
          employeeId: emp.id,
          dayOfWeek: day,
          shiftStart: '08:30',
          shiftEnd: '21:30',
          breakStart: '13:30',
          breakEnd: '14:30',
        },
      });
    }
  }
  console.log('Staff shifts updated.');
}

run()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

