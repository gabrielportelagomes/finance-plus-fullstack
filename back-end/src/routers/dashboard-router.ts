import { deleteFavoriteStock, getFavoriteTickers, postFavoriteStock } from '../controllers/dashboard-controller';
import { authenticateToken, validateBody, validateParams } from '../middlewares';
import { createFavoriteStockSchema, deleteFavoriteStockSchema } from '../schemas';
import { Router } from 'express';

const dashboardRouter = Router();

dashboardRouter.all('/*', authenticateToken);
dashboardRouter.post('/favorites', validateBody(createFavoriteStockSchema), postFavoriteStock);
dashboardRouter.get('/favorites', getFavoriteTickers);
dashboardRouter.delete('/favorites/:id', validateParams(deleteFavoriteStockSchema), deleteFavoriteStock);

export { dashboardRouter };
