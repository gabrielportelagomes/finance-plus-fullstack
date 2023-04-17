import dashboardRepository from '../../repositories/dashboard-repository';
import { conflictError, forbiddenError, notFoundError } from '../../errors';

export async function createFavoriteTicker(userId: number, ticker: string) {
  const tickerExists = await dashboardRepository.findUserTicker(userId, ticker);

  if (tickerExists) {
    throw conflictError('The selected ticker is already registered!');
  }

  const newTicker = await dashboardRepository.create({ userId, ticker });

  return newTicker;
}

export async function findFavoriteTickers(userId: number) {
  const tickers = await dashboardRepository.findAllTickersByUserId(userId);

  if (tickers.length === 0) {
    throw notFoundError();
  }

  return tickers;
}

export async function deleteFavoriteTicker(userId: number, tickerId: number) {
  const favoriteTicker = await dashboardRepository.findTickerByTickerId(tickerId);

  if (!favoriteTicker) {
    throw notFoundError();
  }

  if (favoriteTicker.userId !== userId) {
    throw forbiddenError();
  }

  await dashboardRepository.deleteTickerById(favoriteTicker.id);
}

const dashboardService = {
  createFavoriteTicker,
  findFavoriteTickers,
  deleteFavoriteTicker,
};

export default dashboardService;
