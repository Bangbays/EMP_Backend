import { prisma } from "../../utils/prisma";
import { CheckoutPayload } from "../../interface/transaction";

export abstract class TransactionCreator {
  abstract calculateTotal(
    userId: string,
    payload: CheckoutPayload
  ): Promise<{ total: number; pointUsed: number }>;
  abstract expiresAt(): Date;

  async create(userId: string, payload: CheckoutPayload) {
    // hitung total & point
    const { total, pointUsed } = await this.calculateTotal(userId, payload);

    // update sisa point user
    if (pointUsed > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: { points: { decrement: pointUsed } },
      });
    }

    // buat transaksi
    const tx = await prisma.transaction.create({
      data: {
        userId,
        eventId: payload.eventId,
        ticketTypeId: payload.ticketTypeId,
        quantity: payload.quantity,
        totalPrice: total,
        status: "WaitingPayment",
        expiresAt: this.expiresAt(),
      },
    });
    return tx;
  }
}

export class StandardTransactionCreator extends TransactionCreator {
  // rasio konversi: 1 point = Rp1
  private POINT_VALUE = 1;

  async calculateTotal(userId: string, payload: CheckoutPayload) {
    // harga dasar
    const ticket = await prisma.ticketType.findUniqueOrThrow({
      where: { id: payload.ticketTypeId },
    });
    let total = ticket.price * payload.quantity;

    let pointUsed = 0;

    // diskon voucher
    if (payload.voucherCode) {
      const voucher = await prisma.voucher.findFirst({
        where: {
          code: payload.voucherCode,
          eventId: payload.eventId,
          startDate: { lte: new Date() },
          endDate: { gte: new Date() },
        },
      });
      if (!voucher)
        throw Object.assign(new Error("Voucher tidak valid"), {
          statusCode: 400,
        });
      total = Math.max(0, total - voucher.discount);

      // tandai voucher terpakai
      await prisma.voucher.update({
        where: { code: payload.voucherCode },
        data: {},
      });
    }

    // penggunaan point
    if (payload.usePoints) {
      const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
      });
      // maksimal poin yang bisa dipakai
      const maxRedeemable = Math.min(
        user.points,
        Math.floor(total / this.POINT_VALUE)
      );
      pointUsed = maxRedeemable;
      total = total - pointUsed * this.POINT_VALUE;
    }

    return { total, pointUsed };
  }

  expiresAt() {
    return new Date(Date.now() + 2 * 60 * 60 * 1000);
  }
}
