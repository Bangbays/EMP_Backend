import { prisma } from "../utils/prisma";
import { IEvent, ITicketType } from "../interface/event";

// list event dengan filter
export async function listEvents(filters: Partial<IEvent>) {
  return prisma.event.findMany({
    where: {
      AND: [
        filters.type ? { type: filters.type } : {},
        filters.location ? { location: { contains: filters.location } } : {},
        filters.startDate
          ? { startDate: { gte: new Date(filters.startDate) } }
          : {},
      ],
    },
    include: { ticketTypes: true },
  });
}

// ambil tiket dengan jenis tiket
export async function getEvent(id: string) {
  return prisma.event.findUniqueOrThrow({
    where: { id },
    include: { ticketTypes: true },
  });
}

export async function createEvent(
  organizerId: string,
  payload: IEvent
): Promise<any> {
  const { ticketTypes = [], imageURL, ...eventData } = payload;
  const event = await prisma.event.create({
    data: {
      ...eventData,
      organizerId,
      imageURL,
      ticketTypes: {
        create: (ticketTypes as ITicketType[]).map((t) => ({
          name: t.name,
          price: t.price,
          quota: t.quota,
        })),
      },
    },
    include: { ticketTypes: true },
  });
  return event;
}
