import { ITransactionState } from "./transactionState";
import { prisma } from "../../utils/prisma";

export class WaitingConfirmationState implements ITransactionState {
  name = "WaitingConfirmation";
  async next(txId: string) {
    await prisma.transaction.update({
      where: { id: txId },
      data: { status: "Done" },
    });
  }
  async expire(txId: string) {
    // konfirmasi tidak datang
    await prisma.transaction.update({
      where: { id: txId },
      data: { status: "Expired" },
    });
  }
}
