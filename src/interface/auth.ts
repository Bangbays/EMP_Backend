// register
export interface IRegister {
  name: string;
  email: string;
  password: string;
  referralCode?: string;
}

// login
export interface ILogin {
  email: string;
  password: string;
}

// respon setelah berhasil login atau register
export interface IResponse {
  accessToken: string;
  refreshToken: string;
  user?: UserProfile;
}

// data profile
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "customer" | "organizer";
  points: number;
  referralCode: string;
}
