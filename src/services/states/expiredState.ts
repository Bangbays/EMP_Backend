import { ITransactionState } from "./transactionState";

export class ExpiredState implements ITransactionState {
  name = "Expired";
  async next(_txId: string) {
    throw new Error("Transaksi sudah kadaluwarsa");
  }
  async expire(_txId: string) {
    throw new Error("Transaksi sudah kadaluwarsa");
  }
}
