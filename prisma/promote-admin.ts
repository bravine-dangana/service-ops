import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email) {
    console.error('Usage: npx tsx prisma/promote-admin.ts <email>');
    process.exit(1);
  }

  const user = await prisma.user.update({
    where: { email },
    data: { role: 'admin' },
  });

  console.log(`Promoted ${user.email} to admin.`);
}

main()
  .catch((error) => {
    console.error(error.code === 'P2025' ? 'No user found with that email — sign up first.' : error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
