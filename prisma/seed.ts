import { PrismaClient } from '@prisma/client';
import { services } from '../data/services';
import { customerXxxxCheckout } from '../lib/sequence-diagram';

const prisma = new PrismaClient();

async function main() {
  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {
        name: service.name,
        tagline: service.tagline,
        description: service.description,
        accent: service.accent,
        icon: service.icon,
        isExample: service.isExample,
      },
      create: {
        slug: service.slug,
        name: service.name,
        tagline: service.tagline,
        description: service.description,
        accent: service.accent,
        icon: service.icon,
        isExample: service.isExample,
      },
    });

    for (const [index, step] of service.steps.entries()) {
      await prisma.step.upsert({
        where: { id: step.id },
        update: {
          serviceSlug: service.slug,
          order: index,
          title: step.title,
          explanation: step.explanation,
          status: step.status,
          role: step.role,
        },
        create: {
          id: step.id,
          serviceSlug: service.slug,
          order: index,
          title: step.title,
          explanation: step.explanation,
          status: step.status,
          role: step.role,
        },
      });
    }

    console.log(`Seeded service: ${service.slug} (${service.steps.length} steps)`);
  }

  await prisma.customerFlow.upsert({
    where: { slug: 'checkout-customer-xxxx' },
    update: {
      serviceSlug: 'checkout',
      name: 'Customer XXXX',
      dataJson: JSON.stringify(customerXxxxCheckout),
    },
    create: {
      serviceSlug: 'checkout',
      name: 'Customer XXXX',
      slug: 'checkout-customer-xxxx',
      dataJson: JSON.stringify(customerXxxxCheckout),
    },
  });
  console.log('Seeded customer flow: checkout-customer-xxxx');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
