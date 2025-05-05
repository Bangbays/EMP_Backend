export interface ITransactionState {
  name: string;
  next(txId: string): Promise<void>;
  expire(txId: string): Promise<void>;
}
