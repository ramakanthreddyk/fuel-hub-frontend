import bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import prisma from '../utils/prisma';
import { UserRole } from '../constants/auth';
import { beforeCreateUser } from '../middlewares/planEnforcement';

export async function createUser(
  tenantId: string,
  email: string,
  password: string,
  name: string,
  role: UserRole
): Promise<string> {
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await beforeCreateUser(tx, tenantId);
    const hash = await bcrypt.hash(password, 10);
    const user = await tx.user.create({
      data: {
        tenant_id: tenantId,
        email,
        password_hash: hash,
        name,
        role,
      },
      select: { id: true },
    });
    return user.id;
  });
}

export async function listUsers(tenantId: string) {
  return prisma.user.findMany({
    where: { tenant_id: tenantId },
    orderBy: { email: 'asc' },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      created_at: true,
    },
  });
}
