import { prisma } from "../utils/prisma";
import { CheckoutPayload, TransactionResponse } from "../interface/transaction";
import { uploadImage } from "../utils/cloudinary";

export async function checkout(
  userId: string,
  payload: CheckoutPayload
): Promise<TransactionResponse> {
  // ambil harga tiket
  const ticket = await prisma.ticketType.findUniqueOrThrow({
    where: { id: payload.ticketTypeId },
  });
  let total = ticket.price * payload.quantity;
  // untuk menghitung voucher dan point jika digunakan
  const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // +2 jam
  const tx = await prisma.transaction.create({
    data: {
      userId,
      eventId: payload.eventId,
      ticketTypeId: payload.ticketTypeId,
      quantity: payload.quantity,
      totalPrice: total,
      status: "WaitingPayment",
      expiresAt,
    },
  });
  return tx as any;
}

export async function uploadProof(
  txId: string,
  fileBuffer: Buffer
): Promise<TransactionResponse> {
  const imageUrl = await uploadImage(fileBuffer, "payment_proofs");
  const updated = await prisma.transaction.update({
    where: { id: txId },
    data: { paymentProofUrl: imageUrl, status: "WaitingConfirmation" },
  });
  return updated as any;
}

export async function getTransaction(
  txId: string
): Promise<TransactionResponse> {
  const tx = await prisma.transaction.findUniqueOrThrow({
    where: { id: txId },
  });
  return tx as any;
}
