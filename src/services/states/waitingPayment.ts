import { ITransactionState } from "./transactionState";
import { prisma } from "../../utils/prisma";

export class WaitingPaymentState implements ITransactionState {
  name = "WaitingPayment";
  async next(txId: string) {
    await prisma.transaction.update({
      where: { id: txId },
      data: { status: "WaitingConfirmation" },
    });
  }
  async expire(txId: string) {
    await prisma.transaction.update({
      where: { id: txId },
      data: { status: "Expired" },
    });
  }
}
