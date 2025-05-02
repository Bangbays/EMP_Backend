import bcrypt from "bcrypt";
import { prisma } from "../utils/prisma";
import { signToken } from "../utils/jwt";
import { IRegister, ILogin, IResponse, UserProfile } from "../interface/auth";

export async function register(payload: IRegister): Promise<IResponse> {
  const hashed = await bcrypt.hash(payload.password, 10);
  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashed,
      referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      role: "USER", // Default role
    },
  });

  // proses referral
  const accessToken = signToken(user.id);
  return { accessToken, refreshToken: accessToken };
}

export async function login(payload: ILogin): Promise<IResponse> {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  if (!user || !(await bcrypt.compare(payload.password, user.password))) {
    throw Object.assign(new Error("Invalid"), { statusCode: 401 });
  }
  const token = signToken(user.id);
  return { accessToken: token, refreshToken: token };
}

export async function getProfile(userId: string): Promise<UserProfile> {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as any,
    points: user.points,
    referralCode: user.referralCode,
  };
}
