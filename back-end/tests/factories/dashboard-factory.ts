import { prisma } from '../../src/config';
import { faker } from '@faker-js/faker';

export async function createFavoriteTicker(userId: number) {
  return prisma.dashboard.create({
    data: {
      userId,
      ticker: faker.name.firstName(),
    },
  });
}
