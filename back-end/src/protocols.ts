export type ApplicationError = {
  name: string;
  message: string;
};

export type CreateUserParams = {
  name: string;
  email: string;
  password: string;
};

export type UpdateUserParams = {
  name: string;
  email: string;
  pictureUrl?: string;
};

export type SignInParams = {
  email: string;
  password: string;
};

export type CreateFavoriteStockParams = {
  ticker: string;
};

export type DeleteFavoriteStockParams = {
  id: number;
};

export type CreateTransactionParams = {
  ticker: string;
  totalPrice: number;
  amount: number;
  date: Date;
  status: 'BUY' | 'SELL';
};

export type DeleteTransactionParams = {
  id: number;
};

export type RequestError = {
  status: number;
  data: object | null;
  statusText: string;
  name: string;
  message: string;
};

export type BrapiAvaiable = {
  stocks: string[];
};
