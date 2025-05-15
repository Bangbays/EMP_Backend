import prisma from "../lib/prisma";
import { IDashboard, DashboardStats } from "../types/dashboard";
import { parseISO, startOfDay, endOfDay } from "date-fns";
import { sendEmail } from "../utils/email";

export async function fetchDashboard(userId: string, query: any) {
  const { from, to, groupBy } = query as IDashboard;

  // total events
  const totalEvents = await prisma.event.count({
    where: { organizer: { userId } },
  });

  // total transaction
  const totalTransaction = await prisma.transaction.count({
    where: { event: { organizer: { userId } }, status: "DONE" },
  });

  // date filters
  const whereDate: any = {};
  if (from) whereDate.gte = parseISO(from);
  if (to) whereDate.lte = parseISO(to);
  const revenue = await prisma.$queryRaw`
    SELECT
    to_char("createdAt", ${
      groupBy === "day"
        ? "'YYYY-MM-DD'"
        : groupBy === "month"
        ? "'YYYY-MM'"
        : "'YYYY'"
    }) as period,
    SUM("totalPrice") as amount
    FROM "Transaction"
    WHERE "createdAt" BETWEEN ${startOfDay(
      parseISO(from || new Date().toISOString())
    )} AND ${endOfDay(parseISO(to || new Date().toISOString()))}
    AND "status" = "DONE"
    AND "eventId" IN (SELECT id FROM "Event" WHERE "organizerId" = ${userId})
    GROUP BY period
    ORDER BY period;
    `;
  return { totalEvents, totalTransaction, revenue };
}

export async function fethTransaction(userId: string) {
  return prisma.transaction.findMany({
    where: { event: { organizer: { userId } } },
    include: { user: true, event: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function processTransaction(txId: string, accept: boolean) {
  const tx = await prisma.transaction.update({
    where: { id: txId },
    data: { status: accept ? "DONE" : "CANCELLED" },
    include: { user: true, event: true },
  });

  if (!accept) {
    // kembalikan seat
    await prisma.event.update({
      where: { id: txId },
      data: { availableSeats: { increment: tx.quantity } },
    });

    // kembalikan point
    if (tx.pointsUsed && tx.pointsUsed > 0) {
      await prisma.pointHistory.create({
        data: {
          userId: tx.userId,
          points: -tx.pointsUsed,
          type: "DEBIT",
          expiresAt: new Date(),
        },
      });
      await prisma.user.update({
        where: { id: tx.userId },
        data: { points: { increment: tx.pointsUsed } },
      });
    }

    // kembalikan voucher
    if (tx.voucherId) {
      await prisma.coupon.update({
        where: { id: tx.voucherId },
        data: { isUsed: false, status: "ACTIVE" },
      });
    }
  }

  // kirim email
  const subject = accept ? "Pembayaran Diterima" : "Pembayaran Ditolak";
  const text = accept
    ? `Pembayaran untuk event ${tx.event.title} diterima.`
    : `Pembayaran untuk event ${tx.event.title} ditolak.`;

  await sendEmail({ to: tx.user.email, subject, text });
}

export async function fetchAttendees(eventId: string) {
  const txs = await prisma.transaction.findMany({
    where: { eventId, status: "DONE" },
    include: { user: true },
  });
  return txs.map((t) => ({
    name: t.user.name,
    quantity: t.quantity,
    total: t.totalPrice,
  }));
}
