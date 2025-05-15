import prisma from "../lib/prisma";

export async function getUserPoints(userId: string) {
  const now = new Date();

  // ambil semua point yang belum expired
  const history = await prisma.pointHistory.findMany({
    where: { userId, expiresAt: { gt: now } },
    orderBy: { createdAt: "desc" },
    select: { id: true, points: true, createdAt: true, expiresAt: true },
  });

  // hitung total balance
  const balance = history.reduce((sum, entry) => sum + entry.points, 0);

  return { balance, history };
}

export async function getUserCoupons(userId: string) {
  const now = new Date();

  // ambil kupon yang belum dipakai dan belum expired
  const coupons = await prisma.coupon.findMany({
    where: { userId, isUsed: false, expiresAt: { gt: now } },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      code: true,
      discountAmount: true,
      createdAt: true,
      expiresAt: true,
    },
  });

  return coupons;
}
