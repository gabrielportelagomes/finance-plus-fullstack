import { User } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

import { prisma } from '../src/config';
import { createUser, createSession } from './factories';

export async function cleanDb() {
  await prisma.dashboard.deleteMany({});
  await prisma.transaction.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.user.deleteMany({});
}

export async function generateValidToken(user?: User) {
  const incomingUser = user || (await createUser());
  const token = jwt.sign({ userId: incomingUser.id }, process.env.JWT_SECRET);

  await createSession(token);

  return token;
}
