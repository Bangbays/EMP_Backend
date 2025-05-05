import { ITransactionState } from "./transactionState";

export class DoneState implements ITransactionState {
  name = "Done";
  async next(_txId: string) {
    throw new Error("Transaksi sudah selesai");
  }
  async expire(_txId: string) {
    throw new Error("Tidak bisa expire transaksi sudah selesai");
  }
}
