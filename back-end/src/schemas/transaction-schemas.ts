import { CreateTransactionParams, DeleteTransactionParams } from '../protocols';
import Joi from 'joi';

export const createTransactionSchema = Joi.object<CreateTransactionParams>({
  ticker: Joi.string().required(),
  totalPrice: Joi.number().integer().required(),
  amount: Joi.number().integer().required(),
  date: Joi.string().isoDate().required(),
  status: Joi.string().valid('BUY', 'SELL').required(),
});

export const deleteTransactionSchema = Joi.object<DeleteTransactionParams>({
  id: Joi.number().integer().required(),
});
