import prisma from '../src/libs/prisma.js';

async function main() {
  await prisma.watering_config.upsert({
    where: { id: 1 },
    update: {
      min_soil_moisture_percent: 20,
      duration_ms: 2000,
      automated: true,
    },
    create: {
      min_soil_moisture_percent: 20,
      duration_ms: 2000,
      automated: true,
    },
  });

  await prisma.water_capacity_config.upsert({
    where: { id: 1 },
    update: {
      min_water_capacity_percent: 20,
    },
    create: {
      min_water_capacity_percent: 20,
    },
  });
}

main()
  .then(async () => {
    console.log('Seeding completed');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
