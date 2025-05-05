// untuk membuat event
export interface IEvent {
  name: string;
  type: "concert" | "movie";
  location: string;
  startDate: string;
  endDate: string;
  description?: string;
  ticketTypes: { name: string; price: number; quota: number }[];
}

// detail event yang dikirimkan ke client
export interface EventDetail extends IEvent {
  id: string;
  organizerId: string;
  imageUrl: string;
}
