import { AuthenticatedRequest } from '../middlewares';
import { CreateFavoriteStockParams, DeleteFavoriteStockParams } from '../protocols';
import dashboardService from '../services/dashboard-service';
import { Response } from 'express';
import httpStatus from 'http-status';

export async function postFavoriteStock(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { ticker } = req.body as CreateFavoriteStockParams;

  try {
    const result = await dashboardService.createFavoriteTicker(userId, ticker);

    return res.status(httpStatus.CREATED).send(result);
  } catch (error) {
    return res.status(httpStatus.CONFLICT).send(error);
  }
}

export async function getFavoriteTickers(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const result = await dashboardService.findFavoriteTickers(userId);

    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function deleteFavoriteStock(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { id } = req.params;
  const tickerId = Number(id);

  try {
    await dashboardService.deleteFavoriteTicker(userId, tickerId);

    return res.sendStatus(httpStatus.NO_CONTENT);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    return res.sendStatus(httpStatus.FORBIDDEN);
  }
}
