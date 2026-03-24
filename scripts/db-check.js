const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

async function main() {
  console.log('Checking database connection...');

  try {
    await prisma.$queryRawUnsafe('SELECT 1');

    const [moderators, contents, platforms, alerts] = await Promise.all([
      prisma.moderator.count(),
      prisma.contentItem.count(),
      prisma.platform.count(),
      prisma.alert.count(),
    ]);

    console.log('Database connection OK');
    console.log(
      JSON.stringify(
        { moderators, contents, platforms, alerts },
        null,
        2
      )
    );
  } catch (error) {
    console.error('Database check failed');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
