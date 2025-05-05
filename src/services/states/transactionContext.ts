import { ITransactionState } from "./transactionState";
import { WaitingPaymentState } from "./waitingPayment";
import { WaitingConfirmationState } from "./waitingConfirmation";
import { DoneState } from "./doneState";
import { RejectedState } from "./rejectedState";
import { ExpiredState } from "./expiredState";
import { CanceledState } from "./canceledState";

export class TransactionContext {
  private state: ITransactionState;

  constructor(status: string) {
    switch (status) {
      case "WaitingPayment":
        this.state = new WaitingPaymentState();
        break;
      case "WaitingConfirmation":
        this.state = new WaitingConfirmationState();
        break;
      case "Done":
        this.state = new DoneState();
        break;
      case "Rejected":
        this.state = new RejectedState();
        break;
      case "Expired":
        this.state = new ExpiredState();
        break;
      case "Canceled":
        this.state = new CanceledState();
        break;
      default:
        throw new Error(`Unknown state: ${status}`);
    }
  }

  async next(txId: string) {
    await this.state.next(txId);
  }

  async expire(txId: string) {
    await this.state.expire(txId);
  }
}
