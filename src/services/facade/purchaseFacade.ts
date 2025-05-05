import { prisma } from "../../utils/prisma";
import { sendMmail } from "../../utils/nodemailer";
import { StandardTransactionCreator } from "../factories/Transaction.Factory";
import { TransactionContext } from "../states/transactionContext";
import { CheckoutPayload } from "../../interface/transaction";
import * as authService from "../authService";

export class PurchaseFacade {
  private creator = new StandardTransactionCreator();

  // inisialisasi checkout:
  // 1. buat transaksi via factory method
  // 2. kirim email tagihan ke user
  async initiate(userId: string, payload: CheckoutPayload) {
    // 1. transaksi penghitungan voucher & poin
    const tx = await this.creator.create(userId, payload);

    // 2. Ambil profil user untuk pengiriman email
    const user = await authService.getProfile(userId);

    // 3. kirim notifikasi email tagihan
    await sendMmail({
      to: user.email,
      subject: "Transaksi sudah dibuat",
      html: `
            <p>Halo ${user.name},</p>
            <p>Transaksi <strong>${tx.id}</strong> berhasil dibuat.</p>
            <p>Total pembayaran: <strong>Rp${tx.totalPrice}</strong></p>
            <p>Batas pembayaran hingga: <strong>${tx.expiredAt.toISOString()}</strong></p>
            `,
    });

    return tx;
  }

  // upload bukti pembayaran:
  // 1. Update Transaction status via Factory-overlay Service
  // 2. Kirim email konfirmasi penerimaan bukti
  async submitProof(userId: string, txId: string, fileBuffer: Buffer) {
    // 1. Upload gambar & ubah status ke WaitingConfirmation
    const imageUrl = await this.creator.uploadProof(txId, fileBuffer);
    // (Note: implement uploadProof di TransactionFactory atau transactionService)

    // 2. Ambil kembali transaksi & user profile
    const tx = await prisma.transaction.findUniqueOrThrow({
      where: { id: txId },
    });
    const user = await authService.getProfile(userId);

    // 3. Kirim email notifikasi penerimaan bukti
    await sendMmail({
      to: user.email,
      subject: "Bukti Pembayaran Online",
      html: `
        <p>Halo ${user.name},</p>
        <p>Bukti pembayaran untuk transaksi <strong>${tx.id}</strong> telah diterima.</p>
        <p>Status saat ini: <strong>${tx.status}</strong></p>
        `,
    });

    return tx;
  }

  // konfirmasi transaksi:
  // 1. Dari WaitingConfirmation → Done
  // 2. Menggunakan State Pattern
  async confirmTransaction(txId: string) {
    const tx = await prisma.transaction.findUniqueOrThrow({
      where: { id: txId },
    });
    const context = new TransactionContext(tx.status);
    await context.next(txId); // transisi ke Done

    // kirim email selesai
    const updated = await prisma.transaction.findUniqueOrThrow({
      where: { id: txId },
    });
    const user = await authService.getProfile(updated.userId);
    await sendMail({
      to: user.email,
      subject: "Transaksi Selesai",
      html: `
        <p>Transaksi <strong>${updated.id}</strong> telah dikonfirmasi dan selesai.</p>`,
    });

    return updated;
  }

  // expire transaksi (job scheduler)
  // 1. Dari WaitingPayment atau WaitingConfirmation → Expired
  // 2. Menggunakan State Pattern
  async expireTransaction(txId: string) {
    const tx = await prisma.transaction.findUniqueOrThrow({
      where: { id: txId },
    });
    const context = new TransactionContext(tx.status);
    await context.expire(txId); //transisi ke Expired

    return await prisma.transaction.findUniqueOrThrow({ where: { id: txId } });
  }

  //   mendapatkan status dan detail transaksi
  async getStatus(txId: string) {
    return prisma.transaction.findUniqueOrThrow({
      where: { id: txId },
      select: {
        id: true,
        status: true,
        totalPrice: true,
        expiresAt: true,
        paymentProofUrl: true,
      },
    });
  }
}
