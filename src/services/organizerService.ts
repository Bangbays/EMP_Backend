import { prisma } from "../utils/prisma";
import { OrganizerForm } from "../interface/organizer";

export async function applyOrganizer(userId: string, payload: OrganizerForm) {
  return prisma.organizerRequest.create({
    data: { userId, ...payload, status: "pending" },
  });
}

export async function getStatus(userId: string) {
  const req = await prisma.organizerRequest.findFirst({ where: { userId } });
  return { status: req?.status || "none" };
}
