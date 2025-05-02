// data checkout
export interface CheckoutPayload {
  eventId: string;
  ticketTypeId: string;
  quantity: number;
  voucherCode?: string;
  usePoints?: boolean;
}

// respon transaksi
export interface TransactionResponse {
  id: string;
  status:
    | "WaitingPayment"
    | "WaitingConfirmation"
    | "Done"
    | "Expired"
    | "Canceled";
  totalPrice: number;
  expiresAt: string;
  paymentProofUrl?: string;
}
