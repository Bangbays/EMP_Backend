import prisma from "../lib/prisma";
import { addMonths } from "date-fns";
import { sendEmail } from "../utils/email";

export const referralService = async (userId: string, code: string) => {
  const referrer = await prisma.user.findUnique({
    where: { referralCode: code },
  });
  if (!referrer) throw new Error("Kode referral tidak valid");

  // tambah 10.000 point ke referrer
  const expires = addMonths(new Date(), 3);
  await prisma.pointHistory.create({
    data: { userId: referrer.id, points: 10000, expiresAt: expires },
  });

  // buat coupon untuk user baru
  const couponCode = `WELCOME-${Date.now().toString(36).toUpperCase()}`;
  await prisma.coupon.create({
    data: {
      code: couponCode,
      discountAmount: 25000,
      userId,
      expiresAt: expires,
    },
  });

  // kirim email ke user baru
  await sendEmail({
    to: (await prisma.user.findUnique({ where: { id: userId } }))!.email,
    subject: "Voucher Selamat Datang",
    text: `Gunakan kupon ${couponCode} untuk diskon Rp 25.000, berlaku hingga ${expires.toDateString()}.`,
  });
};
