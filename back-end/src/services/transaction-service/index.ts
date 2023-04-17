import { notFoundError, conflictError, forbiddenError } from '../../errors';
import { CreateTransactionParams } from '../../protocols';
import transactionRepository from '../../repositories/transaction-repository';
import { getTickers } from '../../utils/brapi-service';

async function checkAvailability(userId: number, ticker: string, amount: number) {
  const tickerData = await transactionRepository.findTransactionSummary(userId, ticker);

  let balance = 0;

  tickerData.forEach((element) => {
    if (element.status === 'BUY') {
      balance += element._sum.amount;
    } else if (element.status === 'SELL') {
      balance -= element._sum.amount;
    }
  });

  if (balance < amount) {
    throw conflictError('Insufficient stock balance!');
  }

  return tickerData;
}

export async function createTransaction(userId: number, data: CreateTransactionParams) {
  const tickers = await getTickers(data.ticker);

  if (!tickers.stocks.includes(data.ticker)) {
    throw notFoundError();
  }

  if (data.status === 'SELL') {
    await checkAvailability(userId, data.ticker, data.amount);
  }

  const transactionData = {
    userId,
    ...data,
  };

  const transaction = await transactionRepository.createTransaction(transactionData);

  return transaction;
}

async function findAllUserTransactions(userId: number) {
  const transactions = await transactionRepository.findAllTransactionsByUserId(userId);

  if (transactions.length === 0) {
    throw notFoundError();
  }

  return transactions;
}

async function findUserPortifolio(userId: number) {
  const transactions = await transactionRepository.findSummaryOfTransactionsByUserId(userId);

  if (transactions.length === 0) {
    throw notFoundError();
  }

  const portfolio: { ticker: string; amount: number; averagePrice: number }[] = [];

  const tickerBalances: { [ticker: string]: number } = {};
  const tickerBuys: { [ticker: string]: { totalPrice: number; amount: number } } = {};

  transactions.forEach((transaction) => {
    if (transaction.status === 'BUY') {
      if (!tickerBalances[transaction.ticker]) {
        tickerBalances[transaction.ticker] = 0;
      }
      tickerBalances[transaction.ticker] += transaction._sum.amount;

      if (!tickerBuys[transaction.ticker]) {
        tickerBuys[transaction.ticker] = { totalPrice: 0, amount: 0 };
      }
      tickerBuys[transaction.ticker].totalPrice += transaction._sum.totalPrice;
      tickerBuys[transaction.ticker].amount += transaction._sum.amount;
    } else if (transaction.status === 'SELL') {
      if (!tickerBalances[transaction.ticker]) {
        tickerBalances[transaction.ticker] = 0;
      }
      tickerBalances[transaction.ticker] -= transaction._sum.amount;
    }
  });

  for (const ticker in tickerBalances) {
    if (tickerBalances.hasOwnProperty(ticker)) {
      const balance = tickerBalances[ticker];
      if (balance !== 0) {
        const averagePrice = tickerBuys[ticker] ? tickerBuys[ticker].totalPrice / tickerBuys[ticker].amount : 0;
        portfolio.push({ ticker, amount: balance, averagePrice });
      }
    }
  }

  return portfolio;
}

async function deleTransaction(userId: number, transactionId: number) {
  const transaction = await transactionRepository.findTransactionById(transactionId);

  if (!transaction) {
    throw notFoundError();
  }

  if (transaction.userId !== userId) {
    throw forbiddenError();
  }

  if (transaction.status === 'BUY') {
    await checkAvailability(userId, transaction.ticker, transaction.amount);
  }

  await transactionRepository.deleteTransactionById(transaction.id);
}

const transactionService = {
  createTransaction,
  checkAvailability,
  findAllUserTransactions,
  findUserPortifolio,
  deleTransaction,
};

export default transactionService;
