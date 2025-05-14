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
