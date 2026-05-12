

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@yourdomain.com";
  const password = process.env.ADMIN_PASSWORD || "Admin@123456";
  const name = process.env.ADMIN_NAME || "Admin";

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin already exists: ${email}`);
    return;
  }

  const hashed = await bcrypt.hash(password, 12);
  const admin = await prisma.adminUser.create({
    data: { email, password: hashed, name },
  });

  console.log(`✅ Admin created: ${admin.email}`);
  console.log(`   Password: ${password}`);
  console.log(`\n⚠️  Change your password after first login!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());