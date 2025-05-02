// untuk membuat event
export interface IEvent {
  id?: string;
  name: string;
  type: "concert" | "movie";
  location: string;
  startDate: string;
  endDate: string;
  description?: string;
  imageURL: string;
  organizerId: string;
  ticketTypes?: ITicketType[];
}

// detail event yang dikirimkan ke client
export interface EventDetail extends IEvent {
  id: string;
  organizerId: string;
  imageUrl: string;
  ticketTypes: TicketType[];
}

// jenis tiket
export interface TicketType {
  id: string;
  name: string;
  price: number;
  quota: number;
}

// untuk data membuat jenis tiket
export interface ITicketType {
  name: string;
  price: number;
  quota: number;
}
