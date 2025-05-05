import { ITransactionState } from "./transactionState";

export class CanceledState implements ITransactionState {
  name = "Canceled";
  async next(_txId: string) {
    throw new Error("Transaksi telah dibatalkan");
  }
  async expire(_txId: string) {
    throw new Error("Transaksi telah dibatalkan");
  }
}
