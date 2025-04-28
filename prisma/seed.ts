// seed.ts
import { PrismaClient, UserRole, AdminRole } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

const programs = [
  {
    title: "Mentorship for Singles",
    price: 78,
    features: [
      "Prepare you for relationship and marriage",
      "Close community",
      "Coaching calls with PM",
      "Accountability structure",
    ],
    duration: "Annual Investment Fee",
  },
  {
    title: "Premium Mentorship Program",
    price: 161.20,
    features: [
      "Monthly group coaching session",
      "Accountability structure",
      "Access to weekly inspiring email",
      "Access to special resources and material",
    ],
    duration: "One Time Annual Investment Fee",
  },
];

async function seedUsers() {
  // Create a regular user
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {
      email: 'user@example.com',
      first_name: 'John',
      last_name: 'Doe',
      password: await hash('password123', 10),
      is_email_verified: true,
      is_active: true,
      role: UserRole.USER,
    },
    create: {
      email: 'user@example.com',
      first_name: 'John',
      last_name: 'Doe',
      password: await hash('password123', 10),
      is_email_verified: true,
      is_active: true,
      role: UserRole.USER,
    },
  });
  console.log(`User created: ${user.email}`);

  // Create a premium user
  const premiumUser = await prisma.user.upsert({
    where: { email: 'premium@example.com' },
    update: {
      email: 'premium@example.com',
      first_name: 'Jane',
      last_name: 'Smith',
      password: await hash('password123', 10),
      is_email_verified: true,
      is_active: true,
      role: UserRole.PREMIUM,
    },
    create: {
      email: 'premium@example.com',
      first_name: 'Jane',
      last_name: 'Smith',
      password: await hash('password123', 10),
      is_email_verified: true,
      is_active: true,
      role: UserRole.PREMIUM,
    },
  });
  console.log(`Premium user created: ${premiumUser.email}`);

}

async function seedAdmins() {
  // Create basic admin
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@example.com' },
    update: {
      email: 'admin@example.com',
      password: await hash('admin123', 10),
      name: 'Admin User',
      role: AdminRole.ADMIN,
      is_active: true,
    },
    create: {
      email: 'admin@example.com',
      password: await hash('admin123', 10),
      name: 'Admin User',
      role: AdminRole.ADMIN,
      is_active: true,
    },
  });
  console.log(`Admin created: ${admin.email}`);

  // Create super admin
  const superAdmin = await prisma.admin.upsert({
    where: { email: 'superadmin@example.com' },
    update: {
      email: 'superadmin@example.com',
      password: await hash('superadmin123', 10),
      name: 'Super Admin User',
      role: AdminRole.SUPER_ADMIN,
      is_active: true,
    },
    create: {
      email: 'superadmin@example.com',
      password: await hash('superadmin123', 10),
      name: 'Super Admin User',
      role: AdminRole.SUPER_ADMIN,
      is_active: true,
    },
  });
  console.log(`Super Admin created: ${superAdmin.email}`);
}

async function seedPrograms() {

  for (const program of programs) {
    // const localPrice = convertPriceToLocal(program.price);
    const createdProgram = await prisma.program.upsert({
      where: { name: program.title },
      update: {
        name: program.title,
        features: program.features.join(", "), // Join features as a comma-separated string
        price: program.price,
        duration: program.duration,
      },
      create: {
        name: program.title,
        features: program.features.join(", "), // Join features as a comma-separated string
        price: program.price,
        duration: program.duration,
      },
    });
    console.log(`Program created: ${createdProgram.name}`);
  }

}


async function main() {
  try {
    await seedUsers();
    await seedAdmins();
    await seedPrograms();

    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


  