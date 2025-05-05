import { ITransactionState } from "./transactionState";

export class RejectedState implements ITransactionState {
  name = "Rejected";
  async next(_txId: string) {
    throw new Error("Transaksi sudah ditolak");
  }
  async expire(_txId: string) {
    throw new Error("Tidak bisa expire ditolak");
  }
}
