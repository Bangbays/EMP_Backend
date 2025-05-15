export interface IUseReferral {
  referralCode: string;
}

export interface ICoupon {
  code: string;
}

export interface IProfile {
  name?: string;
  bio?: string;
}

export interface IChangePassword {
  oldPassword: string;
  newPassword: string;
}

export interface IResetPasswordRequest {
  email: string;
}

export interface IResetPassword {
  otp: string;
  newPassword: string;
}
