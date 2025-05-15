export interface IRegister {
  name: string;
  email: string;
  password: string;
  isOrganizer?: boolean;
  referralCode?: string;
  orgName?: string;
  orgDetail?: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IUserPayload {
  id: string;
  email: string;
  role: "CUSTOMER" | "ORGANIZER";
}