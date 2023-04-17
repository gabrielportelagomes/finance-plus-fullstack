import { AuthenticatedRequest } from '../middlewares';
import { CreateTransactionParams } from '../protocols';
import transactionService from '../services/transaction-service';
import { Response } from 'express';
import httpStatus from 'http-status';

export async function postTransaction(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const data = req.body as CreateTransactionParams;

  try {
    const transaction = await transactionService.createTransaction(userId, data);

    return res.status(httpStatus.CREATED).send(transaction);
  } catch (error) {
    if (error.name === 'ConflictError') {
      return res.status(httpStatus.CONFLICT).send(error);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function getAllUserTransactions(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const transaction = await transactionService.findAllUserTransactions(userId);

    return res.status(httpStatus.OK).send(transaction);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function getUserPortifolio(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const portifolio = await transactionService.findUserPortifolio(userId);

    return res.status(httpStatus.OK).send(portifolio);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function deleteTransaction(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { id } = req.params;
  const transactionId = Number(id);

  try {
    await transactionService.deleTransaction(userId, transactionId);

    return res.sendStatus(httpStatus.NO_CONTENT);
  } catch (error) {
    if (error.name === 'ForbiddenError') {
      return res.status(httpStatus.FORBIDDEN).send(error);
    }
    if (error.name === 'ConflictError') {
      return res.status(httpStatus.CONFLICT).send(error);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
