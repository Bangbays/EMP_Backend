import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";
import { generateReferralCode } from "../utils/generateReferral";
import { addDays } from "date-fns";
import { JWT_SECRET } from "../config";

export const register = async (dto: any) => {
  const {
    name,
    email,
    password,
    isOrganizer,
    referralCode: referredByCode,
    orgName,
    orgDetail,
  } = dto;

  // cek email
  if (await prisma.user.findUnique({ where: { email } })) {
    throw new Error("Email sudah terdaftar");
  }

  // hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // buat user (role customer)
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: "CUSTOMER",
      referralCode: generateReferralCode(),
      referredByCode,
    },
  });

  // jika referral valid, beri poin & buat voucher untuk referrer & user baru
  if (referredByCode) {
    const referrer = await prisma.user.findUnique({
      where: { referralCode: referredByCode },
    });

    if (!referrer) {
      throw new Error("Kode referral tidak valid");
    }

    // update poin referrer
    await prisma.user.update({
      where: { id: referrer.id },
      data: { points: { increment: 10000 } },
    });

    // buat voucher untuk referrer
    await prisma.voucher.create({
      data: {
        code: `REF-${generateReferralCode()}`,
        discount: 50000,
        validForm: new Date(),
        validUntil: addDays(new Date(), 30),
        ownerId: referrer.id,
      },
    });

    // beri point ke user baru
    await prisma.user.update({
      where: { id: user.id },
      data: { points: 2000 },
    });

    // buat voucher untuk user baru
    await prisma.voucher.create({
      data: {
        code: `WELCOME-${generateReferralCode()}`,
        discount: 25000,
        validForm: new Date(),
        validUntil: addDays(new Date(), 30),
        ownerId: user.id,
      },
    });
  }

  // daftar organizer, buat organizer profile
  if (isOrganizer && orgName && orgDetail) {
    await prisma.organizerProfile.create({
      data: { userId: user.id, orgName, orgDetail },
    });
  }

  // generate jwt
  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET!, {
    expiresIn: "3d",
  });

  return { user, token };
};

export const login = async (dto: any) => {
  const { email, password } = dto;

  // cari user dari email
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Email atau password salah");
  }

  // verifikasi password
  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    throw new Error("Email atau password salah");
  }

  // generate jwt
  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET!, {
    expiresIn: "3d",
  });

  return { user, token };
};
