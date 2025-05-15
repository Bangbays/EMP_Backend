export interface ICoupon {
  id: string;
  code: string;
  discountAmount: number;
  createdAt: Date;
  expiresAt: Date;
}
