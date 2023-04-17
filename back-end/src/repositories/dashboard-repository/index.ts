import { prisma } from '../../config';
import { Prisma } from '@prisma/client';

async function findUserTicker(userId: number, ticker: string) {
  return prisma.dashboard.findFirst({
    where: {
      userId,
      ticker,
    },
  });
}

async function create(data: Prisma.DashboardUncheckedCreateInput) {
  return prisma.dashboard.create({
    data,
  });
}

async function findAllTickersByUserId(userId: number) {
  return prisma.dashboard.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      ticker: true,
    },
  });
}

async function findTickerByTickerId(id: number) {
  return prisma.dashboard.findFirst({
    where: { id },
  });
}

async function deleteTickerById(id: number) {
  return prisma.dashboard.delete({
    where: { id },
  });
}

const dashboardRepository = {
  findUserTicker,
  create,
  findAllTickersByUserId,
  findTickerByTickerId,
  deleteTickerById,
};

export default dashboardRepository;
