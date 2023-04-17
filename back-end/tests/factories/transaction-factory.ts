import { prisma } from '../../src/config';
import { faker } from '@faker-js/faker';

export async function createTransaction(userId: number) {
  return prisma.transaction.create({
    data: {
      userId,
      ticker: faker.name.firstName(),
      totalPrice: faker.datatype.number(),
      amount: faker.datatype.number(),
      date: faker.date.birthdate().toISOString(),
      status: Math.random() < 0.5 ? 'BUY' : 'SELL',
    },
  });
}

export async function createBuyTransaction(userId: number, ticker: string) {
  return prisma.transaction.create({
    data: {
      userId,
      ticker,
      totalPrice: faker.datatype.number(),
      amount: 3,
      date: faker.date.birthdate().toISOString(),
      status: 'BUY',
    },
  });
}

export async function createSellTransaction(userId: number, ticker: string) {
  return prisma.transaction.create({
    data: {
      userId,
      ticker,
      totalPrice: faker.datatype.number(),
      amount: 3,
      date: faker.date.birthdate().toISOString(),
      status: 'SELL',
    },
  });
}

export async function createConflictSellTransaction(userId: number, ticker: string) {
  return prisma.transaction.create({
    data: {
      userId,
      ticker,
      totalPrice: faker.datatype.number(),
      amount: faker.datatype.number({ min: 4, max: 6 }),
      date: faker.date.birthdate().toISOString(),
      status: 'SELL',
    },
  });
}
