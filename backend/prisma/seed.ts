import process from 'node:process';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CATALOGUE_DATA = [
  {
    slug: 'cat-errands',
    name: 'Errands & Daily Tasks',
    icon: 'shopping-bag',
    description: 'Bills, banks, deliveries, courier, and daily household errands',
    tasks: [
      {
        name: 'Courier pickup & drop',
        description: 'Same-day parcel pickup and drop across town with real-time receipt sharing',
      },
      {
        name: 'Grocery pickup & restocking',
        description: 'Fresh groceries and essentials from your preferred neighborhood markets',
      },
      {
        name: 'Medicine pickup & refills',
        description: 'Prescription pickup from local pharmacy and timely monthly refills',
      },
      {
        name: 'Pet food & supplies pickup',
        description: 'Specialty pet food, grooming supplies, and toys delivered to your door',
      },
      {
        name: 'Bill payments & banking errand',
        description: 'Utility bills, physical paperwork drop, and cheque clearance assistance',
      },
      {
        name: 'Document attestation & notary',
        description: 'Legal document stamping, notary signatures, and government paperwork',
      },
    ],
  },
  {
    slug: 'cat-home',
    name: 'Home Maintenance & Repairs',
    icon: 'tool',
    description: 'AC repairs, electrical, plumbing, deep cleaning, and appliance servicing',
    tasks: [
      {
        name: 'AC service & gas recharge',
        description: 'Deep filter cleaning, outdoor unit dusting, and refrigerant gas inspection',
      },
      {
        name: 'Electrical repairs & wiring',
        description: 'Switchboard repairs, chandelier installation, and circuit breaker inspection',
      },
      {
        name: 'Plumbing & leakage fix',
        description: 'Tap leakage repair, pipe unclogging, and bathroom water pressure optimization',
      },
      {
        name: 'Deep home cleaning',
        description: 'Thorough dusting, kitchen grease removal, and sofa/mattress sanitization',
      },
      {
        name: 'Carpentry & furniture assembly',
        description: 'Flat-pack furniture assembly, door hinge repair, and lock replacement',
      },
      {
        name: 'Appliance diagnostics',
        description: 'Washing machine, microwave, and refrigerator inspection by verified technicians',
      },
    ],
  },
  {
    slug: 'cat-health',
    name: 'Health & Medical Care',
    icon: 'heart',
    description: 'Doctor escorts, home lab tests, medicine management, and therapy visits',
    tasks: [
      {
        name: 'Doctor appointment escort',
        description: 'Accompanied transit to hospital clinics with waiting assistance and note taking',
      },
      {
        name: 'Home lab sample collection',
        description: 'Coordinated certified lab technician visits for routine blood & urine tests',
      },
      {
        name: 'Elderly medicine organization',
        description: 'Weekly pill dispenser organization and prescription dosage tracking',
      },
      {
        name: 'Physiotherapy session booking',
        description: 'Verified licensed physical therapist visits in home comfort',
      },
      {
        name: 'Medical equipment rental',
        description: 'Oxygen concentrators, hospital beds, and wheelchair delivery coordination',
      },
    ],
  },
  {
    slug: 'cat-senior',
    name: 'Senior & Family Care',
    icon: 'users',
    description: 'Elderly companionship, tech guidance, assisted walks, and wellness check-ins',
    tasks: [
      {
        name: 'Daily companion visit',
        description: 'Friendly conversation, newspaper reading, and indoor walking support',
      },
      {
        name: 'Tech assistance for seniors',
        description: 'Smartphone setup, WhatsApp calling lessons, and online banking guidance',
      },
      {
        name: 'Assisted park walk escort',
        description: 'Safe assisted morning or evening stroll in neighborhood parks',
      },
      {
        name: 'Safety & wellness check-in',
        description: 'Scheduled safety check-ins and emergency SOS response coordination',
      },
      {
        name: 'Grocery & pantry organizing',
        description: 'Low-shelf pantry organization and expiration date auditing for seniors',
      },
      {
        name: 'Specialist appointment navigation',
        description: 'Second opinion coordination, paperwork sorting, and clinic queue management',
      },
    ],
  },
  {
    slug: 'cat-travel',
    name: 'Travel & Tourism',
    icon: 'map-pin',
    description: 'Flights, hotels, visas, transfers, and custom vacation itineraries',
    tasks: [
      {
        name: 'Flight & train ticket booking',
        description: 'Best routes, seat selection, and meal preferences',
      },
      {
        name: 'Hotel, resort & private villa booking',
        description: 'Curated luxury stays with negotiated member perks',
      },
      {
        name: 'Tourist visa application & embassy paperwork',
        description: 'VFS appointments, document verification, and cover letters',
      },
      {
        name: 'Travel insurance & forex card arrangement',
        description: 'Medical coverage policies and multi-currency debit cards',
      },
      {
        name: 'Airport pickup & chauffeur coordination',
        description: 'Punctual airport transfers with meet-and-greet',
      },
      {
        name: 'Intercity cab booking & local sightseeing',
        description: 'Well-maintained vehicles with verified drivers',
      },
    ],
  },
];

async function main() {
  console.log('🌱 Seeding Task Catalogue...');

  for (const catData of CATALOGUE_DATA) {
    const category = await prisma.category.upsert({
      where: { slug: catData.slug },
      update: {
        name: catData.name,
        icon: catData.icon,
        description: catData.description,
      },
      create: {
        slug: catData.slug,
        name: catData.name,
        icon: catData.icon,
        description: catData.description,
      },
    });

    for (const taskData of catData.tasks) {
      const existingTask = await prisma.task.findFirst({
        where: {
          categoryId: category.id,
          name: taskData.name,
        },
      });

      if (!existingTask) {
        await prisma.task.create({
          data: {
            categoryId: category.id,
            name: taskData.name,
            description: taskData.description,
          },
        });
      } else {
        await prisma.task.update({
          where: { id: existingTask.id },
          data: {
            description: taskData.description,
          },
        });
      }
    }
  }

  const categoryCount = await prisma.category.count();
  const taskCount = await prisma.task.count();

  console.log(`✅ Seeded ${categoryCount} categories and ${taskCount} tasks successfully!`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
