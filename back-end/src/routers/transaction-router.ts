import { deleteTransaction, getAllUserTransactions, getUserPortifolio, postTransaction } from '../controllers';
import { authenticateToken, validateBody, validateParams } from '../middlewares';
import { createTransactionSchema, deleteTransactionSchema } from '../schemas/transaction-schemas';
import { Router } from 'express';

const transactionRouter = Router();

transactionRouter.all('/*', authenticateToken);
transactionRouter.post('/', validateBody(createTransactionSchema), postTransaction);
transactionRouter.get('/all', getAllUserTransactions);
transactionRouter.get('/portfolio', getUserPortifolio);
transactionRouter.delete('/:id', validateParams(deleteTransactionSchema), deleteTransaction);

export { transactionRouter };
