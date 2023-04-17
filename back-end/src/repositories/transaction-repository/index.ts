import { prisma } from '../../config';
import { Prisma } from '@prisma/client';

async function createTransaction(data: Prisma.TransactionUncheckedCreateInput) {
  return prisma.transaction.create({
    data,
  });
}

async function findTransactionSummary(userId: number, ticker: string) {
  return prisma.transaction.groupBy({
    where: {
      userId,
      ticker,
    },
    by: ['status'],
    _sum: {
      amount: true,
    },
    orderBy: { status: 'asc' },
  });
}

async function findAllTransactionsByUserId(userId: number) {
  return prisma.transaction.findMany({
    where: { userId },
    orderBy: [{ date: 'asc' }, { createdAt: 'asc' }],
  });
}

async function findSummaryOfTransactionsByUserId(userId: number) {
  return prisma.transaction.groupBy({
    by: ['ticker', 'status'],
    _sum: {
      amount: true,
      totalPrice: true,
    },
    where: {
      userId,
    },
  });
}

async function findTransactionById(id: number) {
  return prisma.transaction.findUnique({
    where: {
      id,
    },
  });
}

async function deleteTransactionById(id: number) {
  return prisma.transaction.delete({
    where: {
      id,
    },
  });
}

const transactionRepository = {
  createTransaction,
  findTransactionSummary,
  findAllTransactionsByUserId,
  findSummaryOfTransactionsByUserId,
  findTransactionById,
  deleteTransactionById,
};

export default transactionRepository;
