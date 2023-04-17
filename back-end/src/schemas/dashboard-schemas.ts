import { CreateFavoriteStockParams, DeleteFavoriteStockParams } from '../protocols';
import Joi from 'joi';

export const createFavoriteStockSchema = Joi.object<CreateFavoriteStockParams>({
  ticker: Joi.string().required(),
});

export const deleteFavoriteStockSchema = Joi.object<DeleteFavoriteStockParams>({
  id: Joi.number().integer().required(),
});
